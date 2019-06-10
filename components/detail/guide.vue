<template>
  <dl class="m-guide">
    <dt>
      <h1>位置</h1>
      <ul>
        <li class="guide-title">
          {{ meta.city }}， {{ meta.province }}，中国
          <p>{{ meta.guide.specLocat }}</p>
        </li>
        <li class="guide-title">出行信息
          <p>{{ meta.guide.desc }}</p>
        </li>
        <li>
          <h3>
            <span class="el-icon-picture"></span>
            即刻图片指引
            <p></p>
          </h3>
        </li>
        <li>
          <el-carousel height="300px" indicator-position="none">
            <el-carousel-item v-for="(item,idx) in meta.guide.photos" :key="idx">
              <h3><img :src="item" alt="meta.title" width="100%" height="100%"></h3>
            </el-carousel-item>
          </el-carousel>
        </li>
      </ul>
    </dt>
  </dl>
</template>

<script>
    export default {
      props:{
        meta:{
          type: Object,
          default:()=>{
            return {}
          }
        }
      }
    }
</script>
