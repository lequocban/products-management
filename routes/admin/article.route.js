const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();

const controllers = require("../../controllers/admin/article.controller");
const validate = require("../../validates/admin/article.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

router.get("/", controllers.index);

router.patch("/change-status/:status/:id", controllers.changeStatus);
router.patch("/change-multi", controllers.changeMulti);
router.delete("/delete/:id", controllers.deleteItem);

router.get("/create", controllers.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controllers.createPost,
);

router.get("/edit/:id", controllers.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controllers.editPatch,
);

router.get("/detail/:id", controllers.detail);

module.exports = router;
