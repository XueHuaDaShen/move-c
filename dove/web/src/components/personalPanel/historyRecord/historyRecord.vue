<template>
  <div class="historyRecord">
    <pageTitle :title="'history_record'" :showBG="false"></pageTitle>
    <userTabs :tabs="tabs" style="margin-top:30px;"></userTabs>
    <router-view />
  </div>
</template>
<script>
  import pageTitle from '@/components/public/pageTitle';
  import userTabs from '@/components/public/userTabs';

  export default {
    name: 'historyRecord',
    components: {
      pageTitle,
      userTabs
    },
    data() {
      return {
        tabs: [
          {
            name: 'recharge_record',
            val: 'rechargeRecord'
          },
          {
            name: 'withdrawals_record',
            val: 'withdrawalsRecord'
          },
          {
            name: 'transfer_record',
            val: 'transferRecord'
          },
          {
            name: 'game_record',
            val: 'gameRecord'
          }
        ]
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
  .historyRecord {
    // z-index: 0;
    position: relative;
    background: #111111;
  }

</style>
