<template>
  <el-table
    :data="clusterList" :default-sort = "{prop: 'title', order: 'descending'}"
    style="width: 100%" height="700px" stripe>
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="团长">
            <span>{{ props.row.username }}</span>
          </el-form-item>
          <el-form-item label="联系电话">
            <span>{{ props.row.tel }}</span>
          </el-form-item>
          <el-form-item label="WeChat">
            <span>{{ props.row.WeChat }}</span>
          </el-form-item>
          <el-form-item label="起止日期">
            <span>{{ props.row.startTime }}~{{ props.row.endTime }}</span>
          </el-form-item>
          <el-form-item label="组团人数">
            <span>{{ props.row.totals }}</span>
          </el-form-item>
          <el-form-item label="省份">
            <span>{{ props.row.province }}</span>
          </el-form-item>
          <el-form-item label="城市">
            <span>{{ props.row.city }}</span>
          </el-form-item>
          <el-form-item label="活动地址">
            <span>{{ props.row.college }}</span>
          </el-form-item>
          <el-form-item label="经纬度">
            <span>{{ props.row.location }}</span>
          </el-form-item>
          <el-form-item label="成员">
            <span v-for="(item,idex) in props.row.member" :key="idex">{{ item.name }} &nbsp;</span>
          </el-form-item>
          <el-form-item label="封面图片">
            <span v-for="(item,idex) in props.row.cover.photos" :key="idex">{{ item }} &nbsp;</span>
          </el-form-item>
          <el-form-item label="指引图片">
            <span v-for="(item,idex) in props.row.guide.photos" :key="idex">{{ item }} &nbsp;</span>
          </el-form-item>
          <el-form-item label="具体位置">
            <span>{{ props.row.guide.specLocat }}</span>
          </el-form-item>
          <el-form-item label="指引描述">
            <span>{{ props.row.guide.desc }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      sortable
      min-width="115px"
      label="组团 ID"
      prop="clusterId">
    </el-table-column>
    <el-table-column
      sortable
      label="组团 名称"
      prop="title">
    </el-table-column>
    <el-table-column
      sortable
      width="180px"
      label="组团 类型"
      prop="type">
    </el-table-column>
    <el-table-column
      label="组团 描述"
      prop="actiContent">
    </el-table-column>
    <el-table-column
      align="right">
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
    <el-dialog :visible.sync="dialogFormVisible" :append-to-body="true" title="组团信息修改" center>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item :label-width="formLabelWidth" prop="title" label="组团名称">
          <el-input v-model="form.title" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="tel" label="联系电话">
          <el-input v-model="form.tel" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="WeChat" label="微信">
          <el-input v-model="form.WeChat" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="totals" label="组团人数">
          <el-input v-model="form.totals" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="type" label="组团类型">
          <el-select v-model="form.type" clearable placeholder="请选择组团类型">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="specLocat" label="具体位置">
          <el-input
            v-model="form.specLocat" autocomplete="off" style="width: 300px;">
          </el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="desc" label="描述">
          <el-input
            v-model="form.desc" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" style="width: 400px;">
          </el-input>
        </el-form-item>
        <el-form-item prop="clusterId" hidden>
          <el-input v-model="form.clusterId"></el-input>
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
    export default {
      data() {
        return {
          clusterList: [],
          types: [],
          search: '',
          dialogFormVisible: false,
          formLabelWidth: '230px',
          form: {
            title: '',
            tel: '',
            WeChat: '',
            totals: '',
            type: [],
            specLocat: '',
            desc: '',
            clusterId: ''
          },
          rules:{
            title:[{
              required:true,type:'string',message:'请输入即刻组团标题',trigger:'blur'
            }],
            type:[{
              required:true,type:'string',message:'请选择即刻组团类型',trigger:'change'
            }],
            specLocat:[{
              required:true,type:'string',message:'请输入目的地的具体位置信息',trigger:'blur'
            }],
            desc:[{
              required:true,type:'string',message:'请输入如何到达目的地的指引描述',trigger:'blur'
            }],
            tel:[{
              required:true,type:'string',message:'请输入发起人联系电话号码',trigger:'blur',
            },{
              validator:(rule,value,callback)=>{
                let valid_rule = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
                if(!value.match(valid_rule)){
                  callback(new Error('请输入正确的手机号码'))
                }else{
                  callback()
                }
              },
              trigger:'blur'
            }],
            totals:[{
              required:true,type:'number',message:'请输入活动人数',trigger:'blur'
            },{
              validator:(rule,value,callback)=>{
                if(value<2&&value>30){
                  callback(new Error('活动人数范围为2-30人'))
                }else{
                  callback()
                }
              },
              trigger:'blur'
            }]
          },
        }
      },
      async mounted(){
        let {status,data:{pois}} = await this.$axios.get('/search/resultsByKeywords',{
          params:{
            city: '',
            keyword: ''
          }
        })
        this.clusterList = pois

        let {status:status2,data:{tempArray}} =await this.$axios.get('/geo/getMenuChild')
        if(status2 === 200){
          tempArray.forEach(item => {
            this.types.push({"value" : String(item), "label" : String(item)});
          })
        }
      },
      methods:{
        async submit(){
          let {status,data:{pois}} = await this.$axios.get('/search/resultsByKeywords',{
            params:{
              city: this.$store.state.geo.position.city.replace("市",''),
              keyword: this.search
            }
          })
          this.clusterList = pois
        },
        handleEdit(index, row) {
          this.dialogFormVisible = true
          this.form.title = row.title
          this.form.tel = row.tel
          this.form.WeChat = row.WeChat
          this.form.desc = row.guide.desc
          this.form.specLocat = row.guide.specLocat
          this.form.totals = row.totals
          this.form.type = row.type
          this.form.clusterId = row.clusterId
        },
        async updateCluster(){
          let self = this
          let {status,data} = await self.$axios.post('/cluster/updateCluster',{
            title: self.form.title,
            type: self.form.type,
            tel: self.form.tel,
            WeChat: self.form.WeChat,
            totals: self.form.totals,
            specLocat: self.form.specLocat,
            desc: self.form.desc,
            clusterId: self.form.clusterId
          })

          if(status !== 200){
            self.$message({
              message: '更新失败，请刷新重试~',
              type: 'warning'
            });
          }else{
            let {status,data:{cluster}} = await self.$axios.get('/cluster/getAllCluster')
            self.clusterList = cluster
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
                    clusterId:row.clusterId
                  }
                })
                let {status:status2,data:{cluster}} = await self.$axios.get('/cluster/getAllCluster')
                self.clusterList = cluster
                done()
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

<style lang="scss">

</style>
