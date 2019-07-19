<template>
  <div class="login-reg-wrap" v-loading.fullscreen="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <em class="back" @click="toBack"><img src="@/assets/img/log-reg/back.png" alt=""></em>
    <div class="login-logo">
      <img src="@/assets/img/log-reg/logo.png" alt="">
    </div>
    <h2 class="text">{{$t("message.registered")}}</h2>
    <div class="login-inner">
      <div class="user">
        <span class="icon"><img src="@/assets/img/log-reg/user.png" alt=""></span>
        <input type="text" v-model="loginname" :placeholder="$t('message.login_and_registered.username')">
      </div>
      <div class="pwd">
        <span class="icon"><img src="@/assets/img/log-reg/pwd.png" alt=""></span>
        <input type="password" v-model="password" :placeholder="$t('message.login_and_registered.password')">
      </div>
      <div class="pwd">
        <span class="icon"><img src="@/assets/img/log-reg/pwd.png" alt=""></span>
        <input type="password" v-model="confirmPassword" :placeholder="$t('message.login_and_registered.confirm_password')">
      </div>
      <div class="code">
        <span class="icon"><img src="@/assets/img/log-reg/code.png" alt=""></span>
        <input type="text" v-model="code" :placeholder="$t('message.login_and_registered.verification_code')">
        <span class="verification-code" @click="getCodeFn" v-html="captcha"></span>
      </div>
      <div class="log"><button @click="checkLoginname" :disabled="isClick">{{$t("message.registered")}}</button></div>
    </div>
  </div>
</template>
<script>
import * as validator from "@/assets/js/utils/validator";
import paramCryptFn from '@/assets/js/cryptData'
import MD5 from "MD5";
export default {
  name: 'reg',
  data() {
    return {
      loginname: '',
      password: '',
      confirmPassword: '',
      code: '',
      guid: '',
      captcha: '',
      duration: 1500,
      loading: false,
      isClick: false,
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {
    this.getCodeFn();
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
    toBack() {
      history.go(-1)
    },
    regFn() {
      const vm = this;
      let zhucema = this.$route.params.pathMatch;
      let url = '/user/register' + vm.$store.state.getUrlParamFn();
      // console.log(zhucema)
      this.loading = true;
      this.$http.post(url, paramCryptFn({
        loginname: this.loginname,
        password: MD5(this.password),
        captcha: this.code,
        code: zhucema || '',
        id: this.guid
      }), {
        emulateJSON: true
      }).then(res => {
        // console.log(res)
        this.isClick = false;
        this.loading = false;
        let code = res.data.returncode;
        if (code == 302 || code == 303) {
          this.getCodeFn();
        } else if (code == 200) {
          // 注册成功
          let data = res.data.data;
          localStorage.setItem('dove-app-login', 'true');
          localStorage.setItem('dove-app-cash', data.cash);
          localStorage.setItem('dove-app-loginname', data.loginname);
          localStorage.setItem('dove-app-token', data.token);
          this.$store.dispatch('setLoginStauts', true);
          vm.$store.dispatch('setCash', data.cash);
          vm.$store.dispatch('setDoveName', data.loginname);
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
        } else if (code == '302') {
          vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.code_error"), 'error', this.duration,
            this);
            this.getCodeFn();
        } else if (code == '307') {
          vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.code_expired"), 'error', this
            .duration, this);
            this.getCodeFn();
        } else if (code == '301') {
          vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.server_error"), 'error', this
            .duration, this);
        }
      }).then(err => {})
    },
    checkLoginname() {
      const vm = this;
      // if(!this.loginname){
      //   return false;
      // }
      if (!this.loginname || !this.password || !this.confirmPassword || !this.code) {
        // 补全资料
        vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.bu_chong_zi_liao"), 'error', this.duration,
          this);
        return false;
      }
      if (!validator.regexpInput(this.loginname)) {
        vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.username_ruler_error"), 'error',
          this.duration, this);
        return false;
      }
      if (!validator.regexpPsd(this.password)) {
        vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.password_ruler_error"), 'error',
          this.duration, this);
        return false;
      }
      if (this.password !== this.confirmPassword) {
        // 密码不一致
        vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.no_same"), 'error', this.duration,
          this);
        return false;
      }
      this.isClick = true;
      this.$http.post('/user/check', {
        loginname: this.loginname
      }, {
        emulateJSON: true
      }).then(function (res) {
        // console.log(res)
        if (res.data.returncode == 200) {
          // 用户名可用
          this.regFn();
        } else {
          this.isClick = false;
          vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.user_exist"), 'error', this.duration,
            this);
        }
      }).then(function (error) {
        // console.log(error)
      })
    },
  }
}
</script>

