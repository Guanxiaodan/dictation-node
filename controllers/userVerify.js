const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// 检查密码是否正确
async function checkPassword(password, salt, originalPassword) {
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword === originalPassword;
}

// 认证中间件：从 Cookie 提取token，并判断令牌是否有效
const authenticate = (req, res, next) => {
  const token = req.cookies.authToken;
  // 如果没有种cookie；或者浏览器判断cookie的MaxAge过期了，就不会在请求中携带cookie
  if (!token) {
    return res.status(401).json({ message: "未提供认证令牌，请重新登陆" });
  }

  // 验证token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // 在请求头中添加用户的userId
    next();
  } catch (error) {
    res.clearCookie("authToken"); // 清除无效 Cookie
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "令牌过期" });
    }
    return res.status(401).json({ message: "无效令牌" });
  }
};

module.exports = {
  authenticate,
  checkPassword,
};
