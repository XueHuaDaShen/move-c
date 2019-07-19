<template>
  <div class="common team-profit-wrap">
    <div class="container">
      <div class="card" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="card-title">{{$t('message.team_profit')}}</div>
        <div class="card-body padding-20">
          <div class="search-form mt-60">
            <!-- <label class="search-desc">{{$t('message.username')}}：</label>
            <input class="c-input" v-model.trim="loginname" type="text" />-->
            <label class="search-desc ml-20">{{$t('message.bet_time')}}：</label>
            <el-date-picker v-model="beginTime" type="datetime" format="dd-MM-yyyy HH:mm:ss" :placeholder="$t('message.qing_xuan_ze') + $t('message.begin_time')"></el-date-picker>
            <span>-</span>
            <el-date-picker v-model="endTime" type="datetime" format="dd-MM-yyyy HH:mm:ss" :placeholder="$t('message.qing_xuan_ze') + $t('message.end_time')"></el-date-picker>
            <button class="submit ml-20 search-btn" @click="handleSearch">{{$t('message.search')}}</button>
          </div>
          <div class="table-container">
            <ul class="mt-60 mb-20 breadcrumb-list clearfix">
              <li @click="breadcrumbChange(item)" class="breadcrumb-link" v-for="(item,index) in breadcrumb" :key="index">
                <span :class="{'active':indexFrom === index}">{{item}}</span>
                <i class="el-icon-arrow-right" v-if="index!=breadcrumb.length-1"></i>
              </li>
            </ul>
            <table class="record-table">
              <thead>
                <tr>
                  <th>
                    <div class="cell">{{$t('message.username')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.firstname')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.shang_ji_dai_li')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.user_type')}}</div>
                  </th>
                  <!-- <th>
                    <div class="cell">{{$t('message.time')}}</div>
                  </th>-->
                  <th>
                    <div class="cell">{{$t('message.zong_tou_zhu')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.you_xiao_tou_zhu')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.fan_jiang')}}</div>
                  </th>
                  <th>
                    <div class="cell" v-show="getUserType === '1'">{{$t('message.tou_zhu_fen_cheng')}}</div>
                  </th>
                  <th>
                    <div class="cell" v-show="getUserType === '1'">{{$t('message.team_tou_zhu_fen_cheng')}}</div>
                  </th>
                  <th>
                    <div class="cell" v-show="getUserType === '1'">{{$t('message.zhong_jiang_pei_fu')}}</div>
                  </th>
                  <!-- <th>
                    <div class="cell" v-show="getUserType === '2'">{{$t('message.tou_zhu_fan_dian')}}</div>
                  </th>-->
                  <th>
                    <div class="cell" v-show="getUserType === '1'">{{$t('message.team_zhong_jiang_pei_fu')}}</div>
                  </th>
                  <!-- <th>
                    <div class="cell" v-show="getUserType === '2'">{{$t('message.tou_zhu_fan_dian')}}</div>
                  </th>-->
                  <th>
                    <div class="cell">{{$t('message.ying_kui')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.team_ying_kui')}}</div>
                  </th>
                </tr>
              </thead>
              <tbody v-if="!noResult">
                <tr v-for="(item,index) in list" :key="index">
                  <td>
                    <a v-if="item.type === '1'" class="cell link" @click="research(item.loginname)">{{item.loginname}}</a>
                    <div class="cell" v-else>{{item.loginname}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.firstname}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.parent ? item.parent.loginame : '--'}}</div>
                  </td>
                  <td>
                    <div class="cell">{{filterType(item.type) }}</div>
                  </td>
                  <!-- <td>
                    <div class="cell">{{(item.create_at ? item.create_at :'' ) | formatTime}}</div>
                  </td>-->
                  <td>
                    <div class="cell">{{item.bid_total_team | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.bid_valid_team | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.reward_team | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell" v-show="getUserType === '1'">{{item.dividend | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell" v-show="getUserType === '1'">{{item.commission_team | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell" v-show="getUserType === '1'">{{item.payreward | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell" v-show="getUserType === '1'">{{item.payreward_team | formatCash}}</div>
                  </td>
                  <!-- <td>
                    <div class="cell" v-show="getUserType === '2'">{{item.refund_team | formatCash}}</div>
                  </td>-->
                  <!-- <td>
                    <div class="cell" v-show="getUserType === '2'">{{item.refund | formatCash}}</div>
                  </td>-->
                  <td>
                    <div class="cell">{{item.profit | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.profit_team | formatCash}}</div>
                  </td>
                </tr>
              </tbody>
              <tbody v-if="noResult">
                <tr class="no-result">
                  <td colspan="13">
                    <p>{{$t('message.no_result')}}</p>
                  </td>
                </tr>
              </tbody>
              <tfoot v-if="!noResult">
                <tr aria-colspan="12">
                  <td>
                    <div class="cell">{{$t('message.zong_ji')}}</div>
                  </td>
                  <td>
                    <div class="cell"></div>
                  </td>
                  <td>
                    <div class="cell"></div>
                  </td>
                  <td>
                    <div class="cell"></div>
                  </td>
                  <td>
                    <div class="cell">{{bid_total}}</div>
                  </td>
                  <td>
                    <div class="cell">{{bid_valid}}</div>
                  </td>
                  <td>
                    <div class="cell">{{reward}}</div>
                  </td>
                  <td>
                    <div class="cell" v-show="getUserType === '1'">{{commission}}</div>
                  </td>
                  <td>
                    <div class="cell" v-show="getUserType === '1'">{{teamCommission}}</div>
                  </td>
                  <td>
                    <div class="cell" v-show="getUserType === '1'">{{payreward}}</div>
                  </td>
                  <td>
                    <div class="cell" v-show="getUserType === '1'">{{teamPayReward}}</div>
                  </td>
                  <td>
                    <div class="cell">{{profit}}</div>
                  </td>
                  <td>
                    <div class="cell">{{teamProfit}}</div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <!-- <div class="record-pagination clearfix">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex"
              :page-size="pageSize" layout="total, prev, pager, next" :total="total">
            </el-pagination>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from "moment";

  export default {
    name: "teamProfit",
    components: {},
    props: {},
    data() {
      return {
        beginTime: "",
        endTime: "",
        list: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 15, //单页条数
        loading: false,
        loginname: "",
        breadcrumb: [], // 面包屑
        indexFrom: 0, // 面包屑当前位置
        bid_total: 0,
        bid_valid: 0,
        reward: 0,
        commission: 0,
        teamCommission: 0,
        payreward: 0,
        teamPayReward: 0,
        profit: 0,
        teamProfit: 0
      };
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {
      getUserName() {
        return localStorage.getItem("candy-type");
      },
      getUserType() {
        return localStorage.getItem("candy-type").toString();
      }
    },
    created() {},
    mounted() {
      const vm = this;
      let loginname = vm.loginname ?
        vm.loginname :
        localStorage.getItem("candy-loginname").toString();
      this.breadcrumb.push(loginname);
      this.indexFrom = 0;
      this.setTimeToday();
      this.handleSearch();
    },
    methods: {
      research(name) {
        this.loginname = name;
        this.breadcrumb.push(this.loginname);
        this.handleSearch();
        this.indexFrom = this.breadcrumb.indexOf(this.loginname);
      },
      breadcrumbChange(name) {
        // 面包屑跳转位置
        var indexTo = this.breadcrumb.indexOf(name);
        if (indexTo < this.indexFrom) {
          this.loginname = this.breadcrumb[indexTo];
          this.breadcrumb.splice(indexTo + 1, this.breadcrumb.length - 1);
          this.handleSearch();
        }
        if (indexTo === this.indexFrom) {
          return;
        }
      },
      handleSearch() {
        this.pageIndex = 1;
        this.onSubmit();
      },
      onSubmit() {
        const vm = this;
        vm.loading = true;
        let loginname = vm.loginname ?
          vm.loginname :
          localStorage.getItem("candy-loginname").toString();
        let url =
          "/report/inferior/profit" +
          "?beginTime=" +
          new Date(vm.beginTime).toISOString() +
          "&endTime=" +
          new Date(vm.endTime).toISOString() +
          "&loginname=" +
          loginname;
        vm.$http.get(url, {}).then(
          response => {
            vm.loading = false;
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.reLogin(this);
              } else if (status == 200) {
                vm.total = response.body.num;
                if (vm.total) {
                  vm.noResult = false;
                  // vm.totalPageNum = response.body.totalPage;
                  vm.list = response.body.data;
                  if (vm.list.length > 0) {
                    let bid_total = 0,
                      bid_valid = 0,
                      reward = 0,
                      commission = 0,
                      teamCommission = 0,
                      payreward = 0,
                      teamPayReward = 0,
                      profit = 0,
                      teamProfit = 0;
                    for (let i = 0; i < this.list.length; i++) {
                      let item = this.list[i];
                      if (item.bid_total_team) {
                        bid_total += item.bid_total_team;
                      }
                      if (item.bid_valid_team) {
                        bid_valid += item.bid_valid_team;
                      }
                      if (item.reward_team) {
                        reward += item.reward_team;
                      }
                      if (item.dividend) {
                        commission += item.dividend;
                      }
                      if (item.commission_team) {
                        teamCommission += item.commission_team;
                      }
                      if (item.payreward) {
                        payreward += item.payreward;
                      }
                      if (item.payreward_team) {
                        teamPayReward += item.payreward_team;
                      }
                      if (item.profit) {
                        profit += item.profit_team;
                      }
                      if (item.profit_team) {
                        teamProfit += item.profit_team;
                      }
                    }
                    this.bid_total = parseFloat(bid_total).toFixed(2);
                    this.bid_valid = parseFloat(bid_valid).toFixed(2);
                    this.reward = parseFloat(reward).toFixed(2);
                    this.commission = parseFloat(commission).toFixed(2);
                    this.teamCommission = parseFloat(teamCommission).toFixed(2);
                    this.payreward = parseFloat(payreward).toFixed(2);
                    this.teamPayReward = parseFloat(teamPayReward).toFixed(2);
                    this.profit = parseFloat(profit).toFixed(2);
                    this.teamProfit = parseFloat(teamProfit).toFixed(2);
                  }
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
      setTimeToday() {
        const end = new Date();
        const start = new Date(moment(new Date()).format("YYYY/MM/DD")).getTime();
        end.setTime(
          new Date(moment(new Date()).format("YYYY/MM/DD")).getTime() +
          24 * 60 * 60 * 1000 -
          1
        );
        this.beginTime = start;
        this.endTime = end;
      },
      handleSizeChange(val) {},
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.onSubmit();
      },
      formatStatus(v) {
        //状态 0:待开奖  1:已开奖 2：已撤销
        if (v) {
          switch (Number(v)) {
            case 0:
              return this.$t("message.dai_kai_jiang");
            case 1:
              return this.$t("message.yi_kai_jiang");
            case 2:
              return this.$t("message.yi_che_xiao");
            default:
              return v;
          }
        }
        return "--";
      },
      filterType(v) {
        const vm = this;
        if (v || v === 0) {
          switch (Number(v)) {
            case 0:
              return this.$t("message.user_type_1");
            case 1:
              return this.$t("message.user_type_2");
            case 2:
              return vm.$t("message.user_type_3");
          }
        }
        return "--";
      }
    },
    filters: {
      formatTime(v) {
        if (v) {
          return moment(v).format("DD-MM-YYYY HH:mm:ss");
        }
        return "--";
      },
      formatCash(v) {
        if (v || v === 0) {
          let num = parseFloat(v).toFixed(2);
          //如果num是负数，则获取她的符号
          var sign = "";
          if (Number(num) < 0) {
            sign = "-";
          }
          // 绝对值
          var numAbs = Math.abs(num);
          var decimal = String(numAbs).split(".")[1] || ""; //小数部分
          var tempArr = [];
          var revNumArr = String(numAbs)
            .split(".")[0]
            .split("")
            .reverse(); //倒序
          for (let i in revNumArr) {
            tempArr.push(revNumArr[i]);
            if ((i + 1) % 3 === 0 && i != revNumArr.length - 1) {
              tempArr.push(",");
            }
          }
          var zs = tempArr.reverse().join(""); //整数部分
          return decimal ? sign + zs + "." + decimal : sign + zs;
        }
        return "0";
      }
    }
  };

</script>

<style lang="scss" scoped>
  .team-profit-wrap {
    background: #efefef;
    padding: 60px 0;

    ul.breadcrumb-list {
      li {
        float: left;
        list-style: none;
      }

      .breadcrumb-link {
        >span {
          cursor: pointer;
          text-decoration: underline;
          color: #303133;
          transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          font-weight: bold;

          &.active {
            cursor: auto;
            text-decoration: none;
            color: #606266;
            font-weight: normal;

            &:hover {
              color: #606266;
            }
          }

          &:hover {
            color: #eb5228;
          }
        }
      }
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

          .link {
            cursor: pointer;
            text-decoration: underline;
            color: #eb5228;
          }
        }

        &:last-child {
          >td {
            padding-bottom: 30px;
          }
        }
      }
    }

    .submit {
      background-image: linear-gradient(-180deg, #eb5228 0%, #c14726 100%);
      width: 100px;
      height: 34px;
      line-height: 34px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      cursor: pointer;
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
  }

  .padding-20 {
    padding: 0 20px;
  }

</style>
