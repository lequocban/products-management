const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const controllers = require("../../controllers/admin/account.controller");
const validate = require("../../validates/admin/account.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controllers.index);

router.get("/create", controllers.create);
router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.createPost,
  controllers.createPost,
);

router.get("/detail/:id", controllers.detail);

router.patch("/change-status/:status/:id", controllers.changeStatus);

router.get("/edit/:id", controllers.edit);
router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.editPatch,
  controllers.editPatch,
);

router.delete("/delete/:id", controllers.deleteItem);


module.exports = router;
