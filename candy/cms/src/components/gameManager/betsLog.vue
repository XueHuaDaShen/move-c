<template>
  <div class="el-custom betsLogDetail">
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
            <el-input clearable v-model.trim="username" placeholder="user name" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>Lotto：</label>
            <el-select v-model="gameid" clearable placeholder="all" class="small" @change='gameidChange'>
              <el-option v-for="item in lotteryList" :key="item.code" :label="item.name_en" :value="item._id">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Issue：</label>
            <el-input clearable v-model.trim="issue" placeholder="issue" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>Status：</label>
            <el-select clearable v-model="lotteryed" placeholder="please select" class="small">
              <el-option v-for="item in statusArr" :key="item.val" :label="item.label" :value="item.val">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Bet Amount：</label>
            <el-input clearable v-model.trim="betsMin" placeholder="min" style="width:114px;"></el-input>
            <span>--</span>
            <el-input clearable v-model.trim="betsMax" placeholder="max" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>Period：</label>
            <el-date-picker format="dd-MM-yyyy HH:mm:ss" v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="-"
              start-placeholder="begin" end-placeholder="end" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
            </el-date-picker>
          </div>
          <!-- <div class="search-inner-wrap">
            <label>投注内容：</label>
            <el-input clearable v-model.trim="betsNum" placeholder="投注内容" style="width:114px;"></el-input>
          </div> -->
          <!-- <div class="search-inner-wrap">
            <label>测试账号：</label>
            <el-select clearable v-model="is_test" placeholder="测试账号" class="small">
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
      <el-table :data="betsLogList" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="450" :show-summary="true" sum-text="Total" :summary-method="getSummaries">
        <el-table-column align="center" label="User Name" width="126" prop="loginname">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getUserInfoFn(scope.row)">{{scope.row.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="firstname" width="110" label="First Name">
        </el-table-column>
        <el-table-column align="center" prop="gameid.name_en" label="Lotto">
        </el-table-column>
        <el-table-column align="center" prop="issue_no" label="Issue">
        </el-table-column>
        <el-table-column align="center" label="Winning Number" prop="luck_no">
          <template slot-scope="scope">
            <span>{{scope.row.luck_no||'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="80" label="Bet Amount" prop="cash">
        </el-table-column>
        <el-table-column align="center" min-width="80" label="Paid" prop="cash_discount">
          <template slot-scope="scope">
            <span>{{formatMoney(scope.row.cash_discount)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="80" label="Status">
          <template slot-scope="scope">
            <span>{{isStatusFn(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="80" label="Reward">
          <template slot-scope="scope">
            <span :class="scope.row.status != 1 ? '' : (scope.row.award_cash > 0 ? 'color-red' : 'color-green')">{{scope.row.status == 1 ? formatMoney(scope.row.award_cash) : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="Bet time">
        </el-table-column>
        <!-- <el-table-column align="center" prop="is_test" :formatter="formatTestUser" width="80" label="测试用户">
        </el-table-column> -->
        <el-table-column align="center" label="Detail">
          <template slot-scope="scope">
            <el-button size="small" @click="getDetail(scope.row)" class="small edit">Detail</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="Bet Detail" :visible.sync="dialogTableVisible">
      <el-table :data="detailList.vote" height="500">
        <el-table-column property="gamename_en" label="Lotto"></el-table-column>
        <el-table-column property="lotteryname_en" label="Method"></el-table-column>
        <el-table-column property="issue_no" label="Issue"></el-table-column>
        <el-table-column property="vote_cash" label="Amount"></el-table-column>
        <el-table-column align="center" label="Paid" prop="vote_cash_discount">
          <template slot-scope="scope">
            <span>{{formatMoney(scope.row.vote_cash_discount)}}</span><i class="el-icon-info" style="margin-left:5px;color:#E6A23C;cursor:pointer;" @click="handleGetCashDetail(scope.row, 57)"></i>
          </template>
        </el-table-column>
        <el-table-column property="luck_no" label="Winning Number"></el-table-column>
        <el-table-column property="vote_no" label="Bet Number"></el-table-column>
        <el-table-column property="status" label="Status">
          <template slot-scope="scope">
            <span :class="scope.row.status == 5 ? 'color-red' : (scope.row.status == 4 ? 'color-green' : '')">{{isDetailStatusFn(scope.row.status)}}</span>
            <!-- <span v-else>{{isDetailStatusFn(scope.row.status)}}</span> -->
          </template>
        </el-table-column>
        <el-table-column property="award_cash" label="Reward">
          <template slot-scope="scope">
            <span :class="scope.row.status == 5 ? 'color-red' : (scope.row.status == 4 ? 'color-green' : '')">{{formatMoney(scope.row.award_cash)}}</span><i class="el-icon-info" style="margin-left:5px;color:#E6A23C;cursor:pointer;" v-if="scope.row.status == 5" @click="handleGetCashDetail(scope.row, 58)"></i>
            <!-- <span v-else>{{formatMoney(scope.row.award_cash)}}</span> -->
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="Cash Detail" :visible.sync="showCashDetail" class="cashDetail" :show-header="false">
      <el-table :data="cashDetailList">
        <el-table-column property="name" label="User"></el-table-column>
        <el-table-column property="amount" label="Amount"></el-table-column>
      </el-table>
    </el-dialog>
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
    name: "betsLog",
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        pickerDefaultTime: ["00:00:00", "23:59:59"],
        dialogTableVisible: false,
        showCashDetail: false,
        cashDetailList: [],
        index1: 0,
        index2: 0,
        titleName: "",
        routerArr: [],
        lotteryid: "",
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        betsLogList: [],
        userid: "",
        loginname: "",
        username: "",
        searchTime: "",
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
        issue: "",
        betsMin: "",
        betsMax: "",
        betsNum: "",
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        lotteryList: [],
        gameid: "",
        lotteryed: "",
        statusArr: [{
            label: "Waiting drawing",
            val: "0"
          },
          {
            label: "Drawed",
            val: "1"
          },
          {
            label: "Canceled",
            val: "2"
          }
        ],
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
        detailList: [],
        wanfalist: {
          options: []
        }
      };
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'betsLog');
      this.routerArr = data.routerArr;
      this.titleName = data.titleName;
      if (query.param) {
        this.username = query.param;
      }
      this.getBetsLotList();
      this.getLotteryList();
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
          let values = data.map(item => Number(item[column.property]));
          if (index === 5) {
            values = data.map(item => Number(item["cash"]));
          }
          if (index === 6) {
            values = data.map(item => Number(item["cash_discount"]));
          }
          if (index === 8) {
            values = data.map(item => Number(item["award_cash"]));
          }
          if (
            (index === 5 || index === 6 || index === 8) &&
            !values.every(value => isNaN(value))
          ) {
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
            if (index === 5 || index === 6 || index === 8) {
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
      gameidChange(val) {
        // console.log('val', val);
        if (val) {
          this.getwanfalist(val);
        } else {
          this.wanfalist.options = [];
          this.lotteryid = "";
        }
      },
      getwanfalist(id) {
        let vm = this;
        vm.loading = true;
        request.http(
          "get",
          "/lottery/list", {
            id: id
          },
          success => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.wanfalist.options = success.data;
              vm.success();
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
      success() {
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
      alertMessage(type, text) {
        const vm = this;
        this.$message({
          message: text,
          type: type,
          duration: vm.duration,
          center: true
        });
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
      isStatusFn(cellValue) {
        switch (cellValue) {
          case "0":
            return "Waiting drawing";
          case "1":
            return "Drawed";
          case "2":
            return "Canceled";
        }
      },
      isDetailStatusFn(cellValue) {
        switch (cellValue) {
          case 0:
            return "默认";
          case 1:
            return "Waiting drawing";
          case 2:
            return "Not start";
          case 3:
            return "Canceled";
          case 4:
            return "LOSS";
          case 5:
            return "WIN";
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
      formatMoney(value) {
        if (value) {
          return parseFloat(value)
            .toFixed(2)
            .toString();
        }
        return "0.00";
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getBetsLotList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getBetsLotList();
        // console.log(`当前页: ${val}`);
      },
      getUserInfoFn(row) {
        this.dialog = true;
        this.userid = row.loginid._id;
        this.loginname = row.loginname;
      },
      handleCloseDialog(val) {
        this.dialog = val;
      },
      handleDialogShow(val) {
        this.dialogIsShow = val;
      },
      formatTime(row, column, cellValue) {
        return moment(cellValue).format("DD-MM-YYYY HH:mm:ss");
        // return moment(cellValue).format('DD-MM-YYYY')
      },
      getBetsLotList() {
        const vm = this;
        let beginTime = "",
          endTime = "";
        if (vm.searchTime.toString() !== "") {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
        vm.loading = true;
        request.http(
          "get",
          "/lottery/order/list", {
            page_num: vm.pageNum,
            page_size: vm.pageSize,
            beginTime: beginTime,
            endTime: endTime,
            beginAmount: trim(vm.betsMin),
            endAmount: trim(vm.betsMax),
            gameid: vm.gameid,
            issue_no: trim(vm.issue),
            loginname: trim(vm.username),
            status: vm.lotteryed,
            // is_test: vm.is_test
          },
          success => {
            vm.loading = false;
            // console.log('betsLogList--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.betsLogList = success.data.data;
              vm.pageNum = Number(success.data.page_num);
              vm.total = success.data.total;
              vm.success();
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
      getLotteryList() {
        const vm = this;
        request.http(
          "get",
          "/lottery/game/list", {},
          success => {
            // console.log('lotteryList--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.lotteryList = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            }
          },
          error => {
            vm.error();
            console.log(error);
          }
        );
      },
      getDetail(row) {
        this.userid = row.loginid._id;
        const vm = this;
        request.http(
          "get",
          "/lottery/order/detail", {
            orderid: row._id
          },
          success => {
            // console.log('lotteryList--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.detailList = success.data;
              vm.dialogTableVisible = true;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            }
          },
          error => {
            vm.error();
            console.log(error);
          }
        );
      },
      handleGetCashDetail(row, type) {
        const vm = this;
        let url = "/trade/list";
        request.http(
          "get",
          url,
          {
            detail: row._id,
            type: [type],
            loginid: vm.userid
          },
          success => {
            let code = success.returncode;
            if (success.returncode) {
              if (code == 103 || code == 106 || code == 101) {
                request.loginAgain(vm);
              } else if (code == 200) {
                // vm.total = success.count;
                if (success.data.length > 0) {
                  success.ancestors.filter(v => {
                    for(let i in success.data){
                      if(success.data[i].loginid._id === v.loginid){
                        v.amount = success.data[i].amount;
                      }
                    }
                  })
                  vm.cashDetailList = success.ancestors;
                  vm.showCashDetail = true;
                } else {
                  vm.alertMessage('error', 'No Data')
                }
              } else if (code == 303) {
                vm.alertMessage('error', 'No Data')
              } else if (code == 303) {
                vm.alertMessage('error', 'No Data')
              }
            }
          },
          error => {
            vm.alertMessage('error', 'No Data')
          }
        );
      },
      handleReset() {
        this.username = "";
        this.issue = "";
        this.betsMax = "";
        this.betsMin = "";
        this.gameid = "";
        this.lotteryid = "";
        this.wanfalist.options = [];
        this.betsNum = "";
        this.searchTime = "";
        this.is_test = "0";
      },
      handleSearch() {
        this.getBetsLotList();
        // console.log(this.username, this.issue, this.betsMax, this.betsMin, this.gameid, this.lotteryed, this.betsNum, this.searchTime)
      }
    }
  };

</script>
<style>
  /* @import '../../publicCss/header.css'; */

  .betsNum {
    word-break: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .lottery_popover {
    overflow-y: scroll;
    max-height: 150px;
    width: 200px;
  }

  .betsLogDetail .el-dialog{
    width:800px !important;
  }
  .betsLogDetail .el-dialog__body{
    padding:10px 20px;
  }
  .cashDetail .el-dialog{
    width:300px !important;
  }

</style>
<style lang="scss" scoped>
.betsLogDetail{
  span.color-red{
    color:#2D996E;
  }
  span.color-green{
    color:#c83a4c;
  }
}
</style>

