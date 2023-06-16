const express = require('express')
const router = express.Router()

// 路由是指确定应用程序如何响应客户端对特定端点的请求，该端点是 URI（或路径）和特定的 HTTP 请求方法（GET、POST 等）。
// 路由定义的结构：app.METHOD(PATH, HANDLER)
// METHOD：HTTP请求方法，小写
// PATH：服务器上的路径
// HANDLER：路由匹配时执行
// HANDLER的2个参数req，res
// req = request
// res = response

const { usersRouter, messagesRouter } = require('./database')

router.use('/users', usersRouter) 
router.use('/messages', messagesRouter)

const { wildcardRouter,fileRouter } = require('./default')

router.use(fileRouter)
// 通用匹配放最后
router.use(wildcardRouter)

module.exports = router