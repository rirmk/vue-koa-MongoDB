<template>
  <div class="slide">
    <el-carousel height="240px">
      <el-carousel-item v-for="item in list" :key="item.img">
        <img :src="item.img">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
    export default {
      data(){
        return {
          list: [{
            url: '#abc',
            img: '/head/slider1.jpg'
          }, {
            url: '#bsbsb',
            img: '/head/slider2.jpg'
          }, {
            url: '#sjfkajfj',
            img: '/head/slider3.jpg'
          }, {
            url: '#sjfkajfja',
            img: '/head/slider4.jpg'
          }, {
            url: '#kjljj',
            img: '/head/slider5.jpg'
          }]
        }
      }
    }
</script>

<style>

</style>
