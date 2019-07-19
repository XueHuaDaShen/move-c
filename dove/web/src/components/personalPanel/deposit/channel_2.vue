<template>
  <div class="deposit_channel_2" v-loading.fullscreen="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="deposit_channel_2-inner">
      <div class="fill-amount">
        <div class="amount-row">
          <div class="flex-col">
            <div class="mt-20">{{$t('message.bank_for_deposit_withdrawal')}} <span class="red" v-if="form.bankid.require">*</span></div>
            <div class="mt-10 input-outer">
              <el-select class="input-outer" v-model="form.bankid.val" :placeholder="$t('message.select_the_bank')"
                :no-data-text="$t('message.no_promotion')">
                <el-option v-for="(item,index) in bankList" :key="index" :label="item.name" :value="item.paysec_code">
                  <span :class="item.name" style="width:30px;height:30px;position:absolute;left:20px;top:50%;margin-top:-15px;"><img
                      :src="item.img" alt=""></span>
                  <span style="float: left; margin-left:40px;">{{item.name}}</span>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="amount-row">
          <div class="flex-col">
            <div class="mt-20">{{$t('message.amount')}} <span class="red" v-if="form.amount.require">*[10 - 500000]</span></div>
            <div class="mt-10 input-outer">
              <input class="user-input" :placeholder="$t('message.enter_amount')" type="text" v-model="form.amount.val" @change="promotionFocus()" />
            </div>
          </div>
        </div>
        <!-- <div class="amount-row">
          <div class="flex-col">
            <div class="mt-20">{{$t('message.promotions')}} <span class="red" v-if="form.packageid.require">*</span></div>
            <div class="mt-10 input-outer">
              <el-select class="input-outer" v-model="form.packageid.val" :placeholder="$t('message.select_the_promotion')"
                :no-data-text="$t('message.no_data')" :disabled="promotionDisabled" @change="promotionSelectChange">
                <el-option v-for="(item,index) in packageList" :key="index" :label="getPackageMessage(item)" :value="item._id"></el-option>
              </el-select>
            </div>
          </div>
        </div> -->
        <div class="mt-60 amount-row pb-20">
          <button class="user-btn deposit-btn" @click="onSubmit()" :disabled="isClick">{{$t('message.next')}}</button>
        </div>
      </div>
    </div>
    <!-- <form action="https://pg-staging.paysec.com/Intrapay/paysec/v1/payIn/sendTokenForm" method="post" class="token-form">
      <input v-if="token" type="text" name="token" :value="token" />
      <input type="submit" value="submit">
    </form> -->
  </div>
</template>
<script>
  import * as validator from "@/assets/js/utils/validator";
  import paramCryptFn from "@/assets/js/cryptData";
