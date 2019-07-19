<template>
  <div class="loginDialog" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="login-icon"><img src="@/assets/img/home/h-logo.png" alt=""></div>
    <table class="login-table">
      <tr><span>{{$t('message.login_and_registered.username')}}</span></tr>
      <tr class="tr-pt-10">
        <div><input type="text" v-model="loginname" @blur="handleInputedLoginname"></div>
        <!-- <div><input type="text" v-model="loginname" :placeholder="$t('message.login_and_registered.username')"></div> -->
      </tr>
      <tr class="tr-pt-20"><span>{{$t('message.login_and_registered.password')}}</span></tr>
      <tr class="tr-pt-10">
        <div><input type="password" v-model="password"></div>
        <!-- <div><input type="password" v-model="password" :placeholder="$t('message.login_and_registered.password')"></div> -->
      </tr>
      <tr class="tr-pt-20"><span>{{$t('message.login_and_registered.verification_code')}}</span></tr>
      <tr class="tr-pt-10">
        <div class="code-div"><input type="text" v-model="code" class="code-input"><span class="code" @click="getCodeFn" v-html="captcha"></span></div>
        <!-- <div class="code-div"><input type="text" v-model="code" :placeholder="$t('message.login_and_registered.verification_code')" class="code-input"><span class="code" @click="getCodeFn" v-html="captcha"></span></div> -->
      </tr>
      <tr class="tr-pt-20">
        <div class="habit">
          <label for="box" class="rem-label">
            <input type="checkbox" class="remember" id="box" :checked="isMomery" v-model="isMomery">
            <em class="copy_checkbox"></em>
            <span>{{$t("message.login_and_registered.momery")}}</span>
          </label>
        </div>
      </tr>
      <tr class="tr-pt-30">
        <div><button class="login-btn" @click="logFn" :disabled="isClick">{{$t('message.log_in')}}</button></div>
      </tr>
      <!-- <tr class="tr-pt-20"><div><button>Retrieve password</button></div></tr> -->
    </table>
  </div>
