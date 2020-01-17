<template>
  <div class="aboutUs limit-width">
    <div class="title"><img :src="solutionImg" alt=""></div>
    <div class="content">
      <div class="title-img"><img :src="solutionItem.infoImg" alt=""></div>
      <p>{{solutionItem.info}}</p>
      <div class="img-icon-text">
        <div class="item" v-for="(item, i) in solutionItem.infoData" :key="i">
          <span><img :src="item.img" alt=""></span>
          <p>{{item.title}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import solutionList from './solutionList'
export default {
  name: 'aboutUs',
  data() {
    return {
      solutionList: solutionList,
      solutionImg: require('@/assets/img/title/solution.png'),
      solutionItem: null,
    }
  },
  created() {
    this.getnews();
  },
  mounted() {
  },
  computed: {},
  watch: {
    '$route.query.id': function(n, o) {
      this.getnews();
    }
  },
  methods: {
    getnews() {
      let id = this.$route.query.id;
      let solution = this.solutionList.filter(item => item.id == id)[0];
      this.solutionItem = solution;
    },
  },
}
</script>
<style lang="scss" scoped>
.aboutUs{
  color:#666;
  .content{
    background:#fff;
    padding:.25rem 1rem;
    text-align:left;
    p{
      text-indent: 2em;
      line-height: 2em;
    }
  }
  .title-img{
    margin:0 auto;
    margin-bottom:.3rem;
    img{
      width:100%;
    }
  }
  .img-icon-text{
    display:table;
    width:100%;
    margin-top:.3rem;
    .item{
      float: left;
      margin:3.3% 8.65%;
      width:15.7%;
      text-align:center;
      span{
        display:block;
        margin-bottom:.2rem;
        img{
          width:80%;
        }
      }
      p{
        text-align:center;
        text-indent:0;
      }
    }
  }
}
</style>

