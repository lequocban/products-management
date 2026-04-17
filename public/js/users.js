// hàm
const sendRequestAddFriend = async (btn) => {
  btn.addEventListener("click", async (e) => {
    btn.closest(".box-user").classList.add("add");
    const userId = btn.getAttribute("btn-add-friend");

    socket.emit("CLIENT_ADD_FRIEND", userId);
  });
};

const cancelRequestAddFriend = async (btn) => {
  btn.addEventListener("click", async (e) => {
    btn.closest(".box-user").classList.remove("add");
    const userId = btn.getAttribute("btn-cancel-friend");

    socket.emit("CLIENT_CANCEL_FRIEND", userId);
  });
};

const refuseFriend = async (btn) => {
  btn.addEventListener("click", async (e) => {
    btn.closest(".box-user").classList.add("refuse");
    const userId = btn.getAttribute("btn-refuse-friend");

    socket.emit("CLIENT_REFUSE_FRIEND", userId);
  });
};

const acceptFriend = async (btn) => {
  btn.addEventListener("click", async (e) => {
    btn.closest(".box-user").classList.add("accepted");
    const userId = btn.getAttribute("btn-accept-friend");

    socket.emit("CLIENT_ACCEPT_FRIEND", userId);
  });
};

const updateStatusUserOnline = (userId, status) => {
  const dataUsersFriends = document.querySelector(`[data-users-friends]`);
  if (dataUsersFriends) {
    const boxUser = document.querySelector(`[user-id="${userId}"]`);
    if (boxUser) {
      boxUser.querySelector("[status]").setAttribute("status", status);
    }
  }
};
// end hàm

// send request add friend
const lstBtnAddFriends = document.querySelectorAll("[btn-add-friend]");
if (lstBtnAddFriends.length > 0) {
  lstBtnAddFriends.forEach((btn) => {
    sendRequestAddFriend(btn);
  });
}
// end send request add friend

// cancel add friend
const lstBtnCancelFriends = document.querySelectorAll("[btn-cancel-friend]");
if (lstBtnCancelFriends.length > 0) {
  lstBtnCancelFriends.forEach((btn) => {
    cancelRequestAddFriend(btn);
  });
}
// end cancel add friend

// refuse add friend
const lstBtnRefuseFriends = document.querySelectorAll("[btn-refuse-friend]");
if (lstBtnRefuseFriends.length > 0) {
  lstBtnRefuseFriends.forEach((btn) => {
    refuseFriend(btn);
  });
}
// end refuse add friend

