<template>
  <div class="personalSettings user-common">
    <userTabs :tabs="tabs" currPage="settings"></userTabs>
    <router-view />
  </div>
</template>
<script>
  import userTabs from '@/components/public/userTabs';

  export default {
    name: 'personalSettings',
    components: {
      userTabs
    },
    data() {
      return {
        tabs: [{
          name: 'personal_information',
          val: 'personalInformation'
        }, {
          name: 'change_password',
          val: 'changePassword'
        }]
      };
    },
    methods: {},
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {
      this.$store.dispatch('setHeaderName', this.$t("message.personal_setting"));
    },
    beforeMount() {},
    mounted() {},
    watch: {},
  }

</script>
<style lang="scss" scoped>
  .personalSettings {
    z-index: 0;
    position: relative;
    background: #111111;
  }

</style>
