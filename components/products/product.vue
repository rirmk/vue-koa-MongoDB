<template>
  <dl class="s-item">
    <dt>
      <img :src="meta.cover.photos[0]" :alt="meta.title"/>
    </dt>
    <dd>
      <h3>
        <nuxt-link :to="{path: 'detail',query: {keyword: meta.title, type: meta.type, college: meta.college}}">{{ meta.title }}</nuxt-link>
        <span class="icon-user s-item-username" style="float: right;text-align: right">{{ meta.username }}</span>
      </h3>
      <el-rate v-model="rate" :colors="['#ff9900', '#ff9900', '#FF9900']" disabled/>
      <span v-if="rate > 4" class="s-item-comment">很好</span>
      <span v-else-if="rate > 3" class="s-item-comment">一般</span>
      <span v-else class="s-item-comment">很差</span>
      <span class="s-item-value">{{ Math.floor(meta.like.length / 100) > 5 ? 5 : (Math.floor(meta.like.length / 100) === 0 ? 1 : Math.floor(meta.like.length / 100)) }}分</span>
      <p class="s-item-actiContent">{{ meta.actiContent }}</p>

      <p>
        <span v-if="meta.commentCount" class="icon-bubble  s-item-bubble">{{ meta.commentCount }}</span>
        <span v-else class="icon-bubble s-item-bubble">{{ sum }}</span>
        <span class="icon-heart">{{ meta.like.length }}</span>
        <b>{{ meta.startTime }}~{{ meta.endTime }}</b>
      </p>
      <dl>
        <dd>
          <span class="detail-type">{{ meta.type }}</span>
          <span class="detail-type">{{ meta.college }}</span>
        </dd>
      </dl>
    </dd>
  </dl>
</template>

<script>
    export default {
      props: {
        meta: {
          type:Object,
          default(){
            return {}
          }
        }
      },
      data(){
        return {
          sum: '0'
        }
      },
      computed:{
        rate: function(){
          return  Math.floor(this.meta.like.length / 100) > 5 ? 5 : (Math.floor(this.meta.like.length / 100) === 0 ? 1 : Math.floor(this.meta.like.length / 100))
        }
      },
      async mounted(){
        let {status,data:{count,comments}} =await this.$axios.get('/edit/getComment',{
          params:{
            clusterId:this.meta.clusterId
          }
        })

        if(status === 200){
          this.sum = count;
        }
      }
    }
</script>
