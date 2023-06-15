// 中文官网 https://www.expressjs.com.cn/
// 调试工具 https://apifox.com/

// 每次更改后都要重启服务器

// 引入express
const express = require('express')
// 创建一个 express 的实例 app
const app = express()
// 指定端口
const port = 3123

// 引入&使用 EJS 模板引擎
const ejs = require('ejs');
app.set('view engine', 'ejs');

// 引入 path
const path = require('path')
// console.log("__dirname ",__dirname)
// console.log("__filename",__filename)



// 路由是指确定应用程序如何响应客户端对特定端点的请求，该端点是 URI（或路径）和特定的 HTTP 请求方法（GET、POST 等）。
// 路由定义的结构：app.METHOD(PATH, HANDLER)
// METHOD：HTTP请求方法，小写
// PATH：服务器上的路径
// HANDLER：路由匹配时执行
// HANDLER的2个参数req，res
// req = request
// res = response

// 定义模板
const template = `
<html>
 <head>
  <style>
    #requset-info-table{zoom:0.75;border-collapse:collapse;border:2px solid #c8c8c8;letter-spacing:1px;table-layout:fixed;max-width:100vw;margin:auto}#requset-info-table caption{font-size:1.5em;font-weight:bold;margin:.25em}#requset-info-table thead{background-color:#307998aa;color:#fff}#requset-info-table tbody{background-color:#30799811}#requset-info-table td,#requset-info-table th{border:1px solid #bebebe;padding:5px 10px}#requset-info-table th{max-width:30vw}#requset-info-table td{font-family:'Consolas',monospace;min-width:60vw;max-width:80vw;word-wrap:break-word}#requset-info-table .headers td{zoom:.5}
  </style>
 </head>
 <body>
  <table id="requset-info-table"> 
   <caption>
    Request Information
   </caption> 
   <thead> 
    <tr> 
     <th>Property</th> 
     <th>Value</th> 
    </tr> 
   </thead> 
   <tbody> 
    <tr> 
     <th>Method</td> 
     <td><%= method %></td> 
    </tr> 
    <tr> 
     <th>Path</td> 
     <td><%= path %></td> 
    </tr> 
    <tr> 
     <th>Query</td> 
     <td><%= JSON.stringify(query) %></td> 
    </tr> 
    <tr> 
     <th>Params</td> 
     <td><%= JSON.stringify(params) %></td> 
    </tr> 
    <tr class="headers"> 
     <th>Headers</td> 
     <td><%= JSON.stringify(headers) %></td> 
    </tr> 
    <tr> 
     <th>Cookies</td> 
     <td><%= JSON.stringify(cookies) %></td> 
    </tr> 
    <tr> 
     <th>Body</td> 
     <td><%= JSON.stringify(body) %></td> 
    </tr> 
    <tr> 
     <th>IP</td> 
     <td><%= ip %></td> 
    </tr> 
    <tr> 
     <th>Protocol</td> 
     <td><%= protocol %></td> 
    </tr> 
    <!-- 添加其他需要的属性 --> 
   </tbody> 
  </table>
 </body>
</html>
`;

// 全局中间件

// express 自带
// 解析 POST 请求传来的 body 中的 JSON
app.use(express.json())

// 当客户端访问匹配的路径时,Express 直接返回对应的静态文件,不需要额外的路由处理
app.use(express.static(path.join(__dirname, 'public')));

// 默认导向router
const router = require('./router')
app.use(router)
// 完整：app.use('/route-test', require('./router'))

// 固定代码：开放跨域请求
app.use(function (req, res, next) {
  // 允许来自所有域名的请求
  res.header("Access-Control-Allow-Origin", "*");
  // 允许请求带有Content-Type头
  res.header("Access-Control-Allow-Headers", "content-type");
  // 允许的HTTP方法
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  // 如果是预检请求(OPTIONS),则返回状态200
  if (req.method == "OPTIONS") res.sendStatus(200);
  // 不是预检请求,则继续向下执行其他路由或中间件函数
  else next();
})

// 所有请求
// 中间件执行后传递至此处处理（与中间件效果类似）
app.all('*', function (req, res, next) {
  console.log('all * 捕获')
  next()
})

// GET 请求处理程序
app.get('/*', (req, res) => {
  const { method, path, params, headers, cookies, body, ip, protocol, query } = req;
  const renderedTemplate = ejs.render(template, { method, path, params, headers, cookies, body, ip, protocol, query });
  res.send(renderedTemplate);
});

// POST 请求处理程序
app.post('/', (req, res) => {
  const { method, path, params, headers, cookies, ip, protocol, body } = req;
  const renderedTemplate = ejs.render(template, { method, path, params, headers, cookies, ip, protocol, query: {}, body });
  res.send(renderedTemplate);
});

// PUT 请求处理程序
app.put('/', (req, res) => {
  const { method, path, params, headers, cookies, ip, protocol, body } = req;
  const renderedTemplate = ejs.render(template, { method, path, params, headers, cookies, ip, protocol, query: {}, body });
  res.send(renderedTemplate);
});


// DELETE 请求处理程序
app.delete('/', (req, res) => {
  const { method, path, params, headers, cookies, ip, protocol, body } = req;
  const renderedTemplate = ejs.render(template, { method, path, params, headers, cookies, ip, protocol, query: {}, body });
  res.send(renderedTemplate);
});



// 监听端口
app.listen(port, () => {
  // 启动成功时执行
  console.log(`Example app listening on port ${port}`)
})
