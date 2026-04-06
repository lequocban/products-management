// show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
}
// end show alert

// TÍNH NĂNG ẨN / HIỆN MẬT KHẨU
const togglePasswords = document.querySelectorAll(".toggle-password");

if (togglePasswords.length > 0) {
  togglePasswords.forEach((button) => {
    button.addEventListener("click", function () {
      // 1. Tìm ô input nằm ngay trước cái nút con mắt này
      const passwordInput = this.previousElementSibling;

      if (passwordInput) {
        // 2. Chuyển đổi type
        const currentType = passwordInput.getAttribute("type");
        const newType = currentType === "password" ? "text" : "password";
        passwordInput.setAttribute("type", newType);

        // 3. Chuyển đổi icon
        const icon = this.querySelector("i");
        if (newType === "text") {
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        } else {
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }
      }
    });
  });
}
// END TÍNH NĂNG ẨN / HIỆN MẬT KHẨU

