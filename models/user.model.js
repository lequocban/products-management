const { default: mongoose } = require("mongoose");
const generate = require("../helper/generate");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
      type: String,
      default: generate.generateRandomString(20),
    },
    phone: String,
    avatar: String,
    friendList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      room_chat_id: String,
    },
    acceptFriends: Array,
    requestFriends: Array,
    status: {
      type: String,
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
    updatedBy: [
      {
        account_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
        },
        updatedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model("User", userSchema, "users");

module.exports = User;
