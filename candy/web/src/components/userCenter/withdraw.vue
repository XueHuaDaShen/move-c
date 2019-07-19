<template>
  <div class="withdraw-wrap common">
    <div class="container">
      <div class="card" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="card-title">{{$t('message.ti_xian')}}</div>
        <div class="card-body">
          <p class="tip">
            {{$t('message.ti_xian_tip1')}}
            <br>
            {{$t('message.ti_xian_tip2_1')}}
            {{setting.max_withdraw_times_daily}}{{$t('message.times')}}，{{$t('message.ti_xian_tip2_2')}}
            {{setting.times?setting.times:0}}{{$t('message.times')}}
            <br>
            {{$t('message.ti_xian_tip3_1')}}{{setting.min_withdraw_every_time}}{{$t('message.unit')}}，
            {{$t('message.ti_xian_tip3_2')}}{{setting.max_withdraw_every_time}}{{$t('message.unit')}}
          </p>
          <table class="withdraw-table mt-60">
            <tbody>
              <tr>
                <td class="left">
                  <label>{{$t('message.qing_xuan_ze') + $t('message.your_account')}}:</label>
                </td>
                <td class="right">
                  <el-select popper-class="img-select" ref="select" v-model="withdrawBank" :placeholder="$t('message.qing_xuan_ze') + $t('message.your_account')"
                    :loading-text="$t('message.loading')" :loading="withdrawBankLoading" :no-data-text="$t('message.please_bind_card_before_withdraw')"
                    @focus="getWithdrawBank" @change="withdrawBankChange">
                    <el-option v-for="(item,index) in withdrawBankOptions" :key="index" :value="item._id" :label="item.bank"
                      :title="item.bank">
                      <img class="avatar" :src="item.url" style="height:30px;width:30px;" v-if="item.url">
                      <span :style="{'margin-left':(item.url ? '10px':'')}" style="text-overflow: ellipsis;overflow: hidden;">{{item.bank}}</span>
                    </el-option>
                  </el-select>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="withdraw-message mt-60" v-show="withdrawBank">
            <div class="message-title">{{$t('message.withdraw_to_xia_mian_account')}}</div>
            <div class="message-row">
              <span class="left"></span>
              <span class="right">{{selectedBankItem.bank}}</span>
            </div>
            <div class="message-row">
              <span class="left">{{$t('message.account_name')}}</span>
              <span class="right">{{selectedBankItem.account_name}}</span>
            </div>
            <div class="message-row">
              <span class="left">{{$t('message.zhang_hao')}}</span>
              <span class="right">{{selectedBankItem.card_no | filterCardNo}}</span>
            </div>
          </div>
          <table class="withdraw-table mt-60" v-show="withdrawBank">
            <tbody>
              <tr>
                <td class="left">
                  <label>{{$t('message.ti_xian_jin_e')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" v-model.trim="withdrawCash" :placeholder="$t('message.qing_shu_ru') + $t('message.jin_e')"
                    type="text" id="withdraw_input" @keyup="cashExp('withdraw_input')">
                  <p class="widthdraw-tip-text">
                    {{$t("message.ke_ti_xian")}}
                    <em>
                      {{(userCash-userCcedit)>0 ?
                      (userCash-userCcedit).toFixed(2) : 0}}
                    </em>
                  </p>
                </td>
              </tr>
              <tr class="text-area">
                <td class="left">
                  <label>{{$t('message.bei_zhu_xin_xi')}}:</label>
                </td>
                <td class="right">
                  <textarea class="c-textarea" v-model.trim="message" :placeholder="$t('message.qing_tian_xie_nei_rong')"></textarea>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="submit-row mt-60" v-show="withdrawBank">
            <button class="confirm" @click="handleConfirm" :disabled="disabled">{{$t('message.que_ren_shen_qing')}}</button>
            <button class="refuse" @click="handleCancel">{{$t('message.fang_qi_shen_qing')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import paramCryptFn from "@/assets/js/cryptData";

  export default {
    name: "withdraw",
    components: {},
    props: {},
    data() {
      return {
        withdrawBank: "",
        withdrawBankOptions: [],
        withdrawBankLoading: false,
        withdrawCash: "",
        message: "",
        loading: false,
        selectedBankItem: {},
        setting: {},
        userCash: 0,
        userCcedit: 0,
        disabled: false,
        imgArr: [{
            key: "ธนาคารกรุงศรีอยุธยา",
            val: require("../../assets/img/tailand-bank/krungsri_ayudhya_bank.png")
          },
          {
            key: "ธนาคารทหารไทย",
            val: require("../../assets/img/tailand-bank/TMB_Bank.png")
          },
          {
            key: "ธนาคารกสิกรไทย",
            val: require("../../assets/img/tailand-bank/Kasikorn_Bank.png")
          },
          {
            key: "ธนาคารกรุงไทย",
            val: require("../../assets/img/tailand-bank/Krung_Thai_Bank_Public_Company_Limited.png")
          },
          {
            key: "ธนาคารกรุงเทพ",
            val: require("../../assets/img/tailand-bank/Bangkok_Bank.png")
          },
          {
            key: "ธนาคารไทยพาณิชย์",
            val: require("../../assets/img/tailand-bank/Commercial_Bank_of_Thailand.png")
          },
          {
            key: "ธนาคารยูโอบี",
            val: require("../../assets/img/tailand-bank/UOB.png")
          },
          {
            key: "ธนาคารซีไอเอ็มบีไทย",
            val: require("../../assets/img/tailand-bank/CIMB_Thai.png")
          },
          {
            key: "ธนาคารออมสิน",
            val: require("../../assets/img/tailand-bank/Government_Savings_Bank.png")
          },
          {
            key: "ธนาคารธนชาต",
            val: require("../../assets/img/tailand-bank/Thanachart_Bank.png")
          }
        ]
      };
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      this.getProfile();
    },
    mounted() {
      this.getWithdrawSetting();
    },
    methods: {
      cashExp(id) {
        let obj = document.getElementById(id);
        obj.value = obj.value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
        obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        obj.value = obj.value
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".");
        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
        if (obj.value.indexOf(".") < 0 && obj.value != "") {
          //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          obj.value = parseFloat(obj.value);
        }
        if (id === "withdraw_input") {
          let cash_max = this.userCash - this.userCcedit;
          if (cash_max) {
            // console.log('obj.value', obj.value);
            if (Number(obj.value) > cash_max) {
              this.withdrawCash =
                cash_max > 0 ? cash_max.toFixed(2).toString() : 0;
            }
          }
        }
      },
      getWithdrawBank() {
        const vm = this;
        if (vm.withdrawBankOptions.length === 0) {
          vm.withdrawBankLoading = true;
          let url = "/user/account/list";
          vm.$http.get(url, {}).then(
            response => {
              vm.withdrawBankLoading = false;
              let status = response.body.returncode;
              if (status) {
                if (status == 103 || status == 106 || status == 101) {
                  this.$store.state.reLogin(this);
                } else if (status == 200) {
                  let data = response.body.data;
                  for (let i = 0; i < data.length; i++) {
                    let obj = data[i];
                    if (obj.status === 0) {
                      let imgObj = vm.imgArr.find(item => {
                        return item.key === obj.bank;
                      });
                      if (imgObj) {
                        obj["url"] = imgObj.val;
                        // let path = vm.$refs.select.selectedLabel
                        // vm.$refs.select.$el.children[0].children[1].setAttribute('style', 'background:url(' + path +
                        //   ') no-repeat;color:#fff');
                      } else {
                        obj["url"] = "";
                      }
                      vm.withdrawBankOptions.push(obj);
                    }
                  }
                } else {
                  vm.withdrawBankOptions = [];
                  vm.$store.state.message(vm.$t("message.get_withdraw_bank_failed") + ":" + status, 'error', 1500, vm);
                }
              }
            },
            response => {
              vm.withdrawBankLoading = false;
              vm.withdrawBankOptions = [];
            }
          );
        }
      },
      handleConfirm() {
        this.withdraw();
      },
      handleCancel() {
        this.resetForm();
      },
      withdraw() {
        const vm = this;
        vm.disabled = true;
        setTimeout(() => {
          vm.disabled = false;
        }, 1000);
        if (!this.withdrawBank) {
          vm.$store.state.message(vm.$t("message.qing_xuan_ze") + vm.$t("message.your_account"), 'error', 1500, vm);
          return;
        }
        if (!this.withdrawCash) {
          vm.$store.state.message(vm.$t("message.qing_shu_ru") + vm.$t("message.jin_e"), 'error', 1500, vm);
          return;
        }
        if (
          this.withdrawCash < vm.setting.min_withdraw_every_time ||
          this.withdrawCash > vm.setting.max_withdraw_every_time
        ) {
          vm.$store.state.message(vm.$t("message.ti_xian_jin_e") + vm.$t("message.chao_chu_fan_wei"), 'error', 1500, vm);
          return;
        }
        /* if (!this.message) {
            this.$message({
              message: this.$t('message.qing_shu_ru') + this.$t('message.bei_zhu_xin_xi'),
              center: true,
              type: 'error',
              duration: 1000
            });
            return;
          } */
        vm.$confirm(
            vm.$t("message.que_ren_ti_xian_me"),
            vm.$t("message.que_ren"), {
              confirmButtonText: "OK",
              cancelButtonText: "Cancel",
              type: "warning"
            }
          )
          .then(() => {
            vm.loading = true;
            let url = "/user/trade/withdraw";
            console.log("data", {
              cash_apply: this.withdrawCash,
              accountid: this.withdrawBank,
              message: this.message
            });
            vm.$http
              .post(
                url,
                paramCryptFn({
                  cash_apply: this.withdrawCash,
                  accountid: this.withdrawBank,
                  message: this.message
                })
              )
              .then(
                response => {
                  vm.loading = false;
                  let status = response.body.returncode;
                  if (status) {
                    if (status == 103 || status == 106 || status == 101) {
                      this.$store.state.reLogin(this);
                    } else if (status == 200) {
                      vm.$store.state.message(vm.$t("message.commit_success"), 'success', 1500, vm);
                      this.resetForm();
                      this.getProfile();
                      this.getWithdrawSetting();
                    } else if (status == 302) {
                      // 提现金额超出账户最大值
                      vm.$store.state.message(vm.$t("message.withdraw_cash_beyond_max"), 'error', 1500, vm);
                    } else {
                      vm.$store.state.message(vm.$t("message.withdraw_apply_failed") + ":" + status, 'error', 1500, vm);
                    }
                  }
                },
                response => {
                  console.log("error", error);
                  vm.loading = false;
                }
              );
          })
          .catch(() => {
            vm.$store.state.message(vm.$t("message.ti_xian") + vm.$t("message.yi_qu_xiao"), 'info', 1500, vm);
          });
      },
      getProfile() {
        const vm = this;
        this.$http.get("/user/profile", {}).then(
          response => {
            vm.loading = false;
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.reLogin(this);
              } else if (status == 200) {
                let data = response.body.data;
                vm.userCash = data.cash;
                vm.userCcedit = data.cash_credit;
                localStorage.setItem("candy-cash", data.cash);
                localStorage.setItem("candy-birthday", data.birthday||'');
                this.$store.dispatch("setCash", data.cash);
                localStorage.setItem("candy-cash_credit", data.cash_credit);
                localStorage.setItem("candy-loginname", data.loginname);
                localStorage.setItem("candy-loginid", data._id);
                localStorage.setItem("candy-phone", data.phone);
                localStorage.setItem("candy-email", data.email);
                localStorage.setItem("candy-lineid", data.lineid);
                localStorage.setItem("candy-firstname", data.firstname);
                localStorage.setItem("candy-lastname", data.lastname);
                if (data.superiorid) {
                  if (data.superiorid.phone) {
                    localStorage.setItem(
                      "candy-superiorphone",
                      data.superiorid.phone
                    );
                  }
                  if (data.superiorid.lineid) {
                    localStorage.setItem(
                      "candy-superiorlineid",
                      data.superiorid.lineid
                    );
                  }
                }
                localStorage.setItem("candy-type", data.type);
              } else {
                vm.$store.state.message(vm.$t("message.update_profile_failed"), 'error', 1500, vm);
              }
            }
          },
          error => {
            // console.log('error', error);
            vm.loading = false;
          }
        );
      },
      getWithdrawSetting() {
        const vm = this;
        vm.loading = true;
        vm.$http.get("/pay/setting", {}).then(
          response => {
            // console.log('response', response);
            vm.loading = false;
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.reLogin(this);
              } else if (status == 200) {
                vm.setting = response.body.data;
              } else {
                vm.$store.state.message(vm.$t("message.get_withdraw_rule_failed") + ":" + status, 'error', 1500, vm);
              }
            }
          },
          error => {
            // console.log('error', error);
            vm.loading = false;
          }
        );
      },
      resetForm() {
        // this.rechargeBank = "";
        this.message = "";
        this.withdrawCash = "";
      },
      withdrawBankChange(value) {
        let obj = {};
        obj = this.withdrawBankOptions.find(item => {
          return item._id === value;
        });
        this.selectedBankItem = obj;
      }
    },
    filters: {
      filterCardNo(val) {
        if (val) {
          return val
            .replace(/\s/g, "")
            .replace(/\D/g, "")
            .replace(/(\d{4})(?=\d)/g, "$1 ");
        }
        return "";
      }
    }
  };

