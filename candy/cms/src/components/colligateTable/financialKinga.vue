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
          <!-- <div class="search-inner-wrap">
            <label>Type：</label>
            <el-select v-model="typeName" clearable placeholder="Select Type" class="small">
              <el-option v-for="item in userType" :key="item.code" :label="item.title" :value="item.code">
              </el-option>
            </el-select>
          </div> -->
          <div class="search-inner-wrap">
            <label>User Name：</label>
            <el-input clearable v-model="searchname" placeholder="username" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>Sort By：</label>
            <el-select v-model="order" clearable class="small">
              <el-option v-for="item in orderArr" :key="item.code" :label="item.title" :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Order：</label>
            <el-select v-model="desc" clearable class="small">
              <el-option v-for="item in descArr" :key="item.val" :label="item.title" :value="item.val">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-checkbox v-model="dateChecked" :true-label="1" :false-label="0">Added up</el-checkbox>
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
        </div>
      </div>
    </div>
    <div class="tag-router">
      <span v-for="(item, i) in breadcrumbArr" :key="i" @click="handleClickTag(item)">{{item}} <i class="right-jiantou" v-if="i != breadcrumbArr.length-1"></i></span>
    </div>
    
    <div class="data-table" v-loading="loading">
      <el-table :data="financialTeamListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="450" :show-summary="true" sum-text="Total" :summary-method="getSummaries">
        <el-table-column align="center" label="User" width="126">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.type == 1" @click="getUserChildren(scope.row)">{{scope.row.loginname}}</el-button>
            <el-button type="text" v-if="!scope.row.type || scope.row.type != 1">{{scope.row.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="firstname" width="110" label="First Name">
        </el-table-column>
        <el-table-column align="center" width="110" label="Agent" prop="parent.name">
        </el-table-column>
        <el-table-column align="center" label="Type" prop="type" :formatter="formatUser">
        </el-table-column>
        <el-table-column align="center" prop="day" width="150" label="Date" :formatter="formatTime">
        </el-table-column>
        <el-table-column align="center" prop="recharge_team" label="Team Deposit" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="recharge" label="Deposit" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="rechargechild" label="Sbuordinate Deposit" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="withdrawal_team" label="Team Withdrawal" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="withdrawal" label="Withdrawal" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="withdrawalchild" label="Sbuordinate Withdrawal" :formatter="formatMoney">
        </el-table-column>
        <!-- <el-table-column align="center" prop="credit_team" label="Credit" :formatter="formatMoney">
        </el-table-column> -->
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
  import DialogUserInfo from "../dialog-user-info/DialogUserInfo";
  import tableBtn from "../littleStyle/tableBtn.vue";
  import moment from "moment";
  import {
    trim
  } from '@/lib/utils/validator';
  export default {
    name: "financialKinga",
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        dateChecked: 1,
        index1: 0,
        index2: 0,
        titleName: "",
        routerArr: [],
        breadcrumbArr: [],
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        financialTeamListData: [],
        userid: "",
        loginname: "",
        username: 'KINGA',
        searchname: '',
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
        statusArr: [{
            value: "0",
            label: "未发工资"
          },
          {
            value: "1",
            label: "已发工资"
          }
        ],
        type: "",
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
        userType: [
          {
            title: "All",
            code: ""
          },
          {
            title: "Agent",
            code: "1"
          },
          {
            title: "Member",
            code: "0"
          },
          {
            title: "D-Member",
            code: "2"
          },
        ],
        orderArr: [
          {
            title: "Date",
            code: "day"
          },
          {
            title: "Reward",
            code: "rebate"
          },
          {
            title: "Profit",
            code: "profit"
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
        searchChild: false,
        searchTime: "",
        typeName: "",
        order: "day",
        desc: "-1",
        is_test: "0",
        status: "",
        order_no: "",
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        currId: ""
      };
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'financialKinga');
      this.routerArr = data.routerArr;
      this.titleName = data.titleName;
      // if (this.$route.query && this.$route.query.param) {
      //   this.typeName = this.$route.query.param;
      // }
      this.breadcrumbArr.push('KINGA')
      const end = new Date();
      const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime());
      end.setTime(
        new Date(
          new Date(new Date().toLocaleDateString('en-US')).getTime() +
          24 * 60 * 60 * 1000 -
          1
        )
      );
      this.searchTime = [start, end];
      this.getteamReportList();
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
          if (index === 3) {
            sums[index] = "--";
            return;
          }
          let values = data.map(item => Number(item[column.property]));
          // if (index === 6) {
          //   values = data.map(item => Number(item['vote_cash']));
          // }
          if (!values.every(value => isNaN(value))) {
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
      // 面包屑
      handleClickTag(tag) {
        this.searchname = '';
        if(tag == 'KINGA'){
          this.breadcrumbArr = [];
          this.breadcrumbArr.push(tag);
          this.username = 'KINGA';
          this.getteamReportList();
        }else{
          let index = this.breadcrumbArr.indexOf(tag);
          if(index == (this.breadcrumbArr.length-1)){
            // 点击当前的用户
          }else{
            // 点击上一层用户
            this.username = tag;
            let arr = this.breadcrumbArr.splice(0, index);
            this.breadcrumbArr = [];
            this.breadcrumbArr.push(...arr, tag);
            this.getteamReportList();
          }
        }
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
            return "未发工资";
          case 1:
            return "已发工资";
        }
      },
      formatUser(row, column, cellValue) {
        let t;
        if(cellValue == 1){
          t = 'Agent';
        }else if(cellValue == 0){
          t = 'Member';
        }else if(cellValue == 2){
          t = 'User';
        }
        return t;
        // return moment(cellValue).format('DD-MM-YYYY')
      },
      formatMoney(row, column, cellValue) {
        if (cellValue) {
          return this.$store.state.toThousands(Number(cellValue));
        }
        return "0.00";
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getteamReportList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getteamReportList();
        // console.log(`当前页: ${val}`);
      },
      getUserChildren(row) {
        // this.dialog = true;
        // this.userid = row.loginid;
        // this.loginname = row.loginname;
        this.searchname = '';
        this.username = row.loginname;
        if(this.breadcrumbArr.indexOf(this.username) > -1){
          return false;
        }
        this.breadcrumbArr.push(this.username)
        this.getteamReportList();
        // if (this.searchTime) {
        //   if (this.searchTime.toString() !== "") {
        //     this.breadcrumbArr.push(this.username)
        //     this.getteamReportList();
        //   }
        // }
      },
      handleCloseDialog(val) {
        this.dialog = val;
      },
      handleDialogShow(val) {
        this.dialogIsShow = val;
      },
      formatTime(row, column, cellValue) {
        const vm = this;
        if (cellValue) {
          return moment(cellValue).format("DD-MM-YYYY");
        }else if(vm.searchTime){
          return moment(vm.searchTime[0]).format("DD-MM-YYYY") + ' To ' + moment(vm.searchTime[1]).format("DD-MM-YYYY");
        }else{
          return '--';
        }
      },
      getteamReportList() {
        const vm = this;
        let beginTime = "",
          endTime = "";
        if (vm.searchTime) {
          if (vm.searchTime.toString() !== "") {
            beginTime = new Date(vm.searchTime[0]);
            endTime = new Date(vm.searchTime[1]);
          }
        }
        vm.loading = true;
        request.http(
          "get",
          "/statistic/team/list", {
            pageNum: vm.pageNum,
            pageSize: vm.pageSize,
            loginname: trim(vm.username),
            searchname: vm.searchname,
            startTime: beginTime,
            endTime: endTime,
            type: vm.typeName,
            order: vm.order,
            desc: Number(vm.desc),
            sum: vm.dateChecked
            // status: vm.status,
          },
          success => {
            vm.loading = false;
            // console.log("teamReportList--------", success);
            let code = success.returncode;
            if (code === 200) {
              if(vm.searchname){
                vm.breadcrumbArr = [];
                success.ancestors.filter(v => {
                  vm.breadcrumbArr.push(v.name);
                })
                // vm.breadcrumbArr.push(vm.searchname);
              }
              vm.financialTeamListData = success.data;
              vm.pageNum = Number(success.PageNum) || 1;
              vm.total = success.count;
              vm.succee();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
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
        this.dateChecked = 1;
        this.typeName = "";
        this.order = "day";
        this.desc = "-1";
        const end = new Date();
        const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime());
        end.setTime(
          new Date(
            new Date(new Date().toLocaleDateString('en-US')).getTime() +
            24 * 60 * 60 * 1000 -
            1
          )
        );
        this.searchTime = [start, end];
      },
      handleSearch() {
        this.pageNum = 1;
        this.getteamReportList();
      }
    }
  };

</script>
<style lang="scss">
  /* @import "../../publicCss/header.css"; */

  .rechargeLot-wrap .el-form-item__content {
    text-align: left;
  }

</style>
<style lang="scss" scoped>
.tag-router{
  width:100%;
  padding:20px;
  background:#fff;
  text-align:left;
  span{
    cursor: pointer;
    color:#606266;
    &:hover{
      color:#000;
    }
  }
}
.right-jiantou{
  font-family: element-icons!important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  font-size:14px;
  margin: 0 6px;
  font-weight: 400;
  color: #c0c4cc;
  &::before{
    content: "\E604";
  }
}
</style>

