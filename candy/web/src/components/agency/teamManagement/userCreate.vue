<template>
  <div class="user-create-wrap common" v-loading.fullscreen="loading">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item" :to="{name:'memberList'}">
          <div class="item-inner">{{$t('message.memberList')}}</div>
        </router-link>
        <router-link class="tab-item selected" :to="{name:'memberList'}">
          <div class="item-inner">{{$t('message.userCreate')}}</div>
        </router-link>
        <!-- <router-link class="tab-item" :to="{name:'linkCreate'}">
          <div class="item-inner">{{$t('message.linkCreate')}}</div>
        </router-link> -->
      </div>
      <div class="card mt-30" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="card-body">
          <table class="user-table mt-60">
            <tbody>
              <tr>
                <td class="left">
                  <label>{{$t('message.user_type')}}:</label>
                </td>
                <td class="right">
                  <el-select v-model="userType" :placeholder="$t('message.qing_xuan_ze') + $t('message.user_type')">
                    <el-option v-for="(item,index) in userTypeOptions" :key="index" :value="item.value" :label="$t('message.'+item.label)"></el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.username')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" type="text" v-model.trim="loginname" :placeholder="$t('message.qing_shu_ru') + $t('message.username')">
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.password')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" type="password" v-model.trim="password" :placeholder="$t('message.qing_shu_ru') + $t('message.password')">
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.confirm_pwd')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" type="password" v-model.trim="re_password" :placeholder="$t('message.qing_shu_ru') + $t('message.confirm_pwd')">
                </td>
              </tr>
              <!-- <tr>
                <td class="left">
                  <label>{{$t('message.phone')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" id="user_create_phone" @keyup="numExp('user_create_phone')" type="text"
                    v-model.trim="phone" :placeholder="$t('message.qing_shu_ru') + $t('message.phone')">
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.email')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" type="text" v-model.trim="email" :placeholder="$t('message.qing_shu_ru') + $t('message.email')">
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.firstname')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" type="text" v-model.trim="firstname" :placeholder="$t('message.qing_shu_ru') + $t('message.firstname')">
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.lastname')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" type="text" v-model.trim="lastname" :placeholder="$t('message.qing_shu_ru') + $t('message.lastname')">
                </td>
              </tr> -->
              <!-- <tr>
                <td class="left">
                  <label>{{$t('message.xin_yong_e')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" id="user_create_credit" @keyup="numExp('user_create_credit')" type="text"
                    v-model.trim="cash_credit" :placeholder="$t('message.qing_shu_ru') + $t('message.xin_yong_e') ">
                </td>
              </tr> -->
            </tbody>
          </table>
          <p class="mt-60 list-title">{{$t('message.lottery_setting')}}</p>
          <div class="table-container">
            <table class="table-list mt-20">
              <thead>
                <tr>
                  <th>
                    <div class="cell">{{$t('message.cai_zhong')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.wan_fa')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.min_tou_zhu_e')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.max_tou_zhu_e')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.pei_lv')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.discount')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.stock')}}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in tableList" :key="index">
                  <td :rowspan="item.parentspan" :class="{hidden: item.parentdis}">
                    <div class="cell">
                      <span v-if="$i18n.locale==='zh'">
                        {{item.parentid && item.parentid.parentid ?
                        item.parentid.parentid.name_cn :'--'}}
                      </span>
                      <span v-if="$i18n.locale==='th'">
                        {{item.parentid
                        && item.parentid.parentid ?
                        item.parentid.parentid.name_th :'--'}}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="cell">
                      <span v-if="$i18n.locale==='zh'">{{item.name_cn}}</span>
                      <span v-if="$i18n.locale==='th'">{{item.name_th}}</span>
                    </div>
                  </td>
                  <td>
                    <div class="cell">
                      <input class="td_input" v-model.trim="user_refund[index].min_bet" @change="cellChange('min_bet',user_refund[index])"
                        :class="{'error':user_refund[index].min_bet_error}">
                      <span class="td_num">
                        <i class="iconfont icon-xiaoyudengyufuhao"></i>
                        {{item.min_bet}}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="cell">
                      <input class="td_input" v-model.trim="user_refund[index].max_bet" @change="cellChange('max_bet',user_refund[index])"
                        :class="{'error':user_refund[index].max_bet_error}">
                      <span class="td_num">
                        <i class="iconfont icon-xiaoyudengyufuhao"></i>
                        {{item.max_bet}}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="cell">
                      <input class="td_input" v-model.trim="user_refund[index].prize" @change="cellChange('prize',user_refund[index])"
                        :class="{'error':user_refund[index].prize_error}">
                      <span class="td_num">
                        <i class="iconfont icon-xiaoyudengyufuhao"></i>
                        {{item.prize}}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="cell">
                      <input class="td_input" v-model.trim="user_refund[index].discount" @change="cellChange('discount',user_refund[index])"
                        :class="{'error':user_refund[index].discount_error}">
                      <span class="td_num">
                        <i class="iconfont icon-xiaoyudengyufuhao"></i>
                        {{item.discount}}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="cell">
                      <input class="td_input" v-model.trim="user_refund[index].stock" @change="cellChange('stock',user_refund[index])"
                        :class="{'error':user_refund[index].stock_error}" :disabled="user_refund[index].stock_disable">
                      <span class="td_num">
                        <i class="iconfont icon-xiaoyudengyufuhao"></i>
                        {{item.stock}}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="submit-row mt-60">
            <button class="confirm" @click="handleConfirm">{{$t('message.que_ren')}}</button>
            <button class="refuse" @click="handleCancel">{{$t('message.fan_hui')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import * as validator from "../../../../static/utils/validator";
  import moment from "moment";
  export default {
    name: "userCreate",
    components: {},
    props: {},
    data() {
      return {
        userTypeOptions: [{
            label: "user_type_1",
            value: "0"
          },
          {
            label: "user_type_2",
            value: "1"
          }
        ],
        userType: "0",
        loginname: "",
        password: "",
        re_password: "",
        phone: "",
        firstname: "",
        lastname: "",
        email: '',
        cash_credit: "",
        user_refund: [], //[{gameid:gameid,lotteryid:lotteryid,min_bet:min_bet,max_bet:max_bet,prize:prize,stock:stock,discount:discount}]
        tableList: [],
        userBindLoad: false,
        loading: false
      };
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      sessionStorage.setItem("th_tag_url", "userCreate");
    },
    mounted() {
      this.getBankList(this.getLimits)
    },
    methods: {
      // 判断当前用户有没有银行卡
      getBankList(callback) {
        const vm = this;
        vm.userBindLoad = true;
        let url = "/user/account/list";
        vm.$http.get(url, {}).then(
          response => {
            vm.userBindLoad = false;
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
              } else {
                vm.$store.state.message(this.$t("message.server_cuo_wu"), 'error', 1500, vm);
              }
            }
          },
          response => {
            vm.userBindLoad = false;
            vm.$store.state.message(this.$t("message.server_cuo_wu"), 'error', 1500, vm);
            // vm.noResult = true;
            // vm.list = [];
          }
        );
      },
      cellChange(key, row) {
        // 验证价格和折扣之间的规则
        if (key === "prize" || key === "discount") {
          if (
            !(
              Number((row.prize * 100) / row.motherprize_) +
              Number(row.discount) <
              100
            )
          ) {
            row["prize_error"] = true;
            row["discount_error"] = true;
            return;
          } else {
            row["prize_error"] = false;
            row["discount_error"] = false;
          }
        }
        // 验证一般单元格input规范
        if (!row[key] && Number(row[key]) != 0) {
          row[key + "_error"] = true;
          return;
        } else {
          row[key + "_error"] = false;
        }
        if (row[key] > row[key + "_"] || row[key] < 0) {
          row[key + "_error"] = true;
          return;
        } else {
          row[key + "_error"] = false;
        }
        if (key === "min_bet" || key === "max_bet") {
          if (row.min_bet > row.max_bet) {
            row[key + "_error"] = true;
            return;
          } else {
            row[key + "_error"] = false;
          }
        }
      },
      onSubmit() {
        const vm = this;
        if (!this.userType) {
          vm.$store.state.message(this.$t("message.qing_xuan_ze") + this.$t("message.user_type"), 'error', 1500, vm);
          return;
        }
        if (!this.loginname) {
          vm.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.username"), 'error', 1500, vm);
          return;
        }
        if (!validator.regexpInput(this.loginname)) {
          vm.$store.state.message(this.$t("message.username") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, vm);
          return;
        }
        if (!this.password) {
          vm.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.password"), 'error', 1500, vm);
          return;
        }
        if (!validator.regexpPsd(this.password)) {
          vm.$store.state.message(this.$t("message.password") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, vm);
          return;
        }
        if (!this.re_password) {
          vm.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.confirm_pwd"), 'error', 1500, vm);
          return;
        }
        if (!validator.regexpPsd(this.re_password)) {
          vm.$store.state.message(this.$t("message.confirm_pwd") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, vm);
          return;
        }
        if (this.password != this.re_password) {
          vm.$store.state.message(this.$t("message.qian_hou_mi_ma_bu_yi_zhi"), 'error', 1500, vm);
          return;
        }
        // if (!this.phone) {
        //   vm.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.phone"), 'error', 1500, vm);
        //   return;
        // }
        // if (!validator.cellphone(this.phone)) {
        //   vm.$store.state.message(this.$t("message.phone") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, vm);
        //   return;
        // }
        // if (!this.email) {
        //   vm.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.email"), 'error', 1500, vm);
        //   return;
        // }
        // if (!validator.email(this.email)) {
        //   vm.$store.state.message(this.$t("message.email") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, vm);
        //   return;
        // }
        // if (!this.firstname) {
        //   vm.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.firstname"), 'error', 1500, vm);
        //   return;
        // }
        // if (!this.lastname) {
        //   vm.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.lastname"), 'error', 1500, vm);
        //   return;
        // }
        // if (!this.cash_credit) {
        //   this.$message({
        //     message: this.$t("message.qing_shu_ru") + this.$t("message.xin_yong_e"),
        //     center: true,
        //     type: "error",
        //     duration: 1000
        //   });
        //   return;
        // }
        // if (Number(this.cash_credit) > Number(localStorage.getItem('candy-cash').toString())) {
        //   this.$message({
        //     message: this.$t("message.xin_yong_e") + this.$t("message.chao_chu_fan_wei"),
        //     center: true,
        //     type: "error",
        //     duration: 1000
        //   });
        //   return;
        // }
        for (let i in vm.user_refund) {
          let refundItem = vm.user_refund[i];
          if (!refundItem.min_bet && Number(refundItem.min_bet) != 0) {
            vm.$store.state.message(this.$t("message.min_tou_zhu_e") + this.$t("message.bu_neng_wei_kong"), 'error', 1500, vm);
            return;
          }
          if (
            refundItem.min_bet > refundItem.min_bet_ ||
            refundItem.min_bet < 0
          ) {
            vm.$store.state.message(this.$t("message.min_tou_zhu_e") + this.$t("message.chao_chu_fan_wei"), 'error', 1500, vm);
            return;
          }
          if (!refundItem.max_bet && Number(refundItem.max_bet) != 0) {
            vm.$store.state.message(this.$t("message.max_tou_zhu_e") + this.$t("message.bu_neng_wei_kong"), 'error', 1500, vm);
            return;
          }
          if (
            refundItem.max_bet > refundItem.max_bet_ ||
            refundItem.max_bet < 0
          ) {
            vm.$store.state.message(this.$t("message.max_tou_zhu_e") + this.$t("message.chao_chu_fan_wei"), 'error', 1500, vm);
            return;
          }
          if (refundItem.min_bet > refundItem.max_bet) {
            vm.$store.state.message(this.$t("message.max_tou_zhu_e") + this.$t("message.bu_de_da_yu") + this.$t("message.min_tou_zhu_e"), 'error', 1500, vm);
            vm.user_refund[i].error = true;
            return;
          }
          if (!refundItem.prize && Number(refundItem.prize) != 0) {
            vm.$store.state.message(this.$t("message.max_tou_zhu_e") + this.$t("message.bu_neng_wei_kong"), 'error', 1500, vm);
            return;
          }
          if (refundItem.prize > refundItem.prize_ || refundItem.prize < 0) {
            vm.$store.state.message(this.$t("message.pei_lv") + this.$t("message.chao_chu_fan_wei"), 'error', 1500, vm);
            return;
          }
          if (!refundItem.stock && Number(refundItem.stock) != 0) {
            vm.$store.state.message(this.$t("message.stock") + this.$t("message.bu_neng_wei_kong"), 'error', 1500, vm);
            return;
          }
          if (refundItem.stock > refundItem.stock_ || refundItem.stock < 0) {
            vm.$store.state.message(this.$t("message.stock") + this.$t("message.chao_chu_fan_wei"), 'error', 1500, vm);
            return;
          }
          if (!refundItem.discount && Number(refundItem.discount) != 0) {
            vm.$store.state.message(this.$t("message.discount") + this.$t("message.bu_neng_wei_kong"), 'error', 1500, vm);
            return;
          }
          if (
            refundItem.discount > refundItem.discount_ ||
            refundItem.discount < 0
          ) {
            vm.$store.state.message(this.$t("message.discount") + this.$t("message.chao_chu_fan_wei"), 'error', 1500, vm);
            return;
          }
          if (
            !(
              Number((refundItem.prize * 100) / refundItem.motherprize_) +
              Number(refundItem.discount) <
              100
            )
          ) {
            vm.$store.state.message(this.$t("message.pei_lv") + "、" + this.$t("message.discount") + this.$t("message.chao_chu_fan_wei"), 'error', 1500, vm);
            return;
          }
          this.cellChange("min_bet", vm.user_refund[i]);
          this.cellChange("max_bet", vm.user_refund[i]);
          this.cellChange("prize", vm.user_refund[i]);
          this.cellChange("discount", vm.user_refund[i]);
          this.cellChange("stock", vm.user_refund[i]);
        }
        vm.$confirm(
            vm.$t("message.que_ren_kai_hu_me"),
            vm.$t("message.que_ren"), {
              confirmButtonText: "OK",
              cancelButtonText: "Cancel",
              type: "warning"
            }
          )
          .then(() => {
            vm.loading = true;
            let url = "/agency/user/create";
            let refund_final = [];
            for (let j in vm.user_refund) {
              let item = vm.user_refund[j];
              let finalItem = {
                gameid: item.gameid,
                lotteryid: item.lotteryid,
                min_bet: item.min_bet,
                max_bet: item.max_bet,
                prize: item.prize,
                stock: item.stock,
                discount: item.discount
              };
              refund_final.push(finalItem);
            }
            vm.$http
              .post(url, {
                loginname: vm.loginname,
                password: CryptoJS.MD5(vm.password).toString(),
                phone: vm.phone,
                email: vm.email,
                firstname: vm.firstname,
                lastname: vm.lastname,
                // cash_credit: vm.cash_credit,
                type: vm.userType,
                user_refund: refund_final
              })
              .then(
                response => {
                  vm.loading = false;
                  let status = response.body.returncode;
                  if (status) {
                    if (status == 103 || status == 106 || status == 101) {
                      this.$store.state.reLogin(this);
                    } else if (status == 200) {
                      vm.$store.state.message(this.$t("message.kai_hu_cheng_gong"), 'success', 1500, vm);
                      vm.resetForm();
                      vm.getProfile();
                    } else if (status == 305) {
                      vm.$store.state.message(this.$t("message.user_name_yi_cun_zai"), 'error', 1500, vm);
                    } else {
                      vm.$store.state.message(this.$t("message.kai_hu_shi_bai") + ":" + status, 'error', 1500, vm);
                    }
                  }
                },
                response => {
                  console.log("error", error);
                  vm.loading = false;
                }
              );
          })
          .catch(() => {});
      },
      handleConfirm() {
        this.onSubmit();
      },
      handleCancel() {
        this.resetForm();
      },
      resetForm() {
        this.loginname = "";
        this.password = "";
        this.re_password = "";
        this.phone = "";
        this.firstname = "";
        this.lastname = "";
        // this.cash_credit = "";
        this.email = "";
        /* for (let j in this.user_refund) {
            this.user_refund[j].min_bet = "";
            this.user_refund[j].max_bet = "";
            this.user_refund[j].prize = "";
            this.user_refund[j].stock = "";
            this.user_refund[j].discount = "";
          } */
      },
      combineCell(list) {
        let field = 'parent';
        var k = 0;
        while (k < list.length) {
          list[k][field + 'span'] = 1;
          list[k][field + 'dis'] = false;
          for (var i = k + 1; i <= list.length - 1; i++) {
            if (list[k][field] == list[i][field] && list[k][field] != '') {
              list[k][field + 'span']++;
              list[k][field + 'dis'] = false;
              list[i][field + 'span'] = 1;
              list[i][field + 'dis'] = true;
            } else {
              break;
            }
          }
          k = i;
        }
        return list;
      },
      getLimits() {
        const vm = this;
        vm.loading = true;
        vm.$http.get("/lottery/limites", {}).then(
          response => {
            vm.loading = false;
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.reLogin(this);
              } else if (status == 200) {
                let data = response.body.data;
                data.sort(
                  function compareFunction(param1, param2) {
                    let id1 = param1.parent;
                    let id2 = param2.parent;
                    return id1.localeCompare(id2);
                  }
                )
                vm.tableList = this.combineCell(data);
                for (let i in vm.tableList) {
                  let tableItem = vm.tableList[i];
                  let row = {
                    gameid: tableItem.parentid.parentid._id,
                    lotteryid: tableItem._id,
                    min_bet: tableItem.min_bet,
                    max_bet: tableItem.max_bet,
                    prize: tableItem.prize,
                    stock: '0',
                    discount: tableItem.discount,
                    min_bet_: tableItem.min_bet,
                    max_bet_: tableItem.max_bet,
                    prize_: tableItem.prize,
                    stock_: tableItem.stock,
                    discount_: tableItem.discount,
                    motherprize_: tableItem.motherprize,
                    min_bet_error: false,
                    max_bet_error: false,
                    prize_error: false,
                    stock_error: false,
                    discount_error: false,
                    stock_disable: true
                  };
                  vm.cellChange("min_bet", row);
                  vm.cellChange("max_bet", row);
                  vm.cellChange("prize", row);
                  vm.cellChange("discount", row);
                  vm.cellChange("stock", row);
                  vm.user_refund.push(row);
                }
              } else {
                vm.$store.state.message(this.$t("message.server_cuo_wu"), 'error', 1500, vm);
              }
            }
          },
          error => {
            console.log("error", error);
            vm.loading = false;
            vm.tableList = [];
          }
        );
      },
      getProfile() {
        const vm = this;
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
                localStorage.setItem("candy-cash", data.cash);
                localStorage.setItem("candy-birthday", data.birthday||'');
                this.$store.dispatch("setCash", data.cash);
                localStorage.setItem("candy-cash_credit", data.cash_credit);
                localStorage.setItem("candy-loginname", data.loginname);
                localStorage.setItem("candy-loginid", data._id);
                localStorage.setItem("candy-phone", data.phone);
                localStorage.setItem("candy-email", data.email);
                localStorage.setItem("candy-lineid", data.lineid);
                localStorage.setItem('candy-firstname', data.firstname);
                localStorage.setItem('candy-lastname', data.lastname);
                if (data.superiorid) {
                  if (data.superiorid.phone) {
                    localStorage.setItem("candy-superiorphone", data.superiorid.phone);
                  }
                  if (data.superiorid.lineid) {
                    localStorage.setItem("candy-superiorlineid", data.superiorid.lineid);
                  }
                }
                localStorage.setItem("candy-type", data.type);
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
      numExp(id) {
        let obj = document.getElementById(id);
        obj.value = obj.value.replace(/[^\d]/g, "");
      }
    },
    watch: {
      'userType'() {
        const vm = this;
        for (let i in vm.user_refund) {
          switch (vm.userType) {
            case '0':
              vm.user_refund[i].stock = '0';
              vm.user_refund[i].stock_disable = true;
              break;
            case '1':
              vm.user_refund[i].stock = vm.user_refund[i].stock_;
              vm.user_refund[i].stock_disable = false;
              break;
          }
        }
      }
    }
  };

</script>

<style lang="scss" scoped>
  .user-create-wrap {
    background: #efefef;
    padding: 60px 0;

    td.hidden {
      display: none !important;
    }

    .card-body {
      padding: 60px 20px;
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

    .list-title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #191919;
      text-align: left;
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

      tbody {
        max-height: 300px;
        overflow: scroll;
      }

      tr {
        >td {
          padding: 15px 10px;
          border: 1px solid #e8e8e8;
          white-space: nowrap;
        }
      }

      .td_input {
        display: inline-block;
        height: 32px;
        width: 80px;
        background: #ffffff;
        border: 1px solid #979797;
        box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.5);
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #191919;
        text-align: center;

        &.error {
          border: 1px solid #f00;
          box-shadow: inset 0 1px 3px 0 rgba(255, 0, 0, 0.5);
        }

        &:disabled {
          background-color: #f5f7fa;
          color: #c0c4cc;
          cursor: not-allowed;
          border: 1px solid #e4e7ed;
          box-shadow: none;
        }
      }

      .td_num {}
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
