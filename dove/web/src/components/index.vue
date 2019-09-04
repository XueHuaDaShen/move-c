<template>
  <div class="index-home" v-loading.fullscreen="loading">
    <div class="home-head-bg"></div>
    <!-- <pageTitle></pageTitle> -->
    <div class="home-content-bg">
      <div class="index-content">
        <!-- <div class="h-intro-light mb-30 index-content1-img">{{$t('message.home_play_desc_1')}}</div> -->
        <div class="h-intro-play mb-30">
          <ul class="play-left">
            <li>
              <div class="step step1"></div>
              <div class="desc">
                <span class="name">{{$t('message.deposit_to_withdrawal.deposit.name')}}</span>
                <span>{{$t('message.deposit_to_withdrawal.deposit.desc')}}</span>
              </div>
            </li>
            <li>
              <div class="step step2"></div>
              <div class="desc">
                <span class="name">{{$t('message.deposit_to_withdrawal.play.name')}}</span>
                <span>{{$t('message.deposit_to_withdrawal.play.desc')}}</span>
              </div>
            </li>
            <li>
              <div class="step step3"></div>
              <div class="desc">
                <span class="name">{{$t('message.deposit_to_withdrawal.withdrawal.name')}}</span>
                <span>{{$t('message.deposit_to_withdrawal.withdrawal.desc')}}</span>
              </div>
            </li>
          </ul>
          <div class="play-right">
            <p class="cash-icon"><em></em><span>{{$t('message.deposit_to_withdrawal.current_bonus.name')}}</span></p>
            <p>{{countCash  | filterCash}}</p>
          </div>
        </div>
        <div class="mb-30 banner">
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
            <!-- <div class="swiper-pagination"></div> -->
            <!-- <div class="arrow-left"></div> -->
            <!-- <div class="arrow-right"></div> -->
          </div>
        </div>
        <!-- <div class="h-intro-light mb-30">{{$t('message.home_play_desc_2')}}</div> -->
        <!-- <ul class="game-list" v-if="gamelist.length>0">
          <li v-for="(item, k) in gamelist" :key="k" @click="loginGame(item.GameId)">
            <game :imgUrl="item.ImageUrl" :name="item.Method" :iconUrl="formatIconUrl(item.JackpotName)" :addr="item.JackpotName"></game>
          </li>
        </ul> -->
        <div class="game-title mb-30 slots">
          <div class="icon-text"><span class="icon"></span><span class="text">{{$t("message.lower_slots")}}</span></div>
          <div class="operate-wrap">
            <div class="go-more-btn btn" @click="goMore('slots')"><span>{{$t('message.more_games')}}</span><em></em></div>
          </div>
        </div>
        <div v-loading="loadGame">
          <ul class="game-list mb-60" v-if="gamelist.length>0&&!loadGame">
            <li class="game-wrap-item" v-for="(item, k) in gamelist" :key="k">
              <div class="game-item" v-for="(game, g) in item" :key="g">
                <!-- <game width="160px" height="250px" :imgUrl="game.ImageUrl" :name="game.Method" :iconUrl="formatIconUrl(game.JackpotName)" :addr="game.JackpotName"></game> -->
                <game width="160px" height="250px" :loading="loading" @loadingGame="handleLogingGame" :gameData="game" type="slots" :imgUrl="game.img" :name="game.gamename"></game>
              </div>
            </li>
          </ul>
          <div class="game-no-data mb-60" v-if="!gamelist.length>0">
            {{$t("message.no_data")}}
          </div>
        </div>
        <div class="game-title mb-30 live">
          <div class="icon-text"><span class="icon"></span><span class="text">{{$t("message.lower_live_casino")}}</span></div>
          <div class="operate-wrap">
            <div class="go-more-btn btn" @click="goMore('liveCasino')"><span>{{$t('message.more_games')}}</span><em></em></div>
          </div>
        </div>
        <div v-loading="loadLivegame">
          <ul class="game-list mb-60 live-list" v-if="liveGameList.length>0&&!loadLivegame">
            <li class="game-wrap-item" v-for="(item, k) in liveGameList" :key="k">
              <div class="game-item" v-for="(game, g) in item" :key="g">
                <game width="348px" height="249px" :loading="loading" @loadingGame="handleLogingGame" :gameData="game" type="live" :imgUrl="game.img" :name="game.gamename"></game>
              </div>
            </li>
          </ul>
          <div class="game-no-data mb-60" v-if="!liveGameList.length>0">
            {{$t("message.no_data")}}
          </div>
        </div>
        <div class="game-title mb-30 provider">
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
        <div class="game-no-data" v-if="!providerList.length>0">
          {{$t("message.no_data")}}
        </div>
      </div>
    </div>
    <div class="customer" v-if="showCustomer">
      <i class="close el-icon-close" @click="showCustomer=false"></i>
      <img src="@/assets/img/home/customer.png" alt="">
    </div>
  </div>
