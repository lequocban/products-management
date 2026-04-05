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
