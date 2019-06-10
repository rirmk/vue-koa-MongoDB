<template>
  <el-row class="page-cluster">
    <el-col :span="19">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <ul>
          <li>
            <span class="cluster-head">创建即刻组团</span>
          </li>
          <li>
            <p class="cluster-headBorder">组团信息</p>
            <el-form-item label="标题" prop="title" class="cluster-title">
              <el-input v-model="ruleForm.title" clearable></el-input>
            </el-form-item>
            <el-form-item label="组团类型" prop="type">
              <el-select v-model="ruleForm.type" clearable placeholder="请选择组团类型">
                <el-option
                  v-for="item in types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电话" prop="tel" class="cluster-tel">
              <el-input v-model="ruleForm.tel" clearable></el-input>
            </el-form-item>
            <el-form-item label="微信" prop="WeChat" class="cluster-tel">
              <el-input v-model="ruleForm.WeChat" clearable></el-input>
            </el-form-item>
            <el-form-item label="校区" prop="college">
              <el-select v-model="ruleForm.college" filterable placeholder="请选择">
                <el-option
                  v-for="item in colleges"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动时间" prop="dateTime">
              <el-date-picker
                v-model="ruleForm.dateTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="组团人数" prop="totals">
              <el-input-number v-model="ruleForm.totals" :min="2" :max="30" controls-position="right">
              </el-input-number>
            </el-form-item>
            <el-form-item label="组团介绍" prop="actiContent" class="cluster-specLocat">
              <el-input
                v-model="ruleForm.actiContent"
                type="textarea"
                autosize
                placeholder="请输入组团活动介绍">
              </el-input>
            </el-form-item>
          </li>
          <li>
            <p class="cluster-headBorder">组团指引信息</p>
            <el-form-item label="省份市区" prop="location" class="cluster-location">
              <el-cascader
                :options="address"
                v-model="ruleForm.location"
                filterable
                expand-trigger="hover">
              </el-cascader>
            </el-form-item>
            <el-form-item label="具体位置" prop="specLocat" class="cluster-specLocat">
              <el-input
                v-model="ruleForm.specLocat"
                type="textarea"
                autosize
                placeholder="请填写具体位置">
              </el-input>
            </el-form-item>
            <el-form-item label="描述" prop="desc" class="cluster-specLocat">
              <el-input
                v-model="ruleForm.desc"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="请填写指引描述" >
              </el-input>
            </el-form-item>
          </li>
          <li>
            <p class="cluster-headBorder">上传指引图片</p>
            <el-form-item label="指引图片" prop="guidePhotos" class="cluster-img">
              <el-upload
                ref="guidePhotos"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePictureCardPreview"
                :on-exceed="handleExceed"
                :auto-upload="false"
                :limit="6"
                multiple
                action="/cluster/uploadGuide"
                list-type="picture-card">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img :src="dialogImageUrl" width="100%" alt="">
              </el-dialog>
            </el-form-item>
          </li>
          <li>
            <p class="cluster-headBorder">上传封面图片</p>
            <el-form-item label="封面图片" prop="cover" class="cluster-img">
              <el-upload
                ref="cover"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePictureCardPreview"
                :on-exceed="handleExceed"
                :auto-upload="false"
                :limit="6"
                multiple
                action="/cluster/uploadCover"
                list-type="picture-card">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img :src="dialogImageUrl" width="100%" alt="">
              </el-dialog>
            </el-form-item>
          </li>
          <li>
            <el-form-item>
              <el-button type="primary" @click="createCluster">即刻发布组团</el-button>
              <div v-if="error!==''" class="error">{{ error }}</div>
            </el-form-item>
          </li>
        </ul>
      </el-form>
    </el-col>
    <el-col :span="5">
      <ul>
        <li>
          <span class="cluster-head">组团发布指南</span>
        </li>
        <li>
          <dl class="cluster-tips">
            <dd>标题尽量与类型贴切，方便搜索的同时也方便阅读</dd>
            <dd>电话一定是发布人本人电话，微信可选（可以私下建群聊）</dd>
            <dd>具体位置就是地图上的详细地址</dd>
            <dd>描述就是路线指引，我该怎么去到目的地</dd>
            <dd>指引图片最多只能上传6张，尽量是直观第一人称视角并注明方向</dd>
            <dd>封面同样只能上传6张，用于展示</dd>
            <dd>图片的格式为jpeg/png，且大小不能超过3M</dd>
          </dl>
        </li>
      </ul>
    </el-col>
  </el-row>
