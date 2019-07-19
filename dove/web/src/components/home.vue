<template>
  <div class="home">
    <div class="login-wrap">
      <div class="loginname-div">用户名：<input type="text" v-model="loginname"></div>
      <div class="password-div">密码：<input type="password" v-model="password"></div>
      <div class="captcha-div">验证码：<input type="text" v-model="code"><span class="captcha" v-html="captcha" @click="getCodeFn"></span></div>
      <div class="log-or-reg"><span @click="logFn">登录</span><span @click="checkLoginname">注册</span></div>
    </div>
    <ul class="gamelist-wrap">
      <li v-for="(item, k) in gamelist" :key="k" @click="loginGame(item.GameId)">
        <div class="game-img"><img :src="item.ImageUrl" alt=""></div>
        <div class="game-icon"><img :src="item.OtherImageUrl" alt=""></div>
        <p class="game-name">{{item.JackpotName}}</p>
        <p class="game-lines">{{item.Method}}</p>
      </li>
    </ul>
  </div>
</template>
<script>
import paramCryptFn from '@/assets/js/cryptData'
import MD5 from "MD5";
export default {
  name: 'home',
  data() {
    return {
      msg: 'nihao',
      loginname: 'dove_ceshi5',
      password: '123qweasd',
      captcha: '',
      code: '',
      guid: '',
      isMomeryed: false,
      gamelist: []
    }
  },
  beforeDestroy() {},
  destroyed() {},
  created() {
    this.getGameList();
    this.getCodeFn();
  },
  mounted() {},
  watch: {},
  methods: {
    // 游戏列表
    getGameList() {
      this.$http.get('/gss/game/list', {}).then(res => {
        this.gamelist = res.data.data;
      }).then(err => {})
    },
    // jackpot列表
    getJackpotList() {
      this.$http.get('/gss/jackpot/list', {}).then(res => {
        // console.log(res)
      }).then(err => {})
    },
    
    // 生成 UUID
    getGuid() {
      // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      })
    },
    getCodeFn() {
      this.guid = this.getGuid();
      this.$http.get('/user/captcha', {
        params: {
          id: this.guid
        }
      }).then(function (res) {
        this.captcha = res.data;
        // console.log(res)
      }).then(function (error) {
        // console.log(error)
      })
    },
    logFn() {
      const vm = this;
      this.$http.post('/user/random', {
        loginname: this.loginname
      }, {
        emulateJSON: true
      }).then(res => {
        let data = res.data;
        if (data.returncode == 200) {
          let random = data.data.random;
          // console.log(res)
          let new_password = '';
          if (vm.isMomeryed) {
            new_password = CryptoJS.HmacMD5(vm.password, random).toString()
          } else {
            new_password = CryptoJS.HmacMD5(CryptoJS.MD5(vm.password).toString(), random).toString()
          }
          var param = {
            loginname: this.loginname,
            password: new_password,
            captcha: this.code,
            id: this.guid
          };
          // console.log(paramCryptFn(param))
          this.$http.post('/user/login', paramCryptFn(param), {
            emulateJSON: true
          }).then(res => {
            let code = res.data.returncode;
            // console.log(res)
          }).then(error => {
          })
        }
        // this.consoleFn(res)
      }).then(error => {
        // this.consoleFn(error)
      })
    },
    regFn() {
      this.$http.post('/user/register', paramCryptFn({
        loginname: this.loginname,
        password: MD5(this.password),
        captcha: this.code,
        id: this.guid
      }), {
        emulateJSON: true
      }).then(res => {
        // console.log(res)
        let code = res.data.returncode;
        if(code == 302 || code == 303){
          this.getCodeFn();
        }
      }).then(err => {})
    },
    checkLoginname() {
      this.$http.post('/user/check', {
        loginname: this.loginname
      }, {
        emulateJSON: true
      }).then(function (res) {
        // console.log(res)
        if(res.data.returncode == 200){
          // 用户名可用
          this.regFn();
        }
      }).then(function (error) {
        // console.log(error)
      })
    },
    loginGame(gameid) {
      this.$http.post('/gss/login', {
        loginname: this.loginname,
        gameid: gameid,
      }, {
        emulateJSON: true
      }).then(res => {
        let code = res.data.returncode;
        if(code == 200){
          // location.href = res.data.url;
          window.open(res.data.data.url)
        }
      }).then(err => {})
    },
  }
}
</script>
<style lang="scss" scoped>
.login-wrap{
  padding:10px;
  width:500px;
  margin:30px auto;
  box-shadow: 1px 1px 1px 1px #000;
  background:#fff;
  color:#111;
  font-size:14px;
  >div{
    padding:10px 5px;
    position: relative;
  }
  .captcha{
    position: absolute;
    right:0;
    top:-20%;
    transform: scale(.7);
    cursor: pointer;
  }
  .log-or-reg{
    display:-webkit-box;
    -webkit-box-pack:center;
    span{
      display:block;
      padding:5px 7px;
      border:1px solid #ccc;
      cursor: pointer;
      margin:0 5px;
    }
  }
}
.gamelist-wrap{
  list-style: none;
  padding:10px;
  width:1000px;
  margin:30px auto;
  box-shadow: 1px 1px 1px 1px #000;
  background:#fff;
  color:#111;
  font-size:14px;
  display:table;
  li{
    width:110px;
    float:left;
    margin:5px;
    cursor: pointer;
  }
  img{
    width:100%;
  }
  .game-icon{
    img{
      width:30px;
    }
  }
}
</style>


