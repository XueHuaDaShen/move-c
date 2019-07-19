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
            <label>User Name：</label>
            <el-input clearable v-model="searchData.username" placeholder="User Name" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>Period：</label>
            <el-date-picker format="dd-MM-yyyy HH:mm:ss" v-model="searchData.time" type="datetimerange" align="right" unlink-panels range-separator="-"
              start-placeholder="begin" end-placeholder="end" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
            </el-date-picker>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">Search</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">Reset</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="echarts-wrap" v-if="isGetData">
      <div class="nav-title">
        <span :class="item.checked?'current':''" v-for="(item, index) in echartView" :key="index" @click="handleChangeEchart(index)">{{item.name}}</span>
      </div>
      <div class="echart-view" v-if="showEchart">
        <overview v-if="echartValue === 'overview'" :searchData="searchData" title="Overview"></overview>
        <game v-if="echartValue === 'game'" :searchData="searchData" title="Provider Win/Loss" title2="Game Win/Loss"></game>
        <dailyGame v-if="echartValue === 'dailyGame'" :searchData="searchData" title="Daily Game Win/Loss"></dailyGame>
        <deposit v-if="echartValue === 'deposit'" :searchData="searchData" title="Daily Deposit/Withdrawal/Gift"></deposit>
        <active v-if="echartValue === 'active'" :searchData="searchData" title="Daily Active"></active>
      </div>
    </div>
  </div>
