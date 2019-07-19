<template>
  <div class="download">
    <div class="d-top">
      <div class="d-content">
        <p class="scan-txt"><span class="scan"><img src="@/assets/img/download/scan.png" alt=""></span><span>{{$t('message.scan_text')}}</span></p>
        <div class="qr-code-div">
          <!-- <div class="ios-div">
            <span class="qr-code"><img src="@/assets/img/download/ios-qr-code.png" alt=""></span>
            <a class="desc" href="itms-services://?action=download-manifest&url=https://download.gamingsoft.org/mobileservice/download/gsoft/plist">
              <span class="ios-icon"><img src="@/assets/img/download/ios.png" alt=""></span>
              <p class="txt">
                <strong>{{$t('message.ios_dl')}}</strong>
                <em>{{$t('message.version')}}</em>
                <strong>{{$t('message.download')}}</strong>
              </p>
            </a>
          </div> -->
          <div class="android-div">
            <span class="qr-code"><img src="@/assets/img/download/android-qr-code.png" alt=""></span>
            <a class="desc" href="http://dl.kinglotto9.com/apk/kinglotto_1.0.0.apk">
              <span class="android-icon"><img src="@/assets/img/download/android.png" alt=""></span>
              <p class="txt">
                <strong>{{$t('message.android_dl')}}</strong>
                <em>{{$t('message.version')}}</em>
                <!-- <strong>{{$t('message.download')}}</strong> -->
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
  created() {},
  beforeMount() {},
  mounted() {},
  watch: {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.download{
  background: #000 !important;
  width:100%;
  .danger{
    color:#E84545;
  }
  .d-top{
    width:100%;
    position: relative;
    margin:0 auto;
    color: #EEEEEE;
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
      margin-bottom:30px;
      margin-top:30px;
      font-size:16px;
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
      margin-bottom:20px;
      // .ios-div{
      //   margin-right:60px;
      //   .desc{
      //     background-image: linear-gradient(45deg, #FC3832 0%, #F2C314 100%);
      //     box-shadow: 0 8px 16px 0 rgba(0,0,0,0.15);
      //     span{
      //       width:4.13vw;
      //       height:5.07vw;
      //     }
      //   }
      // }
      .android-div{
        .desc{
          // background-image: linear-gradient(-135deg, #1C0FD7 0%, #9C09DB 100%);
          // box-shadow: 0 8px 16px 0 rgba(0,0,0,0.20);
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
        border-radius:4px;
        overflow: hidden;
      }
      .desc{
        width:100%;
        height:50px;
        margin-top:10px;
        border-radius:4px;
        text-decoration: none;
        color:#fff;
        display:-webkit-box;
        display:-webkit-box;
        -webkit-box-pack:center;
        -webkit-box-align:center;
        background-image: linear-gradient(135deg, #eae182 0%, #b68529 100%);
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.20);
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
    .ios-application{
      font-size:16px;
      margin-bottom:30px;
    }
    .steps-list{
      // width:100%;
      padding-left:12px;
      border-left:2px solid #D8D8D8;
      color:#9C9EA2;
      margin-bottom:60px;
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
          background:#777;
          border-radius:50%;
          position: absolute;
          left:-17px;
          top:50%;
          margin-top:-4px;
        }
        span{
          width:540px;
          display:block;
          padding:5px 0 5px 20px;
          background: #1A2028;
          text-align:left;
          white-space: pre-wrap;
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    width:100%;
    padding:0 6.4vw;
    .d-top{
      width:100%;
      position: relative;
      margin:0 auto;
      color: #EEEEEE;
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
        margin-top:7.33vw;
        font-size:4.27vw;
        .scan{
          width:4.53vw;
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
        margin-bottom:4vw;
        .ios-div{
          margin-right:4vw;
          .desc{
            // background-image: linear-gradient(45deg, #FC3832 0%, #F2C314 100%);
            box-shadow: 0 8px 16px 0 rgba(0,0,0,0.15);
            span{
              width:4.13vw;
              height:5.07vw;
            }
          }
        }
        .android-div{
          .desc{
            // background-image: linear-gradient(-135deg, #1C0FD7 0%, #9C09DB 100%);
            box-shadow: 0 8px 16px 0 rgba(0,0,0,0.20);
            span{
              width:4.13vw;
              height:4.8vw;
            }
          }
        }
        .qr-code{
          width:40vw;
          height:40vw;
          display:block;
          // border-radius:4px;
        }
        .desc{
          width:100%;
          height:10.13vw;
          margin-top:4vw;
          border-radius:.53vw;
          text-decoration: none;
          color:#fff;
          display:-webkit-box;
          display:-webkit-box;
          -webkit-box-pack:center;
          -webkit-box-align:center;
          background-image: linear-gradient(135deg, #eae182 0%, #b68529 100%);
          span{
            display:block;
          }
          .txt{
            display:-webkit-box;
            -webkit-box-orient:vertical;
            -webkit-box-align:start;
            margin-left:1.33vw;
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
        margin-bottom:8vw;
      }
      .ios-application{
        font-size:4vw;
        margin-bottom:4.67vw;
      }
      .steps-list{
        width:100%;
        padding-left:2.4vw;
        border-left:.53vw solid #D8D8D8;
        color:#9C9EA2;
        margin-bottom:60px;
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
            margin-top:-1.2vw;
          }
          span{
            width:81.73vw;
            display:block;
            padding:1.07vw 0 1.07vw 2.67vw;
            background: #1A2028;
            text-align:left;
            white-space: pre-wrap;
          }
        }
      }
    }
  }
}
</style>


