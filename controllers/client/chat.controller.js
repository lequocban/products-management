const Chat = require("../../models/chat.model");
// [GET] /chat
module.exports.index = async (req, res) => {
  // lấy data
  const chats = await Chat.find({
    deleted: false,
  }).populate("user_id", "fullName");

  // end lấy data
  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
  });
};
