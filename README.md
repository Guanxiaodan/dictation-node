# 运行服务器：

`node index.js` 或 `npm run dev`

**开发状态建议使用 npm run dev**
**生产状态建议使用 node index.js**

访问 http://localhost:3001 验证是否返回成功消息。

# 安装的库

- [multer](https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md "multer"): 处理文件上传。Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件。
- uuid: 生成唯一文件名（避免重名覆盖）
- bcrypt： 密码盐化和哈希加密
- body-parser ：解析请求中的 JSON 数据
- cookie-parser ：设置和解析 Cookie 的中间件
- cors ：处理跨域问题
- dayjs ：时间处理工具
- dotenv ：使用.env 环境变量
- jsonwebtoken ：JWT，设置用户认证用的 token
