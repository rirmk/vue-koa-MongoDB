<template>
  <el-row class="page-admin">
    <el-col :span="3">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleOpen">
        <el-menu-item index="1">
          <i class="el-icon-menu"></i>
          <span slot="title">组团信息管理</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-document"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-setting"></i>
          <span slot="title">禁止用户发布管理</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">组团成员管理</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col v-if="view === 'clusterEdit'" :span="21">
      <cluster-edit/>
    </el-col>
    <el-col v-else-if="view === 'userEdit'" :span="21">
      <user-edit/>
    </el-col>
    <el-col v-else :span="21">
      <ban/>
    </el-col>
  </el-row>
</template>

<script>
    import ClusterEdit from '@/components/admin/clusterEdit.vue'
    import UserEdit from '@/components/admin/userEdit.vue'
    import Ban from '@/components/admin/ban.vue'
    export default {
      layout: 'admin',
      components:{
        ClusterEdit,
        UserEdit,
        Ban
      },
      data(){
        return {
          view: 'clusterEdit'
        }
      },
      async mounted(){
        const {status:status2,data:{user}} = await this.$axios.get('/users/getUser')
        let username = user
        if(status2 === 200 && username !== 'admin'){
         location.href = '/'
        }
      },
      methods: {
        handleOpen(key, keyPath) {
          switch(key){
            case '1':
              this.view = 'clusterEdit';
              break;
            case '2':
              this.view = 'userEdit';
              break;
            case '3':
              this.view = 'ban';
              break;
          }
        }
      }
    }
</script>

<style lang="scss">
  @import '@/assets/css/admin/index.scss';
</style>
