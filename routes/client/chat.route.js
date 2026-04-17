const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/client/chat.controller");

const chatMiddleware = require("../../middlewares/client/chat.middleware");

router.get("/:roomChatId", chatMiddleware.isAccess, controllers.index);
module.exports = router;
