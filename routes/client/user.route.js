const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/client/user.controller");
const validates = require("../../validates/client/user.validate");

router.get("/register", controllers.register);

router.post("/register", validates.registerPost, controllers.registerPost);

router.get("/login", controllers.login);

router.post("/login", validates.loginPost, controllers.loginPost);

router.get("/logout", controllers.logout);

module.exports = router;
