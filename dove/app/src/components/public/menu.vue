<template>
  <div class="app-header-menu">
    <ul class="menu-list">
      <li v-for="(item, i) in menuList" :key="i" @click="toPage(item)">
        <!-- <em class="icon" :class="'menu-'+item.name"></em> -->
        <span>{{$t('message.' + item.title)}}</span>
        <i class="right-jiantou"></i>
      </li>
    </ul>
    <h2 v-if="getLoginStatus" class="menu-personal-text insert-to-bottom-line">{{$t('message.personal_center')}}</h2>
    <ul v-if="getLoginStatus" class="personal-list">
      <li v-for="(item, i) in personalList" :key="i" @click="toPage(item, 'personal')">
        <span class="icon" :class="'per-'+item.name"><img :src="item.img" alt=""></span>
        <p>{{$t('message.' + item.title)}}</p>
      </li>
      <!-- <li class="language" @click="changeLanguage">
        <span class="icon" v-if="$i18n.locale == 'th'">
          <img src="@/assets/img/menu/en-icon.png" alt>
        </span>
        <span class="icon" v-if="$i18n.locale == 'en'">
          <img src="@/assets/img/menu/th-icon.png" alt>
        </span>
        <p class="lang">{{$t("message.language")}}</p>
      </li> -->
    </ul>
    <div class="user-common">
      <div class="row mt-40" v-if="$i18n.locale == 'th'" @click="changeLanguage">
        <em class="icon en-icon">
          <img src="@/assets/img/menu/en-icon.png" alt>
        </em>
        <span class="lang">{{$i18n.locale == 'en' ? 'Thai' : 'English'}}</span>
      </div>
      <div class="row mt-40" v-if="$i18n.locale == 'en'" @click="changeLanguage">
        <em class="icon th-icon">
          <img src="@/assets/img/menu/th-icon.png" alt>
        </em>
        <span class="lang">{{$i18n.locale == 'en' ? 'Thai' : 'English'}}</span>
      </div>
    </div>
    <div v-if="getLoginStatus" class="user-common">
      <h2 class="menu-personal-text insert-to-bottom-line" style="margin-top:6vw;">{{$t('message.personal_information')}}</h2>
      <div class="row mt-20">
        <img src="@/assets/img/menu/Avatar@3x.png" alt="" style="width:18.67vw;height:18.67vw;">
      </div>
      <div class="row">
        <!-- <p class="username"><img src="@/assets/img/menu/h-user.png" alt="">{{getLoginname}}</p> -->
        <p class="username">{{getLoginname}}</p>
      </div>
      <div class="row">
        <!-- <p class="balance"><img src="@/assets/img/menu/h-cash.png" alt="">{{getCash | filterCash}} THB</p> -->
        <p class="balance">{{$t('message.balance')}}：{{getCash | filterCash}} THB <span class="refresh-icon" @click="getProfile"></span></p>
      </div>
      <div class="row">
        <button class="user-btn log-out mt-30 mb-60" @click="logout">{{$t('message.log_out')}}</button>
      </div>
    </div>
    <div v-if="!getLoginStatus" class="user-common">
      <div class="row">
        <button class="user-btn log-out mt-30 mb-60" @click="logout">{{$t('message.log_in')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'app-header-menu',
  data() {
    return {
      msg: 'nihao',
      balance: 1000,
      channelArr: [
        {url: '1', name: 'king'},
        {url: '2', name: 'paysec'},
        {url: '3', name: 'paytrust'},
      ],
      menuList: [
        {
          title: 'home',
          url: 'home',
          name: 'home',
        },
        // {
        //   title: 'all_games',
        //   url: 'gameDetail',
        //   name: 'game',
        // },
        {
          title: 'slots',
          url: 'slots',
          name: 'slots',
        },
        {
          title: 'live_casino',
          url: 'liveCasino',
          name: 'live_casino',
        },
        {
          title: 'download',
          url: 'download',
          name: 'download',
        },
        {
          title: 'help',
          url: 'help',
          name: 'help',
        }
      ],
      personalList: [
        {
          title: 'cash_account',
          url: 'cashAccount',
          name: 'cash_account',
          img: require("@/assets/img/menu/personal.png")
        },
        {
          title: 'coupon.name',
          url: 'unused',
          name: 'coupon',
          img: require("@/assets/img/menu/coupon.png")
        },
        {
          title: 'deposit',
          url: 'deposit_channel',
          name: 'deposit',
          img: require("@/assets/img/menu/deposit.png")
        },
        {
          title: 'withdrawal',
          url: 'withdrawal_channel',
          name: 'withdrawal',
          img: require("@/assets/img/menu/withdrawal.png")
        },
        {
          title: 'history_record',
          url: 'rechargeRecord',
          name: 'history_record',
          img: require("@/assets/img/menu/history.png")
        },
        {
          title: 'recommendation',
          url: 'sponsoredLinks',
          name: 'recommendation',
          img: require("@/assets/img/menu/recommend.png")
        },
        {
          title: 'personal_setting',
          url: 'personalInformation',
          name: 'personal_setting',
          img: require("@/assets/img/menu/personal_setting.png")
        }
      ],
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {
    this.getChannel();
  },
  beforeMount() {},
  mounted() {},
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
  watch: {},
  methods: {
    // 获取充值/提现的通道
    getChannel() {
      const url = '/bank/channel/list';
      const vm = this;
      vm.$http.get(url, {}).then(res => {
        let code = res.body.returncode;
        if(code == 200){
          this.setPersonalUrl(res.body.data);
        }else if (code == 103 || code == 106 || code == 101) {
          this.$store.state.logout(this);
        }else{
          this.setPersonalUrl();
        }
      }, error => {
        console.log('error', error);
      });
    },
    // 判断开启的通道，设置url
    setPersonalUrl(data=[]) {
      let deposit = this.personalList[2].url;
      let withdrawal = this.personalList[3].url;
      let url;
      if(data.length && data.length !== 3){
        url = this.channelArr.filter(channel => {return channel.name === data[0]})[0].url;
        this.$store.dispatch('setChannelTabs', data);
        localStorage.setItem('app-channel-tabs', data);
      }else{
        url = '1';
        this.$store.dispatch('setChannelTabs', ['king', 'paysec', 'paytrust']);
        localStorage.setItem('app-channel-tabs', ['king', 'paysec', 'paytrust']);
      }
      this.personalList[2].url = deposit + '_' + url;
      this.personalList[3].url = withdrawal + '_' + url;
    },
    toPage(item, per) {
      const vm = this;
      var page = function(url){
        vm.$router.push({
          name: url
        })
      }
      if (item.url) {
        // if (!this.$store.state.isLogin) {
        //   this.toLogin();
        //   return;
        // }
        // 如果有登录弹出框，关闭
        // this.$store.dispatch('setAlertBG', false);
        // this.$store.dispatch('setShowLoginDialog', false);
        this.$store.dispatch('setHeaderName', this.$t("message."+item.title));
        this.$store.dispatch('setMenuStatus', false);
        localStorage.setItem('app-slots-game-type', '')
        if(per) {
          this.getProfile();
          page(item.url);
        }else{
          page(item.url)
        }
      }
    },
    toLogin() {
      this.$store.dispatch('setAlertBG', true);
      this.$store.dispatch('setShowLoginDialog', true);
    },
    // 个人资料
    getProfile() {
      const url = '/user/profile';
      const vm = this;
      // vm.loading = true;
      vm.$http.get(url, {}).then(response => {
        // vm.loading = false;
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
        // vm.loading = false;
      });
    },
    logout() {
      let self = this;
      this.$store.state.logout(self, true)
    },
    // 切换语言
    changeLanguage() {
      let language = this.$i18n.locale;
      // return false;
      // console.log(this.$t("message"))
      if (language === "en") {
        this.$i18n.locale = "th";
        localStorage.setItem("dove-app-locale", "th");
      } else {
        this.$i18n.locale = "en";
        localStorage.setItem("dove-app-locale", "en");
      }
      // window.location.reload(true);
    },
  }
}
</script>
<style lang="scss" scoped>
.app-header-menu{
  width:100%;
  -webkit-overflow-scrolling: touch;
  // padding-top:11.73vw;
  -webkit-box-flex: 1;
  background: #0E0E0E;
  overflow-y: auto;
  .menu-list{
    display:block;
    padding:0 6.67vw;
    li {
      width:100%;
      height:15.6vw;
      border-bottom:.13vw solid #3C3C3C;
      display: -webkit-box;
      -webkit-box-align: center;
      cursor: pointer;
      position: relative;
      font-size:4.8vw;
      color: #F2B672;
      // font-weight:bold;

      em.icon {
        display: block;
      }
      i.right-jiantou{
        width:2.67vw;
        height:4.8vw;
        position: absolute;
        top:5.47vw;
        right:0;
        background: url(../../assets/img/menu/menu-right-jiantou.png) no-repeat;
        background-size: 100% 100%;
      }
      span {
        display: block;
      }
    }
  }
  .menu-personal-text{
    
    margin-top:8vw;
    margin-bottom:2vw;
    font-weight:normal;
  }
  .personal-list{
    width:100%;
    padding:0 4vw;
    display:table;
    li.language{
      .icon{
        width:7.47vw;
        height:7.47vw;
      }
    }
    li{
      float:left;
      width:26.67vw;
      height:26.67vw;
      margin:2vw;
      background: #151515;
      border-radius:.53vw;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-box-align:center;
      span{
        display:block;
        margin-top:6.4vw;
      }
      .per-cash_account{
        width:6.93vw;
        height:8.13vw;
      }
      .per-coupon{
        width:7.73vw;
        height:7.73vw;
      }
      .per-deposit{
        width:6.93vw;
        height:8.13vw;
      }
      .per-withdrawal{
        width:6.93vw;
        height:7.33vw;
      }
      .per-history_record{
        width:6.67vw;
        height:7.33vw;
      }
      .per-recommendation{
        width:8vw;
        height:7.2vw;
      }
      .per-personal_setting{
        width:7.47vw;
        height:6.93vw;
      }
      p{
        display:block;
        word-wrap:break-word;
        font-size:4vw;
        color:#ababab;
        text-align:center;
        padding:0 3.4vw;
        width:100%;
      }
    }
  }
  .balance{
    color: #ababab;
    font-size:4.27vw;
    text-align:center;
    position: relative;
    margin-top:1.33vw;
    img{
      display:inline-block;
      width:.34rem;
      height:.36rem;
      margin-right:.2rem;
    }
  }
  .refresh-icon {
    position: absolute;
    top: 3px;
    right: -24px;
    width: 17px;
    height: 17px;
    cursor: pointer;
    background-image: url('../../assets/img/sponsoredLink/icon_Refresh@3x.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
  .username{
    font-size:4.27vw;
    text-align:center;
    // color:#E84545;
    color:#ababab;
    margin-top:1.33vw;
    img{
      display:inline-block;
      width:4.27vw;
      height:.34rem;
      margin-right:.2rem;
    }
  }
  .row{
    display:-webkit-box;
    -webkit-box-pack:center;
    -webkit-box-align:center;
    .icon{
      display:block;
      width:6vw;
      height:6vw;
    }
    .lang{
      display:block;
      font-size:5vw;
      color:#fff;
    }
  }
  .log-out{
    height:10.67vw;
  }
}
</style>


