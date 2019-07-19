<template>
  <div class="app-home">
    <div class="big-logo-banner"><img src="@/assets/img/home/big-logo-banner.png" alt=""></div>
    <!-- <h2 class="h-intro-light">{{$t('message.home_play_desc_1')}}</h2> -->
    <div class="deposit-withdrawal">
      <ul class="step-list">
        <li v-for="(item, i) in stepList" :key="i">
          <em class="icon"><img :src="item.img" alt=""></em>
          <span class="text">{{$t("message.deposit_to_withdrawal."+item.name+".name")}}</span>
        </li>
      </ul>
    </div>
    <div class="activity-banner">
      <div class="swiper-content">
        <div class="swiper-container" id="mySwiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item,index) in bannerlist" :key="index">
              <router-link
                :to="{name:'activityDetail',query:{id:item._id}}"
                :title="item.title"
              >
                <img :src="item.activity_photo">
              </router-link>
            </div>
          </div>
          <div class="swiper-pagination" v-if="bannerlist.length>1"></div>
        </div>
      </div>
    </div>
    <div class="game-title slots">
      <div class="icon-text"><span class="icon"></span><span class="text">{{$t("message.slots")}}</span></div>
      <div class="operate-wrap">
        <div class="go-more-btn btn" @click="goMore('slots')"><span>{{$t('message.more_games')}}</span><em></em></div>
      </div>
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
    <div class="game-title live">
      <div class="icon-text"><span class="icon"></span><span class="text">{{$t("message.live_casino")}}</span></div>
      <div class="operate-wrap">
        <div class="go-more-btn btn" @click="goMore('liveCasino')"><span>{{$t('message.more_games')}}</span><em></em></div>
      </div>
    </div>
    <div v-loading="loadLivegame">
      <ul class="game-list" v-if="liveGameList.length>0">
        <li class="game-wrap-item" v-for="(game, k) in liveGameList" :key="k">
          <game width="44vw" height="37.6vw" :imgUrl="game.img" :name="game.gamename" :gameData="game" type="live"></game>
        </li>
      </ul>
      <div class="game-no-data" v-if="!gamelist.length>0&&!loadLivegame">
        {{$t("message.no_data")}}
      </div>
    </div>
    <div class="game-title provider">
      <div class="icon-text"><span class="icon"></span><span class="text">{{$t("message.game_providers")}}</span></div>
    </div>
    <ul class="provider-list" v-if="providerList.length>0">
      <li v-for="(pro, pi) in providerList" :key="pi" @click="goMore('slots', pro.game)">
        <div class="logo"><img :src="pro.logo" alt=""></div>
        <div class="img">
          <div v-for="(img, i) in pro.images" :key="i" :class="'img'+i"><img :src="img" alt=""></div>
        </div>
      </li>
    </ul>
    <contactUs></contactUs>
  </div>
