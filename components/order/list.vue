<template>
  <div class="m-order">
    <ul>
      <li v-if="cur.length">
        <el-row v-for="(item,idx) in cur" :key="idx">
          <el-col :span="3">
            <img :src="item.cover.photos[0]" alt="" />
          </el-col>
          <el-col :span="9">
            <p>
              <nuxt-link :to="{path: 'detail',query: {keyword: item.title, type: item.type, college: item.college}}">{{ item.title }}</nuxt-link>
            </p>
            <p>
              <span class="totals">剩余位置：
                <span class="now">{{ Number(item.totals) - item.member.length }}</span> / {{ item.totals }}
              </span>
            </p>
            <dl>
              <dd v-for="(member,idex) in item.member" :key="idex" >
                <el-tooltip placement="bottom">
                  <div slot="content">
                    {{ member.name }}<br />
                    <span v-if="member.WeChat">{{ member.WeChat }}</span>
                  </div>
                  <img :src="member.photos" alt="member.name" class="headImg"/>
                </el-tooltip>
              </dd>
            </dl>
          </el-col>
          <el-col :span="4">
            <p>团长：{{ item.username }}</p>
            <p>联系方式：{{ item.tel }}</p>
            <p v-if="item.WeChat!=''">微信：{{ item.WeChat }}</p>
            <p></p>
          </el-col>
          <el-col :span="5">
            <p v-if="new Date(currentTime) < new Date(item.startTime)" class="enter">已参加</p>
            <p v-else-if="new Date(currentTime) > new Date(item.endTime)" class="end">已结束</p>
            <p v-else class="run">进行中</p>
          </el-col>
          <el-col :span="3">
            <el-button type="warning" round @click="cancelCluster(item.clusterId)">取消参与</el-button>
            <div v-if="currentUser === item.username" class="hideButton">
              <el-button type="danger" round @click="deleteCluster(item.clusterId)">删除组团</el-button>
            </div>
          </el-col>
        </el-row>
      </li>
      <li v-else class="empty">没有组团信息</li>
    </ul>
  </div>
</template>

<script>
  import currentTime from '@/server/interface/utils/getCurrentTime'
    export default {
      props: {
        cur: {
          type: Array,
          default: () => {
            return []
          }
        }
      },
      data(){
        return{
          currentTime:'',
          currentUser:'',
        }
      },
      async mounted(){
        this.currentTime = currentTime();
        const {data:{user}} = await this.$axios.get('/users/getUser');
        this.currentUser = user;
      },
      methods:{
        async cancelCluster(clusterId){
          const h = this.$createElement;
          this.$msgbox({
            title: '消息',
            message: h('p', null, [
              h('span', null, '您确定要退出组团吗？ ')
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: async (action, instance, done) => {
              if (action === 'confirm') {
                //取消组团操作
                let {status:status2,data:{cluster}} = await this.$axios.get('/cluster/getCluster',{
                  params:{
                    clusterId
                  }
                })
                let res = cluster
                for(let i = 0;i<res.member.length;i++){
                  if(res.member[i].name === this.currentUser){
                    let {status,data:{member}} = await this.$axios.get('/cluster/deleteMember',{
                      params:{
                        clusterId,
                        index: i
                      }
                    })
                    if(status === 200){
                      done()
                      setTimeout(()=>{
                        location.href = '/order'
                      },1000)
                    }
                  }
                }
              } else {
                done();
              }
            }
          }).then(action => {
            this.$message({
              type: 'info',
              message: '取消组团成功。'
            });
          });

        },
        async deleteCluster(clusterId){
          const h = this.$createElement;
          this.$msgbox({
            title: '消息',
            message: h('p', null, [
              h('span', null, '您确定要删除组团吗？')
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: async (action, instance, done) => {
              if (action === 'confirm') {
                //参加组团操作
                let {status,data} = await this.$axios.get('/cluster/deleteCluster',{
                  params:{
                    clusterId
                  }
                })
                if(status === 200){
                  done()
                  setTimeout(()=>{
                    location.href = '/order'
                  },1000)
                }

              } else {
                done();
              }
            }
          }).then(action => {
            this.$message({
              type: 'success',
              message: '删除即刻组团成功。'
            });
          });
        }
      }
    }
</script>
