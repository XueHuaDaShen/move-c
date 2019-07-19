<template>
  <div>
    <div class="header-content">
      <div class="logo-icon" @click="toPage({url: 'index'})"></div>
      <ul class="header-nav" v-if="getLoginStatus">
        <li :class="setUrlPersonal(item.url) ? 'active' : ''" v-for="(item, i) in login_nav" :key="i" @click="toPage(item)"><span>{{$t('message.' + item.title)}}</span></li>
        <!-- <li :class="setUrlPersonal(item.url) ? 'active' : ''" v-for="(item, i) in login_nav" :key="i" @click="toPage(item)"><em class="icon" :class="'h-nav-'+item.name"></em><span>{{$t('message.' + item.title)}}</span></li> -->
      </ul>
      <ul class="header-nav" v-if="!getLoginStatus">
        <li :class="setUrlPersonal(item.url) ? 'active' : ''" v-for="(item, i) in not_login_nav" :key="i" @click="toPage(item)"><span>{{$t('message.' + item.title)}}</span></li>
        <!-- <li :class="setUrlPersonal(item.url) ? 'active' : ''" v-for="(item, i) in not_login_nav" :key="i" @click="toPage(item)"><em class="icon" :class="'h-nav-'+item.name"></em><span>{{$t('message.' + item.title)}}</span></li> -->
      </ul>
      <div class="user-log-reg-btn" v-if="!getLoginStatus">
        <button class="reg-btn" @click="toReg">{{$t('message.registered')}}</button>
        <button class="login-btn" v-if="showLoginBtn" @click="toLogin">{{$t('message.log_in')}}</button>
      </div>
      <ul class="header-nav" v-if="!getLoginStatus" style="float:right;margin-left:0;margin-right:30px;">
        <li class="language-li" v-if="$i18n.locale == 'th'" @click="changeLanguage">
          <em class="icon en-icon">
            <img src="@/assets/img/home/en-icon.png" alt>
          </em>
          {{$i18n.locale == 'en' ? 'Thai' : 'English'}}
        </li>
        <li class="language-li" v-if="$i18n.locale == 'en'" @click="changeLanguage">
          <em class="icon th-icon">
            <img src="@/assets/img/home/th-icon.png" alt>
          </em>
          {{$i18n.locale == 'en' ? 'Thai' : 'English'}}
        </li>
      </ul>
      <div class="user-info-wrap" v-if="getLoginStatus">
        <p class="cash-p" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
          <span class="cash-icon"><img src="@/assets/img/home/h-cash.png" alt=""></span>
          <span>{{getCash | filterCash}} THB</span>
          <span class="refresh-icon" @click="refreshCash"><img src="@/assets/img/home/h-refresh.png" alt=""></span>
        </p>
        <p class="user-p">
          <span><img src="@/assets/img/home/h-user.png" alt=""></span><span>{{getLoginname}}</span>
          <ul class="item-list">
            <em class="sanjiao"></em>
            <li @click="logout">{{$t('message.log_out')}}</li>
            <li class="language-li" v-if="$i18n.locale == 'th'" @click="changeLanguage">
              <em class="icon en-icon">
                <img src="@/assets/img/home/en-icon.png" alt>
              </em>
              {{$i18n.locale == 'en' ? 'Thai' : 'English'}}
            </li>
            <li class="language-li" v-if="$i18n.locale == 'en'" @click="changeLanguage">
              <em class="icon th-icon">
                <img src="@/assets/img/home/th-icon.png" alt>
              </em>
              {{$i18n.locale == 'en' ? 'Thai' : 'English'}}
            </li>
          </ul>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "myHeader",
  components: {},
  props: {},
  data() {
    return {
      msg: '123',
      loading: false,
      showLoginBtn: true,
      channelArr: [
        {url: 'deposit_channel_1', name: 'king'},
        {url: 'deposit_channel_2', name: 'paysec'},
        {url: 'deposit_channel_3', name: 'paytrust'},
      ],
      login_nav: [
        {
          title: 'home',
          url: 'index',
          name: 'home',
          needLogin: false,
        },
        {
          title: 'slots',
          url: 'slots',
          name: 'slots',
          needLogin: false,
        },
        {
          title: 'live_casino',
          url: 'liveCasino',
          name: 'live',
          needLogin: false,
        },
        // {
        //   title: 'all_games',
        //   url: 'gameDetail',
        //   name: 'game',
        //   needLogin: false,
        // },
        {
          title: 'download',
          url: 'download',
          name: 'download',
          needLogin: false,
        },
        {
          title: 'help',
          url: 'help',
          name: 'help',
          needLogin: false,
        },
        {
          title: 'personal_center',
          url: 'cashAccount',
          name: 'personal',
          needLogin: true,
        }
      ],
      not_login_nav: [
        {
          title: 'home',
          url: 'index',
          name: 'home',
          needLogin: false,
        },
        {
          title: 'slots',
          url: 'slots',
          name: 'slots',
          needLogin: false,
        },
        {
          title: 'live_casino',
          url: 'liveCasino',
          name: 'live',
          needLogin: false,
        },
        // {
        //   title: 'all_games',
        //   url: 'gameDetail',
        //   name: 'game',
        //   needLogin: false,
        // },
        {
          title: 'download',
          url: 'download',
          name: 'download',
          needLogin: false,
        },
        {
          title: 'help',
          url: 'help',
          name: 'help',
          needLogin: false,
        }
      ]
    }
  },
  destroyed() {},
  created() {},
  mounted() {
    this.getChannel();
  },
  methods: {
    // 获取充值/提现的通道
    getChannel() {
      const url = '/bank/channel/list';
      const vm = this;
      vm.$http.get(url, {}).then(res => {
        let code = res.body.returncode;
        if(code == 200){
          this.setPersonalUrl(res.body.data);
        }else{
          this.setPersonalUrl();
        }
      }, error => {
        console.log('error', error);
      });
    },
    // 判断开启的通道，设置url
    setPersonalUrl(data=[]) {
      if(data.length && data.length !== 3){
        // let url = this.channelArr.filter(channel => {return channel.name === data[0]})[0].url;
        // this.login_nav.filter(nav => {
        //   if(nav.title === 'personal_center'){
        //     nav.url = url
        //   }
        // })
        this.$store.dispatch('setChannelTabs', data);
        localStorage.setItem('web-channel-tabs', data);
      }else{
        this.$store.dispatch('setChannelTabs', ['king', 'paysec', 'paytrust']);
        localStorage.setItem('web-channel-tabs', ['king', 'paysec', 'paytrust']);
      }
    },
    // 当前路径是否 属于personal
    setUrlPersonal(url) {
      let urlArr = [
        'cashAccount',
        'unused',
        'used',
        'expired',
        'deposit_channel_1',
        'deposit_channel_2',
        'deposit_channel_3',
        'withdrawal_channel_1',
        'withdrawal_channel_2',
        'withdrawal_channel_3',
        'sponsoredLinks',
        'myRefund',
        'refundHistory',
        'rechargeRecord',
        'withdrawalsRecord',
        'gameRecord',
        'personalInformation',
        'changePassword'
      ];
      let ok = false;
      if(url === this.$route.name){
        ok = true
      }else if(url === 'cashAccount'){
        if(urlArr.indexOf(this.$route.name) > -1){
          ok = true;
        }
      }
      return ok;
    },
    // 切换语言
    changeLanguage() {
      let language = this.$i18n.locale;
      // return false;
      // console.log(this.$t("message"))
      if (language === "en") {
        this.$i18n.locale = "th";
        localStorage.setItem("dove-web-locale", "th");
      } else {
        this.$i18n.locale = "en";
        localStorage.setItem("dove-web-locale", "en");
      }
      this.showNav = false;
      // window.location.reload(true);
    },
    toPage(item) {
      // console.log(item)
      if (item.url) {
        if (!this.$store.state.isLogin && item.needLogin) {
          this.toLogin();
          return;
        }
        localStorage.setItem('web-slots-game-type', '')
        // 如果有登录弹出框，关闭
        this.$store.dispatch('setAlertBG', false);
        this.$store.dispatch('setShowLoginDialog', false);
        this.$router.push({
          name: item.url
        })
      }
    },
    toLogin() {
      this.$store.dispatch('setAlertBG', true);
      this.$store.dispatch('setShowLoginDialog', true);
    },
    toReg() {
      this.$router.push('/reg/')
    },
    logout() {
      this.$store.state.logout(this, true);
    },
    refreshCash() {
      const url = '/user/profile';
      const vm = this;
      vm.loading = true;
      vm.$http.get(url, {}).then(response => {
        vm.loading = false;
        let status = response.body.returncode;
        if (status) {
          if (status == 103 || status == 106 || status == 101) {
            // this.$store.state.logout(this);
          } else if (status == 200) {
            let data = response.body.data;
            localStorage.setItem('dove-web-cash', data.cash);
            localStorage.setItem('dove-web-loginname', data.loginname);
            vm.$store.dispatch('setCash', data.cash);
            vm.$store.dispatch('setDoveName', data.loginname);
            // vm.$store.dispatch('setStake', data.stake);
          } else if (status === 400) {

          } else {

          }
        }
      }, error => {
        console.log('error', error);
        vm.loading = false;
      });
    },
  },
  watch: {
    '$route'(to, from) {
      if(to.name !== 'reg'){
        this.showLoginBtn = true;
      }else{
        this.showLoginBtn = false;
      }
    }
  },
  computed: {
    getLoginStatus() {
      return this.$store.state.isLogin;
    },
    getCash() {
      return this.$store.state.cash;
    },
    getLoginname() {
      return this.$store.state.doveName;
    },
  },
};

