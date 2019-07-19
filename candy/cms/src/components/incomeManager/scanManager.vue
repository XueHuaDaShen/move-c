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
          <!-- <div class="search-inner-wrap">
            <label>用户名：</label>
            <el-input clearable v-model.trim="username" placeholder="姓名" style="width:114px"></el-input>
          </div> -->
          <div class="search-inner-wrap">
            <label>入款渠道：</label>
            <el-select clearable v-model="type.value" placeholder="入款渠道：" class="small">
              <el-option v-for="item in type.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>状态：</label>
            <el-select clearable v-model="status" placeholder="请选择状态" class="small">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>提交时间：</label>
            <el-date-picker format="dd-MM-yyyy HH:mm:ss" v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="-"
              start-placeholder="begin" end-placeholder="end" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
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
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="rechargeListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="450" :show-summary="true" sum-text="Total" :summary-method="getSummaries">
        <el-table-column align="center" label="充值用户名" width="126">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleSkip('rechargeLog',scope.row)">{{scope.row.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="user_name" label="支付宝/微信用户名">
        </el-table-column>
        <el-table-column align="center" prop="type" :formatter="isTypeFn" label="充值类型">
        </el-table-column>
        <el-table-column align="center" prop="money" width="110" label="金额" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="pay_time" :formatter="formatTime" label="支付时间(毫秒)">
        </el-table-column>
        <el-table-column align="center" prop="status" :formatter="isStatusFn" label="状态">
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status===0" @click="toRechargeFn(scope.row)" class="yes small">充值成功</el-button>
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
  </div>
</template>
<script>
  import request from "@/axios/axios.js";
  import DialogUserInfo from "../dialog-user-info/DialogUserInfo";
  import tableBtn from "../littleStyle/tableBtn.vue";
  import moment from "moment";
  import {
    price,
    trim
  } from '@/lib/utils/validator';
  export default {
    name: "scanManager",
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      var validateRecharge = (rule, value, callback) => {
        if (!price(value)) {
          callback(new Error("金额必须大于0"));
        } else {
          callback();
        }
      };
      return {
        pickerDefaultTime: ['00:00:00', '23:59:59'],
        index1: 0,
        index2: 0,
        titleName: '',
        routerArr: [],
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        rechargeListData: [],
        username: "",
        searchTime: "",
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
                picker.$emit("pick", [start, end]);
              }
            }, {
              text: "Today",
              onClick(picker) {
                const end = new Date();
                const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime());
                end.setTime(new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1));
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
                picker.$emit("pick", [firstdate, enddate]);
              }
            },
            {
              text: "Recent 1 Week",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "Recent 1 Month",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "Recent 3 Months",
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() + 24 * 60 * 60 * 1000 - 1);
                const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        statusArr: [{
            value: "",
            label: "全部"
          },
          {
            value: "1",
            label: "充值成功"
          },
          {
            value: "0",
            label: "充值失败"
          }
        ],
        type: {
          value: "",
          options: [{
              value: "",
              label: "全部"
            }, {
              value: "weichat",
              label: "微信"
            },
            {
              value: "alipay",
              label: "支付宝"
            },
          ],
        },
        status: "",
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        dialogFormVisible: false,
        form: {
          rechargeStatus: "",
          realRecharge: "",
          message: '',
          bank_no: "",
          realName: "",
        },
        detail: {
          rechargeStatus: "",
          realRecharge: "",
          message: '',
          bank_no: "",
          realName: "",
        },
        rules: {
          rechargeStatus: [{
            required: true,
            message: "请选择状态",
            trigger: "change"
          }],
          realRecharge: [{
              required: true,
              message: "请输入金额",
              trigger: "change"
            },
            {
              trigger: "blur",
              validator: validateRecharge
            }
          ],
          message: [{
            required: true,
            message: "请输入备注",
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
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'scanManager');
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
          const values = data.map(item => Number(item[column.property]));
          if (index === 3 && !values.every(value => isNaN(value))) {
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
            if (index === 3) {
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
      handleSkip(name, row) {
        let menus = localStorage.getItem('cms-user-menu');
        let menusjson = JSON.parse(menus);
        const vm = this;
        let index1, index2;
        let selected = false;
        for (let i = 0; i < menusjson.length; i++) {
          index1 = i;
          let f_obj = menusjson[i];
          for (let j = 0; j < f_obj.child.length; j++) {
            index2 = j;
            let san_ = f_obj.child[j].child;
            for (let h = 0; h < san_.length; h++) {
              let url = san_[h].url;
              if (name === url) {
                selected = true;
                break;
              }
            }
            if (selected) {
              break;
            }
          }
          if (selected) {
            break;
          }
        }
        const {
          href
        } = this.$router.resolve({
          name: name,
          query: {
            param: row.recharge && row.recharge.order_no,
            index1: index1,
            index2: index2
          }
        })
        window.open(href, '_blank')
      },
      isStatusFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return "充值失败";
          case 1:
            return "充值成功";
          default:
            return "--"
        }
      },
      isTypeFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 'weichat':
            return "微信";
          case 'alipay':
            return "支付宝";
          default:
            return "--"
        }
      },
      formatTestUser(row, column, cellValue) {
        let t = '';
        if (cellValue === 1) {
          t = '是'
        } else {
          t = '否'
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
      formatTime(row, column, cellValue) {
        if (cellValue) {
          return moment(cellValue).format("DD-MM-YYYY HH:mm:ss");
        }
        return "--"
      },
      toRechargeFn(row) {
        const vm = this;
        this.$alert('Are you sure you want to continue this operation?', 'Reminder', {
          showCancelButton: true,
          center: true,
          confirmButtonText: '确定',
          callback: action => {
            if (action === 'confirm') {
              request.http(
                'post',
                '/collectpay/update', {
                  id: row._id,
                  status: '1'
                },
                (success) => {
                  let code = success.returncode;
                  if (code === 200) {
                    vm.getRechargeLotList();
                  } else if (code === 101 || code === 103 || code === 106) {
                    request.loginAgain(vm)
                  } else {
                    alert(success.returncode)
                  }
                },
                (error) => {
                  vm.error();
                  console.log(error)
                }
              )
            }
          }
        });
      },
      getRechargeLotList() {
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
          "/collectpay/list", {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            startTime: beginTime,
            endTime: endTime,
            status: vm.status,
            type: vm.type.value,
            // is_test: vm.is_test,
          },
          success => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.rechargeListData = success.data;
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
              vm.message("请求成功", "success");
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
        this.is_test = '0';
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
