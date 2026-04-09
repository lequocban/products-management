// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  const input = document.getElementById("input");

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
