const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 3001;
require("dotenv").config();

//中间件配置
app.use(cors()); // 允许跨域
app.use(bodyParser.json()); // 解析JSON请求

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`Node后端服务器已启动 on http://localhost:${PORT}`);
});

// 连接数据库
const mongoose = require("mongoose");
// 链接MongoDB地址
mongoose
  .connect(process.env.DATABASE_ADDRESS, {})
  .then(() => console.log("MongoDB链接成功"))
  .catch((err) => console.error("MongoDB连接失败：", err));

// 关闭服务器
const closeMongoose = async () => {
  console.log("捕捉到终止信号");
  await mongoose.connection.close();
  console.log("数据库已断开");
  server.close(() => {
    console.log("服务器已关闭");
    process.exit(0);
  });
};

process.on("SIGTERM", closeMongoose); // 捕获终止信号
process.on("SIGINT", closeMongoose); // 捕获 Ctrl+C

// 请求路由
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
