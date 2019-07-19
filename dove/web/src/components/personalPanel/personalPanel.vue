<template>
  <div class="personalPanel user-common">
    <div class="panel-inner">
      <sideUser></sideUser>
      <router-view class="panel-right"></router-view>
    </div>
  </div>
</template>
<script>
  import sideUser from '@/components/public/sideUser';
  import {
    setTimeout
  } from 'timers';
  export default {
    name: 'personalPanel',
    components: {
      sideUser
    },
    data() {
      return {}
    },
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {
      // 未登录处理
      if (!this.$store.state.isLogin) {
        // 登录弹出框
        this.$store.dispatch('setAlertBG', true);
        this.$store.dispatch('setShowLoginDialog', true);
        // 跳转首页
        this.$router.push({
          name: 'index',
          params: {
            'showLogin': true
          }
        });
      } else {
        // 用户登录后
        // 判定当前账户是否绑定了银行卡。
        // 未绑定，跳转到Personal information页面；绑定了，则不作处理。
        if(this.checkUrl()){
          this.getUserAccount();
        }
        this.getProfile();
      }
    },
    beforeMount() {},
    mounted() {
      
    },
    watch: {
      '$route'(to, from) {
        if (to.name) {
          // 处理路由跳转，login弹框依然存在的问题
          const loginUrlArr = ['deposit', 'withdrawal', 'sponsoredLinks', 'rechargeRecord', 'withdrawalsRecord',
            'gameRecord', 'personalInformation', 'changePassword'
          ]
          if (this.$store.state.isLogin) {
            if (this.$store.state.isBindBank) {
              return;
            }
            if(this.checkUrl()){
              this.getUserAccount();
            }
          }
        }
      }
    },
    methods: {
      // 是否需要判断 是否需要补全信息
      checkUrl() {
        let url = this.$route.name;
        if(url === 'sponsoredLinks' || url.toLowerCase().indexOf('refund') > -1 || url.toLowerCase().indexOf('record') > -1 ){
          return false;
        }else{
          return true;
        }
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
      // 个人资料
      getProfile() {
        const url = '/user/profile';
        const vm = this;
        vm.loading = true;
        vm.$http.get(url, {}).then(response => {
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.logout(this);
            } else if (status == 200) {
              let data = response.body.data;
              localStorage.setItem('dove-web-cash', data.cash);
              localStorage.setItem('dove-web-loginname', data.loginname);
              localStorage.setItem('dove-web-link', data.link);
              vm.$store.dispatch('setCash', data.cash);
              vm.$store.dispatch('setDoveName', data.loginname);
              vm.$store.dispatch('setStake', data.stake);
            } else if (status === 400) {

            } else {

            }
          }
        }, error => {
          console.log('error', error);
          vm.loading = false;
        });
      },
    }
  }

</script>
<style lang="scss" scoped>
  .personalPanel {
    width: 100%;
    min-height: 920px;
    background: #000;

    .panel-inner {
      width: 1100px;
      margin: 0 auto;
      overflow: hidden;
    }

    .panel-right {
      float: left;
      margin-bottom: -99999px;
      padding-bottom: 99999px;
      width: 900px;
      background: #111;
    }
  }

</style>
