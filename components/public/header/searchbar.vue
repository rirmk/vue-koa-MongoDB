<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col :span="3" class="left" style="text-align: center;font-size: 25px;color: teal;">
        <a href="/">
          <span class="logo">即刻组团</span>
        </a>
      </el-col>
      <el-col :span="15" class="center">
        <div class="wrapper">
          <el-input v-model="search" placeholder="搜索商家或地点" @focus="focus" @blur="blur" @input="input"/>
          <a :href="'/products?keyword=' + encodeURIComponent(search)">
            <el-button class="el-button el-button--primary">
              <i class="el-icon-search"></i>
            </el-button>
          </a>
          <dl v-if="isHotPlace" class="hotPlace">
            <dt>热门搜索</dt>
            <dd v-for="(item,idex) in $store.state.home.hotActi" :key="idex">
              <a :href="'/products?keyword=' + encodeURIComponent(item)">{{ item }}</a>
            </dd>
          </dl>
          <dl v-if="isSearchList" class="searchList">
            <dd v-for="(item,idex) in searchList" :key="idex">
              <a :href="'/products?keyword=' + encodeURIComponent(item.name)">{{ item.name }}</a>
            </dd>
          </dl>
        </div>
        <p class="suggest">
          <a v-for="(item,idex) in $store.state.home.hotActi"
             :key="idex" :href="'/products?keyword=' + encodeURIComponent(item)">{{ item }}</a>
        </p>
        <ul class="nav">
          <li><nuxt-link to="/" class="takeout">即刻首页</nuxt-link></li>
          <li><nuxt-link to="/cluster" class="movie">建立组团</nuxt-link></li>
          <li><nuxt-link to="/order" class="business">我的组团</nuxt-link></li>
          <li><nuxt-link to="/" class="hotel">即刻动态</nuxt-link></li>
          <li><nuxt-link to="/" class="apartment">我的动态</nuxt-link></li>
        </ul>
      </el-col>
      <el-col :span="6" class="right">
        <ul class="security">
          <li><i class="refund"><p class="txt">随时退</p></i></li>
          <li><i class="single"><p class="txt">不满意免单</p></i></li>
          <li><i class="overdue"><p class="txt">过期退</p></i></li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import _ from 'lodash';
    export default {
      data(){
        return {
          search:'',
          isFocus:false,
          hotPlace:[],
          searchList:[]
        }
      },
      computed:{
        isHotPlace:function () {
          return this.isFocus&&!this.search
        },
        isSearchList:function () {
          return this.isFocus&&this.search
        }
      },
      methods:{
        focus:function () {
          this.isFocus=true
        },
        blur:function () {
          let self = this;
          setTimeout(function () {
            self.isFocus=false
          },200)
        },
        input:_.debounce(async function(){
          let self = this
          let city = self.$store.state.geo.position.city.replace('市','')
          self.searchList = []
          let {status, data:{ top }} = await self.$axios.get('/search/top', {
            params: {
              input: self.search,
              city
            }
          })
          self.searchList = top.slice(0,10)   //截取10条数据
        },300)
      }
    }
</script>

<style lang="css">

</style>
