// update quantity of product in cart
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity.length > 0) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const newQuantity = parseInt(input.value);
      const productId = input.getAttribute("product-id");

      if (!isNaN(newQuantity) && newQuantity > 0) {
        window.location.href = `/cart/update/${productId}/${newQuantity}`;
      }
    });
  });
}
// end update quantity of product in cart

// checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
  // Khối hiển thị tổng tiền
  const totalPriceElement = document.querySelector("#total-price-selected");
  // HÀM MỚI: Tính tổng tiền các ô được check
  const calculateTotal = () => {
    let total = 0;
    // Lấy tất cả các ô checkbox đang được tích
    const checkedInputs = checkboxMulti.querySelectorAll(
      "input[name='id']:checked",
    );

    // Cộng dồn tiền từ data-price
    checkedInputs.forEach((input) => {
      const price = parseFloat(input.getAttribute("data-price"));
      total += price;
    });

    // Cập nhật ra giao diện
    if (totalPriceElement) {
      totalPriceElement.innerHTML = `${total.toFixed(2)} $`;
    }
  };
  //checkbox all
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputsId.forEach((input) => {
        input.checked = false;
      });
    }
    calculateTotal(); // Cập nhật tổng tiền khi check/uncheck tất cả
  });

  //checkbox item
  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id' ]:checked",
      ).length;

      if (countChecked == inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
      calculateTotal(); // Cập nhật tổng tiền khi check/uncheck từng item
    });
  });
}
// end checkbox multi

// XỬ LÝ CHUYỂN HƯỚNG TRANG THANH TOÁN
const buttonCheckout = document.querySelector("a[href='/checkout']");

if (buttonCheckout) {
  buttonCheckout.addEventListener("click", (e) => {
    // 1. Ngăn chặn hành vi nhảy trang mặc định của thẻ <a>
    e.preventDefault();

    // 2. Tìm tất cả các ô checkbox đang được tick (trừ ô checkall)
    const checkedInputs = document.querySelectorAll("input[name='id']:checked");

    if (checkedInputs.length > 0) {
      // 3. Tạo chuỗi query URL chứa các ID
      // Ví dụ kết quả: id=65d1a&id=65d1b&
      let queryUrl = "";
      checkedInputs.forEach((input) => {
        queryUrl += `id=${input.value}&`;
      });

      // 4. Cắt bỏ dấu '&' thừa ở cuối cùng
      queryUrl = queryUrl.slice(0, -1);

      // 5. Điều hướng người dùng sang trang checkout kèm theo data
      window.location.href = `/checkout?${queryUrl}`;
    } else {
      // Nếu chưa chọn gì thì báo lỗi
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
    }
  });
}
// END XỬ LÝ CHUYỂN HƯỚNG TRANG THANH TOÁN
