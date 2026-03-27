const Role = require("../../models/role.model");

const createTreeHelper = require("../../helper/createTree");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const systemConfig = require("../../config/system");

// [GET]  /admin/roles
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    const records = await Role.find(find);
    res.render("admin/pages/roles/index", {
      pageTitle: "Nhóm quyền",
      records: records,
    });
  } catch (error) {
    res.send(error);
  }
};

// [GET]  /admin/roles/create
module.exports.create = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    const records = await Role.find(find);
    res.render("admin/pages/roles/create", {
      pageTitle: "Thêm mới nhóm quyền",
      records: records,
    });
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [POST]  /admin/roles/create
module.exports.createPost = async (req, res) => {
  try {
    const record = new Role(req.body);
    await record.save();

    req.flash("success", "Thêm nhóm quyền mới thành công!");

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [GET]  /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };
    const record = await Role.findOne(find);

    res.render("admin/pages/roles/detail", {
      pageTitle: record.title,
      record: record,
    });
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [GET]  /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };
    const record = await Role.findOne(find);

    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      record: record,
    });
  } catch (error) {
    req.flash("error", "Nhóm quyền không tồn tại!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH]  /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne(
      {
        _id: id,
      },
      req.body,
    );
    req.flash("success", "Cập nhật nhóm quyền thành công!");
    res.redirect(req.headers.referer);
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(req.headers.referer);
  }
};


// [DELETE]  /admin/roles/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Role.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
    },
  );
  // await ProductCategory.deleteOne({ _id: id });
  req.flash("success", "Xóa nhóm quyền thành công!");
  res.redirect(req.headers.referer);
};