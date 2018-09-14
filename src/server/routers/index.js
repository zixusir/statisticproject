const router = require('koa-router')()
// const fs = require('fs')

router.get('/test', async (ctx, next) => {
  console.log('get request' + '/test')
  let html = `<p>if you see me, that means router work!</P>`
  ctx.body = html
})

module.exports = router
