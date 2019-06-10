<template>
  <el-card :body-style="{ padding: '0px'}">
    <img :src="item.cover.photos[0]" class="image"/>
    <ul class="cbody">
      <li class="title">{{ item.title }}</li>
      <li class="content">{{ item.actiContent }}</li>
      <li class="attribute">
        <span class="el-icon-view"></span>{{ Math.floor(Math.random()*1000) }}
        <span class="icon-bubble"></span>{{ sum }}
        <span class="icon-heart"></span>{{ item.like.length }}
      </li>
      <li class="img">
        <el-row>
          <el-col :span="5">
            <span>
              <img :src="headImg" alt="item.username" class="headImg"/>
            </span>
          </el-col>
          <el-col :span="7">
            <span>{{ item.username }}</span>
          </el-col>
          <el-col :span="12">
            <!--<span v-if="time!==''">距离开始{{ time }}</span>-->
            <!--<span v-else-if="currentTime < item.startTime" class="enter">已参加</span>-->
            <span v-if="currentTime < startTime" class="enter">距离开始{{ time }}</span>
            <span v-else-if="currentTime > endTime" class="end">已结束</span>
            <span v-else class="run">进行中</span>
          </el-col>
        </el-row>
      </li>
    </ul>
  </el-card>
</template>

<script>
  import currentTime from '@/server/interface/utils/getCurrentTime'
    export default {
      props:{
        item:{
          type: Object,
          default(){
            return {}
          }
        }
      },
      data(){
        return {
          sum: '0',
          headImg:'',
          time:'',
          currentTime:'',
          startTime:'',
          endTime:''
        }
      },
      async mounted(){
        let {status,data:{count,comments}} =await this.$axios.get('/edit/getComment',{
          params:{
            clusterId:this.item.clusterId
          }
        })
        this.sum = String(count)
        let username = this.item.username
        let {status:status2,data:{code,user}} = await this.$axios.get('/users/findUser',{
          params:{
            username: username
          }
        })
        if(status2 === 200){
          this.headImg = user.photos
        }
        this.currentTime = new Date(currentTime());
        this.startTime = new Date(this.item.startTime);
        this.endTime = new Date(this.item.endTime);
        if(this.currentTime < this.startTime){
          let year = 0
          let month = 0
          let day = 0
          let hour = 0
          year = (Number(this.startTime.getFullYear()) - Number(this.currentTime.getFullYear())) * 365
          month = (Number(this.startTime.getMonth()+1) - Number(this.currentTime.getMonth()+1 )) * 30
          day = Number(this.startTime.getDate()) - Number(this.currentTime.getDate())
          hour = Number(this.startTime.getHours()) - Number(this.currentTime.getHours())
          if(Number(year + month + day) > 0){
            this.time = ''+ Number(year + month + day) + "天"
          }else{
            this.time = '' + hour + "小时"
          }
        }
      }
    }
</script>

<style>

</style>
