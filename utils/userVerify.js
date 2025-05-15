const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// 判断用户令牌是否有效\
// TODO:判断用户令牌是否过期
function isTokenExpired(token) {
  var decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("查看令牌过期时间", decoded);
}

// 检查密码是否正确
async function checkPassword(password, salt, originalPassword) {
  const hashPassword = await bcrypt.hash(password, salt);
  console.log("hashPassword", hashPassword);
  console.log("originalPassword", originalPassword);
  console.log("密码相等吗", originalPassword === hashPassword);
  return hashPassword === originalPassword;
}
module.exports = {
  isTokenExpired,
  checkPassword,
};
