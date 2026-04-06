const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/client/order.controller");

router.get("/", controllers.index);

router.get("/detail/:orderId", controllers.detail);

module.exports = router;