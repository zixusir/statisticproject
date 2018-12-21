import Koa from 'koa'
import Path from 'path'
import StaticServer from 'koa-static'
import BodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import Cors from 'koa2-cors' // during development allow cors
import Database from '../database/index'

const app = new Koa()
let serverRouter = new Router()
let server
let data
let dataFile
// let netSta = null
app.use(Cors())

// 静态文件服务
const staticPath = './static'
app.use(StaticServer(Path.join(__dirname, staticPath)))

app.use(BodyParser())

// 路由
let submit = async function (ctx) {
  console.log(ctx.request.body)
  ctx.response.body = {
    'success': true,
    'message': '添加数据成功'
  }
  let data = {
    content: ctx.request.body
  }
  Database.insert(dataFile, data)
}
let stadata = async function (ctx) {
  console.log(data)
  ctx.response.body = data
}
let findsta = async function (ctx) {
  let ctxparams = ctx.params
  console.log('sever get request')
  console.log(ctxparams.staname)
  await Database.findStaByName(ctxparams.staname).then((staContent) => {
    console.log(staContent)
    ctx.response.body = staContent
  })
}
serverRouter
  .post('/api/submit', submit)
  .get('/api/stadata', stadata)
  .get('/api/findsta/:staname', findsta)
app.use(serverRouter.routes()).use(serverRouter.allowedMethods())

let startServer = function (arg1) {
  if (server) {
    server.close()
  }
  server = app.listen(5050)
  data = arg1
  console.log('Your server is starting at port 5050')
  console.log(server)
}

let stopServer = function () {
  server.close()
  console.log('Your server is closed')
  console.log(server)
}

export default {
  startServer,
  stopServer
}
