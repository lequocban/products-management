const Chat = require("../../models/chat.model");
const RoomChat = require("../../models/room-chat.model");
const User = require("../../models/user.model");

const rolePriority = {
  superAdmin: 0,
  admin: 1,
  user: 2,
};

const getRoomMemberByUserId = (roomChat, userId) => {
  const members = roomChat?.users || [];
  return members.find((member) => {
    const memberUserId = member?.user_id?._id || member?.user_id;
    return String(memberUserId) === String(userId);
  });
};

const isRoleCanManageMembers = (role) => {
  return role === "superAdmin" || role === "admin";
};

const isRoleCanPromoteMembers = (role) => {
  return role === "superAdmin";
};

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  const currentUserId = res.locals.user.id;

  const roomChat = await RoomChat.findOne({
    _id: roomChatId,
    deleted: false,
  }).populate(
    "users.user_id",
    "id fullName avatar statusOnline status deleted",
  );

  if (!roomChat) {
    req.flash("error", "Phòng chat không tồn tại hoặc đã bị xóa.");
    res.redirect("/rooms-chat");
    return;
  }

  const chats = await Chat.find({
    room_chat_id: roomChatId,
    deleted: false,
  }).populate("user_id", "fullName");

  const roomUsers = (roomChat.users || [])
    .filter((member) => {
      const user = member.user_id;
      return user && !user.deleted && user.status === "active";
    })
    .map((member) => {
      const user = member.user_id;
      return {
        id: String(user._id),
        fullName: user.fullName,
        avatar: user.avatar,
        statusOnline: user.statusOnline || "offline",
        role: member.role,
        isMe: String(user._id) === String(currentUserId),
      };
    })
    .sort((a, b) => {
      const roleDiff =
        (rolePriority[a.role] ?? 99) - (rolePriority[b.role] ?? 99);
      if (roleDiff !== 0) {
        return roleDiff;
      }

      return a.fullName.localeCompare(b.fullName, "vi", {
        sensitivity: "base",
      });
    });

  const currentMember = getRoomMemberByUserId(roomChat, currentUserId);
  const currentUserRole = currentMember?.role || null;

  const canManageMembers =
    roomChat.typeRoom === "group" && isRoleCanManageMembers(currentUserRole);
  const canPromoteMembers =
    roomChat.typeRoom === "group" && isRoleCanPromoteMembers(currentUserRole);
  const canDeleteRoom =
    roomChat.typeRoom === "group" && currentUserRole === "superAdmin";

  const roomUserIdSet = new Set(roomUsers.map((item) => String(item.id)));
  let candidateUsers = [];

  if (canManageMembers) {
    const currentUser = await User.findOne({ _id: currentUserId })
      .select("friendList")
      .lean();

    const friendList = currentUser?.friendList || [];
    const friendIds = friendList
      .map((friend) => friend.user_id)
      .filter((friendId) => !roomUserIdSet.has(String(friendId)));

    if (friendIds.length > 0) {
      candidateUsers = await User.find({
        _id: { $in: friendIds },
        deleted: false,
        status: "active",
      })
        .select("id fullName avatar statusOnline")
        .lean();

      candidateUsers = candidateUsers.map((candidateUser) => ({
        id: String(candidateUser._id),
        fullName: candidateUser.fullName,
        avatar: candidateUser.avatar,
        statusOnline: candidateUser.statusOnline || "offline",
      }));
    }
  }

  const onlineUsersCount = roomUsers.filter(
    (member) => member.statusOnline === "online",
  ).length;

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    roomChatId: roomChatId,
    roomChat: {
      id: String(roomChat._id),
      title: roomChat.title,
      typeRoom: roomChat.typeRoom,
      avatar: roomChat.avatar,
    },
    chats: chats,
    roomUsers: roomUsers,
    onlineUsersCount: onlineUsersCount,
    candidateUsers: candidateUsers,
    currentUserRole: currentUserRole,
    canManageMembers: canManageMembers,
    canPromoteMembers: canPromoteMembers,
    canDeleteRoom: canDeleteRoom,
  });
};

