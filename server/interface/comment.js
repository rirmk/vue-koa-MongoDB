import Router from 'koa-router'
import Cluster from '../dbs/models/clusters'
import Comment from '../dbs/models/comments'

let router = new Router({prefix: '/edit'});

router.get('/updateLike', async (ctx) =>　{
  const {clusterId,username,option} = ctx.query;
  let cluster = await Cluster.findOne({
    clusterId
  })
  let result = {}
  if(option === "add"){
    let oldVal = {"like":cluster.like};
    let newVal = {"like": cluster.like.push(username)}
    result = await cluster.updateOne(oldVal,newVal);
  }else if(option === "delete"){
    let number = ''
    for(let i = 0;i<cluster.like.length;i++){
      if(cluster.like[i] === username){
        number = i
      }
    }
    let oldVal = {"like":cluster.like};
    let newVal = {"like": cluster.like.splice(Number(number),1)}
    result = await cluster.updateOne(oldVal,newVal);
  }


  if(result){
    let cluster = await Cluster.findOne({
      clusterId
    })
    ctx.body = {
      code: 0,
      like: cluster.like
    }
  }else{
    ctx.body = {
      code: -1,
      like: []
    }
  }
})

router.get('/getComment', async (ctx) => {
  let {clusterId} = ctx.query
  let comments = await Comment.find({
    clusterId:clusterId
  });

  if(comments.length){
    ctx.body = {
      count: comments.length,
      comments
    }
  }else{
    ctx.body = {
      count: 0,
      comments: []
    }
  }
})

router.post('/addComment', async (ctx) => {
  const {
    username,
    comment,
    clusterId
  } = ctx.request.body;

  let ncomment = await Comment.create({
    username,
    comment,
    clusterId
  });

  let comments = await Comment.find({
    clusterId
  });

  if(ncomment && comments){
    ctx.body={
      code: 0,
      comments
    }
  }else{
    ctx.body={
      code:-1,
      comments: []
    }
  }

})

export default router
