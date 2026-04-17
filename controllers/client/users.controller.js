const User = require("../../models/user.model");

const usersSocket = require("../../sockets/client/users.socket");

//[GET] /users/not-friends
module.exports.notFriends = async (req, res) => {
  // socket
  usersSocket(res);
  // end socket

  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId }).select(
    "-password -tokenUser",
  );
  const requestFriends = myUser.requestFriends || [];
  const acceptFriends = myUser.acceptFriends || [];
  const friendIds = await User.distinct("friendList.user_id", {
    _id: userId,
  });

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
      { _id: { $nin: friendIds } },
    ],
    deleted: false,
    status: "active",
  }).select("fullName avatar");

  res.render("client/pages/users/not-friends", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};

// [GET] /users/requests
module.exports.requests = async (req, res) => {
  // socket
  usersSocket(res);
  // end socket
  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId }).select(
    "-password -tokenUser",
  );
  const requestFriends = myUser.requestFriends || [];

  const users = await User.find({
    _id: { $in: requestFriends },
    deleted: false,
    status: "active",
  }).select("id fullName avatar");
  res.render("client/pages/users/requests", {
    pageTitle: "Yêu cầu kết bạn",
    users: users,
  });
};

// [GET] /users/accept
module.exports.accept = async (req, res) => {
  // socket
  usersSocket(res);
  // end socket
  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId }).select(
    "-password -tokenUser",
  );
  const acceptFriends = myUser.acceptFriends || [];

  const users = await User.find({
    _id: { $in: acceptFriends },
    deleted: false,
    status: "active",
  }).select("id fullName avatar");
  res.render("client/pages/users/accept", {
    pageTitle: "Lời mời kết bạn",
    users: users,
  });
};

// [GET] /users/friends
module.exports.friends = async (req, res) => {
  const userId = res.locals.user.id;
  const currentUser = await User.findOne({ _id: userId }).select(
    "-password -tokenUser",
  ).lean();

  const friendList = currentUser.friendList || [];

  const friendIds = friendList.map((item) => item.user_id);


  const users = await User.find({
    _id: { $in: friendIds },
    deleted: false,
    status: "active",
  }).select("id fullName avatar statusOnline");

  for (const user of users) {
    const infoFriend = friendList.find((friend) => friend.user_id == user.id);
    console.log("infoFriend: ", infoFriend);
    if (infoFriend) {
      user.room_chat_id = infoFriend.room_chat_id;
    }
  }

  res.render("client/pages/users/friends", {
    pageTitle: "Danh sách bạn bè",
    users: users,
  });
};
