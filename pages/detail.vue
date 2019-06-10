<template>
  <div class="page-detail">
    <el-row>
      <el-col :span="24">
        <crumbs :keyword="keyword" :type="type"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <summa :meta="pois"/>
      </el-col>
    </el-row>
    <el-row class="m-title">
      <el-col :span="24">
        <h3>即刻参与组团</h3>
      </el-col>
    </el-row>
    <el-row v-if="canOrder || !login">
      <el-col :span="24">
        <list v-if="login" :meta="pois"/>
        <div v-else class="deal-need-login">
          <img src="//p0.meituan.net/codeman/56a7d5abcb5ce3d90fc91195e5b5856911194.png" alt="登录查看"/>
          <span>请登录后查看详细组团信息</span>
          <el-button type="primary" round><a href="/login">立即登录</a></el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Crumbs from '@/components/detail/crumbs.vue'
  import Summa from '@/components/detail/summary.vue'
  import List from '@/components/detail/list.vue'

    export default {
      components:{
        Crumbs,
        Summa,
        List
      },
      computed:{
        canOrder:function () {
          return true
        }
      },
      async asyncData(ctx){
        let {keyword, type, college} = ctx.query;
        let {status, data: {pois,login}} = await ctx.$axios.get('/search/actiDetail',{
          params:{
            keyword,
            type,
            college
          }
        })

        if(status === 200){
          return {
            keyword,
            pois,
            type,
            login
          }
        }else{
          return {
            keyword,
            pois: {},
            type,
            login:false
          }
        }
      }
    }
</script>

<style lang="scss">
@import "@/assets/css/detail/index.scss";
</style>
