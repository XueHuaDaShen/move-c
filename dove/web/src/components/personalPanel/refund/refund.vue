<template>
  <div class="refundView">
    <pageTitle :title="'recommendation'" :showBG="false"></pageTitle>
    <userTabs :tabs="tabs" style="margin-top:30px;"></userTabs>
    <router-view />
  </div>
</template>
<script>
  import pageTitle from '@/components/public/pageTitle';
  import userTabs from '@/components/public/userTabs';

  export default {
    name: 'refundView',
    components: {
      pageTitle,
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
