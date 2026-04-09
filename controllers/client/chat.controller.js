const Chat = require("../../models/chat.model");

// [GET] /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  // socket io
  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      // lưu vào db
      const chat = new Chat({
        user_id: userId,
        content: content,
      });
      await chat.save();

      // trả về client
      _io.emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: content,
      });
    });
  });
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
