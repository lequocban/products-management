// send request add friend
const lstBtnAddFriends = document.querySelectorAll("[btn-add-friend]");
if (lstBtnAddFriends.length > 0) {
  lstBtnAddFriends.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      btn.closest(".box-user").classList.add("add");
      const userId = btn.getAttribute("btn-add-friend");
      console.log("userId: ", userId);

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
      console.log("userId: ", userId);

      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
// end cancel add friend