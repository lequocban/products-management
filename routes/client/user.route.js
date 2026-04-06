const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/client/user.controller");
const validates = require("../../validates/client/user.validate");

router.get("/register", controllers.register);

router.post("/register", validates.registerPost, controllers.registerPost);

module.exports = router;
