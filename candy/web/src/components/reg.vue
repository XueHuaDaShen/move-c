<template>
  <div class="reg">
    <div class="reg-wrap">
      <p class="router-tag">{{$t("message.zhu_ce")}}</p>
      <table class="reg-table">
        <!-- <tbody>
          <tr>
            <td class="text-right">{{$t("message.phone")}}：</td>
            <td class="text-left">
              <input type="text" class="input-phone" v-model.trim="phone" :placeholder="$t('message.qing_shu_ru')+$t('message.phone')">
            </td>
          </tr>
          <tr>
            <td class="text-right">{{$t("message.email")}}：</td>
            <td class="text-left">
              <input type="text" class="input-email" v-model.trim="lowerEmail" :placeholder="$t('message.qing_shu_ru')+$t('message.email')">
            </td>
          </tr>
          <tr>
            <td class="text-right">{{$t("message.birth")}}：</td>
            <td class="text-left">
              <el-date-picker :picker-options="pickerDisabled" class="input-birth" v-model="birth" type="date" format="dd-MM-yyyy" :placeholder="$t('message.qing_xuan_ze')+$t('message.birth')"></el-date-picker>
            </td>
          </tr>
          <tr>
            <td class="text-right">{{$t("message.reg_firstname")}}：</td>
            <td class="text-left">
              <input type="text" class="input-firstname" v-model="firstname" :placeholder="$t('message.qing_shu_ru')+$t('message.reg_firstname')">
            </td>
          </tr>
          <tr>
            <td class="text-right">{{$t("message.lastname")}}：</td>
            <td class="text-left">
              <input type="text" class="input-lastname" v-model="lastname" :placeholder="$t('message.qing_shu_ru')+$t('message.lastname')">
            </td>
          </tr>
        </tbody> -->
        <tbody>
          <tr>
            <td class="text-right">{{$t("message.username")}}：</td>
            <td class="text-left">
              <input type="text" class="input-username" v-model.trim="loginname" :placeholder="$t('message.qing_shu_ru')+$t('message.username')">
            </td>
          </tr>
          <tr>
            <td class="text-right padding-top-0"></td>
            <td class="text-left padding-top-0">
              <p>{{$t('message.username_ruler')}}</p>
            </td>
          </tr>
          <tr>
            <td class="text-right">{{$t("message.login_pwd")}}：</td>
            <td class="text-left">
              <input type="password" class="input-password" v-model.trim="password" :placeholder="$t('message.qing_shu_ru')+$t('message.login_pwd')">
            </td>
          </tr>
          <tr>
            <td class="text-right padding-top-0"></td>
            <td class="text-left padding-top-0">
              <p>{{$t('message.password_ruler')}}</p>
            </td>
          </tr>
          <tr>
            <td class="text-right">{{$t("message.confirm_pwd")}}：</td>
            <td class="text-left">
              <input type="password" class="input-password" v-model.trim="confirm_password" :placeholder="$t('message.qing_shu_ru')+$t('message.confirm_pwd')">
            </td>
          </tr>
          <tr>
            <td class="text-right">{{$t("message.yan_zheng_ma")}}：</td>
            <td class="text-left">
              <input type="text" class="input-yan_zheng_ma" v-model.trim="captcha" :placeholder="$t('message.qing_shu_ru')+$t('message.yan_zheng_ma')">
              <span class="code" v-html="captcha_text" @click="getCodeFn"></span>
            </td>
          </tr>
        </tbody>
        <!-- <tbody>
          <tr v-for="(item, b) in bankList" :key="b">
            <td class="text-right"><div v-if="b==0">{{$t("message.kai_hu_yin_hang")}}：</div></td>
            <td class="text-left">
              <label :for="'kai_hu_hang_'+b" class="kai_hu_hang">
                <input type="radio" v-model.trim="bank" :value="item.bank" name="kai_hu_hang" :id="'kai_hu_hang_'+b">
                <span>{{item.bank}}</span>
              </label>
            </td>
          </tr>
          <tr>
            <td class="text-right">{{$t("message.account_name")}}：</td>
            <td class="text-left">
              <input type="text" class="input-account_name" v-model.trim="account_name" :placeholder="$t('message.qing_shu_ru')+$t('message.account_name')">
            </td>
          </tr>
          <tr>
            <td class="text-right">{{$t("message.yin_hang_ka_hao")}}：</td>
            <td class="text-left">
              <input type="text" class="input-yin_hang_ka_hao" v-model.trim="card_no" :placeholder="$t('message.qing_shu_ru')+$t('message.yin_hang_ka_hao')">
            </td>
          </tr>
          <tr>
            <td class="text-right">{{$t("message.yan_zheng_ma")}}：</td>
            <td class="text-left">
              <input type="text" class="input-yan_zheng_ma" v-model.trim="captcha" :placeholder="$t('message.qing_shu_ru')+$t('message.yan_zheng_ma')">
              <span class="code" v-html="captcha_text" @click="getCodeFn"></span>
            </td>
          </tr>
        </tbody> -->
      </table>
      <div class="yong_hu_tiao_kuan-wrap">
        <!-- <p class="yong_hu_tiao_kuan">{{$t("message.yong_hu_tiao_kuan")}}</p>
        <div class="yong_hu_tiao_kuan-desc-wrap">
          <p>{{$t("message.yong_hu_tiao_kuan_title")}}</p>
          <p>{{$t("message.yong_hu_tiao_kuan_desc")}}</p>
        </div>
        <p class="habit">
          <label for="remeber-box" class="rem-label">
            <input type="checkbox" id="remeber-box" class="remember" :checked="isAgree" v-model="isAgree">
            <em class="copy_checkbox"></em>
            <span>{{$t("message.agree")+$t("message.yong_hu_tiao_kuan")}}</span>
          </label>
        </p> -->
        <div class="btn-wrap">
          <button class="reg-btn" @click="toReg">{{$t("message.zhu_ce")}}</button>
          <button class="cancel-btn">{{$t("message.cancel")}}</button>
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
    name: "reg",
    components: {},
    props: {},
    data() {
      return {
        consoleFn: this.$store.state.consoleFn,
        isAgree: false,
        guid: "",
        captcha_text: "",

        bankList: [],
        pickerDisabled:  {  //验证时间范围
          disabledDate:(time)=>{
            let beginVal = new Date();
            if(beginVal) { 
              return time.getTime() > beginVal;
            }
          }
        },
        phone: "",
        email: "",
        birth: "",
        firstname: '',
        lastname: '',
        loginname: "",
        password: "",
        confirm_password: "",
        bank: "",
        account_name: "",
        card_no: "",
        captcha: ""
      };
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {
      lowerEmail: {
        get() {
          return this.email;
        },
        set(val) {
          this.email = val.toLowerCase();
        }
      }
    },
    created() {
      // console.log('ok')
      this.getClickLinkPeopleCount();
      this.getCodeFn();
      this.handleKeyup();
      this.getBanklistFn();
    },
    mounted() {},
    methods: {
      //点击链接的人数统计
      getClickLinkPeopleCount() {
        let code = this.$route.params[0];
        this.$http.get("/report/create", {
          params: {
            code: code
          }
        })
        .then(function (res) {
          console.log(res)
        })
        .then(function (error) {
          // console.log(error)
        });
      },
      // 生成 UUID
      getGuid() {
        // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      },
      getBanklistFn() {
        this.$http.get("/platform/bank/list", {})
        .then(function (res) {
          if(res.data.returncode == 200){
            this.bankList = res.data.data;
          }else{
            this.bankList = [];
          }
        })
        .then(function (error) {
          // console.log(error)
        });
      },
      getCodeFn() {
        this.guid = this.getGuid();
        this.$http.get("/user/captcha", {
          params: {
            id: this.guid
          }
        })
        .then(function (res) {
          this.captcha_text = res.data;
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
            vm.toReg();
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
      toReg() {
        const vm = this;
        let code = this.$route.params[0];
        // if (
        //   !this.phone ||
        //   !this.email ||
        //   !this.birth ||
        //   !this.firstname ||
        //   !this.lastname ||
        //   !this.loginname ||
        //   !this.password ||
        //   !this.confirm_password ||
        //   !this.bank ||
        //   !this.account_name ||
        //   !this.card_no
        // ) {
        //   alert(vm.$t("message.bu_chong_zi_liao"));
        //   return false;
        // }
        // if (!validator.cellphone(this.phone)) {
        //   this.$message({
        //     message: this.$t("message.phone") + this.$t("message.ge_shi_bu_zheng_que"),
        //     center: true,
        //     type: "error",
        //     duration: 1500
        //   });
        //   return false;
        // }
        // if (!validator.email(this.email)) {
        //   this.$message({
        //     message: this.$t("message.email") + this.$t("message.ge_shi_bu_zheng_que"),
        //     center: true,
        //     type: "error",
        //     duration: 1500
        //   });
        //   return false;
        // }
        if (!this.loginname) {
          this.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.username"), 'error', 1500, this);
          return false;
        }
        if (!this.password) {
          this.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.password"), 'error', 1500, this);
          return false;
        }
        if (!this.confirm_password) {
          this.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.confirm_pwd"), 'error', 1500, this);
          return false;
        }
        if (!this.captcha) {
          this.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.yan_zheng_ma"), 'error', 1500, this);
          return false;
        }
        if (!validator.regexpInput(this.loginname)) {
          this.$store.state.message(this.$t("message.username") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, this);
          return false;
        }
        if (!validator.regexpPsd(this.password)) {
          this.$store.state.message(this.$t("message.password") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, this);
          return false;
        }
        // if (!validator.bankCard(this.card_no)) {
        //   this.$message({
        //     message: this.$t("message.yin_hang_ka_hao") +
        //       this.$t("message.ge_shi_bu_zheng_que"),
        //     center: true,
        //     type: "error",
        //     duration: 1500
        //   });
        //   return false;
        // }
        if (this.password !== this.confirm_password) {
          this.$store.state.message(this.$t("message.mi_ma_bu_yi_zhi"), 'error', 1500, this);
          return false;
        }
        // if (!this.isAgree) {
        //   alert(vm.$t("message.tong_yi_xie_yi"));
        //   return false;
        // }
        this.$http.post('/user/register', paramCryptFn({
          // phone: this.phone,
          // email: this.email,
          // birth: this.birth,
          // firstname: this.firstname,
          // lastname: this.lastname,
          loginname: this.loginname,
          password: MD5(this.password),
          // bank: this.bank,
          // account_name: this.account_name,
          // card_no: this.card_no,
          captcha: this.captcha,
          code: code,
          id: this.guid
        }), {
          emulateJSON: true
        }).then(res => {
          let code = res.data.returncode;
          if (code == 200) {
            let data = res.data.data;
            localStorage.setItem('candy-login', 'true');
            localStorage.setItem('candy-cash', data.cash);
            localStorage.setItem('candy-cash_credit', data.cash_credit);
            localStorage.setItem('candy-loginname', data.loginname);
            localStorage.setItem('candy-token', data.token);
            localStorage.setItem('candy-loginid', data._id);
            localStorage.setItem('candy-type', data.type);
            vm.$router.push({
              name: 'home'
            })
          } else if (code == '302') {
            vm.$store.state.message(vm.$t("message.yan_zheng_ma_cuo_wu"), 'error', 1500, vm);
            vm.getCodeFn();
          } else if (code == '307') {
            vm.$store.state.message(vm.$t("message.yan_zheng_ma_guo_qi"), 'error', 1500, vm);
            vm.getCodeFn();
          } else if (code == '301') {
            vm.$store.state.message(vm.$t("message.xi_tong_cuo_wu"), 'error', 1500, vm);
          } else if (code == '305') {
            vm.$store.state.message(vm.$t("message.yong_hu_ming_yi_cun_zai"), 'error', 1500, vm);
          } else if (code == '308') {
            vm.$store.state.message(vm.$t("message.lian_jie_chu_cuo"), 'error', 1500, vm);
          }
          vm.consoleFn(res)
        }).then(err => {})
      }
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
      line-height:32px;
      padding: 0 20px;
      background: #ffffff;
      border: 1px solid #979797;
      box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.5);
      font-size: 14px;
      color: #777777;
      border-radius: 2px;
    }
    .el-input__icon{
      line-height:32px;
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
      // max-width:1200px;
      padding: 0 10px;
      width: 100%;
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

          &:last-child {
            td {
              padding-bottom: 60px;
              border-bottom: 1px solid #454545;
            }
          }
        }
      }

      td {
        padding-top: 20px;
      }
      .padding-top-0{
        padding-top:0;
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
        margin-right: 20px;
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
      }

      .text-left {
        text-align: left;
        padding-left: 22px;
        position: relative;

        span.code {
          position: absolute;
          transform: scale(0.6);
          margin-top: -10px;
          left: 138px;
          cursor: pointer;
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
          }

          input[type="checkbox"]:checked+em.copy_checkbox {
            background: url("../assets/img/check-box-ed.png") no-repeat;
            background-size: 100% 100%;
          }

          .copy_checkbox {
            position: absolute;
            left: 0;
            top: 0;
            width: 20px;
            height: 20px;
            background: url("../assets/img/check-box.png") no-repeat;
            background-size: 100% 100%;
            z-index: 2;
          }

          span {
            display: block;
            margin-left: 10px;
            font-size: 14px;
          }

          a.lose {
            color: #c83c4a;
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
        background-image: linear-gradient(-180deg, #eb5228 0%, #c14726 100%);
      }

      .forget-btn {
        border: 1px solid #454545;
        background: #252525;
        margin-left: 20px;
      }
    }
    @media screen and (max-width: 768px){
      .reg-table {
        font-size: 14px;
        input {
          font-size: 12px;
        }

        input[type="radio"]:checked+span {
          color: #fff;
        }

        .kai_hu_hang {
          color: #777;
          font-size: 12px;
          cursor: pointer;
        }

        .text-right {
          text-align: right;
        }
      }
    }

    .yong_hu_tiao_kuan-wrap {
      max-width: 400px;
      padding: 60px 0;
      margin: 0 auto;

      .yong_hu_tiao_kuan {
        text-align: center;
        margin-bottom: 20px;
      }

      .yong_hu_tiao_kuan-desc-wrap {
        border: 1px solid #454545;
        padding: 20px 35px 20px 20px;

        p {
          text-align: left;
          line-height: 20px;

          &:first-child {
            font-size: 14px;
          }

          &:last-child {
            font-size: 12px;
            color: #777;
          }
        }
      }

      .habit {
        width: 100%;
        display: -webkit-box;
        -webkit-box-pack: center;
        -webkit-box-align: center;
        margin: 20px 0;

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
          }

          input[type="checkbox"]:checked+em.copy_checkbox {
            background: url("../assets/img/check-box-ed.png") no-repeat;
            background-size: 100% 100%;
          }

          .copy_checkbox {
            position: absolute;
            left: 0;
            top: 0;
            width: 20px;
            height: 20px;
            background: url("../assets/img/check-box.png") no-repeat;
            background-size: 100% 100%;
            z-index: 2;
          }

          span {
            display: block;
            margin-left: 10px;
            font-size: 14px;
          }

          a.lose {
            color: #c83c4a;
            text-decoration: underline;
          }
        }
      }

      .btn-wrap {
        display: -webkit-box;

        button {
          display: block;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
        }

        .reg-btn {
          width: 60%;
          height: 44px;
          background-image: linear-gradient(-180deg, #eb5228 0%, #c14726 100%);
          margin-right: 20px;
        }

        .cancel-btn {
          -webkit-box-flex: 1;
          height: 44px;
          border: 1px solid #454545;
          background: #252525;
        }
      }
    }
  }

</style>
