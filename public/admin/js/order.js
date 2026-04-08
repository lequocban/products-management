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

        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    });
  });
}
// end delete item

// change status
const selectsStatus = document.querySelectorAll("[button-change-status-select]");
if(selectsStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  selectsStatus.forEach(select => {
    select.addEventListener("change", (e) => { 
      const statusCurrent = e.target.value;
      const id = e.target.getAttribute("data-id");

      const action = path + `/${statusCurrent}/${id}?_method=PATCH`;
      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}
// end change status