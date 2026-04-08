// 1. HÀM CŨ: Bộ lọc trạng thái chung (active / inactive)
const filterGeneral = (query) => {
  let filterStatus = [
    { name: "Tất cả", status: "", class: "" },
    { name: "Hoạt động", status: "active", class: "" },
    { name: "Dừng hoạt động", status: "inactive", class: "" },
  ];

  if (query.status) {
    const index = filterStatus.findIndex((item) => item.status == query.status);
    // Thêm check an toàn để tránh lỗi nếu người dùng gõ sai status trên URL
    if (index !== -1) filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex((item) => item.status == "");
    if (index !== -1) filterStatus[index].class = "active";
  }

  return filterStatus;
};

// 2. HÀM MỚI: Bộ lọc trạng thái dành riêng cho Đơn hàng
const filterOrder = (query) => {
  let filterStatus = [
    { name: "Tất cả", status: "", class: "" },
    { name: "Chờ xử lý", status: "pending", class: "" },
    { name: "Đang xử lý/Đóng gói", status: "processing", class: "" },
    { name: "Đã giao vận chuyển", status: "shipped", class: "" },
    { name: "Đã giao hàng", status: "delivered", class: "" },
    { name: "Đã hủy", status: "cancelled", class: "" },
    { name: "Đã trả hàng", status: "returned", class: "" },
  ];

  if (query.status) {
    const index = filterStatus.findIndex((item) => item.status == query.status);
    if (index !== -1) filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex((item) => item.status == "");
    if (index !== -1) filterStatus[index].class = "active";
  }

  return filterStatus;
};

// 3. EXPORT THÔNG MINH
// Export hàm cũ làm mặc định để các file controller cũ vẫn chạy bình thường không bị lỗi
module.exports = filterGeneral;

// Export thêm hàm đơn hàng dưới dạng một phương thức (method) đi kèm
module.exports.order = filterOrder;
