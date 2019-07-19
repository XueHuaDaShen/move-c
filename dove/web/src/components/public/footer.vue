<template>
  <div>
    <div class="footer-wrap">
      <div class="footer-bg"></div>
      <div class="footer-content">
        <div class="footer-icon"></div>
        <ul class="desc-link">
          <li>
            <router-link to="index">{{$t('message.home')}}</router-link>
          </li>
          <li>
            <router-link to="slots">{{$t('message.slots')}}</router-link>
          </li>
          <li>
            <router-link to="liveCasino">{{$t('message.live_casino')}}</router-link>
          </li>
          <!-- <li>
            <a href="javscript:;">Promotion</a>
          </li> -->
        </ul>
        <ul class="desc-link" style="margin-right:60px;">
          <li>
            <router-link to="download">{{$t('message.download')}}</router-link>
          </li>
          <li>
            <router-link to="help">{{$t('message.help')}}</router-link>
          </li>
          <!-- <li>
            <a href="javscript:;">Recharge</a>
          </li> -->
        </ul>
        <div class="scan"><img src="@/assets/img/download/qr-code.png" alt=""></div>
        <ul class="contact-info">
          <li>
            <span class="icon-line"><img src="@/assets/img/sponsoredLink/icon_Line@3x.png" alt=""></span>
            <span class="text">Line ID : <a href="line://ti/p/%40glk4347i">@kingslot9</a></span>
          </li>
          <li>
            <span class="icon-facebook"><img src="@/assets/img/sponsoredLink/icon_Facebook@3x.png" alt=""></span>
            <span class="text">Facebook : <a href="https://www.facebook.com/Kingslot9-418399282269037/">Kingslot9</a></span>
          </li>
          <li>
            <span class="icon-phone"><img src="@/assets/img/help/phone.png" alt=""></span>
            <span class="text">Call : 0970252570</span>
          </li>
        </ul>
        <ul class="icon-link">
          <li>{{$t('message.deposit_channel')}}</li>
          <li class="icon">
            <span><img src="@/assets/img/home/deposit-1.png" alt=""></span>
            <span><img src="@/assets/img/home/deposit-2.png" alt=""></span>
            <span><img src="@/assets/img/home/deposit-3.png" alt=""></span>
            <span><img src="@/assets/img/home/deposit-4.png" alt=""></span>
          </li>
          <!-- <li>Help</li>
          <li class="icon">
            <span><img src="@/assets/img/home/line-logo.png" alt=""></span><span><img src="@/assets/img/home/facebook-logo.png" alt=""></span>
          </li> -->
          <li>{{$t('message.system_certification')}}</li>
          <li class="icon">
            <span><img src="@/assets/img/home/android-logo.png" alt=""></span><span><img src="@/assets/img/home/ios-logo.png" alt=""></span>
          </li>
        </ul>
        <p class="compony">©Copyright 2019 King lotto reserves all rights</p>
      </div>
    </div>
  </div>
</template>
<script>
// sponsoredLink
export default {
  name: 'myFooter',
  components: {},
  props: {},
  data() {
    return {
      msg: 'footer'
    }
  },
  beforeDestroy() {},
  destroyed() {},
  computed: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.footer-wrap{
  width:100%;
  height:100%;
  position: relative;
  .footer-bg{
    width:100%;
    height:192px;
    position: absolute;
    left:0;
    top:0;
    background:url(../../assets/img/home/f-bg.png) no-repeat;
    background-size:100% 100%;
  }
}
.footer-content{
  min-width:1100px;
  height:100%;
  padding-top:60px;
  position: relative;
  margin:0 auto;
  display:table;
  .footer-icon{
    width:100px;
    height:112px;
    float:left;
    background:url(../../assets/img/home/f-logo.png) no-repeat;
    background-size:100% 100%;
    margin-right:65px;
  }
  .desc-link{
    float:left;
    margin-right:77px;
    &:last-child{
      margin-right:0;
    }
    li{
      display:-webkit-box;
      -webkit-box-pack:justify;
      margin-bottom:30px;
      &:last-child{
        margin-bottom:0;
      }
      a{
        display:block;
        font-size:14px;
        color: #F2B672;
      }
    }
  }
  .icon-link{
    float: left;
    // margin-left:52px;
    margin-left:60px;
    color: #9C9EA2;
    font-size:14px;
    li{
      margin-bottom:10px;
      text-align:left;
    }
    li.icon{
      margin-bottom:20px;
      display:-webkit-box;
      span{
        display:block;
        width:40px;
        height:40px;
        // background: #F2B672;
        margin-right:10px;
        &:last-child{
          margin-bottom:0;
        }
      }
    }
    &:last-child{
      margin-bottom:0;
    }
  }
  .scan{
    width:120px;
    height:120px;
    float: left;
    // margin-left:60px;
  }
  .contact-info{
    float: left;
    margin-left:20px;
    li{
      display:-webkit-box;
      -webkit-box-align:center;
      -webkit-box-pack:start;
      font-size:14px;
      color: #9C9EA2;
      margin-bottom:20px;
      span{
        display:block;
      }
      // a{
      //   color:#9C9EA2;
      //   text-decoration: none;
      // }
      .icon-line{
        width:24px;
        height:22px; 
        margin-right:10px;
      }
      .icon-facebook, .icon-phone{
        width:25px;
        height:25px;
        margin-right:10px;
      }
      &:last-child{
        margin-bottom:0;
      }
      a{
        color:#9C9EA2;
        &:visited{
          color:#9C9EA2;
        }
      }
    }
  }
  p.compony{
    position: absolute;
    left:0;
    bottom:60px;
    display:block;
    width:100%;
    text-align:center;
    color: #9C9EA2;
    font-size:14px;
  }
}
</style>

