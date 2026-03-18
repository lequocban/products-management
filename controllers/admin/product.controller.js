const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const systemConfig = require("../../config/system");

// [GET]  /admin/products
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
  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts,
  );

  // end pagination

  const lstProduct = await Product.find(find)
    .sort({ position: "desc" })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/products/index", {
    pageTitle: "Trang sản phẩm",
    products: lstProduct,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH]  /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công!");

  res.redirect(req.headers.referer);
};

// [PATCH]  /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`,
      );
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`,
      );
      break;
    case "delete-multi":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date(),
        },
      );
      req.flash("success", `Xóa ${ids.length} sản phẩm thành công!`);

      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
      req.flash(
        "success",
        `Cập nhật vị trí ${ids.length} sản phẩm thành công!`,
      );

      break;
    default:
      break;
  }
  res.redirect(req.headers.referer);
};

// [DELETE]  /admin/products/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
    },
  );
  // await Product.deleteOne({ _id: id });
  req.flash("success", "Xóa sản phẩm thành công!");
  res.redirect(req.headers.referer);
};

// [GET]  /admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
  });
};

// [POST]  /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }


  const product = new Product(req.body);
  await product.save();

  req.flash("success", "Thêm sản phẩm mới thành công!");

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET]  /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);

    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
    });
  } catch (error) {
    req.flash("error", "Sản phẩm không tồn tại!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH]  /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    await Product.updateOne(
      {
        _id: id,
      },
      req.body,
    );
    req.flash("success", "Cập nhật sản phẩm thành công!");
    res.redirect(req.headers.referer);
  } catch (error) {
    req.flash("error", "Lỗi!");
    res.redirect(req.headers.referer);
  }
};


// [GET]  /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    req.flash("error", "Sản phẩm không tồn tại!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
