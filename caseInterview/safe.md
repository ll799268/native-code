# 安全篇

+ XSS攻击的防范
  跨站脚本攻击，如果不过滤执行的js代码，可能导致Cookie泄漏
  + HttpOnly 防止劫取 Cookie
  + 输入检查-不要相信用户的所有输入
  + 输出检查-存的时候转义或者编码

+ CSRF攻击的防范
  跨站请求伪造，挟制用户在当前已登录的Web应用程序上执行非本意的操作
  + 验证码
  + 写操作用post
  + JSON API 禁用 CORS
  + Referer Check
  + 添加token验证
