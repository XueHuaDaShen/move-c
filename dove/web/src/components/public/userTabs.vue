<template>
  <div class="user-tabs">
    <div class="user-tabs-inner">
      <div class="user-tab-pane" :class="{ active:tab.val === locationName}" @click="handleClick(tab)" v-for="(tab,index) in tabs"
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

</style>
