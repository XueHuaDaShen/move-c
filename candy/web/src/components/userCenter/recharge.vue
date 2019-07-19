<template>
  <div class="recharge-wrap common">
    <div class="container" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
      <div class="card">
        <div class="card-title">{{$t('message.chong_zhi')}}</div>
        <div class="card-body">
          <p class="tip" v-html="$t('message.chong_zhi_tip')"></p>
          <table class="recharge-table mt-60">
            <tbody>
              <tr>
                <td class="left">
                  <label>{{$t('message.qing_xuan_ze') + $t('message.ru_kuan_yin_hang')}}:</label>
                </td>
                <td class="right">
                  <el-select v-model="rechargeBank" :placeholder="$t('message.qing_xuan_ze') + $t('message.ru_kuan_yin_hang')"
                    :loading-text="$t('message.loading')" :loading="rechargeBankLoading" :no-data-text="$t('message.zan_wu_shu_ju')"
                    @focus="getRechargeBank" @change="rechangeBankChange" :disabled="rechargeFormVisible" popper-class="img-select">
                    <el-option v-for="(item,index) in rechargeBankOptions" :key="index" :value="item._id" :label="item.bank"
                      :title="item.bank">
                      <img class="avatar" :src="item.url" style="height:30px;width:30px;" v-if="item.url">
                      <span :style="{'margin-left':(item.url ? '10px':'')}" style="text-overflow: ellipsis;overflow: hidden;">{{item.bank}}</span>
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.qing_shu_ru') + $t('message.zhuan_zhang_jin_e')}}:</label>
                </td>
                <td class="right">
                  <input id="rechargeCashInput" class="c-input input-small" :placeholder="$t('message.qing_shu_ru') + $t('message.jin_e')"
                    v-model.trim="rechargeCash" @keyup="cashExp('rechargeCashInput')" :readonly="rechargeFormVisible">
                </td>
              </tr>
              <tr class="line-tip">
                <td class="left"></td>
                <td class="right">
                  <span>{{$t('message.chong_zhi_jin_e_tip')}}</span>
                </td>
              </tr>
              <tr class="line-tip" v-show="!rechargeFormVisible">
                <td class="left"></td>
                <td class="right">
                  <button class="recharge-confirm-btn" @click="recharge" :disabled="rechargeFormVisible">{{$t('message.que_ren')}}</button>
                </td>
              </tr>
              <tr class="line-tip" v-show="rechargeFormVisible">
                <td class="left">
                  <label>{{$t('message.qing_shu_ru') + $t('message.zhuan_zhang_time')}}:</label>
                </td>
                <td class="right">
                  <el-select v-model="transfer_at" :placeholder="$t('message.zhuan_zhang_time')">
                    <el-option v-for="(item,index) in pickeroptions" :key="index" :value="item.value" :label="item.text"></el-option>
                  </el-select>
                </td>
              </tr>
              <tr class="text-area" v-show="rechargeFormVisible">
                <td class="left">
                  <label>{{$t('message.bei_zhu_xin_xi')}}:</label>
                </td>
                <td class="right">
                  <textarea class="c-textarea" v-model.trim="message" :placeholder="$t('message.qing_tian_xie_nei_rong')"></textarea>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="recharge-message mt-60" v-show="rechargeFormVisible">
            <div class="message-title">{{$t('message.qing_zhuan_zhang_dao_xia_mian_zhang_hu')}}</div>
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
            <div class="message-row">
              <span class="left">{{$t('message.zhuan_zhang_jin_e')}}</span>
              <span class="right">{{finalRechargeCash | filterCash}} THB</span>
            </div>
          </div>
          <div class="lost-time mt-60" v-show="rechargeFormVisible">
            <div class="desc">{{$t('message.sheng_yu_zhuan_zhang_shi_jian')}}</div>
            <div class="time" v-show="rechargeFormVisible">{{hourString}}:{{minuteString}}:{{secondString}}</div>
          </div>
          <div class="submit-row mt-60" v-show="rechargeFormVisible">
            <button class="confirm" @click="handleConfirm" :disabled="disabled">{{$t('message.que_ren_yi_zhuan_zhang')}}</button>
            <button class="refuse" @click="handleCancel">{{$t('message.fang_qi_zhuan_zhang')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import paramCryptFn from "@/assets/js/cryptData";
  import * as validator from "../../../static/utils/validator.js";
  import moment from "moment";

  export default {
    name: "recharge",
    components: {},
    props: {},
    data() {
      return {
        // 充值银行
        rechargeBank: "",
        rechargeBankOptions: [],
        rechargeBankLoading: false,
        // 倒计时
        countdown: 0,
        timer: null,
        h: "",
        m: "",
        s: "",
        selectedBankItem: {},
        rechargeCash: "",
        finalRechargeCash: "",
        message: "",
        loading: false,
        disabled: false,
        rechargeFormVisible: false, // 当前订单信息不显示
        rechargeDisabled: false,
        confirmId: "", // 订单确认取消id
        transfer_at: "",
        recharge_at: "",
        selectableRange: "",
        pickeroptions: [],
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
    destroyed() {
      clearInterval(this.timer);
    },
    computed: {
      hourString() {
        return this.formatNum(this.h);
      },
      minuteString() {
        return this.formatNum(this.m);
      },
      secondString() {
        return this.formatNum(this.s);
      }
    },
    created() {
      this.rechargeQuery();
    },
    mounted() {},
    methods: {
      // 判断当前用户有没有银行卡
      getBankList(callback) {
        const vm = this;
        // vm.loading = true;
        let url = "/user/account/list";
        vm.$http.get(url, {
          params: {
            status: 0
          }
        }).then(
          response => {
            // vm.loading = false;
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.reLogin(this);
              } else if (status == 200) {
                // vm.noResult = false;
                if(response.body.data.length === 0){
                  vm.$confirm(vm.$t("message.please_bind_card_before_deposit"))
                  .then(_ => {
                    vm.$router.push({
                      name: 'bankAccount'
                    })
                  })
                  .catch(_ => {});
                }else{
                  callback();
                }
              }
            }
          },
          response => {
            // vm.loading = false;
            // vm.noResult = true;
            // vm.list = [];
          }
        );
      },
      getCode() {
        var self = this;
        clearInterval(this.timer);
        this.timer = setInterval(function () {
          if (self.h === 0) {
            if (self.m !== 0 && self.s === 0) {
              self.s = 59;
              self.m -= 1;
            } else if (self.m === 0 && self.s === 0) {
              self.s = 0;
              self.rechargeFormVisible = false;
              clearInterval(self.timer);
              self.resetForm();
            } else {
              self.s -= 1;
            }
          } else {
            if (self.m !== 0 && self.s === 0) {
              self.s = 59;
              self.m -= 1;
            } else if (self.m === 0 && self.s === 0) {
              // self.h -= 1
              // self.m = 59
              // self.s = 59
              self.rechargeFormVisible = false;
              clearInterval(self.timer);
              self.resetForm();
            } else {
              self.s -= 1;
            }
          }
        }, 1000);
      },
      formatNum(num) {
        return num < 10 ? "0" + num : "" + num;
      },
      getRechargeBank(event, queryLog, query) {
        const vm = this;
        if (vm.rechargeBankOptions.length === 0) {
          vm.rechargeBankLoading = true;
          let url = "/platform/account/list";
          vm.$http.get(url, {}).then(
            response => {
              vm.rechargeBankLoading = false;
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
                      } else {
                        obj["url"] = "";
                      }
                      vm.rechargeBankOptions.push(obj);
                    }
                  }
                  // 如果查询到用户订单，为select赋值，且禁止切换
                  if (queryLog) {
                    let selectedOption = vm.rechargeBankOptions.find(item => {
                      return item.loginid === query.receiver_loginid;
                    });
                    vm.rechargeBank = selectedOption._id;
                    vm.selectedBankItem = selectedOption;
                    vm.rechargeCash = query.cash_apply;
                    vm.recharge_at = query.create_at;
                    vm.countdown = query.countdown;
                    for (let i = 0; i < 10; i++) {
                      let timestamp =
                        new Date(vm.recharge_at).getTime() + i * 60 * 1000;
                      vm.pickeroptions.push({
                        text: moment(timestamp).format("DD-MM-YYYY HH:mm"),
                        value: new Date(timestamp)
                      });
                    }
                    // console.log(vm.pickeroptions);
                    if (this.countdown > 0) {
                      this.h = Math.floor((this.countdown / 3600 / 1000) % 24);
                      this.m = Math.floor((this.countdown / 60 / 1000) % 60);
                      this.s = Math.floor((this.countdown / 1000) % 60);
                      this.getCode();
                    }
                    vm.rechargeFormVisible = true;
                  }
                } else {
                  vm.rechargeBankOptions = [];
                  vm.$store.state.message(vm.$t("message.get_recharge_bank_failed") + ":" + status, 'error', 1500, vm);
                }
              }
            },
            response => {
              // console.log('error', error);
              vm.rechargeBankLoading = false;
              vm.rechargeBankOptions = [];
            }
          );
        }
      },
      // 查询用户有无提交未转账订单
      // 若有，返回转账订单信息
      // 若无，返回301
      rechargeQuery() {
        const vm = this;
        let url = "/user/trade/recharge/query";
        vm.loading = true;
        vm.$http.get(url, {}).then(
          response => {
            vm.loading = false;
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.reLogin(this);
              } else if (status == 200) {
                // 用户已提交未转账订单
                // 显示订单信息，并倒计时
                let query = response.body.data;
                let queryLog = true;
                vm.confirmId = query._id;
                vm.finalRechargeCash = query.cash_apply;
                vm.recharge_at = query.create_at;
                vm.getRechargeBank(event, queryLog, query);
                // console.log('data', query);
              } else if (status == 301) {
                // 当前用户没有提交未转账订单
              }
            }
          },
          response => {
            vm.loading = false;
          }
        );
      },
      rechangeBankChange(value) {
        let obj = {};
        obj = this.rechargeBankOptions.find(item => {
          return item._id === value;
        });
        this.selectedBankItem = obj;
      },
      handleConfirm() {
        this.rechargeConfirm();
      },
      handleCancel() {
        this.rechargeCancel();
      },
      // 产生任意2个区间内的随机整数，比如：30-100
      // initNum 初始整数
      cashRadom(initNum, begin, end) {
        let num = Math.round(Math.random() * (end - begin) + begin);
        return Number(initNum) + Number(num / 100);
      },
      recharge() {
        const vm = this;
        // vm.rechargeDisabled = true;
        // setTimeout(() => {
        //   vm.rechargeDisabled = false;
        // }, 1000)
        if (!this.rechargeBank) {
          vm.$store.state.message(vm.$t("message.qing_xuan_ze") + vm.$t("message.ru_kuan_yin_hang"), 'error', 1500, vm);
          return;
        }
        if (!this.rechargeCash) {
          vm.$store.state.message(vm.$t("message.qing_shu_ru") + vm.$t("message.jin_e"), 'error', 1500, vm);
          return;
        }
        const toRecharge = function() {
          vm.loading = true;
          let url = "/user/trade/recharge";
          let finalCash = vm.cashRadom(vm.rechargeCash, 0, 10);
          let data = {
            cash_apply: finalCash,
            accountid: vm.rechargeBank
          };
          vm.$http.post(url, paramCryptFn(data)).then(
            response => {
              vm.loading = false;
              let status = response.body.returncode;
              if (status) {
                if (status == 103 || status == 106 || status == 101) {
                  vm.$store.state.reLogin(vm);
                } else if (status == 200) {
                  // this.$message({
                  //   message: this.$t('message.commit_success'),
                  //   center: true,
                  //   type: 'success',
                  //   duration: 1000
                  // });
                  // this.resetForm();
                  // this.getProfile();
                  let data = response.body.data;
                  vm.confirmId = data._id;
                  vm.finalRechargeCash = data.cash_apply;
                  vm.rechargeCash = data.cash_apply;
                  vm.recharge_at = data.create_at;
                  // console.log('recharge-response', data);
                  vm.countdown = 10 * 60 * 1000;
                  for (let i = 0; i < 10; i++) {
                    let timestamp =
                      new Date(vm.recharge_at).getTime() + i * 60 * 1000;
                    vm.pickeroptions.push({
                      text: moment(timestamp).format("DD-MM-YYYY HH:mm"),
                      value: new Date(timestamp)
                    });
                  }
                  // console.log(vm.pickeroptions);
                  if (vm.countdown > 0) {
                    vm.h = Math.floor((vm.countdown / 3600 / 1000) % 24);
                    vm.m = Math.floor((vm.countdown / 60 / 1000) % 60);
                    vm.s = Math.floor((vm.countdown / 1000) % 60);
                    vm.getCode();
                  }
                  // vm.getCode(response.body.countdown);
                  vm.rechargeFormVisible = true;
                } else {
                  vm.$store.state.message(vm.$t("message.chong_zhi_shi_bai") + ":" + status, 'error', 1500, vm);
                }
              }
            },
            response => {
              console.log("error", error);
              vm.loading = false;
            }
          );
        }
        vm.getBankList(toRecharge)
        // if (!this.message) {
        //   this.$message({
        //     message: this.$t('message.qing_shu_ru') + this.$t('message.bei_zhu_xin_xi'),
        //     center: true,
        //     type: 'error',
        //     duration: 1000
        //   });
        //   return;
        // }
      },
      // 确认充值
      rechargeConfirm() {
        const vm = this;
        vm.disabled = true;
        setTimeout(() => {
          vm.disabled = false;
        }, 1000);
        if (!this.transfer_at) {
          vm.$store.state.message(vm.$t("message.qing_shu_ru") + this.$t("message.zhuan_zhang_time"), 'error', 1500, vm);
          return;
        }
        vm.$confirm(
            vm.$t("message.que_ren_chong_zhi_me"),
            vm.$t("message.que_ren"), {
              confirmButtonText: "OK",
              cancelButtonText: "Cancel",
              type: "warning"
            }
          )
          .then(() => {
            vm.loading = true;
            let url = "/user/trade/recharge/confirm";
            let data = {
              id: vm.confirmId,
              status: 1,
              transfer_at: vm.transfer_at,
              message: vm.message
            };
            console.log("confirm-form", data);
            vm.$http.post(url, paramCryptFn(data)).then(
              response => {
                vm.loading = false;
                let status = response.body.returncode;
                if (status) {
                  if (status == 103 || status == 106 || status == 101) {
                    this.$store.state.reLogin(this);
                  } else if (status == 200) {
                    vm.$store.state.message(vm.$t("message.commit_success"), 'success', 1500, vm);
                    vm.rechargeFormVisible = false;
                    clearInterval(vm.timer);
                    vm.resetForm();
                    this.getProfile();
                    let data = response.body.data;
                    // console.log('confirm-response', data);
                  } else {
                    vm.$store.state.message(vm.$t("message.chong_zhi_shi_bai") + ":" + status, 'error', 1500, vm);
                  }
                }
              },
              response => {
                vm.loading = false;
              }
            );
          })
          .catch(() => {
            // vm.$message({
            //   type: 'info',
            //   message: this.$t('message.chong_zhi') + this.$t('message.yi_qu_xiao')
            // });
          });
      },
      rechargeCancel() {
        const vm = this;
        vm.loading = true;
        let data = {
          id: vm.confirmId,
          status: 3
        };
        // console.log('cancle-form', data);
        let url = "/user/trade/recharge/confirm";
        vm.$http.post(url, paramCryptFn(data)).then(
          response => {
            vm.loading = false;
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.reLogin(this);
              } else if (status == 200) {
                // this.$message({
                //   message: this.$t('message.commit_success'),
                //   center: true,
                //   type: 'success',
                //   duration: 1000
                // });
                vm.rechargeFormVisible = false;
                clearInterval(vm.timer);
                vm.resetForm();
                let data = response.body.data;
                // console.log('cancel-response', data);
              } else if (status == 302) {
                vm.$store.state.message(vm.$t("message.time_not_enough"), 'warning', 1500, vm);
              } else {}
            }
          },
          response => {
            vm.loading = false;
          }
        );
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
          response => {
            vm.loading = false;
          }
        );
      },
      resetForm() {
        // this.rechargeBank = "";
        this.message = "";
        this.rechargeCash = "";
        this.finalRechargeCash = "";
        this.pickeroptions = [];
        this.transfer_at = "";
      },
      // input金额格式限制
      // 只允许小数点和数字，并且小数位最多2位
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
      }
    },
    filters: {
      // 银行卡格式化
      // 每4位空格隔开
      filterCardNo(val) {
        if (val) {
          return val
            .replace(/\s/g, "")
            .replace(/\D/g, "")
            .replace(/(\d{4})(?=\d)/g, "$1 ");
        }
        return "";
      },
      // 金额文本格式化
      // 每千位逗号隔开，不包含小数部分
      filterCash(v) {
        if (v || v === 0) {
          let num = parseFloat(v).toFixed(2);
          //如果num是负数，则获取她的符号
          var sign = "";
          if (Number(num) < 0) {
            sign = "-";
          }
          // 绝对值
          var numAbs = Math.abs(num);
          var decimal = String(numAbs).split(".")[1] || ""; //小数部分
          var tempArr = [];
          var revNumArr = String(numAbs)
            .split(".")[0]
            .split("")
            .reverse(); //倒序
          for (let i in revNumArr) {
            tempArr.push(revNumArr[i]);
            if ((i + 1) % 3 === 0 && i != revNumArr.length - 1) {
              tempArr.push(",");
            }
          }
          var zs = tempArr.reverse().join(""); //整数部分
          return decimal ? sign + zs + "." + decimal : sign + zs;
        }
        return "0";
      }
    }
  };

</script>

<style lang="scss" scoped>
  .recharge-wrap {
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
      line-height: 35px;
    }

    .card-body {
      padding: 37px 20px;
    }

    @media screen and (max-width: 767px) {
      .card-body {
        padding: 20px;
      }
    }

    .recharge-table {
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

          &.right {
            text-align: left;
          }

          >label {
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #191919;
            text-align: right;
          }

          @media screen and(max-width: 767px) {
            &.left {
              padding-right: 10px;
            }
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

    .recharge-confirm-btn {
      padding: 0 10px;
      height: 32px;
      cursor: pointer;
      border: none;
      outline: none;
      width: 236px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      background-image: linear-gradient(-180deg, #eb5228 0%, #c14726 100%);
    }

    .recharge-message {
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
