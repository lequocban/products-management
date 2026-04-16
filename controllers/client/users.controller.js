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

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
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
  console.log(users);
  res.render("client/pages/users/requests", {
    pageTitle: "Danh sách yêu cầu kết bạn",
    users: users,
  });
};
