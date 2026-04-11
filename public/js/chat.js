import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", function (e) {
    e.preventDefault();

    const content = e.target.elements.content.value;
    if (content.trim() !== "") {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
    }
  });
}

// END_CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");

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

  body.appendChild(div);
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
if (emojiPicker) {
  const chatInput = document.querySelector(
    ".chat .inner-form input[name='content']",
  );
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    chatInput.value += icon;
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
