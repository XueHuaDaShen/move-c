<template>
  <div class="game" :style="gameSize" @mouseenter="handleMouseenter" @click="loginGame(gameData, type)" v-loading.fullscreen="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <!-- <div class="game-bg"></div> -->
    <div class="game-wrap">
      <img class="img" :src="imgUrl" alt="">
      <p class="name">{{name}}</p>
    </div>
    <!-- <div class="game-login-div" v-show="!isLogin">
      <div class="game-login-bg"></div>
      <button>Log in</button>
    </div> -->
  </div>
</template>
<script>
export default {
  name: 'game',
  props: {
    imgUrl: {
      type: String
    },
    name: {
      type: String
    },
    gameData: {
      type: Object
    },
    type: {
      type: String
    },
    width: {
      type: String
    },
    height: {
      type: String
    }
  },
  data() {
    return {
      msg: 'nihao',
      isLogin: false,
      loading: false,
      duration: 1500,
      gameSize: {},
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {
    this.gameSize = {
      width: this.width,
      height: this.height
    }
  },
  beforeMount() {},
  mounted() {},
  computed: {
    getLoginStatus() {
      return this.$store.state.isLogin;
    }
  },
  watch: {},
  methods: {
    handleMouseenter() {
      this.isLogin = localStorage.getItem('dove-app-login') === 'true';
    },
    // 登录游戏
    loginGame(game, type) {
      if (!this.getLoginStatus) {
        this.$router.push({
          name: 'login'
        })
        return false
      }
      let language = this.$i18n.locale;
      let lang_gss, lang_nt, lang_pp;
      if (language === "en") {
        lang_gss = "en-us";
        lang_nt = 'EN';
        lang_pp = 'en';
      } else {
        lang_gss = "th-th";
        lang_nt = 'TH';
        lang_pp = 'th';
      }
      let provider = game.provider ? game.provider.toLowerCase() : 'gss';
      let param = {};
      let callback;
      if(provider === 'sa'){
        // sa
        // type: slots: 老虎机, live: 真人
        if(type === 'slots'){
          // 老虎机
          param = {
            gameid: game.gameid,
            mobile: 1,
          }
          callback = this.saSlotsGame;
        }
        if(type === 'live'){
          // 真人
          callback = this.saLiveGame;
        }
      }
      if(provider === 'nt'){
        // nt
        param = {
          mobile: 1, // 0 web, 1 mobile;
          lang: lang_nt
        }
        callback = this.ntGame;
      }
      if(provider === 'gpi'){
        // gpi
        if(type === 'slots'){
          // 老虎机
          callback = this.gpiSlotsGame;
        }
        if(type === 'live'){
          // 真人
          callback = this.gpiLiveGame;
        }
      }
      if(provider === 'gss'){
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        var client_type = 0 // isAndroid ? 2 : 1;
        // gss
        param = {
          gameid: game.gameid,
          client_type: client_type, // 0 web, 1 ios, 2 android;
          lang: lang_gss
        }
        callback = this.gssGame;
      }
      if(provider === 'pp'){
        // gss
        param = {
          gameId: game.gameid,
          technology: 'H5', // 0 web, 1 ios, 2 android;
          platform: 'MOBILE', // web
          language: lang_pp
        }
        callback = this.ppGame;
      }
      this.loading = true;
      this.$http.post('/'+provider+'/login', param, {
        emulateJSON: true
      }).then(res => {
        this.loading = false;
        let code = res.data.returncode;
        if (code == 200) {
          // location.href = res.data.url;
          let data = res.data.data;
          let url = data.url || '', token = data.token || '';
          callback && callback(url, token, game);
        } else if (code == 103 || code == 106 || code == 101) {
          this.$store.state.logout(this);
        } else {
          this.$store.state.message('error', 'error', this.duration, this);
        }
      }).then(err => {
        if(err){
          this.loading = false;
          this.$store.state.message('error', 'error', this.duration, this);
        }
      })
    },
    // sa 游戏
    // 老虎机
    saSlotsGame(url, token, game) {
      window.location.href = url
      // window.open(url);
    },
    // 真人
    saLiveGame(url, token, game) {
      let language = this.$i18n.locale;
      let lang;
      if (language === "en") {
        lang = "en_US";
      } else {
        lang = "th";
      }
      let gameid = game.gameid;
      let loginname = localStorage.getItem('dove-app-loginname');
      let root;
      let pro_or_test = this.$store.state.pro_or_test;
      if(!pro_or_test){
        root = 'https://www.sai.slgaming.net/app.aspx' // 测试
      }else{
        root = 'https://kgs.sa-api4.com/app.aspx' // 上线
      }
      let route = `${root}?username=${loginname}&token=${token}&lobby=A1050&mobile=true&lang=${lang}&options=defaulttable=${gameid}`;
      window.location.href = route
      // window.open(route);
    },
    // nt 游戏
    ntGame(url, token, game) {
      window.location.href = url
      // window.open(url);
    },
    // gpi 游戏
    // 老虎机
    gpiSlotsGame(url, token, game) {
      let language = this.$i18n.locale;
      let lang;
      if (language === "en") {
        lang = "en-us";
      } else {
        lang = "th-th";
      }
      let gamecode = game.gamecode;
      let root;
      let pro_or_test = this.$store.state.pro_or_test;
      if(!pro_or_test){
        root = 'http://mrslots.gpiuat.com/' // 测试
      }else{
        root = 'http://mrslots.gpiops.com/' // 上线
      }
      let route = `${root}${gamecode}?token=${token}&fun=0&op=KINGSLOT&lang=${lang}`;
      window.location.href = route
      // window.open(route);
    },
    // 真人
    gpiLiveGame(url, token, game) {
      let language = this.$i18n.locale;
      let lang;
      if (language === "en") {
        lang = "en-us";
      } else {
        lang = "th-th";
      }
      let gameid = game.gameid;
      let root;
      let pro_or_test = this.$store.state.pro_or_test;
      if(!pro_or_test){
        root = 'http://casino.w88uat.com/html5/mobile' // 测试
      }else{
        root = 'https://casino.globalintgames.com/html5/mobile' // 上线
      }
      let route = `${root}?token=${token}&op=KINGSLOT&lang=${lang}&sys=CUSTOM&tb=${gameid}`;
      window.location.href = route
      // window.open(route);
    },
    // gss 游戏
    gssGame(url, token, game) {
      window.location.href = url
      // window.open(url);
    },
    // pp 游戏
    ppGame(url, token, game) {
      window.location.href = url
      // window.open(url);
    },
  }
}
</script>
<style lang="scss" scoped>
.game{
  border-radius: 1.07vw;
  position: relative;
  overflow: hidden;
  .game-bg{
    width:100%;
    height:100%;
    background-color: #111111;
    border-radius: 1.07vw;
  }
  .game-login-div{
    width:100%;
    height:100%;
    position: absolute;
    z-index:5;
    left:1%;
    top:1%;
    display:none;
    button{
      background: rgba(242,182,114,0.10);
      border: 1px solid #F2B672;
      border-radius: 4px;
      width:110px;
      height:32px;
      margin:117px auto;
      font-size: 16px;
      color: #F2B672;
      position: relative;
      z-index:5;
      cursor: pointer;
    }
    .game-login-bg{
      width:100%;
      height:100%;
      background-color: #111111;
      border-radius: 8px;
      opacity: 0.5;
      position: absolute;
      left:0;
      top:0;
    }
  }
}
.game-wrap{
  width:100%;
  height:100%;
  position: absolute;
  left:0;
  top:0;
  background-color: #1f1e1f;
  // border-style: solid;
  // border-width: 0.53vw;
  // border-image-source: linear-gradient(135deg, 
  //   #fadcab 0%, 
  //   #f2b672 100%);
  // border-image-slice: 1;
  .img{
    width:100%;
    height:auto;
  }
  p{
    width:100%;
    font-size:4vw;
    padding:0 2.67vw;
  }
  .name{
    color: #f2b672;
    text-align:center;
    margin-top:2.67vw;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .addr{
    color: #9c9ea2;
    display:-webkit-box;
    -webkit-box-pack:center;
    -webkit-box-align:center;
    font-size:3.2vw;
    margin-top:.53vw;
    .icon{
      width:4vw;
      // height:2.4vw;
      height:auto;
      margin-right:1.47vw;
    }
    span{
      display:block;
      -webkit-box-flex:1;
      text-align:left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>


