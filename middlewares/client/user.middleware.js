const User = require("../../models/user.model");

module.exports.infoUser = async (req, res, next) => {
  try {
    if (req.cookies.tokenUser) {
      // Tìm user trong DB dựa vào token
      const user = await User.findOne({
        tokenUser: req.cookies.tokenUser,
        deleted: false,
      }).select("-password"); // Không lấy password ra ngoài cho an toàn

      if (user) {
        // Gán vào biến global để mọi file Pug đều đọc được
        res.locals.user = user;
      }
    }

    next();
  } catch (error) {
    console.log(error);
    next();
  }
};
