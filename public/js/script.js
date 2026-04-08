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


// TÍNH NĂNG PREVIEW ẢNH UPLOAD VÀ XÓA VỀ MẶC ĐỊNH
const uploadImage = document.querySelector("[upload-image]");

if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector(
    "[upload-image-preview]",
  );
  const removeImagePreview = uploadImage.querySelector(
    "[remove-image-preview]",
  );
  // 1. Lấy thẻ input ẩn
  const isAvatarDeletedInput = document.querySelector("#isAvatarDeleted");

  if (uploadImageInput && uploadImagePreview) {
    const defaultAvatar =
      "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    // Khi chọn ảnh mới
    uploadImageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        uploadImagePreview.src = URL.createObjectURL(file);
        // Đã chọn ảnh mới -> Hủy cờ xóa ảnh
        if (isAvatarDeletedInput) isAvatarDeletedInput.value = "false";
      }
    });

    // Khi bấm nút X
    if (removeImagePreview) {
      removeImagePreview.addEventListener("click", () => {
        uploadImageInput.value = "";
        uploadImagePreview.src = defaultAvatar;

        // 2. Bật cờ đánh dấu là khách vừa yêu cầu xóa ảnh
        if (isAvatarDeletedInput) isAvatarDeletedInput.value = "true";
      });
    }
  }
}
// END TÍNH NĂNG PREVIEW ẢNH UPLOAD VÀ XÓA VỀ MẶC ĐỊNH