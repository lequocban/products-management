const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/client/home.controller");

router.get("", controllers.index);

module.exports = router;
