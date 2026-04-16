const User = require("../../models/user.model");

const uploadToCloudinary = require("../../helper/uploadToCloudinary");

module.exports = (res) => {
  _io.once("connection", (socket) => {
    const myUserId = res.locals.user.id;
    // gửi yêu cầu kết bạn
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
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
      // lấy độ dài acceptFriends của b
      const infoUserB = await User.findOne({
        _id: userId,
      });
      const lengthAcpFr = infoUserB.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcpFr: lengthAcpFr,
      });

      // lấy thông tin a gửi cho b
      const infoUserA = await User.findOne({
        _id: myUserId,
      }).select("id fullName avatar");
      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userId: userId,
        infoUserA: infoUserA,
      });
    });

    // hủy gửi yêu cầu kết bạn
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      // xóa id của a khỏi acceptFriends của b
      const existUserAcpFr = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (existUserAcpFr) {
        await User.updateOne(
          { _id: userId },
          { $pull: { acceptFriends: myUserId } },
        );
      }

      // xóa id của b khỏi requestFriends của a
      const existUserReqFr = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (existUserReqFr) {
        await User.updateOne(
          { _id: myUserId },
          { $pull: { requestFriends: userId } },
        );
      }
      // lấy độ dài acceptFriends của b
      const infoUserB = await User.findOne({
        _id: userId,
      });
      const lengthAcpFr = infoUserB.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcpFr: lengthAcpFr,
      });
      // lấy userId của a trả về cho b khi hủy lời mời
      socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
        userId: userId,
        cancelUserId: myUserId,
      });
    });

    // từ chối yêu cầu kết bạn
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      // xóa id của b khỏi acceptFriends của a
      const existUserAcpFr = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (existUserAcpFr) {
        await User.updateOne(
          { _id: myUserId },
          { $pull: { acceptFriends: userId } },
        );
      }

      // xóa id của a khỏi requestFriends của b
      const existUserReqFr = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (existUserReqFr) {
        await User.updateOne(
          { _id: userId },
          { $pull: { requestFriends: myUserId } },
        );
      }
    });

    // chấp nhận yêu cầu kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      // xóa id của b khỏi acceptFriends của a + thêm {user_id, room_chat_id} của b vào friends của a
      const existUserAcpFr = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (existUserAcpFr) {
        await User.updateOne(
          { _id: myUserId },
          {
            $push: { friendList: { user_id: userId, room_chat_id: " " } },
            $pull: { acceptFriends: userId },
          },
        );
      }

      // xóa id của a khỏi requestFriends của b
      const existUserReqFr = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (existUserReqFr) {
        await User.updateOne(
          { _id: userId },
          {
            $push: { friendList: { user_id: myUserId, room_chat_id: " " } },
            $pull: { requestFriends: myUserId },
          },
        );
      }
    });
  });
};
