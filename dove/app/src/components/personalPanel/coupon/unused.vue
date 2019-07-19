<template>
  <div class="unused user-common" v-loading="loading">
    <ul v-if="list.length>0">
      <li v-for="(item, i) in list" :key="i">
        <coupon status="unused" :coupon="item" :callback="useCoupon"></coupon>
      </li>
    </ul>
    <p class="no-result" v-if="noresult">{{$t("message.no_data")}}</p>
    
    <div class="transfer-cash-dialog" v-show="getAlertBG">
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
          <div><input type="text" class="user-input" readonly v-model.number="transfer_to_game.amount.val" :placeholder="$t('message.'+transfer_to_game.amount.message)"></div>
        </tr>
        <tr class="tr-pt-20"><span>{{$t('message.promotions')}}</span></tr>
        <tr class="tr-pt-10">
          <div class="mt-10"><input type="text" class="user-input" readonly v-model.number="transfer_to_game.packageid.name" :placeholder="$t('message.'+transfer_to_game.packageid.message)"></div>
        </tr>
        <tr class="tr-pt-30">
          <div class="btn-wrap">
            <button class="user-btn refresh-btn" @click="hideTransferFn" :disabled="isClick">{{$t('message.cancel')}}</button>
            <button class="user-btn confirm-btn" @click="onSubmit" :disabled="isClick">{{$t('message.confirm')}}</button>
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
        {val: 'live', label: 'live_casino'},
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
      // this.showTransfer = true;
      this.$nextTick(() => {
        let el = document.getElementsByClassName('transfer-cash-dialog')[0];
        document.getElementById('app').appendChild(el)
      })
    },
    hideTransferFn() {
      this.$store.dispatch('setAlertBG', false);
      // this.showTransfer = false;
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
  computed: {
    getAlertBG() {
      return this.$store.state.alertBG;
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {
    this.getCouponList();
  },
  beforeMount() {},
  mounted() {
    //
  },
  watch: {
  },
}

</script>
<style lang="scss" scoped>
.unused{
  width:92vw;
  margin:0 auto;
  li{
    &:first-child{
      margin-top:8vw;
    }
    margin-top:4vw;
  }
  .no-result{
    font-size:16px;
    text-align:center;
    margin-top:4vw;
    color:#fff;
  }
  .input-outer {
    line-height: 36px;
    height: 36px;
    width: 100%;
  }
  .refresh-btn{
    background: #181818 !important;
    // width:28vw;
    height: 8.8vw;
    margin-right:8vw;
    color: #ababab;
  }
  .transfer-btn{
    width:28vw;
    height: 8.8vw;
  }
}
</style>
