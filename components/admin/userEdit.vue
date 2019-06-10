<template>
  <el-table
    :data="userList" :default-sort = "{prop: 'username', order: 'descending'}"
    style="width: 100%" height="700px" stripe>
    <el-table-column
      sortable
      min-width="60px"
      label="用户名"
      prop="username">
    </el-table-column>
    <el-table-column
      sortable
      label="密码"
      prop="password">
    </el-table-column>
    <el-table-column
      sortable
      width="180px"
      label="WeChat"
      prop="WeChat">
    </el-table-column>
    <el-table-column
      label="邮箱"
      prop="email">
    </el-table-column>
    <el-table-column
      label="头像"
      prop="photos">
    </el-table-column>
    <el-table-column
      align="right" width="300px">
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
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>

    <!--内层对话框表单-->
    <el-dialog :visible.sync="dialogFormVisible" :append-to-body="true" title="用户信息修改" center>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item :label-width="formLabelWidth" prop="username" label="用户名">
          <el-input v-model="form.username" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="password" label="密码">
          <el-input v-model="form.password" type="password" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="WeChat" label="微信">
          <el-input v-model="form.WeChat" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCluster">确 定</el-button>
      </div>
    </el-dialog>

  </el-table>
</template>

<script>
  import CryptoJS from 'crypto-js'
  export default {
    data() {
      return {
        userList: [],
        search: '',
        dialogFormVisible: false,
        formLabelWidth: '230px',
        form: {
          username: '',
          password: '',
          WeChat: '',
          photos: ''
        },
        rules:{
          username:[{
            required:true,type:'string',message:'请输入用户名',trigger:'blur'
          }],
          password:[{
            required:true,type:'string',message:'请输入密码',trigger:'change'
          }],
          WeChat:[{
            required:true,type:'string',message:'请输入WeChat',trigger:'blur'
          }]
        },
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
      handleEdit(index, row) {
        this.dialogFormVisible = true
        this.form.username = row.username
        this.form.WeChat = row.WeChat
        this.form.password = row.password
      },
      async updateCluster(){
        let self = this
        let {status,data} = await self.$axios.post('/users/updateUser',{
          username: self.form.username,
          WeChat: self.form.WeChat,
          password:  CryptoJS.MD5(self.form.password).toString()
        })

        if(status !== 200){
          self.$message({
            message: '更新失败，请刷新重试~',
            type: 'warning'
          });
        }else{
          let {status,data:{users}} = await this.$axios.get('/users/getAllUser')
          this.userList = users
          self.$message({
            message: '更新成功~',
            type: 'success'
          });
        }
        self.dialogFormVisible=false;
      },
      async handleDelete(index, row){
        let self = this
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('p', null, [
            h('span', null, '您确定要删除该用户吗？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              //参加组团操作
              let {status,data} = await this.$axios.get('/users/deleteUser',{
                params:{
                  username: row.username
                }
              })
              let {status:status2,data:{users}} = await this.$axios.get('/users/getAllUser')
              this.userList = users
              done()
            } else {
              done();
            }
          }
        }).then(action => {
          this.$message({
            type: 'success',
            message: '删除用户成功。'
          });
        });
      }
    }
  }
</script>
