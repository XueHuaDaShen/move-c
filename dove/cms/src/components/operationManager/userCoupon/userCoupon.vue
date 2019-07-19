<template>
  <div class="el-custom userCoupon">
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
        <!-- <div class="search-content">
          <div class="search-inner-wrap">
            <label>User Name：</label>
            <el-input clearable v-model="searchname" placeholder="username" style="width:114px;"></el-input>
          </div>
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
        </div> -->
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="dataList" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="500" sum-text="Total">
        <el-table-column align="center" label="User Name" prop="loginid.loginname" width="126">
        </el-table-column>
        <el-table-column align="center" label="Activity" prop="activity">
        </el-table-column>
        <el-table-column align="center" label="Settle day" prop="settle_day" :formatter="formatTime">
        </el-table-column>
        <el-table-column align="center" label="Expire day" prop="expire" :formatter="formatTime">
        </el-table-column>
        <el-table-column align="center" label="Status" prop="status" :formatter="formatStatus">
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/axios/axios.js";
import moment from "moment";
export default {
  name: 'userCoupon',
  data() {
    return {
      msg: 'nihao',
      duration: 1500,
      loading: false,
      dataList: [],
      pageSize: 10,
      pageNum: 1,
      total: 1,
      index1: 0,
      index2: 0,
      titleName: "",
      routerArr: [],
      searchname: '',
      searchTime: '',
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
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {
    let query = this.$route.query;
    this.index1 = Number(query.index1);
    this.index2 = Number(query.index2);
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'userCoupon');
    this.routerArr = data.routerArr;
    this.titleName = data.titleName;
    
    this.getDataList();
  },
  beforeMount() {},
  mounted() {},
  watch: {},
  methods: {
    getSummaries(param) {
      const {
        columns,
        data
      } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "Total";
          return;
        }
        let values = data.map(item => Number(item[column.property]));
        if (index === 4) {
          values = data.map(item => Number(item["bet_amount"]));
        }
        if (index === 5) {
          values = data.map(item => Number(item["payout"]));
        }
        if (index === 6) {
          values = data.map(item => Number(item["win_lose"]));
        }
        if ((index === 4 || index === 5 || index === 6) && !values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = parseFloat(sums[index]).toFixed(2);
          sums[index] += "";
        } else {
          if (index === 4 || index === 5 || index === 6) {
            sums[index] = "0.00";
          } else
            sums[index] = "--";
        }
      });
      sums.filter((v, vi) => {
        if(v !== 'Total' && v !== '--'){
          sums[vi] = this.$store.state.toThousands(v);
        }
      })

      return sums;
    },
    // 状态提示
    message(value, type) {
      const vm = this;
      this.$message({
        message: value,
        type: type,
        duration: vm.duration,
        center: true
      });
    },
    formatTime(row, column, cellValue) {
      const vm = this;
      if (cellValue) {
        return moment(cellValue).format("DD-MM-YYYY HH:mm:ss");
      }else{
        return '--';
      }
    },
    formatStatus(row, column, cellValue) {
      if (cellValue || cellValue == 0) {
        switch(cellValue){
          case 0: return 'Unused';
          case 1: return 'Used';
          case 2: return 'Expired';
        }
      }else{
        return "--";
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getDataList();
      // console.log(`当前页: ${val}`);
    },
    // 获取 数据列表
    getDataList() {
      const vm = this;
      // let beginTime = "",
      //   endTime = "";
      // if (vm.searchTime) {
      //   if (vm.searchTime.toString() !== "") {
      //     beginTime = new Date(vm.searchTime[0]);
      //     endTime = new Date(vm.searchTime[1]);
      //   }
      // }
      vm.loading = true;
      request.http(
        "get",
        "/user/coupon/list", {
          pageNum: vm.pageNum,
          pageSize: vm.pageSize,
          // loginname: vm.searchname,
          // start_at: beginTime,
          // end_at: endTime,
        },
        success => {
          vm.loading = false;
          // console.log("teamReportList--------", success);
          let code = success.returncode;
          if (code === 200) {
            vm.dataList = success.data;
            // vm.teamReportListData = success.data;
            vm.pageNum = Number(success.pageNum) || 1;
            vm.total = success.total;
            vm.message('success', 'success');
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          }
        },
        error => {
          vm.loading = false;
          vm.message('error', 'error');
          console.log(error);
        }
      );
    },
    handleReset() {
      this.searchname = "";
      this.pageNum = 1;
      // const end = new Date();
      // const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime());
      // end.setTime(
      //   new Date(
      //     new Date(new Date().toLocaleDateString('en-US')).getTime() +
      //     24 * 60 * 60 * 1000 -
      //     1
      //   )
      // );
      // this.searchTime = "";
    },
    handleSearch() {
      this.pageNum = 1;
      this.getDataList();
    },
    handleChangeRouter(name) {
      this.$router.push({
        name: name,
        query: {
          index1: this.index1,
          index2: this.index2
        }
      })
      // console.log(name)
    },
  }
}
</script>
<style lang="sass" scoped>

</style>