</template>

<script>
    export default {
      data() {
        return {
          colleges: [],
          types: [],
          address: [],
          dialogImageUrl: '',
          dialogVisible: false,
          error:'',
          ruleForm:{
            name: '',
            tel: '',
            type: '',
            totals: '',
            actiContent:'',
            specLocat: '',
            desc: '',
            college:'',
            location:[],
            dateTime:[new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
          },
          rules:{
            title:[{
              required:true,type:'string',message:'请输入即刻组团标题',trigger:'blur'
            }],
            type:[{
              required:true,type:'string',message:'请选择即刻组团类型',trigger:'change'
            }],
            college:[{
              required:true,type:'string',message:'请选择校区',trigger:'change'
            }],
            dateTime:[{
              required:true,type:'array',message:'请选择时间范围',trigger:'change'
            }],
            location:[{
              required:true,type:'array',message:'请选择省份市区',trigger:'change'
            }],
            actiContent:[{
              required:true,type:'string',message:'请输入组团活动介绍',trigger:'blur'
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
        const {status:statusUser,data:{ban}} = await this.$axios.get('/users/getUser')
        if(statusUser === 200){
          if(ban === "true"){
            this.$message({
              message: '您已被禁止发布组团信息，请稍后重试~',
              type: 'warning'
            })

            setTimeout(()=>{
              location.href = '/'
            },1000)
          }
        }else{
          location.href='/'
        }


        let {status,data:{tempArray}} =await this.$axios.get('/geo/getMenuChild')
        if(status === 200){
          tempArray.forEach(item => {
            this.types.push({"value" : String(item), "label" : String(item)});
          })
        }
        let {status:status2,data:{colleges}} = await this.$axios.get('/geo/getColleges')
        if(status2 === 200){
          colleges.forEach(item => {
            this.colleges.push({"value" : String(item.college), "label" : String(item.college)})
          })
        }
        let {status:status3,data:{city}} = await this.$axios.get('/geo/getCityCluster')
        if(status3 === 200){
          city.forEach(item =>{
            let children = []
            if(typeof item.name !== "string"){
              for(let i = 0;i<item.name.length;i++){
                children.push({"value": String(item.name[i]),"label": String(item.name[i])})
              }
              this.address.push({"value": String(item.province),"label": String(item.province), "children": children})
            }else{
              this.address.push({"value": String(item.province),"label": String(item.province)})
            }
          })
        }
      },
      methods: {
        handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        },
        handleExceed(files, fileList) {
          this.$message.warning(`当前限制选择 6 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
        },
        async createCluster() {
          let self = this;

          const {data:{user}} = await this.$axios.get('/users/getUser');
          let username = user;
          let province = ''
          let city =  ''
          if(self.ruleForm.location.toString().indexOf(",") > 1){
            province = self.ruleForm.location.toString().split(",")[0]
            city = self.ruleForm.location.toString().split(",")[1].replace("市",'')
          }else{
            province = self.ruleForm.location.toString().replace("市",'')
            city = self.ruleForm.location.toString().replace("市",'')
          }
          let {status:status3,data:data2} = await this.$axios.get('/geo/getCollege',{
            params:{
              city,
              college: self.ruleForm.college
            }
          })
          if(data2.code !== 0){
            this.$message({
              message: data2.msg,
              center: true,
              duration: 0
            });
            this.error = data2.msg
          }

          await this.$refs.guidePhotos.submit()
          await this.$refs.cover.submit()
          let {status, data} = await this.$axios.post('/cluster/createCluster', {
            username,
            province,
            city,
            title: self.ruleForm.title,
            type: self.ruleForm.type,
            tel: self.ruleForm.tel,
            WeChat: self.ruleForm.WeChat,
            dateTime: self.ruleForm.dateTime,
            totals: self.ruleForm.totals,
            college: self.ruleForm.college,
            actiContent: self.ruleForm.actiContent,
            specLocat: self.ruleForm.specLocat,
            desc: self.ruleForm.desc
          })
          if (status === 200) {
            if (data && data.code === 0) {
              let url = '/products?keyword=' + encodeURIComponent(self.ruleForm.title);
              location.href = url;
            } else {
              this.error = data.msg
            }
          } else {
            this.error = `服务器出错，错误码：${status}`
          }

          //定时清空error信息，避免错误信息一直存在
          setTimeout(function () {
            self.error = ''
          }, 2500)
        }
      }
    }
</script>

<style lang="scss">
  @import "@/assets/css/cluster/index.scss";
</style>
