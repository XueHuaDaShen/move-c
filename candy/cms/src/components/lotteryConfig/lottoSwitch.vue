<template>
  <div class="el-custom">
    <DialogUserInfo v-if="dialog" @sendDiglogShow="handleDialogShow" @closeDialog="handleCloseDialog"></DialogUserInfo>
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
            <label>Lotto：</label>
            <el-select v-model="type.value" clearable placeholder="please select" class="small" @focus="typeFocus()" @change="typeChange">
              <el-option v-for="(item,index) in type.options" :key="index" :label="item.name_en" :value="item._id">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Issue：</label>
            <el-select v-model="form.lotteryNo.value" clearable placeholder="please select" class="small">
              <el-option v-for="(item,index) in issueData" :key="index" :label="item" :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Status：</label>
            <el-select v-model="status" clearable placeholder="please select" class="small">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="submitForm()" size="medium" class="small yes">Confirm</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">Reset</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="logListData" header-row-class-name="table-header" @cell-mouse-enter="mouseOver" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" prop="gameid.name_en" label="Lotto">
        </el-table-column>
        <el-table-column align="center" prop="issue_no" label="Issue">
        </el-table-column>
        <el-table-column align="center" prop="status" label="Status">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="enableChange(scope.row.status)" :active-value="1"
              :inactive-value="0" active-color="#2D996E" inactive-color="#C83A4C">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="create_at" :formatter="formatTime" label="Create Time">
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
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment'
  export default {
    name: 'lottoSwitch',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        specialLoading: false,
        titleName: '',
        routerArr: [],
        dialogTime: "",
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        logListData: [],
        username: '',
        searchTime: '',
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        type: {
          value: "",
          text: '',
          options: [],
          loading: false,
          loadingText: "Loading...",
        },
        lotteryType: {
          value: "",
          text: '',
          options: [],
        },
        dialogVisible: false,
        form: {
          lotteryKind: {
            options: [],
            value: "",
            loading: false,
            loadingText: "Loading...",
          },
          lotteryNo: {
            options: [],
            value: "",
            text: '',
            loading: false,
            loadingText: "Loading...",
            placeholder: "please select an issue"
          }, // 彩期
          awardNo: "" //彩票号码
        },
        issueData: [],
        statusArr: [
          {name: 'disabled', value: '0'},
          {name: 'enabled', value: '1'}
        ],
        status: '',
        rowKey: '',
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'lottoSwitch');
      this.routerArr = data.routerArr;
      this.titleName = data.titleName;
      this.getLotteryList();
    },
    methods: {
      // 降序
      descOrder(arr) {
        return arr.sort((a, b) => {return b-a})
      },
      //
      submitForm() {
        const vm = this;
        if (!vm.type.value) {
          vm.message('please select lottery', "warning");
          return;
        }
        // if (!vm.lotteryType.value) {
        //   vm.message('please select lottery', "warning");
        //   return;
        // }
        if (!vm.form.lotteryNo.value) {
          vm.message('please select an issue', "warning");
          return;
        }
        if (!vm.status) {
          vm.message('please select status', "warning");
          return;
        }
        request.http(
          "post",
          "/lottery/switch/create", {
            gameid: vm.type.value,
            issue_no: vm.form.lotteryNo.value,
            status: vm.status
          },
          success => {
            let code = success.returncode;
            if (code === 200) {
              vm.getLotteryList();
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm);
            } else if (code === 302) {
              vm.message(vm.form.lotteryNo.value + "The award date has already won the prize.", "error")
            } else if (code === 301) {
              vm.message("301", "error")
            } else if (code === 400) {
              vm.message("Period count is illegal", "error")
            } else {
              alert(success.returncode);
            }
          },
          error => {
            vm.error();
            console.log(error);
          }
        )
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
      typeFocus() {
        if (this.type.options.length === 0) {
          this.getType();
        }
      },
      //彩票种类
      getType() {
        const vm = this;
        vm.type.loading = true;
        request.http(
          'get',
          '/lottery/game/list', {},
          (success) => {
            vm.type.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.type.options = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.type.loading = false;
          }
        )
      },
      typeChange(value) {
        this.form.lotteryNo.value = '';
        if (value) {
          let obj = {};
          obj = this.type.options.find((item) => {
            return item._id === value;
          });
          this.getIssueData();
          this.type.text = obj.name;
          this.lotteryType.options = obj.childLotterys;
          this.lotteryType.value = '';
          this.lotteryType.text = '';
        } else {
          this.type.text = '';
          this.lotteryType.options = [];
          this.lotteryType.value = '';
          this.lotteryType.text = '';
          this.issueData = [];
        }
      },
      getIssueData() {
        const vm = this;
        request.http(
          'get',
          '/lottery/issue/three',
          {
            PageNum: 1,
            PageSize: 1000000,
            id: vm.type.value,
          },
          success => {
            if(success.returncode == 200){
              vm.issueData = vm.descOrder(success.data);
            }else{
              vm.issueData = [];
            }
            // console.log(success)
          },
          error => {}
        )
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
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.getLotteryList();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getLotteryList();
        // console.log(`当前页: ${val}`);
      },
      getUserInfoFn(row) {
        this.dialog = true;
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
        return '--'
      },
      mouseOver(row, column, cell, event) {
        this.rowKey = row.gameid._id;
        this.rowIssue = row.issue_no;
      },
      enableChange(value) {
        this.modifiedEnabled("status", value.toString(), this.rowKey, this.rowIssue);
      },
      //是否开启
      modifiedEnabled(key, value, id, issue_no) {
        let self = this,
          data = {};
        let url = "/lottery/switch/update";
        data["gameid"] = id;
        data[key] = value;
        data["issue_no"] = issue_no;
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
            }
          },
          error => {
            self.loading = false;
            self.message("error", "error");
          }
        );
      },
      getLotteryList() {
        const vm = this;
        vm.loading = true;
        request.http(
          'get',
          '/lottery/switch/list', {
            pageNum: vm.pageNum,
            pageSize: vm.pageSize,
          },
          (success) => {
            vm.loading = false;
            // console.log('lotteryList--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.logListData = success.data;
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
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
        this.type.value = '';
        this.type.text = '';
        this.lotteryType.value = '';
        this.lotteryType.text = '';
        this.lotteryType.options = [];
        this.searchTime = '';
        this.form.lotteryNo.value = "";
        this.form.lotteryNo.text = '';
      },
      handleSearch() {
        this.getLotteryList();
      },
    }
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

</style>
