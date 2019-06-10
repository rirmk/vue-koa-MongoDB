<template>
  <div class="page-order">
    <el-row>
      <el-col :span="4" class="navbar">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @select="handleSelect">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>我的组团</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">全部组团</el-menu-item>
              <el-menu-item index="1-2">我发布的组团</el-menu-item>
              <el-menu-item index="1-3">我参加的组团</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">我的收藏（点赞）</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">我的动态</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">个人信息</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col v-if="view==='cluster'" :span="19" class="table">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部组团" name="all">
            <list :cur="cur.slice((currentPage-1)*pageSize,currentPage*pageSize)" />
            <div class="block">
              <el-pagination
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                :total="cur.length"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="我发布的组团" name="MyCreate">
            <list :cur="cur.slice((currentPage-1)*pageSize,currentPage*pageSize)" />
            <div class="block">
              <el-pagination
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                :total="cur.length"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="我参加的组团" name="MyEnter">
            <list :cur="cur.slice((currentPage-1)*pageSize,currentPage*pageSize)"/>
            <div class="block">
              <el-pagination
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                :total="cur.length"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col v-else-if="view==='likeCluster'" :span="19" class="table">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="我的收藏（点赞）" name="likeCluster">
            <list :cur="cur.slice((currentPage-1)*pageSize,currentPage*pageSize)" :view="view"/>
            <div class="block">
              <el-pagination
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                :total="cur.length"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import List from "@/components/order/list.vue";
    export default {
      components: {
        List
      },
      data(){
        return {
          activeName: 'all',
          cur: [],
          all: [],
          myCreate: [],
          myEnter: [],
          likeCluster: [],
          view: 'cluster',
          currentPage: 1,
          pageSize:10,
        }
      },
      watch:{
        activeName: function(val){
          if(val === 'MyCreate'){
            this.cur = this.myCreate
          }else if(val === 'MyEnter'){
            this.cur = this.myEnter
          }else if(val === 'all'){
            this.cur = this.all
          }else if(val === 'likeCluster'){
            this.cur = this.likeCluster
          }
        },
      },
      async mounted() {
        let {status, data:{code, cluster}} = await this.$axios.get('/cluster/getAllCluster')
        const {status: status2,data:{user}} =await this.$axios.get('/users/getUser');
        let username = ""
        if(status2 === 200){
          username = user
        }
        cluster.forEach(item => {
          if(item.username === username){
            this.myCreate.push(item)
          }
          item.member.forEach(itemMember => {
            if(itemMember.name === username){
              this.myEnter.push(item)
              this.all.push(item)
              this.cur.push(item)
            }
          })
          item.like.forEach(itemUser => {
            if(itemUser === username){
              this.likeCluster.push(item)
            }
          })
        })
      },
      methods:{
        handleClick: function(tab){
          this.activeName = tab.name
        },
        handleSelect(key, keyPath) {
          switch(key){
            case '1-1':
              this.view = 'cluster';
              this.activeName  = 'all';
              break;
            case '1-2':
              this.view = 'cluster';
              this.activeName  = 'MyCreate';
              break;
            case '1-3':
              this.view = 'cluster';
              this.activeName  = 'MyEnter';
              break;
            case '2':
              this.view = 'likeCluster';
              this.activeName  = 'likeCluster';
              break;
          }
        },
        handleSizeChange(val) {
          this.pageSize = val;
        },
        handleCurrentChange(val) {
          this.currentPage = val;
        }
      },

    }
</script>

<style lang="scss">
  @import '@/assets/css/order/index.scss';
</style>
