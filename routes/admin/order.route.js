const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/admin/order.controller");

router.get("/", controllers.index);

router.patch("/change-status/:status/:id", controllers.changeStatus);
router.patch("/change-multi", controllers.changeMulti);
router.delete("/delete/:id", controllers.deleteItem);

router.get("/detail/:id", controllers.detail);


module.exports = router;
