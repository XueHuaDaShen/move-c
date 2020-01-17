<template>
  <div class="news-info limit-width">
    <div class="title">
      <img :src="news" alt="">
    </div>
    <div class="news">
      <h2 class="title">{{newsItem.title}}</h2>
      <div class="time">{{newsItem.time}}</div>
      <div class="newsInfoContent" v-html="newsInfoContent"></div>
    </div>
  </div>
</template>
<script>
import newsList from './newsList'
export default {
  name: 'news-info',
  data() {
    return {
      news: require('@/assets/img/title/news.png'),
      list: newsList,
      newsItem: null,
      newsInfoContent: null
    }
  },
  created() {
    this.getnews();
    this.renderHtml();
  },
  mounted() {
  },
  computed: {},
  watch: {},
  methods: {
    getnews() {
      let id = this.$route.query.id;
      let news = this.list.filter(item => item.id == id)[0];
      this.newsItem = news;
    },
    // 插入图片
    renderHtml() {
      let html = '';
      let data = this.newsItem.content;
      for(let i in data) {
        let item = data[i];
        if(item.type === 'text') {
          html += `<p>${item.inner}</p>`
        }
        if(item.type === 'img') {
          html += `<p class="text-center"><span><img src="${item.inner}" alt=""></span><br><span>${item.desc}</span></p>`
        }
        if(item.type === 'title') {
          html += `<h4>${item.inner}</h4>`
        }
      }
      this.newsInfoContent = html;
    }
  },
}
</script>
<style lang="scss">
.newsInfoContent{
  p{
    margin-bottom:.2rem;
    color:#666;
    text-align:left;
    text-indent: 2em;
    line-height:2em;
    img{
      width:5rem;
      vertical-align: middle;
    }
  }
  .text-center{
    text-align:center;
  }
  h4{
    text-align:left;
  }
}
</style>
<style lang="scss" scoped>
.news-info{
  width:100%;
  background:#f7f7f7;
  padding:0 .9rem;
  .news{
    background:#fff;
    padding:.2rem;
  }
  .time{
    margin:.2rem 0;
    color:#666;
  }
}
</style>

