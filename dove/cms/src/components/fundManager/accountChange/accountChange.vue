<!-- 帐变记录 -->
<template>
  <div class="contract-manage el-custom">
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
            <label>Username：</label>
            <el-input clearable v-model.trim="form.loginname" placeholder="username" style="width:114px"></el-input>
          </div>
          <!-- <div class="search-inner-wrap">
            <label>Type：</label>
            <el-select clearable v-model="form.type.selected" placeholder="please select a type" class="small"
              :loading="form.type.loading" :loading-text="form.type.loadingText">
              <el-option-group v-for="group in form.type.options" :key="group._id" :label="group.name_en">
                <el-option v-for="item in group.child" :key="item.code" :label="item.name_en" :value="item.type">
                </el-option>
              </el-option-group>
            </el-select>
          </div> -->
          <div class="search-inner-wrap">
            <label>Type：</label>
            <el-select clearable v-model="form.type.selected" placeholder="please select a type" class="small"
              :loading="form.type.loading" :loading-text="form.type.loadingText">
                <el-option v-for="group in form.type.options" :key="group.value" :label="group.type" :value="group.value">
                </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Period：</label>
            <el-date-picker format="dd-MM-yyyy HH:mm:ss" v-model="form.searchTime" type="datetimerange" align="right" unlink-panels range-separator="-"
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
    <div class="data-table" v-loading="loading">
      <el-table :data="list" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="500" :show-summary="true" sum-text="Total" :summary-method="getSummaries">
        <el-table-column align="center" label="Username" width="126">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getUserInfoFn(scope.row)">{{scope.row.loginid?scope.row.loginid.loginname:''}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Type">
          <template slot-scope="scope">
            {{getType(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" align="center" label="Transaction" :formatter="formatMoney">
        </el-table-column>
        <el-table-column prop="trade_current" align="center" label="Balance" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" label="Transaction Time">
          <template slot-scope="scope">
            {{getTime(scope.row.create_at)}}
          </template>
        </el-table-column>
        <el-table-column prop="order_no" align="center" label="Transaction ID">
        </el-table-column>
        <!-- <el-table-column prop="is_test" :formatter="formatTestUser" width="80" label="测试用户">
        </el-table-column> -->
        <el-table-column prop="message" align="center" label="Remark">
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :total="total" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/axios/axios";
import tableBtn from "@/components/littleStyle/tableBtn";
import DialogUserInfo from "@/components/dialog-user-info/DialogUserInfo";
import moment from "moment";
import {
  trim
} from "@/lib/utils/validator";

export default {
  name: "accountChange",
  components: {
    tableBtn,
    DialogUserInfo
  },
  data() {
    return {
      pickerDefaultTime: ["00:00:00", "23:59:59"],
      index1: 0,
      index2: 0,
      loginname: "",
      userid: "",
      dialog: false,
      titleName: "",
      routerArr: [],
      loading: false,
      list: [],
      form: {
        loginname: "", // 用户名
        order_no: "", // 订单号
        transferFrom: "", // 帐变从
        transferTo: "", // 帐变到
        //类型 4转入 5转出
        type: {
          options: [
            {value: '0', type: 'Default'},
            {value: '1', type: 'Deposit'},
            {value: '2', type: 'Withdrawal Freeze'},
            {value: '3', type: 'Withdrawal'},
            {value: '4', type: 'Withdrawal Unfreeze'},
            {value: '5', type: 'Bet'},
            {value: '6', type: 'Reward'},
          ],
          selected: "",
          getValue() {
            if (this.selected) {
              return this.selected;
            }
            // return [5];
          },
          loading: false,
          loadingText: "Loading..."
        },
        // 状态 0: 默认 1： 提交 2， 处理中 3： 成功 4： 失败
        status: {
          options: [{
              value: 0,
              text: "默认"
            },
            {
              value: 1,
              text: "提交"
            },
            {
              value: 2,
              text: "处理中"
            },
            {
              value: 3,
              text: "成功"
            },
            {
              value: 4,
              text: "失败"
            }
          ],
          selected: ""
        },
        searchTime: ""
      },
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
      testUser: [{
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
      is_test: "0",
      totalPageNum: 0, //总页数
      total: 0, //总条数
      pageNum: 1, //当前页
      pageSize: 40, //单页条数
      duration: 1000
    };
  },
  created() {
    this.routerArr = [];
    let query = this.$route.query;
    this.index1 = Number(query.index1);
    this.index2 = Number(query.index2);
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'accountChange');
    this.routerArr = data.routerArr;
    this.titleName = data.titleName;
    
    if (query && query.param) {
      this.form.loginname = query.param;
    }
    // console.log(query, menus[this.index1].child[this.index2])
  },
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
        // console.log("column", column);
        const values = data.map(item => Number(item[column.property]));
        if ((index === 2 || index === 3) && !values.every(value => isNaN(value))) {
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
          if (index === 2 || index === 3) {
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
    formatMoney(row, column, cellValue) {
      if (cellValue) {
        return this.$store.state.toThousands(Number(cellValue));
      }
      return "0.00";
    },
    handleCloseDialog(val) {
      this.dialog = val;
    },
    getUserInfoFn(row) {
      if (row.loginid && row.loginid.loginname && row.loginid._id) {
        this.userid = row.loginid._id;
        this.loginname = row.loginid.loginname;
        this.dialog = true;
      }
    },
    handleChangeRouter(name) {
      this.$router.push({
        name: name,
        query: {
          index1: this.index1,
          index2: this.index2
        }
      });
      // console.log(name)
    },
    handleSearch() {
      this.pageNum = 1;
      this.getList();
    },
    handleReset() {
      this.form.loginname = "";
      // this.form.order_no = '';
      // this.form.transferFrom = '';
      // this.form.transferTo = '';
      // this.form.status.selected = '';
      this.form.type.selected = null;
      this.form.searchTime = "";
      this.is_test = "0";
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
    getList() {
      let vm = this;
      let beginTime = "",
        endTime = "";
      if(vm.form.searchTime) {
        if (vm.form.searchTime.toString() !== "") {
          beginTime = new Date(vm.form.searchTime[0]);
          endTime = new Date(vm.form.searchTime[1]);
        }
      }
      let data = {
        loginname: trim(vm.form.loginname),
        start_at: beginTime,
        end_at: endTime,
        // is_test: vm.is_test,
        // order_no: trim(vm.form.order_no),
        // outUser: trim(vm.form.transferFrom),
        // inUser: trim(vm.form.transferTo),
        type: vm.form.status.selected,
        pageSize: vm.pageSize,
        pageNum: vm.pageNum
      };
      if (vm.form.type.selected) {
        let typeFinal = [];
        typeFinal.push(vm.form.type.selected);
        data["type"] = vm.form.type.selected;
      }
      this.loading = true;
      let url = "/trade/list";
      request.http(
        "get",
        url,
        data,
        success => {
          vm.loading = false;
          if (success.returncode) {
            if (
              success.returncode == 103 ||
              success.returncode == 106 ||
              success.returncode == 101
            ) {
              request.loginAgain(vm);
            } else if (success.returncode == 200) {
              vm.total = success.total;
              if (vm.total) {
                vm.totalPageNum = success.totalPage;
                vm.pageNum = Number(success.pageNum);
                vm.list = success.data;
                vm.message("success", "success");
              } else {
                vm.list = [];
                // vm.$alert("没有符合条件的记录", "系统提醒", {
                //   confirmButtonText: "确定",
                //   center: true
                // });
              }
            } else if (success.returncode == 303) {
              vm.list = [];
              // vm.$alert("没有符合条件的记录", "系统提醒", {
              //   confirmButtonText: "确定",
              //   center: true
              // });
            } else if (success.returncode == 303) {
              vm.list = [];
              // vm.$alert("没有符合条件的记录", "系统提醒", {
              //   confirmButtonText: "确定",
              //   center: true
              // });
            }
          }
        },
        error => {
          vm.loading = false;
          vm.list = [];
        }
      );
      return true;
    },
    // 获取帐变类型list
    getTypeList() {
      let vm = this;
      if (vm.form.type.options.length != 0) {
        return;
      }
      vm.form.type.loading = true;
      let url = "/trade/type/list";
      request.http(
        "get",
        url, {
          pageSize: 1000
        },
        success => {
          vm.form.type.loading = false;
          if (success.returncode) {
            if (
              success.returncode == 103 ||
              success.returncode == 106 ||
              success.returncode == 101
            ) {
              request.loginAgain(vm);
            } else if (success.returncode == 200) {
              let options = success.data;
              if (options.length != 0) {
                for (let i = 0; i < options.length; i++) {
                  let typeArr = new Array();
                  let option = options[i];
                  typeArr.push(option.type);
                  option.type = typeArr;
                }
                vm.form.type.options = options;
              }
            } else {
              vm.form.type.loading = false;
            }
          }
        },
        error => {
          vm.form.type.loading = false;
        }
      );
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
    // getType(type) {
    //   let options = this.form.type.options;
    //   let name = "--";
    //   for (let i = 0; i < options.length; i++) {
    //     let child = options[i].child;
    //     for (let j = 0; j < child.length; j++) {
    //       let c_ = child[j];
    //       if (c_.type === type) {
    //         name = c_.name_en;
    //         break;
    //       }
    //     }
    //     if (name != "--") {
    //       break;
    //     }
    //   }
    //   return name;
    // },
    getType(type) {
      let options = this.form.type.options;
      let name = "--";
      for (let i = 0; i < options.length; i++) {
        let c_ = options[i];
        if (c_.value == type) {
          name = c_.type;
          break;
        }
        if (name != "--") {
          break;
        }
      }
      return name;
    },
    getTime(time) {
      return moment(time).format("DD-MM-YYYY HH:mm:ss");
    },
    getStatus(status) {
      let text = "";
      switch (status) {
        case 0:
          text = "默认";
          break;
        case 1:
          text = "提交";
          break;
        case 2:
          text = "处理中";
          break;
        case 3:
          text = "成功";
          break;
        case 4:
          text = "失败";
          break;
      }
      return text;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList();
    }
  },
  mounted() {
    // this.getTypeList();
    this.handleSearch();
  }
};

</script>
<style>
  /* @import "../../publicCss/header.css"; */

  .contract-manage .contract-link {
    text-decoration: none;
    cursor: pointer;
    display: inline-block;
  }

  .contract-manage .table-row {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  .contract-manage .contract-table {}

  .contract-manage .contract-table .table-row .exp {
    font-weight: 500;
    width: 120px;
    max-width: 120px;
    text-align: right;
    font-size: 14px;
  }

  .contract-manage .contract-table .table-row .content {
    text-align: left;
    padding: 16px 8px;
  }

  .contract-manage li {
    list-style: none;
  }

  .contract-manage .quota {
    color: #dd514c;
  }

  .contract-manage .profit {
    color: #5eb95e;
  }

</style>
