<template>
  <div class="login-reg-wrap" v-loading.fullscreen="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="login-logo">
      <img src="@/assets/img/log-reg/logo.png" alt="">
    </div>
    <h2 class="text">{{$t("message.log_in")}}</h2>
    <div class="login-inner">
      <div class="user">
        <span class="icon"><img src="@/assets/img/log-reg/user.png" alt=""></span>
        <input type="text" v-model="loginname" @blur="handleInputedLoginname" :placeholder="$t('message.login_and_registered.username')">
      </div>
      <div class="pwd">
        <span class="icon"><img src="@/assets/img/log-reg/pwd.png" alt=""></span>
        <input type="password" v-model="password" :placeholder="$t('message.login_and_registered.password')">
      </div>
      <div class="code" style="margin-bottom:0">
        <span class="icon"><img src="@/assets/img/log-reg/code.png" alt=""></span>
        <input type="text" v-model="code" :placeholder="$t('message.login_and_registered.verification_code')">
        <span class="verification-code" @click="getCodeFn" v-html="captcha"></span>
      </div>
      <div class="habit">
        <label for="box" class="rem-label">
          <input type="checkbox" class="remember" id="box" :checked="isMomery" v-model="isMomery">
          <em class="copy_checkbox"></em>
          <span>{{$t("message.login_and_registered.momery")}}</span>
        </label>
      </div>
      <div class="log"><button :disabled="isClick" @click="logFn">{{$t("message.log_in")}}</button></div>
      <div class="reg"><button @click="toReg">{{$t("message.registered")}}</button></div>
    </div>
  </div>
</template>
<script>
import paramCryptFn from '@/assets/js/cryptData'
import MD5 from "MD5";
export default {
  name: 'login',
  data() {
    return {
      enabled_jiami_ceshi: true, // 是否开启 记住密码
      loginname: '',
      password: '',
      code: '',
      guid: '',
      captcha: '',
      duration: 1500,
      loading: false,
      isClick: false,
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
    this.getCodeFn();

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
    toReg() {
      this.$router.push('/reg/')
    },
    logFn() {
      const vm = this;
      if (!vm.loginname || !vm.password || !vm.code) {
        return false
      }
      vm.isClick = true;
      vm.loading = true;
      vm.$http.post('/user/random', {
        loginname: vm.loginname
      }, {
        emulateJSON: true
      }).then(res => {
        let data = res.data;
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
            loginname: vm.loginname,
            password: new_password,
            captcha: vm.code,
            id: vm.guid
          };
          // console.log(paramCryptFn(param))
          let url = '/user/login' + vm.$store.state.getUrlParamFn();
          vm.$http.post(url, paramCryptFn(param), {
            emulateJSON: true
          }).then(res => {
            let code = res.data.returncode;
            let data = res.data.data;
            vm.isClick = false;
            vm.loading = false;
            if (code == 200) {
              localStorage.setItem('dove-app-login', 'true');
              localStorage.setItem('dove-app-cash', data.cash);
              localStorage.setItem('dove-app-loginname', data.loginname);
              localStorage.setItem('dove-app-token', data.token);
              vm.$store.dispatch('setLoginStauts', true);
              vm.$store.dispatch('setAlertBG', false);
              vm.$store.dispatch('setShowLoginDialog', false);
              vm.$store.dispatch('setCash', data.cash);
              vm.$store.dispatch('setDoveName', data.loginname);

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

              let fromUrl = vm.$store.state.fromUrl;
              if(fromUrl){
                vm.$router.push({
                  name: fromUrl
                })
              }else{
                vm.$router.push({
                  name: 'home'
                })
              }
            } else if (code == '304') {
              vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.user_not_exist"),
                'error', vm.duration, vm);
            } else if (code == '305') {
              vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.password_error"),
                'error', vm.duration, vm);
            } else if (code == '302') {
              vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.code_error"), 'error',
                vm.duration, vm);
                vm.getCodeFn();
            } else if (code == '307') {
              vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.code_expired"),
                'error', vm.duration, vm);
                vm.getCodeFn();
            } else if (code == '306') {
              vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.account_disabled"),
                'error', vm.duration, vm);
            } else if (code == '301') {
              vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.server_error"),
                'error', vm.duration, vm);
            }
          }).then(error => {})
        } else {
          vm.isClick = false;
          vm.loading = false;
          vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.submit_failure"), 'error',
            vm.duration, vm);
        }
        // vm.consoleFn(res)
      }).then(error => {
        // console.log(error)
        if (error) {
          vm.isClick = false;
          vm.loading = false;
          vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.submit_failure"), 'error',
            vm.duration, vm);
        }
        // vm.consoleFn(error)
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.login-reg-wrap .login-inner{
  .habit {
    width: 100%;
    height: 5.33vw;
    margin-top:5.33vw;
    margin-bottom:10.67vw;
    display: -webkit-box;
    -webkit-box-pack: justify;
    -webkit-box-align: center;
    font-size: 3.73vw;
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
        width: 4.53vw;
        height: 4.53vw;
        display: block;
        background: none;
        border: none;
        outline: none;
        position: relative;
        z-index: 3;
        opacity: 0;
      }

      input[type='checkbox']:checked+em.copy_checkbox {
        background: url(../assets/img/log-reg/check-box-ed.png) no-repeat;
        background-size: 100% 100%;
      }

      .copy_checkbox {
        position: absolute;
        left: 0;
        top: 0;
        width: 4.53vw;
        height: 4.53vw;
        background: url(../assets/img/log-reg/check-box.png) no-repeat;
        background-size: 100% 100%;
        z-index: 2;
      }

      span {
        display: block;
        margin-left: 2.67vw;
      }

      a.lose {
        color: #C83C4A;
        text-decoration: underline;
      }
    }
  }
}
</style>



