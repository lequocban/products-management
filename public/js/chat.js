import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// Khai báo biến toàn cục để dùng chung cho cả form submit và keyup
var timeOutTyping;
const chatInput = document.querySelector(
  ".chat .inner-form input[name='content']",
);

// show typing
const showTyping = () => {
  if (chatInput.value.trim() === "") {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
    return;
  }

  socket.emit("CLIENT_SEND_TYPING", "show");
  clearTimeout(timeOutTyping);

  timeOutTyping = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
};

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", function (e) {
    e.preventDefault();

    const content = e.target.elements.content.value;
    if (content.trim() !== "") {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";

      // Hủy typing ngay lập tức và xóa luôn bộ đếm ngược
      socket.emit("CLIENT_SEND_TYPING", "hidden");
      clearTimeout(timeOutTyping);
    }
  });
}
// END_CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const boxTyping = document.querySelector(".chat .inner-list-typing");

  const div = document.createElement("div");
  let htmlFullName = "";
  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }
  div.innerHTML = `
  ${htmlFullName}
  <div class="inner-content">${data.content}</div>
  `;

  body.insertBefore(div, boxTyping);
  body.scrollTop = body.scrollHeight;
});
// end SERVER_RETURN_MESSAGE

// auto scroll
const chatBody = document.querySelector(".chat .inner-body");
if (chatBody) {
  chatBody.scrollTop = chatBody.scrollHeight;
}
// end auto scroll

// emoji-picker
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker && chatInput) {
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    chatInput.value += icon;
    const end = chatInput.value.length;
    chatInput.setSelectionRange(end, end);
    chatInput.focus();
    showTyping();
  });
}

const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle("shown");
  });
}
// end emoji-picker

// SERVER_RETURN_TYPING
// SỰ KIỆN GÕ PHÍM (TYPING)
if (chatInput) {
  chatInput.addEventListener("keyup", () => {
    showTyping();
  });
}
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if (elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    const existTyping = elementListTyping.querySelector(
      `[user-id="${data.userId}"]`,
    );

    if (data.type === "show") {
      // NẾU ĐANG GÕ: Kiểm tra nếu chưa có thì mới tạo mới
      if (!existTyping) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);

        boxTyping.innerHTML = `
          <div class="inner-name">${data.fullName}</div>
          <div class="inner-dots">
            <span></span><span></span><span></span>
          </div>
        `;

        elementListTyping.appendChild(boxTyping);

        // Tự động cuộn xuống đáy để nhìn thấy dấu 3 chấm đang nhảy
        const bodyChat = document.querySelector(".chat .inner-body");
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      // NGỪNG GÕ HOẶC GỬI XONG
      if (existTyping) {
        elementListTyping.removeChild(existTyping);
      }
    }
  });
}
// END SERVER_RETURN_TYPING
