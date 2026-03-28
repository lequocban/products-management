document.addEventListener("DOMContentLoaded", () => {
  // 1. Tìm TẤT CẢ các cây danh mục có trên trang (Hỗ trợ nhỡ có 2 cây trên 1 màn hình)
  const treeContainers = document.querySelectorAll(".tree-container");
  if (treeContainers) {
    treeContainers.forEach((treeContainer) => {
      // 2. Tìm thẻ input ẩn động (Dynamic)
      // Cây và thẻ input luôn nằm chung trong 1 thẻ cha (như .form-group)
      const parentDiv = treeContainer.parentElement;
      const hiddenInput = parentDiv.querySelector("[input-tree-value]");

      if (!hiddenInput) return; // Bỏ qua nếu không tìm thấy input

      // --- LOGIC 1: TỰ ĐỘNG MỞ RỘNG KHI LOAD TRANG (Dùng chung Create & Edit) ---
      // Vì Pug đã tự in class .selected vào HTML, ta chỉ cần tìm nó
      const targetItem = treeContainer.querySelector(".tree-item.selected");

      if (targetItem) {
        // Tìm và mở rộng tất cả các danh mục cha chứa nó
        let parentElement = targetItem.parentElement;
        while (parentElement && parentElement !== treeContainer) {
          if (parentElement.classList.contains("child-container")) {
            parentElement.style.display = "block"; // Hiện danh mục con

            // Xoay mũi tên của danh mục cha
            const parentTreeItem = parentElement.closest(".tree-item");
            if (parentTreeItem) {
              parentTreeItem.classList.add("expanded");
            }
          }
          parentElement = parentElement.parentElement;
        }
      }

      // --- LOGIC 2: XỬ LÝ SỰ KIỆN CLICK (Đóng/Mở và Chọn) ---
      treeContainer.addEventListener("click", (e) => {
        const target = e.target;
        const itemContent = target.closest(".item-content");

        if (!itemContent) return;

        const treeItem = itemContent.parentElement;
        const toggleBtn = target.closest(".toggle");

        // TRƯỜNG HỢP A: Click vào mũi tên (Đóng/Mở)
        if (toggleBtn && !toggleBtn.classList.contains("empty")) {
          e.stopPropagation();
          treeItem.classList.toggle("expanded");
          const childContainer = treeItem.querySelector(".child-container");
          if (childContainer) {
            childContainer.style.display =
              childContainer.style.display === "none" ? "block" : "none";
          }
          return;
        }

        // TRƯỜNG HỢP B: Click vào nội dung (Chọn danh mục)
        e.stopPropagation();

        // Chỉ xóa class selected của các item nằm trong CÂY NÀY
        treeContainer
          .querySelectorAll(".tree-item")
          .forEach((el) => el.classList.remove("selected"));

        // Bôi đen mục mới
        treeItem.classList.add("selected");

        // Lưu ID vào input hidden tự động tìm được ở bước 2
        const selectedId = treeItem.getAttribute("data-id");
        hiddenInput.value = selectedId;
      });
    });
  }
});
