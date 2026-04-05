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

