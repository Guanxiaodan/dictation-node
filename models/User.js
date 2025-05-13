const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  // TODO:确保email唯一而不是用户名唯一
  userName: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  userEmail: { type: String, require: true },
  avatar: { type: String },
  createdAt: {
    type: Date,
    default: Date.now, // TODO:时间不是当地时间，需要改一下
  },
});

// 密码盐化后哈希加密
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// 创建并导出 User 模型
module.exports = mongoose.model("User", userSchema);
