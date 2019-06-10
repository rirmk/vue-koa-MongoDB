<template>
  <div class="layout-default">
    <el-header height="40px" class="header">
      <my-header/>
    </el-header>
    <div class="admin">
      <nuxt/>
    </div>
  </div>
</template>

<script>
  import MyHeader from '@/components/public/header/topbar.vue'
  export default{
    components:{
      MyHeader
    }
  }
</script>
<style lang="scss">
  .header{
    width: 1190px;
    margin: 0 auto;
    z-index: 9999;
    height: 40px;
    line-height: 40px;
  }
  .el-header{
    height:40px;
  }
</style>

