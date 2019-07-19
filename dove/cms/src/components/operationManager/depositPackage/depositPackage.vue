<!-- 银行管理 -->
<template>
  <div class="depositPackage el-custom">
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
      </div>
    </div>
    <div class="content-middle">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button @click="createPackage" size="medium" class="edit">Add Package</el-button>
          <el-button @click="createCoupon" size="medium" class="edit">Add Coupon</el-button>
        </div>
      </div>
    </div>
    <div class="data-table el-custom" v-loading="loading">
      <!-- <el-table :data="bankDataLis" header-row-class-name="table-header" max-height="500" stripe border style="width: 100%;font-size:12px;"
        @cell-mouse-enter="mouseOver" :summary-method="getSummaries"> -->
      <el-table :data="bankDataLis" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="500" :show-summary="true" sum-text="Total" @cell-mouse-enter="mouseOver" :summary-method="getSummaries">
        <el-table-column align="center" label="Package Name" prop="name">
        </el-table-column>
        <el-table-column align="center" label="Type" prop="type" :formatter="formatType">
        </el-table-column>
        <el-table-column align="center" label="Package Type" prop="package_type" :formatter="formatType2">
        </el-table-column>
        <el-table-column align="center" label="Activity" prop="activity">
        </el-table-column>
        <el-table-column align="center" label="Deposit Amount" prop="amount" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" label="Free Amount" prop="free" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" label="Payload" prop="payload">
        </el-table-column>
        <el-table-column align="center" label="Expire" prop="expire">
        </el-table-column>
        <el-table-column label="Enable/Disable" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabled" @change="enableChange(scope.row.enabled)" :active-value="elswitch.activeValue"
              :inactive-value="elswitch.inactiveValue" active-color="#2D996E" inactive-color="#C83A4C">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Detail" width="150">
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
    <!-- Create Package START -->
    <el-dialog title="Add Package" :before-close="closePackageCreate" :visible.sync="createPackageDialog">
      <div class="body-middle">
        <el-form :model="createPackageForm" :rules="rules" ref="createPackageForm" class="demo-ruleForm">
          <el-form-item label="Name：" prop="name">
            <el-input type="text" v-model="createPackageForm.name"></el-input>
          </el-form-item>
          <el-form-item label="Type：" prop="type">
            <el-select clearable v-model="createPackageForm.type" style="width:100%" placeholder="please select" class="small">
              <el-option v-for="item in depositTypeArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Game Type：" prop="account_type">
            <el-select v-model="createPackageForm.account_type" style="width:100%" placeholder="please select" class="small">
              <el-option v-for="item in gameType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Deposit：" prop="amount">
            <el-input type="text" v-model="createPackageForm.amount"></el-input>
          </el-form-item>
          <el-form-item label="Free：" prop="free">
            <el-input type="text" v-model="createPackageForm.free"></el-input>
          </el-form-item>
          <el-form-item label="Payload：" prop="payload">
            <el-input type="text" v-model="createPackageForm.payload"></el-input>
          </el-form-item>
          <!-- <el-form-item label="Package Type：" prop="package_type">
            <el-select v-model="createPackageForm.package_type" disabled style="width:100%" placeholder="please select" class="small">
              <el-option v-for="item in packageType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('createPackageForm')" class="yes" :loading="createLoading">Confirm</el-button>
        <el-button @click="resetForm('createPackageForm')" class="no">Cancel</el-button>
      </div>
    </el-dialog>
    <!-- Create Package END -->
    <!-- Edit Package START -->
    <el-dialog title="Edit Package" :before-close="closePackageUpdate" :visible.sync="updatePackageDialog">
      <div class="body-middle">
        <el-form :model="updatePackageForm" :rules="rules" ref="updatePackageForm" class="demo-ruleForm">
          <el-form-item label="Name：" prop="name">
            <el-input type="text" v-model="updatePackageForm.name"></el-input>
          </el-form-item>
          <el-form-item label="Type：" prop="type">
            <el-select clearable v-model="updatePackageForm.type" style="width:100%" placeholder="please select" class="small">
              <el-option v-for="item in depositTypeArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Game Type：" prop="account_type">
            <el-select v-model="updatePackageForm.account_type" style="width:100%" placeholder="please select" class="small">
              <el-option v-for="item in gameType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Deposit：" prop="amount">
            <el-input type="text" v-model="updatePackageForm.amount"></el-input>
          </el-form-item>
          <el-form-item label="Free：" prop="free">
            <el-input type="text" v-model="updatePackageForm.free"></el-input>
          </el-form-item>
          <el-form-item label="Payload：" prop="payload">
            <el-input type="text" v-model="updatePackageForm.payload"></el-input>
          </el-form-item>
          <!-- <el-form-item label="Package Type：" prop="package_type">
            <el-select v-model="updatePackageForm.package_type" disabled style="width:100%" placeholder="please select" class="small">
              <el-option v-for="item in packageType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button @click="submitForm('updatePackageForm')" class="yes" :loading="updateLoading">Confirm</el-button>
          <el-button @click="resetForm('updatePackageForm')" class="no">Cancel</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- Edit Package END -->
    <!-- Create Coupon START -->
    <el-dialog title="Add Coupon" :before-close="closeCouponCreate" :visible.sync="createCouponDialog">
      <div class="body-middle">
        <el-form :model="createCouponForm" :rules="rules" ref="createCouponForm" class="demo-ruleForm">
          <el-form-item label="Name：" prop="name">
            <el-input type="text" v-model="createCouponForm.name"></el-input>
          </el-form-item>
          <el-form-item label="Game Type：" prop="account_type">
            <el-select v-model="createCouponForm.account_type" style="width:100%" placeholder="please select" class="small">
              <el-option v-for="item in gameType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="Deposit：" prop="amount">
            <el-input type="text" v-model="createCouponForm.amount"></el-input>
          </el-form-item> -->
          <el-form-item label="Free：" prop="free">
            <el-input type="text" v-model="createCouponForm.free"></el-input>
          </el-form-item>
          <el-form-item label="Payload：" prop="payload">
            <el-input type="text" v-model="createCouponForm.payload"></el-input>
          </el-form-item>
          <!-- <el-form-item label="Package Type：" prop="package_type">
            <el-select v-model="createCouponForm.package_type" disabled style="width:100%" placeholder="please select" class="small">
              <el-option v-for="item in packageType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="Activity：" prop="activity">
            <el-input type="text" v-model="createCouponForm.activity"></el-input>
          </el-form-item>
          <el-form-item label="Expire：" prop="expire">
            <el-input type="text" v-model="createCouponForm.expire"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('createCouponForm')" class="yes" :loading="createLoading">Confirm</el-button>
        <el-button @click="resetForm('createCouponForm')" class="no">Cancel</el-button>
      </div>
    </el-dialog>
    <!-- Create Coupon END -->
    <!-- Edit Coupon START -->
    <el-dialog title="Edit Coupon" :before-close="closeCouponUpdate" :visible.sync="updateCouponDialog">
      <div class="body-middle">
        <el-form :model="updateCouponForm" :rules="rules" ref="updateCouponForm" class="demo-ruleForm">
          <el-form-item label="Name：" prop="name">
            <el-input type="text" v-model="updateCouponForm.name"></el-input>
          </el-form-item>
          <el-form-item label="Game Type：" prop="account_type">
            <el-select v-model="updateCouponForm.account_type" style="width:100%" placeholder="please select" class="small">
              <el-option v-for="item in gameType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="Deposit：" prop="amount">
            <el-input type="text" v-model="updateCouponForm.amount"></el-input>
          </el-form-item> -->
          <el-form-item label="Free：" prop="free">
            <el-input type="text" v-model="updateCouponForm.free"></el-input>
          </el-form-item>
          <el-form-item label="Payload：" prop="payload">
            <el-input type="text" v-model="updateCouponForm.payload"></el-input>
          </el-form-item>
          <!-- <el-form-item label="Package Type：" prop="package_type">
            <el-select v-model="updateCouponForm.package_type" disabled style="width:100%" placeholder="please select" class="small">
              <el-option v-for="item in packageType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="Activity：" prop="activity">
            <el-input type="text" v-model="updateCouponForm.activity"></el-input>
          </el-form-item>
          <el-form-item label="Expire：" prop="expire">
            <el-input type="text" v-model="updateCouponForm.expire"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button @click="submitForm('updateCouponForm')" class="yes" :loading="updateLoading">Confirm</el-button>
          <el-button @click="resetForm('updateCouponForm')" class="no">Cancel</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- Edit Coupon END -->
  </div>
