const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");

const createTreeHelper = require("../../helper/createTree");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const systemConfig = require("../../config/system");
const { deleteItem } = require("./product.controller");

// [GET]  /admin/accounts
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    const records = await Account.find(find).select("-password -token");
    for (const item of records) {
      const role = await Role.findOne({
        _id: item.role_id,
        deleted: false,
      });
      item.role = role;
    }

    res.render("admin/pages/accounts/index", {
      pageTitle: "Danh sách tài khoản",
      records: records,
    });
  } catch (error) {
    res.send(error.message);
  }
};

// [GET]  /admin/accounts/create
module.exports.create = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    const roles = await Role.find(find);
    res.render("admin/pages/accounts/create", {
      pageTitle: "Thêm mới tài khoản",
      roles: roles,
    });
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [POST]  /admin/accounts/create
module.exports.createPost = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      email: req.body.email,
      deleted: false,
    });
    if (emailExist) {
      req.flash("error", "Email đã tồn tại, vui lòng nhập email khác!");
      res.redirect(req.headers.referer);
    } else {
      req.body.password = md5(req.body.password);
      const record = new Account(req.body);
      await record.save();
      req.flash("success", "Thêm tài khoản mới thành công!");
      res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [GET]  /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };
    const record = await Account.findOne(find).select("-password -token");

    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;

    res.render("admin/pages/accounts/detail", {
      pageTitle: record.fullName,
      record: record,
    });
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH]  /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Account.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công!");

  res.redirect(req.headers.referer);
};

// [GET]  /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };
    const account = await Account.findOne(find).select("-password -token");
    const role = await Role.findOne({
      _id: account.role_id,
      deleted: false,
    });
    account.role = role;
    const roles = await Role.find({ deleted: false });
    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      account: account,
      roles: roles,
    });
  } catch (error) {
    req.flash("error", "Tài khoản không tồn tại!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH]  /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    const emailExist = await Account.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false,
    });


    if (emailExist) {
      req.flash("error", "Email đã tồn tại, vui lòng nhập email khác!");
    } else {
      await Account.updateOne(
        {
          _id: id,
        },
        req.body,
      );
      req.flash("success", "Cập nhật tài khoản thành công!");
    }
    res.redirect(req.headers.referer);
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(req.headers.referer);
  }
};


// [DELETE]  /admin/accounts/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Account.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
    },
  );
  // await ProductCategory.deleteOne({ _id: id });
  req.flash("success", "Xóa tài khoản thành công!");
  res.redirect(req.headers.referer);
};