const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET]  /admin/roles
module.exports.index = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    const records = await Role.find(find)
      .sort({ createdAt: "desc" })
      .populate("createdBy.account_id", "fullName")
      .populate("updatedBy.account_id", "fullName");

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
    res.render("admin/pages/roles/create", {
      pageTitle: "Thêm mới nhóm quyền",
    });
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [POST]  /admin/roles/create
module.exports.createPost = async (req, res) => {
  const permissions = res.locals.role.permissions;

  if (permissions.includes("roles_create")) {
    try {
      req.body.createdBy = {
        account_id: res.locals.user.id,
      };
      const record = new Role(req.body);
      await record.save();

      req.flash("success", "Thêm nhóm quyền mới thành công!");

      res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
      req.flash("error", "Lỗi!");
      res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
  } else {
    res.send("403");
    return;
  }
};

// [GET]  /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };
    const record = await Role.findOne(find)
      .populate("createdBy.account_id", "fullName")
      .populate("updatedBy.account_id", "fullName");

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
  const permissions = res.locals.role.permissions;

  if (permissions.includes("roles_edit")) {
    try {
      const id = req.params.id;
      const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
      };
      await Role.updateOne(
        {
          _id: id,
        },
        {
          ...req.body,
          $push: { updatedBy: updatedBy },
        },
      );
      req.flash("success", "Cập nhật nhóm quyền thành công!");
      res.redirect(req.headers.referer);
    } catch (error) {
      req.flash("error", "Lỗi!");
      res.redirect(req.headers.referer);
    }
  } else {
    res.send("403");
    return;
  }
};

// [DELETE]  /admin/roles/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  const permissions = res.locals.role.permissions;

  if (permissions.includes("roles_delete")) {
    const id = req.params.id;

    await Role.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date(),
        },
      },
    );
    // await ProductCategory.deleteOne({ _id: id });
    req.flash("success", "Xóa nhóm quyền thành công!");
    res.redirect(req.headers.referer);
  } else {
    res.send("403");
    return;
  }
};

// [GET]  /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);

  res.render("admin/pages/roles/permission", {
    pageTitle: "Phân quyền",
    records: records,
  });
};

// [PATCH]  /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  const permissions = res.locals.role.permissions;

  if (permissions.includes("roles_permissions")) {
    try {
      const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
      };
      const permissions = JSON.parse(req.body.permissions);
      for (const item of permissions) {
        await Role.updateOne(
          { _id: item.id },
          {
            permissions: item.permissions,
            $push: { updatedBy: updatedBy },
          },
        );
      }

      req.flash("success", "Cập nhật quyền thành công!");
      res.redirect(req.headers.referer);
    } catch (error) {
      req.flash("error", "Lỗi!");
      res.redirect(req.headers.referer);
    }
  } else {
    res.send("403");
    return;
  }
};
