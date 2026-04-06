const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const productsHelper = require("../../helper/product");

// [GET] /checkout
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;

    // 1. Lấy danh sách ID sản phẩm được check từ URL (?id=...&id=...)
    let selectedIds = req.query.id;

    // Nếu người dùng không chọn gì mà cố tình gõ URL /checkout, đá về giỏ hàng
    if (!selectedIds) {
      req.flash("error", "Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return res.redirect("/cart");
    }
    // Nếu có nhiều id (?id=abc&id=xyz), nó sẽ tự thành Array.
    // quy chuẩn về Array hết cho dễ xử lý.
    if (!Array.isArray(selectedIds)) {
      selectedIds = [selectedIds];
    }

    const cart = await Cart.findOne({ _id: cartId }).populate(
      "products.product_id",
    );

    // 2. LỌC GIỎ HÀNG: Chỉ giữ lại những item có product_id nằm trong mảng selectedIds
    cart.products = cart.products.filter((item) =>
      selectedIds.includes(item.product_id._id.toString()),
    );

    // 3. Tính toán tiền
    for (const item of cart.products) {
      item.product_id.newPrice = productsHelper.priceNewProduct(
        item.product_id,
      );
      item.totalPrice = (item.product_id.newPrice * item.quantity).toFixed(2);
    }

    cart.totalPrice = cart.products
      .reduce((total, item) => {
        return total + parseFloat(item.totalPrice);
      }, 0)
      .toFixed(2);

    res.render("client/pages/checkout/index", {
      title: "Đặt hàng",
      cartDetail: cart,
    });
  } catch (error) {
    console.log(error);
    res.redirect(req.headers.referer);
  }
};

// [POST] /checkout/order
module.exports.order = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    // 1. Lấy danh sách ID sản phẩm từ form gửi lên
    let productIds = req.body.productIds;
    if (!productIds) {
      req.flash("error", "Không có sản phẩm nào để đặt hàng!");
      return res.redirect("back");
    }

    // Đưa về dạng mảng (nếu chỉ có 1 sản phẩm thì req.body trả về chuỗi, ta ép thành mảng)
    if (!Array.isArray(productIds)) {
      productIds = [productIds];
    }

    // 2. Tìm giỏ hàng hiện tại của user
    const cart = await Cart.findOne({ _id: cartId });

    // 3. Chuẩn bị mảng products để lưu vào bảng Order
    const productsOrder = [];

    for (const productId of productIds) {
      // Tìm thông tin sản phẩm trong giỏ hàng để lấy số lượng (quantity)
      const itemInCart = cart.products.find(
        (item) => item.product_id == productId,
      );

      // Lấy giá trị gốc của sản phẩm từ Database (bảo mật, không tin tưởng giá từ Frontend gửi lên)
      const productInfo = await Product.findOne({ _id: productId }).select(
        "price discountPercentage",
      );

      if (itemInCart && productInfo) {
        // Tạo object chứa thông tin cần lưu cho 1 sản phẩm trong hóa đơn
        const objectProduct = {
          product_id: productId,
          price: productInfo.price,
          discountPercentage: productInfo.discountPercentage,
          quantity: itemInCart.quantity,
        };
        productsOrder.push(objectProduct);
      }
    }

    // 4. Lưu vào Database bảng Order
    const order = new Order({
      cart_id: cartId,
      user_info: userInfo,
      products: productsOrder,
    });
    await order.save();

    // 5. XÓA CÁC SẢN PHẨM ĐÃ ĐẶT KHỎI GIỎ HÀNG
    await Cart.updateOne(
      { _id: cartId },
      {
        $pull: { products: { product_id: { $in: productIds } } },
      },
    );

    // 6. Chuyển hướng người dùng đến trang báo thành công
    req.flash("success", "Đặt hàng thành công!");
    res.redirect(`/checkout/success/${order.id}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Có lỗi xảy ra, vui lòng thử lại!");
    res.redirect(req.headers.referer);
  }
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findOne({ _id: orderId }).populate(
      "products.product_id",
      "title thumbnail",
    );

    for (const product of order.products) {
      product.newPrice = productsHelper.priceNewProduct(product);
      product.totalPrice = (product.newPrice * product.quantity).toFixed(2);
    }

    order.totalPrice = order.products
      .reduce((total, item) => {
        return total + parseFloat(item.totalPrice);
      }, 0)
      .toFixed(2);

    res.render("client/pages/checkout/success", {
      title: "Đặt hàng thành công",
      order: order,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không tìm thấy đơn hàng!");
    res.redirect("/");
  }
};
