const express = require("express");
const router = express.Router();
const StudyInfo = require("../models/StudyInfo");
const dayjs = require("dayjs");
const { authenticate } = require("../controllers/userVerify");
const {
  getStudyInfo,
  updateStudyProgress,
  createStudyInfo,
} = require("../controllers/studyController");
// api/studyInfo?userId=682af18697b3ad5da415e4e5     用req.query.userId获取
// /api/studyInfo/:userId 也就是 api/studyInfo/682af18697b3ad5da415e4e5   用req.params.userId获取
// post请求 用req.params来获取参数

// API请求正常，数据正常
const API_CODE = {
  200: "success",
  403: "API请求正常，客户端请求数据异常",
  301: "API请求正常，空数据",
  401: "API请求正常，登录异常",
  500: "服务器出现错误",
};

// 创建学习记录
router.post("/:userId", async (req, res) => {
  try {
    const studyInfo = await createStudyInfo(req.params.userId);
    res.status(201).json(studyInfo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 更新学习进度
router.patch("/:userId/progress", async (req, res) => {
  try {
    const { courseId, progress } = req.body;
    const updatedInfo = await updateStudyProgress(
      req.params.userId,
      courseId,
      progress
    );
    res.json(updatedInfo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 查询学习数据
router.get("/", authenticate, async (req, res) => {
  console.log("进来查询学习数据了吗req.query", req.query.userId);
  try {
    const studyInfo = await getStudyInfo(req.query.userId);
    res.json(studyInfo);
  } catch (err) {
    res.status(301).json({ message: err.message });
  }
});

module.exports = router;
