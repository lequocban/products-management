const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/client/chat.controller");

const chatMiddleware = require("../../middlewares/client/chat.middleware");

router.post(
  "/:roomChatId/members/add",
  chatMiddleware.isAccess,
  controllers.addMembers,
);

router.post(
  "/:roomChatId/members/:userId/promote",
  chatMiddleware.isAccess,
  controllers.promoteMember,
);

router.post(
  "/:roomChatId/delete",
  chatMiddleware.isAccess,
  controllers.deleteRoom,
);

router.get("/:roomChatId", chatMiddleware.isAccess, controllers.index);
module.exports = router;
