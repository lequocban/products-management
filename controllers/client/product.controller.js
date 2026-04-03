const Product = require("../../models/product.model");

const productsHelper = require("../../helper/product");

// [GET]  /products
module.exports.index = async (req, res) => {
  const lstProduct = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(lstProduct);

  res.render("client/pages/products/index", {
    pageTitle: "Trang sản phẩm",
    products: newProducts,
  });
};

// [GET]  /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      deleted: false,
      status: "active",
    });
    if (product) {
      product.newPrice = (
        (product.price * (100 - product.discountPercentage)) /
        100
      ).toFixed(2);
    }
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(req.headers.referer);
  }
};
