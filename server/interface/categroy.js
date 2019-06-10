import Router from 'koa-router';
import categroy from '../dbs/models/categroy';

let router = new Router({prefix: '/categroy'});

router.get('/crumbs',async (ctx)=> {
  let result = await categroy.findOne({
    city: ctx.query.city
  });

  if (result) {
    ctx.body = {
      areas: result.areas,
      types: result.types
    }
  } else {
    ctx.body = {
      areas: [],
      types: []
    }
  }
})
export default router