</template>
<script>
import request from "@/axios/axios.js";
import DialogUserInfo from '@/components/dialog-user-info/DialogUserInfo'
import tableBtn from '@/components/littleStyle/tableBtn.vue'
import moment from 'moment'
import * as validator from '@/lib/utils/validator';
export default {
  name: 'depositPackage',
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
      bankDataLis: [],
      bank: '',
      createPackageForm: {
        name: "",
        type: '',
        account_type: '',
        amount: "",
        free: "",
        payload: "",
        package_type: 0,
        // activity: '',
        // expire: ''
      },
      updatePackageForm: {
        id: "",
        name: "",
        type: '',
        account_type: '',
        amount: "",
        free: "",
        payload: "",
        package_type: 0,
        // activity: '',
        // expire: ''
      },
      createCouponForm: {
        name: "",
        amount: "0",
        free: "",
        payload: "",
        account_type: '',
        package_type: 1,
        activity: '',
        expire: ''
      },
      updateCouponForm: {
        id: "",
        name: "",
        amount: "0",
        free: "",
        payload: "",
        account_type: '',
        package_type: 1,
        activity: '',
        expire: ''
      },
      gameType: [
        {value: 'slot', label: 'slot'},
        {value: 'live', label: 'live'},
      ],
      packageType: [
        {value: 0, label: 'package'},
        {value: 1, label: 'coupon'},
      ],
      depositTypeArr: [
        {value: 0, label: 'Ordinary package'},
        {value: 1, label: 'First charge today'},
        {value: 2, label: 'New member first charge'}
      ],
      rules: {
        name: [{
          required: true,
          message: 'Name',
          trigger: 'blur',
        }],
        amount: [{
          required: true,
          message: 'Deposit',
          trigger: 'blur',
        }],
        free: [{
          required: true,
          message: 'Free',
          trigger: 'blur',
        }],
        payload: [{
          required: true,
          message: 'Payload',
          trigger: 'blur',
        }],
        account_type: [{
          required: true,
          message: 'Game type',
          trigger: 'change',
        }],
        package_type: [{
          required: true,
          message: 'Package type',
          trigger: 'change',
        }],
        type: [{
          required: true,
          message: 'Type',
          trigger: 'change',
        }],
        activity: [{
          required: true,
          message: 'Activity',
          trigger: 'blur',
        }],
        expire: [{
          required: true,
          message: 'Expire',
          trigger: 'blur',
        }],
      },
      duration: 1000,
      dialog: false,
      dialogIsShow: false,
      createPackageDialog: false,
      updatePackageDialog: false,
      createCouponDialog: false,
      updateCouponDialog: false,
      rowKey: "",
      elswitch: {
        activeValue: 1,
        inactiveValue: 0
      },
    }
  },
  created() {
    this.routerArr = [];
    let query = this.$route.query;
    this.index1 = Number(query.index1);
    this.index2 = Number(query.index2);
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'depositPackage');
    this.routerArr = data.routerArr;
    this.titleName = data.titleName;
    
    this.getDataList()
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
        // console.log("column", column);
        const values = data.map(item => Number(item[column.property]));
        if ((index === 4 || index === 5) && !values.every(value => isNaN(value))) {
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
          if (index === 4 || index === 5) {
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
      this.getDataList();
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
      this.modifiedEnabled("enabled", value.toString(), this.rowKey);
    },
    // 玩法修改
    modifiedEnabled(key, value, id) {
      let self = this,
        data = {};
      let url = "/deposit/package/update";
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
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getDataList()
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
    formatType(row, column, cellValue) {
      let type = '--'
      if(cellValue !== undefined || cellValue !== null || cellValue !== ''){
        this.depositTypeArr.forEach(item => {
          if(item.value == cellValue){
            type = item.label
          }
        })
      }
      return type;
    },
    formatType2(row, column, cellValue) {
      let type = '--'
      if(cellValue !== undefined || cellValue !== null || cellValue !== ''){
        this.packageType.forEach(item => {
          if(item.value == cellValue){
            type = item.label
          }
        })
      }
      return type;
    },
    formatMoney(row, column, cellValue) {
      if (cellValue) {
        return this.$store.state.toThousands(Number(cellValue));
      }
      return "0.00";
    },
    editUsercount(row) {
      if(row.package_type == 0){
        this.updatePackageDialog = true;
        for (let i in this.updatePackageForm) {
          this.updatePackageForm[i] = row[i];
        }
        this.updatePackageForm.id = row._id;
      }else{
        this.updateCouponDialog = true;
        for (let i in this.updateCouponForm) {
          this.updateCouponForm[i] = row[i];
        }
        this.updateCouponForm.id = row._id;
      }
    },
    createPackage() {
      this.createPackageDialog = true;
    },
    createCoupon() {
      this.createCouponDialog = true;
    },
    createFn(formName) {
      const vm = this;
      let data = this[formName];
      vm.createLoading = true;
      request.http(
        "post",
        "/deposit/package/create",
        data,
        success => {
          vm.createLoading = false;
          let code = success.returncode;
          if (code === 200) {
            vm.resetForm(formName);
            vm.getDataList();
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
    updateFn(formName) {
      const vm = this;
      let data = this[formName];
      vm.updateLoading = true;
      request.http(
        "post",
        "/deposit/package/update",
        data,
        success => {
          vm.updateLoading = false;
          let code = success.returncode;
          if (code === 200) {
            vm.resetForm(formName);
            vm.getDataList();
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
          if (formName === "createPackageForm" || formName === "createCouponForm") {
            vm.createFn(formName);
          } else if (formName === "updatePackageForm" || formName === "updateCouponForm") {
            vm.updateFn(formName);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    },
    resetForm(formName) {
      this.updatePackageDialog = false;
      this.createPackageDialog = false;
      this.updateCouponDialog = false;
      this.createCouponDialog = false;
      this.$refs[formName].resetFields();
    },
    getDataList() {
      const vm = this;
      request.http(
        "get",
        "/deposit/package/list", {
          pageNum: vm.pageNum,
          pageSize: vm.pageSize
        },
        success => {
          vm.loading = false;
          let code = success.returncode;
          if (code === 200) {
            vm.bankDataLis = success.data;
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
    closePackageCreate() {
      this.createPackageDialog = false
      this.$refs["createPackageForm"].resetFields()
    },
    closePackageUpdate() {
      this.updatePackageDialog = false
      this.$refs["updatePackageForm"].resetFields()
    },
    closeCouponCreate() {
      this.createCouponDialog = false
      this.$refs["createCouponForm"].resetFields()
    },
    closeCouponUpdate() {
      this.updateCouponDialog = false
      this.$refs["updateCouponForm"].resetFields()
    }
  }
}

</script>
<style>
  /* @import "../../publicCss/header.css"; */

  .depositPackage .el-form-item__content {
    text-align: left;
  }

  .depositPackage {
    /* width: 70%; */
  }

</style>
