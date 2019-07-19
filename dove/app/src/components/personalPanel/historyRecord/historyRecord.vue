<template>
  <div class="historyRecord  user-common">
    <userTabs :tabs="tabs"></userTabs>
    <router-view />
  </div>
</template>
<script>
  import userTabs from '@/components/public/userTabs';

  export default {
    name: 'historyRecord',
    components: {
      userTabs
    },
    data() {
      return {
        tabs: [{
          name: 'recharge_record',
          val: 'rechargeRecord'
        }, {
          name: 'withdrawals_record',
          val: 'withdrawalsRecord'
        }, {
          name: 'transfer_record',
          val: 'transferRecord'
        }, {
          name: 'game_record',
          val: 'gameRecord'
        }]
      };
    },
    methods: {},
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {
      this.$store.dispatch('setHeaderName', this.$t("message.history_record"));
    },
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
