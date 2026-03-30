const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/admin/auth.controller");
const validate = require("../../validates/admin/auth.validate");

router.get("/login", controllers.login);
router.post("/login", validate.loginPost, controllers.loginPost);

module.exports = router;
