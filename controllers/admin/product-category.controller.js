const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helper/createTree");

// [GET]  /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  // sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // end sort

  const records = await ProductCategory.find(find)
    .sort(sort)
    .populate("createdBy.account_id", "fullName")
    .populate("updatedBy.account_id", "fullName");
  const newRecords = createTreeHelper.createTree(records);
  // for (const record of newRecords) {
  //   const user = await Account.findOne({ _id: record.createdBy.account_id });
  //   if (user) {
  //     record.createdBy.accountFullName = user.fullName;
  //   }
  // }

  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
  });
};

// [GET]  /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelper.createTree(records);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo mới danh mục",
    records: newRecords,
  });
};

// [POST]  /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const countProducts = await ProductCategory.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  req.body.createdBy = {
    account_id: res.locals.user.id,
  };
  const record = new ProductCategory(req.body);
  await record.save();

  req.flash("success", "Thêm danh mục sản phẩm mới thành công!");

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [PATCH]  /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  await ProductCategory.updateOne(
    { _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    },
  );

  req.flash("success", "Cập nhật trạng thái thành công!");

  res.redirect(req.headers.referer);
};

// [PATCH]  /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");

  switch (type) {
    case "active":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        {
          status: "active",
          $push: { updatedBy: updatedBy },
        },
      );
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} danh mục sản phẩm thành công!`,
      );
      break;
    case "inactive":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        {
          status: "inactive",
          $push: { updatedBy: updatedBy },
        },
      );
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} danh mục sản phẩm thành công!`,
      );
      break;
    case "delete-multi":
      await ProductCategory.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          },
        },
      );
      req.flash("success", `Xóa ${ids.length} danh mục sản phẩm thành công!`);

      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await ProductCategory.updateOne(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy },
          },
        );
      }
      req.flash(
        "success",
        `Cập nhật vị trí ${ids.length} danh mục sản phẩm thành công!`,
      );

      break;
    default:
      break;
  }
  res.redirect(req.headers.referer);
};

// [GET]  /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };
    const record = await ProductCategory.findOne(find);

    let findTree = {
      deleted: false,
    };

    const records = await ProductCategory.find(findTree);
    const newRecords = createTreeHelper.createTree(records);

    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      record: record,
      records: newRecords,
    });
  } catch (error) {
    req.flash("error", "Danh mục sản phẩm không tồn tại!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH]  /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };

    req.body.position = parseInt(req.body.position);
    await ProductCategory.updateOne(
      {
        _id: id,
      },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      },
    );
    req.flash("success", "Cập nhật danh mục sản phẩm thành công!");
    res.redirect(req.headers.referer);
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(req.headers.referer);
  }
};

// [GET]  /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };
    const record = await ProductCategory.findOne(find)
      .populate("createdBy.account_id", "fullName")
      .populate("updatedBy.account_id", "fullName");

    if (record.parent_id) {
      const parent = await ProductCategory.findOne({
        _id: record.parent_id,
        deleted: false,
      });

      if (parent) {
        record.parent_title = parent.title;
      }
    } else {
      record.parent_title = "Không có";
    }

    res.render("admin/pages/products-category/detail", {
      pageTitle: record.title,
      record: record,
    });
  } catch (error) {
    req.flash("error", "Danh mục sản phẩm không tồn tại!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [DELETE]  /admin/products/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await ProductCategory.updateOne(
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
  req.flash("success", "Xóa danh mục sản phẩm thành công!");
  res.redirect(req.headers.referer);
};
