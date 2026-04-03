const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/client/product.controller")

router.get("/", controllers.index);

router.get("/:slugCategory", controllers.category);

router.get("/detail/:slugProduct", controllers.detail);

module.exports = router;