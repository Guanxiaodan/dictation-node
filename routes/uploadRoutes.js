const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const UploadFile = require("../models/UploadFile"); // TODO:这里需要改一下

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
      // 保存记录到数据库（关联 UserStudyInfo）
      const uploadInfo = await UploadFile.create({
        $push: {
          materials: {
            audioPath: dictationAudio.path.replace("public/", ""), // 存储相对路径
            textPath: dictationText.path.replace("public/", ""),
            originalNames: {
              audio: dictationAudio.originalname,
              text: dictationText.originalname,
            },
          },
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

module.exports = router;
