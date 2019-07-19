<template>
  <div class="gameDetail">
    <ul class="game-list" v-if="gamelist.length>0">
      <li class="game-wrap-item" v-for="(game, k) in gamelist" :key="k">
        <game :imgUrl="game.ImageUrl" :name="game.Method" :gameid="game.GameId" :iconUrl="formatIconUrl(game.JackpotName)" :addr="game.JackpotName"></game>
      </li>
    </ul>
  </div>
</template>
<script>
import game from '@/components/public/game';
export default {
  name: 'gameDetail',
  components: {
    game
  },
  data() {
    return {
      msg: 'nihao',
      loading: false,
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
    this.$store.dispatch('setHeaderName', this.$t("message.all_games"));
    this.getGameList();
  },
  beforeMount() {},
  mounted() {},
  watch: {},
  methods: {
    
    // 游戏列表
    getGameList() {
      this.$http.get('/gss/game/list', {}).then(res => {
        this.gamelist = res.data.data;
        // this.formatData(res.data.data)
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
    // loginGame(gameid) {
    //   if(!this.getLoginStatus){
    //     this.$store.dispatch('setAlertBG', true);
    //     this.$store.dispatch('setShowLoginDialog', true);
    //     return false
    //   }
    //   this.loading = true;
    //   let loginname = localStorage.getItem('dove-app-loginname');
    //   this.$http.post('/gss/login', {
    //     loginname: loginname,
    //     gameid: gameid,
    //   }, {
    //     emulateJSON: true
    //   }).then(res => {
    //     this.loading = false;
    //     let code = res.data.returncode;
    //     if(code == 200){
    //       // location.href = res.data.data.url;
    //       window.open(res.data.data.url)
    //     }else{
    //       this.$store.state.message('登录失败', 'error', this.duration, this);
    //     }
    //   }).then(err => {})
    // },
  }
}
</script>
<style lang="scss" scoped>
.gameDetail{
  width:100%;
  padding-bottom:8vw;
  // padding-bottom:.65rem;
  .game-list{
    display:table;
    width:100%;
    padding:2vw;
    li{
      margin:2vw;
      float:left;
    }
  }
}
</style>


