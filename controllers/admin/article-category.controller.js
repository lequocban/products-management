const ArticleCategory = require("../../models/article-category.model");

const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helper/createTree");

// [GET]  /admin/articles-category
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

  const records = await ArticleCategory.find(find)
    .sort(sort)
    .populate("createdBy.account_id", "fullName")
    .populate("updatedBy.account_id", "fullName");
  const newRecords = createTreeHelper.createTree(records);

  res.render("admin/pages/articles-category/index", {
    pageTitle: "Danh mục bài viết",
    records: newRecords,
  });
};

// [GET]  /admin/articles-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ArticleCategory.find(find);
  const newRecords = createTreeHelper.createTree(records);

  res.render("admin/pages/articles-category/create", {
    pageTitle: "Tạo mới danh mục",
    records: newRecords,
  });
};

// [POST]  /admin/articles-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const countRecords = await ArticleCategory.countDocuments();
    req.body.position = countRecords + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  req.body.createdBy = {
    account_id: res.locals.user.id,
  };
  const record = new ArticleCategory(req.body);
  await record.save();

  req.flash("success", "Thêm danh mục bài viết mới thành công!");

  res.redirect(`${systemConfig.prefixAdmin}/articles-category`);
};

// [PATCH]  /admin/articles-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  await ArticleCategory.updateOne(
    { _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    },
  );

  req.flash("success", "Cập nhật trạng thái thành công!");

  res.redirect(req.headers.referer);
};

// [PATCH]  /admin/articles-category/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  switch (type) {
    case "active":
      await ArticleCategory.updateMany(
        { _id: { $in: ids } },
        {
          status: "active",
          $push: { updatedBy: updatedBy },
        },
      );
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} danh mục bài viết thành công!`,
      );
      break;
    case "inactive":
      await ArticleCategory.updateMany(
        { _id: { $in: ids } },
        {
          status: "inactive",
          $push: { updatedBy: updatedBy },
        },
      );
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} danh mục bài viết thành công!`,
      );
      break;
    case "delete-multi":
      await ArticleCategory.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          },
        },
      );
      req.flash("success", `Xóa ${ids.length} danh mục bài viết thành công!`);

      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await ArticleCategory.updateOne(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy },
          },
        );
      }
      req.flash(
        "success",
        `Cập nhật vị trí ${ids.length} danh mục bài viết thành công!`,
      );

      break;
    default:
      break;
  }
  res.redirect(req.headers.referer);
};

// [GET]  /admin/articles-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };
    const record = await ArticleCategory.findOne(find);

    let findTree = {
      deleted: false,
    };

    const records = await ArticleCategory.find(findTree);
    const newRecords = createTreeHelper.createTree(records);

    res.render("admin/pages/articles-category/edit", {
      pageTitle: "Chỉnh sửa danh mục bài viết",
      record: record,
      records: newRecords,
    });
  } catch (error) {
    req.flash("error", "Danh mục bài viết không tồn tại!");
    res.redirect(`${systemConfig.prefixAdmin}/articles-category`);
  }
};

// [PATCH]  /admin/articles-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };

    req.body.position = parseInt(req.body.position);
    await ArticleCategory.updateOne(
      {
        _id: id,
      },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      },
    );
    req.flash("success", "Cập nhật danh mục bài viết thành công!");
    res.redirect(req.headers.referer);
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(req.headers.referer);
  }
};

// [GET]  /admin/articles-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };
    const record = await ArticleCategory.findOne(find)
      .populate("createdBy.account_id", "fullName")
      .populate("updatedBy.account_id", "fullName");

    if (record.parent_id) {
      const parent = await ArticleCategory.findOne({
        _id: record.parent_id,
        deleted: false,
      });

      if (parent) {
        record.parent_title = parent.title;
      }
    } else {
      record.parent_title = "Không có";
    }

    res.render("admin/pages/articles-category/detail", {
      pageTitle: record.title,
      record: record,
    });
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(`${systemConfig.prefixAdmin}/articles-category`);
  }
};

// [DELETE]  /admin/articles/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await ArticleCategory.updateOne(
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
  req.flash("success", "Xóa danh mục bài viết thành công!");
  res.redirect(req.headers.referer);
};
