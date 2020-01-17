<template>
  <div class="solution limit-width">
    <div class="solution-bg-img">
      <div class="bg"><img :src="solutionBj" alt=""></div>
      <div class="inner" @click="toInfo">
        <img :src="solution" alt="">
        <span class="knowMore">了解更多</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'solution',
  data() {
    return {
      solution: require('@/assets/img/title/solution.png'),
      solutionBj: require('@/assets/img/home/solution.jpg'),
    }
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    toInfo() {
      this.$router.push({
        name: 'solutionContent'
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.solution{
  padding:.2rem 0;
  .solution-bg-img{
    position: relative;
    .bg{
      width:100%;
      img{
        width:100%;
      }
    }
    .inner{
      position: absolute;
      width:100%;
      height:100%;
      left:0;
      top:0;
      cursor: pointer;
    }
  }
}
</style>

