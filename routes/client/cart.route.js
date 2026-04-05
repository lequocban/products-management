const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/client/cart.controller");

router.get("/", controllers.index);

router.post("/add/:productId", controllers.addPost);

router.get("/delete/:productId", controllers.delete);

router.get("/update/:productId/:quantity", controllers.update);
module.exports = router;