const { default: mongoose } = require("mongoose");

const settingGeneralSchema = new mongoose.Schema(
  {
    WebsiteName: String,
    WebsiteLogo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String, 
  },
  {
    timestamps: true,
  },
);
const SettingGeneral = mongoose.model("SettingGeneral", settingGeneralSchema, "settings-general");

module.exports = SettingGeneral;
