const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/client/auth.middleware"); 
const controllers = require("../../controllers/client/user.controller");
const validates = require("../../validates/client/user.validate");

router.get("/register", controllers.register);

router.post("/register", validates.registerPost, controllers.registerPost);

router.get("/login", controllers.login);

router.post("/login", validates.loginPost, controllers.loginPost);

router.get("/logout", controllers.logout);

router.get("/password/forgot", controllers.forgotPassword);

router.post("/password/forgot", validates.forgotPassword, controllers.forgotPasswordPost);

router.get("/password/otp", controllers.otpPassword);

router.post("/password/otp", controllers.otpPasswordPost);

router.get("/password/reset", controllers.resetPassword);

router.post("/password/reset", validates.resetPassword, controllers.resetPasswordPost);

router.get("/info", authMiddleware.requireAuth, controllers.info);

module.exports = router;
