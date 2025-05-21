const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const UploadFile = require("../models/UploadFile");
// TODO:只是把文件上传上来了，但是很多细化的工作还没做，

// 上传音频和文本文件
router.post(
  "/uploadAudio",
  upload.fields([
    { name: "dictationAudio", maxCount: 1 },
    { name: "dictationText", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log("请求走进来了吗", req.files);
    try {
      const { userId } = req.body; // 假设前端传递 userId

      // 获取文件信息
      const files = req.files;
      const dictationAudio = files.dictationAudio?.[0];
      const dictationText = files.dictationText?.[0];

      // 校验必要文件
      if (!dictationAudio || !dictationText) {
        return res.status(400).json({ message: "必须上传音频和文本文件" });
      }
      console.log("存储路径 dictationAudio.path-->", dictationAudio.path);
      // 保存记录到数据库（关联 UploadFile）
      const uploadInfo = await UploadFile.create({
        audioPath: dictationAudio.path, // 存储相对路径
        textPath: dictationText.path,
        originalNames: {
          audio: dictationAudio.originalname,
          text: dictationText.originalname,
        },
      });

      res.status(200).json({
        message: "文件上传成功",
        files: {
          audio: dictationAudio.originalname,
          text: dictationText.originalname,
        },
        uploadInfo,
      });
    } catch (err) {
      console.log("报了什么错", err);
      res.status(403).json({ message: err.message });
    }
  }
);

// 查询所有上传的文件
router.get("/", async (req, res) => {
  try {
    const dictationFiles = await UploadFile.find();
    res.json(dictationFiles);
  } catch (err) {
    res.status(500).json({ error: "查询失败" });
  }
});

module.exports = router;
