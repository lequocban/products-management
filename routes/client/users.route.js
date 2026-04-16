const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/client/users.controller");

router.get("/not-friends", controllers.notFriends);
router.get("/requests", controllers.requests);
router.get("/accept", controllers.accept);
module.exports = router;
