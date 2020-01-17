<template>
  <div class="technology limit-width">
    <div class="title"><img :src="tech" alt=""></div>
    <div class="content">
      <div class="item" v-for="(item, i) in technologyList" :key="i">
        <div class="img" @click="toInfo"><img :src="item.img" alt=""></div>
        <h2 class="t-name" @click="toInfo">{{item.title}}</h2>
        <p class="t-desc" v-for="(info, d) in item.info" :key="d">{{info}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import technologyList from './technologyList'
export default {
  name: 'technology',
  data() {
    return {
      tech: require('@/assets/img/title/technology.png'),
      technologyList: technologyList,
    }
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    toInfo() {
      this.$router.push({
        name: 'technologyContent'
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.technology{
  .title{
    width:100%;
    // height:60px;
  }
  .content{
    clear:both;
    display:table;
    padding: .5rem 0;
    width:100%;
    .item{
      // display:inline-block;
      float: left;
      width:33%;
      text-align:center;
      .img{
        width:3rem;
        height:2rem;
        background:#ccc;
        // border-radius:50%;
        overflow: hidden;
        margin:0 auto;
        cursor: pointer;
        transition: transform .3s;
        &:hover{
          transform: scale(1.1);
        }
        img{
          width:100%;
        }
      }
      .t-name{
        cursor: pointer;
      }
      h2{
        font-size:.2rem;
        margin: .2rem 0 .1rem 0;
      }
      &:nth-child(2){
        margin:0 0.5%;
      }
    }
  }
}
</style>

