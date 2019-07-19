<template>
  <div class="login" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="login-wrap">
      <span class="logo-icon"></span>
      <p class="login-title">{{$t("message.login_title")}}</p>
      <table class="login-table">
        <tbody>
          <tr>
            <td class="text-right">{{$t("message.username")}}：</td>
            <td class="text-left"><input type="text" class="text input-username" v-model.trim="loginName" @blur="handleInputedLoginname"
                :placeholder="$t('message.qing_shu_ru')+$t('message.username')"></td>
          </tr>
          <tr>
            <td class="text-right">{{$t("message.password")}}：</td>
            <td class="text-left"><input type="password" class="text input-password" v-model="loginPwd" :placeholder="$t('message.qing_shu_ru')+$t('message.password')"></td>
          </tr>
          <tr>
            <td class="text-right">{{$t("message.yan_zheng_ma")}}：</td>
            <td class="text-left">
              <input type="text" class="input-yan_zheng_ma" v-model="code" :placeholder="$t('message.qing_shu_ru')+$t('message.yan_zheng_ma')">
              <span class="code" v-html="captcha" @click="getCodeFn"></span>
            </td>
          </tr>
          <tr v-if="tip">
            <td class="padding-top-none"></td>
            <td class="text-left padding-top-none tip">{{tip}}</td>
          </tr>
          <tr>
            <td></td>
            <td class="text-left habit">
              <label for="remeber-box" class="rem-label">
                <input type="checkbox" id="remeber-box" class="remember" :checked="isMomery" v-model="isMomery">
                <em class="copy_checkbox"></em>
                <span>{{$t("message.ji_zhu_mi_ma")}}</span>
              </label>
            </td>
          </tr>
          <tr>
            <td></td>
            <td class="text-left">
              <button class="login-btn" @click="logFn">{{$t("message.deng_lu")}}</button>
              <button class="forget-btn" @click="toLosePasswrod">{{$t("message.wang_ji_mi_ma")}}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  import paramCryptFn from '@/assets/js/cryptData'
  export default {
    name: 'login',
    components: {},
    props: {},
    data() {
      return {
        consoleFn: this.$store.state.consoleFn,
        isMomery: false,
        isMomeryed: false,
        momery_username: '',
        momery_pwd: '',
        loading: false,


        loginName: '',
        loginPwd: '',
        code: '',
        captcha: '',
        guid: '',
        tip: '',
        tipTime: 2
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      // this.tip = this.$t("message.errorLoginTip");
      this.$store.dispatch('setIsRelogin', false)
      let user = localStorage.getItem('candy-momery_username');
      this.login = localStorage.getItem('candy-login') === 'true';
      if(this.login){
        this.$router.push({
          name: 'home'
        })
      }
      if (user) {
        this.momery_username = user;
        let pwd = localStorage.getItem(user) || CryptoJS.MD5('').toString();
        if (pwd !== CryptoJS.MD5('').toString()) {
          // console.log(1)
          this.momery_pwd = pwd;
          this.isMomeryed = true;
          this.isMomery = true;
        } else {
          this.momery_pwd = '';
          this.isMomeryed = false;
          this.isMomery = false;
        }
      } else {
        this.momery_username = '';
      }
      this.loginName = this.momery_username;
      this.loginPwd = this.momery_pwd;
      this.getCodeFn();
      this.handleKeyup();
    },
    mounted() {},
    methods: {
      handleInputedLoginname() {
        const vm = this;
        let pwd = localStorage.getItem(vm.loginName) || CryptoJS.MD5('').toString();
        if (pwd !== CryptoJS.MD5('').toString()) {
          // console.log(1)
          this.momery_pwd = pwd;
          this.isMomeryed = true;
          this.isMomery = true;
        } else {
          this.momery_pwd = '';
          this.isMomeryed = false;
          this.isMomery = false;
        }
        this.loginPwd = this.momery_pwd;
        this.consoleFn(this.loginPwd)
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
      handleKeyup() {
        const vm = this;
        document.onkeyup = function (e) {
          // console.log(e.keyCode)
          if (e.keyCode == 13) {
            vm.logFn();
          }
        }
      },
      logFn() {
        const vm = this;
        if (this.loginName === '') {
          this.tip = this.$t("message.qing_shu_ru") + this.$t("message.username");
          setTimeout(() => {
            vm.tip = '';
          }, vm.tipTime * 1000);
          return false;
        } else if (this.loginPwd === '') {
          this.tip = this.$t("message.qing_shu_ru") + this.$t("message.password");
          setTimeout(() => {
            vm.tip = '';
          }, vm.tipTime * 1000);
          return false;
        } else if (this.code === '') {
          this.tip = this.$t("message.qing_shu_ru") + this.$t("message.yan_zheng_ma");
          setTimeout(() => {
            vm.tip = '';
          }, vm.tipTime * 1000);
        } else {
          this.loading = true;
          // this.$store.dispatch('setLoading', true)
          this.$http.post('/user/random', {
            loginname: this.loginName
          }, {
            emulateJSON: true
          }).then(res => {
            let data = res.data;
            if (data.returncode == 200) {
              let random = data.data.random;
              // console.log(res)
              let new_password = '';
              if (vm.isMomeryed) {
                new_password = CryptoJS.HmacMD5(vm.loginPwd, random).toString()
              } else {
                new_password = CryptoJS.HmacMD5(CryptoJS.MD5(vm.loginPwd).toString(), random).toString()
              }
              var param = {
                loginname: this.loginName,
                password: new_password,
                captcha: this.code,
                id: this.guid
              };
              // console.log(paramCryptFn(param))
              this.$http.post('/user/login', paramCryptFn(param), {
                emulateJSON: true
              }).then(res => {
                let code = res.data.returncode;
                this.loading = false;
                if (code == 200) {
                  let data = res.data.data;
                  localStorage.setItem('candy-login', 'true');
                  localStorage.setItem('candy-cash', data.cash);
                  localStorage.setItem('candy-cash_credit', data.cash_credit);
                  localStorage.setItem('candy-loginname', data.loginname);
                  localStorage.setItem('candy-token', data.token);
                  localStorage.setItem('candy-loginid', data._id);
                  localStorage.setItem('candy-type', data.type);
                  this.$router.push({
                    name: 'home'
                  })
                  // 是否记住密码
                  if (vm.isMomery) {
                    localStorage.setItem('candy-momery_username', vm.loginName);
                    if (vm.isMomeryed) {
                      localStorage.setItem(vm.loginName, vm.loginPwd);
                    } else {
                      localStorage.setItem(vm.loginName, CryptoJS.MD5(vm.loginPwd).toString());
                    }
                  } else {
                    localStorage.setItem('candy-momery_username', vm.loginName);
                    localStorage.removeItem(vm.loginName);
                  }
                } else if (code == '304') {
                  vm.tip = this.$t("message.user_not_exist");
                  setTimeout(function () {
                    vm.tip = '';
                  }, vm.tipTime * 1000)
                } else if (code == '305') {
                  vm.tip = this.$t("message.password_error");
                  setTimeout(function () {
                    vm.tip = '';
                  }, vm.tipTime * 1000)
                } else if (code == '302') {
                  vm.tip = this.$t("message.yan_zheng_ma_cuo_wu");
                  vm.getCodeFn();
                  setTimeout(function () {
                    vm.tip = '';
                  }, 2000)
                } else if (code == '307') {
                  vm.tip = this.$t("message.yan_zheng_ma_guo_qi");
                  vm.getCodeFn();
                  setTimeout(function () {
                    vm.tip = '';
                  }, 2000)
                } else if (code == '306') {
                  vm.tip = this.$t("message.account_disabled");
                  setTimeout(function () {
                    vm.tip = '';
                  }, vm.tipTime * 1000)
                } else if (code == '301') {
                  vm.tip = this.$t("message.xi_tong_cuo_wu");
                  setTimeout(function () {
                    vm.tip = '';
                  }, vm.tipTime * 1000)
                }
                this.consoleFn(res)
              }).then(error => {
                if(error){
                  this.loading = false;
                }
                this.consoleFn(error)
              })
            }else{
              this.loading = false;
            }
            // this.consoleFn(res)
          }).then(error => {
            if(error){
              this.loading = false;
            }
            // this.consoleFn(error)
          })
        }
      },
      toLosePasswrod() {
        this.$router.push({
          name: 'losePassword'
        })
      }
    },
  }

</script>

<style lang="scss" scoped>
  .login {
    width: 100%;
    height: 100%;
    background: #1E1E1E !important;

    .login-wrap {
      max-width: 600px;
      height: 467px;
      margin: 145px auto;
      background: #252525;
      position: relative;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-box-align: center;
      -webkit-box-pack: start;

      .logo-icon {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        display: inline-block;
        margin-top: -20px;
        background: url('../assets/img/login-logo.png') no-repeat;
        background-size: cover;
      }

      .login-title {
        text-align: center;
        margin-top: 10px;
        font-size: 20px;
        color: #C59A37;
      }

      .login-table {
        width: 404px;
        margin: 0 auto;
        color: #fff;
        font-size: 16px;

        td {
          padding-top: 20px;
        }

        .tip {
          color: #C83C4A;
        }

        .padding-top-none {
          padding-top: 10px;
        }

        input {
          width: 300px;
          height: 40px;
          padding: 10px 20px;
          background: #FFFFFF;
          border: 1px solid #979797;
          box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.50);
          font-size: 14px;
          color: #777777;
          border-radius: 2px;
        }

        .input-yan_zheng_ma {
          width: 150px;
        }

        .text-right {
          text-align: right;
          width:84px;
        }

        .text-left {
          text-align: left;
          // padding-left: 22px;
          position: relative;

          span.code {
            position: absolute;
            transform: scale(.8);
            margin-top: -5px;
            right: 0;
            cursor: pointer;
            display:inline-block;
            // width:77.2px;
            height:50px;
            background:#fff;
          }
        }

        .habit {
          width: 100%;
          display: -webkit-box;
          -webkit-box-pack: justify;
          -webkit-box-align: center;

          .rem-label {
            position: relative;
            display: block;
            display: -webkit-box;
            -webkit-box-align: center;
            cursor: pointer;

            .remember {
              width: 20px;
              height: 20px;
              display: block;
              background: none;
              border: none;
              outline: none;
              position: relative;
              z-index: 3;
              opacity: 0;
              margin-left: 0;
              cursor: pointer;
            }

            input[type='checkbox']:checked+em.copy_checkbox {
              background: url('../assets/img/check-box-ed.png') no-repeat;
              background-size: 100% 100%;
            }

            .copy_checkbox {
              position: absolute;
              left: 0;
              top: 0;
              width: 20px;
              height: 20px;
              background: url('../assets/img/check-box.png') no-repeat;
              background-size: 100% 100%;
              z-index: 2;
            }

            span {
              display: block;
              margin-left: 10px;
              font-size: 14px;
            }

            a.lose {
              color: #C83C4A;
              text-decoration: underline;
            }
          }
        }

        button {
          width: 140px;
          height: 44px;
          font-size: 14px;
          border-radius: 4px;
          color: #fff;
          cursor: pointer;
        }

        .login-btn {
          background-image: linear-gradient(-180deg, #EB5228 0%, #C14726 100%);
        }

        .forget-btn {
          border: 1px solid #454545;
          background: #252525;
          margin-left: 20px;
        }
      }
    }
  }
  @media screen and (max-width: 404px) {
    .login {
      .login-wrap {
        margin-top: 70px;

        .login-table {
          width:100%;
        }
      }
    }
  }

  @media screen and (max-width: 375px) {
    .login {
      .login-wrap {
        margin-top: 70px;

        .login-table {
          td {
            &:first-child {
              width: 25%;
            }
            &:last-child {
              span.code{
                position: absolute;
                transform: scale(0.3, .8);
                margin-top: -5px;
                right: 13px;
              }
            }
          }

          input.text {
            width: auto;
            height: 40px;
          }

          button {
            width: 36%;
            height: 35px;
          }
        }
      }
    }
  }

</style>
