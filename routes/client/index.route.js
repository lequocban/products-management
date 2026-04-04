const productsRoutes = require("./products.route");
const articlesRoutes = require("./article.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use("/", homeRoutes);

  app.use("/products", productsRoutes);

  app.use("/articles", articlesRoutes);
  
  app.use("/search", searchRoutes);
};
