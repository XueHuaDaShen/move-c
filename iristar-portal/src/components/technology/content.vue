<template>
  <div class="technologyContent limit-width">
    <img :src="technology" alt="">
    <div class="news-list">
      <dl v-for="(item, i) in technologyList" :key="i" :class="item.imgPo">
        <dd><img :src="item.img" alt=""></dd>
        <dt>
          <h2 class="name">{{item.title}}</h2>
          <p class="desc">{{item.desc}}</p>
          <div class="point" v-if="item.showPoint">
            <span v-for="(po, p) in item.point" :key="p">{{po}}</span>
          </div>
        </dt>
      </dl>
    </div>
  </div>
</template>
<script>
import technologyList from './technologyList'
export default {
  name: 'technologyContent',
  data() {
    return {
      technology: require('@/assets/img/title/technology.png'),
      technologyList: technologyList
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
.technologyContent{
  padding:0 .9rem;
  background:#f7f7f7;
  .news-list{
    padding:0 .25rem;
    background:#fff;
    dl.imgRight{
      dt{
        padding-left:0.2rem;
        padding-right:3.75rem;
      }
    }
    dl{
      display:table;
      padding:.25rem 0;
      width:100%;
      border-bottom:.01rem solid #769bf6;
      position: relative;
      &:last-child{
        border:none;
      }
      dd{
        width:3.5rem;
        height:2.2rem;
        overflow: hidden;
        img{
          width:100%;
        }
      }
      dt{
        padding:0 .2rem;
        float:inherit;
        padding-left:3.75rem;
        text-align:left;
      }
      .name{
        font-size:.24rem;
      }
      .desc, .time, .knowMore{
        color:#666;
        margin-top:.12rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .desc{
        text-indent: 2em;
        line-height: 2em;
        margin-bottom:.2rem;
        margin-top:.2rem;
      }
      .point{
        // text-align: center;
        span{
          display:inline-block;
          padding:.1rem;
          border:1px solid #ccc;
          color:#000;
          font-size:.18rem;
          // font-weight: bold;
          // color:#fff;
          border-radius:5px;
        }
        span+span{
          margin-left:.5rem;
        }
      }
      .knowMore{
        padding:0;
        color:#769bf6;
        left:inherit;
        right:.25rem;
        border:none;
      }
    }
  }
}
</style>

