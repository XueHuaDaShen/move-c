<template>
  <div style="width:100%;height:100%;">
    <div>
      <div class="yinhangka-content">
        <el-table :data="tableData" v-loading="dataLoading" empty-text="No data" style="width: 100%">
          <el-table-column prop="bank" label="Bank" align="center" width="180">
          </el-table-column>
          <!-- <el-table-column label="开户地区" align="center" width="180">
            <template slot-scope="scope">
              <span>
                {{scope.row.province}}&nbsp;&nbsp;{{scope.row.city}}
              </span>
            </template>
          </el-table-column> -->
          <el-table-column prop="card_no" align="center" label="Bank NO." width="160">
          </el-table-column>
          <el-table-column prop="account_name" label="Account" align="center">
          </el-table-column>
          <el-table-column prop="status" width="160" align="center" label="Enabled">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" @change="handleChangeBankStatus(scope.row)" :active-value="0" :inactive-value="1" active-color="#2D996E" inactive-color="#C83A4C"></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button class="small edit" @click="getBankList">Create</el-button>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
        :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total" class="abs">
      </el-pagination>
      <el-dialog class="el-custom el-dialog__wrapper userinfo-child-dialog" top="40vh" append-to-body title="Create" :visible.sync="dialogVisible">
        <div class="body-middle">
          <div class="form">
            <el-form :model="form" :rules="rules" ref="form">
              <el-form-item label="Account name" prop="account_name">
                <el-input v-model.trim="form.account_name" placeholder="account name"></el-input>
              </el-form-item>
              <el-form-item label="Bank" prop="bank">
                <el-select clearable v-model="form.bank" placeholder="please select bank">
                  <el-option v-for="bank in bankList" :key="bank.bank" :label="bank.bank" :value="bank.bank">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Card no" prop="card_no">
                <el-input v-model.trim="form.card_no" placeholder="card no"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitCreate('form')" class="yes">Confirm</el-button>
          <el-button @click="resetForm('form')" class="no">Cancel</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment'
  import request from "@/axios/axios.js";
  import * as validator from "../../lib/utils/validator"
  export default {
    name: 'jilu',
    components: {
      tableBtn
    },
    props: {
      loginname: {
        type: String
      },
      userid: {
        type: String
      }
    },
    data() {
      var validatorAccount = (rule, value, callback) => {
        if(!value){
          return callback(new Error('card no'));
        }else if (!validator.bankCard(value)) {
          return callback(new Error('Bank card account must be 10 digits'));
        } else {
          callback();
        }
      };
      return {
        pageNum: 1,
        pageSize: 40,
        total: 0,
        pickerOptions1: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Yesterday',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() - 3600 * 1000 * 24);
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Recent 1 Week',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Recent 1 Month',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Recent 3 Months',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        tableData: [],
        dataLoading: false,
        dialogVisible: false,
        bankList: [],
        
        form: {
          account_name: '',
          bank: '',
          card_no: ''
        },
        rules: {
          account_name: [{
            required: true,
            message: 'account name',
            trigger: 'blur'
          }],
          bank: [{
            required: true,
            message: 'bank',
            trigger: 'blur'
          }],
          card_no: [{
            required: true,
            validator: validatorAccount,
            trigger: 'blur'
          }]
        },
        duration: 1500,
      }
    },
    methods: {
      //message
      message(text, type) {
        const vm = this;
        this.$message({
          message: text,
          type: type,
          duration: vm.duration,
          center: true
        })
      },
      handleSearch() {
        this.getjilu();
      },
      handleReset() {
        this.searchTime = '';
      },
      formatTime(row, column, cellValue) {
        return moment(cellValue).format('DD-MM-YYYY HH:mm:ss')
        // return moment(cellValue).format('DD-MM-YYYY')
      },
      getjilu() {
        var vm = this;
        vm.tableData = [];
        vm.dataLoading = true;
        request.http(
          'get',
          '/trade/account/list', {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            loginid: vm.userid,
          },
          (success) => {
            vm.dataLoading = false;
            // console.log('yinhangka--------', success);
            let code = success.returncode;
            let data = success.data;
            if (code === 200) {
              vm.pageNum = Number(data.page_num);
              vm.total = data.total;
              vm.tableData = data.data
              vm.showTable = true;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.dataLoading = false;
            console.log(error)
          }
        )
        // request.http('get', '/treasure/winner/list', {"page": 1,"size": 10}, 'callback', 'fallback');
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getjilu();
        // console.log(`当前页: ${val}`);
      },
      handleChangeBankStatus(row) {
        const vm = this;
        request.http(
          'post',
          '/trade/account/update', {
            id: row._id,
            status: row.status.toString(),
          },
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              vm.message('success', 'success');
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }else if(code == 301 || code == 303){
              vm.message('param error', 'error');
            }else{
              vm.message('error', 'error');
            }
          },
          (error) => {
            // vm.dataLoading = false;
            console.log(error)
          }
        )
      },
      getBankList() {
        var vm = this;
        vm.dialogVisible = true;
        vm.bankList = [];
        request.http(
          'get',
          '/bank/list',
          {
            enabled: '1'
          },
          (success) => {
            // console.log('yinhangka--------', success);
            let code = success.returncode;
            let data = success.data;
            if (code === 200) {
              vm.bankList = data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }else{
              vm.bankList = [];
            }
          },
          (error) => {
            vm.dataLoading = false;
            console.log(error)
          }
        )
      },
      submitCreate(formName) {
        var vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            request.http(
              'post',
              '/trade/account/create',
              {
                account_name: vm.form.account_name,
                bank: vm.form.bank,
                card_no: vm.form.card_no,
                loginname: vm.loginname,
                typ: '0',
              },
              (success) => {
                let code = success.returncode;
                let data = success.data;
                if (code === 200) {
                  vm.resetForm('form');
                  vm.getjilu();
                } else if (code === 101 || code === 103 || code === 106) {
                  request.loginAgain(vm)
                }
              },
              (error) => {
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
        this.dialogVisible = false;
        this.$refs[formName].resetFields();
      },
    },
    mounted() {
      this.getjilu();
    },
  }

</script>
<style lang="scss" scoped>
  .yinhangka-content {
    background-color: #fff;
    /* width: 96%; */
    margin: 10px auto 30px;
    /* box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12); */
  }

  .abs {
    position: absolute;
    bottom: 5px;
    right: 0;
    left: 0;
  }
</style>
<style lang="scss">
.userinfo-child-dialog{
  .el-dialog{
    margin-left: 450px;
    .el-dialog__body{
      overflow-y: inherit;
    }
  }
}
</style>

