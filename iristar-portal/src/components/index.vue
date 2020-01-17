<template>
  <div class="index min-width-935">
    <myHeader></myHeader>
    <div class="container">
      <router-view class="router-view"/>
      <myFooter></myFooter>
    </div>
  </div>
</template>
<script>
import myHeader from './public/header';
import myFooter from './public/footer';
export default {
  name: 'index',
  components: {
    myHeader,
    myFooter
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {
    $route() {
      document.getElementsByTagName('html')[0].scrollTop = 0;
    }
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
.container{
  background:#f7f7f7;
  padding-top:60px;
  font-size:.16rem;
}
.router-view{
  min-height:996px;
}
</style>
