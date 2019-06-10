import Router from 'koa-router'
import Cluster from '../dbs/models/clusters'
import axios from './utils/axios'

let router = new Router({prefix: '/search'})

router.get('/top', async (ctx) => {
  try{
    let top = await Cluster.find({
      title: new RegExp(ctx.query.input),
      city: ctx.query.city
    })
    if(top.length){
      ctx.body = {
        code: 0,
        top: top.map(item => {
          return {
            name: item.title
          }
        })
      }
    }else{
      let top = await Cluster.find({
        title: new RegExp(ctx.query.input)
      })
      ctx.body = {
        code: 0,
        top: top.map(item => {
          return {
            name: item.title
          }
        })
      }
    }

  }catch (e){
    ctx.body = {
      code: -1,
      top: []
    }
  }
})

router.get('/hotActi', async (ctx) => {
  let result = []
  const res = await axios.get('/geo/getMenuChild')

  for(let i = 0;i < 5;i++){
    let num = Math.floor(Math.random()* res.data.tempArray.length)
    result.push(res.data.tempArray[num])
  }
  if(result) {
    ctx.body = {
      code: 0,
      result
    }
  }else{
    ctx.body = {
      code: -1,
      result: []
    }
  }
})

router.get('/resultsByKeywords', async (ctx) => {
  try{
    const res = await axios.get('/geo/getMenuChild')
    const {city, keyword} = ctx.query;
    //先查用户输入的内容（当前城市）
    let pois = await Cluster.find({
      city,
      title: keyword
    })
    if(pois.length){
      ctx.body = {
        count: pois.length,
        pois: pois
      }
    }else{
      //如果当前城市没查到，那就在全部城市中查找用户输入的内容
      let pois = await Cluster.find({
        title: keyword
      })
      if(pois.length){
        ctx.body = {
          count: pois.length,
          pois: pois
        }
      }else{
        //如果用户输入的内容查不到，则检查输入的内容是否匹配type中的值，如果是则根据type查
        let othersKey = ''
        res.data.tempArray.forEach(item => {
          if(keyword.indexOf(item) > -1){
            othersKey = item
          }
        })

        //如果输入内容匹配到包含类型字段  则模糊搜索内容
        if(othersKey!==''){
          let pois = await Cluster.find({             //返回的内容包含当前城市及其他城市
            title: new RegExp(othersKey)
          })
          if(pois.length){
            ctx.body = {
              count: pois.length,
              pois: pois
            }
          }else{    //如果匹配到了type但是模糊搜索不出来  那就只能根据类型搜索
            let pois = await Cluster.find({             //返回的内容包含当前城市及其他城市
              type: othersKey
            })
            ctx.body = {
              count: pois.length,
              pois: pois
            }
          }
        }else{    //如果输入的内容搜索不到，又匹配不到关键词，那就模糊查询输入内容(当前城市)
          let pois = await Cluster.find({
            city,
            title: new RegExp(keyword)
          })
          if(pois.length){
            ctx.body = {
              count: pois.length,
              pois: pois
            }
          }else{    //没有就模糊搜索当前内容 （全部城市）
            let pois = await Cluster.find({
              title: new RegExp(keyword)
            })
            if(pois.length){
              ctx.body = {
                count: pois.length,
                pois: pois
              }
            }else{      //没有就查全部
              let pois = await Cluster.find()
              ctx.body = {
                count: pois.length,
                pois: pois
              }
            }
          }
        }
      }
    }
  }catch(e){
    ctx.body = {
      count: 0,
      pois: []
    }
  }
})

router.get('/resultsByType',async (ctx) => {
  const {keyword} = ctx.query;
  let pois = await Cluster.find({
    type: keyword
  })
  ctx.body = {
    count: pois.length,
    pois: pois
  }
})

router.get('/actiDetail', async (ctx) =>　{
  const {college, keyword, type} = ctx.query;
  let pois = await Cluster.findOne({
    college,
    title: keyword,
    type
  })

  if(pois){
    ctx.body = {
      pois: pois,
      login: ctx.isAuthenticated()
    }
  }else{
    ctx.body = {
      pois: {},
      login: ctx.isAuthenticated()
    }
  }
})

export default router
