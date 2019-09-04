<template>
  <div class="slots user-common" v-loading.fullscreen="loading">
    <pageTitle></pageTitle>
    <div class="slots-content">
      <div class="game-title mb-30">
        <div class="icon-text"><span class="icon"></span><span class="text">{{$t("message.lower_slots")}}</span></div>
        <div class="operate-wrap">
          <div class="btn" :class="btn.value === currentBtn ? 'active' : ''" v-for="(btn, bi) in gameType" :key="bi" @click="handleChangeType(btn.value)"><span>{{btn.name}}</span></div>
        </div>
      </div>
      <div v-loading="loadGame">
        <ul class="game-list" v-if="gamelist.length>0">
          <li class="game-wrap-item" v-for="(item, k) in gamelist" :key="k">
            <div class="game-item" v-for="(game, g) in item" :key="g">
              <game width="160px" height="250px" @loadingGame="handleLogingGame" :gameData="game" type="slots" :imgUrl="game.img" :name="game.gamename"></game>
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
  name: 'slots',
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
      copyGameList: [],
      gameType: [
        {name: 'All Games', value: 'All Games'},
        {name: 'GSS', value: 'GSS'},
        {name: 'GPI', value: 'GPI'},
        {name: 'SA', value: 'SA'},
        {name: 'PP', value: 'PP'}
      ],
      currentBtn: '',
      defaultBtn: 'All Games'
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
    this.currentBtn = localStorage.getItem('web-slots-game-type') || this.defaultBtn;
    this.getGameListGSS();
  },
  beforeMount() {},
  mounted() {},
  watch: {},
  methods: {
    
    // 游戏列表
    getGameListGSS() {
      this.loadGame = true;
      this.$http.get('/platform/game/list', {
        params: {
          // provider: 'GSS',
          pageSize:999,
          type: 'Slots'
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
      this.copyGameList = [];
      let len = this.gameType.length;
      let copy1 = [];
      let copy2 = [];
      data.filter(item => {
        let index = Math.floor(Math.random()*len);
        item.setType = this.gameType[index].value;
        copy1.push(item);
        copy2.push(item);
      })
      this.copyGameList = copy2;
      if(this.currentBtn === this.defaultBtn){
        this.spliceData(copy1)
      }else{
        this.handleChangeType(this.currentBtn)
      }
    },
    spliceData(data) {
      this.gamelist = [];
      let len = Math.ceil(data.length/6);
      if(data.length>0){
        for(let i=0; i<len; i++){
          let arr = data.splice(0, 6)
          this.gamelist.push(arr)
        }
      }
    },
    handleChangeType(value) {
      this.currentBtn = value;
      localStorage.setItem('web-slots-game-type', value || '')
      let arr = [];
      if(value === this.defaultBtn){
        arr = this.copyGameList.filter(item => {return item});
      }else{
        arr = this.copyGameList.filter(item => {return item.provider === value});
      }
      // console.log(arr)
      this.spliceData(arr);
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
.slots{
  background-color: #111111;
  .slots-content{
    width:1100px;;
    margin:30px auto;
  }
  .game-list {
    width:100%;
    display: table;

    li {
      margin-bottom: 20px;
    }
  }
  .game-title{
    .icon-text .icon{
      background:url(../assets/img/home/slots.png);
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


