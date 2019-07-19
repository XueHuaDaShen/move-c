<template>
  <div class="game" :style="gameSize" @click="loginGame(gameData, type)" @mouseenter="handleMouseenter">
    <!-- <div class="game-bg"></div> -->
    <img src="@/assets/img/home/live-icon.png" class="live-icon" v-if="type === 'live'" alt="">
    <div class="game-wrap">
      <img class="img" :src="imgUrl" alt="">
      <p class="name">{{name}}</p>
      <!-- <p class="addr"><img class="icon" :src="iconUrl" alt=""><span>{{addr}}</span></p> -->
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
    loading: {
      type: Boolean,
    },
    iconUrl: {
      type: String
    },
    addr: {
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
      gameSize: {},
      isLogin: false,
    }
  },
  computed: {
    getLoginStatus() {
      return this.$store.state.isLogin;
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
  watch: {},
  methods: {
    handleMouseenter() {
      this.isLogin = localStorage.getItem('dove-web-login') === 'true';
    },
    // 登录游戏
    loginGame(game, type) {
      if (!this.getLoginStatus) {
        this.$store.dispatch('setAlertBG', true);
        this.$store.dispatch('setShowLoginDialog', true);
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
            mobile: 0,
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
          mobile: 0, // 0 web, 1 mobile;
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
        // gss
        param = {
          gameid: game.gameid,
          client_type: 0, // 0 web, 1 ios, 2 android;
          lang: lang_gss
        }
        callback = this.gssGame;
      }
      if(provider === 'pp'){
        // gss
        param = {
          gameId: game.gameid,
          technology: 'H5', // 0 web, 1 ios, 2 android;
          platform: 'WEB', // web
          language: lang_pp
        }
        callback = this.ppGame;
      }
      this.$emit('loadingGame', true);
      this.$http.post('/'+provider+'/login', param, {
        emulateJSON: true
      }).then(res => {
        this.$emit('loadingGame', false);
        let code = res.data.returncode;
        if (code == 200) {
          // location.href = res.data.url;
          let data = res.data.data;
          let url = data.url || '', token = data.token || '';
          callback && callback(url, token, game);
        }else if (code == 103 || code == 106 || code == 101) {
          this.$store.state.logout(this);
        } else {
          this.$store.state.message('error', 'error', this.duration, this);
        }
      }).then(err => {
        this.$emit('loadingGame', false);
      })
    },
    // sa 游戏
    // 老虎机
    saSlotsGame(url, token, game) {
      window.open(url)
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
      let loginname = localStorage.getItem('dove-web-loginname');
      let root;
      let pro_or_test = this.$store.state.pro_or_test;
      if(!pro_or_test){
        root = 'https://www.sai.slgaming.net/app.aspx' // 测试
      }else{
        root = 'https://kgs.sa-api4.com/app.aspx' // 上线
      }
      let route = `${root}?username=${loginname}&token=${token}&lobby=A1050&mobile=false&lang=${lang}&options=defaulttable=${gameid}`;
      window.open(route)
    },
    // nt 游戏
    ntGame(url, token, game) {
      window.open(url)
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
        root = 'http://rslots.gpiuat.com/' // 测试
      }else{
        root = 'http://rslots.gpiops.com/' // 上线
      }
      let route = `${root}${gamecode}?token=${token}&fun=0&op=KINGSLOT&lang=${lang}`;
      window.open(route)
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
        root = 'http://casino.w88uat.com/html5/casino' // 测试
      }else{
        root = 'https://casino.globalintgames.com' // 上线
      }
      let route = `${root}?token=${token}&op=KINGSLOT&lang=${lang}&sys=CUSTOM&tb=${gameid}`;
      window.open(route)
    },
    // gss 游戏
    gssGame(url, token, game) {
      window.open(url)
    },
    // pp 游戏
    ppGame(url, token, game) {
      window.open(url)
    },
  }
}
</script>
<style lang="scss" scoped>
.game{
  border-radius: 8px;
	// background-clip: padding-box,border-box;
  // background-origin: padding-box,border-box;
  // background-image: linear-gradient(135deg, #fadcab 0%, 	#f2b672 100%);
  position: relative;
  background-color: #1f1e1f;
  .live-icon{
    position: absolute;
    width:45px;
    height:20px;
    left:21px;
    top:21px;
    z-index:99;
  }
  // width:160px;
  // height:266px;
  &:hover{
    // margin-top:-10px;
    // transition: margin-top .3s;
    // transform: scale(1.03);
    // transition: transform .3s ease;
    // box-shadow: 0 2px 20px 0 rgba(242, 182, 114, 0.2); 
    .game-login-div{
      display:block;
    }
  }
  .game-bg{
    width:100%;
    height:100%;
    background-color: #111111;
    border-radius: 8px;
  }
  .game-login-div{
    width:98%;
    height:98%;
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
  padding:15px 15px 10px 15px;
  position: absolute;
  left:0;
  top:0;
  .img{
    width:100%;
    height:auto;
    border-radius:4px;
  }
  p{
    width:100%;
    text-align:center;
    font-size:14px;
  }
  .name{
    color: #f2b672;
    margin-top:10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .addr{
    color: #9c9ea2;
    display:-webkit-box;
    -webkit-box-pack:center;
    margin-top:4px;
    .icon{
      width:25px;
      height:auto;
      margin-right:5px;
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


