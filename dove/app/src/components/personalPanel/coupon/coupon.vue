<template>
  <div class="couponView">
    <userTabs :tabs="tabs" style="margin-top:4vw;"></userTabs>
    <router-view />
  </div>
</template>
<script>
  import userTabs from '@/components/public/userTabs';

  export default {
    name: 'couponView',
    components: {
      userTabs
    },
    data() {
      return {
        showTabs: false,
        tabs: [
          {
            name: 'unused',
            val: 'unused'
          },
          {
            name: 'used',
            val: 'used'
          },
          {
            name: 'expired',
            val: 'expired'
          }
        ],
        result: [],
      };
    },
    methods: {},
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {},
    beforeMount() {},
    mounted() {},
    watch: {},
  }

</script>
<style lang="scss" scoped>
  .couponView {
    position: relative;
    background: #111111;
  }

</style>
