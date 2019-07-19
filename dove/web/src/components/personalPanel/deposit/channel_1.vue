<template>
  <div class="deposit_channel_1">
    <!-- <pageTitle :title="'deposit'"></pageTitle> -->
    <div class="deposit-inner">
      <div class="user-card">
        <div class="row title">{{$t('message.must_use')}}</div>
        <div class="row mt-30">
          <label align="right" class="flex-col">{{$t('message.account')}}：</label>
          <span class="red flex-col" align="left">{{personalBankData.card_no}}</span>
        </div>
        <div class="row mt-20">
          <label align="right" class="flex-col">{{$t('message.bank')}}：</label>
          <span class="red flex-col" align="left">{{personalBankData.bank}}</span>
        </div>
        <div class="row title mt-30">{{$t('message.for_deposit_only')}}</div>
      </div>
      <div class="user-card mt-30">
        <div class="row title">{{$t('message.transfer_account')}}</div>
        <div class="row mt-30">
          <img :alt="companyBankData.bank" :title="companyBankData.bank" class="bank-image" :src="companyBankData.bankImg">
        </div>
        <div class="row mt-30 flex-justify-between">
          <span>{{$t('message.account_name')}}</span>
          <span class="normal-num">{{companyBankData.firstname +" "+ companyBankData.lastname}}</span>
        </div>
        <div class="row mt-20 flex-justify-between">
          <span>{{$t('message.account_number')}}</span>
          <span class="normal-num">{{companyBankData.card_no}}</span>
        </div>
        <div class="row mt-20 flex-justify-between">
          <span>{{$t('message.bank')}}</span>
          <span class="normal-num">{{companyBankData.bank}}</span>
        </div>
      </div>
      <div class="fill-amount">
        <div class="tip-red mt-30">* {{$t("message.deposit_tip")}}</div>
        <div class="user-tab-line mt-10">{{$t('message.fill_in_amount')}}</div>
        <div class="mt-30">{{$t('message.amount')}}</div>
        <div class="mt-10 input-outer">
          <input class="user-input" v-model.trim="form.amount.val" :placeholder="$t('message.enter_amount')" id="depositInput"
            type="text" v-number-only @change="promotionFocus()">
        </div>
        <!-- <div class="mt-20">{{$t('message.promotions')}}</div>
        <div class="mt-10">
          <el-select class="input-outer" v-model="form.packageid.val" :placeholder="$t('message.select_the_promotion')"
            :no-data-text="$t('message.no_data')" :disabled="promotionDisabled" @change="promotionSelectChange">
            <el-option v-for="(item,index) in packageList" :key="index" :label="getPackageMessage(item)" :value="item._id"></el-option>
          </el-select>
        </div> -->
      </div>
      <div class="mt-40">
        <button class="user-btn deposit-btn" @click="onSubmit()" :disabled="isClick">{{$t('message.confirm_deposit')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
  import pageTitle from "@/components/public/pageTitle";
  import paramCryptFn from "@/assets/js/cryptData";

  export default {
    name: "deposit_channel_1",
    components: {
      pageTitle
    },
    data() {
      return {
        loading: false,
        isClick: false,
        personalBankData: {}, // 自己的提现银行卡账户信息
        companyBankData: {}, // 公司的充值银行卡信息
        // 公司银行卡对应图片信息
        imgArr: [{
            key: "ธนาคารกรุงศรีอยุธยา",
            val: require("@/assets/img/tailand-bank/krungsri_ayudhya_bank.png")
          },
          {
            key: "ธนาคารทหารไทย",
            val: require("@/assets/img/tailand-bank/TMB_Bank.png")
          },
          {
            key: "ธนาคารกสิกรไทย",
            val: require("@/assets/img/tailand-bank/Kasikorn_Bank.png")
          },
          {
            key: "ธนาคารกรุงไทย",
            val: require("@/assets/img/tailand-bank/Krung_Thai_Bank_Public_Company_Limited.png")
          },
          {
            key: "ธนาคารกรุงเทพ",
            val: require("@/assets/img/tailand-bank/Bangkok_Bank.png")
          },
          {
            key: "ธนาคารไทยพาณิชย์",
            val: require("@/assets/img/tailand-bank/Commercial_Bank_of_Thailand.png")
          },
          {
            key: "ธนาคารยูโอบี",
            val: require("@/assets/img/tailand-bank/UOB.png")
          },
          {
            key: "ธนาคารซีไอเอ็มบีไทย",
            val: require("@/assets/img/tailand-bank/CIMB_Thai.png")
          },
          {
            key: "ธนาคารออมสิน",
            val: require("@/assets/img/tailand-bank/Government_Savings_Bank.png")
          },
          {
            key: "ธนาคารธนชาต",
            val: require("@/assets/img/tailand-bank/Thanachart_Bank.png")
          }
        ],
        form: {
          amount: {
            val: "",
            require: true,
            message: "pl_enter_deposit_amount",
            clear: true
          },
          accountid: {
            val: "",
            require: true,
            message: "bank_msg_no_exsits",
            clear: false
          },
          remark: {
            val: "",
            require: false,
            message: "pl_enter_remark",
            clear: true
          },
          // packageid: {
          //   val: "",
          //   require: true,
          //   message: "pl_select_promotion",
          //   clear: true
          // }
        },
        packageList: [], // 优惠券列表
        is_package: false,
        cash: "",
        package_all: false, // 非套餐和套餐是否可以切换
        promotionDisabled: true, // 优惠券select是否可以使用
        init_package: false // 优惠券接口有没有返回的列表有没有数据，默认为空
      };
    },
    directives: {
      numberOnly: {
        bind: function (el, binding, vnode) {
          el.handler = function () {
            vnode.context.form.amount.val = el.value.replace(/^(0+)|[^\d]+/g, "");
          };
          el.addEventListener("compositionend", el.handler);
          el.addEventListener("input", el.handler);
          el.addEventListener("keyup", el.handler);
          el.addEventListener("blur", el.handler);
        },
        unbind: function (el) {
          el.handler = function () {
            vnode.context.form.amount.val = el.value.replace(/^(0+)|[^\d]+/g, "");
          };
          el.removeEventListener("compositionstart", el.handler);
          el.removeEventListener("input", el.handler);
          el.removeEventListener("keyup", el.handler);
          el.removeEventListener("blur", el.handler);
        }
      }
    },
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {},
    beforeMount() {},
    mounted() {
      this.getUserAccount();
      this.getCompanyAccount();
    },
    watch: {
      "form.amount.val"(newVal, oldVal) {
        if (!this.form.amount.val) {
          this.promotionDisabled = true;
        } else {
          this.promotionDisabled = false;
        }
        if (newVal != oldVal) {
          this.packageList = [];
          // this.form.packageid.val = "";
          // this.promotionDisabled = true;
        }
      }
    },
    methods: {
      // 设置当前选项是否可以切换
      // getDisiabled(item) {
      //   const vm = this;
      //   if (vm.is_package) {
      //     // 上次使用了套餐
      //     // 套餐可使用,非套餐不可使用
      //     if (item._id) {
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   } else {
      //     // 上次使用了非套餐
      //     // 非套餐可以使用，套餐不可以使用
      //     if (item._id) {
      //       return false;
      //     } else {
      //       return true;
      //     }
      //   }
      // },
      // 获取用户银行卡账户
      getUserAccount() {
        const vm = this;
        const url = "/trade/user/account";
        vm.loading = true;
        vm.$http.get(url, {}).then(
          response => {
            vm.loading = false;
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.logout(this);
              } else if (status == 200) {
                vm.personalBankData = response.body.data;
              } else {}
            }
          },
          error => {
            console.log("error", error);
            vm.loading = false;
          }
        );
      },
      // 获取公司银行卡账户
      getCompanyAccount() {
        const vm = this;
        const url = "/trade/system/account";
        vm.loading = true;
        vm.$http.get(url, {}).then(
          response => {
            vm.loading = false;
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.logout(this);
              } else if (status == 200) {
                vm.companyBankData = response.body.data;
                // 查找bank对应的银行图标
                let imgObj = vm.imgArr.find(item => {
                  return item.key === vm.companyBankData.bank;
                });
                if (imgObj) {
                  vm.companyBankData["bankImg"] = imgObj.val;
                } else {
                  vm.companyBankData["bankImg"] = "";
                }

                // form accountid 赋值
                vm.form.accountid.val = vm.companyBankData._id;
              } else {}
            }
          },
          error => {
            console.log("error", error);
            vm.loading = false;
          }
        );
      },
      // input金额格式限制
      // 只能输入正整数，输入同时禁止了以0开始的数字输入，防止被转化为其他进制的数值
      cashExp(id) {
        let obj = document.getElementById(id);
        obj.value = obj.value.replace(/^(0+)|[^\d]+/g, "");
      },
      promotionFocus() {
        const vm = this;
        // if (vm.form.amount.val && vm.packageList.length === 0) {
        //   // vm.getPackageList(vm.form.amount.val);
        // }
      },
      // select 选项变化时
      promotionSelectChange(e) {
        // console.log('e', e)
        const vm = this;
        let packageItem = vm.packageList.find(item => {
          return item._id === e;
        });
        // console.log('packageItem', packageItem);
        if (packageItem.disabled) {
          vm.form.packageid.val = "";
          vm.$store.state.message(
            vm.$t("message.package_unavailable"),
            "warning",
            3000,
            vm
          );
        }
      },
      // 优惠券列表
      getPackageList(amount) {
        const vm = this;
        const url = "/trade/deposit/package/list";
        vm.loading = true;
        vm.$http
          .get(url, {
            params: {
              amount: amount
            }
          })
          .then(
            response => {
              vm.loading = false;
              let status = response.body.returncode;
              if (status) {
                if (status == 103 || status == 106 || status == 101) {
                  this.$store.state.logout(this);
                } else if (status == 200) {
                  // 初始化数据，添加一个无优惠券选项
                  vm.packageList = [{
                    _id: "noPro",
                    name: vm.$t('message.no_promotion'),
                    disabled: false
                  }];
                  vm.form.packageid.val = "";
                  let data = response.body.data.packagelist;
                  if (data.length) {
                    vm.init_package = true;
                  } else {
                    vm.init_package = false;
                  }
                  vm.is_package = response.body.data.is_package;
                  vm.cash = response.body.data.cash;
                  // 如果账户余额小于5，套餐或者非套餐都可以使用
                  if (Number(vm.cash) < 5) {
                    vm.package_all = true;
                  } else {
                    vm.package_all = false;
                  }
                  for (let key in data) {
                    let obj = data[key];
                    if (obj.enabled === 1) {
                      vm.packageList.push(obj);
                    }
                  }
                  for (let key2 in vm.packageList) {
                    let obj2 = vm.packageList[key2];
                    if (vm.is_package) {
                      // 上次使用了套餐
                      // 套餐可使用,非套餐不可使用
                      if (vm.package_all) {
                        obj2.disabled = false;
                        continue;
                      }
                      if (obj2._id !== "noPro") {
                        obj2.disabled = false;
                      } else {
                        obj2.disabled = true;
                      }
                    } else {
                      // 上次使用了非套餐
                      // 非套餐可以使用，套餐不可以使用
                      if (vm.package_all) {
                        obj2.disabled = false;
                        continue;
                      }
                      if (obj2._id === "noPro") {
                        obj2.disabled = false;
                      } else {
                        obj2.disabled = true;
                      }
                    }
                  }
                } else {
                  vm.packageList = [];
                }
              }
            },
            error => {
              console.log("error", error);
              vm.loading = false;
              vm.packageList = [];
            }
          );
      },
      // 格式化优惠券提示信息
      getPackageMessage(item) {
        // if (item._id && item._id !== "") {
        //   return `${this.$t("message.deposit")} ${item.amount} , ${this.$t(
        //   "message.get"
        // )} ${item.free}`;
        // }
        return item.name;
      },
      onSubmit() {
        const vm = this;
        let data = {};
        let validate = true;
        for (let key in vm.form) {
          let obj = vm.form[key];
          if (!obj.val && obj.require) {
            vm.$store.state.message(
              vm.$t("message." + obj.message),
              "warning",
              3000,
              vm
            );
            validate = false;
            return;
          }
          data[key] = obj.val;
          if (key === "packageid" && obj.val === "noPro") {
            data["packageid"] = "";
          }
        }
        if (validate) {
          vm.deposit(data);
        }
      },
      // 充值
      deposit(data) {
        const url = "/trade/user/deposit";
        const vm = this;
        // // 优惠券列表返回数据错误
        // if (!vm.packageList.length) {
        //   vm.$store.state.message(
        //     vm.$t("message.pl_refresh_promotion"),
        //     "warning",
        //     3000,
        //     vm
        //   );
        //   return false;
        // }
        // // 优惠券列表返回数组为空数组,并且上次充值是优惠券，另外账户余额大于等于5
        // // 提示没有合适的优惠券供选择，请修改充值金额
        // if (!vm.init_package && vm.is_package && Number(vm.cash) >= 5) {
        //   vm.$store.state.message(
        //     vm.$t("message.pl_modify_amount"),
        //     "warning",
        //     3000,
        //     vm
        //   );
        //   return false;
        // }
        vm.loading = true;
        vm.isClick = true;
        // console.log('data', data);
        vm.$http.post(url, paramCryptFn(data)).then(
          response => {
            vm.loading = false;
            vm.isClick = false;
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.logout(this);
              } else if (status == 200) {
                vm.$store.state.message(
                  vm.$t("message.deposit_success"),
                  "success",
                  1000,
                  vm
                );
                vm.resetForm(vm.form);
                vm.packageList = [];
                vm.is_package = false;
                vm.cash = "";
                vm.package_all = false;
              } else if (status == 303) {
                vm.$store.state.message(vm.$t("message.same_time_deposit_withdrawal"), "error", 3000, vm);
              } else {
                vm.$store.state.message(response.body.data, "error", 3000, vm);
              }
            }
          },
          error => {
            console.log("error", error);
            vm.loading = false;
            vm.isClick = false;
          }
        );
      },
      resetForm(form) {
        for (let key in form) {
          let obj = form[key];
          if (obj.clear) {
            obj.val = "";
          }
        }
      }
    }
  };

</script>
<style lang="scss" scoped>
  .deposit_channel_1 {
    .deposit-inner {
      background: #111111;
      text-align: center;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 30px 0;
      flex-direction: column;
    }

    .bank-image {
      width: auto;
      height: 80px;
    }

    .fill-amount {
      width: 380px;
      text-align: left;
      
      font-size: 14px;
      color: #ababab;
    }

    .input-outer {
      line-height: 36px;
      height: 36px;
      width: 100%;
    }

    .deposit-btn {
      height: 40px;
      line-height: 40px;
    }
    .tip-red{
      color:#E84545;
      font-size:12px;
      font-weight:bold;
    }
  }

</style>
