const Cart = require("../../models/cart.model");

const productsHelper = require("../../helper/product");

// [GET]  /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
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
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);

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
};