// accept friend
const lstBtnAcceptFriends = document.querySelectorAll("[btn-accept-friend]");
if (lstBtnAcceptFriends.length > 0) {
  lstBtnAcceptFriends.forEach((btn) => {
    acceptFriend(btn);
  });
}
// end accept friend

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  const badgeUserAccept = document.querySelector(`[badge-user-accept]`);
  const userId = badgeUserAccept.getAttribute("badge-user-accept");
  if (userId === data.userId) {
    badgeUserAccept.innerHTML = data.lengthAcpFr;
  }
});
// end SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  // trang lời mời kết bạn
  const dataUsersAccept = document.querySelector(`[data-users-accept]`);
  if (dataUsersAccept) {
    const userId = dataUsersAccept.getAttribute("data-users-accept");

    if (userId === data.userId) {
      // vẽ giao diện
      const newBoxUser = document.createElement("div");
      newBoxUser.classList.add("col-6");
      newBoxUser.setAttribute("user-id", data.infoUserA._id);
      newBoxUser.innerHTML = `
      <div class="box-user">
          <div class="inner-avatar">
            <img
                src=${data.infoUserA.avatar}
                alt=${data.infoUserA.fullName}
            />
          </div>
          <div class="inner-info">
            <div class="inner-name">${data.infoUserA.fullName}</div>
            <div class="inner-buttons">
                <button
                  class="btn btn-sm btn-primary ms-1"
                  btn-accept-friend=${data.infoUserA._id}
                >
                  Chấp nhận</button
                ><button
                  class="btn btn-sm btn-secondary ms-1"
                  btn-refuse-friend=${data.infoUserA._id}
                >
                  Từ chối</button
                ><button
                  class="btn btn-sm btn-secondary ms-1"
                  btn-deleted-friend=""
                  disabled=""
                >
                  Đã xóa</button
                ><button
                  class="btn btn-sm btn-primary mr-1"
                  btn-accepted-friend=""
                  disabled=""
                >
                  Đã chấp nhận
                </button>
            </div>
          </div>
      </div>
    `;
      dataUsersAccept.appendChild(newBoxUser);
      // end vẽ giao diện

      // sự kiện xóa lời mời
      const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]");
      refuseFriend(btnRefuseFriend);
      // end sự kiện xóa lời mời

      // sự kiện chấp nhận lời mời
      const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]");
      acceptFriend(btnAcceptFriend);
      // end sự kiện chấp nhận lời mời
    }
  }
  // end trang lời mời kết bạn

  // trang danh sách người dùng
  const dataUsersNotFriends = document.querySelector(
    `[data-users-not-friends]`,
  );
  if (dataUsersNotFriends) {
    const userId = dataUsersNotFriends.getAttribute("data-users-not-friends");
    if (userId === data.userId) {
      // xóa a khỏi giao diện b
      const boxUserA = document.querySelector(
        `[user-id="${data.infoUserA._id}"]`,
      );
      if (boxUserA) {
        dataUsersNotFriends.removeChild(boxUserA);
      }
    }
  }
  // end trang danh sách người dùng
});
// end SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  // trang lời mời kết bạn
  const dataUsersAccept = document.querySelector(`[data-users-accept]`);
  if (dataUsersAccept) {
    const userId = dataUsersAccept.getAttribute("data-users-accept");
    if (userId === data.userId) {
      // xóa a khỏi giao diện b
      const boxUserA = document.querySelector(
        `[user-id="${data.cancelUser._id}"]`,
      );
      if (boxUserA) {
        dataUsersAccept.removeChild(boxUserA);
      }
    }
  }
  // end trang lời mời kết bạn

  // trang danh sách người dùng
  const dataUsersNotFriends = document.querySelector(
    `[data-users-not-friends]`,
  );
  if (dataUsersNotFriends) {
    const userId = dataUsersNotFriends.getAttribute("data-users-not-friends");
    console.log(data.cancelUser);
    if (userId === data.userId) {
      // vẽ giao diện
      const newBoxUser = document.createElement("div");
      newBoxUser.classList.add("col-6");
      newBoxUser.setAttribute("user-id", data.cancelUser._id);

      newBoxUser.innerHTML = `
         <div class="box-user">
          <div class="inner-avatar">
            <img
                src=${data.cancelUser.avatar}
                alt=${data.cancelUser.fullName}
            />
          </div>
          <div class="inner-info">
            <div class="inner-name">${data.cancelUser.fullName}</div>
            <div class="inner-buttons">
                <button
                  class="btn btn-sm btn-primary mr-1"
                  btn-add-friend=${data.cancelUser._id}
                >
                  Kết bạn</button
                ><button
                  class="btn btn-sm btn-secondary mr-1"
                  btn-cancel-friend=${data.cancelUser._id}
                >
                  Hủy
                </button>
            </div>
          </div>
      </div>
      `;
      dataUsersNotFriends.appendChild(newBoxUser);
      // end vẽ giao diện

      // sự kiện gửi lời mời kết bạn
      const btnAddFriend = newBoxUser.querySelector("[btn-add-friend]");
      sendRequestAddFriend(btnAddFriend);
      // end sự kiện gửi lời mời kết bạn

      // sự kiện hủy lời mời kết bạn
      const btnCancelFriend = newBoxUser.querySelector("[btn-cancel-friend]");
      cancelRequestAddFriend(btnCancelFriend);
      // end sự kiện hủy lời mời kết bạn
    }
  }
  // end trang danh sách người dùng
});
// end SERVER_RETURN_USER_ID_CANCEL_FRIEND

// SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_ONLINE", (userId) => {
  updateStatusUserOnline(userId, "online");
});
// END SERVER_RETURN_USER_ONLINE

// SERVER_RETURN_USER_OFFLINE
socket.on("SERVER_RETURN_USER_OFFLINE", (userId) => {
  updateStatusUserOnline(userId, "offline");
});
// END SERVER_RETURN_USER_OFFLINE
