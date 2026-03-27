//delete item
const btnDelete = document.querySelectorAll("[button-delete]");
if (btnDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");

  btnDelete.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có muốn xóa không?");
      if (isConfirm) {
        const id = btn.getAttribute("data-id");

        const action = path + `/${id}?_method=DELETE`;
        console.log(action);
        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    });
  });
}
// end delete item
