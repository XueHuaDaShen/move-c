<template>
  <div class="reg" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <!-- <pageTitle title="registered"></pageTitle> -->
    <div class="reg-title">{{$t("message.registered")}}</div>
    <div class="reg-panel">
      <!-- <div class="reg-icon"><img src="@/assets/img/home/h-logo.png" alt=""></div> -->
      <table class="reg-table">
        <tr><span>{{$t('message.login_and_registered.username')}}</span></tr>
        <tr class="tr-pt-10">
          <div><input type="text" v-model="loginname"></div>
          <!-- <div><input type="text" v-model="loginname" :placeholder="$t('message.login_and_registered.username')"></div> -->
        </tr>
        <tr class="tr-pt-10"><span class="ruler-tip">{{$t('message.login_and_registered.error_tip.username_ruler')}}</span></tr>
        <tr class="tr-pt-20"><span>{{$t('message.login_and_registered.password')}}</span></tr>
        <tr class="tr-pt-10">
          <div><input type="password" v-model="password"></div>
          <!-- <div><input type="password" v-model="password" :placeholder="$t('message.login_and_registered.password')"></div> -->
        </tr>
        <tr class="tr-pt-10"><span class="ruler-tip">{{$t('message.login_and_registered.error_tip.password_ruler')}}</span></tr>
        <tr class="tr-pt-20"><span>{{$t('message.login_and_registered.confirm_password')}}</span></tr>
        <tr class="tr-pt-10">
          <div><input type="password" v-model="confirmPassword"></div>
          <!-- <div><input type="password" v-model="confirmPassword" :placeholder="$t('message.login_and_registered.confirm_password')"></div> -->
        </tr>
        <tr class="tr-pt-20"><span>{{$t('message.login_and_registered.verification_code')}}</span></tr>
        <tr class="tr-pt-10">
          <div class="code-div"><input type="text" v-model="code" class="code-input"><span class="code" @click="getCodeFn" v-html="captcha"></span></div>
          <!-- <div class="code-div"><input type="text" v-model="code" :placeholder="$t('message.login_and_registered.verification_code')" class="code-input"><span class="code" @click="getCodeFn" v-html="captcha"></span></div> -->
        </tr>
        <tr class="tr-pt-30">
          <div><button class="reg-btn" @click="checkLoginname" :disabled="isClick">{{$t('message.registered')}}</button></div>
        </tr>
        <!-- <tr class="tr-pt-20"><div><button>Retrieve password</button></div></tr> -->
      </table>
    </div>
  </div>
</template>
<script>
  import * as validator from "@/assets/js/utils/validator";
  import pageTitle from '@/components/public/pageTitle';
  import paramCryptFn from '@/assets/js/cryptData'
  import MD5 from "MD5";
  export default {
    name: 'reg',
    components: {
      pageTitle
    },
    data() {
      return {
        msg: 'nihao',
        duration: 1500,
        isClick: false, // 防止多次提交
        guid: '',
        captcha: '',
        loginname: '',
        password: '',
        confirmPassword: '',
        code: '',
        loading: false
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
          if (e.keyCode == 13) {
            vm.checkLoginname();
          }
        }
      },
      regFn() {
        const vm = this;
        let zhucema = this.$route.params.pathMatch;
        let url = '/user/register' + vm.$store.state.getUrlParamFn();
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
            localStorage.setItem('dove-web-login', 'true');
            localStorage.setItem('dove-web-cash', data.cash);
            localStorage.setItem('dove-web-loginname', data.loginname);
            localStorage.setItem('dove-web-token', data.token);
            localStorage.setItem('dove-web-loginid', data._id);
            localStorage.setItem('dove-web-type', data.type);
            this.$store.dispatch('setLoginStauts', true);
            this.$store.dispatch('setCash', data.cash);
            this.$store.dispatch('setDoveName', data.loginname);
            this.getChannel();
            this.$router.push({
              name: 'index'
            })
          } else if (code == '302') {
            this.$store.state.message(this.$t("message.login_and_registered.error_tip.code_error"), 'error', this.duration,
              this);
              this.getCodeFn();
          } else if (code == '307') {
            this.$store.state.message(this.$t("message.login_and_registered.error_tip.code_expired"), 'error', this
              .duration, this);
              this.getCodeFn();
          } else if (code == '301') {
            this.$store.state.message(this.$t("message.login_and_registered.error_tip.server_error"), 'error', this
              .duration, this);
          }
        }).then(err => {
          if(err){
            this.$store.state.message(this.$t("message.login_and_registered.error_tip.server_error"), 'error', this
              .duration, this);
            this.isClick = false;
            this.loading = false;
          }
        })
      },
      checkLoginname() {
        // if(!this.loginname){
        //   return false;
        // }
        if (!this.loginname || !this.password || !this.confirmPassword || !this.code) {
          // 补全资料
          this.$store.state.message(this.$t("message.login_and_registered.error_tip.bu_chong_zi_liao"), 'error', this.duration,
            this);
          return false;
        }
        if (!validator.regexpInput(this.loginname)) {
          this.$store.state.message(this.$t("message.login_and_registered.error_tip.username_ruler_error"), 'error',
            this.duration, this);
          return false;
        }
        if (!validator.regexpPsd(this.password)) {
          this.$store.state.message(this.$t("message.login_and_registered.error_tip.password_ruler_error"), 'error',
            this.duration, this);
          return false;
        }
        if (this.password !== this.confirmPassword) {
          // 密码不一致
          this.$store.state.message(this.$t("message.login_and_registered.error_tip.no_same"), 'error', this.duration,
            this);
          return false;
        }
        this.isClick = true;
        this.loading = true;
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
            this.loading = false;
            this.$store.state.message(this.$t("message.login_and_registered.error_tip.user_exist"), 'error', this.duration,
              this);
          }
        }).then(function (error) {
          if(error){
            this.$store.state.message(this.$t("message.login_and_registered.error_tip.server_error"), 'error', this
              .duration, this);
            this.isClick = false;
            this.loading = false;
          }
          // console.log(error)
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
  .reg {
    width: 100%;
    // min-height:730px;
    min-height: 830px;
    background: #111111;
  }
  .reg-title{
    margin-top:30px;
    color:#f98c69;
    font-size: 22px;
    text-align:center;
  }

  .reg-panel {
    width: 400px;
    // height:398px;
    // height:480px;
    // height: 576px;
    height: 546px;
    margin: 35px auto;
    background: #111111;
    border-radius: 4px;
    // z-index:999999;
    // padding: 60px 50px 30px 50px;
    padding: 30px 50px;
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.5);
    position: relative;

    .reg-icon {
      width: 66px;
      height: 66px;
      position: absolute;
      left: 50%;
      margin-left: -33px;
      top: -23px;
    }

    .reg-table {
      width: 100%;
      border: none;
      border-collapse: collapse;

      .ruler-tip {
        color: #F2B672;
        font-size: 12px;
      }

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

      .reg-btn {
        font-size: 16px;
        color: #111;
        border: none;
        // background: #F2B672;
        background-image: linear-gradient(134deg,	#fadcab 0%, #d99d59 100%, #f2b672 100%);
      }
    }
  }

</style>
