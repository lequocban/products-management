const Article = require("../../models/article.model");
const ArticleCategory = require("../../models/article-category.model");

const createTreeHelper = require("../../helper/createTree");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const systemConfig = require("../../config/system");

// [GET]  /admin/articles
module.exports.index = async (req, res) => {

  //Filter
  const filterStatus = filterStatusHelper(req.query);
  //end filter

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  //search
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  //end search

  // pagination
  const countRecords = await Article.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countRecords,
  );

  // end pagination

  // sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // end sort

  const records = await Article.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    .populate("createdBy.account_id", "fullName")
    .populate("updatedBy.account_id", "fullName");

  res.render("admin/pages/articles/index", {
    pageTitle: "Trang bài viết",
    records: records,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH]  /admin/articles/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  await Article.updateOne(
    { _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    },
  );

  req.flash("success", "Cập nhật trạng thái thành công!");

  res.redirect(req.headers.referer);
};

// [PATCH]  /admin/articles/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  switch (type) {
    case "active":
      await Article.updateMany(
        { _id: { $in: ids } },
        {
          status: "active",
          $push: { updatedBy: updatedBy },
        },
      );
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} bài viết thành công!`,
      );
      break;
    case "inactive":
      await Article.updateMany(
        { _id: { $in: ids } },
        {
          status: "inactive",
          $push: { updatedBy: updatedBy },
        },
      );
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} bài viết thành công!`,
      );
      break;
    case "delete-multi":
      await Article.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          },
        },
      );
      req.flash("success", `Xóa ${ids.length} bài viết thành công!`);

      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Article.updateOne(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy },
          },
        );
      }
      req.flash(
        "success",
        `Cập nhật vị trí ${ids.length} bài viết thành công!`,
      );

      break;
    default:
      break;
  }
  res.redirect(req.headers.referer);
};

// [DELETE]  /admin/articles/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Article.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    },
  );
  // await Product.deleteOne({ _id: id });
  req.flash("success", "Xóa sản bài viết công!");
  res.redirect(req.headers.referer);
};

// [GET]  /admin/articles/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ArticleCategory.find(find);
  const newRecords = createTreeHelper.createTree(records);
  res.render("admin/pages/articles/create", {
    pageTitle: "Thêm mới sản phẩm",
    category: newRecords,
  });
};

// [POST]  /admin/articles/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const countRecords = await Article.countDocuments();
    req.body.position = countRecords + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy = {
    account_id: res.locals.user.id,
  };

  const record = new Article(req.body);
  await record.save();

  req.flash("success", "Thêm bài viết mới thành công!");

  res.redirect(`${systemConfig.prefixAdmin}/articles`);
};

// [GET]  /admin/articles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };
    const record = await Article.findOne(find);

    let findTree = {
      deleted: false,
    };

    const records = await ArticleCategory.find(findTree);
    const newRecords = createTreeHelper.createTree(records);

    res.render("admin/pages/articles/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      record: record,
      category: newRecords,
    });
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(`${systemConfig.prefixAdmin}/articles`);
  }
};

// [PATCH]  /admin/articles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);

    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };

    await Article.updateOne(
      {
        _id: id,
      },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      },
    );
    req.flash("success", "Cập nhật bài viết thành công!");
    res.redirect(req.headers.referer);
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(req.headers.referer);
  }
};

// [GET]  /admin/articles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };
    const record = await Article.findOne(find)
      .populate("createdBy.account_id", "fullName")
      .populate("updatedBy.account_id", "fullName")
      .populate({
        path: "article_category_id",
        select: "title",
        match: { deleted: false, status: "active" },
      });

    res.render("admin/pages/articles/detail", {
      pageTitle: record.title,
      record: record,
    });
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
