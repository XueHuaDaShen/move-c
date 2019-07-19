<template>
  <div class="loginDialog" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="login-icon"><img src="@/assets/img/home/h-logo.png" alt=""></div>
    <table class="login-table">
      <tr><span>{{$t('message.login_and_registered.username')}}</span></tr>
      <tr class="tr-pt-10">
        <div><input type="text" v-model="loginname"></div>
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
        msg: 'nihao',
        loading: false,
        isMomeryed: false,
        isClick: false, // 防止多次提交
        duration: 1500,
        guid: '',
        captcha: '',
        loginname: '',
        password: '',
        code: '',
      }
    },
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {
      this.captcha = '';
      this.loginname = '';
      this.password = '';
      this.getCodeFn();
      this.handleKeyup();
    },
    beforeMount() {},
    mounted() {},
    watch: {},
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
        this.isClick = true;
        this.loading = true;
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
            let url = '/user/login' + vm.$store.state.getUrlParamFn();
            this.$http.post(url, paramCryptFn(param), {
              emulateJSON: true
            }).then(res => {
              let code = res.data.returncode;
              let data = res.data.data;
              this.isClick = false;
              this.loading = false;
              if (code == 200) {
                localStorage.setItem('dove-app-login', 'true');
                localStorage.setItem('dove-app-cash', data.cash);
                localStorage.setItem('dove-app-loginname', data.loginname);
                localStorage.setItem('dove-app-token', data.token);
                this.$store.dispatch('setLoginStauts', true);
                this.$store.dispatch('setAlertBG', false);
                this.$store.dispatch('setShowLoginDialog', false);
                this.$store.dispatch('setCash', data.cash);
                this.$store.dispatch('setDoveName', data.loginname);
              } else if (code == '304') {
                vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.user_not_exist"),
                  'error', this.duration, this);
              } else if (code == '305') {
                vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.password_error"),
                  'error', this.duration, this);
              } else if (code == '302') {
                vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.code_error"), 'error',
                  this.duration, this);
              } else if (code == '307') {
                vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.code_expired"),
                  'error', this.duration, this);
              } else if (code == '306') {
                vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.account_disabled"),
                  'error', this.duration, this);
              } else if (code == '301') {
                vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.server_error"),
                  'error', this.duration, this);
              }
            }).then(error => {})
          } else {
            this.isClick = false;
            this.loading = false;
            vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.submit_failure"), 'error',
              this.duration, this);
          }
          // this.consoleFn(res)
        }).then(error => {
          this.isClick = false;
          this.loading = false;
          // console.log(error)
          if (error) {
            vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.submit_failure"), 'error',
              this.duration, this);
          }
          // this.consoleFn(error)
        })
      },
    }
  }

</script>
<style lang="scss" scoped>
  .loginDialog {
    width: 400px;
    height: 398px;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: #111111;
    border-radius: 4px;
    z-index: 999999;
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
        background: #ababab;
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
        border-radius: 4px;
        color: #9C9EA2;
        background: #111;
        cursor: pointer;
      }

      .login-btn {
        font-size: 16px;
        color: #111;
        border: none;
        background: #F2B672;
      }
    }
  }

</style>
