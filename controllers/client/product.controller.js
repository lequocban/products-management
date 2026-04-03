const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productsHelper = require("../../helper/product");
const productsCategoryHelper = require("../../helper/productCategory");

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

// [GET]  /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slugProduct,
      deleted: false,
      status: "active",
    }).populate({
      path: "product_category_id",
      select: "title slug",
      match: { deleted: false, status: "active" },
    });
    if (product) {
      product.newPrice = productsHelper.priceNewProduct(product);
    }
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(req.headers.referer);
  }
};

// [GET]  /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slugCategory,
      status: "active",
      deleted: false,
    });

    if (!category) {
      return res.redirect("/");
    }

    const listSubCategory = await productsCategoryHelper.getSubCategory(
      category.id,
    );
    const listSubCategoryId = listSubCategory.map((item) => item.id);
    const listCategoryId = [category.id, ...listSubCategoryId];
    const products = await Product.find({
      product_category_id: { $in: listCategoryId },
      status: "active",
      deleted: false,
    }).sort({ position: "desc" });

    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: newProducts,
    });
  } catch (error) {
    res.redirect(req.headers.referer);
  }
};
