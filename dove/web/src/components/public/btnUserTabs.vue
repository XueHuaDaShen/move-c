<template>
  <div class="btn-user-tabs">
    <div class="btn-user-tabs-inner">
      <div class="btn-user-tab-pane" :class="{ active:tab.val === locationName}" @click="handleClick(tab)" v-for="(tab,index) in tabs"
        :key="index">{{$t('message.'+tab.name)}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'home',
    data() {
      return {}
    },
    props: {
      tabs: {
        type: Array
      }
    },
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {},
    beforeMount() {},
    mounted() {},
    watch: {},
    computed: {
      locationName() {
        return this.$route.name;
      }
    },
    methods: {
      handleClick(tab) {
        this.$router.push({
          name: tab.val
        });
      }
    }
  }

</script>
<style lang="scss" scoped>
.btn-user-tabs{
  width:100%;
  .btn-user-tabs-inner{
    width:100%;
    display:-webkit-box;
    -webkit-box-pack:center;
    .btn-user-tab-pane{
      width: 195px;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      background-color: #111;
      border-radius: 20px;
      border: solid 1px #333333;
      color:#ababab;
      margin-right:30px;
      &:last-child{
        margin-right:0;
      }
    }
    .active{
      background-color: #000000;
      border: solid 1px #333333;
      color:#f98c69;
    }
  }
}
</style>
