const { default: mongoose } = require("mongoose");

const roomChatSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    typeRoom: String,
    status: String,
    users: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: String,
      },
    ],
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
const RoomChat = mongoose.model("RoomChat", roomChatSchema, "rooms-chat");

module.exports = RoomChat;
