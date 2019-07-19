<template>
  
  <div>
    <div v-if="!showBG" class="pageTitle pageTitle-nobg">{{$t('message.' + title)}}</div>
    <div v-if="showBG" class="pageTitle pageTitle-bg">
    </div>
  </div>
</template>
<script>
  export default {
    name: 'pageTitle',
    props: {
      title: {
        type: String
      },
      showBG: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        msg: 'nihao'
      }
    },
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {},
    beforeMount() {},
    mounted() {},
    watch: {},
    methods: {}
  }

</script>
<style lang="scss" scoped>
  .pageTitle {
    // height: 135px;
    // line-height: 135px;
    // font-size: 40px;
    // color: #ababab;
  }
  .pageTitle-nobg{
    width:100%;
    padding-top:60px;
    padding-bottom:30px;
    // height:210px;
    // line-height: 210px;
    font-size: 22px;
    color: #f98c69;
  }
  .pageTitle-bg{
    width: 100%;
    height:590px;
    // background: url(../../assets/img/home/pageTitle.png);
    background: url(../../assets/img/home/newHome.png);
    // background-size: 100% 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

</style>