</template>
<script>
import overview from "./echartView/overview";
import game from "./echartView/game";
import dailyGame from "./echartView/dailyGame";
import deposit from "./echartView/deposit";
import active from "./echartView/active";
import request from "@/axios/axios.js";
export default {
  name: "userAnalyze",
  components: {
    overview,
    game,
    dailyGame,
    deposit,
    active
  },
  data() {
    return {
      index1: 0,
      index2: 0,
      titleName: "",
      routerArr: [],
      total: 0,
      gameList: [],
      pickerDefaultTime: ["00:00:00", "23:59:59"],
      pickerOptions: {
        shortcuts: [{
            text: "Yesterday",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(
                new Date(new Date(new Date().toLocaleDateString('en-US')).getTime()) -
                3600 * 1000 * 24 * 1
              );
              end.setTime(
                new Date(
                  new Date(new Date().toLocaleDateString('en-US')).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
                ) -
                3600 * 1000 * 24 * 1
              );
              // console.log("start", start.toLocaleString());
              // console.log("end", end.toLocaleString());
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Today",
            onClick(picker) {
              const end = new Date();
              const start = new Date(
                new Date(new Date().toLocaleDateString('en-US')).getTime()
              );
              end.setTime(
                new Date(
                  new Date(new Date().toLocaleDateString('en-US')).getTime() +
                  24 * 60 * 60 * 1000 -
                  1
                )
              );
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
              let getWeekStartDate = new Date(
                nowYear,
                nowMonth,
                nowDay - nowDayOfWeek
              );
              let getWeekEndDate = new Date(
                new Date(
                  new Date(
                    nowYear,
                    nowMonth,
                    nowDay + (6 - nowDayOfWeek)
                  ).toLocaleDateString('en-US')
                ).getTime() +
                24 * 60 * 60 * 1000 -
                1
              );
              // console.log("start", getWeekStartDate.toLocaleString());
              // console.log("end", getWeekEndDate.toLocaleString());
              picker.$emit("pick", [getWeekStartDate, getWeekEndDate]);
            }
          },
          {
            text: "Last Week",
            onClick(picker) {
              let now = new Date();
              let nowDayOfWeek = now.getDay(); //今天本周的第几天
              let nowDay = now.getDate(); //当前日
              let nowMonth = now.getMonth(); //当前月
              let nowYear = now.getFullYear(); //当前年
              let getWeekStartDate = new Date(
                new Date(
                  new Date(
                    nowYear,
                    nowMonth,
                    nowDay - nowDayOfWeek
                  ).toLocaleDateString('en-US')
                ).getTime() -
                3600 * 1000 * 24 * 7
              );
              let getWeekEndDate = new Date(
                new Date(
                  new Date(
                    nowYear,
                    nowMonth,
                    nowDay + (6 - nowDayOfWeek)
                  ).toLocaleDateString('en-US')
                ).getTime() +
                24 * 60 * 60 * 1000 -
                1 -
                3600 * 1000 * 24 * 7
              );
              // console.log("start", getWeekStartDate.toLocaleString());
              // console.log("end", getWeekEndDate.toLocaleString());
              picker.$emit("pick", [getWeekStartDate, getWeekEndDate]);
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
              var days =
                (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
              //获得本月的结束日期
              let getMonthEndDate = new Date(
                new Date(
                  new Date(nowYear, nowMonth, days).toLocaleDateString('en-US')
                ).getTime() +
                24 * 60 * 60 * 1000 -
                1
              );
              // console.log("start", getMonthStartDate.toLocaleString());
              // console.log("end", getMonthEndDate.toLocaleString());
              picker.$emit("pick", [getMonthStartDate, getMonthEndDate]);
            }
          },
          {
            text: "Last Month",
            onClick(picker) {
              var firstdate = new Date(
                new Date().getFullYear(),
                new Date().getMonth() - 1,
                1
              );
              var date = new Date();
              var day = new Date(
                date.getFullYear(),
                date.getMonth(),
                0
              ).getDate();
              var enddate = new Date(
                new Date(
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() - 1,
                    day
                  ).toLocaleDateString('en-US')
                ).getTime() +
                24 * 60 * 60 * 1000 -
                1
              );
              // console.log("start", firstdate.toLocaleString());
              // console.log("end", enddate.toLocaleString());
              picker.$emit("pick", [firstdate, enddate]);
            }
          },
          {
            text: "Recent 1 Week",
            onClick(picker) {
              const end = new Date(
                new Date(new Date().toLocaleDateString('en-US')).getTime() +
                24 * 60 * 60 * 1000 -
                1
              );
              const start = new Date(
                new Date(new Date().toLocaleDateString('en-US')).getTime() -
                3600 * 1000 * 24 * 7
              );
              // console.log("start", start.toLocaleString());
              // console.log("end", end.toLocaleString());
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Recent 1 Month",
            onClick(picker) {
              const end = new Date(
                new Date(new Date().toLocaleDateString('en-US')).getTime() +
                24 * 60 * 60 * 1000 -
                1
              );
              const start = new Date(
                new Date(new Date().toLocaleDateString('en-US')).getTime() -
                3600 * 1000 * 24 * 30
              );
              // console.log("start", start.toLocaleString());
              // console.log("end", end.toLocaleString());
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Recent 3 Months",
            onClick(picker) {
              const end = new Date(
                new Date(new Date().toLocaleDateString('en-US')).getTime() +
                24 * 60 * 60 * 1000 -
                1
              );
              const start = new Date(
                new Date(new Date().toLocaleDateString('en-US')).getTime() -
                3600 * 1000 * 24 * 90
              );
              // console.log("start", start.toLocaleString());
              // console.log("end", end.toLocaleString());
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      searchData: {
        username: '',
        time: '',
      },
      duration: 1000,
      echartView: [
        {name: 'Overview', value: 'overview', checked: false},
        {name: 'Game Win/Loss', value: 'game', checked: false},
        {name: 'Daily Game Win/Loss', value: 'dailyGame', checked: false},
        {name: 'Daily Deposit', value: 'deposit', checked: false},
        {name: 'Daily Active', value: 'active', checked: false}
      ],
      echartValue: '',
      echartData: null,
      showEchart: true,
      isGetData: true,
    };
  },
  created() {
    this.routerArr = [];
    let query = this.$route.query;
    this.index1 = Number(query.index1);
    this.index2 = Number(query.index2);
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'userAnalyze');
    this.routerArr = data.routerArr;
    this.titleName = data.titleName;
    
    const end = new Date();
    const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime());
    end.setTime(
      new Date(
        new Date(new Date().toLocaleDateString('en-US')).getTime() +
        24 * 60 * 60 * 1000 -
        1
      )
    );
    this.searchData.time = [start, end];
    this.handleChangeEchart(0);
    this.getLotto();
  },
  methods: {
    handleChangeEchart(index) {
      if(this.echartValue === this.echartView[index].value) return
      this.echartView.forEach(v => {v.checked = false;})
      this.echartView[index].checked = true;
      this.echartValue = this.echartView[index].value;
    },
    handleReset() {
      this.searchData = {
        username: '',
        time: '',
      };
      this.isGetData = false;
      const end = new Date();
      const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime());
      end.setTime(
        new Date(
          new Date(new Date().toLocaleDateString('en-US')).getTime() +
          24 * 60 * 60 * 1000 -
          1
        )
      );
      this.searchData.time = [start, end];
    },
    message(type, text) {
      const vm = this;
      this.$message({
        message: text,
        type: type,
        duration: vm.duration,
        center: true
      });
    },
    // 获取彩种
    getLotto() {
      var vm = this;
      request.http(
        'get',
        '/lottery/game/list',
        {},
        (success) => {
          let code = success.returncode;
          if (code === 200) {
            console.log(success)
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm)
          }
        },
        (error) => {
          console.log(error)
        }
      )
    },
    // 检查用户是否存在
    getziiao() {
      var vm = this;
      request.http(
        'get',
        '/user/profile', {
          loginname: vm.searchData.username
        },
        (success) => {
          let code = success.returncode;
          if (code == 201) {
            vm.message("error", "User does not exist")
          } else if (code === 200) {
            vm.isGetData = true;
            vm.showEchart = false;
            setTimeout(() => {
              vm.showEchart = true;
            }, 100);
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm)
          }
        },
        (error) => {
          console.log(error)
        }
      )
    },
    handleSearch() {
      const vm = this;
      if(!vm.searchData.username){
        vm.message("error", "Please enter a user name")
        return false;
      }
      this.getziiao();
    }
  }
};

</script>
<style lang="scss" scoped>
</style>

