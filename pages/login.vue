<template>
  <div class="page-login">
    <div class="login-header">
      <a href="/">
        <span class="logo">即刻组团<br/>jkcxo.com</span>
      </a>
    </div>
    <div class="login-panel">
      <div class="banner">
        <img src="head/logo.png"
             width="580" height="470" alt="即刻网"/>
      </div>
      <div class="form">
        <h4 v-if="error" class="tips"><i/>{{ error }}</h4>
        <p><span>账号登录</span></p>
        <el-input v-model="username" prefix-icon="profile"></el-input>
        <el-input v-model="password" prefix-icon="password" type="password"></el-input>
        <div class="foot">
          <el-checkbox v-model="checked">7天内自动登录</el-checkbox>
          <b>忘记密码？</b>
        </div>
        <el-button class="btn-login" type="success" size="mini" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import CryptoJS from 'crypto-js'
    export default {
      data(){
        return{
          error:'',
          checked:'',
          username:'',
          password:''
        }
      },
      layout: 'blank',
      methods:{
        login: async function () {
          let self = this;
          let {status,data} = await self.$axios.post('/users/signin',{
            username: window.encodeURIComponent(self.username),
            password: CryptoJS.MD5(self.password).toString()
          })
          if(status === 200){
            if(data && data.code === 0){
              const {status:status2,data:{user}} = await this.$axios.get('/users/getUser')
              let username = user
              if(status2 === 200 && username === 'admin'){
                location.href = '/admin'
              }else{
                location.href = '/'
              }
            }else{
              self.error = data.msg
            }
          }else{
            self.error = `服务器出错，错误代码${status}`
          }
          //定时清空error信息，避免错误信息一直存在
          setTimeout(function () {
            self.error = ''
          },1500 )
        }
      }
    }
</script>

<style lang="scss">
  @import "@/assets/css/login/index.scss";
</style>
