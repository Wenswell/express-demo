const express = require('express')
const router = express.Router()
const fs = require('fs')

const app = express()

// 引入&使用 EJS 模板引擎
const ejs = require('ejs');
app.set('view engine', 'ejs');

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

// 路由是指确定应用程序如何响应客户端对特定端点的请求，该端点是 URI（或路径）和特定的 HTTP 请求方法（GET、POST 等）。
// 路由定义的结构：app.METHOD(PATH, HANDLER)
// METHOD：HTTP请求方法，小写
// PATH：服务器上的路径
// HANDLER：路由匹配时执行
// HANDLER的2个参数req，res
// req = request
// res = response

// 所有请求
// 中间件执行后传递至此处处理（与中间件效果类似）
router.all('*', function (req, res, next) {
  console.log('all * 捕获')
  next()
})

// 上传文件
router.post('/upload', (req, res) => {
  // 获取所有上传的文件
  const files = req.files

  if (!files) {
    res.send({
      code: 400,
      msg: "上传文件不能为空"
    })
    return
  }

  const fileNameList = []

  // 遍历所有文件
  files.forEach(file => {

    // 获取文件名和后缀
    const lastDotIndex = file.originalname.lastIndexOf('.');
    // const filename = file.originalname.substring(0, lastDotIndex);
    const ext = file.originalname.substring(lastDotIndex + 1);

    // 使用时间戳作为新文件名      
    const newFilename = Date.now() + '.' + ext;

    // 移动并修改文件名
    fs.renameSync(
      process.cwd() + '/public/upload/temp/' + file.filename,
      process.cwd() + '/public/upload/' + newFilename
    )

    // 收集文件名用于返回
    fileNameList.push(`/public/upload/${newFilename}`)

    // 保存文件时使用新文件名    
    // file.mv(`files/${newFilename}`, err => {
    //   res.status(500).send(err);
    // })
  })

  res.send({
    code: 200,
    msg: "ok",
    data: fileNameList,
  })

})

// 下载文件
router.get('/download', async (req, res) => {
  // 获取查询参数中的文件名
  const fileName = req.query.fileName;
  // 构建文件的完整路径
  const filePath = `${process.cwd()}/public/upload/${fileName}`;
  // 使用 res.download() 方法发送文件给客户端进行下载
  res.download(filePath);
  // .download 完整方法：
  // res.download(filePath, 'img.png', err=>{
  //   if(err){
  //     // 处理错误
  //   } else {
  //     // 下载成功后执行，比如扣除积分
  //   }
  });

});











// 以下为通用匹配

// GET 请求处理程序
router.get('/*', (req, res) => {
  const { method, path, params, headers, cookies, body, ip, protocol, query } = req;
  const renderedTemplate = ejs.render(template, { method, path, params, headers, cookies, body, ip, protocol, query });
  res.send(renderedTemplate);
});

// POST 请求处理程序
router.post('/*', (req, res) => {
  const { method, path, params, headers, cookies, ip, protocol, body } = req;
  const renderedTemplate = ejs.render(template, { method, path, params, headers, cookies, ip, protocol, query: {}, body });
  res.send(renderedTemplate);
});

// PUT 请求处理程序
router.put('/*', (req, res) => {
  const { method, path, params, headers, cookies, ip, protocol, body } = req;
  const renderedTemplate = ejs.render(template, { method, path, params, headers, cookies, ip, protocol, query: {}, body });
  res.send(renderedTemplate);
});

// DELETE 请求处理程序
router.delete('/*', (req, res) => {
  const { method, path, params, headers, cookies, ip, protocol, body } = req;
  const renderedTemplate = ejs.render(template, { method, path, params, headers, cookies, ip, protocol, query: {}, body });
  res.send(renderedTemplate);
});

module.exports = router