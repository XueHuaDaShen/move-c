<template>
  <div class="cashAccount">
    <pageTitle :title="'cash_account'" :showBG="false"></pageTitle>
    <div class="cashAccount-inner">
      <div class="user-tab-line mb-20">{{$t('message.main_account')}}</div>
      <div class="user-card position-re">
        <div class="row title">{{$t('message.balance')}}</div>
        <div class="row big-cash mt-10"><span class="flex-col">{{getCash | filterCash}} THB</span></div>
        <div class="refresh-icon" @click="refreshCash"></div>
        <div class="mt-20 input-outer amount-row">
          <button class="user-btn transfer-btn" @click="showTransferFn">{{$t('message.transfer_in')}}</button>
        </div>
        <!-- <div class="row title mt-20">{{$t('message.to_withdraw_money_from_the_credit')}}</div> -->
      </div>
      <div class="user-tab-line mt-30">{{$t('message.game_account')}}</div>
      <div class="user-card mt-20 position-re">
        <div class="row title">{{$t('message.lower_slots')}}</div>
        <div class="row big-cash mt-10"><span class="flex-col">{{slotsCash | filterCash}} THB</span></div>
        <div class="refresh-icon" @click="refreshCash"></div>
        <div class="mt-20 input-outer amount-row">
          <button class="user-btn transfer-btn" @click="transferOutFn(slotsCash, slots_least, 'slot')">{{$t('message.transfer_out')}}</button>
        </div>
        <div class="title mt-20">{{$t('message.transfer_least')}} <span class="red" style="display:inline-block">{{slots_least | filterCash}}</span> THB</div>
      </div>
      <div class="user-card mt-20 position-re">
        <div class="row title">{{$t('message.live')}}</div>
        <div class="row big-cash mt-10"><span class="flex-col">{{liveCash | filterCash}} THB</span></div>
        <div class="refresh-icon" @click="refreshCash"></div>
        <div class="mt-20 input-outer amount-row">
          <button class="user-btn transfer-btn" @click="transferOutFn(liveCash, live_least, 'live')">{{$t('message.transfer_out')}}</button>
        </div>
        <div class="title mt-20">{{$t('message.transfer_least')}} <span class="red" style="display:inline-block">{{live_least | filterCash}}</span> THB</div>
      </div>
    </div>
    <div class="confirm-transfer-out" v-if="confirmTransferOut">
      <table class="transfer-table">
        <!-- <tr><span>{{$t('message.game_account')}}</span></tr> -->
        <tr>{{$t("message.confirm_transfer")}}</tr>
        <tr class="tr-pt-30">
          <div class="btn-wrap">
            <button class="cancel-btn" @click="hideTransferFn" :disabled="isClick">{{$t('message.cancel')}}</button>
            <button class="confirm-btn" @click="confirmTrsOutFn" :disabled="isClick">{{$t('message.confirm')}}</button>
          </div>
        </tr>
      </table>
    </div>
    <div class="transfer-cash-dialog" v-show="showTransfer">
      <table class="transfer-table">
        <tr><span>{{$t('message.game_account')}}</span></tr>
        <tr class="tr-pt-10">
          <div>
            <el-select class="input-outer" @change="handleChangeType" v-model="transfer_to_game.account_type.val" :placeholder="$t('message.'+transfer_to_game.account_type.message)">
              <el-option
                v-for="item in account_type_list"
                :key="item.val"
                :label="$t('message.'+item.label)"
                :value="item.val">
              </el-option>
            </el-select>
          </div>
        </tr>
        <tr class="tr-pt-20"><span>{{$t('message.amount')}}</span></tr>
        <tr class="tr-pt-10">
          <div><input type="text" @change="promotionFocus()" v-model.number="transfer_to_game.amount.val" :placeholder="$t('message.'+transfer_to_game.amount.message)"></div>
        </tr>
        <tr class="tr-pt-20"><span>{{$t('message.promotions')}}</span></tr>
        <tr class="tr-pt-10">
          <div class="mt-10">
            <el-select class="input-outer" v-model="transfer_to_game.packageid.val" :placeholder="$t('message.'+transfer_to_game.packageid.message)"
              :no-data-text="$t('message.no_data')" :disabled="promotionDisabled" @change="promotionSelectChange">
              <el-option v-for="(item,index) in packageList" :key="index" :label="getPackageMessage(item)" :value="item._id"></el-option>
            </el-select>
          </div>
        </tr>
        <tr class="tr-pt-30">
          <div class="btn-wrap">
            <button class="cancel-btn" @click="hideTransferFn" :disabled="isClick">{{$t('message.cancel')}}</button>
            <button class="confirm-btn" @click="onSubmit" :disabled="isClick">{{$t('message.confirm')}}</button>
          </div>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import pageTitle from '@/components/public/pageTitle';
