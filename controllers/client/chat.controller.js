const Chat = require("../../models/chat.model");

const chatSocket = require("../../sockets/client/chat.socket");
// [GET] /chat
module.exports.index = async (req, res) => {
  // socket io
  chatSocket(res);
  // end socket io

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
