const Article = require("../../models/article.model");
const ArticleCategory = require("../../models/article-category.model");

const articlesCategoryHelper = require("../../helper/articleCategory");

// [GET]  /articles
module.exports.index = async (req, res) => {
  try {
    // 1. Bài viết nổi bật
    const articlesFeatured = await Article.find({
      deleted: false,
      status: "active",
      featured: "1",
    })
      .sort({ position: "desc" })
      .limit(6);

    // 2. Bài viết mới nhất cho Sidebar
    const articlesNew = await Article.find({
      deleted: false,
      status: "active",
    })
      .sort({ position: "desc" })
      .limit(5);

    // 3. Toàn bộ danh sách bài viết
    const articles = await Article.find({
      deleted: false,
      status: "active",
    }).sort({ position: "desc" });

    res.render("client/pages/articles/index", {
      pageTitle: "Tin tức",
      articlesFeatured: articlesFeatured,
      articlesNew: articlesNew,
      articles: articles,
    });
  } catch (error) {
    res.redirect("back");
  }
};

// [GET]  /articles/detail/:slugArticle
module.exports.detail = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slugArticle,
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

// [GET]  /articles/:slugCategory
module.exports.category = async (req, res) => {
  try {
    // 1. Bài viết nổi bật
    const articlesFeatured = await Article.find({
      deleted: false,
      status: "active",
      featured: "1",
    })
      .sort({ position: "desc" })
      .limit(6);

    // 2. Bài viết mới nhất cho Sidebar
    const articlesNew = await Article.find({
      deleted: false,
      status: "active",
    })
      .sort({ position: "desc" })
      .limit(5);

    // 3. Toàn bộ danh sách bài viết theo danh mục
    const category = await ArticleCategory.findOne({
      slug: req.params.slugCategory,
      status: "active",
      deleted: false,
    });

    if (!category) {
      return res.redirect("/");
    }

    const listSubCategory = await articlesCategoryHelper.getSubCategory(
      category.id,
    );
    const listSubCategoryId = listSubCategory.map((item) => item.id);
    const listCategoryId = [category.id, ...listSubCategoryId];
    const articles = await Article.find({
      article_category_id: { $in: listCategoryId },
      status: "active",
      deleted: false,
    }).sort({ position: "desc" });

    res.render("client/pages/articles/index", {
      pageTitle: category.title,
      articlesFeatured: articlesFeatured,
      articlesNew: articlesNew,
      articles: articles,
    });
  } catch (error) {
    res.redirect("back");
  }
};
