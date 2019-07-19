<template>
  <div class="link-create-wrap common">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item" :to="{name:'memberList'}">
          <div class="item-inner">{{$t('message.memberList')}}</div>
        </router-link>
        <router-link class="tab-item" :to="{name:'userCreate'}">
          <div class="item-inner">{{$t('message.userCreate')}}</div>
        </router-link>
        <!-- <router-link class="tab-item selected" :to="{name:'linkCreate'}">
          <div class="item-inner">{{$t('message.linkCreate')}}</div>
        </router-link> -->
      </div>
      <div class="card mt-30" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="card-body clearfix">
          <div class="create-row">
            <a class="btn-copy mb-20" @click="handleOpen">{{$t('message.add_link')}}</a>
          </div>
          <div class="table-container">
            <table class="table-list">
              <thead>
                <tr>
                  <th>
                    <div class="cell">{{$t('message.tui_guang_ma')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.zhu_ce_ren_shu')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.sheng_cheng_shi_jian')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.lian_jie_di_zhi')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.check')}}</div>
                  </th>
                </tr>
              </thead>
              <tbody v-if="!noResult">
                <tr v-for="(item,index) in list" :key="index">
                  <td>
                    <div class="cell">{{item.code}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.num_registered}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.create_at | formatTime}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.url}}</div>
                  </td>
                  <td>
                    <div class="cell">
                      <button class="detail cell-btn" @click="handleOpen2(item)">{{$t('message.bian_ji')}}</button>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody v-if="noResult">
                <tr class="no-result">
                  <td colspan="9">
                    <p>{{$t('message.no_result')}}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="record-pagination clearfix">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex"
              :page-size="pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" top="0" custom-class="common-dialog" center :before-close="handleClose"
      v-loading="limitsLoading">
      <div slot="title" class="dialog-header">
        <img src="@/assets/img/confirm.png" class="icon">
        <span class="title">{{$t('message.add_link')}}</span>
      </div>
      <div class="body">
        <table class="user-table">
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
        <table class="table-list mt-20 table-dialog">
          <thead>
            <tr>
              <th>{{$t('message.cai_zhong')}}</th>
              <th>{{$t('message.wan_fa')}}</th>
              <th>{{$t('message.min_tou_zhu_e')}}</th>
              <th>{{$t('message.max_tou_zhu_e')}}</th>
              <th>{{$t('message.pei_lv')}}</th>
              <th>{{$t('message.discount')}}</th>
              <th>{{$t('message.stock')}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in tableList" :key="index">
              <td :rowspan="item.parentspan" :class="{hidden: item.parentdis}">
                <span v-if="$i18n.locale==='zh'">
                  {{item.parentid && item.parentid.parentid ?
                  item.parentid.parentid.name_cn :'--'}}
                </span>
                <span v-if="$i18n.locale==='th'">
                  {{item.parentid
                  && item.parentid.parentid ?
                  item.parentid.parentid.name_th :'--'}}
                </span>
              </td>
              <td>
                <span v-if="$i18n.locale==='zh'">{{item.name_cn}}</span>
                <span v-if="$i18n.locale==='th'">{{item.name_th}}</span>
              </td>
              <td>
                <input class="td_input" v-model.trim="user_refund[index].min_bet" @change="cellChange('min_bet',user_refund[index])"
                  :class="{'error':user_refund[index].min_bet_error}">
                <span class="td_num">
                  <i class="iconfont icon-xiaoyudengyufuhao"></i>
                  {{item.min_bet}}
                </span>
              </td>
              <td>
                <input class="td_input" v-model.trim="user_refund[index].max_bet" @change="cellChange('max_bet',user_refund[index])"
                  :class="{'error':user_refund[index].max_bet_error}">
                <span class="td_num">
                  <i class="iconfont icon-xiaoyudengyufuhao"></i>
                  {{item.max_bet}}
                </span>
              </td>
              <td>
                <input class="td_input" v-model.trim="user_refund[index].prize" @change="cellChange('prize',user_refund[index])"
                  :class="{'error':user_refund[index].prize_error}">
                <span class="td_num">
                  <i class="iconfont icon-xiaoyudengyufuhao"></i>
                  {{item.prize}}
                </span>
              </td>
              <td>
                <input class="td_input" v-model.trim="user_refund[index].discount" @change="cellChange('discount',user_refund[index])"
                  :class="{'error':user_refund[index].discount_error}">
                <span class="td_num">
                  <i class="iconfont icon-xiaoyudengyufuhao"></i>
                  {{item.discount}}
                </span>
              </td>
              <td>
                <input class="td_input" v-model.trim="user_refund[index].stock" @change="cellChange('stock',user_refund[index])"
                  :class="{'error':user_refund[index].stock_error}" :disabled="user_refund[index].stock_disable">
                <span class="td_num">
                  <i class="iconfont icon-xiaoyudengyufuhao"></i>
                  {{item.stock}}
                </span>
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
    <el-dialog :visible.sync="dialogVisible2" :close-on-click-modal="false" :before-close="handleClose2" top="0"
      custom-class="common-dialog" center @closed="closed2()" v-loading="dialogLoading2">
      <div slot="title" class="dialog-header">
        <img src="@/assets/img/confirm.png" class="icon">
        <span class="title">{{$t('message.bian_ji')}}</span>
      </div>
      <div class="body">
        <table class="user-table">
          <tbody>
            <tr>
              <td class="left">
                <label>{{$t('message.user_type')}}：</label>
              </td>
              <td class="right">
                <label>{{filterType(memberUser.type)}}</label>
              </td>
            </tr>
            <!-- <tr>
              <td class="left">
                <label>{{$t('message.xin_yong_e')}}：</label>
              </td>
              <td class="right">
                <label>{{memberUser.cash_credit}}</label>
              </td>
            </tr> -->
          </tbody>
        </table>
        <p class="mt-60 list-title">{{$t('message.lottery_setting')}}</p>
        <div class="table-container">
          <table class="table-list mt-20 table-dialog">
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
                  <span v-if="$i18n.locale==='zh'">
                    {{item.parentid && item.parentid.parentid ?
                    item.parentid.parentid.name_cn :'--'}}
                  </span>
                  <span v-if="$i18n.locale==='th'">
                    {{item.parentid
                    && item.parentid.parentid ?
                    item.parentid.parentid.name_th :'--'}}
                  </span>
                </td>
                <td>
                  <span v-if="$i18n.locale==='zh'">{{item.name_cn}}</span>
                  <span v-if="$i18n.locale==='th'">{{item.name_th}}</span>
                </td>
                <td>
                  <input class="td_input" v-model.trim="user_refund[index].min_bet" @blur="rowBlur(index,'min_bet')"
                    @change="cellChange('min_bet',user_refund[index])" :class="{'error':user_refund[index].min_bet_error}">
                  <span class="td_num">
                    <i class="iconfont icon-xiaoyudengyufuhao"></i>
                    {{item.min_bet}}
                  </span>
                </td>
                <td>
                  <input class="td_input" v-model.trim="user_refund[index].max_bet" @blur="rowBlur(index,'max_bet')"
                    @change="cellChange('max_bet',user_refund[index])" :class="{'error':user_refund[index].max_bet_error}">
                  <span class="td_num">
                    <i class="iconfont icon-xiaoyudengyufuhao"></i>
                    {{item.max_bet}}
                  </span>
                </td>
                <td>
                  <input class="td_input" v-model.trim="user_refund[index].prize" @blur="rowBlur(index,'prize')"
                    @change="cellChange('prize',user_refund[index])" :class="{'error':user_refund[index].prize_error}">
                  <span class="td_num">
                    <i class="iconfont icon-xiaoyudengyufuhao"></i>
                    {{item.prize}}
                  </span>
                </td>
                <td>
                  <input class="td_input" v-model.trim="user_refund[index].discount" @blur="rowBlur(index,'discount')"
                    @change="cellChange('discount',user_refund[index])" :class="{'error':user_refund[index].discount_error}">
                  <span class="td_num">
                    <i class="iconfont icon-xiaoyudengyufuhao"></i>
                    {{item.discount}}
                  </span>
                </td>
                <td>
                  <input class="td_input" v-model.trim="user_refund[index].stock" @blur="rowBlur(index,'stock')"
                    @change="cellChange('stock',user_refund[index])" :class="{'error':user_refund[index].stock_error}"
                    :disabled="user_refund[index].stock_disable">
                  <span class="td_num">
                    <i class="iconfont icon-xiaoyudengyufuhao"></i>
                    {{item.stock}}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import * as validator from "../../../../static/utils/validator";
  import moment from "moment";

  export default {
    name: "linCreate",
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
        cash_credit: "",
        user_refund: [], //[{gameid:gameid,lotteryid:lotteryid,min_bet:min_bet,max_bet:max_bet,prize:prize}]
        tableList: [],
        list: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 15, //单页条数
        loading: false,
        dialogVisible: false,
        limitsLoading: false,
        memberUser: {},
        memberRefund: [],
        dialogVisible2: false,
        dialogLoading2: false
      };
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      sessionStorage.setItem("th_tag_url", "linkCreate");
      // const vm = this;
      // let candy_type = localStorage.getItem("candy-type").toString();
      // let window_open = candy_type === "1";
      // if (window_open) {
      //   setTimeout(function () {
      //     vm.$router.push({
      //       name: "home"
      //     });
      //   }, 1000);
      // }
    },
    mounted() {
      this.getLinkList();
    },
    methods: {
      closed2() {
        this.tableList = [];
        this.user_refund = [];
        this.memberUser = {};
        this.memberRefund = [];
        this.getLinkList();
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
      filterType(v) {
        const vm = this;
        if (v || v === 0) {
          switch (parseInt(v)) {
            case 0:
              return vm.$t("message.user_type_1");
            case 1:
              return vm.$t("message.user_type_2");
            case 2:
              return vm.$t("message.user_type_3");
          }
        }
        return "--";
      },
      rowBlur(index, key) {
        const vm = this;
        if (vm.user_refund[index][key] === vm.memberRefund[index][key]) {
          return;
        }
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
            return;
          }
          if (!refundItem.prize && Number(refundItem.prize) != 0) {
            vm.$store.state.message(this.$t("message.max_tou_zhu_e") + this.$t("message.bu_neng_wei_kong"), 'error', 1500, vm);
            // this.$message({
            //   message: this.$t("message.max_tou_zhu_e") +
            //     this.$t("message.bu_neng_wei_kong"),
            //   center: true,
            //   type: "error",
            //   duration: 1000
            // });
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
        }
        vm.dialogLoading2 = true;
        let url = "/agency/user/refund/update";
        vm.$http
          .post(url, {
            min_bet: Number(vm.user_refund[index].min_bet),
            max_bet: Number(vm.user_refund[index].max_bet),
            prize: Number(vm.user_refund[index].prize),
            linkid: vm.user_refund[index].linkid,
            refundid: vm.user_refund[index].refundid || "",
            gameid: vm.user_refund[index].gameid,
            lotteryid: vm.user_refund[index].lotteryid,
            stock: Number(vm.user_refund[index].stock),
            discount: Number(vm.user_refund[index].discount)
          })
          .then(
            response => {
              vm.dialogLoading2 = false;
              let status = response.body.returncode;
              if (status) {
                if (status == 103 || status == 106 || status == 101) {
                  this.$store.state.reLogin(this);
                } else if (status == 200) {
                  vm.$store.state.message(this.$t("message.commit_success"), 'success', 1500, vm);
                  this.$message({
                    message: this.$t("message.commit_success"),
                    center: true,
                    type: "success",
                    duration: 1000
                  });
                  // this.dialogVisible2 = false;
                  // this.getLinkList();
                } else {
                  vm.$store.state.message(this.$t("message.update_failed"), 'error', 1500, vm);
                }
              }
            },
            response => {
              // console.log('error', error);
              vm.dialogLoading2 = false;
            }
          );
      },
      getLinkList() {
        const vm = this;
        let data = {
          page_size: vm.pageSize,
          page_num: vm.pageIndex,
          type: [0, 1]
        };
        vm.loading = true;
        let url = "/agency/link/list";
        vm.$http
          .get(url, {
            params: data
          })
          .then(
            response => {
              // console.log('response', response);
              vm.loading = false;
              let status = response.body.returncode;
              if (status) {
                if (status == 103 || status == 106 || status == 101) {
                  this.$store.state.reLogin(this);
                } else if (status == 200) {
                  vm.total = response.body.data.total;
                  if (vm.total) {
                    vm.noResult = false;
                    vm.totalPageNum = response.body.data.total_page_num;
                    vm.list = response.body.data.data;
                  } else {
                    vm.noResult = true;
                    vm.list = [];
                  }
                } else {
                  vm.noResult = true;
                  vm.list = [];
                }
              }
            },
            response => {
              // console.log('error', error);
              vm.loading = false;
              vm.noResult = true;
              vm.list = [];
            }
          );
      },
      handleSizeChange(val) {},
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getLinkList();
      },
      handleOpen() {
        this.getLimits();
      },
      handleOpen2(item) {
        this.memberUser = item;
        this.memberRefund = item.refunds.sort(
          function compareFunction(param1, param2) {
            let id1 = param1.parent;
            let id2 = param2.parent;
            return id1.localeCompare(id2);
          }
        )
        this.getLimits2();
      },
      handleClose() {
        this.dialogVisible = false;
        this.tableList = [];
        this.user_refund = [];
      },
      handleClose2() {
        this.dialogVisible2 = false;
      },
      onSubmit() {
        const vm = this;
        if (!this.userType) {
          vm.$store.state.message(this.$t("message.qing_xuan_ze") + this.$t("message.user_type"), 'error', 1500, vm);
          return;
        }
        // if (!this.cash_credit) {
        //   this.$message({
        //     message: this.$t("message.qing_shu_ru") + this.$t("message.xin_yong_e"),
        //     center: true,
        //     type: "error",
        //     duration: 1000
        //   });
        //   return;
        // }
        // if (
        //   Number(this.cash_credit) >
        //   Number(localStorage.getItem("candy-cash").toString())
        // ) {
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
            return;
          }
          if (!refundItem.prize && Number(refundItem.prize) != 0) {
            vm.$store.state.message(this.$t("message.max_tou_zhu_e") + this.$t("message.bu_neng_wei_kong"), 'error', 1500, vm);
            // this.$message({
            //   message: this.$t("message.max_tou_zhu_e") +
            //     this.$t("message.bu_neng_wei_kong"),
            //   center: true,
            //   type: "error",
            //   duration: 1000
            // });
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
            let url = "/agency/link/create";
            let refund_final = [];
            for (let j in vm.user_refund) {
              let item = vm.user_refund[j];
              let finalItem = {
                gameid: item.gameid,
                lotteryid: item.lotteryid,
                min_bet: Number(item.min_bet),
                max_bet: Number(item.max_bet),
                prize: Number(item.prize),
                stock: Number(item.stock),
                discount: Number(item.discount)
              };
              refund_final.push(finalItem);
            }
            vm.$http
              .post(url, {
                type: vm.userType,
                // cash_credit: vm.cash_credit,
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
                      vm.dialogVisible = false;
                      vm.$store.state.message(this.$t("message.kai_hu_cheng_gong"), 'success', 1500, vm);
                      vm.resetForm();
                      vm.getLinkList();
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
        this.dialogVisible = false;
        this.resetForm();
      },
      resetForm() {
        this.userType = "";
        // this.cash_credit = "";
        this.user_refund = [];
        this.memberUser = {};
        this.tableList = [];
        this.memberRefund = [];
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
                vm.dialogVisible = true;
                let data = response.body.data;
                data.sort(
                  function compareFunction(param1, param2) {
                    let id1 = param1.parent;
                    let id2 = param2.parent;
                    return id1.localeCompare(id2);
                  }
                )
                vm.tableList = vm.combineCell(data);
                for (let i in vm.tableList) {
                  let tableItem = vm.tableList[i];
                  let row = {
                    gameid: tableItem.parentid.parentid._id,
                    lotteryid: tableItem._id,
                    min_bet: tableItem.min_bet,
                    max_bet: tableItem.max_bet,
                    prize: tableItem.prize,
                    stock: "0",
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
      getLimits2() {
        const vm = this;
        vm.limitsLoading = true;
        vm.$http.get("/lottery/limites", {}).then(
          response => {
            vm.limitsLoading = false;
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
                vm.tableList = vm.combineCell(data);
                for (let i in vm.tableList) {
                  let tableItem = vm.tableList[i];
                  let obj = {};
                  obj = vm.memberRefund.find(item => {
                    return item.lotteryid._id === tableItem._id;
                  });
                  let row = {
                    gameid: tableItem.parentid.parentid._id,
                    lotteryid: tableItem._id,
                    min_bet: obj.min_bet,
                    max_bet: obj.max_bet,
                    prize: obj.prize,
                    stock: obj.stock,
                    discount: obj.discount,
                    min_bet_: tableItem.min_bet,
                    max_bet_: tableItem.max_bet,
                    prize_: tableItem.prize,
                    stock_: tableItem.stock,
                    discount_: tableItem.discount,
                    motherprize_: tableItem.motherprize,
                    linkid: obj.linkid,
                    refundid: obj._id,
                    min_bet_error: false,
                    max_bet_error: false,
                    prize_error: false,
                    stock_error: false,
                    discount_error: false
                  };
                  if (Number(vm.memberUser.type) === 0) {
                    row.stock_disable = true;
                  } else {
                    row.stock_disable = false;
                  }
                  vm.cellChange("min_bet", row);
                  vm.cellChange("max_bet", row);
                  vm.cellChange("prize", row);
                  vm.cellChange("discount", row);
                  vm.cellChange("stock", row);
                  vm.user_refund.push(row);
                  this.dialogVisible2 = true;
                }
              } else {
                vm.$store.state.message(this.$t("message.server_cuo_wu"), 'error', 1500, vm);
              }
            }
          },
          error => {
            console.log("error", error);
            vm.limitsLoading = false;
            vm.tableList = [];
          }
        );
      },
      numExp(id) {
        let obj = document.getElementById(id);
        obj.value = obj.value.replace(/[^\d]/g, "");
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
    },
    watch: {
      userType() {
        const vm = this;
        for (let i in vm.user_refund) {
          switch (vm.userType) {
            case "0":
              vm.user_refund[i].stock = "0";
              vm.user_refund[i].stock_disable = true;
              break;
            case "1":
              vm.user_refund[i].stock = vm.user_refund[i].stock_;
              vm.user_refund[i].stock_disable = false;
              break;
          }
        }
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
  .link-create-wrap {
    background: #efefef;
    padding: 60px 0;

    td.hidden {
      display: none !important;
    }

    .detail {
      background-image: linear-gradient(-180deg, #7c7c7c 0%, #464646 100%);
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      width: 72px;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
    }

    .card-body {
      padding: 60px 20px;

      .btn-copy {
        width: 100px;
        display: inline-block;
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

    .list-title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #191919;
      text-align: left;
    }

    .create-row {
      text-align: right;
    }

    table.table-list {
      border-collapse: collapse;
      width: 100%;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #191919;
      text-align: center;

      &.table-dialog {
        tr>td {
          padding: 15px 10px;
          border: 1px solid #e8e8e8;
          white-space: nowrap;
        }
      }

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
          padding: 15px 0;
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
  }

</style>
