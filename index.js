const express = require("express");
const bodyParser = require("body-parser");
const connectMongoose = require("./mongo");
const cors = require("cors");
const app = express();
const PORT = 3001;

//中间件配置
app.use(cors()); // 允许跨域
app.use(bodyParser.json()); // 解析JSON请求

// 启动服务器
app.listen(PORT, () => {
  console.log(`Node后端服务器已启动 on http://localhost:${PORT}`);
});
connectMongoose();

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
