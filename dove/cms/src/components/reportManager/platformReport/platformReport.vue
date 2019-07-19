<template>
  <div class="platformReport el-custom">
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <div class="search-content">
          <div class="search-inner-wrap">
            <label>Period：</label>
            <el-date-picker format="dd-MM-yyyy HH:mm:ss" v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="-"
              start-placeholder="begin" end-placeholder="end" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
            </el-date-picker>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">Search</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">Reset</el-button>
          </div>
        </div>
        <div class="wrap-container">
          <div class="container-body">
            <ul class="container-banner">
              <li class="banner-item item-bg1">
                <p class="item-row">
                  <span class="icon-tip"></span>
                  <span class="title">Game Win/Loss</span>
                </p>
                <p class="item-row mt-10">
                  {{formatMoney(data.bet_profit)}}
                </p>
              </li>
              <li class="banner-item item-bg2">
                <p class="item-row">
                  <span class="icon-tip"></span>
                  <span class="title">Bet Amount</span>
                </p>
                <p class="item-row mt-10">
                  {{formatMoney(data.bet)}}
                </p>
              </li>
              <li class="banner-item item-bg3">
                <p class="item-row">
                  <span class="icon-tip"></span>
                  <span class="title">Reward</span>
                </p>
                <p class="item-row mt-10">
                  {{formatMoney(data.reward)}}
                </p>
              </li>
              <li class="banner-item item-bg4">
                <p class="item-row">
                  <span class="icon-tip"></span>
                  <span class="title">Gift</span>
                </p>
                <p class="item-row mt-10">
                  {{formatMoney(data.gift)}}
                </p>
              </li>
            </ul>
            <div class="body-row">
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Total Profit
                </span>
                <span class="warning">{{formatMoney(data.bet_profit - data.gift)}}</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Rollback
                </span>
                <span class="warning">{{formatMoney(data.rollback)}}</span>
              </div>
            </div>
            <div class="body-row">
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Deposit
                </span>
                <span class="warning">{{formatMoney(data.deposit)}}</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Register Number
                </span>
                <span class="warning">{{data.num_registered?data.num_registered:0}}</span>
              </div>
            </div>
            <div class="body-row">
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Withdrawal
                </span>
                <span class="warning">{{formatMoney(data.withdrawal)}}</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Login Number
                </span>
                <span class="warning">{{data.num_login?data.num_login:0}}</span>
              </div>
            </div>
            <div class="body-row">
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  First Deposit
                </span>
                <span class="warning">{{formatMoney(data.first_deposit)}}</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Balance
                </span>
                <el-button class="small edit" @click="getCash()" :loading="cashLoading" v-if="!cashVisible">Show</el-button>
                <span class="warning" v-if="cashVisible">{{formatMoney(cashFinal)}}</span>
              </div>
            </div>
            <div class="body-row">
              <!-- <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Sbuordinate Balance
                </span>
                <el-button class="small edit" @click="getCash()" :loading="cashLoading" v-if="!cashVisible">Show</el-button>
                <span class="warning" v-if="cashVisible">{{formatMoney(cashFinal)}}</span>
              </div> -->
              <!-- <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Commission
                </span>
                <span class="warning">{{formatMoney(data.refund)}}</span>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="echarts-wrap">
      <div class="nav-title">
        <span :class="item.checked?'current':''" v-for="(item, index) in echartView" :key="index" @click="handleChangeEchart(index)">{{item.name}}</span>
      </div>
      <div class="echart-view" v-if="showEchart">
        <overview v-if="echartValue === 'overview'" :echartData="data" title="Overview"></overview>
        <game v-if="echartValue === 'game'" :searchTime="searchTime" title="Daily Game Win/Loss"></game>
        <deposit v-if="echartValue === 'deposit'" :searchTime="searchTime" title="Daily Deposit/Withdrawal"></deposit>
        <users v-if="echartValue === 'users'" :searchTime="searchTime" title="Daily Acitve Users"></users>
      </div>
    </div>
  </div>
