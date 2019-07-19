<template>
  <div class="gameDetail" v-loading.fullscreen="loading">
    <pageTitle title="all_games" :showBG="false"></pageTitle>
    <!-- <ul class="game-list">
      <li v-for="(item, k) in gamelist" :key="k" @click="loginGame(item.GameId)">
        <game :imgUrl="item.ImageUrl" :name="item.Method" :iconUrl="formatIconUrl(item.JackpotName)" :addr="item.JackpotName"></game>
      </li>
    </ul> -->
    <ul class="game-list" v-if="gamelist.length>0">
      <li class="game-wrap-item" v-for="(item, k) in gamelist" :key="k">
        <div class="game-item" v-for="(game, g) in item" :key="g" @click="loginGame(game.GameId)">
          <game :imgUrl="game.ImageUrl" :name="game.Method" :iconUrl="formatIconUrl(game.JackpotName)" :addr="game.JackpotName"></game>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import pageTitle from '@/components/public/pageTitle';
import game from '@/components/public/game';
export default {
  name: 'gameDetail',
  components: {
    pageTitle,
    game
  },
  data() {
    return {
      msg: 'nihao',
      loading: '',
      duration: 1500,
      gamelist: [],
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
    this.getGameList();
  },
  beforeMount() {},
  mounted() {},
  watch: {},
  methods: {
    
    // 游戏列表
    getGameList() {
      this.$http.get('/gss/game/list', {}).then(res => {
        // this.gamelist = res.data.data;
        this.formatData(res.data.data)
      }).then(err => {})
    },
    // 处理数据
    formatData(data) {
      this.gamelist = [];
      let len = Math.ceil(data.length/6);
      if(data.length>0){
        for(let i=0; i<len; i++){
          let arr = data.splice(0, 6)
          this.gamelist.push(arr)
        }
      }
    },
    // 格式 icon url
    formatIconUrl(name) {
      return 'https://images.1sgames88.com/diamonds/small/'+name.replace(/\s+/g,"")+'.png';
    },
    // 登录游戏
    loginGame(gameid) {
      if(!this.getLoginStatus){
        this.$store.dispatch('setAlertBG', true);
        this.$store.dispatch('setShowLoginDialog', true);
        return false
      }
      this.loading = true;
      let loginname = localStorage.getItem('dove-web-loginname');
      this.$http.post('/gss/login', {
        loginname: loginname,
        gameid: gameid,
      }, {
        emulateJSON: true
      }).then(res => {
        this.loading = false;
        let code = res.data.returncode;
        if(code == 200){
          // location.href = res.data.url;
          window.open(res.data.data.url)
        }else if (code == 103 || code == 106 || code == 101) {
          this.$store.state.logout(this);
        }else{
          this.$store.state.message('error', 'error', this.duration, this);
        }
      }).then(err => {})
    },
  }
}
</script>
<style lang="scss" scoped>
.gameDetail{
  width:100%;
  min-height: 1980px;
  background: url(../assets/img/game/game-bg.png);
  background-size:100%;
  // .game-list{
  //   width:1100px;
  //   display:table;
  //   margin:30px auto;
  //   li{
  //     float: left;
  //     margin-right:28px;
  //     margin-bottom:28px;
  //     cursor: pointer;
  //     &:nth-child(6n){
  //       margin-right:0;
  //     }
  //   }
  // }
  .game-list {
    width:1100px;;
    margin:30px auto;
    display: table;

    li {
      // float: left;
      // margin-right: 28px;
      margin-bottom: 28px;
      // cursor: pointer;
      width:auto;
      display:table;
      &:hover{
        .game-item{
          transform: translateX(-20px);
          &:hover{
            transform: scale(1.2);
          }
          &:hover~.game-item{
            transform: translateX(20px);
          }
        }
      }
      .game-item{
        float: left;
        padding-right:28px;
        transition: transform .2s ease;
        cursor: pointer;
        &:nth-child(6n) {
          padding-right: 0;
        }
      }
      &:last-child{
        .game-item{
          &:last-child{
            padding-right:0;
          }
        }
      }
    }
  }
}
</style>


