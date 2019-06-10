import Router from 'koa-router'
import md5 from "crypto-js/md5"
import Img from '../dbs/models/images'
import Cluster from '../dbs/models/clusters'
import College from '../dbs/models/colleges'


let router = new Router({prefix: '/cluster'})

router.post('/createCluster',async ctx => {
  const {
    username,
    province,
    city,
    title,
    type,
    tel,
    WeChat,
    dateTime,
    totals,
    college,
    actiContent,
    specLocat,
    desc
  } = ctx.request.body;

  let time = Date()
  let clusterId = md5(Math.random() * 1000 + time).toString()
  let startAndEnd = []
  for(let i = 0;i<dateTime.length;i++){
    let date = dateTime[i].toString().split("T")[0]
    let tempTime = dateTime[i].toString().split("T")[1].split(".")[0]
    let n = Number(tempTime.split(":")[0]) + 8 > 9 ?
      String(Number(tempTime.split(":")[0]) + 8) :
      "0" + String((Number(tempTime.split(":")[0]) + 8))
    let hour = n + ":" + tempTime.split(":")[1] + ":" + tempTime.split(":")[2]
    startAndEnd.push(date + " " + hour)
  }
  let resCollege = await College.findOne({
    city,
    college
  })
  let location = String(resCollege.location);

  let resImg = await Img.find({
    username
  })
  let guidePhoto = []
  let coverPhoto = []
  for(let i = 0;i<resImg.length;i++){
    if(resImg[i].guide){
      guidePhoto.push(resImg[i].guide)
    }
    if(resImg[i].cover){
      coverPhoto.push(resImg[i].cover)
    }
  }
  let cover = {photos: coverPhoto}
  let guide = {photos: guidePhoto,specLocat,desc}

  const {photos} = ctx.session.passport.user
  let member = [{"name" : username,"WeChat" : WeChat,"photos" : photos}]
  if(!ctx.isAuthenticated()){
    ctx.body = {
      code: -1,
      msg: 'please login'
    }
  }else{
    let cluster = new Cluster({
      clusterId,
      title,
      province,
      city,
      type,
      username,
      tel,
      WeChat,
      startTime: startAndEnd[0],
      endTime: startAndEnd[0],
      totals,
      college,
      location,
      actiContent,
      like: [],
      cover,
      guide,
      member
    })
    try{
      let result = await cluster.save()
      if(result){
        await Img.deleteMany({
          "username": username
        })
        ctx.body = {
          code: 0,
          clusterId: clusterId
        }
      }else{
        ctx.body = {
          code: -1
        }
      }
    }catch (e){
      ctx.body = {
        code: -1
      }
    }
  }
})

router.post('/uploadGuide',async (ctx) => {
  if(ctx.isAuthenticated()) {
    const {username} = ctx.session.passport.user
    let img = new Img({
      username,
      guide:ctx.uploadpath.file,
      type:"guide"
    })
    let result = await img.save()
  }
})

router.post('/uploadCover',async (ctx) => {
  if(ctx.isAuthenticated()) {
    const {username} = ctx.session.passport.user
    let img = new Img({
      username,
      cover:ctx.uploadpath.file,
      type:"cover"
    })
    let result = await img.save()
  }
})

router.get('/deleteMember',async (ctx) => {
  const {clusterId,index} = ctx.query
  let cluster = await Cluster.findOne({
    clusterId
  })
  let oldVal = {"member":cluster.member}
  let newVal = {"member":cluster.member.splice(index,1)}

  let result = await cluster.updateOne(oldVal,newVal)
  if(result){
    let cluster = await Cluster.findOne({
      clusterId
    })
    ctx.body = {
      code: 0,
      member: cluster.member
    }
  }
})

router.get('/addMember',async (ctx) => {
  const {username,WeChat,photos,tel,clusterId} = ctx.query;
  let cluster =await Cluster.findOne({
    clusterId
  })
  let oldVal = {"member": cluster.member}
  let memberChild = {"name": username,"WeChat": WeChat,"tel": tel,"photos": photos}
  let newArray = cluster.member.push(memberChild)
  let newVal = {"member": newArray}

  let result = await cluster.updateOne(oldVal,newVal)
  if(result){
    let cluster = await Cluster.findOne({
      clusterId
    })
    ctx.body = {
      code: 0,
      member: cluster.member
    }
  }
})

router.get('/getAllCluster',async (ctx) => {
  let cluster = await Cluster.find()
  if(cluster){
    ctx.body = {
      code: 0,
      cluster
    }
  }else{
    ctx.body = {
      code: -1,
      cluster: []
    }
  }
})

router.get('/getCluster',async (ctx) => {
  const {clusterId} = ctx.query
  let cluster = await Cluster.findOne({
    clusterId
  })
  if(cluster){
    ctx.body = {
      code: 0,
      cluster
    }
  }else{
    ctx.body = {
      code: -1,
      cluster: {}
    }
  }
})

router.get('/deleteCluster',async (ctx) => {
  const {clusterId} = ctx.query
  let res = await Cluster.deleteOne({
    clusterId
  })
  if(res){
    ctx.body = {
      code: 0
    }
  }else{
    ctx.body = {
      code: -1
    }
  }
})

router.post('/updateCluster',async (ctx) => {
  const {
    title,
    type,
    tel,
    WeChat,
    totals,
    specLocat,
    desc,
    clusterId
  } = ctx.request.body;

  let result = await Cluster.updateOne({clusterId: clusterId},
    {title:title,type:type,tel:tel,WeChat:WeChat,totals:totals,specLocat:specLocat,desc:desc})
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
