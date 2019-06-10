import Koa from "koa"
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const koaBody = require('koa-body')     //文件上传用的
import path from "path"    //文件上传所用
const MyStatic = require('koa-static')
import mongoose from 'mongoose'
/*
import bodyParser from 'koa-bodyparser'   //处理post请求相关的事情
*/
import session from 'koa-generic-session'  //处理cookie以及session相关的事情
import Redis from 'koa-redis'
import json from 'koa-json'
import dbConfig from './dbs/config'
import passport from './interface/utils/passport'
import users from './interface/users'
import geo from './interface/geo'
import search from './interface/search'
import categroy from './interface/categroy'
import edit from './interface/comment'
import cluster from './interface/cluster'
import getUploadDirName from './interface/utils/getUploadDirName'
import getUploadFileExt from './interface/utils/getUploadFileExt'
import getUploadFileName from './interface/utils/getUploadFileName'
import checkDirExist from './interface/utils/checkDirExist'


const app = new Koa()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

//配置session
app.keys=['jk','keyskeys']
app.proxy=true
app.use(session({
  key: 'jk',
  prefix: 'jk:uid',
  store: new Redis()
}))
//配置post方面内容
/*app.use(bodyParser({
  enableTypes:['json','form','text']
}))*/
//使用json
app.use(json())

//文件上传用的
app.use(koaBody({
  multipart:true,
 /* encoding:'gzip',*/
  strict: false,
  formidable:{
    uploadDir:path.join(__dirname,'public/upload'),
    keepExtensions: true,
    maxFieldsSize:2 * 1024 * 1024,
    onFileBegin: (name, file) => {
      // console.log(file);
      // 获取文件后缀
      const ext = getUploadFileExt(file.name);
      // 最终要保存到的文件夹目录
      const dirName = getUploadDirName();
      const dir = path.join(__dirname, `public/upload/${dirName}`);
      // 检查文件夹是否存在如果不存在则新建文件夹
      checkDirExist(dir);
      // 获取文件名称
      const fileName = getUploadFileName(ext);
      // 重新覆盖 file.path 属性
      file.path = `${dir}/${fileName}`;
      app.context.uploadpath = app.context.uploadpath ? app.context.uploadpath : {};
      app.context.uploadpath[name] = `${dirName}/${fileName}`;
    },
    onError:(err)=>{
      console.log(err);
    }
  }
}));
//连接数据库
mongoose.connect(dbConfig.dbs,{
  useNewUrlParser:true
})
//passport处理登录相关内容
app.use(passport.initialize())
app.use(passport.session())
//配置静态文件
const staticPath = './public/upload'
app.use(MyStatic(
  path.join( __dirname, staticPath)
))


// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  //使用路由表
  app.use(categroy.routes()).use(categroy.allowedMethods());
  app.use(users.routes()).use(users.allowedMethods());
  app.use(geo.routes()).use(geo.allowedMethods());
  app.use(search.routes()).use(search.allowedMethods());
  app.use(edit.routes()).use(edit.allowedMethods());
  app.use(cluster.routes()).use(cluster.allowedMethods());
  app.use(ctx => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
