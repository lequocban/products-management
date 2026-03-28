// button status   filter
const btnStatus = document.querySelectorAll("[btn-status]");
if (btnStatus.length > 0) {
  let url = new URL(window.location.href);
  btnStatus.forEach((btn) => {
    btn.addEventListener("click", () => {
      const status = btn.getAttribute("btn-status");

      if (status) {
        url.searchParams.set("status", status);
        url.searchParams.set("page", 1);
      } else {
        url.searchParams.delete("status");
        url.searchParams.set("page", 1);
      }
      window.location.href = url.href;
    });
  });
}
// end button status

//form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
//end form search

//btn pagination
const btnPagination = document.querySelectorAll("[btn-pagination]");
if (btnPagination.length > 0) {
  let url = new URL(window.location.href);
  btnPagination.forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentPage = btn.getAttribute("btn-pagination");

      url.searchParams.set("page", currentPage);

      window.location.href = url.href;
    });
  });
}
//end btn pagination

// checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

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
    });
  });
}
// end checkbox multi

// form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id' ]:checked",
    );
    const typeChange = e.target.elements.type.value;
    if (typeChange == "delete-multi") {
      const isConfirm = confirm("Bạn có muốn xóa không?");
      if (!isConfirm) {
        return;
      }
    }

    if (inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector('input[name="ids"]');

      inputsChecked.forEach((input) => {
        if (typeChange == "change-position") {
          const id = input.value;
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value;
          ids.push(`${id}-${position}`);
        } else {
          ids.push(input.value);
        }
      });
      let idsValue = ids.join(",");
      inputIds.value = idsValue;
      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất 1 bản ghi!");
    }
  });
}
// end form change multi

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

// upload image
const uploadImage = document.querySelector("[upload-image]");

if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  const removeImagePreview = document.querySelector("[remove-image-preview]");

  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageURL = URL.createObjectURL(file);

      uploadImagePreview.src = imageURL;
      removeImagePreview.style.display = "block";
    }
  });

  removeImagePreview.addEventListener("click", () => {
    uploadImageInput.value = "";
    uploadImagePreview.src = "";
    removeImagePreview.style.display = "none";
  });
}
// end upload image

//sort
const sort = document.querySelector("[sort]");
if (sort) {
  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");
  let url = new URL(window.location.href);
  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");

    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);

    window.location.href = url.href;
  });

  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href = url.href;
  });

  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");
  if (sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`;
    const optionSelected = sortSelect.querySelector(
      `option[value='${stringSort}']`,
    );
    optionSelected.selected = true;
  }
}
//end sort

