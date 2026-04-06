document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".otp-input");

  inputs.forEach((input, index) => {
    // 1. Xử lý khi người dùng nhập vào ô (Sự kiện input)
    input.addEventListener("input", (e) => {
      const value = e.target.value;

      // Chỉ cho phép nhập số, nếu nhập ký tự khác thì xóa đi
      if (!/^\d$/.test(value)) {
        e.target.value = "";
        return;
      }

      // Nếu đã nhập 1 chữ số -> Tự động nhảy sang ô kế tiếp
      if (value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    // 2. Xử lý khi nhấn phím (Sự kiện keydown - Dùng để bắt phím Backspace)
    input.addEventListener("keydown", (e) => {
      // Nếu nhấn Backspace và ô hiện tại đang trống -> Quay lại ô trước đó
      if (e.key === "Backspace" && e.target.value === "" && index > 0) {
        inputs[index - 1].focus();
      }
    });

    // 3. Xử lý khi người dùng dán (Paste) mã OTP (Ví dụ: 123456)
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const data = e.clipboardData.getData("text").trim();

      // Nếu dữ liệu dán vào là dãy số
      if (/^\d+$/.test(data)) {
        const characters = data.split("").slice(0, inputs.length);

        characters.forEach((char, i) => {
          if (inputs[i]) {
            inputs[i].value = char;
          }
        });

        // Focus vào ô cuối cùng sau khi dán
        const nextIndex =
          characters.length >= inputs.length
            ? inputs.length - 1
            : characters.length;
        inputs[nextIndex].focus();
      }
    });
  });
});
