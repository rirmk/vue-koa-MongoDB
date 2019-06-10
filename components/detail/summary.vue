<template>
  <dl class="m-sum-card">
    <dt>
      <h1>{{ meta.title }}</h1>
      <el-rate v-model="rate" disabled/>
      <span>{{ Math.floor(meta.like.length / 100) > 5 ? 5 : (Math.floor(meta.like.length / 100) === 0 ? 1 : Math.floor(meta.like.length / 100)) }}分</span>
      <span>类目：{{ meta.type }}</span>
      <ul>
        <li>团长：
          <span>{{ meta.username }}</span>
        </li>
        <li @click="openMap(meta.location)">地址：
          <span>{{ meta.city }}市 &nbsp;&nbsp; {{ meta.college }} &nbsp;&nbsp;</span>
          <span class="el-icon-location"></span>
        </li>
        <li>组团时间：
          <span>{{ meta.startTime }} ~ {{ meta.endTime }}</span>
        </li>
        <li>联系电话：
          <span>{{ meta.tel }}</span>
          <span class="m-sum-wechat">微信：</span>
          <span>{{ meta.WeChat }}</span>
        </li>
      </ul>
    </dt>
    <dd>
      <el-carousel height="214px" indicator-position="none">
        <el-carousel-item v-for="(item,idx) in meta.cover.photos" :key="idx">
          <h3><img :src="item" alt="item.title" width="100%" height="100%"></h3>
        </el-carousel-item>
      </el-carousel>
    </dd>
  </dl>
</template>

<script>
    export default {
      props:{
        meta:{
          type: Object,
          default(){
            return {}
          }
        }
      },
      data(){
        return {
          sale: 70 + Math.floor(Math.random() * 300)
        }
      },
      computed:{
        rate: function(){
          return Math.floor(this.meta.like.length / 100) > 5 ? 5 : (Math.floor(this.meta.like.length / 100) === 0 ? 1 : Math.floor(this.meta.like.length / 100))
        }
      },
      methods:{
        openMap: function(location){

        }
      }
    }
</script>
