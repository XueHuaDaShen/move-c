<template>
  <div class="download">
    <div class="d-top">
      <div class="d-content">
        <p class="scan-txt">
          <!-- <span class="scan"><img src="@/assets/img/download/scan.png" alt=""></span> -->
          <span>{{$t('message.scan_text')}}</span>
        </p>
        <div class="qr-code-div mb-60">
          <div class="ios-div">
            <span class="qr-code"><img src="@/assets/img/download/ios-qr-code.png" alt=""></span>
            <a class="desc" href="itms-services://?action=download-manifest&url=https://download.gamingsoft.org/mobileservice/download/kingslot/plist">
              <span class="ios-icon"><img src="@/assets/img/download/ios.png" alt=""></span>
              <p class="txt">
                <!-- <strong>{{$t('message.ios_dl')}}</strong> -->
                <!-- <em>{{$t('message.version')}}</em> -->
                <strong>{{$t('message.download')}}</strong>
              </p>
            </a>
          </div>
          <div class="android-div">
            <span class="qr-code"><img src="@/assets/img/download/android-qr-code.png" alt=""></span>
            <a class="desc" href="https://download.gamingsoft.org/mobileservice/download/kingslot/android">
              <span class="android-icon"><img src="@/assets/img/download/android.png" alt=""></span>
              <p class="txt">
                <!-- <strong>{{$t('message.android_dl')}}</strong> -->
                <!-- <em>{{$t('message.version')}}</em> -->
                <strong>{{$t('message.download')}}</strong>
              </p>
            </a>
          </div>
        </div>
        <!-- <p class="attention danger">*（ {{$t('message.download_login_desc_must')}}）</p> -->
        <p class="ios-application">{{$t('message.ios_application_step.title')}}</p>
        <ul class="steps-list">
          <li v-for="i in 5" :key="i">
            <em></em>
            <span>{{$t('message.ios_application_step.step'+i)}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'download',
  data() {
    return {
      msg: 'nihao',
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {
    this.$store.dispatch('setHeaderName', this.$t("message.download"));
  },
  beforeMount() {},
  mounted() {},
  watch: {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.download{
  width:100%;
  padding:0 8vw 8vw 8vw;
  background: #111111;
  .danger{
    color:#E84545;
  }
  .d-top{
    width:100%;
    position: relative;
    margin:0 auto;
    color: #fff;
    .d-content{
      width:100%;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-box-align:center;
    }
    p{
      text-align:center;
    }
    .scan-txt{
      display:-webkit-box;
      -webkit-box-align:center;
      -webkit-box-pack:center;
      margin-bottom:4vw;
      margin-top:4vw;
      font-size:4vw;
      .scan{
        width:.34rem;
        height:4vw;
        margin-right:1.07vw;
      }
      span{
        display:block;
      }
    }
    .qr-code-div{
      display:-webkit-box;
      -webkit-box-pack:center;
      .ios-div{
        margin-right:4vw;
        .desc{
          background-image: linear-gradient(45deg, #FC3832 0%, #F2C314 100%);
          box-shadow: 0 8px 16px 0 rgba(0,0,0,0.15);
          span{
            width:.31rem;
            height:.37rem;
          }
        }
      }
      .android-div{
        .desc{
          background-image: linear-gradient(-135deg, #1C0FD7 0%, #9C09DB 100%);
          box-shadow: 0 8px 16px 0 rgba(0,0,0,0.20);
          span{
            width:.31rem;
            height:.36rem;
          }
        }
      }
      .qr-code{
        width:3rem;
        height:3rem;
        display:block;
        border-radius:1.07vw;
      }
      .desc{
        width:100%;
        height:.76rem;
        margin-top:4vw;
        border-radius:1.07vw;
        text-decoration: none;
        color:#fff;
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
          margin-left:.14rem;
          strong{
            display:block;
            font-size:4vw;
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
      font-size:4vw;
      margin-bottom:.6rem;
    }
    .ios-application{
      font-size:4vw;
      margin-bottom:4vw;
      color:#fff;
    }
    .steps-list{
      width:100%;
      padding-left:2.4vw;
      border-left:.27vw solid #D8D8D8;
      color:#ababab;
      li{
        // margin-left:5px;
        display:-webkit-box;
        -webkit-box-align:center;
        font-size:4vw;
        margin-bottom:4vw;
        position: relative;
        &:last-child{
          margin-bottom:0;
        }
        em{
          display:block;
          width:2.4vw;
          height:2.4vw;
          background:#777;
          border-radius:50%;
          position: absolute;
          left:-4vw;
          top:50%;
          margin-top:-.09rem;
        }
        span{
          width:81.73vw;
          display:block;
          padding:3.73vw 0 3.73vw 2.67vw;
          background: #1f1e1f;
          text-align:left;
          white-space: pre-wrap;
          border-radius: 1.07vw;
        }
      }
    }
  }
}
</style>


