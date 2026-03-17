const express = require("express");
const multer = require("multer");
const storageMulter = require("../../helper/storageMulter");
const upload = multer({ storage: storageMulter() });
const router = express.Router();

const controllers = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");

router.get("/", controllers.index);

router.patch("/change-status/:status/:id", controllers.changeStatus);
router.patch("/change-multi", controllers.changeMulti);
router.delete("/delete/:id", controllers.deleteItem);

router.get("/create", controllers.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  validate.createPost,
  controllers.createPost,
);

router.get("/edit/:id", controllers.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  validate.createPost,
  controllers.editPatch,
);

router.get("/detail/:id", controllers.detail);

module.exports = router;
