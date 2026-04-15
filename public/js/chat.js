import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// Khai báo biến toàn cục
var timeOutTyping;
const chatElement = document.querySelector(".chat");
const myId = chatElement?.getAttribute("my-id");
const myFullName = chatElement?.getAttribute("my-full-name");
const maxTotalImageSize = 20 * 1024 * 1024;

// TÌM THEO TEXTAREA THAY VÌ INPUT
const chatInput = document.querySelector(
  ".chat .inner-form textarea[name='content']",
);

// show typing
const showTyping = () => {
  if (!myId || !myFullName) {
    return;
  }

  if (chatInput.value.trim() === "") {
    socket.emit("CLIENT_SEND_TYPING", {
      userId: myId,
      fullName: myFullName,
      type: "hidden",
    });
    return;
  }

  socket.emit("CLIENT_SEND_TYPING", {
    userId: myId,
    fullName: myFullName,
    type: "show",
  });
  clearTimeout(timeOutTyping);

  timeOutTyping = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", {
      userId: myId,
      fullName: myFullName,
      type: "hidden",
    });
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

const getSelectedImages = () => {
  return Array.isArray(upload.cachedFileArray) ? upload.cachedFileArray : [];
};

const resetMessageComposer = () => {
  if (chatInput) {
    chatInput.value = "";
    chatInput.style.height = "24px";
  }

  upload.resetPreviewPanel();
  upload.cachedFileArray = [];
};

const sendMessage = async (contentRaw) => {
  const content = contentRaw || "";
  const images = getSelectedImages();

  if (content.trim() === "" && images.length === 0) {
    return;
  }

  if (!myId || !myFullName) {
    console.error("Không có thông tin người dùng để gửi tin nhắn.");
    return;
  }

  const totalImageSize = images.reduce((sum, file) => sum + (file.size || 0), 0);
  if (totalImageSize > maxTotalImageSize) {
    console.error("Tổng dung lượng ảnh vượt quá 20MB.");
    return;
  }

  try {
    const imageBuffers = await Promise.all(
      images.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        return Array.from(new Uint8Array(arrayBuffer));
      }),
    );

    socket.emit("CLIENT_SEND_MESSAGE", {
      userId: myId,
      fullName: myFullName,
      content: content,
      images: imageBuffers,
    });

    resetMessageComposer();
    socket.emit("CLIENT_SEND_TYPING", {
      userId: myId,
      fullName: myFullName,
      type: "hidden",
    });
    clearTimeout(timeOutTyping);
  } catch (error) {
    console.error("Không thể xử lý ảnh trước khi gửi:", error);
    upload.resetPreviewPanel();
    upload.cachedFileArray = [];
  }
};

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

      await sendMessage(chatInput.value);
    }
  });
}

// CLIENT_SEND_MESSAGE (Khi nhấn nút gửi chuột)
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", async (e) => {
    e.preventDefault();

    const content = e.target.elements.content.value;
    await sendMessage(content);
  });
}
// END_CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
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

  const boxImage = div.querySelector(".inner-images");
  if (boxImage) {
    const gallery = new Viewer(boxImage);
  }
});
// end SERVER_RETURN_MESSAGE

socket.on("SERVER_MESSAGE_ERROR", (data) => {
  console.error(data.message);
});

// auto scroll and  preview image
const chatBody = document.querySelector(".chat .inner-body");
if (chatBody) {
  const gallery = new Viewer(chatBody);
  chatBody.scrollTop = chatBody.scrollHeight;
}
// end auto scroll and  preview image

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


// preview image

// end preview image
