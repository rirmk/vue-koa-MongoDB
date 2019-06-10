<template>
  <el-table
    :data="userList" :default-sort = "{prop: 'username', order: 'descending'}"
    style="width: 100%" height="700px" stripe>
    <el-table-column
      sortable
      label="用户名"
      prop="username">
    </el-table-column>
    <el-table-column
      sortable
      label="WeChat"
      prop="WeChat">
    </el-table-column>
    <el-table-column
      label="邮箱"
      prop="email">
    </el-table-column>
    <el-table-column
      label="禁止状态"
      prop="ban">
    </el-table-column>
    <el-table-column>
      <template slot="header" slot-scope="scope">
        <el-row>
          <el-col :span="16">
            <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" size="mini" @click="submit">搜索</el-button>
          </el-col>
        </el-row>
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini" type="danger"
          @click="ban(scope.$index, scope.row)" >禁止用户发布</el-button>
        <el-button
          size="mini"
          type="success"
          @click="unBan(scope.$index, scope.row)">解除禁止用户发布</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import CryptoJS from 'crypto-js'
  export default {
    data() {
      return {
        userList: [],
        search: '',
        form: {
          username: '',
          password: '',
          WeChat: '',
          ban: 'false'
        }
      }
    },
    async mounted(){
      let {status,data:{users}} = await this.$axios.get('/users/getAllUser')
      this.userList = users
    },
    methods:{
      async submit(){
        let {status,data:{user}} = await this.$axios.get('/users/findUser',{
          params:{
            username: this.search
          }
        })
        this.userList = user
      },
      async ban(index, row){
        let self = this
        let {status,data} = await self.$axios.get('/users/banUser',{
          params:{
            username: row.username
          }
        })

        if(status !== 200){
          self.$message({
            message: '禁止用户发布失败，请刷新重试~',
            type: 'warning'
          });
        }else{
          let {status,data:{users}} = await self.$axios.get('/users/getAllUser')
          this.userList = users
          self.$message({
            message: '禁止用户发布成功~',
            type: 'success'
          });
        }
      },
      async unBan(index, row) {
        let self = this
        let {status, data} = await self.$axios.get('/users/unBanUser', {
          params:{
            username: row.username
          }
        })

        if (status !== 200) {
          self.$message({
            message: '解除用户发布失败，请刷新重试~',
            type: 'warning'
          });
        } else {
          let {status, data: {users}} = await self.$axios.get('/users/getAllUser')
          self.userList = users
          self.$message({
            message: '解除用户发布成功~',
            type: 'success'
          });
        }
      }
    }
  }
</script>
