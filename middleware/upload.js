const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path"); // 是 nodejs 中用于处理文件/目录路径的一个内置模块
const { log } = require("console");
// 只是成功将文件存起来了，但是浏览器通过路径拿不到文件，需要解决下。原因：Express默认不会暴露静态目录

// 配置存储规则
const storage = multer.diskStorage({
  // diskStorage：使用磁盘存储
  destination: function (req, file, cb) {
    console.log("上传的文件file", typeof file, file);

    // 根据文件类型选择存储目录
    let dir = "";
    if (file.fieldname === "dictationAudio") {
      dir = "uploads/audio";
    } else if (file.fieldname === "dictationText") {
      dir = "uploads/text";
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名：uuid + 原始扩展名
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`; // path.extname用来获取文件拓展名
    cb(null, uniqueName);
  },
});

// 文件类型过滤
const fileFilter = (req, file, cb) => {
  console.log("后端收到的file", file);
  console.log("后端收到的file.mimetype", file.mimetype);
  const allowedTypes = {
    dictationAudio: ["audio/mpeg", "audio/mp3"], // MP3 MIME 类型
    dictationText: ["text/plain", "application/pdf"], // TXT/PDF
  };

  if (allowedTypes[file.fieldname]?.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("文件类型不合法"), false);
  }
};

// 创建上传中间件（自定义上传中间件）
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 50, // 单个文件最大 50MB
  },
});

module.exports = upload;
