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
            <label>Provider：</label>
            <el-select v-model="searchData.provider" clearable placeholder="Select Provider" class="small" @change="getGameList">
              <el-option v-for="item in gameType" :key="item.code" :label="item.title" :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>GameID：</label>
            <el-select v-model="searchData.gameid" clearable placeholder="Select GameID" class="small">
              <el-option v-for="item in gameList" :key="item.gameid" :label="item.gameid" :value="item.gameid">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Game Name：</label>
            <el-input clearable v-model="searchData.gamename" placeholder="Game Name" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>Sort By：</label>
            <el-select v-model="searchData.sort" clearable class="small">
              <el-option v-for="(item, i) in orderArr" :key="i" :label="item.title" :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Order：</label>
            <el-select v-model="searchData.order" clearable class="small">
              <el-option v-for="item in descArr" :key="item.val" :label="item.title" :value="item.val">
              </el-option>
            </el-select>
          </div>
          <!-- <div class="search-inner-wrap">
            <el-checkbox v-model="dateChecked" :true-label="1" :false-label="0">Added up</el-checkbox>
          </div> -->
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
    <div class="echarts-wrap">
      <div class="nav-title">
        <span :class="item.checked?'current':''" v-for="(item, index) in echartView" :key="index" @click="handleChangeEchart(index)">{{item.name}}</span>
      </div>
      <div class="echart-view" v-if="showEchart">
        <echartTalbe v-if="echartValue === 'table'" :searchData="searchData" title="Table"></echartTalbe>
        <overview v-if="echartValue === 'overview'" :searchData="searchData" title="Game Overview"></overview>
        <game v-if="echartValue === 'game'" :searchData="searchData" title="Provider Win/Loss" title2="Game Win/Loss"></game>
        <top v-if="echartValue === 'top'" :searchData="searchData" title="Top Games"></top>
      </div>
    </div>
  </div>
</template>
<script>
import echartTalbe from "./echartView/table";
import overview from "./echartView/overview";
import game from "./echartView/game";
import top from "./echartView/top";
import request from "@/axios/axios.js";
export default {
  name: "gameReport",
  components: {
    echartTalbe,
    overview,
    game,
    top
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
      gameType: [
        {
          title: "GSS",
          code: "GSS"
        },
        {
          title: "SA",
          code: "SA"
        },
        {
          title: "GPI",
          code: "GPI"
        },
        {
          title: "NT",
          code: "NT"
        },
      ],
      orderArr: [
        {
          title: "Bet",
          code: "bet"
        },
        {
          title: "Reward",
          code: "reward"
        },
        {
          title: "Win/Loss",
          code: "bet_profit"
        },
      ],
      descArr: [
        {
          title: "Ascendant",
          val: "1"
        },
        {
          title: "Descendant",
          val: "-1"
        }
      ],
      searchData: {
        provider: '',
        gameid: '',
        gamename: '',
        sort: 'bet',
        order: '-1',
        time: '',
      },
      duration: 1000,
      echartView: [
        {name: 'Table', value: 'table', checked: false},
        {name: 'Game Overview', value: 'overview', checked: false},
        {name: 'Game Win/Loss', value: 'game', checked: false},
        {name: 'Top Games', value: 'top', checked: false}
      ],
      echartValue: '',
      echartData: null,
      showEchart: false
    };
  },
  created() {
    this.routerArr = [];
    let query = this.$route.query;
    this.index1 = Number(query.index1);
    this.index2 = Number(query.index2);
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'gameReport');
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
    this.handleSearch();
  },
  methods: {
    handleChangeEchart(index) {
      if(this.echartValue === this.echartView[index].value) return
      this.echartView.forEach(v => {v.checked = false;})
      this.echartView[index].checked = true;
      this.echartValue = this.echartView[index].value;
    },
    getGameList() {
      const vm = this;
      if(!vm.searchData.provider) return
      request.http(
        "get",
        "/chart/gameid/list", {
          provider: vm.searchData.provider
        },
        success => {
          let code = success.returncode;
          if (code === 200) {
            vm.gameList = success.data;
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          }
        },
        error => {
          vm.gameList = [];
          console.log(error);
        }
      );
    },
    handleReset() {
      this.searchData = {
        provider: '',
        gameid: '',
        gamename: '',
        sort: 'bet',
        order: '-1',
        time: '',
      };
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
    handleSearch() {
      this.showEchart = false;
      const vm = this;
      setTimeout(() => {
        vm.showEchart = true;
      }, 100);
    }
  }
};

</script>
<style lang="scss" scoped>
</style>