import paramCryptFn from "@/assets/js/cryptData";

export default {
  name: 'cashAccount',
  components: {
    pageTitle
  },
  data() {
    return {
      showTransfer: false,
      confirmTransferOut: false,
      confirmTrsOutFn: function() {},
      loading: false,
      slotsCash: 0,
      slots_least: 0,
      live_least: 0,
      liveCash: 0,
      isClick: false,
      account_type_list: [
        {val: 'slot', label: 'slot'},
        {val: 'live', label: 'lower_live_casino'},
      ],
      transfer_to_game: {
        account_type: {
          val: "",
          require: true,
          message: "pl_select_game_type",
          clear: true
        },
        amount: {
          val: "",
          require: true,
          message: "pl_enter_amount",
          clear: true
        },
        packageid: {
          val: "",
          require: true,
          message: "pl_select_promotion",
          clear: true
        }
      },
      packageList: [],
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
    this.refreshCash();
  },
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
  },
  watch: {
    "transfer_to_game.amount.val"(newVal, oldVal) {
      if (!this.transfer_to_game.amount.val && !this.transfer_to_game.account_type.val) {
        this.promotionDisabled = true;
      } else {
        this.promotionDisabled = false;
      }
      if (newVal != oldVal) {
        this.packageList = [];
        this.transfer_to_game.packageid.val = "";
        // this.promotionDisabled = true;
      }
    }
  },
  methods: {
    showTransferFn() {
      this.$store.dispatch('setAlertBG', true);
      this.showTransfer = true;
    },
    hideTransferFn() {
      this.$store.dispatch('setAlertBG', false);
      this.confirmTransferOut = false;
      this.showTransfer = false;
      this.resetForm(this.transfer_to_game);
    },
    onSubmit() {
      const vm = this;
      let data = {};
      let validate = true;
      for (let key in vm.transfer_to_game) {
        let obj = vm.transfer_to_game[key];
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
          data["packageid"] = undefined;
        }
      }
      if (validate) {
        vm.transferToGame(data);
      }
    },
    transferOutFn(trsCash, leastCash, type) {
      if(trsCash == 0) return
      if(trsCash < leastCash){
        //transfer_amount_to_big
        this.$store.state.message(
          this.$t("message.tranfster_rule") + ' ' + leastCash + 'THB',
          "warning",
          3000,
          this
        );
        return
      }
      this.$store.dispatch('setAlertBG', true);
      this.confirmTransferOut = true;
      const vm = this;
      this.confirmTrsOutFn = function() {
        const url = "/trade/transfer/out";
        let data = {
          amount: trsCash,
          account_type: type
        }
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
                  vm.$t("message.success"),
                  "success",
                  1000,
                  vm
                );
                vm.refreshCash();
                vm.hideTransferFn();
              } else if (status == 303) {
                // vm.$store.state.message(vm.$t("message.same_time_deposit_withdrawal"), "error", 3000, vm);
                vm.$store.state.message(response.body.data, "error", 3000, vm);
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
      }
    },
    transferToGame(data) {
      const url = "/trade/transfer/in";
      const vm = this;
      // 优惠券列表返回数据错误
      if (!vm.packageList.length) {
        vm.$store.state.message(
          vm.$t("message.pl_refresh_promotion"),
          "warning",
          3000,
          vm
        );
        return false;
      }
      // 优惠券列表返回数组为空数组,并且上次充值是优惠券，另外账户余额大于等于5
      // 提示没有合适的优惠券供选择，请修改充值金额
      if (!vm.init_package && vm.is_package && Number(vm.cash) >= 5) {
        vm.$store.state.message(
          vm.$t("message.pl_modify_amount"),
          "warning",
          3000,
          vm
        );
        return false;
      }
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
                vm.$t("message.success"),
                "success",
                1000,
                vm
              );
              vm.refreshCash();
              vm.hideTransferFn();
              vm.packageList = [];
              vm.is_package = false;
              vm.cash = "";
              vm.package_all = false;
            } else if (status == 303) {
              // vm.$store.state.message(vm.$t("message.same_time_deposit_withdrawal"), "error", 3000, vm);
              vm.$store.state.message(response.body.data, "error", 3000, vm);
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
            vm.$store.dispatch('setCash', data.cash);
            vm.slotsCash = data.cash_slot;
            vm.liveCash = data.cash_live;
            vm.slots_least = data.stake_slot;
            vm.live_least = data.stake_live;
            // vm.$store.dispatch('setStake', data.stake);
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
      let ruler = this.checkTransferCash(vm.transfer_to_game.amount.val, this.getCash)
      if (vm.transfer_to_game.amount.val && vm.transfer_to_game.account_type.val && vm.packageList.length === 0 && ruler) {
        vm.getPackageList(vm.transfer_to_game.amount.val);
      }
    },
    checkTransferCash(trsCash, mainCash) {
      let ok = true;
      if(isNaN(trsCash)){
        //pl_enter_number
        this.$store.state.message(
          this.$t("message.pl_enter_number"),
          "warning",
          3000,
          this
        );
        ok = false;
      }
      if(trsCash < 0){
        //pl_enter_number
        this.$store.state.message(
          this.$t("message.not_be_negative"),
          "warning",
          3000,
          this
        );
        ok = false;
      }
      if(trsCash > mainCash){
        //transfer_amount_to_big
        this.$store.state.message(
          this.$t("message.transfer_amount_to_big"),
          "warning",
          3000,
          this
        );
        ok = false;
      }
      return ok;
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
        vm.transfer_to_game.packageid.val = "";
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
            amount: amount,
            account_type: vm.transfer_to_game.account_type.val
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
                vm.transfer_to_game.packageid.val = "";
                let data = response.body.data.packagelist;
                if (data.length) {
                  vm.init_package = true;
                } else {
                  vm.init_package = false;
                }
                vm.is_package = response.body.data.is_package;
                if(vm.transfer_to_game.account_type.val === 'slot'){
                  vm.cash = vm.slotsCash;
                }
                if(vm.transfer_to_game.account_type.val === 'live'){
                  vm.cash = vm.liveCash;
                }
                // vm.cash = response.body.data.cash;
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
    handleChangeType() {
      this.transfer_to_game.amount.val = "";
      this.transfer_to_game.packageid.val = "";
      this.packageList = [];
    },
    // 格式化优惠券提示信息
    getPackageMessage(item) {
      return item.name;
    },
  },
}

