const Chat = require("../../models/chat.model");

const uploadToCloudinary = require("../../helper/uploadToCloudinary");

module.exports = async (res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      console.log("Dữ liệu nhận từ client:", data);
      const images = [];
      for (const imageBuffer of data.images) {
        const link = await uploadToCloudinary(imageBuffer);
        images.push(link);
      }

      // lưu vào db
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images,
      });
      await chat.save();

      // trả về client
      _io.emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: images,
      });
    });

    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      });
    });
  });
};