</template>
<script>
import Swiper from "swiper";
import "swiper/dist/css/swiper.css";
import game from '@/components/public/game';
import pageTitle from '@/components/public/pageTitle';
export default {
  name: 'index-home',
  components: {
    game,
    pageTitle
  },
  data() {
    return {
      msg: 'nihao',
      loading: false,
      duration: 1500,
      countCash: '0',
      myInterval: null,
      loginname: 'dove_ceshi5',
      gamelist: [],
      liveGameList: [],
      loadGame: false,
      loadLivegame: false,
      bannerlist: [],
      providerList: [],
      showCustomer: true,
    }
  },
  computed: {
    getLoginStatus() {
      return this.$store.state.isLogin;
    }
  },
  beforeDestroy() {},
  destroyed() {
    clearInterval(this.myInterval)
  },
  beforeCreate() {},
  created() {
    const vm = this;
    this.importProviderImg();
    this.getGameListSlots();
    this.getGameListLive();
    this.getBanner();
    this.getCountCash();
    vm.myInterval = setInterval(() => {
      vm.getCountCash()
    }, 3*60*1000)
  },
  beforeMount() {},
  mounted() {
    // 需要登录的页面跳转至index页面
    // 通过路由参数showLogin = true，在index页面重新打开登录弹框
    if (this.$route.params.showLogin) {
      this.$store.dispatch('setAlertBG', true);
      this.$store.dispatch('setShowLoginDialog', true);
    }
    this.ceshi()
  },
  watch: {},
  methods: {
    ceshi() {
      this.$http.post('/admin/login', {
        name: 'admin',
        password: CryptoJS.HmacMD5(CryptoJS.MD5('pass').toString(), '12345').toString(),
        random: '12345'
      }, {
          emulateJSON: true
        }).then(res => {
        console.log('res------------------',res)
      }).then(err => {
        if(err){
          console.log('err-------------',err)
        }
      })
    },
    toThousands(num) {
      num = Math.abs(num).toFixed(2);
      var re = /\d{1,3}(?=(\d{3})+$)/g;
      var n1 = (num || 0).toString().replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
        return s1.replace(re, "$&,") + s2;
      });
      return n1
    },
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
    // 获取累计的金额
    getCountCash() {
      this.$http.get('/platform/reward', {}).then(res => {
        let code = res.body.returncode;
        if(code == 200){
          this.countCash = res.body.data.value;
        }else if (code == 103 || code == 106 || code == 101) {
          this.$store.state.logout(this);
        }
      }).then(err => {})
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
        let code = res.body.returncode;
        this.loadGame = false;
        if(code == 200){
          this.formatData(res.data.data.data, 6, 4, 'gamelist');
        }else if (code == 103 || code == 106 || code == 101) {
          this.$store.state.logout(this);
        }else{
          this.formatData([], 6, 5, 'gamelist');
        }
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
        let code = res.body.returncode;
        this.loadLivegame = false;
        if(code == 200){
          this.formatData(res.data.data.data, 3, 1, 'liveGameList');
        }else if (code == 103 || code == 106 || code == 101) {
          this.$store.state.logout(this);
        }else{
          this.formatData([], 6, 4, 'liveGameList');
        }
      }).then(err => {
        if(err){
          this.loadLivegame = false;
        }
      })
    },
    // 处理数据
    formatData(data, col, row, vmArr) {
      this[vmArr] = [];
      if(data.length>0){
        for(let i=0; i<row; i++){
          let arr = data.splice(0, col)
          this[vmArr].push(arr)
        }
      }
    },
    // banner 图片
    getBanner() {
      this.$http.get('/active/list', {
        params: {
          enabled: 1,
          open: 1
        }
      }).then(res => {
        let code = res.body.returncode;
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
        navigation: {
          nextEl: ".arrow-right",
          prevEl: ".arrow-left"
        },
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
    // 获取游戏 是否登录
    handleLogingGame(val) {
      this.loading = val;
    },
    // 更多游戏
    goMore(url, game) {
      localStorage.setItem('web-slots-game-type', game || '');
      this.$router.push({
        name: url
      })
    },
  }
}

</script>
<style lang="scss">

  #mySwiper {
    overflow: hidden;
    height: 100%;
    border-radius:8px;

    // .swiper-pagination-fraction,
    // .swiper-pagination-custom,
    // .swiper-container-horizontal>.swiper-pagination-bullets {
    //   width: 100px;
    //   background: rgba(0, 0, 0, 0.50);
    // }

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

  }

  .swiper-pagination{
    // width:300px;
    // height:46px;
    // position: absolute;
    // left:50%;
    // margin-left:-150px;
    // bottom:-46px;
    // line-height:46px;
    // background:#111;
    // border-radius:0 0 8px 8px;
    .my-bullet {
      width: 12px;
      height: 12px;
      text-align: center;
      font-size: 12px;
      color: #000;
      opacity: 1;
      background-color: rgba(242, 182, 114, 0.5);
      cursor: pointer;
      display: inline-block;
      margin: 0 5px;
      border-radius: 50%;
      outline: none;
    }

    .my-bullet-active {
      color: #f2b672;
      background: #f2b672;
    }
  }
  .arrow-left{
    width: 12px;
    height: 20px;
    background:url(../assets/img/home/swiper-left.png);
    background-size:100% 100%;
    position: absolute;
    z-index:11;
    left:410px;
    bottom:-34px;
    cursor: pointer;
    outline: none;
  }
  .arrow-right{
    width: 12px;
    height: 20px;
    background:url(../assets/img/home/swiper-left.png);
    background-size:100% 100%;
    transform:rotateZ(180deg);
    position: absolute;
    z-index:11;
    right:410px;
    bottom:-34px;
    cursor: pointer;
    outline: none;
  }
