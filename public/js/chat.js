import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// Khai báo biến toàn cục
var timeOutTyping;

// TÌM THEO TEXTAREA THAY VÌ INPUT
const chatInput = document.querySelector(
  ".chat .inner-form textarea[name='content']",
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

// file-upload-with-preview
const upload = new FileUploadWithPreview.FileUploadWithPreview(
  "upload-images",
  {
    multiple: true,
    maxFileCount: 6,
  },
);
// file-upload-with-preview

// AUTO RESIZE TEXTAREA VÀ XỬ LÝ ENTER
if (chatInput) {
  // 1. Tự động co giãn chiều cao
  chatInput.addEventListener("input", function () {
    this.style.height = "24px";
    this.style.height = this.scrollHeight + "px";
    if (this.scrollHeight > 120) {
      this.style.overflowY = "auto";
    } else {
      this.style.overflowY = "hidden";
    }
    const chatBody = document.querySelector(".chat .inner-body");
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  });

  // 2. Gửi tin nhắn bằng Enter
  chatInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Ngăn xuống dòng

      const content = chatInput.value;
      const images = upload.cachedFileArray || []; // Lấy ảnh nếu có

      if (content.trim() !== "" || images.length > 0 || content) {
        socket.emit("CLIENT_SEND_MESSAGE", {
          content: content,
          images: images,
        });

        chatInput.value = "";
        upload.resetPreviewPanel(); // Xóa ảnh đã chọn trên màn hình

        // Reset lại khung chữ về 1 dòng
        chatInput.style.height = "24px";

        socket.emit("CLIENT_SEND_TYPING", "hidden");
        clearTimeout(timeOutTyping);
      }
    }
  });
}

// CLIENT_SEND_MESSAGE (Khi nhấn nút gửi chuột)
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", async (e) => {
    e.preventDefault();

    const content = e.target.elements.content.value;
    const images = upload.cachedFileArray || [];
    const imagesBuffer = [];

    if (content.trim() !== "" || images.length > 0 || content) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images,
      });
      e.target.elements.content.value = "";
      upload.resetPreviewPanel();

      // Reset lại chiều cao textarea
      if (chatInput) chatInput.style.height = "24px";

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

  let htmlContent = "";
  let htmlImages = "";

  if (data.content) {
    htmlContent = `<div class="inner-content">${data.content}</div>`;
  }

  if (data.images && data.images.length > 0) {
    htmlImages += `<div class="inner-images">`;
    for (const img of data.images) {
      htmlImages += `<img src="${img}">`;
    }
    htmlImages += `</div>`;
  }

  div.innerHTML = `
  ${htmlFullName}
  ${htmlContent}
  ${htmlImages}
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

    // Kích hoạt sự kiện input để textarea tự co giãn khi thả emoji
    chatInput.dispatchEvent(new Event("input"));
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

// SỰ KIỆN GÕ PHÍM (TYPING)
if (chatInput) {
  chatInput.addEventListener("keyup", () => {
    showTyping();
  });
}

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if (elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    const existTyping = elementListTyping.querySelector(
      `[user-id="${data.userId}"]`,
    );

    if (data.type === "show") {
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

        const bodyChat = document.querySelector(".chat .inner-body");
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      if (existTyping) {
        elementListTyping.removeChild(existTyping);
      }
    }
  });
}
// END SERVER_RETURN_TYPING
