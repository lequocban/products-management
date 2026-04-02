const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const controllers = require("../../controllers/admin/my-account.controller");
const validate = require("../../validates/admin/account.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controllers.index);

router.get("/edit", controllers.edit);
router.patch(
  "/edit",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.editPatch,
  controllers.editPatch,
);

module.exports = router;
