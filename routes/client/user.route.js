const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const authMiddleware = require("../../middlewares/client/auth.middleware");
const controllers = require("../../controllers/client/user.controller");
const validates = require("../../validates/client/user.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/register", controllers.register);

router.post("/register", validates.registerPost, controllers.registerPost);

router.get("/register/otp", controllers.otpRegister);

router.post("/register/otp", controllers.otpRegisterPost);

router.get("/login", controllers.login);

router.post("/login", validates.loginPost, controllers.loginPost);

router.get("/logout", controllers.logout);

router.get("/password/forgot", controllers.forgotPassword);

router.post(
  "/password/forgot",
  validates.forgotPassword,
  controllers.forgotPasswordPost,
);

router.get("/password/otp", controllers.otpPassword);

router.post("/password/otp", controllers.otpPasswordPost);

router.get("/password/reset", controllers.resetPassword);

router.post(
  "/password/reset",
  validates.resetPassword,
  controllers.resetPasswordPost,
);

router.get("/info", authMiddleware.requireAuth, controllers.info);

router.get("/edit", authMiddleware.requireAuth, controllers.edit);

router.patch(
  "/edit",
  authMiddleware.requireAuth,
  upload.single("avatar"),
  uploadCloud.upload,
  validates.editPatch,
  controllers.editPatch,
);

router.get("/password/change", authMiddleware.requireAuth, controllers.changePassword);

router.post("/password/change", authMiddleware.requireAuth, controllers.changePasswordPost);

module.exports = router;
