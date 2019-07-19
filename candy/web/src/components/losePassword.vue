<template>
  <div class="reg">
    <div class="reg-wrap">
      <p class="router-tag">{{$t("message.find_password")}}</p>
      <table class="reg-table">
        <tbody v-if="!isNext">
          <tr>
            <td class="text-right">{{$t("message.username")}}：</td>
            <td class="text-left">
              <input type="text" class="input-username" v-model.trim="loginname" :placeholder="$t('message.qing_shu_ru')+$t('message.username')">
            </td>
          </tr>
          <tr>
            <td class="text-right">{{$t("message.email")}}：</td>
            <td class="text-left">
              <input type="text" class="input-email" v-model.trim="email" :placeholder="$t('message.qing_shu_ru')+$t('message.email')">
              <p class="attention" v-if="showEmailText">{{$t("message.attention")}}</p>
            </td>
          </tr>
          <tr>
            <td class="text-right">{{$t("message.yan_zheng_ma")}}：</td>
            <td class="text-left">
              <input type="text" class="input-yan_zheng_ma" v-model="captcha" :placeholder="$t('message.qing_shu_ru')+$t('message.yan_zheng_ma')">
              <span class="send" @click="getCodeFn">{{$t("message.send")}}</span>
            </td>
          </tr>
        </tbody>
        <tbody v-if="isNext">
          <tr>
            <td class="text-right">{{$t("message.password")}}：</td>
            <td class="text-left">
              <input type="password" class="input-password" v-model.trim="password" :placeholder="$t('message.qing_shu_ru')+$t('message.password')">
            </td>
          </tr>
          <tr>
            <td class="text-right">{{$t("message.confirm_pwd")}}：</td>
            <td class="text-left">
              <input type="password" class="input-password" v-model.trim="confirm_pwd" :placeholder="$t('message.qing_que_ren')+$t('message.password')">
            </td>
          </tr>
        </tbody>
      </table>
      <div class="yong_hu_tiao_kuan-wrap">
        <div class="btn-wrap" v-if="!isNext">
          <button class="reg-btn" style="margin-left:17px;margin-right:0;" @click="toNext">{{$t("message.next")}}</button>
          <!-- <button class="cancel-btn">{{$t("message.cancel")}}</button> -->
        </div>
        <div class="btn-wrap" v-if="isNext">
          <button class="reg-btn" @click="confrimEditPwd">{{$t("message.confirm")}}</button>
          <button class="cancel-btn" @click="cancelConfirm">{{$t("message.cancel")}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import config from "@/http/config";
  import paramCryptFn from "@/assets/js/cryptData";
  import * as validator from "../../static/utils/validator";
  import MD5 from "MD5";
  export default {
    name: "losePassword",
    components: {},
    props: {},
    data() {
      return {
        consoleFn: this.$store.state.consoleFn,
        isAgree: false,
        guid: "",
        captcha_text: "",

        bankList: [],

        isNext: false,
        showEmailText: false,

        phone: "",
        loginname: "",
        email: "",
        password: "",
        confirm_pwd: "",
        captcha: ""
      };
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      // console.log('ok')
      this.handleKeyup();
    },
    mounted() {},
    methods: {
      // 生成 UUID
      getGuid() {
        // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      },
      getCodeFn() {
        if(!this.loginname){
          this.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.username"), 'error', 1500, this);
          return false;
        }
        if(!validator.regexpInput(this.loginname)){
          this.$store.state.message(this.$t("message.username") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, this);
          return false;
        }
        if(!this.email){
          this.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.email"), 'error', 1500, this);
          return false;
        }
        if(!validator.email(this.email)){
          this.$store.state.message(this.$t("message.email") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, this);
          return false;
        }
        this.showEmailText = false;
        this.$http.get("/user/password/find", {
          params: {
            loginname: this.loginname,
            email: this.email.toLowerCase()
          }
        })
        .then(function (res) {
          //
          if(res.data.returncode == 200){
            this.showEmailText = true;
          }else if(res.data.returncode == 301){
            this.$store.state.message(this.$t("message.user_or_email_error"), 'error', 1500, this);
          }else{
            this.$store.state.message(this.$t("message.yan_zheng_ma") + this.$t("message.send") + this.$t("message.shi_bai"), 'error', 1500, this);
          }
          // console.log(res)
        })
        .then(function (error) {
          // console.log(error)
        });
      },
      handleKeyup() {
        const vm = this;
        document.onkeyup = function (e) {
          // console.log(e.keyCode)
          if (e.keyCode == 13) {
            if(vm.isNext){
              vm.confrimEditPwd();
            }else{
              vm.toNext();
            }
          }
        }
      },
      handleSelectTime(val) {
        if(val){
          let now = new Date();
          if(val.getDate() > now.getDate()){
            this.birth = now;
          }
          // console.log(val.getDate(), now)
        }
      },
      toNext() {
        if(!this.captcha){
          this.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.yan_zheng_ma"), 'error', 1500, this);
          return false;
        }
        this.$http.post("/user/exam/code", paramCryptFn({
            loginname: this.loginname,
            code: this.captcha
          }), {
          emulateJSON: true
        })
        .then(function (res) {
          //
          if(res.data.returncode == 200){
            this.isNext = true;
          }else{
            this.$store.state.message(this.$t("message.code_error"), 'error', 1500, this);
          }
          // console.log(res)
        })
        .then(function (error) {
          // console.log(error)
        });
      },
      confrimEditPwd() {
        if (!this.password) {
          this.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.password"), 'error', 1500, this);
          return false;
        }
        if (!validator.regexpPsd(this.password)) {
          this.$store.state.message(this.$t("message.password") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, this);
          return false;
        }
        if (this.confirm_pwd !== this.password) {
          this.$store.state.message(this.$t("message.mi_ma_bu_yi_zhi"), 'error', 1500, this);
          return false;
        }
        this.$http.post("/user/password/reset", paramCryptFn({
            loginname: this.loginname,
            code: this.captcha,
            newpw: MD5(this.password)
          }), {
          emulateJSON: true
        })
        .then(function (res) {
          let code = res.data.returncode;
          if(res.data.returncode == 200){
            this.$router.push({
              name: 'login'
            })
          } else if (code == 304) {
            this.$store.state.message(this.$t("message.user_not_exist"), 'error', 1500, this);
          } else if (code == 306) {
            this.$store.state.message(this.$t("message.account_disabled"), 'error', 1500, this);
          } else if (code == 307) {
            this.$store.state.message(this.$t("message.bu_neng_wei_jiu_mi_ma"), 'error', 1500, this);
          } else if (code == 302) {
            this.$store.state.message(this.$t("message.yan_zheng_ma_cuo_wu"), 'error', 1500, this);
          } else{
            this.$store.state.message(this.$t("message.change_password"), 'error', 1500, this);
          }
          // console.log(res)
        })
        .then(function (error) {
          // console.log(error)
        });
      },
      cancelConfirm() {
        this.isNext = false;
        this.loginname = '';
        this.email = '';
        this.captcha = '';
        this.showEmailText = false;
      },
    }
  };

</script>
<style lang="scss">
  .reg {
    .el-date-editor.el-input {
      width: 236px;
    }

    .el-input--prefix .el-input__inner,
    .el-input--suffix .el-input__inner {
      padding: 0;
      height: 32px;
      padding: 8px 20px 7px 20px;
      background: #ffffff;
      border: 1px solid #979797;
      box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.5);
      font-size: 14px;
      color: #777777;
      border-radius: 2px;
    }

    .el-input__prefix {
      display: none;
    }

    .el-input__inner::placeholder {
      color: #777;
    }
  }

</style>

<style lang="scss" scoped>
  .reg {
    width: 100%;
    padding-top: 30px;
    padding-bottom: 60px;
    background: #1e1e1e !important;
    color: #fff;
    font-size: 14px;

    .reg-wrap {
      max-width:1200px;
      // padding: 0 10px;
      // width: 100%;
      margin: 0 auto;
      background: #252525;

      .router-tag {
        padding-left: 20px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        text-align: left;
        background: #454545;
      }
    }

    .reg-table {
      width: 100%;
      margin: 0 auto;
      display: table;
      font-size: 16px;

      tbody {
        td {
          &:first-child {
            width: 43%;
          }
        }

        tr {
          &:first-child {
            td {
              padding-top: 60px;
            }
          }
        }
      }

      td {
        padding-top: 20px;
      }

      .tip {
        color: #c83c4a;
      }

      .padding-top-none {
        padding-top: 10px;
      }

      input {
        width: 236px;
        height: 32px;
        padding: 8px 20px 7px 20px;
        background: #ffffff;
        border: 1px solid #979797;
        box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.5);
        font-size: 14px;
        color: #777777;
        border-radius: 2px;
      }

      .input-yan_zheng_ma {
        width: 138px;
        margin-right: 17px;
      }

      input[type="radio"] {
        width: 14px;
        height: 14px;
        padding: 0;
        background: #ffffff;
        border: none;
        box-shadow: none;
        border-radius: none;
        margin-right: 14px;
      }

      input[type="radio"]:checked+span {
        color: #fff;
      }

      .kai_hu_hang {
        color: #777;
        font-size: 14px;
        cursor: pointer;
      }

      .text-right {
        text-align: right;
        font-size:14px;
      }

      .text-left {
        text-align: left;
        padding-left: 20px;
        position: relative;
        p.attention{
          margin-top:5px;
          font-size: 12px;
          color: #777777;
        }
        span.send {
          width:78px;
          height:32px;
          line-height:32px;
          text-align:center;
          display:inline-block;
          border: 1px solid #454545;
          border-radius:2px;
          font-size:12px;
          cursor: pointer;
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
    }

    .yong_hu_tiao_kuan-wrap {
      display:-webkit-box;
      -webkit-box-pack:center;
      padding: 60px 0;

      .yong_hu_tiao_kuan {
        text-align: center;
        margin-bottom: 20px;
      }

      .btn-wrap {
        display: -webkit-box;

        button {
          display: block;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          border-radius:2px;
        }

        .reg-btn {
          width: 140px;
          height: 44px;
          background-image: linear-gradient(-180deg, #eb5228 0%, #c14726 100%);
          margin-right: 32px;
          margin-left: 42px;
        }

        .cancel-btn {
          width: 140px;
          height: 44px;
          border: 1px solid #454545;
          background: #252525;
        }
      }
    }
  }
  @media screen and (max-width:500px) {
    .reg {
      .reg-table {
        tbody {
          td {
            &:first-child {
              width: 25%;
            }
          }
        }
      }
    }
  }
</style>
