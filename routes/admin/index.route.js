const systemConfig = require("../../config/system");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const articleRoutes = require("./article.route");
const articleCategoryRoutes = require("./article-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const MyAccountRoutes = require("./my-account.route");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRoutes,
  );
  app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRoutes);

  app.use(
    PATH_ADMIN + "/products-category",
    authMiddleware.requireAuth,
    productCategoryRoutes,
  );

  app.use(PATH_ADMIN + "/articles", authMiddleware.requireAuth, articleRoutes);

  app.use(
    PATH_ADMIN + "/articles-category",
    authMiddleware.requireAuth,
    articleCategoryRoutes,
  );

  app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoutes);

  app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoutes);

  app.use(PATH_ADMIN + "/auth", authRoutes);

  app.use(
    PATH_ADMIN + "/my-account",
    authMiddleware.requireAuth,
    MyAccountRoutes,
  );
};
