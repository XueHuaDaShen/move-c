<template>
  <div class="banner">
    <div class="swiper-content limit-width">
      <div class="swiper-container" id="mySwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item,index) in bannerlist" :key="index">
            <!-- <router-link
              :to="{name:'activityDetail',query:{id:item._id}}"
              :title="item.title"
            > -->
              <img :src="item.img">
            <!-- </router-link> -->
          </div>
        </div>
        <div class="swiper-pagination" v-if="bannerlist.length>1"></div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from "swiperJs";
import "swiper/css/swiper.css";
const banner1 = require('@/assets/img/banner/banner1.png')
const banner2 = require('@/assets/img/banner/banner2.png')
const banner3 = require('@/assets/img/banner/banner3.png')
export default {
  name: 'banner',
  data() {
    return {
      bannerlist: [
        {img: banner1, url: 'banner1'},
        {img: banner2, url: 'banner2'},
        {img: banner3, url: 'banner3'},
      ]
    }
  },
  created() {},
  mounted() {
    this.swiperInit();
  },
  computed: {},
  watch: {},
  methods: {
    swiperInit() {
      let self = this;
      this.mySwiper = new Swiper("#mySwiper", {
        loop: self.bannerlist.length > 1,
        speed: 1000,
        loopAdditionalSlides: 20,
        // navigation: {
        //   nextEl: ".arrow-right",
        //   prevEl: ".arrow-left"
        // },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {
          el: ".swiper-pagination",
          // type: 'custom',
          clickable: true,
          bulletClass: "my-bullet",
          bulletActiveClass: "my-bullet-active",
          renderBullet: function(index, className) {
            return '<span class=" ' + className + ' "></span>';
          }
        }
      });
      // this.mySwiper.el.onmouseover = function() {
      //   self.mySwiper.autoplay.stop();
      // };
      // this.mySwiper.el.onmouseleave = function() {
      //   self.mySwiper.autoplay.start();
      // };
    },
  },
}
</script>
<style lang="scss">
.swiper-pagination{
  .my-bullet {
    width: 12px;
    height: 12px;
    text-align: center;
    font-size: 12px;
    color: #000;
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    display: inline-block;
    margin: 0 5px;
    border-radius: 50%;
    outline: none;
  }

  .my-bullet-active {
    color: #fff;
    background: #fff;
  }
}
</style>
<style lang="scss" scoped>
.banner{
  width:100%;
  // height:322px;
  .swiper-content, .swiper-container{
    width:100%;
    // height:100%;
    position: relative;
    overflow: hidden;
    img{
      width:100%;
      // height:100%;
    }
  }
}
</style>

