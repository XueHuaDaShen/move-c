<template>
  <div id="app">
    <input type="text" class="display-none-input">
    <input type="password" class="display-none-input">
    <myHeader class="app-header"></myHeader>
    <router-view class="app-container" />
    <myFooter class="app-footer"></myFooter>
    <div class="show-bets-model" v-if="showModel = getModelStatus" :style="{height: setHeight()}" @click="hideLoginDialog"></div>
    <loginDialog v-if="showLoginDialog = getLoginDialogStatus" @isLogingFn="isLogingFn"></loginDialog>
    <div class="marquee-wrap" v-if="showMarquee && marqueeTxtWidth">
      <i class="close el-icon-close" @click="showMarquee=false"></i>
      <marquee truespeed scrolldelay="30" scrollamount="2" direction=left>
        <div id="marquee-content" :style="mrqStyle" v-html="marqueeTxt"></div>
      </marquee>
    </div>
    <div v-if="!marqueeTxtWidth" id="get-marquee-text-width-display-none" v-html="marqueeTxt"></div>
  </div>
</template>

<script>
  import myHeader from './components/public/header';
  import myFooter from './components/public/footer';
  import loginDialog from './components/public/loginDialog';
  export default {
    name: 'App',
    components: {
      myHeader,
      myFooter,
      loginDialog
    },
    created() {
      // let pro_or_test = this.$store.state.pro_or_test;
      let locale = localStorage.getItem("dove-web-locale");
      if(!locale){
        localStorage.setItem("dove-web-locale", "th");
      }
      // if (pro_or_test) {
      //   let port = location.port;
      //   let host = location.host;
      //   // console.log(location)
      //   if (port) {
      //     if (port == "3020") {
      //       this.$i18n.locale = "en";
      //       localStorage.setItem("dove-web-locale", "en");
      //     } else {
      //       this.$i18n.locale = "th";
      //       localStorage.setItem("dove-web-locale", "th");
      //     }
      //   } else {
      //     if (host == "en.kinglotto9.com") {
      //       this.$i18n.locale = "en";
      //       localStorage.setItem("dove-web-locale", "en");
      //     } else {
      //       this.$i18n.locale = "th";
      //       localStorage.setItem("dove-web-locale", "th");
      //     }
      //   }
      // } else {
      //   this.$i18n.locale = "en";
      //   localStorage.setItem("dove-web-locale", "en");
      // }
      this.getmarqueeTxt()
    },
    data() {
      return {
        isLoging: false,
        showModel: false,
        showLoginDialog: false,
        marqueeTxt: '',
        marqueeTxtWidth: 0,
        marqueeTxtClass: 'per-set-mrq-class',
        showMarquee: true,
        mrqStyle: {}
      }
    },
    computed: {
      getModelStatus() {
        return this.$store.state.alertBG
      },
      getLoginDialogStatus() {
        return this.$store.state.showLoginDialog
      },
    },
    methods: {
      //是否正在登陆
      isLogingFn(val) {
        this.isLoging = val;
      },
      setHeight() {
        // console.log(document.getElementById('app').offsetHeight)
        return document.getElementById('app').offsetHeight + 'px'
      },
      hideLoginDialog() {
        if(this.isLoging)return;
        this.$store.dispatch('setShowLoginDialog', false);
      },
      getmarqueeTxt() {
        this.$http.get('/notice/list', {
          params: {
            pageNum: 1,
            pageSize: 10,
            enabled: 1,
          }
        }).then(res => {
          let code = res.body.returncode;
          if (code == 200) {
            // location.href = res.data.url;
            let html = '';
            let data = res.body.data.data;
            // let space = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            for(let i in data){
              // html += (data[i].content + (i==(data.length-1)?'':space));
              html += '<div class="'+this.marqueeTxtClass+'">'+data[i].content+'</div>';
            }
            this.marqueeTxt = html;
            this.$nextTick(() => {
              this.getMarqueeHtmlWidth();
            })
          }else if (code == 103 || code == 106 || code == 101) {
            this.$store.state.logout(this);
          }
        }).then(err => {})
      },
      getMarqueeHtmlWidth() {
        let marginRight = 62;
        let width = 0;
        let noneMarquee = document.getElementById('get-marquee-text-width-display-none');
        let ele = noneMarquee.getElementsByClassName(this.marqueeTxtClass);
        let len = ele.length;
        for(let i=0; i<len; i++){
          let mr = i === (len-1) ? 0 : marginRight
          let w = (ele[i].clientWidth||0) + mr;
          width += w
        }
        this.marqueeTxtWidth = width;
        var myBrowser = function() {
          var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
          var isOpera = userAgent.indexOf("Opera") > -1;
          if (isOpera) {
            return "Opera"
          }; //判断是否Opera浏览器
          if (userAgent.indexOf("Firefox") > -1) {
            return "FF";
          } //判断是否Firefox浏览器
          if (userAgent.indexOf("Chrome") > -1){
            return "Chrome";
          }
          if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
          } //判断是否Safari浏览器
          if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
          }
        }
        var mb = myBrowser();
        if ("FF" == mb) {
          this.mrqStyle = {
            width: 'auto'
          }
        } else {
          this.mrqStyle = {
            width: this.marqueeTxtWidth + 'px'
          }
        }
      }
    },
    watch: {
      '$route'(to, from) {
        if (to.name == 'index') {
          this.showMarquee = true;
        } else {
          this.showMarquee = false;
        }
        // 处理路由跳转，login弹框依然存在的问题
        const loginUrlArr = ['deposit', 'withdrawal', 'sponsoredLinks', 'rechargeRecord', 'withdrawalsRecord',
          'gameRecord', 'personalInformation', 'changePassword'
        ]
        document.documentElement.scrollTop = 0;
        if (to.name) {
          if (!this.$store.state.isLogin) {
            if (loginUrlArr.indexOf(to.name) > -1) {
              this.$store.dispatch('setAlertBG', true);
              this.$store.dispatch('setShowLoginDialog', true);
            } else {
              this.$store.dispatch('setAlertBG', false);
              this.$store.dispatch('setShowLoginDialog', false);
            }
          } else {
            this.$store.dispatch('setAlertBG', false);
            this.$store.dispatch('setShowLoginDialog', false);
          }
        }
      },
      getLoginDialogStatus() {
        if(!this.getLoginDialogStatus){
          this.$store.dispatch('setAlertBG', false);
        }
      }
    },
    mounted() {}
  }

