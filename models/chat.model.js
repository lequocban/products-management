const { default: mongoose } = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    room_chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomChat",
    },
    content: String,
    images: Array,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);
const Chat = mongoose.model("Chat", chatSchema, "chats");

module.exports = Chat;
