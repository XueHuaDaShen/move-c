<template>
  <div class="depositView">
    <pageTitle :title="'withdrawal'" :showBG="false"></pageTitle>
    <btnUserTabs :tabs="result"></btnUserTabs>
    <router-view />
  </div>
</template>
<script>
  import pageTitle from '@/components/public/pageTitle';
  import userTabs from '@/components/public/userTabs';
  import btnUserTabs from '@/components/public/btnUserTabs';

  export default {
    name: 'withdrawalView',
    components: {
      pageTitle,
      userTabs,
      btnUserTabs
    },
    data() {
      return {
        showTabs: false,
        tabs: [
          {
            name: 'channel_1',
            val: 'withdrawal_channel_1',
            channel_name: 'king'
          },
          {
            name: 'channel_2',
            val: 'withdrawal_channel_2',
            channel_name: 'paysec'
          },
          {
            name: 'channel_3',
            val: 'withdrawal_channel_3',
            channel_name: 'paytrust'
          }
        ],
        result: []
      };
    },
    methods: {
      // 获取充值/提现的通道
      getChannel() {
        let data = this.$store.state.channelTabs;
        data = data.length > 0 ? data : localStorage.getItem('web-channel-tabs').split(',');
        this.setPersonalUrl(data);
        // const url = '/bank/channel/list';
        // const vm = this;
        // vm.$http.get(url, {}).then(res => {
        //   let code = res.body.returncode;
        //   if(code == 200){
        //     this.setPersonalUrl(res.body.data);
        //   }else{
        //     this.setPersonalUrl();
        //   }
        // }, error => {
        //   console.log('error', error);
        // });
      },
      // 判断开启的通道，设置url
      setPersonalUrl(data=[]) {
        this.result = this.tabs.filter(item => {return data.indexOf(item.channel_name) > -1});
        this.showTabs = true;
      },
    },
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {
      this.getChannel();
    },
    beforeMount() {},
    mounted() {},
    watch: {},
  }

</script>
<style lang="scss" scoped>
  .depositView {
    z-index: 0;
    position: relative;
    background: #111111;
  }

</style>
