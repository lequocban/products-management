const Chat = require("../../models/chat.model");
// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  const roomChatId = req.params.roomChatId;

  // lấy data
  const chats = await Chat.find({
    room_chat_id: roomChatId,
    deleted: false,
  }).populate("user_id", "fullName");

  // end lấy data
  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    roomChatId: roomChatId,
    chats: chats,
  });
};
