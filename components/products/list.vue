<template>
  <div class="m-products-list">
    <dl>
      <dd class="s-nav-active" sortBy="智能排序">智能排序</dd>
      <dd class="s-comment" sortBy="点赞最高" @click="navSelect">点赞最高</dd>
      <dd class="s-comment" sortBy="评论最多" @click="navSelect">评论最多</dd>
    </dl>
    <ul>
      <Item v-for="(item,idx) in list.slice((currentPage-1)*pageSize,currentPage*pageSize)" :key="idx" :meta="item"/>
    </ul>
    <div class="block">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        :total="list.length"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Item from './product.vue'
    export default {
      components:{
        Item
      },
      props:{
        list: {
          type: Array,
          default(){
            return []
          }
        }
      },
      data() {
        return {
          currentPage: 1,
          pageSize:10,
          sortBy:'',
          nav: [
            {
              name: 's-default',
              txt: '智能排序',
              active: true
            },{
              name: 's-visit',
              txt: '点赞最高',
              active: false
            }, {
              name: 's-comment',
              txt: '评论最多',
              active: false
            }
          ]
        }
      },
      async mounted(){
        for(let i = 0;i< this.list.length;i++) {
          let {data:{count}} = await this.$axios.get('/edit/getComment',{
            params:{
              clusterId: this.list[i].clusterId
            }
          })
          this.list[i].commentCount = count
        }
      },
      methods: {
        navSelect: async function (e) {
          let dom = e.target;
          let tag = dom.tagName.toLowerCase();
          let sortBy = ''
          if (tag === 'dd') {
            sortBy = dom.getAttribute('sortBy');
          }
          if(sortBy === "点赞最高"){
            if(this.nav[1].active === true){
              this.nav[1].active=false
              dom.setAttribute('class','s-comment-after')
              //根据like排序 由大到小
              this.list.sort(function(x,y){
                if(x["like"].length < y["like"].length){
                  return 1;
                }
                if(x["like"].length > y["like"].length){
                  return -1;
                }
                return 0;
              })
            }else{
              this.nav[1].active=true
              dom.setAttribute('class','s-nav-active s-comment-before')
              //根据like排序 由小到大
              this.list.sort(function(x,y){
                if(x["like"].length < y["like"].length){
                  return -1;
                }
                if(x["like"].length > y["like"].length){
                  return 1;
                }
                return 0;
              })
            }
          }else if(sortBy === "评论最多"){
            if(this.nav[2].active === true){
              this.nav[2].active=false
              dom.setAttribute('class','s-comment-after')

              this.list.sort(function(x,y){
                if(x.commentCount > y.commentCount){
                  return 1;
                }
                if(x.commentCount < y.commentCount){
                  return -1;
                }
                return 0
              })

            }else{
              this.nav[2].active=true
              dom.setAttribute('class','s-nav-active s-comment-before')

              this.list.sort(function(x,y){
                if(x.commentCount > y.commentCount){
                  return -1;
                }
                if(x.commentCount < y.commentCount){
                  return 1;
                }
                return 0
              })
            }
          }
        },
        handleSizeChange(val) {
          this.pageSize = val;
        },
        handleCurrentChange(val) {
          this.currentPage = val;
        }
      }
    }
</script>
