<template>
  <div id="app" class="user-common">
    <input type="text" class="display-none-input">
    <input type="password" class="display-none-input">
    <div class="show-bets-model" v-if="showModel = getModelStatus" :style="{height: setHeight()}" @click="hideLoginDialog"></div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    let locale = localStorage.getItem("dove-app-locale");
    if(!locale){
      localStorage.setItem("dove-app-locale", "th");
    }
    const vm = this;
    window.onpopstate = function(eve) {
      vm.$store.dispatch('setAlertBG', false);
      vm.$store.dispatch('setCashAccountConfirm', false);
      // window.history.pushState(null, null, '#/'+vm.$route.name);
    };
    // this.$message({
    //   message: "success",
    //   type: "success",
    //   duration: 0
    // })
  },
  computed: {
    getModelStatus() {
      return this.$store.state.alertBG
    },
  },
  watch: {
    '$route'(to, from) {
      this.$store.dispatch('setMenuStatus', false);
      if(from.name !== 'reg' && from.name !== 'login') {
        this.$store.dispatch('setFromUrl', from.name);
      }
    }
  },
  methods: {
    setHeight() {
      // console.log(document.getElementById('app').offsetHeight)
      return document.getElementById('app').offsetHeight + 'px'
    },
    hideLoginDialog() {
      // this.$store.dispatch('setAlertBG', false);
    },
  }
}
</script>

<style lang="scss">
html{
  width:100%;
  height:100%;
  background: #111111;
}
body{
  width:100%;
  height:100%;
  overflow: hidden;
  overflow-x: hidden;
  /* min-height:12.94rem; */
  /* min-height:100%; */
  /* min-height:13.34rem; */
}
*{
  margin:0;
  padding:0;
  box-sizing: border-box;
}
ul,ol,li{
  list-style:none;
}
#app {
  // font-family: 'Avenir', Helvetica, Arial, sans-serif, PingFangSC-Medium;
  font-family: PSLXDISPLAY;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width:100%;
  height:100%;
  position: relative;
  .show-bets-model {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: .5;
    background: #000000;
    z-index: 1009;
  }
}
button,input{
  font-family: PSLXDISPLAY;
}
.el-message-box{
  width:90% !important;
  max-width:400px !important;
}
.el-message{
  width:90% !important;
  min-width:0;
  top:50% !important;
  margin-top:-25%;
}
.el-message__content{
  font-size:5.33vw;
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

button,input,textarea{
  border:none;
  outline:none;
  padding:0;
  margin:0;
  display:block;
}
input::placeholder {
  
  font-size: 4vw;
  color: #ababab !important;
}

input::-webkit-input-placeholder {
  /* WebKit browsers */
  
  font-size: 4vw;
  color: #ababab !important;
}

input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  
  font-size: 4vw;
  color: #ababab !important;
}

input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  
  font-size: 4vw;
  color: #ababab !important;
}

input:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  
  font-size: 4vw;
  color: #ababab !important;
}
/* input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #ababab inset !important;
} */
img{
  display:block;
  width:100%;
}
::-webkit-scrollbar {/*隐藏滚轮*/
  display: none;
}

.el-select-dropdown{
  width:92vw !important;
  left:4vw !important;
}
.game-no-data{
  height:52.27vw;
  line-height:52.27vw;
  font-size:6vw;
  color:#fff;
  text-align:center;
}
.game-list{
  display:table;
  width:100%;
  padding:0 2vw;
  li{
    margin:2vw;
    float:left;
  }
}