</template>
<script>
import myHeader from '@/components/public/header';
import Swiper from "swiper";
import "swiper/dist/css/swiper.css";
import game from '@/components/public/game';
import contactUs from '@/components/contactUs';
export default {
  name: 'home',
  components: {
    myHeader,
    game,
    contactUs
  },
  data() {
    return {
      msg: 'nihao',
      stepList: [
        {name: 'deposit', img: require('@/assets/img/home/step-1.png')},
        {name: 'play', img: require('@/assets/img/home/step-2.png')},
        {name: 'withdrawal', img: require('@/assets/img/home/step-3.png')}
      ],
      bannerlist: [],
      gamelist: [],
      liveGameList: [],
      loadGame: false,
      loadLivegame: false,
      providerList: [],
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {
    this.$store.dispatch('setHeaderName', this.$t("message.home"));
    this.getBanner();
    this.getGameListSlots();
    this.getGameListLive();
    this.importProviderImg();
  },
  beforeMount() {},
  mounted() {},
  watch: {},
  methods: {
    // import provider img
    importProviderImg() {
      this.providerList = [];
      let type = ['GSS', 'SA', 'GPI'];
      let files = type.length;
      let imgs = 3;
      for(let i=1; i<=files; i++){
        let logo = require('@/assets/img/provider/'+i+'/logo.png');
        let game = type[i-1]
        let images = [];
        for(let j=1; j<=imgs; j++){
          let img = require('@/assets/img/provider/'+i+'/'+j+'.png');
          images.push(img);
        }
        this.providerList.push({logo, game, images})
      }
    },
    // 游戏列表
    getGameListSlots() {
      this.loadGame = true;
      this.$http.get('/platform/game/list', {
        params: {
          type: 'Slots',
          pageSize: 999,
          recommend: 1
        }
      }).then(res => {
        this.gamelist = res.data.data.data || [];
        this.gamelist.length = this.gamelist.length > 9 ? 9 : this.gamelist.length;
        this.loadGame = false;
      }).then(err => {
        if(err){
          this.loadGame = false;
        }
      })
    },
    // 游戏列表
    getGameListLive() {
      this.loadLivegame = true;
      this.$http.get('/platform/game/list', {
        params: {
          type: 'Live',
          recommend: 1
        }
      }).then(res => {
        this.liveGameList = res.data.data.data || [];
        this.liveGameList.length = this.liveGameList.length > 6 ? 6 : this.liveGameList.length;
        this.loadLivegame = false;
      }).then(err => {
        if(err){
          this.loadLivegame = false;
        }
      })
    },
    // banner 图片
    getBanner() {
      this.$http.get('/active/list', {
        params: {
          enabled: 1,
          open: 1
        }
      }).then(res => {
        let code = res.body.returncode
        if(code == 200){
          this.bannerlist = res.body.data.data;
          this.$nextTick(function() {
            this.swiperInit();
          });
        }else if (code == 103 || code == 106 || code == 101) {
          this.$store.state.logout(this);
        }
        // console.log(res)
      }).then(err => {})
    },
    swiperInit() {
      let self = this;
      this.mySwiper = new Swiper("#mySwiper", {
        loop: self.bannerlist.length > 1,
        speed: 1000,
        loopAdditionalSlides: 20,
        // navigation: {
        //   nextEl: ".arrow-right",
        //   prevEl: ".arrow-left"
        // },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {
          el: ".swiper-pagination",
          // type: 'custom',
          clickable: true,
          bulletClass: "my-bullet",
          bulletActiveClass: "my-bullet-active",
          renderBullet: function(index, className) {
            // return '<span class=" ' + className + ' ">' + (index + 1) + '</span>';
            return '<span class=" ' + className + ' "></span>';
          }
        }
      });
      this.mySwiper.el.onmouseover = function() {
        self.mySwiper.autoplay.stop();
      };
      this.mySwiper.el.onmouseleave = function() {
        self.mySwiper.autoplay.start();
      };
    },
    // 格式 icon url
    formatIconUrl(name) {
      if (!name) {
        return ''
      }
      return 'https://images.1sgames88.com/diamonds/small/' + name.replace(/\s+/g, "") + '.png';
    },
    // 更多游戏
    goMore(url, game) {
      localStorage.setItem('app-slots-game-type', game || '');
      this.$router.push({
        name: url
      })
    },
  }
}
</script>
<style lang="scss">

  #mySwiper {
    overflow: visible;
    height: 100%;
    .swiper-pagination{
      font-size:12px !important;
    }
    .swiper-slide {
      height: 100%;
      position: relative;
      cursor: pointer;

      img {
        max-width: 100%;
        width: 100%;
        height: 100%;
        // opacity: 0.7;
        -webkit-transition: all linear 300ms;
        transition: all linear 300ms;
      }

      a {
        width: 100%;
        height: 100%;
        position: relative;
        display: block;
        background-size: cover;
        text-decoration: none;
        cursor: pointer;
      }

      a:hover img {
        opacity: 1;
      }
    }

    .my-bullet {
      width: 3vw;
      height: 3vw;
      text-align: center;
      font-size: 12px;
      color: #000;
      opacity: 1;
      background: rgba(0, 0, 0, 0.2);
      cursor: pointer;
      display: inline-block;
      margin: 0 1vw;
      border-radius: 50%;
    }

    .my-bullet-active {
      color: #fff;
      background: #f4f4f4;
    }
  }
