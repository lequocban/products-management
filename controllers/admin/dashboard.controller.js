const CategoryProduct = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const CategoryArticle = require("../../models/article-category.model");
const Article = require("../../models/article.model");

// [GET]  /admin/dashboard
module.exports.dashboard = async (req, res) => {
  const statistic = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    categoryArticle: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    article: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };
  // Thống kê Category Product
  statistic.categoryProduct.total = await CategoryProduct.countDocuments({
    deleted: false,
  });
  statistic.categoryProduct.active = await CategoryProduct.countDocuments({
    deleted: false,
    status: "active",
  });
  statistic.categoryProduct.inactive = await CategoryProduct.countDocuments({
    deleted: false,
    status: "inactive",
  });

  // Thống kê Product
  statistic.product.total = await Product.countDocuments({
    deleted: false,
  });
  statistic.product.active = await Product.countDocuments({
    deleted: false,
    status: "active",
  });
  statistic.product.inactive = await Product.countDocuments({
    deleted: false,
    status: "inactive",
  });

  // Thống kê Account
  statistic.account.total = await Account.countDocuments({
    deleted: false,
  });
  statistic.account.active = await Account.countDocuments({
    deleted: false,
    status: "active",
  });
  statistic.account.inactive = await Account.countDocuments({
    deleted: false,
    status: "inactive",
  });

  // Thống kê User
  statistic.user.total = await User.countDocuments({
    deleted: false,
  });
  statistic.user.active = await User.countDocuments({
    deleted: false,
    status: "active",
  });
  statistic.user.inactive = await User.countDocuments({
    deleted: false,
    status: "inactive",
  });

  // Thống kê Category Article
  statistic.categoryArticle.total = await CategoryArticle.countDocuments({
    deleted: false,
  });
  statistic.categoryArticle.active = await CategoryArticle.countDocuments({
    deleted: false,
    status: "active",
  });
  statistic.categoryArticle.inactive = await CategoryArticle.countDocuments({
    deleted: false,
    status: "inactive",
  });

  // Thống kê Article
  statistic.article.total = await Article.countDocuments({
    deleted: false,
  });
  statistic.article.active = await Article.countDocuments({
    deleted: false,
    status: "active",
  });
  statistic.article.inactive = await Article.countDocuments({
    deleted: false,
    status: "inactive",
  });

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    statistic: statistic,
  });
};
