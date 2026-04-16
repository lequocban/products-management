// hàm
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
// end hàm

// send request add friend
const lstBtnAddFriends = document.querySelectorAll("[btn-add-friend]");
if (lstBtnAddFriends.length > 0) {
  lstBtnAddFriends.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      btn.closest(".box-user").classList.add("add");
      const userId = btn.getAttribute("btn-add-friend");

      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}
// end send request add friend

// cancel add friend
const lstBtnCancelFriends = document.querySelectorAll("[btn-cancel-friend]");
if (lstBtnCancelFriends.length > 0) {
  lstBtnCancelFriends.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      btn.closest(".box-user").classList.remove("add");
      const userId = btn.getAttribute("btn-cancel-friend");

      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
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
  const dataUsersAccept = document.querySelector(`[data-users-accept]`);
  const userId = dataUsersAccept.getAttribute("data-users-accept");
  if (userId === data.userId) {
    // vẽ giao diện
    const newBoxUser = document.createElement("div");
    newBoxUser.classList.add("col-6");
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
});
// end SERVER_RETURN_INFO_ACCEPT_FRIEND
