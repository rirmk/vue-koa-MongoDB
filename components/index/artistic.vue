<template>
  <section class="m-istyle">
    <dl @mouseover="over">
      <dt>运动</dt>
      <dd :class="{active:kind==='volleyball'}" kind="volleyball" keyword="排球">排球</dd>
      <dd :class="{active:kind==='basketball'}" kind="basketball" keyword="篮球">篮球</dd>
      <dd :class="{active:kind==='football'}" kind="football" keyword="足球">足球</dd>
      <dd :class="{active:kind==='run'}" kind="run" keyword="跑步">跑步</dd>
    </dl>
    <ul v-if="cur.length" class="ibody">
      <li v-for="item in cur" :key="item.clusterId">
        <nuxt-link :to="{path: 'detail',query: {keyword: item.title,type: item.type, college: item.college}}">
          <item :item="item"/>
        </nuxt-link>
      </li>
    </ul>
    <div v-else class="noList">
      <nuxt-link to="/cluster">
        <el-button type="primary" size="small" class="createButton" round>创建即刻组团</el-button>
      </nuxt-link>
      <p>还没有组团信息哦 赶紧创建组团吧！</p>
    </div>
  </section>
</template>

<script>
  import Item from "./artisticItem.vue"
  import NuxtLink from "../../.nuxt/components/nuxt-link";
    export default {
      components:{
        NuxtLink,
        Item
      },
      data:()=>{
        return {
          kind: 'volleyball',
          list: {
            volleyball: [],
            basketball: [],
            football: [],
            run: []
          }
        }
      },
      computed:{
        cur: function () {
          return this.list[this.kind]
        }
      },
      async mounted(){
        let self=this;
        let {status,data:{count,pois}}=await self.$axios.get('/search/resultsByType',{
          params:{
            keyword:'排球'
          }
        })
        if(status===200&&count>0){
          let r= pois.filter(item=>item.cover.photos.length)
          self.list[self.kind]=r.slice(0,10)
        }else{
          self.list[self.kind]=[]
        }
      },
      methods: {
        over: async function (e) {
          let dom = e.target;
          let tag = dom.tagName.toLowerCase();
          let self = this;
          if (tag === 'dd') {
            this.kind = dom.getAttribute('kind');
            let keyword = dom.getAttribute('keyword');

            let {status, data: {count,pois}} = await self.$axios.get('/search/resultsByType', {
              params:{
                keyword
              }
            });
            if(status === 200 && count > 0){
              let result = pois.filter(item => item.cover.photos.length)
              self.list[self.kind] = result.slice(0,10)
            }else{
              self.list[self.kind] = []
            }
          }
        }
      }
    }
</script>

<style lang="scss">
@import "@/assets/css/index/artistic.scss";
</style>
