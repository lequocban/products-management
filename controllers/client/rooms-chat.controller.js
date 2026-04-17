const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

// [GET] /rooms-chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;

  const listRoomChat = await RoomChat.find({
    "users.user_id": userId,
    typeRoom: "group",
    deleted: false,
  });

  const currentUser = await User.findOne({ _id: userId })
    .select("friendList")
    .lean();

  const friendList = currentUser?.friendList || [];
  const friendIds = friendList.map((item) => item.user_id);

  const listPrivateChatUsers = await User.find({
    _id: { $in: friendIds },
    deleted: false,
    status: "active",
  })
    .select("id fullName avatar statusOnline")
    .lean();

  const listDirectChat = listPrivateChatUsers
    .map((friendUser) => {
      const friendInfo = friendList.find(
        (friend) => String(friend.user_id) === String(friendUser._id),
      );

      return {
        id: friendUser.id,
        fullName: friendUser.fullName,
        avatar: friendUser.avatar,
        statusOnline: friendUser.statusOnline,
        room_chat_id: friendInfo?.room_chat_id,
      };
    })
    .filter((item) => item.room_chat_id);

  res.render("client/pages/rooms-chat/index", {
    pageTitle: "Danh sách phòng chat",
    listRoomChat: listRoomChat,
    listDirectChat: listDirectChat,
  });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendsList = res.locals.user.friendList
    ? res.locals.user.friendList.toObject()
    : [];

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
  const usersId = [].concat(req.body.usersId || []);

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

  res.redirect(`/chat/${room._id}`);
};