</template>
<script>
import overview from "./echartView/overview";
import game from "./echartView/game";
import deposit from "./echartView/deposit";
import users from "./echartView/users";
import request from "@/axios/axios.js";
import moment from "moment";
import {
  trim
} from '@/lib/utils/validator';
export default {
  name: "platformReport",
  components: {
    overview,
    game,
    deposit,
    users
  },
  data() {
    return {
      cashVisible: false,
      cashFinal: "",
      cashLoading: false,
      pickerDefaultTime: ['00:00:00', '23:59:59'],
      index1: 0,
      index2: 0,
      titleName: "",
      routerArr: [],
      pageNum: 1,
      pageSize: 40,
      total: 0,
      kingaListData: [],
      loginname: "",
      searchTime: "",
      pickerOptions: {
        shortcuts: [{
            text: "Yesterday",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(new Date(new Date(new Date().toLocaleDateString('en-US')).getTime()) - 3600 * 1000 * 24 * 1);
              end.setTime(new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1) -
                3600 * 1000 * 24 * 1);
              // console.log("start", start.toLocaleString());
              // console.log("end", end.toLocaleString());
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "Today",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime());
              end.setTime(new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1));
              // console.log("start", start.toLocaleString());
              // console.log("end", end.toLocaleString());
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "This Week",
            onClick(picker) {
              let now = new Date();
              let nowDayOfWeek = now.getDay(); //今天本周的第几天
              let nowDay = now.getDate(); //当前日
              let nowMonth = now.getMonth(); //当前月
              let nowYear = now.getFullYear(); //当前年
              let getWeekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
              let getWeekEndDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)).toLocaleDateString('en-US'))
                .getTime() + 24 * 60 * 60 * 1000 - 1);
              // console.log("start", getWeekStartDate.toLocaleString());
              // console.log("end", getWeekEndDate.toLocaleString());
              picker.$emit("pick", [getWeekStartDate, getWeekEndDate]);
            }
          }, {
            text: "Last Week",
            onClick(picker) {
              let now = new Date();
              let nowDayOfWeek = now.getDay(); //今天本周的第几天
              let nowDay = now.getDate(); //当前日
              let nowMonth = now.getMonth(); //当前月
              let nowYear = now.getFullYear(); //当前年
              let getWeekStartDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek).toLocaleDateString('en-US'))
                .getTime() -
                3600 * 1000 * 24 * 7);
              let getWeekEndDate = new Date(new Date(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)).toLocaleDateString('en-US'))
                .getTime() + 24 * 60 * 60 * 1000 - 1 - 3600 * 1000 * 24 * 7);
              // console.log("start", getWeekStartDate.toLocaleString());
              // console.log("end", getWeekEndDate.toLocaleString());
              picker
                .$emit("pick", [getWeekStartDate, getWeekEndDate]);
            }
          },
          {
            text: "This Month",
            onClick(picker) {
              let now = new Date();
              let nowMonth = now.getMonth(); //当前月
              let nowYear = now.getFullYear(); //当前年
              //获得本月的开始日期
              let getMonthStartDate = new Date(nowYear, nowMonth, 1);
              var monthStartDate = new Date(nowYear, nowMonth, 1);
              var monthEndDate = new Date(nowYear, nowMonth + 1, 1);
              var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
              //获得本月的结束日期
              let getMonthEndDate = new Date(new Date(new Date(nowYear, nowMonth, days).toLocaleDateString('en-US')).getTime() +
                24 * 60 * 60 * 1000 - 1);
              // console.log("start", getMonthStartDate.toLocaleString());
              // console.log("end", getMonthEndDate.toLocaleString());
              picker.$emit("pick", [getMonthStartDate, getMonthEndDate]);
            }
          },
          {
            text: "Last Month",
            onClick(picker) {
              var firstdate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
              var date = new Date();
              var day = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
              var enddate = new Date(new Date(new Date(new Date().getFullYear(), new Date().getMonth() - 1, day).toLocaleDateString('en-US'))
                .getTime() + 24 * 60 * 60 * 1000 - 1);
              // console.log("start", firstdate.toLocaleString());
              // console.log("end", enddate.toLocaleString());
              picker.$emit("pick", [firstdate, enddate]);
            }
          },
          {
            text: "Recent 1 Week",
            onClick(picker) {
              const end = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1);
              const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() - 3600 * 1000 * 24 * 7);
              // console.log("start", start.toLocaleString());
              // console.log("end", end.toLocaleString());
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Recent 1 Month",
            onClick(picker) {
              const end = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1);
              const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() - 3600 * 1000 * 24 * 30);
              // console.log("start", start.toLocaleString());
              // console.log("end", end.toLocaleString());
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Recent 3 Months",
            onClick(picker) {
              const end = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1);
              const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() - 3600 * 1000 * 24 * 90);
              // console.log("start", start.toLocaleString());
              // console.log("end", end.toLocaleString());
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      duration: 1000,
      echartView: [
        {name: 'Overview', value: 'overview', checked: false},
        {name: 'Daily Game Win/Loss', value: 'game', checked: false},
        {name: 'Daily Deposit/Withdrawal', value: 'deposit', checked: false},
        {name: 'Daily Acitve Users', value: 'users', checked: false}
      ],
      echartValue: '',
      echartData: null,
      showEchart: false,
      data: {}
    };
  },
  created() {
    this.routerArr = [];
    let query = this.$route.query;
    this.index1 = Number(query.index1);
    this.index2 = Number(query.index2);
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'platformReport');
    this.routerArr = data.routerArr;
    this.titleName = data.titleName;
    
    const end = new Date();
    const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime());
    end.setTime(new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1));
    this.searchTime = [start, end];
    // console.log("searchTime", this.searchTime);
    this.getReportList();
    this.handleChangeEchart(0);
  },
  methods: {
    formatMoney(value) {
      if (value) {
        return this.$store.state.toThousands(Number(value).toFixed(2));
      }
      return 0;
    },
    handleChangeRouter(name) {
      this.$router.push({
        name: name,
        query: {
          index1: this.index1,
          index2: this.index2
        }
      });
    },
    handleChangeEchart(index) {
      if(this.echartValue === this.echartView[index].value) return
      this.echartView.forEach(v => {v.checked = false;})
      this.echartView[index].checked = true;
      this.echartValue = this.echartView[index].value;
    },
    message(value, type) {
      const vm = this;
      this.$message({
        message: value,
        type: type,
        duration: vm.duration,
        center: true
      });
    },
    getReportList() {
      this.showEchart = false;
      const vm = this;
      let beginTime = "",
        endTime = "";
      if (vm.searchTime) {
        if (vm.searchTime.toString() !== "") {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
      }
      request.http(
        "get",
        "/report/platform/list",
        {
          // loginname: 'KINGA',
          // sort: '2',
          start_at: beginTime,
          end_at: endTime,
          // type: '1'
        },
        success => {
          // console.log("kingaList--------", success);
          vm.showEchart = true;
          let code = success.returncode;
          if (code === 200) {
            /* vm.kingaListData = success.data;
              vm.pageNum = Number(success.pageNum) || 1;
              vm.total = success.count; */
            if (success.data && success.data.length > 0) {
              vm.data = success.data[0];
              vm.message("success", "success");
            } else {
              vm.data = [];
              vm.message("No Data", "warning");
            }
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          }
        },
        error => {
          vm.data = [];
          vm.message("error", "error");
          vm.showEchart = true;
          console.log(error);
        }
      );
    },
    getCash() {
      const vm = this;
      let beginTime = "",
        endTime = "";
      if (vm.searchTime) {
        if (vm.searchTime.toString() !== "") {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
      }
      vm.cashLoading = true;
      request.http(
        "get",
        "/report/user/cash", {
          // start_at: beginTime,
          // end_at: endTime
        },
        success => {
          vm.cashLoading = false;
          let code = success.returncode;
          if (code === 200) {
            if (success.data.length > 0) {
              vm.cashVisible = true;
              vm.cashFinal = success.data[0].amount;
            } else {
              vm.cashVisible = false;
              vm.cashFinal = "";
              vm.message("Fail", "warning");
            }
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          }
        },
        error => {
          vm.cashLoading = false;
          vm.cashVisible = false;
          vm.cashFinal = "";
          vm.message("error", "error");
          console.log(error);
        }
      );
    },
    handleReset() {
      const end = new Date();
      const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime());
      end.setTime(new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1));
      this.searchTime = [start, end];
    },
    handleSearch() {
      this.pageNum = 1;
      this.getReportList();
    }
  }
};

</script>
<style>
  /* @import "../../publicCss/header.css"; */

  .platformReport .el-form-item__content {
    text-align: left;
  }

</style>

<style lang="scss" scoped>
  .mt-10 {
    margin-top: 10px;
  }
  .platformReport{
    .body-row{
      .row-item{
        width:50% !important;
      }
    }
  }

</style>


