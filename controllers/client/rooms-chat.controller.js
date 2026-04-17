const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

// [GET] /rooms-chat
module.exports.index = async (req, res) => {
  res.render("client/pages/rooms-chat/index", {
    pageTitle: "Danh sách phòng chat",
  });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendsList = res.locals.user.friendList || [];

  for (const friend of friendsList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id,
    }).select("id fullName avatar");

    friend.infoFriend = infoFriend;
  }

  res.render("client/pages/rooms-chat/create", {
    pageTitle: "Tạo phòng chat",
    friendsList: friendsList,
  });
};

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersId = req.body.usersId;

  const dataChat = {
    title: title,
    typeRoom: "group",
    users: [],
  };

  usersId.forEach((userId) => {
    dataChat.users.push({
      user_id: userId,
      role: "user",
    });
  });

  dataChat.users.push({
    user_id: res.locals.user._id,
    role: "superAdmin",
  });

  const room = new RoomChat(dataChat);
  await room.save();

  console.log(dataChat)
  res.redirect(`/chat/${room._id}`);
};