</script>

<style lang="scss">
  // @font-face {
  //   font-family: 'PSLXDISPLAY';
  //   src: url('../static/fonts/PSLXDISPLAY_BOLD.TTF');
  //   font-weight: normal;
  //   font-style: normal;
  // }
  #app {
    // font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-family: PSLXDISPLAY;
    
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    min-width: 1200px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    position: relative;
    button,input{
      font-family: PSLXDISPLAY;
    }
    .marquee-wrap {
      z-index: 999;
      height: 50px;
      background-color: #eff50a;
      bottom: 0;
      position: fixed;
      font-size: 20px;
      padding: 15px;
      color: #000000;
      width: 100%;
      font-weight: bold;

      .close {
        position: absolute;
        right: 10px;
        top: 5px;
        cursor: pointer;
      }

      #marquee-content {
        text-align: initial;
        white-space: nowrap;
        // float:left;
        // margin-right:30%;
        // display:-webkit-box;
        display:table;
        >div{
          float: left;
          margin-right:60px;
          &:last-child{
            margin-right:0;
          }
        }
      }
    }
    #get-marquee-text-width-display-none{
      position: absolute;
      left:0;
      top:0;
      z-index:-9999;
      opacity: 0;
      height:0;
      white-space: nowrap;
      display:table;
      font-size: 20px;
      font-weight: bold;
      >div{
        float: left;
        height:0px;
      }
    }
    .app-header {
      width: 100%;
      height: 60px;
      display: table;
      background: #0E0E0E;
      color: #fff;
      min-width: 1100px;
      position: fixed;
      z-index:999;
      box-shadow: 0px 2px 4px 0px #000000;
    }

    .app-container {
      display: block;
      min-width: 1100px;
      padding-top:60px;
    }

    .app-footer {
      display: block;
      width: 100%;
      min-width: 1100px;
      height: 420px;
      background: #111110;
      font-size: 12px;
      color: #FFFFFF;
      letter-spacing: 1.56px;
      text-align: center;
      color: #2c3e50;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      position: relative;
    }

    .show-bets-model {
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: .5;
      background: #000000;
      z-index: 1009;
    }

    input::placeholder {
      color: #686868;
    }

    input::-moz-placeholder {
      color: #686868;
    }

    input::-webkit-input-placeholder {
      color: #686868;
    }

    .display-none-input {
      position: absolute;
      left: 0;
      top: 0;
      z-index: -5;
      width: 1px;
      height: 1px;
      opacity: 0;
    }

    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px #ababab inset !important;
    }
    .game-no-data{
      height:368px;
      line-height:368px;
      font-size:22px;
      color:#fff;
      text-align:center;
    }
    .game-list {

      li {
        margin-bottom: 20px;
        width:auto;
        display:table;
        &:last-child{
          margin-bottom:0;
        }
        &:hover{
          .game-item{
            transform: translateX(-20px);
            &:hover{
              transform: scale(1.15);
            }
            &:hover~.game-item{
              transform: translateX(20px);
            }
          }
        }
        .game-item{
          box-shadow: 0px 2px 30px 0px rgba(0,0,0,.2);
          float: left;
          padding-right:28px;
          transition: transform .18182s ease;
          cursor: pointer;
          &:last-child {
            padding-right: 0;
          }
        }
      }
    }
    .game-title{
      width:100%;
      position: relative;
      color:#f98c69;
      .icon-text{
        display:-webkit-box;
        -webkit-box-align:center;
        font-size: 22px;
        span{
          display:block;
        }
        .icon{
          width:40px;
          height:40px;
          margin-right:10px;
        }
      }
      .operate-wrap{
        position: absolute;
        right:0;
        top:0;
        display:table;
        >div.btn{
          margin-right:30px;
          border-radius: 20px;
          border: solid 1px #333333;
          display: -webkit-box;
          -webkit-box-align: center;
          -webkit-box-pack: center;
          cursor: pointer;
          &:hover{
            background:#1F1E1F;
          }
          &:last-child{
            margin-right:0;
          }

          span {
            display: block;
            font-size: 16px;
          }
        }
      }
    }
    
  }

  .el-loading-spinner .path{
    stroke: #c83a4c !important;
  }
</style>
