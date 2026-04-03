const Account = require("../../models/account.model");
const md5 = require("md5");

const systemConfig = require("../../config/system");

// [GET]  /admin/my-account
module.exports.index = async (req, res) => {
  try {
    res.render("admin/pages/my-account/index", {
      pageTitle: "Thông tin cá nhân",
    });
  } catch (error) {
    res.send(error.message);
  }
};

// [GET]  /admin/my-account/edit
module.exports.edit = async (req, res) => {
  try {
    res.render("admin/pages/my-account/edit", {
      pageTitle: "Chỉnh sửa thông tin cá nhân",
    });
  } catch (error) {
    res.send(error.message);
  }
};

// [PATCH]  /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  try {
    const id = res.locals.user.id;

    const emailExist = await Account.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false,
    });

    if (emailExist) {
      req.flash("error", "Email đã tồn tại, vui lòng nhập email khác!");
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password);
      } else {
        delete req.body.password;
      }
      const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
      };
      await Account.updateOne(
        {
          _id: id,
        },
        {
          ...req.body,
          $push: { updatedBy: updatedBy },
        },
      );
      req.flash("success", "Cập nhật tài khoản thành công!");
    }
    res.redirect(req.headers.referer);
  } catch (error) {
    req.flash("error", `Lỗi! ${error.message}`);
    res.redirect(req.headers.referer);
  }
};
