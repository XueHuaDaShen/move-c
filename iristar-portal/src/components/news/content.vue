<template>
  <div class="newsContent limit-width">
    <img :src="news" alt="">
    <div class="news-list">
      <dl v-for="(item, i) in list" :key="i" :class="item.imgPo">
        <dd><img :src="item.img" alt="" @click="toInfo(item)"></dd>
        <dt>
          <h2 class="name" @click="toInfo(item)">{{item.title}}</h2>
          <p class="time">{{item.time}}</p>
          <p class="desc" @click="toInfo(item)">{{formatContent(item.desc)}}</p>
          <span class="knowMore" @click="toInfo(item)">查看全文>></span>
        </dt>
      </dl>
      <div class="page" v-if="showPage">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="pageNum"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="newsList.length">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import newsList from './newsList'
export default {
  name: 'newsContent',
  data() {
    return {
      //导入图片
      news: require('@/assets/img/title/news.png'),
      //导入数据
      newsList: newsList,
      showPage: true,
      list: [],
      pageNum: 1,
      pageSize: 15,
    }
  },
  created() {
    this.setPageList();
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    formatContent(content) {
      if(content.length > 145) {
        return content.substr(0, 145)+'...'
      }
      return content
    },
    toInfo(item) {
      this.$router.push({
        name: 'newsInfo',
        query: {
          id: item.id
        }
      })
    },
    setPageList() {
      if(this.showPage) {
        this.list = this.newsList.slice((this.pageNum-1)*this.pageSize, (this.pageSize*this.pageNum));
      }else{
        this.list = this.newsList;
      }
    },
    handleCurrentChange(page) {
      this.pageNum = page;
      this.setPageList();
      document.getElementsByTagName('html')[0].scrollTop = 0;
    }
  },
}
</script>
<style lang="scss" scoped>
.newsContent{
  padding:0 .9rem;
  background:#f7f7f7;
  .news-list{
    padding:0 .25rem;
    background:#fff;
    .page{
      padding:.2rem 0;
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
          cursor: pointer;
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
        cursor: pointer;
        &:hover{
          color:#769bf6;
        }
      }
      .desc, .time, .knowMore{
        color:#666;
        margin-top:.12rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .desc{
        text-indent: 2em;
        margin-bottom:.2rem;
        cursor: pointer;
      }
      .knowMore{
        padding:0;
        color:#769bf6;
        left:inherit;
        right:.25rem;
        border:none;
        &:hover{
          background:none;
          color:#769bf6;
        }
      }
    }
  }
}
</style>

