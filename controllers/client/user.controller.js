const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");

const generateHelper = require("../../helper/generate");

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
  if (md5(req.body.password) !== user.password) {
    req.flash("error", "Mật khẩu không chính xác!");
    res.redirect(req.headers.referer);
    return;
  }
  if (user.status === "inactive") {
    req.flash("error", "Tài khoản của bạn đã bị khóa!");
    res.redirect(req.headers.referer);
    return;
  }
  res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Đăng nhập tài khoản thành công!");
  res.redirect("/");
};

// [GET] /user/logout
exports.logout = (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};

// [GET] /user/password/forgot
exports.forgotPassword = (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Quên mật khẩu",
  });
};

// [POST] /user/password/forgot
exports.forgotPasswordPost = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(req.headers.referer);
    return;
  }
  // việc 1: tạo mã otp và lưu otp, email vào database
  const otp = generateHelper.generateRandomNumber(6);
  const objectForgotPassword = {
    email: req.body.email,
    otp: otp,
    expiredAt: Date.now(),
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  // viec 2: gửi email chứa mã otp cho người dùng

  res.redirect(`/user/password/otp?email=${req.body.email}`);
};

// [GET] /user/password/otp
exports.otpPassword = (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
};

// [POST] /user/password/otp
exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp.join("");

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    req.flash("error", "Mã OTP không hợp lệ!");
    res.redirect("/user/login");
    return;
  }

  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/user/password/reset");
};
