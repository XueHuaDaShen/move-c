<template>
  <div class="unused user-common" v-loading="loading">
    <ul v-if="list.length>0">
      <li v-for="(item, i) in list" :key="i">
        <coupon status="unused" :coupon="item" :callback="useCoupon"></coupon>
      </li>
    </ul>
    <p class="no-result" v-if="noresult">{{$t("message.no_data")}}</p>
    
    <div class="transfer-cash-dialog" v-show="showTransfer">
      <table class="transfer-table" v-loading="loading2">
        <tr><span>{{$t('message.game_account')}}</span></tr>
        <tr class="tr-pt-10">
          <div>
            <el-select class="input-outer" disabled v-model="transfer_to_game.account_type.val" :placeholder="$t('message.'+transfer_to_game.account_type.message)">
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
          <div><input type="text" readonly v-model.number="transfer_to_game.amount.val" :placeholder="$t('message.'+transfer_to_game.amount.message)"></div>
        </tr>
        <tr class="tr-pt-20"><span>{{$t('message.promotions')}}</span></tr>
        <tr class="tr-pt-10">
          <div class="mt-10"><input type="text" readonly v-model.number="transfer_to_game.packageid.name" :placeholder="$t('message.'+transfer_to_game.packageid.message)"></div>
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
import moment from 'moment';
import paramCryptFn from "@/assets/js/cryptData";
import coupon from '@/components/public/couponView';
export default {
  name: 'unused',
  components: {
    coupon
  },
  data() {
    return {
      list: [],
      noresult: false,
      loading: false,
      loading2: false,
      isClick: false,
      showTransfer: false,
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
          name: "",
          require: true,
          message: "pl_select_promotion",
          clear: true
        }
      },
    };
  },
  methods: {
    getCouponList() {
      const vm = this;
      const url = "/coupon/list";
      this.loading = true;
      vm.$http.get(url, {}).then(
        response => {
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.logout(this);
            } else if (status == 200) {
              vm.formatData(response.body.data)
            } else {}
          }else{
            vm.formatData([])
          }
        },
        error => {
          vm.loading = false;
          vm.formatData([])
          console.log("error", error);
        }
      );
    },
    formatData(data) {
      if(data.length === 0){
        this.noresult = true;
        return;
      }else{
        this.noresult = false;
        this.list = data.filter(v => {return v.status == 0})
      }
      if(this.list.length === 0){
        this.noresult = true;
      }else{
        this.noresult = false;
      }
    },
    useCoupon(data) {
      this.transfer_to_game.account_type.val = data.packageid.account_type;
      this.transfer_to_game.amount.val = data.packageid.free;
      this.transfer_to_game.packageid.val = data._id;
      this.transfer_to_game.packageid.name = data.packageid.name;
      this.$store.dispatch('setAlertBG', true);
      this.showTransfer = true;
    },
    hideTransferFn() {
      this.$store.dispatch('setAlertBG', false);
      this.showTransfer = false;
      this.resetForm(this.transfer_to_game);
    },
    resetForm(form) {
      for (let key in form) {
        let obj = form[key];
        if (obj.clear) {
          obj.val = "";
        }
      }
    },
    onSubmit() {
      let data = {
        packageid: this.transfer_to_game.packageid.val,
        account_type: this.transfer_to_game.account_type.val,
      }
      const vm = this;
      vm.loading2 = true;
      vm.isClick = true;
      // console.log('data', data);
      vm.$http.post('/coupon/transfer/in', paramCryptFn(data)).then(
        response => {
          vm.loading2 = false;
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
              vm.getCouponList();
              vm.hideTransferFn();
            } else if (status == 303) {
              vm.$store.state.message(response.body.data, "error", 3000, vm);
            } else {
              vm.$store.state.message(response.body.data, "error", 3000, vm);
            }
          }
        },
        error => {
          console.log("error", error);
          vm.loading2 = false;
          vm.isClick = false;
        }
      );
    }
  },
  computed: {},
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {
    const vm = this;
    this.getCouponList();
  },
  beforeMount() {},
  mounted() {
    //
  },
  watch: {},
}

</script>
<style lang="scss" scoped>
.unused{
  width:420px;
  margin:0 auto;
  li{
    margin-top:30px;
  }
  .no-result{
    font-size:16px;
    text-align:center;
    margin-top:30px;
    color:#fff;
  }
  .input-outer {
    line-height: 36px;
    height: 36px;
    width: 100%;
  }
}
.transfer-cash-dialog{
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
</style>
