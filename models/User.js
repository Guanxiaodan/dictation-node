const mongoose = require("mongoose");
const dayjs = require("dayjs");

const userSchema = new mongoose.Schema({
  userName: { type: String, require: true },
  password: { type: String, require: true },
  userEmail: { type: String, require: true, unique: true },
  avatar: { type: String },
  salt: { type: String },
  createdAt: {
    type: Date,
    default: dayjs(), // TODO:时间不是当地时间，需要改一下
  },
});

// 创建并导出 User 模型
module.exports = mongoose.model("User", userSchema);
