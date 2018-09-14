// const Koa = require('koa')
// const Path = require('path')
// const StaticServer = require('koa-static')
// const BodyParser = require('koa-bodyparser')
import Koa from 'koa'
import Path from 'path'
import StaticServer from 'koa-static'
import BodyParser from 'koa-bodyparser'
import Router from 'koa-router'

const app = new Koa()
let serverRouter = new Router()
let server = null

// 静态文件服务
const staticPath = './static'
app.use(StaticServer(Path.join(__dirname, staticPath)))

app.use(BodyParser())

// 路由
let submit = function (ctx) {
  ctx.response.type = 'html'
  ctx.response.body = '<a href="/">你的提交已收到</a>'
}
serverRouter.get('/submit', submit)
app.use(serverRouter.routes()).use(serverRouter.allowedMethods())

let startServer = function () {
  server = app.listen(5050)
  console.log('Your server is starting at port 5050')
}

let stopServer = function () {
  server.close()
  console.log('Your server is closed')
}

export default {
  startServer,
  stopServer
}
