<template>
  <div class="personalSettings">
    <pageTitle :title="'personal_setting'" :showBG="false"></pageTitle>
    <userTabs :tabs="tabs" style="margin-top:30px;"></userTabs>
    <router-view />
  </div>
</template>
<script>
  import pageTitle from '@/components/public/pageTitle';
  import userTabs from '@/components/public/userTabs';

  export default {
    name: 'personalSettings',
    components: {
      pageTitle,
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
    created() {},
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
