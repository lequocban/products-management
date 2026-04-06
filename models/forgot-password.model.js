const { default: mongoose } = require("mongoose");
const generate = require("../helper/generate");

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expiredAt: {
      type: Date,
      expires: 180, // OTP sẽ tự động hết hạn sau 3 phút (180 giây)
    },
  },
  {
    timestamps: true,
  },
);
const ForgotPassword = mongoose.model(
  "ForgotPassword",
  forgotPasswordSchema,
  "forgot-password",
);

module.exports = ForgotPassword;
