const User = require("../../models/user.model");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const systemConfig = require("../../config/system");

// [GET]  /admin/users
module.exports.index = async (req, res) => {
  //Filter
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  //search
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.fullName = objectSearch.regex;
  }

  // sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.createdAt = "desc";
  }

  // pagination
  const countUsers = await User.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countUsers,
  );

  const lstUser = await User.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    .populate("updatedBy.account_id", "fullName")
    .select("-password -tokenUser");

  res.render("admin/pages/users/index", {
    pageTitle: "Quản lý Người dùng",
    records: lstUser,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH]  /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const permissions = res.locals.role.permissions;

  if (permissions.includes("users_edit")) {
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await User.updateOne(
      { _id: id },
      {
        status: status,
        $push: { updatedBy: updatedBy },
      },
    );

    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect(req.headers.referer);
  } else {
    res.send("403");
    return;
  }
};

// [PATCH]  /admin/users/change-multi
module.exports.changeMulti = async (req, res) => {
  const permissions = res.locals.role.permissions;

  if (permissions.includes("users_edit")) {
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    
    switch (type) {
      case "active":
        await User.updateMany(
          { _id: { $in: ids } },
          {
            status: "active",
            $push: { updatedBy: updatedBy },
          },
        );
        req.flash(
          "success",
          `Cập nhật trạng thái ${ids.length} tài khoản thành công!`,
        );
        break;
      case "inactive":
        await User.updateMany(
          { _id: { $in: ids } },
          {
            status: "inactive",
            $push: { updatedBy: updatedBy },
          },
        );
        req.flash(
          "success",
          `Cập nhật trạng thái ${ids.length} tài khoản thành công!`,
        );
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

// [DELETE]  /admin/users/delete/:id
module.exports.deleteItem = async (req, res) => {
  const permissions = res.locals.role.permissions;

  if (permissions.includes("users_delete")) {
    const id = req.params.id;

    await User.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date(),
        },
      },
    );
    req.flash("success", "Xóa tài khoản thành công!");
    res.redirect(req.headers.referer);
  } else {
    res.send("403");
    return;
  }
};

// [GET]  /admin/users/detail/:id
module.exports.detail = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };
    const record = await User.findOne(find)
      .populate("updatedBy.account_id", "fullName")
      .select("-password -tokenUser");

    res.render("admin/pages/users/detail", {
      pageTitle: "Chi tiết Người dùng",
      record: record,
    });
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(`${systemConfig.prefixAdmin}/users`);
  }
};
