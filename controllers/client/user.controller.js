const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");

const generateHelper = require("../../helper/generate");
const sendMailHelper = require("../../helper/sendMail");

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

  // lưu user_id vào cart collection
  await Cart.updateOne({ _id: req.cookies.cartId }, { user_id: user.id });
  // lưu user_id vào order collection
  await Order.updateMany({ cart_id: req.cookies.cartId }, { user_id: user.id });

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
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
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
    email: email,
    otp: otp,
    expiredAt: Date.now(),
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  // viec 2: gửi email chứa mã otp cho người dùng

  const subject = "Mã OTP đặt lại mật khẩu của bạn";
  const html = `<p>Chào bạn,</p>
    <p>Bạn đã yêu cầu đặt lại mật khẩu. Mã OTP của bạn là:</p>
    <h2> <b>${otp}</b> </h2>
    <p>Lưu ý không chia sẻ mã OTP này với bất kỳ ai.</p>
    <p>Mã OTP này sẽ hết hạn sau 3 phút. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
  `;

  sendMailHelper.sendMail(email, subject, html);

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

// [GET] /user/password/reset
exports.resetPassword = (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đặt lại mật khẩu",
  });
};

// [POST] /user/password/reset
exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne({ tokenUser: tokenUser }, { password: md5(password) });
  req.flash("success", "Đặt lại mật khẩu thành công!");
  res.redirect("/user/login");
};

// [GET] /user/info
exports.info = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  const user = await User.findOne({ tokenUser: tokenUser, deleted: false });
  res.render("client/pages/user/info", {
    pageTitle: "Thông tin tài khoản",
    user: user,
  });
};

// [GET] /user/edit
exports.edit = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  const user = await User.findOne({ tokenUser: tokenUser, deleted: false });
  res.render("client/pages/user/edit", {
    pageTitle: "Chỉnh sửa thông tin tài khoản",
    user: user,
  });
};

// [PATCH] /user/edit
exports.editPatch = async (req, res) => {
  try {
    const tokenUser = req.cookies.tokenUser;
    const user = await User.findOne({ tokenUser: tokenUser, deleted: false }).select("-password -tokenUser");
    if (!req.file) {
      if (req.body.isAvatarDeleted === "true") {
        // Trường hợp 1: Người dùng chủ động bấm X -> Xóa ảnh trong Database
        req.body.avatar = "";
      } else {
        // Trường hợp 2: Người dùng không đụng gì đến ảnh -> Xóa key avatar khỏi req.body để MongoDB không update đè trường này
        delete req.body.avatar;
      }
    }
    const emailExist = await User.findOne({
      _id: { $ne: user.id },
      email: req.body.email,
      deleted: false,
    });
    if (emailExist) {
      req.flash("error", "Email đã tồn tại!");
      res.redirect(req.headers.referer);
      return;
    }
    await User.updateOne({ _id: user.id }, { ...req.body });
    req.flash("success", "Cập nhật thông tin thành công!");
    res.redirect("/user/info");
  } catch (error) {
    req.flash("error", "Tài khoản không tồn tại!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [GET] /user/password/change
exports.changePassword = async (req, res) => {
  res.render("client/pages/user/change-password", {
    pageTitle: "Xác nhận mật khẩu",
  });
};

// [POST] /user/password/change
exports.changePasswordPost = async (req, res) => {
  try {
    const tokenUser = req.cookies.tokenUser;
    const oldPassword = req.body.oldPassword;

    const user = await User.findOne({ tokenUser: tokenUser, deleted: false });

    if (md5(oldPassword) !== user.password) {
      req.flash("error", "Mật khẩu hiện tại không chính xác!");
      res.redirect(req.headers.referer);
      return;
    }

    const email = user.email;
    const otp = generateHelper.generateRandomNumber(6);

    const objectForgotPassword = {
      email: email,
      otp: otp,
      expiredAt: Date.now() + 3 * 60 * 1000, 
    };
    
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    const subject = "Mã OTP xác thực đổi mật khẩu";
    const html = `
      <p>Chào bạn,</p>
      <p>Bạn vừa yêu cầu đổi mật khẩu. Mã OTP xác thực của bạn là:</p>
      <h2><b>${otp}</b></h2>
      <p>Mã này có hiệu lực trong 3 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
    `;
    sendMailHelper.sendMail(email, subject, html);

    // Chuyển hướng sang trang OTP
    res.redirect(`/user/password/otp?email=${email}`);

  } catch (error) {
    // 2. Bắt lỗi nếu có biến nào đó bị undefined gây sập hệ thống
    console.log("Lỗi trong quá trình đổi mật khẩu:", error);
    req.flash("error", "Đã có lỗi xảy ra, vui lòng thử lại!");
    res.redirect("back");
  }
};