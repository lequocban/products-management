const Order = require("../../models/order.model");

const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const systemConfig = require("../../config/system");

// [GET]  /admin/orders
module.exports.index = async (req, res) => {
  //Filter
  const filterStatus = filterStatusHelper.order(req.query);
  //end filter
  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  //search (Tìm kiếm theo Tên khách hàng thay vì tiêu đề bài viết)
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find["user_info.fullName"] = objectSearch.regex;
  }
  //end search

  // pagination
  const countRecords = await Order.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countRecords,
  );
  // end pagination

  // sort (Đơn hàng mặc định sắp xếp theo ngày tạo mới nhất)
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.createdAt = "desc";
  }
  // end sort

  const records = await Order.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/orders/index", {
    pageTitle: "Quản lý đơn hàng",
    records: records,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH]  /admin/orders/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const permissions = res.locals.role.permissions;

  if (permissions.includes("orders_edit")) {
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };

    await Order.updateOne(
      { _id: id },
      {
        status: status,
        $push: { updatedBy: updatedBy },
      },
    );

    req.flash("success", "Cập nhật trạng thái đơn hàng thành công!");
    res.redirect(req.headers.referer);
  } else {
    res.send("403");
    return;
  }
};

// [PATCH]  /admin/orders/change-multi
module.exports.changeMulti = async (req, res) => {
  const permissions = res.locals.role.permissions;

  if (permissions.includes("orders_edit")) {
    const type = req.body.type;
    const ids = req.body.ids.split(",");

    switch (type) {
      // Cập nhật đa dạng các trạng thái của đơn hàng
      case "pending":
      case "processing":
      case "shipped":
      case "delivered":
      case "cancelled":
      case "returned":
        await Order.updateMany({ _id: { $in: ids } }, { status: type });
        req.flash(
          "success",
          `Cập nhật trạng thái ${ids.length} đơn hàng thành công!`,
        );
        break;

      case "delete-multi":
        await Order.updateMany(
          { _id: { $in: ids } },
          {
            deleted: true,
            deletedBy: {
              account_id: res.locals.user.id,
              deletedAt: new Date(),
            },
          },
        );
        req.flash("success", `Xóa ${ids.length} đơn hàng thành công!`);
        break;

      default:
        break;
    }
    res.redirect(req.headers.referer);
  } else {
    res.send("403");
    return;
  }
};

// [DELETE]  /admin/orders/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  const permissions = res.locals.role.permissions;

  if (permissions.includes("orders_delete")) {
    const id = req.params.id;

    await Order.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date(),
        },
      },
    );

    req.flash("success", "Xóa đơn hàng thành công!");
    res.redirect(req.headers.referer);
  }
};

// [GET]  /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };

    // Tìm đơn hàng và populate thông tin sản phẩm bên trong giỏ hàng
    const record = await Order.findOne(find)
      .populate("products.product_id", "title thumbnail price")
      .populate("updatedBy.account_id", "fullName");

    res.render("admin/pages/orders/detail", {
      pageTitle: "Chi tiết đơn hàng",
      record: record,
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy đơn hàng!");
    res.redirect(`${systemConfig.prefixAdmin}/orders`);
  }
};