</script>

<style lang="scss" scoped>
  .withdraw-wrap {
    background: #efefef;
    padding: 60px 0;

    .tip {
      background: #ffffe1;
      border: 1px solid #d0d0d0;
      padding: 20px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #191919;
      text-align: left;
      line-height: 17px;
    }

    .card-body {
      padding: 37px 20px;
    }

    @media screen and (max-width: 767px) {
      .card-body {
        padding: 20px;
      }
    }

    .withdraw-table {
      width: 100%;
      display: table;
      font-size: 16px;

      tr {
        td {
          padding-top: 20px;

          &.left {
            width: 46%;
            text-align: right;
            padding-right: 20px;
          }

          @media screen and(max-width: 767px) {
            &.left {
              padding-right: 10px;
            }
          }

          &.right {
            text-align: left;

            .widthdraw-tip-text {
              font-size: 12px;

              em {
                color: #c93a4c;
              }
            }
          }

          >label {
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #191919;
            text-align: right;
          }
        }

        &:first-child {
          td {
            padding-top: 0;
          }
        }

        &.line-tip {
          td {
            padding-top: 10px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #777777;
          }
        }

        &.text-area {
          td.left {
            vertical-align: top;
          }
        }
      }
    }

    .withdraw-message {
      max-width: 396px;
      margin-left: auto;
      margin-right: auto;

      .message-title {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #191919;
        text-align: left;
        margin-bottom: 20px;
      }

      .message-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #d0d0d0;
        height: 40px;

        .left {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #191919;
          text-align: left;
        }

        .right {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #c59a37;
          text-align: right;
        }
      }
    }

    .lost-time {
      .desc {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #777777;
      }

      .time {
        font-family: PingFangSC-Medium;
        font-size: 26px;
        color: #eb5228;
        margin-top: 10px;
      }
    }

    .submit-row {
      margin-left: auto;
      margin-right: auto;
      max-width: 396px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .confirm {
        background-image: linear-gradient(-180deg, #eb5228 0%, #c14726 100%);
      }

      .refuse {
        background-image: linear-gradient(-180deg, #afafaf 0%, #777777 100%);
      }

      >button {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        width: 145px;
        height: 44px;
        line-height: 44px;
        cursor: pointer;
      }
    }
  }

</style>
