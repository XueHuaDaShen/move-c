<template>
  <div class="liveCasino user-common" v-loading.fullscreen="loading">
    <div class="liveCasino-content">
      <div v-loading="loadGame">
        <ul class="game-list" v-if="gamelist.length>0">
          <li class="game-wrap-item" v-for="(game, k) in gamelist" :key="k">
            <game width="44vw" height="37.6vw" :imgUrl="game.img" :name="game.gamename" :gameData="game" type="live"></game>
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
import game from '@/components/public/game';
export default {
  name: 'liveCasino',
  components: {
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
    this.$store.dispatch('setHeaderName', this.$t("message.live_casino"));
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
        this.formatData(res.data.data.data)
        this.loadGame = false;
      }).then(err => {
        if(err){
          this.loadGame = false;
        }
      })
    },
    // 处理数据
    formatData(data) {
      this.gamelist = data;
      // let len = Math.ceil(data.length/3);
      // if(data.length>0){
      //   for(let i=0; i<len; i++){
      //     let arr = data.splice(0, 3)
      //     this.gamelist.push(arr)
      //   }
      // }
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
  .game-list{
    padding:2vw;
  }
}
</style>


