const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const bcrypt = require("bcrypt");
const { checkPassword } = require("../utils/userVerify");

// API请求正常，数据正常
const API_CODE = {
  200: "success",
  403: "API请求正常，数据异常",
  301: "API请求正常，空数据",
  401: "API请求正常，登录异常",
  500: "服务器出现错误",
};

// 用户注册
router.post("/signup", async (req, res) => {
  try {
    console.log("新增用户user请求体", req.body);
    // 密码盐化和哈希加密
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    // 将新用户保存到数据库
    const newUser = new User({ ...req.body, salt });
    const savedUser = await newUser.save();

    // 生成认证令牌,token在客户端存储，不用存到数据库中
    // TODO:生成令牌后，令牌怎么在后端用起来呢
    const token = jwt.sign(
      { userId: savedUser._id, expirseDate: dayjs().add(1, "year") },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      message: "success",
      data: {
        userId: savedUser._id,
        userName: savedUser.userName,
        userEmail: savedUser.userEmail,
        createdAt: savedUser.createdAt,
        avatar: savedUser?.avatar || "",
        token,
      },
    });
  } catch (err) {
    console.log("err请求出错了", err);
    // 错误处理
    if (err.code === 11000) {
      // MongoDB 唯一索引冲突错误
      res.status(403).json({
        success: false,
        message: "用户邮箱已存在",
      });
    } else {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
});

// 用户登陆
router.post("/login", async (req, res) => {
  try {
    console.log("用户登陆body-->", req.body);
    // 从数据库查询用户
    const userArr = await User.find({ userEmail: req.body.userEmail });
    if (userArr.length > 0) {
      const user = userArr[0];
      const passWordIsRight = await checkPassword(
        req.body.password,
        user.salt,
        user.password
      );
      if (passWordIsRight) {
        // 生成认证令牌,token在客户端存储，不用存到数据库中。TODO:生成令牌后，令牌怎么在后端用起来呢
        const token = jwt.sign(
          { userId: user._id, expirseDate: dayjs().add(1, "year") },
          process.env.JWT_SECRET
        );

        res.status(200).json({
          message: "success",
          data: {
            userId: user._id,
            userName: user.userName,
            userEmail: user.userEmail,
            createdAt: user.createdAt,
            avatar: user?.avatar || "",
            token,
          },
        });
      } else {
        res.status(401).json({
          message: "密码错误",
        });
      }
    } else {
      // 没有找到用户
      res.status(301).json({
        message: "用户未注册",
      });
    }
  } catch (err) {
    console.log("err请求出错了", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
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
