<template>
  <div class="app-my-header">
    <!-- <span class="activity-back" v-if="showBack" @click="backHome"><img src="@/assets/img/menu/menu-right-jiantou.png" alt=""></span> -->
    <!-- {{getHeaderName}} -->
    <div class="nav-item show-menu-btn">
      <span @click="changeMenuStatus"><img src="@/assets/img/menu/show-menu.png" alt=""></span>
      <p>{{$t("message.menu")}}</p>
    </div>
    <!-- <div class="nav-item close-menu-btn" v-if="showMenu = getMenuStatus">
      <span @click="changeMenuStatus"><img src="@/assets/img/menu/close-menu.png" alt=""></span>
    </div> -->
    <nav class="head-nav">
      <div class="nav-item" v-for="(item, ni) in nav_result" :key="ni">
        <span @click="toPage(item)"><img :src="item.img" alt=""></span>
        <p>{{$t("message."+item.title)}}</p>
      </div>
    </nav>
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
        channelArr: [
          {url: 'deposit_channel_1', name: 'king'},
          {url: 'deposit_channel_2', name: 'paysec'},
          {url: 'deposit_channel_3', name: 'paytrust'},
        ],
        headerName: '', // 缓存headerName
        showMenu: false,
        showBack: false,
        isLogin: false,
        nav: [
          {
            img: require('@/assets/img/head/deposit.png'),
            title: 'deposit',
            url: 'deposit_channel_1',
          },
          {
            img: require('@/assets/img/head/app.png'),
            title: 'app',
            url: 'download',
          },
        ],
        not_login_nav: [
          {
            img: require('@/assets/img/head/deposit.png'),
            title: 'deposit',
            url: 'deposit_channel_1',
          },
          {
            img: require('@/assets/img/head/join.png'),
            title: 'registered',
            url: 'reg',
          },
          {
            img: require('@/assets/img/head/login.png'),
            title: 'log_in',
            url: 'login',
          },
          {
            img: require('@/assets/img/head/app.png'),
            title: 'app',
            url: 'download',
          },
        ],
        nav_result: [],
      }
    },
    destroyed() {},
    created() {
      this.isLogin = localStorage.getItem('dove-app-login') === 'true';
      if(this.isLogin){
        this.nav_result = this.nav;
      }else{
        this.nav_result = this.not_login_nav;
      }
      this.getChannel();
      if(this.$route.name === 'activityDetail'){
        this.showBack = true;
      }
    },
    mounted() {},
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
        if(data.length && data.length !== 3){
          let url = this.channelArr.filter(channel => {return channel.name === data[0]})[0].url;
          this.nav_result[0].url = url;
          this.$store.dispatch('setChannelTabs', data);
          localStorage.setItem('app-channel-tabs', data);
        }else{
          this.$store.dispatch('setChannelTabs', ['king', 'paysec', 'paytrust']);
          localStorage.setItem('app-channel-tabs', ['king', 'paysec', 'paytrust']);
        }
      },
      changeMenuStatus() {
        this.showMenu = this.getMenuStatus;
        if(!this.showMenu){
          this.headerName = this.$store.state.headerName;
          this.$store.dispatch('setHeaderName', this.$t("message.menu"));
        }else{
          this.$store.dispatch('setHeaderName', this.headerName);
        }
        this.showMenu = !this.showMenu;
        this.$store.dispatch('setMenuStatus', this.showMenu);
      },
      backHome() {
        this.$store.dispatch('setHeaderName', this.$t("message.home"));
        history.go(-1);
      },
      toPage(item) {
        if(item.url === 'reg'){
          this.$router.push('/reg/')
        }else{
          this.$router.push({
            name: item.url
          })
        }
      },
    },
    watch: {
      '$route' (to, from){
        if(to.name === 'activityDetail'){
          this.showBack = true;
        }else{
          this.showBack = false;
        }
      }
    },
    computed: {
      getHeaderName() {
        return this.$store.state.headerName;
      },
      getMenuStatus() {
        return this.$store.state.showMenu;
      }
    },
  };

</script>
<style lang="scss" scoped>
.app-my-header{
  position: relative;
  width:100%;
  text-align:center;
  height:21.6vw;
  box-shadow: 0vw 0.27vw 0.53vw 0vw #000000;
  // &::before{
  //   content: "";
  //   position: absolute;
  //   left:0;
  //   bottom:0;
  //   width:100%;
  //   height:0.53vw;
  //   // height:0.53vw;
  //   background-image: linear-gradient(-90deg, #1E1508 0%, #BC9664 51%, #1E1508 100%);
  // }
  .activity-back{
    width:2.67vw;
    height:4.8vw;
    left:4vw;
    bottom:2.67vw;
    transform: rotateZ(180deg);
    position: absolute;
  }
  .head-nav{
    display:-webkit-box;
    position: absolute;
    right:0;
    top:2.67vw;
    .nav-item{
      margin-right:4vw;
    }
  }
  .nav-item{
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-box-align:center;
    span{
      width:10.67vw;
      height:10.67vw;
      display:block;
    }
    p{
      display:block;
      font-size:3.47vw;
      color:#ababab;
      margin-top:.67vw;
    }
  }
  .show-menu-btn{
    left:4vw;
    top:2.67vw;
    position: absolute;
  }
  .close-menu-btn{
    span{
      width:5.07vw !important;
      height:5.07vw!important;
    }
    left:4vw;
    top:2.67vw;
    position: absolute;
  }
}
</style>