</script>
<style lang="scss" scoped>
.cashAccount {
  .cashAccount-inner {
    width: 420px;
    margin:0 auto;
    background: #111111;
    text-align: center;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
  }

  .bank-image {
    width: auto;
    height: 80px;
  }

  .cashAccount-btn {
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
    background-image: url('../../assets/img/home/h-refresh.png');
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
  .user-card .title{
    color:#d8d8d8 !important;
  }
  .transfer-btn{
    height:30px;
  }
  .big-cash{
    color:#fff;
  }
  .transfer-cash-dialog, .confirm-transfer-out{
    width: 400px;
    height: 398px;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: #111111;
    border-radius: 4px;
    z-index: 1099;
    padding: 60px 50px 30px 50px;
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.5);

    .transfer-table {
      width: 100%;
      border: none;
      border-collapse: collapse;

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
        background: #1F1E1F;
        border-radius: 4px;
        display: block;
        font-size: 16px;
        color:#fff;
      }
      .btn-wrap{
        display:-webkit-box;
        -webkit-box-pack:justify;
      }

      button {
        width: 45%;
        height: 40px;
        display: block;
        border: 1px solid #9C9EA2;
        border-radius: 20px;
        color: #9C9EA2;
        background: #111;
        cursor: pointer;
        font-size: 16px;
      }

      .confirm-btn {
        color: #111;
        border: none;
        // background: #F2B672;
        background-image: linear-gradient(134deg,	#fadcab 0%, #d99d59 100%, #f2b672 100%);
      }
    }
  }
  .confirm-transfer-out{
    width: 400px;
    height: 170px;
    padding: 30px 50px;
    .transfer-table {
      tr {
        text-align: center;
        font-size:20px;
      }
    }
  }
}

</style>
