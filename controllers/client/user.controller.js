const User = require("../../models/user.model");

const md5 = require("md5");

// [GET] /user/register
exports.register = (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

// [POST] /user/register
exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (existEmail) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect(req.headers.referer);
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
  });
  await user.save();
  res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Đăng ký tài khoản thành công!");
  res.redirect("/");
};

// [GET] /user/login
exports.login = (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

// [POST] /user/login
exports.loginPost = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(req.headers.referer);
    return;
  }
  if(md5(req.body.password) !== user.password) {
    req.flash("error", "Mật khẩu không chính xác!");
    res.redirect(req.headers.referer);
    return;
  }
  if(user.status === "inactive") {
    req.flash("error", "Tài khoản của bạn đã bị khóa!");
    res.redirect(req.headers.referer);
    return;
  }
  res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Đăng nhập tài khoản thành công!");
  res.redirect("/");
};
