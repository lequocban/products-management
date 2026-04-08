const Order = require("../../models/order.model");

const productsHelper = require("../../helper/product");

// [GET] /orders
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;

    // 1. Tìm tất cả đơn hàng của khách này, sắp xếp theo thời gian mới nhất (createdAt: "desc")
    const orders = await Order.find({ cart_id: cartId })
      .sort({ createdAt: "desc" })
      .lean();

    // 2. Tính tổng tiền cho từng đơn hàng để hiển thị ra bảng danh sách
    for (const order of orders) {
      for (const product of order.products) {
        product.newPrice = productsHelper.priceNewProduct(product);
        product.totalPrice = (product.newPrice * product.quantity).toFixed(2);
      }

      order.totalPrice = order.products
        .reduce((total, item) => {
          return total + parseFloat(item.totalPrice);
        }, 0)
        .toFixed(2);
    }

    // 3. Render ra giao diện
    res.render("client/pages/orders/index", {
      pageTitle: "Đơn hàng của tôi",
      orders: orders,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể lấy danh sách đơn hàng!");
    res.redirect(req.headers.referer);
  }
};

// [GET] /orders/detail/:orderId
module.exports.detail = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const cartId = req.cookies.cartId;

    // 1. Tìm đơn hàng. BẮT BUỘC phải check thêm điều kiện cart_id để bảo mật
    const order = await Order.findOne({
      _id: orderId,
      cart_id: cartId, // Chống việc user đổi ID trên URL để xem trộm đơn người khác
    })
      .populate("products.product_id") // Móc nối DB để lấy hình ảnh, tên sản phẩm
      .lean();

    // Nếu không tìm thấy đơn hàng hoặc đơn hàng không phải của user này
    if (!order) {
      req.flash(
        "error",
        "Đơn hàng không tồn tại hoặc bạn không có quyền truy cập!",
      );
      return res.redirect("/orders");
    }

    // 2. Render ra giao diện
    res.render("client/pages/orders/detail", {
      pageTitle: "Chi tiết đơn hàng",
      order: order,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect("/orders");
  }
};
