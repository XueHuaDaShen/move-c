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
    created() {},
    beforeMount() {},
    mounted() {
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
        this.getUserAccount();
        this.getProfile();
      }
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
            this.getUserAccount();
          }
        }
      }
    },
    methods: {
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
              localStorage.setItem('dove-app-cash', data.cash||0);
              localStorage.setItem('dove-app-loginname', data.loginname||'');
              localStorage.setItem('dove-app-link', data.link||'');
              vm.$store.dispatch('setCash', data.cash||0);
              vm.$store.dispatch('setDoveName', data.loginname||'');
              vm.$store.dispatch('setStake', data.stake||0);
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
    background: #0A0A0A;

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