.game-title{
  width:100%;
  position: relative;
  color:#f98c69;
  padding:0 4vw;
  margin-bottom:2vw;
  margin-top:6vw;
  .icon-text{
    display:-webkit-box;
    -webkit-box-align:center;
    font-size: 4.8vw;
    span{
      display:block;
    }
    .icon{
      width:8vw;
      height:8vw;
      margin-right:2.67vw;
    }
  }
  .operate-wrap{
    position: absolute;
    right:4vw;
    top:.93vw;
    display:table;
    >div.btn{
      border-radius: 5.33vw;
      color:#111111;
      width: 18.8vw;
	    height: 6.13vw;
      background-image: linear-gradient(134deg, #fadcab 0%, #d99d59 100%, #f2b672 100%);
      display: -webkit-box;
      -webkit-box-align: center;
      -webkit-box-pack: center;
      cursor: pointer;
      &:last-child{
        margin-right:0;
      }

      span {
        display: block;
        width:100%;
        height:100%;
        text-align:center;
        line-height:6.13vw;
        font-size: 4.27vw;
      }
    }
  }
}


.transfer-cash-dialog, .confirm-transfer-out{
  width: 100%;
  height: 99vw;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background: #111111;
  border-radius: .4vw;
  z-index: 1099;
  padding: 8vw 6vw;
  

  .input-outer {
    width: 100%;
  }

  .transfer-table {
    width: 100%;
    border: none;
    border-collapse: collapse;

    .tr-pt-10 {
      padding-top: 3vw;
    }

    .tr-pt-20 {
      padding-top: 4vw;
    }

    .tr-pt-30 {
      padding-top: 8vw;
    }

    tr {
      font-size: 4.27vw;
      color: #FFFFFF;
      text-align: left;
      display: block;
    }

    // input {
    //   width: 100%;
    //   height: 36px;
    //   padding: 8px 20px;
    //   border: none;
    //   background: #1F1E1F;
    //   border-radius: 4px;
    //   display: block;
    //   font-size: 16px;
    //   color:#fff;
    // }
    .btn-wrap{
      display:-webkit-box;
      -webkit-box-pack:justify;
    }

    button {
      width: 45%;
      height: 8.8vw;
      display: block;
      border: 1px solid #9C9EA2;
      color: #9C9EA2;
      background: #111;
      cursor: pointer;
    }

    .confirm-btn {
      font-size: 4.27vw;
      color: #111;
      border: none;
      // background: #F2B672;
      background-image: linear-gradient(134deg,	#fadcab 0%, #d99d59 100%, #f2b672 100%);
    }
  }
}
.confirm-transfer-out{
  width: 100%;
  height: 37vw;
  padding: 4vw 6vw;
  .transfer-table {
    tr {
      text-align: center;
      font-size:5.6vw;
    }
  }
}

.detail-dialog{
  width: 92vw;
  height: 109.6vw;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background-color: #212121;
  border-radius: 0.53vw;
  z-index: 1099;
  // box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.5);
  .title{
    width:100%;
    padding:4vw 0;
    color: #ababab;
    font-size:4.8vw;
    text-align:center;
  }
  .table-head{
    width:100%;
    display:-webkit-box;
    li{
      -webkit-box-flex:1;
      text-align:center;
      height: 9.33vw;
      line-height:9.33vw;
      font-size:4vw;
      color: #ababab;
      background:#000;
      &:last-child{
        min-width:32vw;
        max-width:32vw;
      }
    }
    li.width-120{
      min-width:32vw;
      max-width:32vw;
    }
  }
  .table-body{
    width:100%;
    li{
      width:100%;
      display:-webkit-box;
      border-bottom:1px solid #000;
      div{
        -webkit-box-flex:1;
        text-align:center;
        font-size:4vw;
        color:#fff;
        padding: 4vw 0;
        &:first-child{
          text-align:left;
          text-indent:5.33vw;
          background-color: #1a1a1a;
          color: #ababab;
        }
        &:last-child{
          min-width:32vw;
          max-width:32vw;
        }
      }
      div.width-120{
        min-width:32vw;
        max-width:32vw;
      }
    }
  }
  .table-footer{
    width:100%;
    height:16.8vw;
    display:-webkit-box;
    -webkit-box-pack:center;
    -webkit-box-align:center;
    button{
      width: 28vw;
      height: 8.8vw;
      background-image: linear-gradient(134deg, #fadcab 0%, #d99d59 100%, #f2b672 100%);
      border-radius: 4.4vw;
      font-size:4.27vw;
      color: #111111;
      cursor: pointer;
    }
  }
}
</style>

