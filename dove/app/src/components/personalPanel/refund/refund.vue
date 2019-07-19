<template>
  <div class="refundView  user-common">
    <userTabs :tabs="tabs"></userTabs>
    <router-view />
  </div>
</template>
<script>
  import userTabs from '@/components/public/userTabs';

  export default {
    name: 'refundView',
    components: {
      userTabs
    },
    data() {
      return {
        showTabs: false,
        tabs: [
          {
            name: 'link',
            val: 'sponsoredLinks'
          },
          // {
          //   name: 'myRefund',
          //   val: 'myRefund'
          // },
          // {
          //   name: 'refundHistory',
          //   val: 'refundHistory'
          // }
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
  .refundView {
    z-index: 0;
    position: relative;
    background: #111111;
  }

</style>
