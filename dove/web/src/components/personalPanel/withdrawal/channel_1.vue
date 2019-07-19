<template>
  <div class="withdrawal">
    <!-- <pageTitle :title="'withdrawal'"></pageTitle> -->
    <div class="withdrawal-inner">
      <!-- <div class="user-card">
        <div class="row title">{{$t('message.you_must_make_at_least')}}</div>
        <div class="row mt-10"><span class="red flex-col" style="font-size:20px;">{{getCash | filterCash}}
            THB</span></div>
        <div class="row title mt-10">{{$t('message.to_withdraw_money_from_the_credit')}}</div>
      </div> -->
      <div class="user-card mt-20 position-re">
        <div class="row title">{{$t('message.current_credit')}}</div>
        <div class="row big-cash mt-10">{{getCash | filterCash}} THB</div>
        <div class="refresh-icon" @click="refreshCash()"></div>
      </div>
      <div class="user-card mt-30">
        <div class="row title">{{$t('message.account')}}</div>
        <div class="row mt-20">
          <img :alt="personalBankData.bank" :title="personalBankData.bank" class="bank-image" :src="personalBankData.bankImg" />
        </div>
        <div class="row mt-20 flex-justify-between">
          <span>{{$t('message.account_name')}}</span>
          <span class="normal-num">{{personalBankData.firstname +" "+ personalBankData.lastname}}</span>
        </div>
        <div class="row mt-20 flex-justify-between">
          <span>{{$t('message.account_number')}}</span>
          <span class="normal-num">{{personalBankData.card_no}}</span>
        </div>
        <div class="row mt-20 flex-justify-between">
          <span>{{$t('message.bank')}}</span>
          <span class="normal-num">{{personalBankData.bank}}</span>
        </div>
      </div>
      <div class="mt-30">
        <button class="user-btn withdrawal-btn" @click="onSubmit()" :disabled="isClick">{{$t('message.confirm_withdrawal')}}</button>
      </div>
    </div>
  </div>
</template>
<script>
  import pageTitle from '@/components/public/pageTitle';
  import paramCryptFn from "@/assets/js/cryptData";

  export default {
    name: 'withdrawal',
    components: {
      pageTitle
    },
    data() {
      return {
        loading: false,
        isClick: false, // 重复提交
        personalBankData: {}, // 自己的提现银行卡账户信息
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
            val: '',
            require: true,
            message: 'amount_is_not_enough',
            clear: false,
          },
          accountid: {
            val: '',
            require: true,
            message: 'bank_msg_no_exsits',
            clear: false,
          },
          remark: {
            val: '',
            require: false,
            message: 'pl_enter_remark',
            clear: true,
          },
        },
      }
    },
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {},
    beforeMount() {},
    computed: {
      // 账户余额
      getCash() {
        return this.$store.state.cash;
      },
      // 账户余额
      getStake() {
        return this.$store.state.stake;
      },
    },
    mounted() {
      this.getUserAccount();
      // 提现金额初始化
      this.form.amount.val = localStorage.getItem('dove-web-cash');
      this.refreshCash();
    },
    watch: {},
    methods: {
      // 获取用户银行卡账户
      getUserAccount() {
        const vm = this;
        const url = '/trade/user/account';
        vm.loading = true;
        vm.$http.get(url, {}).then(response => {
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.logout(this);
            } else if (status == 200) {
              vm.personalBankData = response.body.data;

              // 查找bank对应的银行图标
              let imgObj = vm.imgArr.find(item => {
                return item.key === vm.personalBankData.bank;
              });
              if (imgObj) {
                vm.personalBankData['bankImg'] = imgObj.val;
              } else {
                vm.personalBankData['bankImg'] = "";
              }

              // form accountid 赋值
              vm.form.accountid.val = vm.personalBankData._id;
            } else {

            }
          }
        }, error => {
          console.log('error', error);
          vm.loading = false;
        });
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
      },
      onSubmit() {
        const vm = this;
        let data = {};
        let validate = true;
        for (let key in vm.form) {
          let obj = vm.form[key];
          if (!obj.val && obj.require) {
            vm.$store.state.message(vm.$t('message.' + obj.message), 'warning', 3000, vm);
            validate = false;
            return;
          }
          data[key] = obj.val;
        }
        if (validate) {
          vm.withdrawal(data)
        }
      },
      // 提现
      withdrawal(data) {
        const url = '/trade/user/withdrawal';
        const vm = this;
        // amount > stake ,才可以提现
        // if (Number(vm.form.amount.val) < Number(vm.$store.state.stake)) {
        //   vm.$store.state.message(vm.$t('message.account_not_meets'), 'warning', 3000, vm);
        //   return;
        // }
        vm.isClick = true;
        vm.loading = true;
        vm.$http.post(
          url, paramCryptFn(data)
        ).then(response => {
          vm.loading = false;
          vm.isClick = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.logout(this);
            } else if (status == 200) {
              vm.$store.state.message(
                vm.$t('message.withdrawal_success'),
                'success', 1000, vm);
              vm.resetForm(vm.form);
              vm.refreshCash();
            } else if (status === 302) {
              vm.$store.state.message(vm.$t('message.account_not_meets'), 'error', 3000, vm);
              // vm.$store.state.message(
              //   response.body.data,
              //   'error', 3000, vm);
            } else if (status == 303) {
              vm.$store.state.message(vm.$t("message.same_time_deposit_withdrawal"), "error", 3000, vm);
            } else {
              vm.$store.state.message(
                response.body.data,
                'error', 3000, vm);
            }
          }
        }, error => {
          console.log('error', error);
          vm.loading = false;
          vm.isClick = false;
        });
      },
      resetForm(form) {
        for (let obj in form) {
          if (obj.clear) {
            obj.val = "";
          }
        }
      },
      // 刷新余额
      refreshCash() {
        const url = '/user/profile';
        const vm = this;
        vm.loading = true;
        vm.$http.get(url, {}).then(response => {
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.logout(this);
            } else if (status == 200) {
              let data = response.body.data;
              localStorage.setItem('dove-web-cash', data.cash);
              localStorage.setItem('dove-web-loginname', data.loginname);
              vm.$store.dispatch('setCash', data.cash);
              vm.$store.dispatch('setDoveName', data.loginname);
              // vm.$store.dispatch('setStake', data.stake);
              vm.form.amount.val = data.cash;
            } else if (status === 400) {

            } else {

            }
          }
        }, error => {
          console.log('error', error);
          vm.loading = false;
        });
      },
    }
  }

</script>
<style lang="scss" scoped>
  .withdrawal {

    .withdrawal-inner {
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

    .withdrawal-btn {
      height: 40px;
      line-height: 40px;
    }

    .refresh-icon {
      position: absolute;
      top: 15px;
      right: 14px;
      width: 17px;
      height: 17px;
      cursor: pointer;
      background-image: url('../../../assets/img/home/h-refresh.png');
      background-repeat: no-repeat;
      background-size: cover;
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
  }

</style>
