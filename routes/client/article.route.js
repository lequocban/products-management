const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/client/article.controller")

router.get("/", controllers.index);

router.get("/:slugCategory", controllers.category);

router.get("/detail/:slugArticle", controllers.detail);

module.exports = router;