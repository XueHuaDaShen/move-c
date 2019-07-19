<template>
  <div class="bank-wrap common" v-loading.fullscreen="loading">
    <div class="container">
      <div class="card">
        <div class="card-title">
          {{$t('message.bank_account')}}
        </div>
        <div class="card-body clearfix table-container" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
          <a class="btn-copy fr mb-20" @click="handleOpen">{{$t('message.add_bank_card')}}</a>
          <table class="table-list">
            <thead>
              <tr>
                <th><div class="cell">{{$t('message.kai_hu_hang')}}</div></th>
                <th><div class="cell">{{$t('message.account_name')}}</div></th>
                <th><div class="cell">{{$t('message.zhang_hao')}}</div></th>
                <th><div class="cell">{{$t('message.shi_fou_kai_qi')}}</div></th>
              </tr>
            </thead>
            <tbody v-if="!noResult">
              <tr v-for="(item,index) in list" :key="index">
                <td>{{item.bank}}</td>
                <td>{{item.account_name ? item.account_name : '--'}}</td>
                <td>{{item.card_no}}</td>
                <td>
                  <el-switch v-model="item.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="0"
                    :inactive-value="1" @change="rowSwitchChange(item._id,item.status)">
                  </el-switch>
                </td>
              </tr>
            </tbody>
            <tbody v-if="noResult">
              <tr class="no-result">
                <td colspan="9">
                  <p>{{$t('message.shang_wei_bang_ding_yin_hang_ka')}}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" v-loading="dialogLoading" top="0" custom-class="common-dialog"
      center>
      <div slot="title" class="dialog-header">
        <img src="@/assets/img/confirm.png" class="icon" />
        <span class="title">{{$t('message.xin_zeng_yin_hang_ka')}}</span>
      </div>
      <div class="body">
        <table class="user-table">
          <tbody>
            <tr>
              <td class="left">
                <label>{{$t('message.kai_hu_yin_hang')}}:</label>
              </td>
              <td class="right">
                <el-select v-model="bankid" popper-class="img-select" :placeholder="$t('message.qing_xuan_ze') + $t('message.kai_hu_yin_hang')"
                  :loading-text="$t('message.loading')" :loading="withdrawBankLoading" :no-data-text="$t('message.zan_wu_shu_ju')"
                  @focus="getWithdrawBank" @change="bankChange">
                  <el-option v-for="(item,index) in withdrawBankOptions" :key='index' :value="item._id" :label="item.bank"
                    :title="item.bank">
                    <img class="avatar" :src="item.url" style="height:30px;width:30px;" v-if="item.url">
                    <span :style="{'margin-left':(item.url ? '10px':'')}" style="text-overflow: ellipsis;overflow: hidden;">{{item.bank}}</span>
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="left">
                <label>{{$t('message.account_name')}}:</label>
              </td>
              <td class="right">
                <input class="c-input" type="text" v-model.trim="account_name" :placeholder="$t('message.qing_shu_ru') + $t('message.account_name') " />
              </td>
            </tr>
            <tr>
              <td class="left">
                <label>{{$t('message.zhang_hao')}}:</label>
              </td>
              <td class="right">
                <input class="c-input" id="bank_card_no" @keyup="numExp('bank_card_no')" type="text" v-model.trim="card_no"
                  :placeholder="$t('message.qing_shu_ru') + $t('message.yin_hang_ka_hao')" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <button @click="handleConfirm" class="btn-confirm">{{$t('message.que_ren')}}</button>
        <button @click="handleCancel" class="btn-cancel">{{$t('message.fan_hui')}}</button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import * as validator from "../../../static/utils/validator";
  import moment from "moment";
  export default {
    name: "bankAccount",
    components: {},
    props: {},
    data() {
      return {
        list: [],
        is12NumBankId: '5c6b77f653d6be0120a702b4',
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 15, //单页条数
        loading: false,
        dialogLoading: false,
        dialogVisible: false,
        bank: "",
        bankid: "",
        account_name: "",
        card_no: "",
        withdrawBankOptions: [],
        withdrawBankLoading: false,
        selectedBankItem: {},
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
    created() {},
    mounted() {
      this.getProfile();
      this.getBankList();
    },
    methods: {
      getProfile() {
        const vm = this;
        vm.loading = true
        this.$http.get("/user/profile", {}).then(
          response => {
            // console.log('response', response);
            vm.loading = false;
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.reLogin(this);
              } else if (status == 200) {
                let data = response.body.data;
                if(!data.firstname || !data.lastname || !data.email || !data.phone){
                  vm.$confirm(vm.$t("message.pl_complete_info"))
                  .then(_ => {
                    vm.$router.push({
                      name: 'contactInfo'
                    })
                  })
                  .catch(_ => {});
                }
              } else {
                vm.$store.state.message(vm.$t("message.server_cuo_wu"), 'error', 1500, vm);
              }
            }
          },
          response => {
            vm.loading = false;
          }
        );
      },
      rowSwitchChange(id, status) {
        const vm = this;
        let url = "/user/account/update";
        vm.loading = true;
        vm.$http
          .post(url, {
            accountid: id,
            status: status,
          })
          .then(
            response => {
              vm.loading = false;
              let status = response.body.returncode;
              if (status) {
                if (status == 103 || status == 106 || status == 101) {
                  this.$store.state.reLogin(this);
                } else if (status == 200) {
                  vm.dialogVisible = false;
                  vm.$store.state.message(vm.$t("message.edit_success"), 'success', 1500, vm);
                  vm.resetForm();
                  // vm.getLinkList();
                } else {
                  vm.$store.state.message(vm.$t("message.edit_failed") + ":" + status, 'error', 1500, vm);
                }
              }
            },
            response => {
              vm.loading = false;
            }
          );
      },
      getBankList() {
        const vm = this;
        vm.loading = true;
        let url = "/user/account/list";
        vm.$http.get(url, {}).then(
          response => {
            vm.loading = false;
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.reLogin(this);
              } else if (status == 200) {
                vm.noResult = false;
                vm.list = response.body.data;
              } else {
                vm.noResult = true;
                vm.list = [];
              }
            }
          },
          response => {
            vm.loading = false;
            vm.noResult = true;
            vm.list = [];
          }
        );
      },
      handleClose() {
        this.dialogVisible = false;
        this.resetForm();
      },
      numExp(id) {
        let obj = document.getElementById(id);
        obj.value = obj.value.replace(/[^\d]/g, '')
      },
      resetForm() {
        this.bank = "";
        this.account_name = "";
        this.card_no = "";
        this.bankid = '';
        this.selectedBankItem = {};
      },
      getWithdrawBank() {
        const vm = this;
        if (vm.withdrawBankOptions.length === 0) {
          vm.withdrawBankLoading = true;
          let url = "/platform/bank/list";
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
                    let imgObj = vm.imgArr.find(item => {
                      return item.key === obj.bank;
                    });
                    if (imgObj) {
                      obj["url"] = imgObj.val;
                    } else {
                      obj["url"] = "";
                    }
                    // vm.withdrawBankOptions = response.body.data;
                    vm.withdrawBankOptions.push(obj);
                  }
                } else {
                  vm.withdrawBankOptions = [];
                  vm.$store.state.message(vm.$t("message.get_bank_list_failed") + ":" + status, 'error', 1500, vm);
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
      handleOpen() {
        this.dialogVisible = true;
      },
      handleConfirm() {
        this.onSubmit();
      },
      handleCancel() {
        this.dialogVisible = false;
        this.resetForm();
      },
      onSubmit() {
        const vm = this;
        if (!this.bankid) {
          vm.$store.state.message(this.$t("message.qing_xuan_ze") + this.$t("message.kai_hu_yin_hang"), 'error', 1500, vm);
          return;
        }
        if (!this.account_name) {
          vm.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.account_name"), 'error', 1500, vm);
          return;
        }
        if (!this.card_no) {
          vm.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.yin_hang_ka_hao"), 'error', 1500, vm);
          return;
        }
        if (this.bankid === this.is12NumBankId) {
          if (!validator.bankCard12(this.card_no)) {
            vm.$store.state.message(this.$t("message.yin_hang_ka_hao") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, vm);
            return;
          }
        } else if (!validator.bankCard(this.card_no)) {
          vm.$store.state.message(this.$t("message.yin_hang_ka_hao") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, vm);
          return;
        }
        vm
          .$confirm(vm.$t('message.que_ren_xin_zeng_yin_hang_ka_me'), vm.$t('message.que_ren'), {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning"
          })
          .then(() => {
            vm.loading = true;
            let url = "/user/account/create";
            vm.bank = vm.selectedBankItem.bank,
              vm.$http
              .post(url, {
                account_name: vm.account_name,
                bank: vm.bank,
                bankid: vm.bankid,
                card_no: vm.card_no
              })
              .then(
                response => {
                  vm.loading = false;
                  let status = response.body.returncode;
                  if (status) {
                    if (status == 103 || status == 106 || status == 101) {
                      this.$store.state.reLogin(this);
                    } else if (status == 200) {
                      vm.$store.state.message(this.$t("message.xin_zeng_cheng_gong"), 'success', 1500, vm);
                      vm.dialogVisible = false;
                      vm.resetForm();
                      vm.getBankList();
                    } else {
                      vm.$store.state.message(this.$t("message.add_bank_failed") + ":" + status, 'error', 1500, vm);
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
            vm.$store.state.message(this.$t("message.bang_ding_yi_qu_xiao"), 'info', 1500, vm);
          });
      },
      bankChange(value) {
        let obj = {};
        obj = this.withdrawBankOptions.find((item) => {
          return item._id === value;
        });
        this.selectedBankItem = obj;
      }
    },
    filters: {
      formatTime(v) {
        if (v) {
          return moment(v).format("DD-MM-YYYY HH:mm:ss");
        }
        return "--";
      },
      formatStatus(v) {
        if (v) {
          switch (v) {
            default:
              return v;
          }
        }
        return "--";
      }
    }
  };

</script>

<style lang="scss" scoped>
  .bank-wrap {
    background: #efefef;
    padding: 60px 0;

    .card-body {
      padding: 20px 20px;

      .btn-copy {
        width: 100px;
      }
    }

    table.table-list {
      border-collapse: collapse;
      width: 100%;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #191919;
      text-align: center;

      thead {
        background: #ededed;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #191919;
        line-height: 40px;
        height: 40px;
        text-align: center;
      }

      tr {
        >td {
          padding: 15px 0;
        }
      }
    }

    .user-table {
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
  }

</style>