</script>
<style lang="scss" scoped>
  .header-content {
    width: 1100px;
    height: 100%;
    margin: 0 auto;
    display: table;
    position: relative;

    .logo-icon {
      width: 70px;
      height: 70px;
      background: url(../../assets/img/home/h-logo.png) no-repeat;
      background-size: 100% 100%;
      // float: left;
      position: absolute;
      left:0;
      top:0;
      cursor: pointer;
    }

    .header-nav {
      float: left;
      height:100%;
      line-height:60px;
      margin-left: 110px;
      // margin-top: 19px;
      font-size: 16px;
      color: #a6753d;
      display: -webkit-box;
      .active{
        color:#f2b672;
      }
      li {
        margin-right: 30px;
        display: -webkit-box;
        -webkit-box-align: center;
        cursor: pointer;
        &:hover{
          color:#f2b672;
        }

        em.icon {
          margin-right: 10px;
          // display: none;
        }

        // .h-nav-home {
        //   width: 16px;
        //   height: 18px;
        //   background: url(../../assets/img/home/h-home.png) no-repeat;
        //   background-size: 100% 100%;
        // }

        // .h-nav-game {
        //   width: 14px;
        //   height: 18px;
        //   background: url(../../assets/img/home/h-allGames.png) no-repeat;
        //   background-size: 100% 100%;
        // }

        // .h-nav-download {
        //   width: 12px;
        //   height: 18px;
        //   background: url(../../assets/img/home/h-download.png) no-repeat;
        //   background-size: 100% 100%;
        // }

        // .h-nav-help {
        //   width: 12px;
        //   height: 17px;
        //   background: url(../../assets/img/home/h-help.png) no-repeat;
        //   background-size: 100% 100%;
        // }

        // .h-nav-contact {
        //   width: 16px;
        //   height: 16px;
        //   background: url(../../assets/img/home/h-contact.png) no-repeat;
        //   background-size: 100% 100%;
        // }

        // .h-nav-personal {
        //   width: 16px;
        //   height: 16px;
        //   background: url(../../assets/img/home/h-personal.png) no-repeat;
        //   background-size: 100% 100%;
        // }

        span {
          display: block;
        }

        &:last-child {
          margin-right: 0;
        }
      }
      li.language-li{
        em.icon{
          width:16px;
          height:16px;
          margin-right:5px;
          display:block;
        }
      }
    }

    .user-log-reg-btn {
      float: right;
      margin-top: 14px;
      display: -webkit-box;

      button {
        width: 110px;
        height: 32px;
        // background: #F2B672;
        background-image: linear-gradient(134deg, #fadcab 0%,	#d99d59 100%, #f2b672 100%);
        border-radius: 25px;
        font-size: 14px;
        color: #111111;
        display: block;
        cursor: pointer;
      }

      .login-btn {
        margin-left: 20px;
      }
    }
    .user-info-wrap{
      float: right;
      margin-top: 15px;
      display: -webkit-box;
      p{
        min-width:140px;
        display:-webkit-box;
        -webkit-box-align:center;
        // -webkit-box-pack:center;
        background: #212121;
        border-radius: 15px;
        margin:0;
        padding:0 15px;
        height:30px;
        font-size:16px;
        font-weight:bold;
        color: #ababab;
        span{
          display:block;
        }
      }
      .cash-p{
        // color: #E84545;
        .cash-icon{
          width:17px;
          height:18px;
          margin-right:8px;
        }
        .refresh-icon{
          width:12px;
          height:12px;
          margin-left:8px;
          cursor: pointer;
        }
      }
      .user-p{
        margin-left:20px;
        // color: #9C9EA2;
        position: relative;
        &:hover{
          .item-list{
            display:block;
          }
        }
        img{
          width:16px;
          height:17px;
          margin-right:8px;
        }
        .item-list{
          position: absolute;
          display: none;
          z-index: 2;
          background: #ffffff;
          color: #000;
          font-size: 16px;
          width: 100%;
          left: 0;
          // left: 50%;
          // margin-left: -60px;
          top: 30px;

          .sanjiao {
            position: absolute;
            width: 5px;
            height: 5px;
            border-top: 5px solid #fff;
            border-right: 5px solid #fff;
            transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            /* IE 9 */
            -moz-transform: rotate(45deg);
            /* Firefox */
            -webkit-transform: rotate(45deg);
            /* Safari 和 Chrome */
            -o-transform: rotate(45deg);
            top: -3px;
            left: 50%;
          }

          li {
            padding: 10px;
            overflow: hidden;
            cursor: pointer;
            border-bottom: 1px solid #d0d0d0;
            position: relative;
            color:#F2B672;
            font-size:16px;
            &:hover {
              background: #efefef;
            }

            &:last-child {
              border-bottom: none;
            }

            >.badge {
              position: absolute;
              right: 10px;
              top: 7.5px;
            }
          }
          .language-li{
            display:-webkit-box;
            -webkit-box-align: center;
            -webkit-box-pack: center;

            em.icon {
              margin-right: 10px;
              display: block;
              width:16px;
              height:16px;
            }
          }
        }
      }
    }
  }

</style>
