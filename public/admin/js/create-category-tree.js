// tree
document.addEventListener("DOMContentLoaded", () => {
  const treeContainer = document.querySelector(".tree-container");
  const hiddenInput = document.getElementById("parent_id_input");

  treeContainer.addEventListener("click", (e) => {
    const target = e.target;
    const itemContent = target.closest(".item-content");

    if (!itemContent) return;

    const treeItem = itemContent.parentElement;
    const toggleBtn = target.closest(".toggle");

    // TRƯỜNG HỢP 1: Click vào mũi tên (Đóng/Mở)
    if (toggleBtn && !toggleBtn.classList.contains("empty")) {
      e.stopPropagation();
      treeItem.classList.toggle("expanded");
      const childContainer = treeItem.querySelector(".child-container");
      if (childContainer) {
        childContainer.style.display =
          childContainer.style.display === "none" ? "block" : "none";
      }
      return; // Không thực hiện chọn khi chỉ bấm mở rộng
    }

    // TRƯỜNG HỢP 2: Click vào nội dung (Chọn danh mục)
    e.stopPropagation();

    // Xóa bôi đen cũ
    document
      .querySelectorAll(".tree-item")
      .forEach((el) => el.classList.remove("selected"));

    // Bôi đen mục mới
    treeItem.classList.add("selected");

    // Lưu ID vào input hidden
    const selectedId = treeItem.getAttribute("data-id");
    hiddenInput.value = selectedId;
  });
});
// end tree
