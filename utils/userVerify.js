const jwt = require("jsonwebtoken");
// 判断用户令牌是否有效\
// TODO:判断用户令牌是否过期
function isTokenExpired(token) {
  var decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("查看令牌过期时间", decoded);
}
module.exports = isTokenExpired;