</template>
<script>
import paramCryptFn from '@/assets/js/cryptData'
import MD5 from "MD5";
export default {
  name: 'loginDialog',
  data() {
    return {
      enabled_jiami_ceshi: true, // 是否开启 记住密码
      msg: 'nihao',
      loading: false,
      isClick: false, // 防止多次提交
      duration: 1500,
      guid: '',
      captcha: '',
      loginname: '',
      password: '',
      code: '',
      isMomeryed: false,
      isMomery: true,
      momery_username: '',
      momery_pwd: '',
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {
    this.captcha = '';
    this.getCodeFn();
    this.handleKeyup();

    let user = localStorage.getItem('momery_username');
    if (this.enabled_jiami_ceshi) {
      if (user) {
        this.momery_username = user;
        let pwd = localStorage.getItem(user) || CryptoJS.MD5('').toString();
        if (pwd !== CryptoJS.MD5('').toString()) {
          // console.log(1)
          this.momery_pwd = pwd;
          this.isMomeryed = true;
        } else {
          this.momery_pwd = '';
          this.isMomeryed = false;
        }
      } else {
        this.momery_username = '';
      }
    } else {
      if (user) {
        this.momery_username = user;
        let pwd = localStorage.getItem(user);
        if (pwd) {
          this.momery_pwd = pwd;
        } else {
          this.momery_pwd = '';
        }
      } else {
        this.momery_username = '';
      }
    }
    this.loginname = this.momery_username;
    this.password = this.momery_pwd;
  },
  beforeMount() {},
  mounted() {},
  watch: {
    password(n, o) {
      if (this.password !== localStorage.getItem(this.loginname)) {
        this.isMomeryed = false;
        // console.log(2)
      }
    }
  },
  methods: {

    // 生成 UUID
    getGuid() {
      // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      })
    },
    handleInputedLoginname() {
      if (this.enabled_jiami_ceshi) {
        let pwd = localStorage.getItem(this.loginname) || CryptoJS.MD5('').toString();
        if (pwd !== CryptoJS.MD5('').toString()) {
          // console.log(1)
          this.momery_pwd = pwd;
          this.isMomeryed = true;
        } else {
          this.momery_pwd = '';
          this.isMomeryed = false;
        }
        this.password = this.momery_pwd;
      } else {
        let pwd = localStorage.getItem(this.loginname);
        if (pwd) {
          // console.log(1)
          this.momery_pwd = pwd;
        } else {
          this.momery_pwd = '';
        }
        this.password = this.momery_pwd;
      }
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
    handleKeyup() {
      const vm = this;
      document.onkeyup = function (e) {
        // console.log(e.keyCode)
        if (vm.isClick) {
          return false;
        }
        if (e.keyCode == 13) {
          vm.logFn();
        }
      }
    },
    logFn() {
      const vm = this;
      if (!this.loginname || !this.password || !this.code) {
        return false
      }
      this.$emit("isLogingFn", true);
      this.isClick = true;
      this.loading = true;
      this.$http.post('/user/random', {
        loginname: this.loginname
      }, {
        emulateJSON: true
      }).then(res => {
        let data = res.data;
        vm.$emit("isLogingFn", true);
        if (data.returncode == 200) {
          let random = data.data.random;
          // console.log(res)
          let new_password = '';
          if (vm.isMomeryed && vm.enabled_jiami_ceshi) {
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
          let url = '/user/login' + vm.$store.state.getUrlParamFn();
          this.$http.post(url, paramCryptFn(param), {
            emulateJSON: true
          }).then(res => {
            let code = res.data.returncode;
            let data = res.data.data;
            this.isClick = false;
            this.loading = false;
            if (code == 200) {
              localStorage.setItem('dove-web-login', 'true');
              localStorage.setItem('dove-web-cash', data.cash);
              localStorage.setItem('dove-web-loginname', data.loginname);
              localStorage.setItem('dove-web-token', data.token);
              localStorage.setItem('dove-web-loginid', data._id);
              localStorage.setItem('dove-web-type', data.type);
              this.$store.dispatch('setLoginStauts', true);
              this.$store.dispatch('setAlertBG', false);
              this.$store.dispatch('setShowLoginDialog', false);
              this.$store.dispatch('setCash', data.cash);
              this.$store.dispatch('setDoveName', data.loginname);
              if (vm.isMomery) {
                localStorage.setItem('momery_username', vm.loginname);
                if (vm.enabled_jiami_ceshi) {
                  if (vm.isMomeryed) {
                    localStorage.setItem(vm.loginname, vm.password);
                  } else {
                    localStorage.setItem(vm.loginname, CryptoJS.MD5(vm.password).toString());
                  }
                } else {
                  localStorage.setItem(vm.loginname, vm.password);
                }
              } else {
                if(localStorage.getItem('momery_username') === vm.loginname){
                  localStorage.setItem('momery_username', vm.loginname);
                  localStorage.removeItem(vm.loginname);
                }
              }
              this.getChannel();
            } else if (code == '304') {
              this.$store.state.message(this.$t("message.login_and_registered.error_tip.user_not_exist"),
                'error', this.duration, this);
            } else if (code == '305') {
              this.$store.state.message(this.$t("message.login_and_registered.error_tip.password_error"),
                'error', this.duration, this);
            } else if (code == '302') {
              this.$store.state.message(this.$t("message.login_and_registered.error_tip.code_error"), 'error',
                this.duration, this);
                this.getCodeFn();
            } else if (code == '307') {
              this.$store.state.message(this.$t("message.login_and_registered.error_tip.code_expired"),
                'error', this.duration, this);
                this.getCodeFn();
            } else if (code == '306') {
              this.$store.state.message(this.$t("message.login_and_registered.error_tip.account_disabled"),
                'error', this.duration, this);
            } else if (code == '301') {
              this.$store.state.message(this.$t("message.login_and_registered.error_tip.server_error"),
                'error', this.duration, this);
            }
          }).then(error => {})
        } else {
          this.isClick = false;
          this.loading = false;
          this.$store.state.message(this.$t("message.login_and_registered.error_tip.submit_failure"), 'error',
            this.duration, this);
        }
        // this.consoleFn(res)
      }).then(error => {
        // console.log(error)
        if (error) {
          vm.$emit("isLogingFn", true);
          this.isClick = false;
          this.loading = false;
          this.$store.state.message(this.$t("message.login_and_registered.error_tip.submit_failure"), 'error',
            this.duration, this);
        }
        // this.consoleFn(error)
      })
    },
    // 获取充值/提现的通道
    getChannel() {
      const url = '/bank/channel/list';
      const vm = this;
      vm.$http.get(url, {}).then(res => {
        let code = res.body.returncode;
        if(code == 200){
          this.setPersonalUrl(res.body.data);
        }else{
          this.setPersonalUrl();
        }
      }, error => {
        console.log('error', error);
      });
    },
    // 判断开启的通道，设置url
    setPersonalUrl(data=[]) {
      if(data.length && data.length !== 3){
        this.$store.dispatch('setChannelTabs', data);
        localStorage.setItem('web-channel-tabs', data);
      }else{
        this.$store.dispatch('setChannelTabs', ['king', 'paysec', 'paytrust']);
        localStorage.setItem('web-channel-tabs', ['king', 'paysec', 'paytrust']);
      }
    },
  }
}

</script>
<style lang="scss" scoped>
  .loginDialog {
    width: 400px;
    height: 423px;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: #111111;
    border-radius: 4px;
    z-index: 2001;
    padding: 60px 50px 30px 50px;
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.5);

    .login-icon {
      width: 66px;
      height: 66px;
      position: absolute;
      left: 50%;
      margin-left: -33px;
      top: -23px;
    }

    .login-table {
      width: 100%;
      border: none;
      border-collapse: collapse;

      .tr-pt-10 {
        padding-top: 10px;
      }

      .tr-pt-20 {
        padding-top: 20px;
      }

      .tr-pt-30 {
        padding-top: 30px;
      }

      tr {
        font-size: 14px;
        color: #FFFFFF;
        text-align: left;
        display: block;
      }

      input {
        width: 100%;
        height: 36px;
        padding: 8px 20px;
        border: none;
        background: #fff;
        border-radius: 4px;
        display: block;
        font-size: 16px;
      }

      .code-div {
        position: relative;

        .code-input {
          width: 192px;
        }

        .code {
          position: absolute;
          top: -9px;
          left: 180px;
          display: block;
          transform: scale(.6);
          background: #fff;
        }
      }

      button {
        width: 100%;
        height: 40px;
        display: block;
        border: 1px solid #9C9EA2;
        border-radius: 20px;
        color: #9C9EA2;
        background: #111;
        cursor: pointer;
      }

      .login-btn {
        font-size: 16px;
        color: #111;
        border: none;
        // background: #F2B672;
        background-image: linear-gradient(134deg,	#fadcab 0%, #d99d59 100%, #f2b672 100%);
      }
      .habit {
        width: 100%;
        display: -webkit-box;
        -webkit-box-pack: justify;
        -webkit-box-align: center;
        font-size: 14px;
        color:#ababab;
        border:none;

        .rem-label {
          width:100%;
          position: relative;
          display: -webkit-box;
          -webkit-box-align: center;
          span{
            position:inherit !important;
            bottom:0;
          }
          .remember {
            width: 17px;
            height: 17px;
            display: block;
            background: none;
            border: none;
            outline: none;
            position: relative;
            z-index: 3;
            opacity: 0;
          }

          input[type='checkbox']:checked+em.copy_checkbox {
            background: url(../../assets/img/login/check-box-ed.png) no-repeat;
            background-size: 100% 100%;
          }

          .copy_checkbox {
            position: absolute;
            left: 0;
            top: -1px;
            width: 17px;
            height: 17px;
            background: url(../../assets/img/login/check-box.png) no-repeat;
            background-size: 100% 100%;
            z-index: 2;
          }

          span {
            display: block;
            margin-left:10px;
          }

          a.lose {
            color: #C83C4A;
            text-decoration: underline;
          }
        }
      }
    }
  }

</style>
