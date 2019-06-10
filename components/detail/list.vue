<template>
  <div class="m-detail-list">
    <ul>
      <li class="m-detail-item">
        <dl class="section">
          <dd>
            <img :src="meta.cover.photos[0]" :alt="meta.cover.photos[0]">
          </dd>
          <dd>
            <h4>{{ meta.title }}</h4>
            <p class="content">
              <span>组团内容：{{ meta.actiContent }}</span>
            </p>
            <p>
              <span class="totals">剩余位置：
                <span class="now">{{ Number(meta.totals) - member.length }}</span> / {{ meta.totals }}
              </span>
              <span class="time">截止日期：</span>
              <span>{{ meta.startTime }} ~ {{ meta.endTime }}</span>
            </p>
          </dd>
          <dd>
            <span v-if="!flag && Number(meta.totals) - member.length > 0">
              <el-button type="primary" round @click="enterCluster">立即参与</el-button>
            </span>
            <span v-else-if="!flag && Number(meta.totals) - member.length === 0">
              <el-button type="primary" round disabled>组团已满</el-button>
            </span>
            <span v-else>
              <el-button type="warning" round @click="cancelCluster">取消参与</el-button>
            </span>
          </dd>
        </dl>
      </li>
      <li>
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <template slot="title">
              <span class="icon-bubble"></span>
              <span :class="{icon_heart_red:red}" class="icon-heart" @click="changeHeart">{{ like.length }}</span>
            </template>
            <div class="wrapper">
              <el-input v-model="comment" placeholder="添加您的评论" />
              <el-button class="el-button el-button--primary" @click="addComment">
                <i class="el-icon-edit"></i>
              </el-button>
            </div>
            <div class="wrapper-comment">
              <p v-for="(item,idx) in comments" :key="idx" class="s-item-comment">
                <span>{{ item.username }}</span> ：{{ item.comment }}
              </p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </li>
      <li>
        <el-row>
          <el-col :span="12">
            <h3 class="title-border">
              <span class="el-icon-location"></span>
              即刻组团指引
              <p></p>
            </h3>
            <guide :meta="meta"/>
          </el-col>
          <el-col :span="12">
            <h3 class="title-border">
              <span class="el-icon-rank"></span>
              即刻地图指引
              <p></p>
            </h3>
            <a-map :width="570" :height="500" :point="point" class="s-item-map"/>
          </el-col>
        </el-row>
      </li>
    </ul>
  </div>
</template>

<script>
  import Guide from '@/components/detail/guide.vue'
  import AMap from '@/components/public/map.vue'
    export default {
      components:{
        Guide,
        AMap
      },
      props:{
        meta:{
          type: Object,
          default:()=>{
            return {}
          }
        }
      },
      data(){
        return {
          red: '',
          flag: '',
          like:[],
          activeNames: [],
          comment: '',
          currentUser: '',
          clusterUser:'',
          comments: [],
          point: [],
          member:[]
        }
      },
      async mounted(){
        const {data:{user}} = await this.$axios.get('/users/getUser');
        this.currentUser = user;
        this.clusterUser = this.meta.username
        this.member = this.meta.member
        this.like = this.meta.like
        for(let i = 0;i<this.meta.member.length;i++) {
          if (this.meta.member[i].name === this.currentUser) {
            this.flag = true
          }else{
            this.flag = false
          }
        }
        this.point[0] = {"name": this.meta.title,"center":this.meta.location}

        if(this.meta.like.length > 0 ){
          this.meta.like.forEach(item => {
            if(item === this.currentUser){
              this.red = true
            }else{
              this.red = false
            }
          })
        }
        let {status,data:{comments}} =await this.$axios.get('/edit/getComment', {
          params: {
            clusterId: this.meta.clusterId
          }
        })
        if(status === 200){
          this.comments = comments;
        }
      },
      methods:{
        async changeHeart(){
          let option = ''
          if(this.red){
            this.red = false;
            option = "delete"
          }else{
            this.red = true;
            option = "add"
          }
          let {status,data:{code,like}} = await this.$axios.get('/edit/updateLike',{
            params:{
              username:this.currentUser,
              clusterId:this.meta.clusterId,
              option
            }
          });
          this.like = like
          if(status !== 200 && code !== 0){
            this.$alert(`服务器出错`,'点赞失败',{
              confirmButtonText: '确定',
              callback: action => {
                location.href = '/detail'
              }
            })
          }
        },
        async addComment(){
          let self = this;
          if(self.comment===''){
            this.$message({
              message: '评论内容不能为空哦~',
              type: 'warning'
            });
          }else{
            const {status,data:{user}} = await this.$axios.get('/users/getUser');
            if(status === 200){
              this.user = user
            }
            let {status:status2,data:{code,comments}} = await self.$axios.post('/edit/addComment', {
              comment: self.comment,
              username: self.user,
              clusterId: self.meta.clusterId
            })

            this.comments = comments
            this.comment = ''

            if(status2 !== 200 && code !== 0){
              this.$message({
                message: '评论失败，请刷新重试~',
                type: 'warning'
              });
            }else{
              this.$message({
                message: '评论成功，点赞可以提高即刻组团星级评分哦~',
                type: 'success'
              });
            }
          }
        },
        async cancelCluster(){
          const h = this.$createElement;
          this.$msgbox({
            title: '消息',
            message: h('p', null, [
              h('span', null, '您确定要退出 '),
              h('i', { style: 'color: teal' }, this.meta.title),
              h('span', null, ' 组团吗？')
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: async (action, instance, done) => {
              if (action === 'confirm') {
                //取消组团操作
                for(let i = 0;i<this.meta.member.length;i++){
                  if(this.meta.member[i].name === this.currentUser){
                    let {status,data:{member}} = await this.$axios.get('/cluster/deleteMember',{
                      params:{
                        clusterId:this.meta.clusterId,
                        index: i
                      }
                    })
                    if(status === 200){
                      this.member = member
                      this.flag = false
                    }
                    done();
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
        async enterCluster(){
          const h = this.$createElement;
          this.$msgbox({
            title: '消息',
            message: h('p', null, [
              h('span', null, '您确定要加入 '),
              h('i', { style: 'color: teal' }, this.meta.title),
              h('span', null, ' 组团吗？')
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: async (action, instance, done) => {
              if (action === 'confirm') {
                //参加组团操作
                const {data:{user,WeChat,tel,photos}} = await this.$axios.get('/users/getUser');
                let {status,data:{member}} = await this.$axios.get('/cluster/addMember',{
                  params:{
                    username:user,
                    WeChat,
                    tel,
                    photos,
                    clusterId:this.meta.clusterId
                  }
                })
                if(status === 200){
                  this.member = member
                  this.flag = true
                }
                done()
                setTimeout(()=>{
                  location.href = '/order'
                },1000)

              } else {
                done();
              }
            }
          }).then(action => {
            this.$message({
              type: 'success',
              message: '参与即刻组团成功。'
            });
          });
        }
      }
    }
</script>
