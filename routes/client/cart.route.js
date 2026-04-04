const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/client/cart.controller");

router.post("/add/:productId", controllers.addPost);

module.exports = router;