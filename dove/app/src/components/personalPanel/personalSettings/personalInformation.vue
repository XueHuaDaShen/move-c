<template>
  <div class="personalInformation" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <div class="personalInformation-inner">
      <p class="tip red">( * {{$t('message.is_required')}} )</p>
      <div class="user-card mt-30">
        <!-- <div class="row title">Transfer Account</div> -->
        <div class="row flex-justify-between">
          <span>{{$t('message.username')}}</span>
          <span class="normal-num red">{{getDoveName}}</span>
        </div>
        <!-- <div class="row mt-20 flex-justify-between">
          <span>{{$t('message.mobile_account_name')}}</span>
          <span class="normal-num red">{{getMobileDoveName}}@kgs9</span>
        </div>
        <div class="row mt-20">
          <span class="normal-num">({{$t('message.mobile_tip')}})</span>
        </div> -->
      </div>
      <div class="fill-amount">
        <div class="title insert-to-bottom-line mt-60" style="text-align:left;">{{$t('message.personal_information')}}</div>
        <div class="amount-row">
          <div class="flex-col">
            <div class="mt-30 label">{{$t('message.first_name')}} <span class="red">*</span></div>
            <div class="mt-10 input-outer">
              <input class="user-input flex-col" type="text" :placeholder="$t('message.enter_first_name')" v-model="form.firstname.val"
                :readonly="form.firstname.had" />
            </div>
          </div>
        </div>
        <div class="amount-row">
          <div class="flex-col">
            <div class="mt-20 label">{{$t('message.last_name')}} <span class="red">*</span></div>
            <div class="mt-10 input-outer">
              <input class="user-input flex-col" type="text" :placeholder="$t('message.enter_last_name')" v-model="form.lastname.val"
                :readonly="form.lastname.had" />
            </div>
          </div>
        </div>
        <div class="amount-row">
          <div class="flex-col">
            <div class="mt-20 label">{{$t('message.bank_for_deposit_withdrawal')}} <span class="red">*</span></div>
            <div class="mt-10 input-outer">
              <el-select class="input-outer" v-model="form.bankid.val" :placeholder="$t('message.select_the_bank')"
                no-data-text="$t('message.no_promotion')" :disabled="form.bankid.had">
                <el-option v-for="(item,index) in bankList" :key="index" :label="item.name" :value="item._id">
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
            <div class="mt-20 label">{{$t('message.account_number')}} <span class="red">*</span></div>
            <div class="mt-10 input-outer">
              <input class="user-input" :placeholder="$t('message.enter_account')" type="text" v-model="form.card_no.val"
                :readonly="form.card_no.had" />
            </div>
          </div>
        </div>
        <div class="title insert-to-bottom-line mt-60" style="text-align:left;">{{$t('message.other_information')}}</div>
        <div class="amount-row">
          <div class="flex-col">
            <div class="mt-30 label">{{$t('message.phone_number')}} <span class="red">*</span></div>
            <div class="mt-10 input-outer">
              <input class="user-input" :placeholder="$t('message.enter_phone_number')" type="text" v-model="form.phone.val"
                :readonly="form.phone.had" />
            </div>
          </div>
        </div>
        <div class="amount-row">
          <div class="flex-col">
            <div class="mt-20 label">{{$t('message.line_id')}}</div>
            <div class="mt-10 input-outer">
              <input class="user-input" :placeholder="$t('message.enter_line')" type="text" v-model="form.lineid.val" />
            </div>
          </div>
        </div>
        <div class="amount-row">
          <div class="flex-col">
            <div class="mt-20 label">{{$t('message.email')}}</div>
            <div class="mt-10 input-outer">
              <input class="user-input" :placeholder="$t('message.enter_email')" type="text" v-model="form.email.val" />
            </div>
          </div>
        </div>
        <div class="mt-60 amount-row mb-60">
          <button class="user-btn" @click="onSubmit()">{{$t('message.confirm')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import * as validator from "@/assets/js/utils/validator";

  export default {
    name: 'personalInformation',
    data() {
      return {
        is12NumBankId: '5c80ba7aa6f5dc51d2425c83',
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
        // 表单
        form: {
          firstname: {
            val: '',
            require: true,
            message: 'please_enter_firstname',
            had: false,
          },
          lastname: {
            val: '',
            require: true,
            message: 'please_enter_lastname',
            had: false,
          },
          bankid: {
            val: '',
            require: true,
            message: 'please_select_bank',
            had: false,
          },
          card_no: {
            val: '',
            require: true,
            message: 'please_enter_ac_no',
            had: false,
          },
          phone: {
            val: '',
            require: true,
            message: 'please_enter_phone',
            had: false,
          },
          lineid: {
            val: '',
            require: false,
            message: 'please_enter_lineid',
          },
          email: {
            val: '',
            require: false,
            message: 'please_enter_email',
          }
        }
      }
    },
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {
      const vm = this;
      Promise.all([vm.$http.get('/trade/bank/list', {}), vm.$http.get('/trade/user/account', {})]).then(
        response => {
          // console.log('response', response)
          let data = response[0].body.data;
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
          // console.log(vm.bankList)

          let data2 = response[1].body.data;
          vm.form.bankid.val = data2.bankid;
          vm.form.bankid.had = data2.bankid ? true : false;
          vm.form.card_no.val = data2.card_no;
          vm.form.card_no.had = data2.card_no ? true : false;
        },
        error => {
          console.log('error', error)
        });
      // this.getBankList();
      // this.getBankAccount();
    },
    beforeMount() {},
    mounted() {
      const vm = this;
      // if (!vm.$store.state.isBindBank) {
      //   // this.$store.state.message('未绑定银行卡', 'warning', 2000, this);
      //   vm.$alert(vm.$t('message.pl_complete_personal_info'), vm.$t('message.message'), {
      //     confirmButtonText: vm.$t('message.confirm'),
      //     callback: action => {}
      //   })
      // }
      vm.getProfile();
    },
    watch: {},
    methods: {
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
          vm.updateProfile(data)
        }
      },
      // 更新个人资料
      updateProfile(data) {
        const vm = this;
        
        if (vm.form.bankid.val === this.is12NumBankId) {
          if (!validator.bankCard12(this.form.card_no.val)) {
            vm.$store.state.message(vm.$t('message.bank_format_is_incorrect'), 'warning', 3000, this);
            return;
          }
        } else if (!validator.bankCard(this.form.card_no.val)) {
          vm.$store.state.message(vm.$t('message.bank_format_is_incorrect'), 'warning', 3000, this);
          return;
        }
        // if (!validator.bankCard(this.form.card_no.val)) {
        //   vm.$store.state.message(vm.$t('message.bank_format_is_incorrect'), 'warning', 3000, this);
        //   return false;
        // }
        if (!validator.cellphone(this.form.phone.val)) {
          vm.$store.state.message(vm.$t('message.phone_format_is_incorrect'), 'warning', 3000, this);
          return false;
        }
        if (!validator.email(this.form.email.val)) {
          vm.$store.state.message(vm.$t('message.email_format_is_incorrect'), 'warning', 3000, this);
          return false;
        }
        const url = '/user/profile/update';
        vm.loading = true;
        vm.$http.post(
          url, data
        ).then(response => {
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.logout(this);
            } else if (status == 200) {
              vm.$store.state.message(vm.$t('message.submit_success'), 'success', 3000, vm);
              for (let key in vm.form) {
                let obj = vm.form[key];
                if (obj.hasOwnProperty('had')) {
                  obj.had = true;
                }
              }
              if(this.$store.state.fromUrl && (this.$store.state.fromUrl.indexOf('deposit') > -1 || this.$store.state.fromUrl.indexOf('withdrawal') > -1)){
                this.$router.push({
                  name: this.$store.state.fromUrl
                })
              }
            } else if (status == 302) {
              // phone number 重复
              vm.$store.state.message(vm.$t('message.phone_in_use'), 'warning', 3000, vm);
            } else if (status == 303) {
              // account number 重复
              vm.$store.state.message(vm.$t('message.account_in_use'), 'warning', 3000, vm);
            } else {
              vm.$store.state.message(vm.$t('message.submit_failure'), 'error', 3000, vm);
            }
          }
        }, error => {
          console.log('error', error);
          vm.loading = false;
        });
      },
      // 个人资料
      getProfile() {
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
              localStorage.setItem('dove-app-cash', data.cash);
              localStorage.setItem('dove-app-loginname', data.loginname);
              vm.$store.dispatch('setCash', data.cash);
              vm.$store.dispatch('setDoveName', data.loginname);
              vm.$store.dispatch('setStake', data.stake);

              // 绑定值
              vm.form.lastname.val = data.lastname;
              vm.form.lastname.had = data.lastname ? true : false;
              vm.form.firstname.val = data.firstname;
              vm.form.firstname.had = data.firstname ? true : false;
              vm.form.phone.val = data.phone;
              vm.form.phone.had = data.phone ? true : false;
              vm.form.lineid.val = data.lineid;
              vm.form.email.val = data.email;

            } else if (status === 400) {

            } else {

            }
          }
        }, error => {
          console.log('error', error);
          vm.loading = false;
        });
      },
      // 支持的银行账户列表
      getBankList() {
        const url = '/trade/bank/list';
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
              for (let key in data) {
                let obj = data[key];
                if (obj.enabled === 1) {
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
      // 用户银行卡账户
      getBankAccount() {
        const url = '/trade/user/account';
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
              vm.form.bankid.val = data.bankid;
              vm.form.card_no.val = data.card_no;
            } else if (status === 400) {

            } else {

            }
          }
        }, error => {
          console.log('error', error);
          vm.loading = false;
        });
      }
    },
    computed: {
      getDoveName() {
        return this.$store.state.doveName;
      },
      getMobileDoveName() {
        return this.$store.state.doveName;
      }
    }
  }

</script>
<style lang="scss">
.personalInformation{
  .amount-row{
    .input-outer{
      .el-input__inner {
        height: 11.73vw;
        line-height: 11.73vw;
      }
    }
  }
}

</style>

<style lang="scss" scoped>
  .personalInformation {
    position: relative;
    width: 100%;
    height: 100%;

    .personalInformation-inner {
      background: #111111;
      text-align: center;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 4vw;
      flex-direction: column;
    }

    .bank-image {
      width: 150px;
      height: 42px;
    }

    .fill-amount {
      width: 100%;
      text-align: left;
      // font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #fff;

      .amount-row {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .label{
        font-size:4vw;
      }
      .title{
        font-size:4.27vw;
      }
      .user-input{
        width:100%;
        padding:0 4vw;
        height:11.73vw;
        line-height:11.73vw;
      }
      .input-outer{
        width:100%;
      }
    }

    .tip {
      text-align: center;
      
      font-size: 16px;
    }

    .red {
      color: #E84545;
    }
    .user-btn{
      width:52.53vw;
    }
  }

</style>
