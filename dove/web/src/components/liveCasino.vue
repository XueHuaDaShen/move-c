<template>
  <div class="liveCasino user-common" v-loading.fullscreen="loading">
    <pageTitle></pageTitle>
    <div class="liveCasino-content">
      <div class="game-title mb-30">
        <div class="icon-text"><span class="icon"></span><span class="text">{{$t("message.lower_live_casino")}}</span></div>
        <!-- <div class="operate-wrap">
          <div class="btn" :class="btn.value === currentBtn ? 'active' : ''" v-for="(btn, bi) in gameType" :key="bi" @click="handleChangeType(btn.value)"><span>{{btn.name}}</span></div>
        </div> -->
      </div>
      <div v-loadGame>
        <ul class="game-list" v-if="gamelist.length>0">
          <li class="game-wrap-item" v-for="(item, k) in gamelist" :key="k">
            <div class="game-item" v-for="(game, g) in item" :key="g">
              <game width="348px" height="249px" @loadingGame="handleLogingGame" :gameData="game" type="live" :imgUrl="game.img" :name="game.gamename"></game>
            </div>
          </li>
        </ul>
        <div class="game-no-data" v-if="!gamelist.length>0&&!loadGame">
          {{$t("message.no_data")}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pageTitle from '@/components/public/pageTitle';
import game from '@/components/public/game';
export default {
  name: 'liveCasino',
  components: {
    pageTitle,
    game
  },
  data() {
    return {
      msg: 'nihao',
      loading: '',
      loadGame: false,
      duration: 1500,
      gamelist: [],
      gameType: [
        {name: 'All Games', value: 'All Games'},
        {name: 'Baccarat', value: 'Baccarat'},
        {name: 'Roulette', value: 'Roulette'},
        {name: 'Blackjack', value: 'Blackjack'},
        {name: 'SicBo', value: 'SicBo'},
        {name: 'DragonTiger', value: 'DragonTiger'}
      ],
      currentBtn: 'All Games'
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
      this.loadGame = true;
      this.$http.get('/platform/game/list', {
        params: {
          type: 'Live',
          // pageSize: 999
        }
      }).then(res => {
        let code = res.body.returncode;
        this.loadGame = false;
        if(code == 200){
          this.formatData(res.data.data.data);
        }else if (code == 103 || code == 106 || code == 101) {
          this.$store.state.logout(this);
        }else{
          this.formatData([]);
        }
      }).then(err => {
        if(err){
          this.loadGame = false;
        }
      })
    },
    // 处理数据
    formatData(data) {
      this.gamelist = [];
      let len = Math.ceil(data.length/3);
      if(data.length>0){
        for(let i=0; i<len; i++){
          let arr = data.splice(0, 3)
          this.gamelist.push(arr)
        }
      }
    },
    handleChangeType(value) {
      this.currentBtn = value;
    },
    // 格式 icon url
    formatIconUrl(name) {
      return 'https://images.1sgames88.com/diamonds/small/'+name.replace(/\s+/g,"")+'.png';
    },
    // 获取游戏 是否登录
    handleLogingGame(val) {
      this.loading = val;
    },
  }
}
</script>
<style lang="scss" scoped>
.liveCasino{
  background-color: #111111;
  .liveCasino-content{
    width:1100px;;
    margin:30px auto;
  }
  .game-list {
    width:100%;
    display: table;

    li {
      margin-bottom: 28px;
    }
  }
  .game-title{
    .icon-text .icon{
      background:url(../assets/img/home/live.png);
      background-size:100% 100%;
    }
  }
  .operate-wrap{
    .btn{
      width:126px;
      height:40px;
      float: left;
      color: #ababab;
    }
    div.active{
      color:#f98c69;
    }
  }
}
</style>


