<template>
  <div class="rechargeLot-wrap el-custom">
    <DialogUserInfo v-if="dialog" :loginname="loginname" :userid="userid" @closeDialog="handleCloseDialog" :dialogVisible="dialog"></DialogUserInfo>
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
            <label>User name：</label>
            <el-input clearable v-model.trim="username" placeholder="user name" style="width:114px"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>Type：</label>
            <el-select v-model="type.value" placeholder="type" class="small">
              <el-option v-for="(item,index) in type.options" :key="index" :label="item.label" :value="item.label">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Period：</label>
            <el-date-picker format="dd-MM-yyyy HH:mm:ss" v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="-" start-placeholder="begin" end-placeholder="end" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
            </el-date-picker>
          </div>
          <!-- <div class="search-inner-wrap">
            <label>测试账号：</label>
            <el-select clearable v-model="is_test" placeholder="选择" class="small">
              <el-option v-for="item in testUser" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div> -->
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">Search</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">Reset</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="rechargeListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;" max-height="450" :show-summary="true" sum-text="Total" :summary-method="getSummaries">
        <el-table-column align="center" prop="order_no" label="Transaction ID" width="145">
        </el-table-column>
        <el-table-column align="center" label="User Name" width="126">
          <template slot-scope="scope">
            <el-button type="text" @click="getUserInfoFn(scope.row)">{{scope.row.loginid &&
              scope.row.loginid.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="amount" label="Amount" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" label="Balance" prop="trade_current" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="type" width="150" label="Type" :formatter="formatType">
        </el-table-column>
        <el-table-column align="center" prop="create_at" width="200" :formatter="formatTime" label="Transaction At">
        </el-table-column>
        <el-table-column align="center" prop="message" label="Remark" :formatter="formatMessage">
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import request from "@/axios/axios.js";
import DialogUserInfo from "../dialog-user-info/DialogUserInfo";
import tableBtn from "../littleStyle/tableBtn.vue";
import moment from "moment";
import { price, trim } from '@/lib/utils/validator';
export default {
  name: "artificialOutcomeLog",
  components: {
    tableBtn,
    DialogUserInfo
  },
  data() {
    return {
      pickerDefaultTime: ["00:00:00", "23:59:59"],
      index1: 0,
      index2: 0,
      titleName: "",
      routerArr: [],
      loading: false,
      pageNum: 1,
      pageSize: 40,
      total: 0,
      rechargeListData: [],
      userid: "",
      loginname: "",
      username: "",
      searchTime: "",
      pickerOptions: {
        shortcuts: [
          {
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
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      type: {
        value: "all",
        options: [
          {
            label: "all",
            value: [15]
          },
          {
            label: "手动申请出款",
            value: 15
          }
        ]
      },
      duration: 1000,
      dialog: false,
      dialogIsShow: false,
      testUser: [
        {
          value: "",
          label: "全显示"
        },
        {
          value: "0",
          label: "不显示"
        },
        {
          value: "1",
          label: "仅显示"
        }
      ],
      is_test: "0"
    };
  },
  created() {
    this.routerArr = [];
    let query = this.$route.query;
    this.index1 = Number(query.index1);
    this.index2 = Number(query.index2);
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'artificialOutcomeLog');
    this.routerArr = data.routerArr;
    this.titleName = data.titleName;
    this.getRechargeLotList();
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "Total";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        // console.log("values", values);
        if (
          (index === 2 || index === 3) &&
          !values.every(value => isNaN(value))
        ) {
          sums[index] = values.reduce((prev, curr) => {
            // console.log("prev", prev);
            // console.log("curr", curr);
            const value = Number(curr);
            if (!isNaN(value)) {
              return Math.abs(prev) + Math.abs(curr);
            } else {
              return Math.abs(prev);
            }
          }, 0);
          sums[index] = parseFloat(sums[index]).toFixed(2);
          sums[index] += "";
        } else {
          if (index === 2 || index === 3) {
            sums[index] = "0.00";
          } else sums[index] = "--";
        }
      });
      sums.filter((v, vi) => {
        if(v !== 'Total' && v !== '--'){
          sums[vi] = this.$store.state.toThousands(v);
        }
      })

      return sums;
    },
    formatMoney(row, column, cellValue) {
      if (cellValue) {
        return Number(Math.abs(cellValue)).toFixed(2);
      }
      return "0.00";
    },
    formatType(row, column, cellValue) {
      if (cellValue) {
        switch (cellValue) {
          case 63:
            return "手动申请出款";
          case 11:
            return "人工撤销-派奖";
          case 13:
            return "人工撤销-返点";
          case 30:
            return "人工撤销-分红";
          case 64:
            return "人工撤销-其他";
          default:
            return "--";
        }
      }
      return "--";
    },
    formatMessage(row, column, cellValue) {
      if (cellValue) {
        return cellValue;
      }
      return "--";
    },
    handleChangeRouter(name) {
      console.log(name);
      this.$router.push({
        name: name,
        query: {
          index1: this.index1,
          index2: this.index2
        }
      });
    },
    success() {
      const vm = this;
      this.$message({
        message: "Load Success",
        type: "success",
        duration: vm.duration,
        center: true
      });
    },
    message(message, type) {
      const vm = this;
      vm.$message({
        message: message,
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
    isStatusFn(row, column, cellValue) {
      // console.log(typeof cellValue)
      switch (cellValue) {
        case 0:
          return "默认";
        case 1:
          return "Applied";
        case 2:
          return "Accepted";
        case 3:
          return "Rejected";
      }
    },
    isTypeFn(row, column, cellValue) {
      // console.log(typeof cellValue)
      switch (cellValue) {
        case 0:
          return "默认";
        case 1:
          return "微信";
        case 2:
          return "支付宝";
        case 3:
          return "银行卡转账";
        default:
          return "--";
      }
    },
    formatTestUser(row, column, cellValue) {
      let t = "";
      if (cellValue === 1) {
        t = "是";
      } else {
        t = "否";
      }
      return t;
      // return moment(cellValue).format('DD-MM-YYYY')
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getRechargeLotList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getRechargeLotList();
      // console.log(`当前页: ${val}`);
    },
    getUserInfoFn(row) {
      this.dialog = true;
      this.userid = row.loginid && row.loginid._id;
      this.loginname = row.loginid && row.loginid.loginname;
    },
    handleCloseDialog(val) {
      this.dialog = val;
    },
    handleDialogShow(val) {
      this.dialogIsShow = val;
    },
    formatTime(row, column, cellValue) {
      // console.log("row", row)
      // console.log("column", column)
      if (cellValue) {
        return moment(cellValue).format("DD-MM-YYYY HH:mm:ss");
      }
      return "--";
    },
    getRechargeLotList() {
      const vm = this;
      let beginTime = "",
        endTime = "";
      if (vm.searchTime.toString() !== "") {
        beginTime = new Date(vm.searchTime[0]);
        endTime = new Date(vm.searchTime[1]);
      }
      let obj = vm.type.options.find(item => {
        return item.label === vm.type.value;
      });
      vm.loading = true;
      request.http(
        "get",
        "/trade/list",
        {
          PageNum: vm.pageNum,
          PageSize: vm.pageSize,
          outUser: trim(vm.username),
          beginTime: beginTime,
          endTime: endTime,
          type: obj.value,
          // is_test: vm.is_test
        },
        success => {
          vm.loading = false;
          let code = success.returncode;
          if (code === 200) {
            vm.rechargeListData = success.data;
            vm.pageNum = Number(success.PageNum);
            vm.total = success.count;
            vm.message("Request success", "success");
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          } else {
            vm.rechargeListData = [];
            vm.pageNum = 1;
            vm.total = 0;
          }
        },
        error => {
          vm.loading = false;
          vm.error();
          console.log(error);
        }
      );
    },
    handleReset() {
      this.username = "";
      this.searchTime = "";
      this.type.value = "all";
      this.is_test = "0";
    },
    handleSearch() {
      this.pageNum = 1;
      this.getRechargeLotList();
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
