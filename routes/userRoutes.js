const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");

// 用户注册
router.post("/", async (req, res) => {
  try {
    console.log("新增用户user请求体", req.body);
    // 将新用户保存到数据库
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    // 生成认证令牌
    // TODO:生成令牌后，令牌怎么在后端用起来呢

    const token = jwt.sign(
      { userId: savedUser._id, expirseDate: dayjs().add(1, "year") },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      userId: savedUser._id,
      userName: savedUser.userName,
      userEmail: savedUser.userEmail,
      createdAt: savedUser.createdAt,
      avatar: savedUser?.avatar || "",
      token,
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
  console.log("更新用户信息");
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
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "用户已删除" });
  } catch (err) {
    res.status(404).json({ error: "用户不存在" });
  }
});

module.exports = router;