</style>

<style lang="scss" scoped>
  .home-head-bg {
    width: 100%;
    // height: 843px;
    height:590px;
    // background: url(../assets/img/home/home-head-bg.png);
    background: url(../assets/img/home/newHome.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .home-content-bg {
    width: 100%;
    min-height: 2135px;
    background:url(../assets/img/home/newHome-content.png);
    background-size: cover;
    background-repeat: no-repeat;
    // background-position: center;
  }
  .customer{
    width: 163px;
    height: 299px;
    position: fixed;
    z-index: 99;
    right: 30px;
    bottom: 60px;
    &:hover{
      .close{
        display:block;
      }
    }
    .close {
      position: absolute;
      right: 10px;
      top: 5px;
      cursor: pointer;
      display:none;
      color:#fff;
    }
  }

  @media screen and (max-width: 1280px) {
    .home-head-bg {
      width: 100%;
      height:590px;
      // height: 541px;
      // background: url(../assets/img/home/home-head-bg-1280.png);
      background: url(../assets/img/home/newHome.png);
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }

    .home-content-bg {
      width: 100%;
      min-height: 1980px;
      background:url(../assets/img/home/newHome-content.png);
      background-size: cover;
      background-repeat: no-repeat;
      // background-position: center;
    }

    .index-content {
      .index-content1-img {
        width: 100%;
        position: absolute;
        z-index: 1;
        left: 0;
        // top: -30px !important;
      }
    }
  }

  .mb-30 {
    margin-bottom: 30px;
  }
  .mb-60 {
    margin-bottom: 60px;
  }
  
  .swiper-content {
    width: 100%;
    height:100%;
    position: relative;
  }

  .index-content {
    width: 1100px;
    margin: 0 auto;
    padding-top: 84px;
    // padding-top:650px;
    padding-bottom: 50px;
    position: relative;
    .banner{
      width:100%;
      height:322px;
      background:#1f1e1f;
      padding:15px;
      border-radius:8px;
      box-shadow: 0px 2px 30px 0px rgba(0,0,0,.2);
      // overflow: hidden;
    }

    .index-content1-img {
      width: 100%;
      position: absolute;
      z-index: 1;
      left: 0;
      top: -50px;
    }

    .h-intro-light {
      height: 100px;
      background: url(../assets/img/home/h-intro-light.png) no-repeat;
      background-size: 100% 100%;
      color: #F2B672;
      font-size: 25px;
      text-align: center;
      line-height: 100px;
    }

    .h-intro-play {
      // height: 112px;
      width:100%;
      height:100px;
      padding: 0 50px;
      background: url(../assets/img/home/h-intro-play.png) no-repeat;
      background-size: 100% 100%;
      position: absolute;
      z-index: 1;
      left: 0;
      top: -50px;
      display: -webkit-box;
      -webkit-box-align: center;
      -webkit-box-pack: justify;
      color: #111;
      box-shadow: 0px 2px 30px 0px rgba(0,0,0,.2);

      .play-left {
        display: table;

        li {
          float: left;
          display: table;
          margin-right: 60px;

          div {
            float: left;
            height: 44px;
          }

          .step {
            margin-right: 10px;
            width: 50px;
          }

          .desc {
            font-size: 14px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-box-pack: justify;

            span {
              display: block;
              text-align: left;
            }

            .name {
              font-size: 16px;
              font-weight: 600;
            }
          }

          .step1 {
            background: url(../assets/img/home/step-1.png) no-repeat;
            background-size: 100% 100%;
          }

          .step2 {
            background: url(../assets/img/home/step-2.png) no-repeat;
            background-size: 100% 100%;
          }

          .step3 {
            background: url(../assets/img/home/step-3.png) no-repeat;
            background-size: 100% 100%;
          }

          &:last-child {
            margin-right: 0;
          }
        }
      }

      .play-right {
        display: -webkit-box;
        -webkit-box-orient: vertical;

        p {
          display: block;
          margin: 0;
          padding: 0;
          text-align: left;
          font-weight: 800;
          font-size: 34px;
        }

        .cash-icon {
          display: -webkit-box;
          margin-bottom:12px;

          em {
            width: 24px;
            height: 24px;
            display: block;
            margin-right: 10px;
            background: url(../assets/img/home/cash.png) no-repeat;
            background-size: 100% 100%;
          }

          span {
            display: block;
            font-size: 16px;
            font-weight: 600;
            line-height:24px;
          }
        }
      }
    }

    // .game-list {
    //   width: 100%;
    //   display: table;

    //   li {
    //     float: left;
    //     margin-right: 28px;
    //     margin-bottom: 28px;
    //     cursor: pointer;

    //     &:nth-child(6n) {
    //       margin-right: 0;
    //     }
    //   }
    // }
    .game-list {
      width: 100%;
      display: table;
    }
    .live-list>li{
      margin-bottom:28px;
    }
    .game-title{

      .go-more-btn {
        width: 160px;
        height: 40px;
        em {
          display: block;
          width: 12px;
          height: 10px;
          background: url(../assets/img/home/go-more.png);
          background-size: 100%;
          margin-top: 2px;
          margin-left:5px;
        }
      }
      
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
      width:100%;
      display:table;
      li{
        float: left;
        width:348px;
        height:249px;
        margin-right:28px;
        padding:30px 30px 0px 30px;
        background-color: #0a0a0a;
	      border-radius: 8px;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-box-align:center;
        overflow: hidden;
        cursor: pointer;
        transition: all .5s;
        &:hover{
          transform:translateZ(0) scale(1.07);
        }
        &:last-child{
          margin-right:0;
        }
        div.logo{
          width:202px;
          height:46px;
          margin-bottom:30px;
        }
        div.img{
          position: relative;
          width:130px;
          height:194px;
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
            &:hover{
              transform:translateZ(0) translateZ(0) scale(1.07);
            }
          }
          .img0{
            transform:translateX(-78px) translateY(30px);
            &:hover{
              transform:translateX(-78px) translateY(30px) translateZ(0) scale(1.07);
            }
          }
          .img2{
            transform:translateX(78px) translateY(30px);
            &:hover{
              transform:translateX(78px) translateY(30px) translateZ(0) scale(1.07);
            }
          }
        }
      }
    }
  }

</style>
