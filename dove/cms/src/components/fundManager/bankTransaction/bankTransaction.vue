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
            <label>Bank Code：</label>
            <el-select clearable v-model="bankCode" placeholder="please select" class="small">
              <el-option v-for="item in bankDataList" :key="item.code" :label="item.code" :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Transaction ID：</label>
            <el-input clearable v-model.trim="order_no" placeholder="Transaction id" style="width:114px"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>Status：</label>
            <el-select clearable v-model="status" placeholder="please select" class="small">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Period：</label>
            <el-date-picker format="dd-MM-yyyy HH:mm:ss" v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="-"
              start-placeholder="begin" end-placeholder="end" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
            </el-date-picker>
          </div>
          <div class="search-inner-wrap">
            <label>Amount：</label>
            <el-input clearable v-model.trim="incomeRange.min" placeholder="min" style="width:114px" type="number"></el-input>
            <span>--</span>
            <el-input clearable v-model.trim="incomeRange.max" placeholder="max" style="width:114px" type="number"></el-input>
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
      <el-table :data="rechargeListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="500" :show-summary="true" sum-text="Total" :summary-method="getSummaries">
        <el-table-column align="center" prop="_id" label="Transaction ID" width="145">
        </el-table-column>
        <el-table-column align="center" prop="src" label="Bane Name" width="126">
        </el-table-column>
        <el-table-column align="center" prop="amount" width="110" label="Amount" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="tr_code" width="110" label="Transaction Code">
        </el-table-column>
        <el-table-column align="center" prop="channel" width="110" label="Channel">
        </el-table-column>
        <el-table-column align="center" prop="tr_date" :formatter="formatTime" label="Transaction Time">
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="Create Time">
        </el-table-column>
        <el-table-column align="center" prop="desc" width="150" label="Description">
        </el-table-column>
        <el-table-column align="center" prop="status" :formatter="isStatusFn" label="Status">
        </el-table-column>
        <el-table-column align="center" width="80" label="Parsed">
          <template slot-scope="scope">
            {{formatParsed(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="status" fixed="right" label="Detail" width="150">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==2" @click="bindOrder(scope.row)" class="yes small">Bind</el-button>
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
    <el-dialog title="Bind" :center="false" :visible.sync="dialogFormVisible">
      <div class="body-middle">
        <div class="form" style="width:100%;padding:0 30px;">
          <div class="form-row">
            <span class="exp">Deposit ID</span>
            <span class="exp-after">：</span>
            <el-input clearable v-model.trim="depositId" placeholder="deposit id"></el-input>
            <i class="el-icon-search" style="font-size:20px;margin:0 10px;cursor:pointer" @click="searchOrder"></i>
          </div>
          <div class="split-line"></div>
          <div class="deposit-order-wrap" v-if="depositOrder">
            <div class="form-row">
              <span class="exp">User Name</span>
              <span class="exp-after">：</span>
              <el-input disabled :value="depositOrder.loginid.loginname || ''"></el-input>
            </div>
            <div class="form-row">
              <span class="exp">First Name</span>
              <span class="exp-after">：</span>
              <el-input disabled :value="depositOrder.loginid.firstname || ''"></el-input>
            </div>
            <div class="form-row">
              <span class="exp">Last Name</span>
              <span class="exp-after">：</span>
              <el-input disabled :value="depositOrder.loginid.lastname || ''"></el-input>
            </div>
            <div class="form-row">
              <span class="exp">Bank Account</span>
              <span class="exp-after">：</span>
              <el-input disabled :value="depositOrder.receiver_accountid ? depositOrder.receiver_accountid.card_no : ''"></el-input>
            </div>
            <div class="form-row">
              <span class="exp">Submit Time</span>
              <span class="exp-after">：</span>
              <el-input disabled :value="formatTime('', '', depositOrder.create_at)"></el-input>
            </div>
            <div class="split-line"></div>
            <div class="form-row">
              <span class="exp">Package</span>
              <span class="exp-after">：</span>
              <el-input disabled :value="depositOrder.packageid ? depositOrder.packageid.name : 'No Package'"></el-input>
            </div>
            <div class="form-row">
              <span class="exp">Amount</span>
              <span class="exp-after">：</span>
              <el-input disabled :value="(depositOrder.amount || 0) + ' THB'"></el-input>
            </div>
            <div class="form-row">
              <span class="exp">Free</span>
              <span class="exp-after">：</span>
              <el-input disabled :value="(depositOrder.packageid ? depositOrder.packageid.free : '0') + ' THB'"></el-input>
            </div>
            <div class="form-row">
              <span class="exp">Total</span>
              <span class="exp-after">：</span>
              <el-input disabled :value="((depositOrder.packageid ? depositOrder.packageid.free : '0')*1+depositOrder.amount*1) + ' THB'"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="updateTransaction" class="yes" :loading="rechargeLoading">Confirm</el-button>
        <el-button @click="resetDepositOrder" class="no">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/axios/axios.js";
import DialogUserInfo from "@/components/dialog-user-info/DialogUserInfo";
import moment from "moment";
import {
  zhengshu,
  trim
} from '@/lib/utils/validator';
export default {
  name: "bankTransaction",
  components: {
    DialogUserInfo
  },
  data() {
    var validateRecharge = (rule, value, callback) => {
      if (!zhengshu(value)) {
        callback(new Error("The amount must be greater than 0"));
      } else {
        callback();
      }
    };
    return {
      pickerDefaultTime: ['00:00:00', '23:59:59'],
      index1: 0,
      index2: 0,
      rechargeLoading: false,
      titleName: '',
      routerArr: [],
      loading: false,
      pageNum: 1,
      pageSize: 40,
      total: 0,
      bankDataList: [],
      rechargeListData: [],
      userid: "",
      loginname: "",
      bankCode: "",
      searchTime: "",
      card_no: '',
      incomeRange: {
        min: "",
        max: ""
      },
      recharge: "",
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
      statusArr: [
        {
          value: "1",
          label: "New"
        },
        {
          value: "2",
          label: "Manual"
        },
        {
          value: "3",
          label: "Binded"
        }
      ],
      depositId: '',
      depositOrder: '',
      status: "",
      order_no: "",
      duration: 1000,
      dialog: false,
      dialogIsShow: false,
      dialogFormVisible: false,
      form: {
        username: '',
        firstname: '',
        lastname: '',
        rechargeStatus: "",
        realRecharge: '',
        remark: '',
        bank_no: "",
      },
      rules: {
        rechargeStatus: [{
          required: true,
          message: "please select status",
          trigger: "change"
        }],
        realRecharge: [{
            required: true,
            message: "please input real amount",
            trigger: "change"
          },
          {
            trigger: "blur",
            validator: validateRecharge
          }
        ],
        remark: [{
          required: true,
          message: "please input remark",
          trigger: "change"
        }]
      },
      // formLabelWidth: "120px",
      currId: "",
      detailVisible: false,
    };
  },
  created() {
    this.routerArr = [];
    let query = this.$route.query;
    if (query.param) {
      this.order_no = query.param;
    }
    this.index1 = Number(query.index1);
    this.index2 = Number(query.index2);
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'bankTransaction');
    this.routerArr = data.routerArr;
    this.titleName = data.titleName;
    this.getBankList();
    this.getRechargeLotList();
  },
  methods: {
    getBankList() {
      const vm = this;
      request.http(
        "get",
        "/bank/list", {
          page_num: vm.pageNum,
          page_size: vm.pageSize,
        },
        success => {
          let code = success.returncode;
          if (code === 200) {
            vm.bankDataList = success.data;
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          }
        },
        error => {
          vm.error()
          console.log(error)
        }
      )
    },
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
        if (index === 2) {
          values = data.map(item => Number(item["amount"]));
        }
        if (index === 2 && !values.every(value => isNaN(value))) {
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
          if (index === 2) {
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
      return "0.00"
    },
    formatParsed(row) {
      let bank = row.bank || '';
      let account = row.account || '';
      let aname = row.aname || '';
      return bank + ' / ' + account + ' / ' + aname;
    },
    handleChangeRouter(name) {
      this.$router.push({
        name: name,
        query: {
          index1: this.index1,
          index2: this.index2
        }
      })
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
      })
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
          return "Default";
        case 1:
          return "New";
        case 2:
          return "Manual";
        case 3:
          return "Binded";
      }
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
      // console.log("row", row)
      // console.log("column", column)
      if (cellValue) {
        return moment(cellValue).format("DD-MM-YYYY HH:mm:ss");
      }
      return "--"
      // return moment(cellValue).format('DD-MM-YYYY')
    },
    // 查询订单
    searchOrder() {
      const vm = this;
      if(!this.depositId){
        this.message('Please enter your deposit id', 'error')
        return
      }
      request.http(
        "get",
        "/trade/deposit/order",
        {
          id: vm.depositId,
        },
        success => {
          let code = success.returncode;
          if (code === 200) {
            this.depositOrder = success.data;
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          } else {
            alert(success.returncode);
          }
        },
        error => {
          vm.error();
          console.log(error);
        }
      );
    },
    updateTransaction() {
      const vm = this;
      if(!this.depositOrder){
        this.message('Please find the order', 'error')
        return
      }
      vm.rechargeLoading = true;
      request.http(
        "post",
        "/bank/transaction/update",
        {
          id: vm.currId,
          status: 3,
          deposit_id: vm.depositOrder._id
        },
        success => {
          vm.rechargeLoading = false;
          let code = success.returncode;
          if (code === 200) {
            vm.getRechargeLotList();
            vm.resetDepositOrder();
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          } else {
            alert(success.returncode);
          }
        },
        error => {
          vm.rechargeLoading = false;
          vm.error();
          console.log(error);
        }
      );
    },
    resetDepositOrder() {
      this.dialogFormVisible = false;
      this.depositId = '';
      this.depositOrder = '';
    },
    bindOrder(row) {
      this.dialogFormVisible = true;
      this.currId = row._id;
    },
    getRechargeLotList() {
      const vm = this;
      let beginTime = "",
        endTime = "";
      if(vm.searchTime) {
        if (vm.searchTime.toString() !== "") {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
      }
      vm.loading = true;
      request.http(
        "get",
        "/bank/transaction/list", {
          pageNum: vm.pageNum,
          pageSize: vm.pageSize,
          bank_code: trim(vm.bankCode),
          id: trim(vm.order_no),
          start_at: beginTime,
          end_at: endTime,
          status: vm.status,
          amount_start: vm.incomeRange.min,
          amount_end: vm.incomeRange.max,
          type: 1, // 0 amount 所有, 1 >0 , 2 <0 ; 
        },
        success => {
          vm.loading = false;
          let code = success.returncode;
          if (code === 200) {
            vm.rechargeListData = success.data;
            vm.pageNum = Number(success.pageNum);
            vm.total = success.total;
            vm.message("Success", "success");
          } else if (code === 301) {
            vm.rechargeListData = [];
            vm.pageNum = 1;
            vm.total = 0;
            vm.message("Success", "success");
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
      this.username = "";
      this.searchTime = "";
      this.status = "";
      this.order_no = "";
    },
    handleSearch() {
      this.pageNum = 1;
      this.getRechargeLotList();
    }
  },
  watch: {
    'form.rechargeStatus'() {
      this.form.realRecharge = (this.form.rechargeStatus === "2" ? this.recharge : 0);
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
div.split-line {
  width: 100%;
  height: 1px;
  background: #E6E6E6;
  margin-bottom: 20px;
}
</style>

