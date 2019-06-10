<template>
  <div class="m-life">
    <el-row>
      <el-col :span="14">
        <slider/>
      </el-col>
      <el-col :span="4">
        <div class="m-life-pic" />
      </el-col>
      <el-col :span="6">
        <div class="m-life-login">
          <h4>
            <img src="//s0.meituan.net/bs/fe-web-meituan/2d05c2b/img/avatar.jpg" alt="">
          </h4>
          <div v-if="!isLogin">
            <p class="m-life-login-name">Hi！你好</p>
            <p><nuxt-link to="/register"><el-button round size="medium">注册</el-button></nuxt-link></p>
            <p><nuxt-link to="/login"><el-button round size="medium">立即登录</el-button></nuxt-link></p>
          </div>
          <div v-else>
            <p class="m-life-login-name">Hi！你好 {{ user }}</p>
            <p><nuxt-link to="/register"><el-button round size="medium">注册</el-button></nuxt-link></p>
            <p><nuxt-link to="/exit"><el-button round size="medium">注销</el-button></nuxt-link></p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="7">
        <div class="m-life-create">
          <div class="m-create-button">
            <nuxt-link to="/cluster">
              <el-button type="primary" size="small" round>创建即刻组团</el-button>
            </nuxt-link>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="m-life-music">
          <div class="m-create-button">
            <nuxt-link to="/order">
              <el-button type="primary" size="small" round>我的组团</el-button>
            </nuxt-link>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="m-life-coop"/>
      </el-col>
      <el-col :span="6">
        <div class="m-life-downapp">
          <img src="head/href.jpg" alt="下载APP">
          <p>即刻组团公众号</p>
          <h4><span class="red">关注</span><em class="gary">最新即刻组团资讯</em></h4>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Slider from "./slider.vue"
  import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
  import NuxtLink from "../../.nuxt/components/nuxt-link";
    export default {
      components:{
        NuxtLink,
        ElButton,
        Slider
      },
      data(){
        return {
          isLogin: false,
          user: ''
        }
      },
      async  mounted(){
        const {status,data:{user}} = await this.$axios.get('/users/getUser')
        if(user !== ''){
          this.isLogin = true
          this.user = user
        }
      }
    }
</script>

<style lang="scss">
 @import "@/assets/css/index/life.scss";
 .time {
   font-size: 13px;
   color: #999;
 }

 .bottom {
   margin-top: 13px;
   line-height: 12px;
 }

 .button {
   padding: 0;
   float: right;
 }

 .image {
   width: 100%;
   display: block;
 }

 .clearfix:before,
 .clearfix:after {
   display: table;
   content: "";
 }

 .clearfix:after {
   clear: both
 }
</style>
