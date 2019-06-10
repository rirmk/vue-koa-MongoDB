<template>
  <div class="m-nav">
    <ul class="nav">
      <li class="list">
        <nuxt-link to="/order">我的组团</nuxt-link>
        <dl>
          <dd><nuxt-link to="/order">全部组团</nuxt-link></dd>
          <dd><nuxt-link to="/cluster">建立组团</nuxt-link></dd>
        </dl>
      </li>
      <li>
        <nuxt-link to="/order">手机APP</nuxt-link>
      </li>
      <!--<li class="list site">
        <nuxt-link to="/site">网站导航</nuxt-link>
        <div class="subContainer">
          <dl class="hotel">
            <dt>酒店旅遊</dt>
            <dd>國際機票</dd>
            <dd>國際機票</dd>
            <dd>國際機票</dd>
            <dd>國際機票</dd>
            <dd>國際機票</dd>
            <dd>國際機票</dd>
            <dd>國際機票</dd>
            <dd>國際機票</dd>
            <dd>國際機票</dd>
            <dd>國際機票</dd>
            <dd>國際機票</dd>
            <dd>國際機票</dd>
          </dl>
          <dl class="food">
            <dt>吃美食</dt>
            <dd>特色小吃</dd>
            <dd>燒烤</dd>
            <dd>烤魚</dd>
            <dd>烤魚</dd>
            <dd>烤魚</dd>
            <dd>烤魚</dd>
          </dl>
          <dl class="movie">
            <dt>看電影</dt>
            <dd>熱映電影</dd>
            <dd>熱映電影</dd>
            <dd>熱映電影</dd>
            <dd>熱映電影</dd>
            <dd>熱映電影</dd>
            <dd>熱映電影</dd>
          </dl>
          <dl class="app">
            <dt>手機應用</dt>
            <dd>
              <a href="#">
                <img src="https://s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/appicons/meituan.png">
              </a>
            </dd>
            <dd>
              <a href="#">
                <img src="https://s1.meituan.net/bs/fe-web-meituan/404d350/img/appicons/waimai.png">
              </a>
            </dd>
            <dd>
              <a href="#">
                <img src="https://s0.meituan.net/bs/fe-web-meituan/404d350/img/appicons/zhenguo.png">
              </a>
            </dd>
            <dd>
              <a href="#">
                <img src="https://s1.meituan.net/bs/fe-web-meituan/404d350/img/appicons/dianping.png">
              </a>
            </dd>
            <dd>
              <a href="#">
                <img src="https://s1.meituan.net/bs/fe-web-meituan/404d350/img/appicons/maoyan.png">
              </a>
            </dd>
          </dl>
        </div>
      </li>-->
    </ul>
  </div>
</template>

<script>
    import Nuxt from "../../../.nuxt/components/nuxt";
    import NuxtLink from "../../../.nuxt/components/nuxt-link";

    export default {components: {
      NuxtLink,
      Nuxt}}
</script>

<style lang="css">

</style>
