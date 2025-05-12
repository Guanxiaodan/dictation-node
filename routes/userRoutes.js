const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 创建用户
router.post("/", async (req, res) => {
  try {
    console.log("新增用户user请求体", req.body);
    // TODO:需要对密码进行哈希处理
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(200).json({
      userId: savedUser._id,
      userName: savedUser.userName,
      userEmail: savedUser.userEmail,
      createdAt: savedUser.createdAt,
      avatar: savedUser?.avatar || "",
    });
  } catch (err) {
    // 错误处理
    if (err.code === 11000) {
      // MongoDB 唯一索引冲突错误
      res.status(400).json({
        success: false,
        message: "用户名已存在", // TODO:改为用户邮箱已存在
      });
    } else {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
});

// 查询所有用户
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "查询失败" });
  }
});

// 更新用户
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: "用户不存在" });
  }
});

// 删除用户
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.arams.id);
    res.json({ message: "用户已删除" });
  } catch (err) {
    res.status(404).json({ error: "用户不存在" });
  }
});

module.exports = router;
