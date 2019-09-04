<template>
  <div class="slots user-common" v-loading.fullscreen="loading">
    <div class="slots-content">
      <div class="operate-tag mt-60">
        <div class="btn" :class="btn.value === currentBtn ? 'active' : ''" v-for="(btn, bi) in gameType" :key="bi" @click="handleChangeType(btn.value, bi)"><span>{{btn.name}}</span></div>
      </div>
      <div v-loading="loadGame">
        <ul class="game-list" v-if="gamelist.length>0">
          <li class="game-wrap-item" v-for="(game, k) in gamelist" :key="k">
            <game width="28vw" height="52.27vw" :imgUrl="game.img" :name="game.gamename" :gameData="game" type="slots"></game>
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
  name: 'slots',
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
      copyGameList: [],
      gameType: [
        {name: 'All', value: 'All Games'},
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
    this.$store.dispatch('setHeaderName', this.$t("message.slots"));
    this.currentBtn = localStorage.getItem('app-slots-game-type') || this.defaultBtn;
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
      this.gamelist = data;
      // let len = Math.ceil(data.length/6);
      // if(data.length>0){
      //   for(let i=0; i<len; i++){
      //     let arr = data.splice(0, 6)
      //     this.gamelist.push(arr)
      //   }
      // }
    },
    handleChangeType(value, index) {
      this.currentBtn = value;
      localStorage.setItem('app-slots-game-type', value || '');
      let arr = [];
      if(value === this.defaultBtn){
        arr = this.copyGameList.filter(item => {return item});
      }else{
        arr = this.copyGameList.filter(item => {return item.provider === value});
      }
      this.gameType.forEach((element, ei) => {
        if(element.value === this.currentBtn){
          index = ei;
        }
      });
      this.transtionAnimate(index);
      this.spliceData(arr);
    },
    transtionAnimate(index) {
      let defaultLeft = 50*index;
      let ele = document.getElementsByClassName('operate-tag')[0];
      let left = ele.scrollLeft;
      if(left >= defaultLeft && index != this.gameType.length-1 ){
        // if(left >= defaultLeft){
          let st = setInterval(() => {
            left -= 2;
            if(left <= defaultLeft){
              clearInterval(st);
            }
            ele.scrollLeft = left;
          }, 1)
        // }
      }else{
        // if(left <= defaultLeft){
          let st = setInterval(() => {
            left += 2;
            if(left >= defaultLeft){
              clearInterval(st);
            }
            ele.scrollLeft = left;
          }, 1)
        // }
      }
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
  padding-bottom:2vw;
  .operate-tag{
    overflow:scroll;
    display:-webkit-box;
    margin-bottom:6vw;
    .btn{
      padding-left:4vw;
      &:last-child{
        padding-right:4vw;
      }
      span{
        width: 15.13vw;
        height: 6.8vw;
        display:block;
        color: #ababab;
        line-height:7.8vw;
        text-align:center;
        border: solid 0.13vw #333333;
        font-size:4.27vw;
        border-radius: 4.67vw;
      }
    }
    div.active{
      span{
        color:#333333;
        background-image: linear-gradient(134deg, #fadcab 0%, #d99d59 100%, #f2b672 100%);
      }
    }
  }
}
</style>