</style>
<style lang="scss" scoped>
.app-home{
  width:100%;
  height:100%;
  position: relative;
  .big-logo-banner{
    width:100%;
  }
  .h-intro-light{
    position: absolute;
    width:92vw;
    height:14.67vw;
    left:4vw;
    top:58.67vw;
    font-size:4.27vw;
    color: #F2B672;
    text-align:center;
    line-height:14.67vw;
    background:url(../assets/img/home/light-text.png) no-repeat;
    background-size:100% 100%;
    z-index:2;
  }
  .deposit-withdrawal{
    width:92vw;
    height:14.67vw;
    position: absolute;
    left:4vw;
    top:58.67vw;
    background-image: linear-gradient(134deg, #b1804b 0%,	#f7eccc 50%, #b1804b 100%);
    // background-image: linear-gradient(180deg,	#f7eccc 0%,	#b1804b 100%);
	  box-shadow: 0vw 0.27vw 4vw 0vw rgba(0, 0, 0, 0.2);
	  border-radius: 1.07vw;
    z-index:1;
    .step-list{
      position: absolute;
      bottom:4vw;
      left:0;
      padding:0 8vw;
      width:100%;
      display:-webkit-box;
      -webkit-box-pack:justify;
      li{
        display:-webkit-box;
        -webkit-box-align:center;
        .icon{
          width:6.67vw;
          height:5.87vw;
          margin-right:1.07vw;
          display:block;
        }
        .text{
          display:block;
          font-size:4.27vw;
          color: #111111;
        }
      }
    }
  }
  .activity-banner{
    width:100%;
    height:27.33vw;
    overflow: hidden;
    margin-top:19.2vw;
    margin-bottom:2vw;
  }
  .swiper-content {
    width: 100%;
    height:100%;
    position: relative;
  }
  .game-text{
    color:#eee;
    font-size:4.8vw;
    margin-top:4vw;
    margin-bottom:4vw;
  }
  .slots{
    .icon-text .icon{
      background:url(../assets/img/home/slots.png);
      background-size:100% 100%;
    }
  }
  .live{
    .icon-text .icon{
      background:url(../assets/img/home/live.png);
      background-size:100% 100%;
    }
    .operate-wrap{
      top:1px;
    }
  }
  .provider{
    .icon-text .icon{
      background:url(../assets/img/home/provider.png);
      background-size:100% 100%;
    }
  }
  .provider-list{
    display:table;
    width:100%;
    padding:0 2vw;
    li{
      float: left;
      width:92vw;
      height:65.87;
      margin:2vw;
      padding:9.07vw 7.87vw 0px 7.87vw;
      background-color: #1f1e1f;
      border-radius: 1.07vw;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-box-align:center;
      overflow: hidden;
      cursor: pointer;
      transition: all .5s;
      // &:hover{
      //   transform: scale(1.07);
      // }
      &:last-child{
        margin-right:0;
      }
      div.logo{
        width:42.4vw;
        height:9.87vw;
        margin-bottom:9.07vw;
      }
      div.img{
        position: relative;
        width:35.3vw;
        height:51.47vw;
        >div{
          position: absolute;
          width:100%;
          height:100%;
          left:0;
          top:0;
          z-index:3;
          transition: all .5s;
        }
        .img1{
          z-index:6;
          // &:hover{
          //   transform: scale(1.07);
          // }
        }
        .img0{
          transform:translateX(-78px) translateY(30px);
          // &:hover{
          //   transform:translateX(-78px) translateY(30px) scale(1.07);
          // }
        }
        .img2{
          transform:translateX(78px) translateY(30px);
          // &:hover{
          //   transform:translateX(78px) translateY(30px) scale(1.07);
          // }
        }
      }
    }
  }
}
</style>


