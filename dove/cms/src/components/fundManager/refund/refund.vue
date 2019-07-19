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
            <label>Status：</label>
            <el-select clearable v-model="status" placeholder="please select" class="small">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Period：</label>
            <el-date-picker format="MM-yyyy" placeholder="please select month" v-model="searchTime" type="month" align="right">
            </el-date-picker>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="yes small">Search</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="no small">Reset</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="withdrawListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="500" :show-summary="true" sum-text="Total" :summary-method="getSummaries">
        <el-table-column align="center" label="User Name" width="126">
          <template slot-scope="scope">
            <el-button type="text" @click="getUserInfoFn(scope.row)">{{scope.row.loginid ? scope.row.loginid.loginname : '--'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="month" width="110" label="Month" :formatter="formatTime2">
        </el-table-column>
        <el-table-column align="center" prop="bet_profit" label="Game Win/Loss" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="gift" label="Gift" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="profit" label="Total Win/Loss" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="refund" label="Refund" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="withdrawal" label="Withdrawal" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" prop="update_at" label="Update Time" :formatter="formatTime">
        </el-table-column>
        <el-table-column align="center" prop="status" fixed="right" label="Detail">
          <template slot-scope="scope">
            <div class="flex-row" v-if="scope.row.status==0">
              <el-button @click="toWithdrawFn(scope.row)" class="small yes">Audit</el-button>
            </div>
            <div style="text-align:center;" v-else>
              {{getStatus(scope.row.status)}}
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
    <el-dialog :before-close="handleClose" title="Audit" :center="false" :visible.sync="dialogFormVisible">
      <div class="detail">
        <span>Detail</span>
        <p>
          <span class="exp">User Name：</span>
          <span>{{form.loginname}}</span>
        </p>
        <p>
          <span class="exp">First Name：</span>
          <span>{{form.firstname}}</span>
        </p>
        <p>
          <span class="exp">Last Name：</span>
          <span>{{form.lastname}}</span>
        </p>
        <p>
          <span class="exp">Bank Name：</span>
          <span>{{form.bank}}</span>
        </p>
        <p>
          <span class="exp">Bank Account：</span>
          <span>{{form.card_no}}</span>
        </p>
        <p>
          <span class="exp">Amount：</span>
          <span>{{form.cash_apply}}</span>
        </p>
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
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')" class="yes" :loading="checkLoading">Confirm</el-button>
        <el-button @click="resetForm('form')" class="no">Cancel</el-button>
      </div>
    </el-dialog>
    <!-- 出款审核 dialog end -->
  </div>
</template>
<script>
import request from "@/axios/axios.js";
import DialogUserInfo from '@/components/dialog-user-info/DialogUserInfo';
import moment from 'moment'
import {
  trim
} from '@/lib/utils/validator';
export default {
  name: 'refund',
  components: {
    DialogUserInfo
  },
  data() {
    return {
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
      statusArr: [
        {
          value: '1',
          label: 'Default'
        },
        {
          value: '0',
          label: 'Applied'
        }, {
          value: '2',
          label: 'Accepted'
        }
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
          }
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
        accountName: '',
        firstname: '',
        lastname: '',
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
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'refund');
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
        if ((index === 2 || index === 3 || index === 4 || index === 5 || index === 6) && !values.every(value => isNaN(value))) {
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
          if (index === 2 || index === 3 || index === 4 || index === 5 || index === 6) {
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
        case 1:
          return 'Default';
        case 0:
          return 'Applied';
        case 2:
          return 'Accepted';
        default:
          return '--';
      }
    },
    getStatus(status) {
      // console.log(typeof cellValue)
      switch (status) {
        case 1:
          return 'Default';
        case 0:
          return 'Applied';
        case 2:
          return 'Accepted';
        default:
          return '--';
      }
    },
    getTime(time) {
      return moment(time).format('DD-MM-YYYY HH:mm:ss')
    },
    formatMessage(row, column, cellValue) {
      if (cellValue) {
        return cellValue
      }
      return '--';
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
      this.userid = row.loginid._id;
      this.loginname = row.loginid.loginname;
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
    formatTime2(row, column, cellValue) {
      if (cellValue) {
        return moment(cellValue).format('MM-YYYY')
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
          // data[vm.form.textarea.key] = vm.form.textarea.value
          // data.remark = vm.form.textarea.value
          let url = '/agency/refund/update'
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
      this.form.loginname = row.loginid.loginname;
      this.form.accountName = row.account.firstname + row.account.lastname;
      this.form.firstname = row.account.firstname;
      this.form.lastname = row.account.lastname;
      this.form.account = row.loginname;
      this.form.bank = row.account.bank;
      this.form.card_no = row.account.card_no;
      this.form.cash_apply = row.refund;
      // this.form.message = row.remark;
    },
    getWithdrawLotList() {
      const vm = this;
      vm.loading = true;
      let time;
      if(vm.searchTime){
        time = moment(vm.searchTime).format('YYYY-MM')
      }else{
        time = '';
      }
      request.http(
        'get',
        '/agency/refund/list', {
          pageNum: vm.pageNum,
          pageSize: vm.pageSize,
          loginname: trim(vm.username),
          time: time,
          status: vm.status,
        },
        (success) => {
          vm.loading = false;
          // console.log('withdrawLotList--------', success);
          let code = success.returncode;
          if (code === 200) {
            vm.withdrawListData = success.data;
            vm.pageNum = Number(success.pageNum);
            vm.total = success.total;
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
