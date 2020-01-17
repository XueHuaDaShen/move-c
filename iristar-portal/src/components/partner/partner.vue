<template>
  <div class="partner limit-width">
    <div class="partner-bg-img">
      <img :src="partner" alt="">
      <div class="partner-wrap">
        <div class="partner-item" v-for="(item, i) in partnerList" :key="i">
          <div class="inner" v-for="(img, j) in item" :key="j"><img :src="img" alt=""></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const p1 = require('@/assets/img/partner/1.png');
const p2 = require('@/assets/img/partner/2.png');
const p3 = require('@/assets/img/partner/3.png');
const p4 = require('@/assets/img/partner/4.png');
const p5 = require('@/assets/img/partner/5.png');
const p6 = require('@/assets/img/partner/6.png');
const p7 = require('@/assets/img/partner/7.png');
const p8 = require('@/assets/img/partner/8.png');
const p9 = require('@/assets/img/partner/9.png');
const p10 = require('@/assets/img/partner/10.png');
const p11 = require('@/assets/img/partner/11.png');
const p12 = require('@/assets/img/partner/12.png');
const p13 = require('@/assets/img/partner/13.png');
const p14 = require('@/assets/img/partner/14.png');
const p15 = require('@/assets/img/partner/15.png');
const p16 = require('@/assets/img/partner/16.png');
const p17 = require('@/assets/img/partner/17.png');
const p18 = require('@/assets/img/partner/18.png');
const p19 = require('@/assets/img/partner/19.png');
const p20 = require('@/assets/img/partner/20.png');
const p21 = require('@/assets/img/partner/21.png');
// const p22 = require('@/assets/img/partner/22.png');
const p23 = require('@/assets/img/partner/23.png');
const p24 = require('@/assets/img/partner/24.png');
const p25 = require('@/assets/img/partner/25.png');
export default {
  name: 'partner',
  data() {
    return {
      partner: require('@/assets/img/title/partner.png'),
      partnerList: [
        [p1, p2, p3, p4, p21,p5],
        [p6, p7, p8, p9, p23, p10],
        [p11, p12, p13, p14, p24, p15],
        [p16, p17, p18, p19, p25, p20],
        // [ p25],
      ]
    }
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {},
}
</script>
<style lang="scss" scoped>
.partner{
  padding:.2rem 0;
  .partner-bg-img{
    position: relative;
  }
  .partner-item{
    overflow: hidden;
    margin-bottom:.2rem;
    text-align:center;
    &:last-child{
      margin-bottom:0;
    }
    .inner{
      // float: left;
      display:inline-block;
      width:11%;
      margin:0 1%;
      img{
        width:100%;
      }
      &:last-child{
        margin-right:0;
      }
      &:first-child{
        margin-left:0;
      }
    }
  }
}
</style>

