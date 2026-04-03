const Article = require("../../models/article.model");
const systemConfig = require("../../config/system");

// [GET]  /articles
module.exports.index = async (req, res) => {
  const lstArticle = await Article.find({
    status: "active",
    deleted: false,
  })
    .sort({ position: "desc" })
    .populate("article_category_id", "title");


  res.render("client/pages/articles/index", {
    pageTitle: "Trang sản phẩm",
    articles: lstArticle,
  });
};

// [GET]  /articles/:slug
module.exports.detail = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      deleted: false,
      status: "active",
    });

    res.render("client/pages/articles/detail", {
      pageTitle: article.title,
      article: article,
    });
  } catch (error) {
    res.redirect(`/articles`);
  }
};
