const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controllers = require("../../controllers/admin/setting.controller");

router.get("/general", controllers.general);

router.patch(
  "/general",
  upload.single("WebsiteLogo"),
  uploadCloud.upload,
  controllers.generalPatch,
);

module.exports = router;
