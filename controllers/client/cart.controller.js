const Cart = require("../../models/cart.model");

const productsHelper = require("../../helper/product");

// [GET]  /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  if (!cartId) {
    return res.render("client/pages/cart/index", {
      pageTitle: "Giỏ hàng",
      cart: { products: [], totalPrice: 0 },
    });
  }
  const cart = await Cart.findOne({ _id: cartId }).populate(
    "products.product_id",
  );

  for (const item of cart.products) {
    item.product_id.newPrice = productsHelper.priceNewProduct(item.product_id);
    item.totalPrice = (item.product_id.newPrice * item.quantity).toFixed(2);
  }

  cart.totalPrice = cart.products.reduce((total, item) => {
    return total + parseFloat(item.totalPrice);
  }, 0);

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cart: cart,
  });
};

// [POST]  /cart/add/:productId
module.exports.addPost = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    if (!cartId) {
      // Tạo giỏ hàng mới trong DB
      const cart = new Cart();
      await cart.save();

      // Gán cookie cho trình duyệt
      const expiresTime = 1000 * 60 * 60 * 24 * 365; // 1 năm
      res.cookie("cartId", cart.id, {
        expires: new Date(Date.now() + expiresTime),
      });

      // Cập nhật lại biến cartId bằng ID vừa tạo để dùng ở bước dưới
      cartId = cart.id;
    }

    const cart = await Cart.findOne({ _id: cartId });

    const existProductInCart = cart.products.find(
      (item) => item.product_id == productId,
    );

    if (existProductInCart) {
      const newQuantity = quantity + existProductInCart.quantity;
      await Cart.updateOne(
        {
          _id: cartId,
          "products.product_id": productId,
        },
        {
          "products.$.quantity": newQuantity,
        },
      );
    } else {
      const objectCart = {
        product_id: productId,
        quantity: quantity,
      };
      await Cart.updateOne(
        {
          _id: cartId,
        },
        {
          $push: { products: objectCart },
        },
      );
    }

    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công!");
    res.redirect(req.headers.referer);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    req.flash("error", "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
    res.redirect(req.headers.referer);
  }
};

// [GET]  /cart/delete/:productId
module.exports.delete = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;

    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $pull: { products: { product_id: productId } },
      },
    );

    req.flash("success", "Xóa sản phẩm khỏi giỏ hàng thành công!");
    res.redirect(req.headers.referer);
  } catch (error) {
    console.error("Error deleting product from cart:", error);
    req.flash("error", "Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng.");
    res.redirect(req.headers.referer);
  }
};

// [GET]  /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.params.quantity); 
    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        "products.$.quantity": quantity,
      },
    );
    req.flash("success", "Cập nhật số lượng sản phẩm trong giỏ hàng thành công!");
    res.redirect(req.headers.referer);

  } catch (error) {
    console.error("Error updating product quantity in cart:", error);
    req.flash(
      "error",
      "Đã xảy ra lỗi khi cập nhật số lượng sản phẩm trong giỏ hàng.",
    );
    res.redirect(req.headers.referer);
  }
};
