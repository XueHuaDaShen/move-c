<template>
  <div class="download user-common">
    <pageTitle title="download" class="mb-30"></pageTitle>
    <div class="d-top">
      <div class="game-title mb-30">
        <div class="icon-text"><span class="icon"></span><span class="text">{{lowerText($t('message.download'))}}</span></div>
      </div>
      <!-- <div class="d-bj"><img src="@/assets/img/download/d-top-bj.png" alt=""></div> -->
      <div class="d-content">
        <div class="download-inner">
          <p class="scan-txt mb-30"><span>{{$t('message.scan_text')}}</span></p>
          <!-- <p class="scan-txt mb-30"><span class="scan"><img src="@/assets/img/download/scan.png" alt=""></span><span>{{$t('message.scan_text')}}</span></p> -->
          <div class="qr-code-div">
            <div class="ios-div">
              <span class="qr-code"><img src="@/assets/img/download/ios-qr-code.png" alt=""></span>
              <a class="desc mt-30" href="itms-services://?action=download-manifest&url=https://download.gamingsoft.org/mobileservice/download/kingslot/plist">
                <span class="ios-icon"><img src="@/assets/img/download/ios.png" alt=""></span>
                <p class="txt">
                  <strong>{{$t('message.ios_dl')}}</strong>
                  <em>{{$t('message.version')}}</em>
                </p>
              </a>
            </div>
            <div class="android-div">
              <span class="qr-code"><img src="@/assets/img/download/android-qr-code.png" alt=""></span>
              <a class="desc mt-30" href="https://download.gamingsoft.org/mobileservice/download/kingslot/android">
                <span class="android-icon"><img src="@/assets/img/download/android.png" alt=""></span>
                <p class="txt">
                  <strong>{{$t('message.android_dl')}}</strong>
                  <em>{{$t('message.version')}}</em>
                </p>
              </a>
            </div>
          </div>
          <!-- <p class="attention danger">*（ {{$t('message.download_login_desc_must')}}）</p> -->
        </div>
        <div class="desc-div">
          <p class="ios-application mb-30">{{$t('message.ios_application_step.title')}}</p>
          <ul class="steps-list">
            <li v-for="i in 5" :key="i">
              <em></em>
              <span>{{$t('message.ios_application_step.step'+i)}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="d-bot">
      <!-- <div class="d-bj"><img src="@/assets/img/download/d-bot-bj.png" alt=""></div> -->
      <div class="d-content">
        <p class="title">{{$t('message.game_screenshot')}}</p>
        <div class="lunbo-wrap">
          <div class="lunbo-content">
            <div :class="setImg(0)"><img src="@/assets/img/download/lunbo-1.jpeg" alt=""></div>
            <div :class="setImg(1)"><img src="@/assets/img/download/lunbo-2.jpeg" alt=""></div>
            <div :class="setImg(2)"><img src="@/assets/img/download/lunbo-3.jpeg" alt=""></div>
          </div>
          <span class="prev" @click="prevFn">
            <div class="bg"></div>
            <img src="@/assets/img/download/left.png" alt="">
          </span>
          <span class="next" @click="nextFn">
            <div class="bg"></div>
            <img src="@/assets/img/download/left.png" alt="">
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pageTitle from '@/components/public/pageTitle';
export default {
  name: 'download',
  components: {
    pageTitle
  },
  data() {
    return {
      msg: 'nihao',
      imgArr: ['lunbo-img0', 'lunbo-img1', 'lunbo-img2'],
      imgIndex: 1,
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  watch: {},
  methods: {
    prevFn() {
      this.imgIndex --;
      if(this.imgIndex < 0){
        this.imgIndex = this.imgArr.length - 1;
      }
      let del = this.imgArr.splice(0, 1);
      this.imgArr.push(del[0]);
    },
    nextFn() {
      this.imgIndex ++;
      if(this.imgIndex > this.imgArr.length - 1){
        this.imgIndex = 0;
      }
      let del = this.imgArr.splice(2, 1);
      this.imgArr.unshift(del[0]);
    },
    setImg(index) {
      return this.imgArr[index];
    },
    lowerText(text) {
      if(text === 'DOWNLOAD') {
        return ( text.charAt(0) + text.substr(1).toLocaleLowerCase() )
      }else{
        return text;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.download{
  width:100%;
  background: #111111;
  .danger{
    color:#E84545;
  }
  .d-top{
    width:994px;
    position: relative;
    margin:0 auto;
    color: #ababab;
    font-size:16px;
    .d-content{
      width:100%;
      display:-webkit-box;
      -webkit-box-pack:center;
    }
    .game-title{
      .icon{
        width:36px;
        height:40px;
        background:url(../assets/img/download/download.png);
        background-size:100% 100%;
      }
    }
    p{
      text-align:center;
    }
    .scan-txt{
      display:-webkit-box;
      -webkit-box-align:center;
      -webkit-box-pack:center;
      .scan{
        width:20px;
        height:18px;
        margin-right:10px;
      }
      span{
        display:block;
      }
    }
    .qr-code-div{
      display:-webkit-box;
      -webkit-box-pack:center;
      .ios-div{
        margin-right:30px;
        .desc{
          // opacity: 0.9;
          // margin-top:10px;
          // border-radius:8px;
          text-decoration: none;
          color:#fff;
          background-image: linear-gradient(45deg, #FC3832 0%, #F2C314 100%);
          box-shadow: 0 8px 16px 0 rgba(0,0,0,0.15);
          span{
            width:31px;
            height:37px;
          }
        }
      }
      .android-div{
        .desc{
          // opacity: 0.9;
          // margin-top:10px;
          // border-radius:8px;
          text-decoration: none;
          color:#fff;
          background-image: linear-gradient(-135deg, #1C0FD7 0%, #9C09DB 100%);
          box-shadow: 0 8px 16px 0 rgba(0,0,0,0.20);
          span{
            width:31px;
            height:36px;
          }
        }
      }
      .qr-code{
        width:200px;
        height:200px;
        display:block;
        border-radius:8px;
        overflow: hidden;
      }
      .desc{
        width:100%;
        height:54px;
        border-radius:8px;
        display:-webkit-box;
        display:-webkit-box;
        -webkit-box-pack:center;
        -webkit-box-align:center;
        span{
          display:block;
        }
        .txt{
          display:-webkit-box;
          -webkit-box-orient:vertical;
          -webkit-box-align:start;
          margin-left:14px;
          strong{
            display:block;
            font-size:14px;
            color:#fff;
            font-weight:normal;
          }
          em{
            display:block;
            font-size:12px;
            font-style:normal;
          }
        }
      }
    }
    .attention{
      font-size:14px;
      margin-bottom:60px;
    }
    .steps-list{
      width:531px;
      padding:0 23px;
      border-left:2px solid #D8D8D8;
      color:#9C9EA2;
      margin-left:33px;
      li{
        // margin-left:5px;
        display:-webkit-box;
        -webkit-box-align:center;
        font-size:14px;
        margin-bottom:20px;
        position: relative;
        &:last-child{
          margin-bottom:0;
        }
        em{
          display:block;
          width:8px;
          height:8px;
          background:#999;
          border-radius:50%;
          position: absolute;
          left:-28px;
          top:50%;
          margin-top:-4px;
        }
        span{
          width:506px;
          height:40px;
          display:block;
          line-height:40px;
          padding:0 17px;
          background: #1f1e1f;
          text-align:left;
        }
      }
    }
  }
  .d-bot{
    width:660px;
    position: relative;
    margin:0 auto 204px;
    color: #ababab;
    .d-content{
      width:100%;
      height:100%;
      p.title{
        text-align:center;
        font-size: 16px;
        margin:60px 0 30px 0;
      }
    }
    .lunbo-wrap{
      width:660px;
      height:230px;
      margin:auto;
      position: relative;
      span{
        width:100px;
        height:100%;
        position: absolute;
        cursor: pointer;
        display:-webkit-box;
        -webkit-box-align:center;
        -webkit-box-pack:center;
        z-index:5;
        .bg{
          opacity: .5;
          background:#000;
          z-index: 1;
          width:100%;
          height:100%;
          position: absolute;
          left:0;
          top:0;
        }
        img{
          width:18px;
          height:30px;
          position: relative;
          z-index:2;
        }
      }
      .prev{
        left:0;
        top:0;
      }
      .next{
        right:0;
        top:0;
        transform: rotateY(180deg)
      }
      .lunbo-content{
        position: absolute;
        width:460px;
        height:258px;
        left:100px;
        top:-14px;
        z-index:2;
        >div{
          position: absolute;
          width:100%;
          height:100%;
          left:0;
          top:0;
          z-index:3;
          transition: all .5s ease;
        }
        .lunbo-img0{
          z-index:6;
        }
        .lunbo-img1{
          transform: rotateY(30deg) translateX(-3px) translateZ(-300px) scale(.89);
        }
        .lunbo-img2{
          transform: rotateY(-30deg) translateX(3px) translateZ(-300px) scale(.89);
        }
      }
    }
  }
  .d-bj{
    width:100%;
    height:auto;
  }
  .d-content{
    // position: absolute;
    left:0;
    top:0;
  }
}
</style>


