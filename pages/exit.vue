<template>
  <div class=""/>
</template>

<script>
    export default {
      layout: 'blank',
      //利用中间件可以在单击退出到达这个页面的时候自动执行中间件的函数
      middleware: async (ctx) =>{
        let {status,data} = await ctx.$axios.get('/users/exit')
        if(status === 200 && data && data.code === 0){
          window.location.href = '/'
        }
      }
    }
</script>

<style>

</style>
