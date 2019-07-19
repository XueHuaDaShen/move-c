<template>
  <div class="rechargeLot-wrap el-custom">
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
              <li style="width:33%" class="banner-item item-bg1">
                <p class="item-row">
                  <span class="icon-tip"></span>
                  <span class="title">Profit</span>
                </p>
                <p class="item-row mt-10">
                  {{formatMoney(data.profit)}}
                </p>
              </li>
              <li style="width:33%" class="banner-item item-bg2">
                <p class="item-row">
                  <span class="icon-tip"></span>
                  <span class="title">Valid Bet</span>
                </p>
                <p class="item-row mt-10">
                  {{formatMoney(data.bid_valid_team)}}
                </p>
              </li>
              <li style="width:33%" class="banner-item item-bg3">
                <p class="item-row">
                  <span class="icon-tip"></span>
                  <span class="title">Reward</span>
                </p>
                <p class="item-row mt-10">
                  {{formatMoney(data.reward_team)}}
                </p>
              </li>
            </ul>
            <div class="body-row">
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Total Deposite
                </span>
                <span class="warning">{{formatMoney(data.rechargechild)}}</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Turnover
                </span>
                <span class="warning">{{formatMoney(data.bid_total_team)}}</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Login Num
                </span>
                <span class="warning">{{data.login?data.login:0}}</span>
              </div>
            </div>
            <div class="body-row">
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Total Withdrawal
                </span>
                <span class="warning">{{formatMoney(data.withdrawalchild)}}</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Dividend-Platform share
                </span>
                <span class="warning">{{formatMoney(data.dividend)}}</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Register Num
                </span>
                <span class="warning">{{data.register?data.register:0}}</span>
              </div>
            </div>
            <div class="body-row">
              <!-- <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Total Credit
                </span>
                <span class="warning">{{formatMoney(data.creditchild)}}</span>
              </div> -->
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Sbuordinate Balance
                </span>
                <el-button class="small edit" @click="getCash()" :loading="cashLoading" v-if="!cashVisible">Show</el-button>
                <span class="warning" v-if="cashVisible">{{formatMoney(cashFinal)}}</span>
              </div>
              <div class="row-item">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                  Pay Reward
                </span>
                <span class="warning">{{formatMoney(data.payreward)}}</span>
              </div>
              <div class="row-item" style="visibility:hidden;">
                <span class="inline-flx">
                  <i class="icon-tip-small"></i>
                </span>
                <span class="warning"></span>
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
  </div>
</template>
<script>
  import request from "@/axios/axios.js";
  import tableBtn from "../littleStyle/tableBtn.vue";
  import moment from "moment";
  import {
    trim
  } from '@/lib/utils/validator';
  export default {
    name: "kinga",
    components: {
      tableBtn
      // DialogUserInfo
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
        data: {}
      };
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'kingaReport');
      this.routerArr = data.routerArr;
      this.titleName = data.titleName;
      const end = new Date();
      const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime());
      end.setTime(new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1));
      this.searchTime = [start, end];
      // console.log("searchTime", this.searchTime);
      this.getkingaList();
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
      succee() {
        const vm = this;
        this.$message({
          message: "Load Success",
          type: "success",
          duration: vm.duration,
          center: true
        });
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
      error() {
        const vm = this;
        this.$message({
          message: "Load Failure",
          type: "error",
          duration: vm.duration,
          center: true
        });
      },
      getkingaList() {
        const vm = this;
        let beginTime = "",
          endTime = "";
        if (vm.searchTime && vm.searchTime.toString() !== "") {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
        request.http(
          "get",
          "/statistic/team/list", {
            loginname: 'KINGA',
            who: '2',
            startTime: beginTime,
            endTime: endTime,
            sum: '1'
          },
          success => {
            // console.log("kingaList--------", success);
            let code = success.returncode;
            if (code === 200) {
              /* vm.kingaListData = success.data;
                vm.pageNum = Number(success.PageNum) || 1;
                vm.total = success.count; */
              if (success.data.length > 0) {
                vm.data = success.data[0];
                vm.succee();
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
            vm.error();
            console.log(error);
          }
        );
      },
      getCash() {
        const vm = this;
        vm.cashLoading = true;
        request.http(
          "get",
          "/user/aggmoney", {
            loginname: 'KINGA'
          },
          success => {
            vm.cashLoading = false;
            let code = success.returncode;
            if (code === 200) {
              if (success.data.length > 0) {
                vm.cashVisible = true;
                vm.cashFinal = success.data[0].count;
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
            vm.error();
            console.log(error);
          }
        );
      },
      handleReset() {
        this.searchTime = "";
      },
      handleSearch() {
        this.pageNum = 1;
        this.getkingaList();
      }
    }
  };

</script>
<style>
  /* @import "../../publicCss/header.css"; */

  .rechargeLot-wrap .el-form-item__content {
    text-align: left;
  }

</style>

<style lang="scss" scoped>
  .mt-10 {
    margin-top: 10px;
  }
  .rechargeLot-wrap{
    .body-row{
      .row-item{
        width:33.3333% !important;
      }
    }
  }

</style>
