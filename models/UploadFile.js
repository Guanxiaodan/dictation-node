const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  materials: [
    {
      audioPath: String, // 存储路径如 "uploads/audio/xxx.mp3"
      textPath: String, // 存储路径如 "uploads/text/xxx.pdf"
      originalNames: {
        audio: String,
        text: String,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// 创建并导出 UploadFile 模型
module.exports = mongoose.model("UploadFile", uploadSchema);
