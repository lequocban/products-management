const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/client/chat.controller");

router.get("/:roomChatId", controllers.index);
module.exports = router;
