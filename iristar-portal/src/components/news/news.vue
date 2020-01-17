<template>
  <div class="news limit-width">
    <div class="news-bg-img">
      <img :src="news" alt="">
      <dl class="imgLeft">
        <dd><img :src="currentNews.img" alt="" @click="toNewsInfo(currentNews)"></dd>
        <dt>
          <h2 class="name" @click="toNewsInfo(currentNews)">{{currentNews.title}}</h2>
          <p class="desc">{{currentNews.desc}}</p>
          <ul class="news-list">
            <li v-for="(item, i) in newsLilst" :key="i" @click="toNewsInfo(item)">
              <span class="title">{{item.title}}</span>
              <span class="time">{{item.time}}</span>
            </li>
          </ul>
        </dt>
          <span class="knowMore" @click="toInfo">了解更多</span>
      </dl>
    </div>
  </div>
</template>
<script src="../vue-js/vue.js"></script>
<script>
import newsList from './newsList'
export default {
  name: 'news',
  data() {
    return {
      news: require('@/assets/img/title/news.png'),
      currentNews: newsList[0],
      newsLilst: newsList.slice(1, 5)
    }
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    toInfo() {
      this.$router.push({
        name: 'newsContent'
      })
    },
    toNewsInfo(item) {
      this.$router.push({
        name: 'newsInfo',
        query: {
          id: item.id
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.news{
  padding:.2rem 0;
  .news-bg-img{
    position: relative;
    dl{
      display:table;
      padding:.4rem;
      width:100%;
      position: relative;
      dd{
        width:40%;
        background:#fff;
        overflow: hidden;
        img{
          width:100%;
          cursor: pointer;
        }
      }
      dt{
        width:60%;
        padding:0 .4rem;
        text-align:left;
      }
      .name{
        font-size:.24rem;
        cursor: pointer;
        &:hover{
          color:#769bf6;
        }
      }
      .desc{
        color:#666;
        margin-top:.12rem;
        text-indent: 2em;
      }
      .news-list{
        margin-top:.5rem;
        li{
          &::after{
            content: "";
            clear: both;
            display: block;
          }
          &:hover{
            color:#769bf6;
          }
          color:#333;
          width:100%;
          margin:.1rem 0;
          cursor: pointer;
          .title{
            width:60%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow:ellipsis;
            float: left;
          }
          .time{
            float: right;
          }
        }
      }
      .knowMore{
        // position:inherit;
        // float: right;
        // margin-top:.3rem;
        left:inherit;
        right:.8rem;
        bottom:.4rem;
      }
    }
  }
}
</style>

