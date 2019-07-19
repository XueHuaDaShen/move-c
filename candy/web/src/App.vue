<template>
  <div id="app">
    <input type="text" class="display-none-input">
    <input type="password" class="display-none-input">
    <myHeader class="app-header" id="app-header"></myHeader>
    <div id="scorll-content">
      <router-view class="app-container" />
      <myFooter class="app-footer"></myFooter>
    </div>
    <div class="show-bets-model" v-if="getModelStatus" :style="{height: modelHeight}"></div>
  </div>
</template>

<script>
  import myHeader from './components/public/header';
  import myFooter from './components/public/footer';
  export default {
    name: 'App',
    components: {
      myHeader,
      myFooter
    },
    created() {
      let isBuild = this.$store.state.isBuild;
      if(isBuild){
        let port = location.port;
        let host = location.host;
        // console.log(location)
        if(port){
          if(port == "4040"){
            this.$i18n.locale = "zh";
            localStorage.setItem("candy-locale", "zh");
          }else{
            this.$i18n.locale = "th";
            localStorage.setItem("candy-locale", "th");
          }
        }else{
          if(host == "zh.kinglotto9.com"){
            this.$i18n.locale = "zh";
            localStorage.setItem("candy-locale", "zh");
          }else{
            this.$i18n.locale = "th";
            localStorage.setItem("candy-locale", "th");
          }
        }
      }else{
        this.$i18n.locale = "zh";
        localStorage.setItem("candy-locale", "zh");
      }
      // console.log(isBuild)
    },
    data() {
      return {
        showModel: false,
        modelHeight: 0,
        contentHeight: 0,
      }
    },
    computed: {
      getModelStatus() {
        this.setHeight();
        return this.$store.state.betModel
      }
    },
    methods: {
      setHeight() {
        // console.log(document.getElementById('app').offsetHeight)
        this.modelHeight = document.getElementById('app').offsetHeight +'px'
      },
      setContentPd() {
        this.contentHeight = 0;
        try{
          let headHeight = document.getElementById('app-header').offsetHeight;
          this.contentHeight = headHeight;
        }catch(e){}
      }
    },
    watch: {
      '$route' () {
        const vm = this;
        this.$store.dispatch('setBetModel', false);
        let scorllContent = document.getElementById('scorll-content');
        scorllContent.scrollTop = 0;
        // window.onload = function(){vm.setContentPd();}
      }
    },
    mounted() {
      const vm = this;
      // window.onload = function(){vm.setContentPd();}
      window.onresize = function() {
        vm.setHeight();
      }
    }
  }

