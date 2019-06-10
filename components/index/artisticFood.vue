<template>
  <section class="m-istyle">
    <dl class="artisticFood" @mouseover="over">
      <dt>饮食</dt>
      <dd :class="{active:FoodKind==='breakfast'}" FoodKind="breakfast" keyword="早茶">早茶</dd>
      <dd :class="{active:FoodKind==='lunch'}" FoodKind="lunch" keyword="午餐">午餐</dd>
      <dd :class="{active:FoodKind==='dinner'}" FoodKind="dinner" keyword="晚餐">晚餐</dd>
      <dd :class="{active:FoodKind==='midnight'}" FoodKind="midnight" keyword="夜宵">夜宵</dd>
      <dd :class="{active:FoodKind==='BBQ'}" FoodKind="BBQ" keyword="BBQ/烧烤">BBQ/烧烤</dd>
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
        FoodKind: 'breakfast',
        FoodList: {
          breakfast: [],
          lunch: [],
          dinner: [],
          midnight: [],
          BBQ:[]
        }
      }
    },
    computed:{
      cur: function () {
        return this.FoodList[this.FoodKind]
      }
    },
    async mounted(){
      let self=this;
      let {status,data:{count,pois}}=await self.$axios.get('/search/resultsByType',{
        params:{
          keyword:'早茶'
        }
      })
      if(status===200&&count>0){
        let r= pois.filter(item=>item.cover.photos.length)
        self.FoodList[self.FoodKind]=r.slice(0,10)
      }else{
        self.FoodList[self.FoodKind]=[]
      }
    },
    methods: {
      over: async function (e) {
        let dom = e.target;
        let tag = dom.tagName.toLowerCase();
        let self = this;
        if (tag === 'dd') {
          this.FoodKind = dom.getAttribute('FoodKind');
          let keyword = dom.getAttribute('keyword');

          let {status, data: {count,pois}} = await self.$axios.get('/search/resultsByType', {
            params:{
              keyword
            }
          });
          if(status === 200 && count > 0){
            let result = pois.filter(item => item.cover.photos.length)
            self.FoodList[self.FoodKind] = result.slice(0,10)
          }else{
            self.FoodList[self.FoodKind] = []
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "@/assets/css/index/artistic.scss";
</style>
