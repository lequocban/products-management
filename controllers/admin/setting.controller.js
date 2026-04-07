const { set } = require("mongoose");
const SettingGeneral = require("../../models/setting-general.model");

// [GET] /settings/general
exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  res.render("admin/pages/setting/general", {
    pageTitle: "Cài đặt chung",
    setting: settingGeneral,
  });
};

// [PATCH] /settings/general
exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  if (settingGeneral) {
    await SettingGeneral.findByIdAndUpdate(settingGeneral.id, req.body);
  } else {
    const record = new SettingGeneral(req.body);
    await record.save();
  }

  req.flash("success", "Cập nhật cài đặt chung thành công!");
  res.redirect(req.headers.referer);
};
