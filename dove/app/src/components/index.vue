<template>
  <div class="app-index-page">
    <myHeader></myHeader>
    <router-view v-show="!getMenuStatus" style="-webkit-box-flex:1;overflow-y:auto;-webkit-overflow-scrolling: touch"></router-view>
    <myMenu v-show="getMenuStatus"></myMenu>
  </div>
</template>
<script>
import myHeader from '@/components/public/header';
import myMenu from '@/components/public/menu';
export default {
  name: 'index',
  components: {
    myHeader,
    myMenu
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
  methods: {},
  computed: {
    getMenuStatus() {
      return this.$store.state.showMenu;
    }
  }
}
</script>
<style lang="scss" scoped>
.app-index-page{
  width:100%;
  height:100%;
  display:-webkit-box;
  -webkit-box-orient:vertical;
}
</style>


