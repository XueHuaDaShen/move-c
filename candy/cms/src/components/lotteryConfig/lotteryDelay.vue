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
          <!-- <div class="search-inner-wrap">
            <label>彩种：</label>
            <el-select v-model="lotteryType.value" clearable placeholder="彩种" class="small">
              <el-option v-for="(item,index) in lotteryType.options" :key="index" :label="item.name_cn" :value="item._id">
              </el-option>
            </el-select>
          </div> -->
          <div class="search-inner-wrap">
            <label>Issue：</label>
            <el-select v-model="form.lotteryNo.value" clearable placeholder="please select" class="small">
              <el-option v-for="(item,index) in issueData" :key="index" :label="item" :value="item">
              </el-option>
            </el-select>
            <!-- <el-input v-model.trim="form.lotteryNo.value" placeholder="please input an issue" style="width:114px"></el-input> -->
          </div>
          <div class="search-inner-wrap">
            <label>Defer time to:</label>
            <el-date-picker format="dd-MM-yyyy HH:mm:ss" v-model="searchTime" type="datetime" placeholder="please select" align="right" :picker-options="pickerOptions"
              :default-time="pickerDefaultTime">
            </el-date-picker>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="submitForm()" size="medium" class="small yes">Confirm</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">Reset</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="logListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" prop="game_name_en" label="Lotto">
        </el-table-column>
        <el-table-column align="center" prop="issue_no" label="Issue">
        </el-table-column>
        <el-table-column align="center" prop="stop_at" :formatter="formatTime" label="Defer Time To">
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
    name: 'lotteryDelay',
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
        pickerDefaultTime: '00:00:00',
        pickerOptions: {
          shortcuts: [{
            text: "Yesterday",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(new Date(new Date(new Date().toLocaleDateString('en-US')).getTime()) - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", start);
            }
          }, {
            text: "Today",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date(new Date().toLocaleDateString('en-US')).getTime());
              picker.$emit("pick", start);
            }
          }]
        },
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
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'lotteryDelay');
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
        if (!vm.searchTime) {
          vm.message('please select defer time', "warning");
          return;
        }
        request.http(
          "post",
          "lottery/adjust/create", {
            gameid: vm.type.value,
            issue_no: vm.form.lotteryNo.value,
            stop_at: vm.searchTime
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
      getLotteryList() {
        const vm = this;
        let beginTime = '',
          endTime = '';
        if (vm.searchTime !== '') {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
        vm.loading = true;
        request.http(
          'get',
          'lottery/adjust/list', {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
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
