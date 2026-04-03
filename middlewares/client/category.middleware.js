const ProductCategory = require("../../models/product-category.model");
const ArticleCategory = require("../../models/article-category.model");

const createTreeHelper = require("../../helper/createTree");

module.exports.category = async (req, res, next) => {
  const productsCategory = await ProductCategory.find({
    deleted: false,
    status: "active",
  });
  const newProductsCategory = createTreeHelper.createTree(productsCategory);
  res.locals.layoutProductsCategory = newProductsCategory;

  const articlesCategory = await ArticleCategory.find({
    deleted: false,
    status: "active",
  });
  const newArticlesCategory = createTreeHelper.createTree(articlesCategory);
  res.locals.layoutArticlesCategory = newArticlesCategory;
  next();
};
