const User = require("../../models/user.model");

const uploadToCloudinary = require("../../helper/uploadToCloudinary");

module.exports = (res) => {
  _io.once("connection", (socket) => {
    const myUserId = res.locals.user.id;

    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      console.log(myUserId); // a: myId
      console.log(userId); // b: id of user I want to add friend

      // thêm id của a vào acceptFriends của b
      const existUserAcpFr = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (!existUserAcpFr) {
        await User.updateOne(
          { _id: userId },
          { $push: { acceptFriends: myUserId } },
        );
      }

      // thêm id của b vào requestFriends của a
      const existUserReqFr = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (!existUserReqFr) {
        await User.updateOne(
          { _id: myUserId },
          { $push: { requestFriends: userId } },
        );
      }
    });
  });
};
