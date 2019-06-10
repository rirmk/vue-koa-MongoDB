import Router from 'koa-router';
import axios from './utils/axios';
import Menu from '../dbs/models/menus';
import Province from '../dbs/models/provinces'
import City from '../dbs/models/cities'
import College from '../dbs/models/colleges'

let router = new Router({prefix: '/geo'})

router.get('/getPosition', async (ctx) => {
  let returnCitySN = await axios.get("https://pv.sohu.com/cityjson?ie=utf-8");

  if(returnCitySN) {
    let reg = /[\u4e00-\u9fa5]/g;    //仅仅匹配中文
    let result = returnCitySN.data.match(reg).join("");
    let temp = result.split("省");
    let province = temp[0] + "省"
    let city = temp[1]

    ctx.body = {
      province,
      city
    }
  }else{
    ctx.body = {
      province: '',
      city: ''
    }
  }
})

router.get('/province', async (ctx) => {
  let province = await Province.find()

  ctx.body = {
    province: province.map(item => {
      return {
        id: item.id,
        name: item.value[0]
      }
    })
  }
})

router.get('/province/:id',async (ctx) => {
  let city = await City.findOne({id: ctx.params.id});

  ctx.body = {
    code: 0,
    city: city.value.map(item => {
      return {
        province: item.province,
        id: item.id,
        name: item.name
      }
    })
  }
})

router.get('/city',async (ctx) => {
  let city = []
  let result = await City.find();
  result.forEach(item => {
    city = city.concat(item.value)
  })

  ctx.body = {
    code: 0,
    city: city.map(item => {
      return {
        province: item.province,
        id: item.id,
        name: item.name === '市辖区' || item.name === '省直辖县级行政区划' ? item.province : item.name
      }
    })
  }
})

router.get('/getCityCluster',async (ctx) => {
  let city = []
  let result = await City.find();
  result.forEach(item => {
    if(item.value.length === 1){
      city.push({"province":String(item.value[0].province),"name":String(item.value[0].province)})
    }else{
      let names = []
      for(let i = 0;i<item.value.length;i++){
        if(String(item.value[i].name) === "省直辖县级行政区划"){
          item.value[i].name = item.value[0].province
        }
        names[i] = String(item.value[i].name)
      }
      city.push({"province":String(item.value[0].province),"name": names})
    }
  })
  ctx.body = {
    code: 0,
    city
  }
})

router.get('/hotCity', async (ctx) => {
  let list = [
    '北京市',
    '上海市',
    '广州市',
    '深圳市',
    '天津市',
    '西安市',
    '杭州市',
    '南京市',
    '武汉市',
    '成都市'
  ]

  let nList = []
  let result = await City.find()
  result .forEach(item => {
    nList = nList.concat(item.value.filter(k => list.includes(k.name) || list.includes(k.province)))
  })

  ctx.body = {
    hots: nList
  }
})

router.get('/getMenu', async (ctx) => {
  const result = await Menu.findOne()
  ctx.body = {
    menu: result.menu
  }
})

router.get('/getMenuChild', async (ctx) => {
  const menus = await Menu.findOne()
  let tempArray = []
  menus.menu.forEach(a =>{
    a.child.forEach(b => {
      b.child.forEach(c => {
        tempArray.push(c)
      })
    })
  })

  ctx.body = {
    tempArray
  }
})

router.get('/getColleges', async (ctx) => {
  let colleges =await College.find()
  if(colleges){
    ctx.body = {
      code: 0,
      colleges: colleges.map(item => {
        return{
          college: String(item.college)
        }
      })
    }
  }else{
    ctx.body = {
      code: -1,
      colleges: []
    }
  }

})

router.get('/getCollege',async (ctx) => {
  const {city,college} = ctx.query
  let result = await College.findOne({
    city,
    college
  })
  if(result){
    ctx.body = {
      code: 0
    }
  }else{
    ctx.body = {
      code: -1,
      msg:'城市与学校不匹配！请对应选择'
    }
  }
})

export default router;
