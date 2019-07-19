<!-- 账户管理 -->
<template>
  <div class="bank-wrap el-custom">
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
            <label>Status：</label>
            <el-select clearable v-model="status.value" placeholder="状态" class="small">
              <el-option v-for="(item,index) in status.options" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button @click="handleSearch" size="medium" class="small yes">Search</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">Reset</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="content-middle">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button @click="createUsercount" size="medium" class="edit">Create</el-button>
        </div>
      </div>
    </div>
    <div class="data-table el-custom" v-loading="loading">
      <el-table :data="usercountDataList" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        @cell-mouse-enter="mouseOver">
        <el-table-column align="center" label="Bank Name" prop="bank">
        </el-table-column>
        <el-table-column align="center" label="Account Name" prop="account_name">
        </el-table-column>
        <el-table-column align="center" label="Account Number" prop="card_no">
        </el-table-column>
        <el-table-column label="enable/disable" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="enableChange(scope.row.status)" :active-value="elswitch.activeValue"
              :inactive-value="elswitch.inactiveValue" active-color="#2D996E" inactive-color="#C83A4C">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="Action">
          <template slot-scope="scope">
            <el-button @click="editUsercount(scope.row)" size="small" class="edit small">Edit</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :total="total" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
    <!-- 新增账户 START -->
    <el-dialog title="Create Account" :before-close="closeCreate" :visible.sync="createDialog">
      <div class="body-middle">
        <el-form :model="createForm" :rules="rules" ref="createForm" class="demo-ruleForm">
          <el-form-item label="Bank Name：" prop="bank">
            <el-input type="text" v-model="createForm.bank"></el-input>
          </el-form-item>
          <el-form-item label="Account Number：" prop="card_no">
            <el-input type="text" v-model.trim="createForm.card_no"></el-input>
          </el-form-item>
          <el-form-item label="Account Name：" prop="account_name">
            <el-input type="text" v-model.trim="createForm.account_name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('createForm')" class="yes" :loading="createLoading">Confirm</el-button>
        <el-button @click="resetForm('createForm')" class="no">Cancel</el-button>
      </div>
    </el-dialog>
    <!-- 新增账户 END -->
    <!-- 编辑账户 START -->
    <el-dialog title="Edit Account" :before-close="closeUpdate" :visible.sync="updateDialog">
      <div class="body-middle">
        <el-form :model="updateForm" :rules="rules" ref="updateForm" class="demo-ruleForm">
          <el-form-item label="Bank Name：" prop="bank">
            <el-input type="text" v-model="updateForm.bank"></el-input>
          </el-form-item>
          <el-form-item label="Account Number：" prop="card_no">
            <el-input type="text" v-model.trim="updateForm.card_no"></el-input>
          </el-form-item>
          <el-form-item label="Account Name：" prop="account_name">
            <el-input type="text" v-model.trim="updateForm.account_name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button @click="submitForm('updateForm')" class="yes" :loading="updateLoading">Confirm</el-button>
          <el-button @click="resetForm('updateForm')" class="no">Cancel</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 编辑账户 END -->
  </div>
