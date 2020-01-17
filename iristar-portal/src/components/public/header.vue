<template>
  <div class="myHeader">
    <nav class="nav">
      <div class="limit-width">
        <div class="logo"><img :src="logo" alt=""></div>
        <div style="height:100%;">
          <div class="nav-item" @mouseover="handleMouseOver(nav)" @mouseleave="handleMouseLeave(nav)" :class="tag == nav.url ? 'active' : ''" v-for="(nav, n) in menu" :key="n">
            <div @click="changeNav(nav)">
              <strong>{{nav.name}}</strong>
              <!-- <span>{{nav.en}}</span> -->
            </div>
            <ul class="dropMenu" :ref="nav.url" :class="nav.url+'-dropMenu'" v-if="nav.data">
              <li v-for="(child, c) in nav.data" :key="c" @click="toInfo(child, nav.childUrl, nav.url)">{{child.title}}</li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
import productList from '../product/productList'
import solutionList from '../solution/solutionList'
export default {
  name: 'myHeader',
  data() {
    return {
      logo: require('@/assets/img/home/logo2.png'),
      tag: 'home',
      menu: [
        {name: '首页', en: 'home', url: 'home'},
        {name: '核心技术', en: 'core technology', url: 'technologyContent'},
        {name: '产品系列', en: 'product ranges', url: 'productContent', childUrl: 'productInfo', data: productList},
        {name: '解决方案', en: 'solution', url: 'solutionContent', childUrl: 'solutionInfo', data: solutionList},
        {name: '新闻中心', en: 'news', url: 'newsContent'},
        {name: '关于我们', en: 'about us', url: 'aboutUs'},
        {name: '加入我们', en: 'join us', url: 'joinUs'},
      ],
      classNames: '',
    }
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    changeNav(nav) {
      this.tag = nav.url;
      if(nav.url == this.$route.name) {
        return;
      }
      this.$router.push({
        name: nav.url
      })
    },
    handleMouseOver(nav) {
      if(!nav.data) return;
      let mask = nav.url
      let eleMask = this.$refs[mask][0];
      this.classNames = eleMask.getAttribute('class');
      eleMask.style.display = 'block';
      eleMask.setAttribute('class', mask+'-dropMenu dropMenu'+' sliderDown')
    },
    handleMouseLeave(nav) {
      if(!nav.data) return;
      let mask = nav.url
      let eleMask = this.$refs[mask][0];
      eleMask.style.display = 'none';
      eleMask.setAttribute('class', mask+'-dropMenu dropMenu')
    },
    toInfo(pro, url, tag) {
      this.tag = tag;
      this.$router.push({
        name: url,
        query: {
          id: pro.id
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.myHeader{
  height:60px;
  position: fixed;
  z-index:9999;
  width:100%;
  background:#fff;
}
@keyframes sliderDown {
  0% {
    height:0;
  }
  100% {
    height:100%;
  }
}
.sliderDown{
  animation-name: sliderDown;     // 动画名称
  animation-direction: alternate;   // 动画在奇数次（1、3、5...）正向播放，在偶数次（2、4、6...）反向播放。
  animation-timing-function: ease-in;    // 动画执行方式，linear：匀速；ease：先慢再快后慢；ease-in：由慢速开始；ease-out：由慢速结束；ease-in-out：由慢速开始和结束；
  animation-delay: 0s;    // 动画延迟时间
  animation-iteration-count: 1;    //  动画播放次数，infinite：一直播放
  animation-duration: 0.3s;   // 动画完成时间
}

@keyframes sliderWidth {
  0% {
    width:0;
  }
  100% {
    width:100%;
  }
}
.nav{
  height:100%;
  .limit-width{
    clear: both;
    min-width: 935px;
    max-width: 1440px;
    text-align:right;
    height: 100%;
    .logo{
      height:100%;
      width:120.13px;
      float: left;
      margin-left:.2rem;
      img{
        width:100%;
        height:100%;
      }
    }
    .active{
      // border-bottom:2px solid #769bf6;
      &::after{
        content: '';
        width:100%;
        height:2px;
        background:#769bf6;
        position: absolute;
        left:0;
        bottom:1px;
        animation-name: sliderWidth;     // 动画名称
        animation-direction: alternate;   // 动画在奇数次（1、3、5...）正向播放，在偶数次（2、4、6...）反向播放。
        animation-timing-function: linear;    // 动画执行方式，linear：匀速；ease：先慢再快后慢；ease-in：由慢速开始；ease-out：由慢速结束；ease-in-out：由慢速开始和结束；
        animation-delay: 0s;    // 动画延迟时间
        animation-iteration-count: 1;    //  动画播放次数，infinite：一直播放
        animation-duration: 0.3s;   // 动画完成时间
      }
    }
    .nav-item{
      display:inline-block;
      text-align:center;
      margin-right:40px;
      // padding:20px 0;
      cursor: pointer;
      height: 100%;
      position: relative;
      >div{
        transition: color .3s;
        line-height:60px;
      }
      &:hover{
        >div{
          color:#769bf6;
        }
        .dropMenu{
          display:block;
        }
      }
      .productContent-dropMenu{
        width:2.4rem;
        left:50%;
        margin-left:-1.2rem;
      }
      strong{
        display:block;
      }
      span{
        display:block;
        font-size:14px;
      }
      .dropMenu{
        position: absolute;
        top:59px;
        background:#fff;
        display:none;
        overflow: hidden;
        font-size:.15rem;
        li{
          white-space: nowrap;
          padding:.05rem .1rem;
          &:hover{
            background:#ccc;
            color:#769bf6;
          }
        }
      }
    }
  }
}
</style>

