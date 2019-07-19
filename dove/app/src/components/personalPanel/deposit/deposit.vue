<template>
  <div class="depositView  user-common">
    <userTabs v-if="result.length>1" :tabs="result" currPage="deposit"></userTabs>
    <router-view />
  </div>
</template>
<script>
  import userTabs from '@/components/public/btnUserTabs';

  export default {
    name: 'depositView',
    components: {
      userTabs
    },
    data() {
      return {
        tabs: [
          {
            name: 'channel_1',
            val: 'deposit_channel_1',
            channel_name: 'king'
          },
          {
            name: 'channel_2',
            val: 'deposit_channel_2',
            channel_name: 'paysec'
          },
          {
            name: 'channel_3',
            val: 'deposit_channel_3',
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
        data = data.length > 0 ? data : localStorage.getItem('app-channel-tabs').split(',');
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
      },
      // 获取用户银行卡账户
      // 结果为空，则未绑定银行卡
      getUserAccount() {
        const vm = this;
        const url = '/trade/user/account';
        vm.loading = true;
        vm.$http.get(url, {}).then(response => {
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.logout(this);
            } else if (status == 200) {
              vm.$store.dispatch('setIsBindBank', true);
            } else if (status === 400) {
              // 400 未绑定银行卡
              vm.$store.dispatch('setIsBindBank', false);
              vm.$alert(vm.$t('message.pl_complete_personal_info'), vm.$t('message.message'), {
                confirmButtonText: vm.$t('message.confirm'),
                callback: action => {}
              })
              vm.$router.push({
                name: 'personalInformation'
              })
            }
          }
        }, error => {
          console.log('error', error);
          vm.loading = false;
        });
      },
    },
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {
      this.$store.dispatch('setHeaderName', this.$t("message.deposit"));
      this.getUserAccount();
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
