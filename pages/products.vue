<template>
  <el-row class="page-product">
    <el-col :span="19">
      <crumbs :keyword="keyword"/>
      <category :types="types" :areas="areas"/>
      <list :list="list"/>
    </el-col>
    <el-col :span="5">
      <a-map v-if="point.length" :width="230" :height="290" :point="point"/>
    </el-col>
  </el-row>
</template>

<script>
  import Crumbs from  '@/components/products/crumbs.vue'
  import Category from '@/components/products/category.vue'
  import List from '@/components/products/list.vue'
  import AMap from '@/components/public/map.vue'
    export default {
      components:{
        Crumbs,
        Category,
        List,
        AMap
      },
      data(){
        return {
          list:[],
          types:[],
          areas:[],
          keyword:'',
          point:[]
        }
      },
      async asyncData(ctx){
        let keyword = ctx.query.keyword;

        let city = ctx.store.state.geo.position.city.replace('市','');
        let {status,data:{count,pois}} = await ctx.$axios.get('/search/resultsByKeywords',{
          params:{
            keyword,
            city
          }
        });

        let {status: status2,data:{areas,types}} = await ctx.$axios.get('/categroy/crumbs',{
          params:{
            city
          }
        });

        if(status === 200 && count > 0 && status2 === 200){
          return {
            list : pois.filter(item => item.guide.photos.length),
            keyword,
            areas: areas.filter(item => item.type !== '').slice(0,5),
            types: types.filter(item => item.type !== '').slice(0,5),
            point: pois.map(item => {
              return {
               name : item.college,
               center: item.location
              }
            })
          }
        }
      }
    }
</script>

<style lang="scss">
  @import "@/assets/css/products/index.scss";
</style>