</template>
<script>
  import request from "@/axios/axios.js";
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo'
  import tableBtn from '../littleStyle/tableBtn.vue'
  import moment from 'moment'
  import * as validator from '@/lib/utils/validator';
  export default {
    name: 'paymentBank',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        createLoading: false,
        updateLoading: false,
        titleName: '',
        routerArr: [],
        loading: false,
        opText: '',
        pageNum: 1,
        pageSize: 40,
        total: 0,
        userid: '',
        loginname: '',
        usercountDataList: [],
        createForm: {
          card_no: '',
          account_name: '',
          bank: ''
        },
        updateForm: {
          card_no: '',
          account_name: '',
          bank: ''
        },
        rules: {
          account_name: [{
            required: true,
            message: 'Account name',
            trigger: 'blur'
          }],
          card_no: [{
            required: true,
            message: 'Account number',
            trigger: 'blur'
          }],
          bank: [{
            required: true,
            message: 'Bank name',
            trigger: 'blur',
          }],
        },
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        createDialog: false,
        updateDialog: false,
        rowKey: "",
        elswitch: {
          activeValue: 0,
          inactiveValue: 1
        },
        status: {
          value: '',
          options: [{
              label: 'enabled',
              value: 0
            },
            {
              label: 'disabled',
              value: 1
            }
          ]
        },
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'paymentBank');
      this.routerArr = data.routerArr;
      this.titleName = data.titleName;
      this.getUsercountList()
      this.getGroupList()
    },
    methods: {
      formatBranch(row, column, cellValue) {
        if (cellValue) {
          return cellValue;
        }
        return '--';
      },
      //获取银行卡列表
      handleReset() {
        this.status.value = '';
      },
      handleSearch() {
        this.pageNum = 1;
        this.getUsercountList();
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
      mouseOver(row, column, cell, event) {
        this.rowKey = row._id;
      },
      enableChange(value) {
        // console.log("value", value);
        this.modifiedEnabled("status", value.toString(), this.rowKey);
      },
      // 玩法修改
      modifiedEnabled(key, value, id) {
        let self = this,
          data = {};
        let url = "/trade/account/update";
        data["id"] = id;
        data[key] = value;
        request.http(
          "post",
          url,
          data,
          success => {
            self.loading = false;
            let code = success.returncode;
            if (code === 200) {
              self.message("修改成功", "success");
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(self);
            }
          },
          error => {
            self.loading = false;
            self.message("修改失败", "error");
          }
        );
      },
      success() {
        const vm = this
        this.$message({
          message: "Load Success",
          type: "success",
          duration: vm.duration,
          center: true
        })
      },
      error() {
        const vm = this
        this.$message({
          message: "Load Failure",
          type: "error",
          duration: vm.duration,
          center: true
        })
      },
      message(text, type) {
        const vm = this
        this.$message({
          message: text,
          type: type,
          duration: vm.duration,
          center: true
        })
      },
      isStatusFn(row, column, cellValue) {
        // console.log(typeof cellValue)
        switch (cellValue) {
          case 0:
            return "Enabled";
          case 1:
            return "Disabled";
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
        }
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getUsercountList();
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getUsercountList()
        // console.log(`当前页: ${val}`)
      },
      getUserInfoFn(row) {
        // this.dialog = true;
        // this.userid = row._id;
        // this.loginname = row.name;
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
      editUsercount(row) {
        this.updateDialog = true;
        this.opText = "编辑";
        for (let i in this.updateForm) {
          this.updateForm[i] = row[i];
        }
        this.updateForm.id = row._id;
      },
      createUsercount() {
        this.createDialog = true;
        this.opText = "新增";
      },
      // 获取层级
      getGroupList() {
        let vm = this;
        vm.loading = true;
        let url = "/group/list";
        request.http(
          "get",
          url, {
            PageSize: 1000
          },
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
                let options = success.data;
                if (options.length != 0) {
                  /* for (let i = 0; i < options.length; i++) {
                    let typeArr = new Array();
                    let option = options[i];
                    typeArr.push(option.type);
                    option.type = typeArr;
                  } */
                  let optionsNew = [];
                  for (let i = 0; i < options.length; i++) {
                    let newOption = {};
                    newOption["name"] = options[i].name;
                    newOption["_id"] = options[i]._id;
                    optionsNew.push(newOption);
                  }
                  vm.createForm.group.options = optionsNew;
                  vm.updateForm.group.options = optionsNew;
                }
              } else {
                vm.loading = false;
              }
            }
          },
          error => {
            vm.loading = false;
          }
        );
      },
      createFn() {
        const vm = this;
        let data = {};
        data.bank = vm.createForm.bank;
        data.card_no = vm.createForm.card_no;
        data.account_name = vm.createForm.account_name;
        data.type = '1',
        vm.createLoading = true;
        request.http(
          "post",
          "/trade/account/create",
          data,
          success => {
            vm.createLoading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.resetForm("createForm");
              vm.getUsercountList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else {
              alert(success.returncode);
            }
          },
          error => {
            vm.createLoading = false;
            vm.error();
            console.log(error);
          }
        )
      },
      updateFn() {
        const vm = this;
        let data = {};
        data.id = vm.updateForm.id;
        data.bank = vm.updateForm.bank;
        data.card_no = vm.updateForm.card_no;
        data.account_name = vm.updateForm.account_name;
        vm.updateLoading = true;
        request.http(
          "post",
          "/trade/account/update",
          data,
          success => {
            vm.updateLoading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.resetForm("updateForm");
              vm.getUsercountList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else {
              alert(success.returncode);
            }
          },
          error => {
            vm.updateLoading = false;
            vm.error();
            console.log(error);
          }
        )
      },
      submitForm(formName) {
        const vm = this;
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (formName === "createForm") {
              vm.createFn();
            } else if (formName === "updateForm") {
              vm.updateFn();
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        })
      },
      resetForm(formName) {
        this.updateDialog = false;
        this.createDialog = false;
        this.$refs[formName].resetFields();
      },
      getUsercountList() {
        const vm = this;
        request.http(
          "get",
          "/trade/account/list", {
            page_num: vm.pageNum,
            page_size: vm.pageSize,
            status: vm.status.value
          },
          success => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.usercountDataList = success.data.data;
              vm.pageNum = Number(success.data.PageNum);
              vm.total = success.data.count;
              vm.success();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            }
          },
          error => {
            vm.loading = false
            vm.error()
            console.log(error)
          }
        )
      },
      closeCreate() {
        this.createDialog = false
        this.$refs["createForm"].resetFields()
      },
      closeUpdate() {
        this.updateDialog = false
        this.$refs["updateForm"].resetFields()
      }
    }
  }

</script>
<style>
  /* @import "../../publicCss/header.css"; */

  .bank-wrap .el-form-item__content {
    text-align: left;
  }

  .bank-wrap {
    /* width: 70%; */
  }

</style>
