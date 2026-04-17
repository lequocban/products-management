const Chat = require("../../models/chat.model");

const uploadToCloudinary = require("../../helper/uploadToCloudinary");

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("CLIENT_JOIN_ROOM", (roomChatId) => {
      if (!roomChatId) {
        return;
      }

      socket.join(roomChatId);
    });

    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      try {
        const userId = data.userId;
        const fullName = data.fullName;
        const roomChatId = data.roomChatId;
        const content = typeof data.content === "string" ? data.content : "";

        if (!userId) {
          socket.emit("SERVER_MESSAGE_ERROR", {
            message: "Thiếu thông tin người gửi.",
          });
          return;
        }

        if (!roomChatId) {
          socket.emit("SERVER_MESSAGE_ERROR", {
            message: "Thiếu thông tin phòng chat.",
          });
          return;
        }

        socket.join(roomChatId);

        const images = [];
        const rawImages = Array.isArray(data.images) ? data.images : [];

        for (const rawImage of rawImages) {
          let imageBuffer = null;

          if (Buffer.isBuffer(rawImage)) {
            imageBuffer = rawImage;
          } else if (Array.isArray(rawImage)) {
            imageBuffer = Buffer.from(rawImage);
          } else if (
            rawImage &&
            rawImage.type === "Buffer" &&
            Array.isArray(rawImage.data)
          ) {
            imageBuffer = Buffer.from(rawImage.data);
          }

          if (!imageBuffer) {
            continue;
          }

          const link = await uploadToCloudinary(imageBuffer);
          images.push(link);
        }

        if (content.trim() === "" && images.length === 0) {
          return;
        }

        // lưu vào db
        const chat = new Chat({
          user_id: userId,
          room_chat_id: roomChatId,
          content: content,
          images: images,
        });
        await chat.save();

        // trả về client
        io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
          userId: userId,
          fullName: fullName,
          content: content,
          images: images,
        });
      } catch (error) {
        console.error("Lỗi gửi tin nhắn:", error);
        socket.emit("SERVER_MESSAGE_ERROR", {
          message: "Gửi tin nhắn thất bại, vui lòng thử lại.",
        });
      }
    });

    socket.on("CLIENT_SEND_TYPING", (data) => {
      if (!data || !data.userId || !data.fullName || !data.roomChatId) {
        return;
      }

      socket.to(data.roomChatId).emit("SERVER_RETURN_TYPING", {
        userId: data.userId,
        fullName: data.fullName,
        type: data.type,
      });
    });
  });
};
