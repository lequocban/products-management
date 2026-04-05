const Cart = require("../../models/cart.model");
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