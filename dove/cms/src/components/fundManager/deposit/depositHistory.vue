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
            <label>Username：</label>
            <el-input clearable v-model.trim="username" placeholder="username" style="width:114px"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>Deposit ID：</label>
            <el-input clearable v-model.trim="order_no" placeholder="deposit id" style="width:114px"></el-input>
          </div>
          <!-- <div class="search-inner-wrap">
            <label>Status：</label>
            <el-select clearable v-model="status" placeholder="please select" class="small">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div> -->
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
        <el-table-column align="center" prop="order_no" label="Deposit ID" width="145">
        </el-table-column>
        <el-table-column align="center" label="User Name" width="126">
          <template slot-scope="scope">
            <el-button type="text" @click="getUserInfoFn(scope.row)">{{scope.row.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="apply_amount" width="110" label="Amount" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="packageid.free" width="110" label="Free" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="amount" width="110" label="Total" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="Submit Time">
        </el-table-column>
        <el-table-column align="center" prop="update_at" :formatter="formatTime" label="Finish Time">
        </el-table-column>
        <el-table-column align="center" prop="card_no" width="150" label="Bank Account">
        </el-table-column>
        <el-table-column align="center" prop="status" :formatter="isStatusFn" label="Status">
        </el-table-column>
        <el-table-column align="center" prop="remark" width="80" label="Remark" :formatter="formatMessage">
        </el-table-column>
        <el-table-column align="center" prop="status" fixed="right" label="Detail" width="150">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==2 || scope.row.status==3" @click="getDetail(scope.row)" class="edit small">Detail</el-button>
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
    <el-dialog title="Detail" :center="false" :visible.sync="detailVisible">
      <div class="body-middle">
        <el-form>
          <el-form-item label="User Name" v-if="detail.username">
            <el-input v-model.trim="detail.username" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="First Name" v-if="detail.firstname">
            <el-input v-model.trim="detail.firstname" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="Last Name" v-if="detail.lastname">
            <el-input v-model.trim="detail.lastname" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="Bank Account" v-if="detail.bank_no">
            <el-input v-model.trim="detail.bank_no" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="Audit Result：" v-if="detail.rechargeStatus">
            <el-select v-model="detail.rechargeStatus" disabled>
              <el-option label="Accepted" :value="2"></el-option>
              <el-option label="Rejected" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Amount：" v-if="detail.realRecharge">
            <el-input v-model.trim="detail.realRecharge" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="Remark：" v-if="detail.remark">
            <el-input v-model.trim="detail.remark" disabled>
            </el-input>
          </el-form-item>
        </el-form>
        <div class="split-line"></div>
        <el-form>
          <el-form-item label="Package：">
            <el-input disabled :value="detail_data.packageid ? detail_data.packageid.name : 'No Package'"></el-input>
          </el-form-item>
          <el-form-item label="Amount：">
            <el-input disabled :value="(detail_data.apply_amount || 0) + ' THB'"></el-input>
          </el-form-item>
          <el-form-item label="Free：">
            <el-input disabled :value="(detail_data.packageid ? detail_data.packageid.free : '0') + ' THB'"></el-input>
          </el-form-item>
          <el-form-item label="Total：">
            <el-input disabled :value="((detail_data.packageid ? detail_data.packageid.free : '0')*1+detail_data.apply_amount*1) + ' THB'"></el-input>
          </el-form-item>
        </el-form>
        <div class="split-line"></div>
        <div class="detail-title">
          <p>Transaction ID：{{detail_data.trid ? detail_data.trid._id : ''}}</p>
        </div>
        <table class="dialog-table">
          <tr>
            <td class="title">Time</td>
            <td class="title">Amount</td>
            <td class="title">Description</td>
          </tr>
          <tr>
            <td align="left" class="td-right">
              {{formatTime2(detail_data.trid ? detail_data.trid.tr_date : '')}}
            </td>
            <td align="left" class="td-right">
              {{detail_data.trid ? detail_data.trid.amount : '0'}}
            </td>
            <td align="left" class="td-right">
              {{detail_data.trid ? detail_data.trid.desc : ''}}
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDetail()" class="yes">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/axios/axios.js";
import DialogUserInfo from "@/components/dialog-user-info/DialogUserInfo";
import tableBtn from "@/components/littleStyle/tableBtn.vue";
import moment from "moment";
import {
  zhengshu,
  trim
} from '@/lib/utils/validator';
export default {
  name: "depositHistory",
  components: {
    tableBtn,
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
      rechargeListData: [],
      userid: "",
      loginname: "",
      username: "",
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
      statusArr: [{
          value: "1",
          label: "Applied"
        },
        {
          value: "2",
          label: "Accepted"
        },
        {
          value: "3",
          label: "Rejected"
        },
        {
          value: "4",
          label: "Manual"
        }
      ],
      type: {
        value: "",
        options: [],
        loading: false,
        loadingtext: "Loading...",
      },
      status: "",
      order_no: "",
      duration: 1000,
      dialog: false,
      dialogIsShow: false,
      dialogFormVisible: false,
      detail_data: '',
      form: {
        username: '',
        firstname: '',
        lastname: '',
        rechargeStatus: "",
        realRecharge: '',
        remark: '',
        bank_no: "",
      },
      detail: {
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
      // currentCash: "",
      testUser: [{
          value: "",
          label: "全显示"
        }, {
          value: "0",
          label: "不显示"
        },
        {
          value: "1",
          label: "仅显示"
        }
      ],
      is_test: '0',
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
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'depositHistory');
    this.routerArr = data.routerArr;
    this.titleName = data.titleName;
    
    this.getRechargeLotList();
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
        if (index === 2) {
          values = data.map(item => Number(item["apply_amount"]));
        }
        if (index === 3) {
          values = data.map(item => Number(item["packageid"]?item["packageid"].free:0));
        }
        if (index === 4) {
          values = data.map(item => Number(item["amount"]));
        }
        if ((index === 2 || index === 3 || index === 4) && !values.every(value => isNaN(value))) {
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
          if (index === 2 || index === 3 || index === 4) {
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
    formatMessage(row, column, cellValue) {
      if (cellValue) {
        return cellValue;
      }
      return "--"
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
          return "Applied";
        case 2:
          return "Accepted";
        case 3:
          return "Rejected";
        case 4:
          return "Manual";
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
        if (row.status === 3 || row.status === 1) {
          if (column.property === "create_at") {
            return moment(cellValue).format("DD-MM-YYYY HH:mm:ss");
          }
        } else if (row.status === 2) {
          return moment(cellValue).format("DD-MM-YYYY HH:mm:ss");
        }
      }
      return "--"
      // return moment(cellValue).format('DD-MM-YYYY')
    },
    formatTime2(cellValue) {
      // console.log("row", row)
      // console.log("column", column)
      if (cellValue) {
        return moment(cellValue).format("DD-MM-YYYY HH:mm:ss");
      }
      return "--"
      // return moment(cellValue).format('DD-MM-YYYY')
    },
    getDetail(row) {
      this.detailVisible = true;
      this.detail_data = row;
      this.detail.rechargeStatus = row.status;
      this.detail.realRecharge = row.amount;
      this.detail.bank_no = row.card_no ? row.card_no : "";
      this.detail.remark = row.remark;
      this.detail.username = row.loginname;
      this.detail.firstname = row.account ? row.account.firstname : '';
      this.detail.lastname = row.account ? row.account.lastname : '';
    },
    closeDetail() {
      this.detailVisible = false;
      this.detailVisible = false;
      this.detail.rechargeStatus = '';
      this.detail.realRecharge = '';
      this.detail.bank_no = '';
      this.detail.remark = '';
      this.detail.username = '';
      this.detail.firstname = '';
      this.detail.lastname = '';
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
        "/trade/deposit/list", {
          pageNum: vm.pageNum,
          pageSize: vm.pageSize,
          loginname: trim(vm.username),
          start_at: beginTime,
          end_at: endTime,
          // account: vm.type.value,
          type: [0, 1],
          status: 2,
          order_no: trim(vm.order_no),
          amount_start: vm.incomeRange.min,
          amount_end: vm.incomeRange.max
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
      this.type = "";
      this.status = "";
      this.order_no = "";
      this.is_test = '0';
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
  margin: 20px 0;
}

.detail-title {
  text-align: left;
  margin-bottom:20px;
  p {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #191919;
    margin-left: 30px;
    font-weight: 700;
  }
}
.dialog-table {
  width: 100%;
  border-collapse: collapse;
  border-bottom: 1px solid #e6e6e6;
}

.dialog-table td {
  font-size: 12px;
  line-height: 38px;
  height: 40px;
  text-align: center;
  color: #191919;
  border-left: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
}

.dialog-table tfoot td {
  border: none;
}

.dialog-table td.title {
  border: none;
  line-height: 38px;
  height: 40px;
  background: #f0f0f0;
  text-align: center;
  font-size: 12px;
  color: #191919;
}

.dialog-table .td-left {
  background: #f2f2f2;
}

.dialog-table .td-right {
  text-align: center;
}

</style>

