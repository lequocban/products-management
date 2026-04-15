const User = require("../../models/user.model");

//[GET] /users/not-friends
module.exports.notFriends = async (req, res) => {
  const userId = res.locals.user.id;
  const users = await User.find({ 
    _id: { $ne: userId },
    deleted: false, 
    status: "active", 
  }).select("fullName avatar");

  res.render("client/pages/users/not-friends", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};
