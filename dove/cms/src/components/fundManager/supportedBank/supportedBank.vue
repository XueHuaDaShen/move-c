<!-- 银行管理 -->
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
        <!-- <div class="search-content">
          <div class="search-inner-wrap">
            <label>Bank Name：</label>
            <el-input clearable v-model.trim="bank" placeholder="bank name" style="width:114px"></el-input>
          </div>
          <div class="search-inner-wrap">
            <el-button @click="handleSearch" size="medium" class="small yes">Search</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">Reset</el-button>
          </div>
        </div> -->
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
      <el-table :data="bankDataList" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;" max-height="500"
        @cell-mouse-enter="mouseOver">
        <el-table-column align="center" label="Bank Name" prop="name">
        </el-table-column>
        <el-table-column align="center" label="Create At" prop="create_at">
        </el-table-column>
        <el-table-column label="Enable/Disable" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabled" @change="enableChange(scope.row.enabled)" :active-value="elswitch.activeValue"
              :inactive-value="elswitch.inactiveValue" active-color="#2D996E" inactive-color="#C83A4C">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="Edit">
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
    <!-- Create START -->
    <el-dialog title="Create" :before-close="closeCreate" :visible.sync="createDialog">
      <div class="body-middle">
        <el-form :model="createForm" :rules="rules" ref="createForm" class="demo-ruleForm">
          <el-form-item label="Bank Name：" prop="name">
            <el-input type="text" v-model="createForm.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('createForm')" class="yes" :loading="createLoading">Confirm</el-button>
        <el-button @click="resetForm('createForm')" class="no">Cancel</el-button>
      </div>
    </el-dialog>
    <!-- Create END -->
    <!-- 编辑银行 START -->
    <el-dialog title="Edit" :before-close="closeUpdate" :visible.sync="updateDialog">
      <div class="body-middle">
        <el-form :model="updateForm" :rules="rules" ref="updateForm" class="demo-ruleForm">
          <el-form-item label="Bank Name：" prop="name">
            <el-input type="text" v-model="updateForm.name"></el-input>
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
    <!-- 编辑银行 END -->
  </div>
</template>
<script>
import request from "@/axios/axios.js";
import DialogUserInfo from '@/components/dialog-user-info/DialogUserInfo'
import tableBtn from '@/components/littleStyle/tableBtn.vue'
import moment from 'moment'
import * as validator from '@/lib/utils/validator';
export default {
  name: 'supportedBank',
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
      bankDataList: [],
      bank: '',
      createForm: {
        name: ''
      },
      updateForm: {
        id: '',
        name: ''
      },
      rules: {
        name: [{
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
        activeValue: 1,
        inactiveValue: 0
      },
      status: {
        value: '',
        options: [{
            label: 'Enabled',
            value: 0
          },
          {
            label: 'Disabled',
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
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'supportedBank');
    this.routerArr = data.routerArr;
    this.titleName = data.titleName;
    
    this.getBankList()
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
      this.bank = '';
    },
    handleSearch() {
      this.pageNum = 1;
      this.getBankList();
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
      let url = "/bank/update";
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
            self.message("success", "success");
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(self);
          }else{
            self.message("error", "error");
          }
        },
        error => {
          self.loading = false;
          self.message("failure", "error");
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
      this.getBankList();
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getBankList()
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
      this.opText = "Edit";
      for (let i in this.updateForm) {
        this.updateForm[i] = row[i];
      }
      this.updateForm.id = row._id;
    },
    createUsercount() {
      this.createDialog = true;
      this.opText = "Create";
    },
    createFn() {
      const vm = this;
      let data = {};
      data.name = vm.createForm.name;
      vm.createLoading = true;
      request.http(
        "post",
        "/bank/create",
        data,
        success => {
          vm.createLoading = false;
          let code = success.returncode;
          if (code === 200) {
            vm.resetForm("createForm");
            vm.getBankList();
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
      data.name = vm.updateForm.name;
      vm.updateLoading = true;
      request.http(
        "post",
        "/bank/update",
        data,
        success => {
          vm.updateLoading = false;
          let code = success.returncode;
          if (code === 200) {
            vm.resetForm("updateForm");
            vm.getBankList();
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
    getBankList() {
      const vm = this;
      request.http(
        "get",
        "/bank/list", {
          page_num: vm.pageNum,
          page_size: vm.pageSize,
          // name: vm.bank
        },
        success => {
          vm.loading = false;
          let code = success.returncode;
          if (code === 200) {
            vm.bankDataList = success.data;
            vm.pageNum = Number(success.pageNum);
            vm.total = success.total;
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
