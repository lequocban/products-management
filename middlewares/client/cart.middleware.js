const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  try {
    // 1. Kiểm tra xem người dùng đã có cookie cartId chưa
    if (req.cookies.cartId) {
      const cart = await Cart.findOne({ _id: req.cookies.cartId });

      if (cart) {
        // Có giỏ hàng -> Tính tổng số lượng hiển thị lên Header
        cart.totalQuantity = cart.products.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        res.locals.miniCart = cart;
      } else {
        // Trường hợp có Cookie nhưng Giỏ hàng trong DB đã bị Admin xóa mất
        res.locals.miniCart = { totalQuantity: 0 };
      }
    } else {
      // 2. KHÔNG CÓ COOKIE -> KHÔNG TẠO MỚI (Lazy Creation)
      // Chỉ gán số lượng = 0 để đẩy ra giao diện pug
      res.locals.miniCart = { totalQuantity: 0 };
    }

    next();
  } catch (error) {
    console.log(error);
    next();
  }
};