import { setTimeout } from 'timers';
import { scrypt } from 'crypto';

  export default {
    name: 'deposit_channel_2',
    data() {
      return {
        is12NumBankId: '5c80ba7aa6f5dc51d2425c83',
        token: '',
        bankList: [], // 支持的银行卡列表
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
        loading: false,
        isClick: false,
        // 表单
        form: {
          bankid: {
            val: '',
            require: true,
            message: 'please_select_bank',
          },
          amount: {
            val: '',
            require: true,
            message: 'pl_enter_deposit_amount',
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
      }
    },
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {
      this.getBankList()
    },
    beforeMount() {},
    mounted() {
      // const vm = this;
      // console.log(this.getBindBank)
      // if (!this.getBindBank) {
      //   // this.$store.state.message('未绑定银行卡', 'warning', 2000, this);
      //   vm.$alert(vm.$t('message.pl_complete_personal_info'), vm.$t('message.message'), {
      //     confirmButtonText: vm.$t('message.confirm'),
      //     lockScroll: false,
      //     callback: action => {}
      //   })
      // }
    },
    watch: {
      "form.amount.val"(newVal, oldVal) {
        if (!this.form.amount.val) {
          this.promotionDisabled = true;
        } else {
          this.promotionDisabled = false;
        }
        // if (newVal != oldVal) {
        //   this.packageList = [];
        //   this.form.packageid.val = "";
        //   // this.promotionDisabled = true;
        // }
      }
    },
    methods: {
      onSubmit() {
        const vm = this;
        let data = {};
        let validate = true;
        let min = 10, max = 500000;
        for (let key in vm.form) {
          let obj = vm.form[key];
          if (!obj.val && obj.require) {
            vm.$store.state.message(vm.$t('message.' + obj.message), 'warning', 3000, vm);
            validate = false;
            return;
          }
          data[key] = obj.val;
          if (key === "packageid" && obj.val === "noPro") {
            data["packageid"] = "";
          }
        }
        if(vm.form.amount.val < min || vm.form.amount.val > max){
          vm.$store.state.message(vm.$t('message.deposit_limit'), 'warning', 3000, vm);
          validate = false;
        }
        if (validate) {
          vm.getDepositToken(data)
        }
      },
      // 获取支付token
      getDepositToken(data) {
        const vm = this;
        vm.loading = true;
        vm.isClick = true;
        this.$http.post('/paysec/payin',paramCryptFn({
          bankCode: data.bankid,
          amount: data.amount,
          // packageid: data.packageid
        }), {
          emulateJSON: true
        }).then(res => {
          let code = res.body.returncode;
          if(code == 200){
            vm.sendDepositToken(res.body.data.token)
          }else if (code == 103 || code == 106 || code == 101) {
            vm.loading = false;
            vm.isClick = false;
            vm.$store.state.logout(vm);
          }else{
            vm.loading = false;
            vm.isClick = false;
            vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.server_error"), 'error', 1500, vm);
          }
          // console.log(res)
        }).then(error => {
          if(error){
            vm.loading = false;
            vm.isClick = false;
          }
        })
      },
      //发送支付token
      sendDepositToken(token) {
        // 发送token的url
        let url;
        let pro_or_test = this.$store.state.pro_or_test;
        if(!pro_or_test){
          url = 'https://pg-staging.paysec.com/Intrapay/paysec/v1/payIn/sendTokenForm' // 测试
        }else{
          url = 'https://payment.allpay.site/api/transfer/v1/payIn/sendTokenForm' // 上线
        }
        token = token;
        let newWindow = window.open();
        newWindow.document.write(
          '<p id="win-p">正在跳转支付中，请勿关闭当前页面...</p>'+
          '<form style="position: absolute;left:0;top:0;z-index:-9999;height:0;width:0;opacity: 0;" action="'+url+'" method="post" class="token-form">'+
            '<input type="text" name="token" value="'+token+'" />'+
            '<input type="submit" value="submit">'+
          '</form>'+
          '<script>'+
            'setTimeout(() => {'+
              'var form = document.getElementsByClassName("token-form")[0];'+
              'form.submit();'+
            '}, 2000)'+
          '<\/script>'
        );
        this.loading = false;
        this.isClick = false;
        // this.$http.post('https://pg-staging.paysec.com/Intrapay/paysec/v1/payIn/sendTokenForm',{
        //   token: token
        // }, {
        //   emulateJSON: true
        // }).then(res => {
        //   console.log(res)
        // })
      },
      // 支持的银行账户列表
      getBankList() {
        const url = '/trade/bank/list';
        const vm = this;
        vm.loading = true;
        vm.$http.get(url, {
          params: {
            channel: 'paysec'
          }
        }).then(response => {
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.logout(this);
            } else if (status == 200) {
              let data = response.body.data;
              for (let key in data) {
                let obj = data[key];
                if (obj.enabled === 1) {
                  // console.log(obj)
                  let imgObj = vm.imgArr.find(item => {
                    return item.key === obj.name;
                  });
                  obj.img = imgObj.val;
                  vm.bankList.push(obj);
                }
              }
            } else if (status === 400) {

            } else {

            }
          }
        }, error => {
          console.log('error', error);
          vm.loading = false;
        });
      },
      promotionFocus() {
        const vm = this;
        if (vm.form.amount.val && vm.packageList.length === 0) {
          vm.getPackageList(vm.form.amount.val);
        }
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
        // vm.loading = true;
        vm.$http
          .get(url, {
            params: {
              amount: amount
            }
          })
          .then(
            response => {
              // vm.loading = false;
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
              // vm.loading = false;
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
    },
    computed: {
      getBindBank() {
        return this.$store.state.isBindBank
      }
    }
  }

</script>
<style lang="scss" scoped>
  .deposit_channel_2 {
    position: relative;
    width: 100%;
    height: 100%;

    .deposit_channel_2-inner {
      background: #111111;
      text-align: center;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 30px 0;
      flex-direction: column;
    }

    .bank-image {
      width: 150px;
      height: 42px;
    }

    .fill-amount {
      width: 420px;
      text-align: left;
      
      font-size: 14px;
      color: #ababab;

      .amount-row {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .input-outer {
      line-height: 36px;
      height: 36px;
      width: 100%;
    }

    .tip {
      text-align: center;
      
      font-size: 16px;
    }

    .red {
      color: #E84545;
    }

    .deposit-btn {
      height: 40px;
      line-height: 40px;
    }
  }
  .token-form{
    position: absolute;
    left:0;
    top:0;
    z-index:-9999;
    height:0;
    width:0;
    opacity: 0;
  }
</style>
