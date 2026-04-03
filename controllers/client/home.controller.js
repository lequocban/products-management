const Product = require("../../models/product.model");

const productsHelper = require("../../helper/product");
// [GET]  /
module.exports.index = async (req, res) => {
  // featured products
  const productsFeatured = await Product.find({
    featured: "1",
    status: "active",
    deleted: false,
  })
    .sort({ position: "desc" })
    .limit(6);
  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);
  // end featured products

  // new product
  const productsNew = await Product.find({
    status: "active",
    deleted: false,
  })
    .sort({ position: "desc" })
    .limit(6);

  const newProductsNew = productsHelper.priceNewProducts(productsNew);

  // end new product
  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
  });
};
