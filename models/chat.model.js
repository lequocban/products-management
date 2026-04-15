const { default: mongoose } = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rom_chat_id: String,
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
