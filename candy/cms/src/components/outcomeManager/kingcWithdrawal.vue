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
            <label>User Name：</label>
            <el-input clearable v-model.trim="username" placeholder="user name" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>Withdrawal ID：</label>
            <el-input clearable v-model.trim="order_no" placeholder="withdrawal id" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>Status：</label>
            <el-select clearable v-model="status" placeholder="please select" class="small">
              <el-option v-for="item in statusArr" v-if="item.value == 1 || item.value == 2 || item.value == 7" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Amount：</label>
            <el-input clearable v-model.trim="outcomeRange.min" placeholder="min" style="width:114px"></el-input>
            <span>--</span>
            <el-input clearable v-model.trim="outcomeRange.max" placeholder="max" style="width:114px"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>Period：</label>
            <el-date-picker format="dd-MM-yyyy HH:mm:ss" v-model="searchTime" type="daterange" align="right" unlink-panels range-separator="-"
              start-placeholder="begin" end-placeholder="end" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
            </el-date-picker>
          </div>
          <!-- <div class="search-inner-wrap">
            <label>测试账号：</label>
            <el-select clearable v-model="is_test" placeholder="测试账号：" class="small">
              <el-option v-for="item in testUser" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div> -->
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="yes small">Search</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="no small">Reset</el-button>
          </div>
          <!-- <tableBtn :text="'搜索'" :plain="false" :btnType="'success'" :func="handleSearch"></tableBtn>
          <tableBtn :text="'重置'" :func="handleReset"></tableBtn> -->
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="withdrawListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="450" :show-summary="true" sum-text="Total" :summary-method="getSummaries">
        <el-table-column align="center" prop="order_no" label="Withdrawal ID">
        </el-table-column>
        <el-table-column align="center" label="User Name" width="126">
          <template slot-scope="scope">
            <el-button type="text" @click="getUserInfoFn(scope.row)">{{scope.row.loginname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="firstname" width="110" label="First Name">
        </el-table-column>
        <el-table-column align="center" prop="cash_apply" width="110" label="Account" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="Submit time">
        </el-table-column>
        <el-table-column align="center" label="Withdrawal time">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.status === 1">--</span> -->
            <span>{{scope.row.withdraw_at | filterTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="card_no" label="Withdraw To">
        </el-table-column>
        <el-table-column align="center" prop="status" :formatter="isStatusFn" label="Status">
        </el-table-column>
        <!-- <el-table-column align="center" prop="is_test" :formatter="formatTestUser" width="80" label="测试账号">
        </el-table-column>
        <el-table-column align="center" prop="cash_recharged" label="到账金额">
        </el-table-column> -->
        <el-table-column align="center" prop="status" fixed="right" label="Detail" width="100">
          <template slot-scope="scope">
            <div class="flex-row">
              <el-button v-if="scope.row.status==1"
                @click="toWithdrawFn(scope.row)" class="small yes">Audit</el-button>
              <el-button @click="toWithdrawDetail(scope.row)" class="small edit" v-if="scope.row.status!=1">Detail</el-button>
            </div>
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
    <!-- 出款审核 dialog start -->
    <el-dialog :before-close="handleClose" title="Withdrawal Audit" :center="false" :visible.sync="dialogFormVisible">
      <div class="detail">
        <span>Detail</span>
        <p>
          <span class="exp">User name：</span>
          <span>{{form.loginname}}</span>
        </p>
        <p>
          <span class="exp">Account name：</span>
          <span>{{form.realname}}</span>
        </p>
        <p>
          <span class="exp">Bank name：</span>
          <span>{{form.bank}}</span>
        </p>
        <p>
          <span class="exp">Account ID：</span>
          <span>{{form.card_no}}</span>
        </p>
        <p>
          <span class="exp">Amount：</span>
          <span>{{form.cash_apply}}</span>
        </p>
        <p>
          <span class="exp">Remark：</span>
          <span>{{form.message}}</span>
        </p>
      </div>
      <div class="entrance">
        <span>More</span>
        <ul class="clearfix">
          <li>
            <!-- <router-link :to="{name: 'userList', query: { param: form.loginname,index1:0,index2:3}}" target="_blank">
              <el-button class="small edit">会员管理</el-button>
            </router-link> -->
            <a @click="handleSkip('userList')">
              <el-button class="small edit">Memeber</el-button>
            </a>
          </li>
          <li>
            <!-- <router-link :to="{name: 'betsLog', query: { param: form.loginname}}" target="_blank">
              <el-button class="small edit">投注记录</el-button>
            </router-link> -->
            <a @click="handleSkip('betsLog')">
              <el-button class="small edit">Lottery History</el-button>
            </a>
          </li>
          <li>
            <a @click="handleSkip('accountChange')">
              <el-button class="small edit">Account change</el-button>
            </a>
            <!-- <router-link :to="{name: 'accountChange', query: { param: form.loginname}}" target="_blank">
              <el-button class="small edit">帐变记录</el-button>
            </router-link> -->
          </li>
          <li>
            <a @click="handleSkip('userLog')">
              <el-button class="small edit">User Log</el-button>
            </a>
            <!-- <router-link :to="{name: 'userLog', query: { param: form.loginname}}" target="_blank">
              <el-button class="small edit">登录记录</el-button>
            </router-link> -->
          </li>
          <!-- <li>
            <a @click="handleSkip('stakecountList')">
              <el-button class="small edit">打码量记录</el-button>
            </a>
          </li> -->
        </ul>
      </div>
      <div class="body-middle" style="border: 1px solid #eee;margin: 0 20px;margin-bottom:20px;">
        <el-form ref="form" :rules="rules" :model="form">
          <el-form-item label="Status：" style="justify-content:flex-start">
            <span>{{getStatus(form.status)}}</span>
          </el-form-item>
          <el-form-item label="Audit result：" prop="statusSelected" style="justify-content:flex-start">
            <el-select v-model="form.statusSelected" placeholder="please select status">
              <el-option v-for="option in form.statusOptions" :key="option.value" :label="option.text" :value="option.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Remark：" prop="textarea" style="justify-content:flex-start">
            <el-input placeholder="remark" v-model.trim="form.textarea.value">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')" class="no" :loading="checkLoading">Confirm</el-button>
        <el-button @click="resetForm('form')" class="yes">Cancel</el-button>
      </div>
    </el-dialog>
    <!-- 出款审核 dialog end -->
    <!-- 出款详情 dialog start -->
    <el-dialog :before-close="handledetailClose" title="Audit result detail" :center="false" :visible.sync="detailDialogVisible">
      <div class="body-middle">
        <div class="detail-title">
          <p>Audit result：{{getStatus(detailForm.status)}}</p>
        </div>
        <table class="dialog-table" style="margin-top:30px;">
          <tr>
            <td class="title">Status</td>
            <td class="title">Auditor</td>
            <td class="title">Remark</td>
            <td class="title">Audit At</td>
          </tr>
          <tr>
            <td align="left" class="td-right">
              {{getStatus(detailForm.status)}}
            </td>
            <td align="left" class="td-right">
              {{detailForm.auditor1||'--'}}
            </td>
            <td align="left" class="td-right">
              {{detailForm.message||"--"}}
            </td>
            <td align="left" class="td-right">
              {{formatTime2(detailForm.withdraw_at)}}
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tuidan()" class="no" v-if="detailForm.status === 5" :loading="tuidanLoading">Reback</el-button>
        <el-button type="primary" @click="detailDialogVisible = false" class="yes">OK</el-button>
      </div>
    </el-dialog>
    <!-- 出款详情 dialog end -->
  </div>
</template>
<script>
  import request from "@/axios/axios.js";
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment'
  import {
    trim
  } from '@/lib/utils/validator';
  export default {
    name: 'kingcWithdrawal',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        pickerDefaultTime: ['00:00:00', '23:59:59'],
        index1: 0,
        index2: 0,
        tuidanLoading: false,
        checkLoading: false,
        titleName: '',
        routerArr: [],
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        withdrawListData: [],
        userid: '',
        loginname: '',
        username: '',
        searchTime: '',
        outcomeRange: {
          min: "",
          max: ""
        },
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
        typeArr: [{
          value: '1',
          label: '微信'
        }, {
          value: '2',
          label: '支付宝'
        }, {
          value: '3',
          label: '银行卡转账'
        }],
        statusArr: [{
            value: '1',
            label: 'Applied'
          }, {
            value: '2',
            label: 'Accepted'
          }, {
            value: '3',
            label: '二审'
          }, {
            value: '4',
            label: '三审'
          }, {
            value: '5',
            label: '出账'
          },
          {
            value: '6',
            label: '银行退单'
          },
          {
            value: '7',
            label: 'Rejected'
          },
          // {
          //   value: '8',
          //   label: '到账'
          // }
        ],
        status: '',
        order_no: '',
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        dialogFormVisible: false,
        // 出款审核form
        form: {
          // 出款状态 span
          status: '',
          // 出款状态select options
          statusOptions: [{
              text: 'Accepted',
              value: 2
            },
            {
              text: 'Rejected',
              value: 7
            },
          ],
          // 出款状态select selected
          statusSelected: '',
          // 备注
          textarea: {
            key: 'message',
            value: ''
          },
          // 用户名
          loginname: '',
          account: '',
          bank: "",
          card_no: "",
          cash_apply: "",
          message: '',
          realname: ''
        },
        rules: {
          statusSelected: [{
            required: true,
            message: 'please select status',
            trigger: 'change'
          }],
          textarea: [{
            required: true,
            message: 'please input remark',
            trigger: 'change'
          }]
        },
        currId: '',
        detailDialogVisible: false,
        // 出款详情form
        detailForm: {},
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
      }
    },
    filters: {
      filterTime(value) {
        if (value) {
          return moment(value).format('DD-MM-YYYY HH:mm:ss')
        }
        return "--"
      },
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'kingcWithdrawal');
      this.routerArr = data.routerArr;
      this.titleName = data.titleName;
      this.getWithdrawLotList();
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
      handleSkip(name) {
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
            param: vm.form.loginname,
            index1: index1,
            index2: index2
          }
        })
        window.open(href, '_blank')
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
      success() {
        const vm = this;
        this.$message({
          message: 'Load Success',
          type: 'success',
          duration: vm.duration,
          center: true
        })
      },
      error() {
        const vm = this;
        this.$message({
          message: 'Load Failure',
          type: 'error',
          duration: vm.duration,
          center: true
        })
      },
      isStatusFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return '默认';
          case 1:
            return 'Applied';
          case 2:
            return 'Accepted';
          case 3:
            return '二审通过';
          case 4:
            return '终审通过';
          case 5:
            return '出账';
          case 6:
            return '银行退单';
          case 7:
            return 'Rejected';
          default:
            return '--';
        }
      },
      getStatus(status) {
        // console.log(typeof cellValue)
        switch (status) {
          case 0:
            return '默认';
          case 1:
            return 'Applied';
          case 2:
            return 'Accepted';
          case 3:
            return '二审通过';
          case 4:
            return '终审通过';
          case 5:
            return '出账';
          case 6:
            return '银行退单';
          case 7:
            return 'Rejected';
          default:
            return '--';
        }
      },
      getTime(time) {
        return moment(time).format('DD-MM-YYYY HH:mm:ss')
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
        this.getWithdrawLotList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getWithdrawLotList();
        // console.log(`当前页: ${val}`);
      },
      getUserInfoFn(row) {
        this.dialog = true;
        this.userid = row.loginid;
        this.loginname = row.loginname;
      },
      handleCloseDialog(val) {
        this.dialog = val;
      },
      handleDialogShow(val) {
        this.dialogIsShow = val;
      },
      formatTime(row, column, cellValue) {
        if (cellValue) {
          return moment(cellValue).format('DD-MM-YYYY HH:mm:ss')
        }
        return "--"
      },
      formatTime2(cellValue) {
        if (cellValue) {
          return moment(cellValue).format('DD-MM-YYYY HH:mm:ss')
        }
        return "--"
      },
      submitForm(formName) {
        const vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              id: vm.currId,
              status: vm.form.statusSelected,
            }
            data[vm.form.textarea.key] = vm.form.textarea.value
            let url = '/trade/withdraw/update'
            vm.checkLoading = true;
            request.http(
              'post', url, data,
              (success) => {
                vm.checkLoading = false;
                let code = success.returncode;
                if (code === 200) {
                  vm.dialogFormVisible = false;
                  vm.resetForm('form');
                  vm.getWithdrawLotList();
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm)
                } else {
                  alert(success.returncode)
                }
              },
              (error) => {
                vm.checkLoading = false;
                vm.resetForm('form');
                vm.error();
                console.log(error)
              }
            )
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      tuidan() {
        const vm = this;
        let data = {
          id: vm.currId,
          status: 6,
          message: "银行退单"
        }
        let url = '/trade/withdraw/update'
        vm.tuidanLoading = true;
        request.http(
          'post', url, data,
          (success) => {
            vm.tuidanLoading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.dialogFormVisible = false;
              vm.getWithdrawLotList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else {
              alert(success.returncode)
            }
          },
          (error) => {
            vm.tuidanLoading = false;
            vm.resetForm('form');
            vm.error();
            console.log(error)
          }
        )
      },
      resetForm(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].resetFields();
        this.form.textarea = {
          key: "message",
          value: ""
        }
      },
      // open 出款审核dialog
      toWithdrawFn(row) {
        const vm = this;
        this.dialogFormVisible = true;
        this.form.status = row.status;
        this.currId = row._id;
        this.form.loginname = row.loginname;
        this.form.realname = row.realname;
        this.form.account = row.loginname;
        this.form.bank = row.bank;
        this.form.card_no = row.card_no;
        this.form.cash_apply = row.cash_apply;
        this.form.message = row.message;
      },
      // open 出款详情 dialog
      toWithdrawDetail(row) {
        // console.log(row)
        this.detailDialogVisible = true;
        this.detailForm = row;
        this.currId = row._id;
      },
      getWithdrawLotList() {
        const vm = this;
        let beginTime = '',
          endTime = '';
        if (vm.searchTime.toString() !== '') {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
        vm.loading = true;
        request.http(
          'get',
          '/trade/withdraw/apply/list', {
            superiorname: 'KINGC',
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            loginname: trim(vm.username),
            beginTime: beginTime,
            endTime: endTime,
            // type: vm.type,
            status: vm.status,
            order_no: trim(vm.order_no),
            // is_test: vm.is_test,
            begin_cash_apply: vm.outcomeRange.min,
            end_cash_apply: vm.outcomeRange.max
          },
          (success) => {
            vm.loading = false;
            // console.log('withdrawLotList--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.withdrawListData = success.data;
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
              vm.success();
            } else if (code === 301) {
              vm.withdrawListData = [];
              vm.pageNum = 1;
              vm.total = 0;
              vm.success();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.loading = false;
            vm.error();
            console.log(error)
          }
        )
      },
      handleReset() {
        this.username = '';
        this.searchTime = '';
        this.status = '';
        this.order_no = '';
        this.is_test = '0';
        this.outcomeRange.min = null;
        this.outcomeRange.max = null;
      },
      handleSearch() {
        this.pageNum = 1;
        this.getWithdrawLotList();
      },
      handleClose() {
        this.resetForm('form')
      },
      handledetailClose() {
        this.detailDialogVisible = false;
      }
    },
    watch: {}
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

  .rechargeLot-wrap .el-form-item__content {
    text-align: left;
  }

  .rechargeLot-wrap .flex-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .rechargeLot-wrap .flex-row>button {
    flex: 1;
    padding: 0;
  }

</style>

<style scoped lang="scss">
  li {
    list-style: none;
  }

  .cell {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .detail-title {
    text-align: left;

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
