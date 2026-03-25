// change status
const btnChangeStatus = document.querySelectorAll("[button-change-status]");
if (btnChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  btnChangeStatus.forEach((btn) => {
    btn.addEventListener("click", () => {
      const statusCurrent = btn.getAttribute("data-status");
      const id = btn.getAttribute("data-id");

      let newStatus = statusCurrent == "active" ? "inactive" : "active";

      // console.log(statusCurrent, id, newStatus);

      const action = path + `/${newStatus}/${id}?_method=PATCH`;
      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}
// end change status

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
