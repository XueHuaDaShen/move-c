<template>
  <div class="member-wrap common">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item selected" :to="{name:'memberList'}">
          <div class="item-inner">
            {{$t('message.memberList')}}
          </div>
        </router-link>
        <router-link class="tab-item" :to="{name:'userCreate'}">
          <div class="item-inner">{{$t('message.userCreate')}}</div>
        </router-link>
        <!-- <router-link class="tab-item" :to="{name:'linkCreate'}">
          <div class="item-inner">
            {{$t('message.linkCreate')}}
          </div>
        </router-link> -->
      </div>
      <div class="card mt-30" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="table-container">
          <table class="record-table mt-60">
            <thead>
              <tr>
                <th>
                  <div class="cell">{{$t('message.username')}}</div>
                </th>
                <th>
                  <div class="cell">{{$t('message.firstname')}}</div>
                </th>
                <th>
                  <div class="cell">{{$t('message.type')}}</div>
                </th>
                <th>
                  <div class="cell">{{$t('message.zhang_hu_yu_e')}}</div>
                </th>
                <th>
                  <div class="cell">{{$t('message.phone')}}</div>
                </th>
                <th>
                  <div class="cell">{{$t('message.zhu_ce_shi_jian')}}</div>
                </th>
                <th>
                  <div class="cell">{{$t('message.status')}}</div>
                </th>
                <th>
                  <div class="cell">{{$t('message.check')}}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!noResult" v-for="(item,index) in list" :key="index">
                <td>
                  <div class="cell">{{item.loginname ? item.loginname : '--'}}</div>
                </td>
                <td>
                  <div class="cell">{{item.firstname}}</div>
                </td>
                <td>
                  <div class="cell">{{filterType(item.type)}}</div>
                </td>
                <th>
                  <div class="cell">{{item.cash | filterCash}}</div>
                </th>
                <td>
                  <div class="cell">{{item.phone ? item.phone :'--'}}</div>
                </td>
                <td>
                  <div class="cell">{{item.create_at | formatTime}}</div>
                </td>
                <td>
                  <div class="cell">{{filterStatus(item.status)}}</div>
                </td>
                <td>
                  <div class="cell"><button class="detail cell-btn" @click="handleOpen(item._id)">{{$t('message.bian_ji')}}</button></div>
                </td>
              </tr>
              <tr v-if="noResult" class="no-result">
                <td colspan="9">
                  <p>{{$t('message.no_result')}}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="record-pagination clearfix">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex"
            :page-size="pageSize" layout="total, prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" :before-close="handleClose" @closed="closed()"
      v-loading="dialogLoading" top="0" custom-class="common-dialog" center>
      <div slot="title" class="dialog-header">
        <img src="@/assets/img/confirm.png" class="icon" />
        <span class="title">{{$t('message.bian_ji')}}</span>
      </div>
      <div class="body">
        <table class="user-table">
          <tbody>
            <tr>
              <td class="left">
                <label>{{$t('message.user_type')}}:</label>
              </td>
              <td class="right">
                <label>{{filterType(memberUser.type)}}</label>
              </td>
            </tr>
            <tr>
              <td class="left">
                <label>{{$t('message.username')}}:</label>
              </td>
              <td class="right">
                <label>{{memberUser.loginname}}</label>
              </td>
            </tr>
            <tr>
              <td class="left">
                <label>{{$t('message.email')}}:</label>
              </td>
              <td class="right">
                <label>{{memberUser.email}}</label>
              </td>
            </tr>
            <!-- <tr>
              <td class="left">
                <label>{{$t('message.xin_yong_e')}}:</label>
              </td>
              <td class="right">
                <input class="c-input" id="user_create_credit" @keyup="numExp('user_create_credit')" type="text"
                  v-model.trim="cash_credit" :placeholder="$t('message.qing_shu_ru') + $t('message.xin_yong_e') + '(0-1000)'"
                  @blur="cashBlur" />
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
                  <span v-if="$i18n.locale==='zh'">{{item.parentid && item.parentid.parentid ?
                    item.parentid.parentid.name_cn : '--'}}</span><span v-if="$i18n.locale==='th'">{{item.parentid &&
                    item.parentid.parentid ?
                    item.parentid.parentid.name_th : '--'}}</span>
                </td>
                <td>
                  <span v-if="$i18n.locale==='zh'">{{item.name_cn ? item.name_cn : '--'}}</span><span v-if="$i18n.locale==='th'">{{item.name_th
                    ? item.name_th : '--'}}</span>
                </td>
                <td><input class="td_input" v-model.trim="user_refund[index].min_bet" @blur="rowBlur(index,'min_bet')"
                    @change="cellChange('min_bet',user_refund[index])" :class="{'error':user_refund[index].min_bet_error}" />
                  <span class="td_num"><i class="iconfont icon-xiaoyudengyufuhao"></i>{{item.min_bet}}</span></td>
                <td><input class="td_input" v-model.trim="user_refund[index].max_bet" @blur="rowBlur(index,'max_bet')"
                    @change="cellChange('max_bet',user_refund[index])" :class="{'error':user_refund[index].max_bet_error}" />
                  <span class="td_num">
                    <i class="iconfont icon-xiaoyudengyufuhao"></i>{{item.max_bet}} </span> </td>
                <td><input class="td_input" v-model.trim="user_refund[index].prize" @blur="rowBlur(index,'prize')"
                    @change="cellChange('prize',user_refund[index])" :class="{'error':user_refund[index].prize_error}" /><span
                    class="td_num">
                    <i class="iconfont icon-xiaoyudengyufuhao"></i>{{item.prize}} </span> </td>
                <td>
                  <input class="td_input" v-model.trim="user_refund[index].discount" @blur="rowBlur(index,'discount')"
                    @change="cellChange('discount',user_refund[index])" :class="{'error':user_refund[index].discount_error}" /><span
                    class="td_num">
                    <i class="iconfont icon-xiaoyudengyufuhao"></i>{{item.discount}} </span>
                </td>
                <td>
                  <input class="td_input" v-model.trim="user_refund[index].stock" @blur="rowBlur(index,'stock')"
                    @change="cellChange('stock',user_refund[index])" :class="{'error':user_refund[index].stock_error}"
                    :disabled="user_refund[index].stock_disable" /><span class="td_num">
                    <i class="iconfont icon-xiaoyudengyufuhao"></i>{{item.stock}} </span>
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
  import moment from 'moment';
  export default {
    name: "memberList",
    components: {},
    props: {},
    data() {
      return {
        list: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 20, //单页条数
        loading: false,
        cash_credit: "",
        user_refund: [],
        //[{gameid:gameid,lotteryid:lotteryid,min_bet:min_bet,max_bet:max_bet,prize:prize}]
        tableList: [],
        dialogLoading: false,
        dialogVisible: false,
        memberUser: {},
        memberRefund: []
      };
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      sessionStorage.setItem('th_tag_url', 'memberList');
    },
    mounted() {
      this.getMemberList();
    },
    methods: {
      closed() {
        this.resetForm();
      },
      // 单元格数值校验
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
      numExp(id) {
        let obj = document.getElementById(id);
        obj.value = obj.value.replace(/[^\d]/g, '')
      },
      getMemberList() {
        const vm = this;
        let data = {
          page_size: vm.pageSize,
          page_num: vm.pageIndex,
        };
        vm.loading = true;
        let url = '/agency/user/list';
        vm.$http.get(url, {
          params: data
        }).then(response => {
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
        }, response => {
          // console.log('error', error);
          vm.loading = false;
          vm.noResult = true;
          vm.list = [];
        });
      },
      handleSizeChange(val) {},
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getMemberList();
      },
      getMember(id) {
        const vm = this;
        vm.loading = true;
        let url = '/agency/user/detail';
        vm.$http.get(url, {
          params: {
            id: id
          }
        }).then(response => {
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.reLogin(this);
            } else if (status == 200) {
              vm.memberUser = response.body.data.user;
              // vm.cash_credit = vm.memberUser.cash_credit;
              let data = response.body.data.refund;
              vm.memberRefund = data.sort(
                function compareFunction(param1, param2) {
                  let id1 = param1.parent;
                  let id2 = param2.parent;
                  return id1.localeCompare(id2);
                }
              )
              vm.getLimits();
            } else {
              vm.$store.state.message(this.$t("message.server_cuo_wu"), 'error', 1500, vm);
            }
          }
        }, response => {
          vm.loading = false;
        });
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
        vm.$http
          .get('/lottery/limites', {})
          .then(
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
                  vm.tableList = this.combineCell(data);
                  for (let i in vm.tableList) {
                    let tableItem = vm.tableList[i];
                    let row = {
                      gameid: tableItem.parentid.parentid._id,
                      lotteryid: tableItem._id,
                      min_bet: vm.memberRefund[i].min_bet,
                      max_bet: vm.memberRefund[i].max_bet,
                      prize: vm.memberRefund[i].prize,
                      stock: vm.memberRefund[i].stock,
                      discount: vm.memberRefund[i].discount,
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
                      discount_error: false
                    }
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
      handleOpen(id) {
        this.getMember(id);
      },
      handleClose() {
        this.dialogVisible = false;
      },
      resetForm() {
        // this.cash_credit = '';
        this.user_refund = [];
        this.memberUser = {};
        this.tableList = [];
        this.memberRefund = [];
      },
      cashBlur() {
        // if (this.cash_credit === this.memberUser.cash_credit) {
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
        // if (!this.cash_credit < 0) {
        //   this.$message({
        //     message: this.$t("message.xin_yong_e") + this.$t("message.chao_chu_fan_wei"),
        //     center: true,
        //     type: "error",
        //     duration: 1000
        //   });
        //   return;
        // }
        const vm = this;
        vm.dialogLoading = true;
        let url = '/agency/user/detail/update';
        vm.$http.post(url, {
          id: vm.memberUser._id,
          // cash_credit: vm.cash_credit
        }).then(response => {
          vm.dialogLoading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.reLogin(this);
            } else if (status == 200) {
              vm.$store.state.message(this.$t("message.commit_success"), 'success', 1500, vm);
            } else {
              vm.$store.state.message(this.$t("message.update_failed") + ":" + status, 'error', 1500, vm);
            }
          }
        }, response => {
          // console.log('error', error);
          vm.dialogLoading = false;
        });
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
          if (refundItem.min_bet > refundItem.min_bet_ || refundItem.min_bet < 0) {
            vm.$store.state.message(this.$t("message.min_tou_zhu_e") + this.$t("message.chao_chu_fan_wei"), 'error', 1500, vm);
            return;
          }
          if (!refundItem.max_bet && Number(refundItem.max_bet) != 0) {
            vm.$store.state.message(this.$t("message.max_tou_zhu_e") + this.$t("message.bu_neng_wei_kong"), 'error', 1500, vm);
            return;
          }
          if (refundItem.max_bet > refundItem.max_bet_ || refundItem.max_bet < 0) {
            vm.$store.state.message(this.$t("message.max_tou_zhu_e") + this.$t("message.chao_chu_fan_wei"), 'error', 1500, vm);
            return;
          }
          if (refundItem.min_bet > refundItem.max_bet) {
            vm.$store.state.message(this.$t("message.max_tou_zhu_e") + this.$t("message.bu_de_da_yu") + this.$t("message.min_tou_zhu_e"), 'error', 1500, vm);
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
          if (refundItem.discount > refundItem.discount_ || refundItem.discount < 0) {
            vm.$store.state.message(this.$t("message.discount") + this.$t("message.chao_chu_fan_wei"), 'error', 1500, vm);
            return;
          }
          if (!(
              Number((refundItem.prize * 100) / refundItem.motherprize_) +
              Number(refundItem.discount) <
              100
            )) {
            vm.$store.state.message(this.$t("message.pei_lv") + "、" + this.$t("message.discount") + this.$t("message.chao_chu_fan_wei"), 'error', 1500, vm);
            return;
          }
        }
        vm.dialogLoading = true;
        let url = '/agency/user/refund/update';
        vm.$http.post(url, {
          min_bet: vm.user_refund[index].min_bet,
          max_bet: vm.user_refund[index].max_bet,
          prize: vm.user_refund[index].prize,
          userid: vm.memberUser._id,
          refundid: vm.memberRefund[index].refundid || '',
          gameid: vm.user_refund[index].gameid,
          lotteryid: vm.user_refund[index].lotteryid,
          stock: vm.user_refund[index].stock,
          discount: vm.user_refund[index].discount
        }).then(response => {
          vm.dialogLoading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.reLogin(this);
            } else if (status == 200) {
              vm.$store.state.message(this.$t("message.commit_success"), 'success', 1500, vm);
            } else {
              vm.$store.state.message(this.$t("message.update_failed"), 'error', 1500, vm);
            }
          }
        }, response => {
          // console.log('error', error);
          vm.dialogLoading = false;
        });
      },
      filterType(v) {
        const vm = this;
        if (v || v === 0) {
          switch (Number(v)) {
            case 0:
              return vm.$t('message.user_type_1');
            case 1:
              return vm.$t('message.user_type_2');
            case 2:
              return vm.$t("message.user_type_3");
          }
        }
        return '--';
      },
      filterStatus(v) {
        const vm = this;
        if (v || v === 0) {
          switch (Number(v)) {
            case 0:
              return vm.$t('message.zheng_chang');
            case 1:
              return vm.$t('message.forbidden');
            default:
              return v;
          }
        }
        return '--';
      },
    },
    filters: {
      formatTime(v) {
        if (v) {
          return moment(v).format('DD-MM-YYYY HH:mm:ss')
        }
        return '--'
      },
      // 金额文本格式化
      // 每千位逗号隔开，不包含小数部分
      filterCash(v) {
        if (v || v === 0) {
          let num = parseFloat(v).toFixed(2);
          //如果num是负数，则获取她的符号
          var sign = '';
          if (Number(num) < 0) {
            sign = '-';
          }
          // 绝对值
          var numAbs = Math.abs(num);
          var decimal = String(numAbs).split('.')[1] || ''; //小数部分
          var tempArr = [];
          var revNumArr = String(numAbs).split('.')[0].split("").reverse(); //倒序
          for (let i in revNumArr) {
            tempArr.push(revNumArr[i]);
            if ((i + 1) % 3 === 0 && i != revNumArr.length - 1) {
              tempArr.push(',');
            }
          }
          var zs = tempArr.reverse().join(''); //整数部分
          return decimal ? sign + zs + '.' + decimal : sign + zs;
        }
        return '0';
      }
    }
  };

</script>

<style lang="scss" scoped>
  .member-wrap {
    background: #efefef;
    padding: 60px 0;

    td.hidden {
      display: none !important;
    }

    .list-title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #191919;
      text-align: left;
    }


    table.record-table {
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

    .submit {
      background-image: linear-gradient(-180deg, #EB5228 0%, #C14726 100%);
      width: 100px;
      height: 34px;
      line-height: 34px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #FFFFFF;
      text-align: center;
      cursor: pointer;
    }

    .detail {
      background-image: linear-gradient(-180deg, #7C7C7C 0%, #464646 100%);
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #FFFFFF;
      text-align: center;
      width: 72px;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
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
        background: #FFFFFF;
        border: 1px solid #979797;
        box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.50);
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