</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // margin-top: 60px;
  width:100%;
  height:100%;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  position: relative;
  
  .alert-confirm-bets-wrap {
    padding: 20px 0 30px 0;
    width: 520px;
    min-height: 200px;
    position: fixed;
    z-index: 999999;
    margin: auto;
    background: #FFFFFF;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);

    .bets-title {
      font-size: 26px;
      color: #EB5228;
      display: -webkit-box;
      -webkit-box-align: center;
      -webkit-box-pack: center;

      span {
        display: block;
      }

      img {
        width: 28px;
        height: 28px;
        margin-right: 5px;
      }
    }
    .error-num-list{
      width:100%;
      max-height:500px;
      overflow:scroll;
      li{
        width:100%;
        padding:0 20%;
        display:-webkit-box;
        span{
          width:33.33%;
          padding:5px;
          display:block;
          text-align:right;
          &:first-child{
            text-align:left;
          }
        }
      }
    }

    .lottery-name {
      font-size: 16px;
      color: #191919;
      margin-top: 10px;
      margin-bottom: 20px;
    }

    .confirm-bets-list {
      width: 100%;
      li {
        width: 100%;
        // display: -webkit-box;
        // -webkit-box-pack: justify;
        font-size: 14px;
        color: #191919;
        // padding-left: 30px;
        padding-left:0;
        padding-right: 20px;
        margin-top: 10px;
        display:table;

        strong,
        span {
          display: block;
        }
        .nums{
          // -webkit-box-flex:1;
          text-align:center;
          float:left;
          width:70px;
        }
        .price{
          width:50px;
          float:right;
        }
        .discount{
          width:70px;
          float:right;
        }
        .xu_hao{
          width:70px;
          float:left;
        }
      }

      .confirm-bets-title {
        padding: 10px 20px 10px 0;
        background: #EDEDED;
        margin-top: 20px;
      }
    }
    .bets-all-money {
      width: 100%;
      padding: 0 20px;
      font-size: 16px;
      color: #EB5228;
      margin:10px 0;
      text-align: right;
    }

    .confirm-wrap {
      display: -webkit-box;
      -webkit-box-pack: center;
      margin-top: 30px;

      button {
        width: 145px;
        height: 44px;
        font-size: 14px;
        cursor: pointer;
        color: #FFFFFF;
      }

      .confirm-btn {
        background-image: linear-gradient(-180deg, #EB5228 0%, #C14726 100%);
        margin-right: 60px;
      }

      .cancel-btn {
        background-image: linear-gradient(-180deg, #AFAFAF 0%, #777777 100%);
      }
    }
  }
  @media screen and (max-width: 720px) {
    .alert-confirm-bets-wrap {
      padding: 20px 0 30px 0;
      width: 90%;
      min-height: 200px;
      position: fixed;
      z-index: 999999;
      margin: auto;
      background: #FFFFFF;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);
      left:5% !important;

      .bets-title {
        font-size: 26px;
        color: #EB5228;
      }

      .lottery-name {
        font-size: 16px;
        color: #191919;
        margin-top: 10px;
        margin-bottom: 20px;
      }

      .confirm-bets-list {
        width: 100%;

        li {
          width: 100%;
          display: -webkit-box;
          -webkit-box-pack: justify;
          font-size: 14px;
          color: #191919;
          padding-left: 30px;
          padding-right: 20px;
          margin-top: 10px;
          display:table;

          strong,
          span {
            display: block;
          }
        }

        .confirm-bets-title {
          padding: 10px 20px 10px 30px;
          background: #EDEDED;
          margin-top: 20px;
        }
      }

      .confirm-wrap {
        display: -webkit-box;
        -webkit-box-pack: center;
        margin-top: 30px;

        button {
          width: 145px;
          height: 44px;
          font-size: 14px;
          cursor: pointer;
          color: #FFFFFF;
        }

        .confirm-btn {
          background-image: linear-gradient(-180deg, #EB5228 0%, #C14726 100%);
          margin-right: 0;
        }

        .cancel-btn {
          background-image: linear-gradient(-180deg, #AFAFAF 0%, #777777 100%);
        }
      }
    }
  }
  .border-bottom-bj{
    height:17px;
  }
  .app-header{
    width:100%;
    display:table;
    // display:-webkit-box;
    // -webkit-box-align:center;
    // -webkit-box-pack:justify;
    background: #000000;
    position: relative;
    z-index:99;
  }
  #scorll-content{
    -webkit-box-flex:1;
    width:100%;
    display: -webkit-box;
    -webkit-box-orient:vertical;
    // overflow: scroll;
    -webkit-box-flex:1;
    overflow-y:auto;
    -webkit-overflow-scrolling: touch;
  }
  .app-container{
    // -webkit-box-flex:1;
    display:block;
    min-height:835px;
    background:#efefef;
  }
  .app-footer{
    display:block;
    width:100%;
    // height:100px;
    line-height:100px;
    background:#000;
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: 1.56px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
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
  .show-bets-model{
    width:100%;
    position: absolute;
    left:0;
    top:0;
    opacity:.5;
    background: #000000;
    z-index:99999;
  }
  .split-line{
    width:100%;
    height:1px;
    background: #D0D0D0;
  }
}
.display-none-input{
  position: absolute;
  left:0;
  top:0;
  z-index:-5;
  width:1px;
  height:1px;
  opacity: 0;
}
// @media screen and (max-width: 888px){
//   #app{
//     .app-header{
//       // padding:10px 2%;
//     }
//   }
// }
</style>
