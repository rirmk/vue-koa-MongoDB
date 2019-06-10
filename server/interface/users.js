import Router from 'koa-router';
import Redis from 'koa-redis';
import nodeMailer from 'nodemailer';
import User from '../dbs/models/users';
import Passport from './utils/passport'
import Email from '../dbs/config'
import axios from './utils/axios'

let router = new Router({
  prefix: '/users'
})

let Store = new Redis().client

router.post('/signup',async (ctx)=>{
  const {
    username,
    password,
    email,
    tel,
    WeChat,
    code
  } = ctx.request.body;

  if(code){
    const saveCode = await Store.hget(`nodemail:${username}`,'code')
    const saveExpire = await Store.hget(`nodemail:${username}`,'expire')
    if(code===saveCode){
      if(new Date().getTime() - saveExpire > 0){
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    }else{
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  }else{
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }

  let user = await User.find({
    username
  })
  if(user.length){
    ctx.body={
      code: -1,
      msg: '用户名已被注册'
    }
    return
  }

  let nuser = await User.create({
    username,
    password,
    WeChat,
    tel,
    email,
    photos:"//s0.meituan.net/bs/fe-web-meituan/2d05c2b/img/avatar.jpg",
    ban:false
  })
  if(nuser){
    let res = await axios.post('/users/signin',{
      username,
      password
    })
    if(res.data && res.data.code===0){
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    }else{
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
  }else{
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})

router.post('/signin',async (ctx,next)=>{
  return Passport.authenticate('local',function (err,user,info,status) {
    if(err){
      ctx.body = {
        code: -1,
        msg: err
      }
    }else{
      if(user){
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        return ctx.login(user)
      }else{
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx,next)
})

router.post('/verify',async (ctx,next)=>{
  let username = ctx.request.body.username
  const saveExpire = await Store.hget(`nodemail:${username}`,'expire')
  if(saveExpire && new Date().getTime() - saveExpire < 0){
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内1次'
    }
    return false
  }

  let transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    secure: false,
    auth:{
      user:Email.smtp.user,
      pass:Email.smtp.pass
    }
  })

  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }

  let mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`,
    to: ko.email,
    subject: '即刻网注册码',
    html: `您在即刻网中注册，您的邀请码是${ko.code}`
  }

  await transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
      return console.log('error')
    }else{
      Store.hmset(`nodemail:${ko.user}`,'code',ko.code,'expire',ko.expire,'email',ko.email)
    }
  })

  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  }
})

router.get('/exit',async (ctx,next)=>{
  await ctx.logout()
  if(!ctx.isAuthenticated()){
    ctx.body = {
      code: 0
    }
  }else{
    ctx.body = {
      code: -1
    }
  }
})

router.get('/getUser',(ctx,next)=>{
  if(ctx.isAuthenticated()){
    const {username, WeChat,tel,photos,email,ban} = ctx.session.passport.user
    ctx.body = {
      user:username,
      email,
      WeChat,
      photos,
      tel,
      ban
    }
  }else{
    ctx.body = {
      user: '',
      email: '',
      WeChat:'',
      tel:'',
      photos:'',
    }
  }
})

router.get('/findUser',async (ctx,next) => {
  const {username} = ctx.query;
  let result = await User.findOne({
    username
  })
  if(result){
    ctx.body = {
      code: 0,
      user: result
    }
  }else{
    ctx.body = {
      code: -1,
      user: {}
    }
  }

})

router.get('/getAllUser',async (ctx) => {
  const users = await User.find()
  if(users){
    ctx.body = {
      users
    }
  }else{
    ctx.body = {
      users: []
    }
  }
})

router.post('/updateUser',async (ctx) =>{
  const {username,WeChat,password} = ctx.request.body;
  let result = await User.updateOne({username:username},{WeChat:WeChat,password:password})
  if(result){
    ctx.body = {
      code: 0
    }
  }else{
    ctx.body = {
      code: -1
    }
  }
})

router.get('/deleteUser',async (ctx) => {
  const {username} = ctx.query;
  let result = await User.deleteOne({username:username})
  if(result){
    ctx.body = {
      code: 0
    }
  }else{
    ctx.body = {
      code: -1
    }
  }
})

router.get('/banUser',async (ctx) =>{
  const {username} = ctx.query;
  let result = await User.updateOne({username:username},{ban:"true"})
  if(result){
    ctx.body = {
      code: 0
    }
  }else{
    ctx.body = {
      code: -1
    }
  }
})

router.get('/unBanUser',async (ctx) =>{
  const {username} = ctx.query;
  let result = await User.updateOne({username:username},{ban:"false"})
  if(result){
    ctx.body = {
      code: 0
    }
  }else{
    ctx.body = {
      code: -1
    }
  }
})

export default router
