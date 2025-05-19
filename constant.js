const { useClientDomain } = require("./utils");
const corsOptions = {
  origin: useClientDomain(), // 或动态白名单函数
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true, // 允许跨域携带 Cookie
};

module.exports = {
  corsOptions,
};
