document.addEventListener("DOMContentLoaded", () => {
  const treeContainer = document.querySelector(".tree-container");
  const hiddenInput = document.getElementById("parent_id_input");

  if (treeContainer && hiddenInput) {
    // 1. Tự động bôi đen và mở rộng khi Load trang (Dùng cho Edit)
    const currentSelectedId = hiddenInput.value;
    let targetItem = null;

    if (currentSelectedId) {
      // Tìm mục tương ứng với ID hiện tại
      targetItem = treeContainer.querySelector(
        `.tree-item[data-id="${currentSelectedId}"]`,
      );
    } else {
      // Nếu không có ID, chọn Danh mục gốc
      targetItem = treeContainer.querySelector(".tree-item.root-item");
    }

    if (targetItem) {
      // Bôi đen
      targetItem.classList.add("selected");

      // Tìm và mở rộng tất cả các danh mục cha chứa nó
      let parentElement = targetItem.parentElement;
      while (parentElement && parentElement !== treeContainer) {
        if (parentElement.classList.contains("child-container")) {
          parentElement.style.display = "block"; // Hiện danh mục con

          // Mở rộng mũi tên của danh mục cha
          const parentTreeItem = parentElement.closest(".tree-item");
          if (parentTreeItem) {
            parentTreeItem.classList.add("expanded");
          }
        }
        parentElement = parentElement.parentElement;
      }
    }

    // 2. Logic xử lý sự kiện Click (Dữ nguyên như tôi đã hướng dẫn trước đó)
    treeContainer.addEventListener("click", (e) => {
      const target = e.target;
      const itemContent = target.closest(".item-content");

      if (!itemContent) return;

      const treeItem = itemContent.parentElement;
      const toggleBtn = target.closest(".toggle");

      // Click vào mũi tên
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

      // Click vào tên danh mục (để chọn)
      e.stopPropagation();
      document
        .querySelectorAll(".tree-item")
        .forEach((el) => el.classList.remove("selected"));
      treeItem.classList.add("selected");

      const selectedId = treeItem.getAttribute("data-id");
      hiddenInput.value = selectedId;
    });
  }
});