// [POST] /chat/:roomChatId/members/add
module.exports.addMembers = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  const currentUserId = res.locals.user.id;
  const usersId = [].concat(req.body.usersId || []).filter(Boolean);

  if (!usersId.length) {
    req.flash("error", "Vui lòng chọn ít nhất một thành viên để thêm.");
    res.redirect(`/chat/${roomChatId}`);
    return;
  }

  const roomChat = await RoomChat.findOne({
    _id: roomChatId,
    deleted: false,
  }).lean();

  if (!roomChat) {
    req.flash("error", "Phòng chat không tồn tại.");
    res.redirect("/rooms-chat");
    return;
  }

  if (roomChat.typeRoom !== "group") {
    req.flash("error", "Chỉ có thể thêm thành viên vào phòng chat nhóm.");
    res.redirect(`/chat/${roomChatId}`);
    return;
  }

  const currentMember = getRoomMemberByUserId(roomChat, currentUserId);
  const currentUserRole = currentMember?.role || null;

  if (!isRoleCanManageMembers(currentUserRole)) {
    req.flash("error", "Bạn không có quyền thêm thành viên.");
    res.redirect(`/chat/${roomChatId}`);
    return;
  }

  const existingUserIdSet = new Set(
    (roomChat.users || []).map((member) => String(member.user_id)),
  );

  const nextUserIds = usersId.filter(
    (userId) => !existingUserIdSet.has(String(userId)),
  );

  if (!nextUserIds.length) {
    req.flash("error", "Các thành viên này đã có trong phòng chat.");
    res.redirect(`/chat/${roomChatId}`);
    return;
  }

  const validUsers = await User.find({
    _id: { $in: nextUserIds },
    deleted: false,
    status: "active",
  })
    .select("_id")
    .lean();

  if (!validUsers.length) {
    req.flash("error", "Không tìm thấy thành viên hợp lệ để thêm vào phòng.");
    res.redirect(`/chat/${roomChatId}`);
    return;
  }

  const usersToAdd = validUsers.map((user) => ({
    user_id: user._id,
    role: "user",
  }));

  await RoomChat.updateOne(
    { _id: roomChatId },
    {
      $push: {
        users: {
          $each: usersToAdd,
        },
      },
    },
  );

  req.flash(
    "success",
    `Đã thêm ${usersToAdd.length} thành viên vào phòng chat.`,
  );
  res.redirect(`/chat/${roomChatId}`);
};

// [POST] /chat/:roomChatId/members/:userId/promote
module.exports.promoteMember = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  const targetUserId = req.params.userId;
  const currentUserId = res.locals.user.id;

  const roomChat = await RoomChat.findOne({
    _id: roomChatId,
    deleted: false,
  }).lean();

  if (!roomChat) {
    req.flash("error", "Phòng chat không tồn tại.");
    res.redirect("/rooms-chat");
    return;
  }

  if (roomChat.typeRoom !== "group") {
    req.flash("error", "Chỉ phòng chat nhóm mới có thể phân quyền admin.");
    res.redirect(`/chat/${roomChatId}`);
    return;
  }

  const currentMember = getRoomMemberByUserId(roomChat, currentUserId);
  const currentUserRole = currentMember?.role || null;

  if (!isRoleCanPromoteMembers(currentUserRole)) {
    req.flash("error", "Chỉ trưởng phòng mới có quyền phân quyền admin.");
    res.redirect(`/chat/${roomChatId}`);
    return;
  }

  const targetMember = getRoomMemberByUserId(roomChat, targetUserId);
  if (!targetMember) {
    req.flash("error", "Không tìm thấy thành viên trong phòng chat.");
    res.redirect(`/chat/${roomChatId}`);
    return;
  }

  if (targetMember.role !== "user") {
    req.flash("error", "Chỉ có thể nâng quyền thành viên thường lên admin.");
    res.redirect(`/chat/${roomChatId}`);
    return;
  }

  await RoomChat.updateOne(
    {
      _id: roomChatId,
      "users.user_id": targetUserId,
    },
    {
      $set: {
        "users.$.role": "admin",
      },
    },
  );

  req.flash("success", "Đã nâng quyền thành admin thành công.");
  res.redirect(`/chat/${roomChatId}`);
};

// [POST] /chat/:roomChatId/delete
module.exports.deleteRoom = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  const currentUserId = res.locals.user.id;

  const roomChat = await RoomChat.findOne({
    _id: roomChatId,
    deleted: false,
  }).lean();

  if (!roomChat) {
    req.flash("error", "Phòng chat không tồn tại hoặc đã bị xóa.");
    res.redirect("/rooms-chat");
    return;
  }

  if (roomChat.typeRoom !== "group") {
    req.flash("error", "Chỉ phòng chat nhóm mới có thể xóa.");
    res.redirect(`/chat/${roomChatId}`);
    return;
  }

  const currentMember = getRoomMemberByUserId(roomChat, currentUserId);
  if (currentMember?.role !== "superAdmin") {
    req.flash("error", "Chỉ trưởng phòng mới có quyền xóa phòng chat.");
    res.redirect(`/chat/${roomChatId}`);
    return;
  }

  await RoomChat.updateOne(
    { _id: roomChatId },
    {
      deleted: true,
      deletedAt: new Date(),
    },
  );

  req.flash("success", "Đã xóa phòng chat thành công.");
  res.redirect("/rooms-chat");
};
