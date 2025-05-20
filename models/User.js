const mongoose = require("mongoose");
const dayjs = require("dayjs");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
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

// 在保存文档前自动设置 userId
userSchema.pre("save", function (next) {
  if (!this.userId) {
    // 将 _id（ObjectId）转换为字符串后赋值给 userId
    this.userId = this._id.toString();
  }
  next();
});

// 创建并导出 User 模型
module.exports = mongoose.model("User", userSchema);
