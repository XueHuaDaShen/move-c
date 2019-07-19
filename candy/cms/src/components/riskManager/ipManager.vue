<template>
  <div class="el-custom">
    <DialogUserInfo v-if="dialog" :userid="userid" :loginname="loginname" @sendDiglogShow="handleDialogShow" @closeDialog="handleCloseDialog"></DialogUserInfo>
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
            <label>用户名：</label>
            <el-input clearable v-model.trim="username" placeholder="姓名" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>Period：</label>
            <el-date-picker format="dd-MM-yyyy HH:mm:ss" v-model="searchTime" type="datetimerange" align="right" unlink-panels range-separator="-"
              start-placeholder="begin" end-placeholder="end" :picker-options="pickerOptions" :default-time="pickerDefaultTime">
            </el-date-picker>
          </div>
          <!-- <div class="search-inner-wrap">
            <label>测试用户：</label>
            <el-select clearable v-model="is_test" placeholder="测试用户" class="small">
              <el-option v-for="item in testUser" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div> -->
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">搜索</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">重置</el-button>
          </div>
          <!-- <tableBtn style="float:left;margin-left:15px;" :text="'搜索'" :plain="false" :btnType="'success'" :func="handleSearch"></tableBtn>
          <tableBtn style="float:left;margin-left:15px;" :text="'重置'" :func="handleReset"></tableBtn> -->
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="ipListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" label="用户名" width="126">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getUserInfoFn(scope.row)">
              {{getUserName(scope.row)}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="_id.ip" width="110" label="IP">
        </el-table-column>
        <el-table-column align="center" prop="create_at" width="160" :formatter="formatTime" label="操作时间">
        </el-table-column>
        <el-table-column align="center" prop="is_test" :formatter="formatTestUser" width="80" label="测试用户">
        </el-table-column>
        <el-table-column align="center" prop="detail" label="操作内容">
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
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
  import {
    trim
  } from '@/lib/utils/validator';

  export default {
    name: 'ipManager',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
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
        ipListData: [],
        userid: '',
        loginname: '',
        username: '',
        searchTime: '',
        pickerOptions: {
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
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        testUser: [{
            value: "0",
            label: "否"
          },
          {
            value: "1",
            label: "是"
          }
        ],
        is_test: '',
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'ipManager');
      this.routerArr = data.routerArr;
      this.titleName = data.titleName;
      /*this.getIpList();*/
    },
    methods: {
      succee() {
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
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getIpList();
        // console.log(`当前页: ${val}`);
      },
      getUserInfoFn(row) {
        this.dialog = true;
        let loginname, id;
        if (row && row._id && row._id.user[0] && row._id.user[0].loginname && row._id.user[0]._id) {
          loginname = row._id.user[0].loginname;
          id = row._id.user[0]._id;
          return loginname;
        }
        this.userid = id;
        this.loginname = loginname;
      },
      getUserName(row) {
        if (row && row._id && row._id.user[0] && row._id.user[0].loginname) {
          let loginname = row._id.user[0].loginname;
          return loginname;
        }
        return '';
      },
      handleCloseDialog(val) {
        this.dialog = val;
      },
      handleDialogShow(val) {
        this.dialogIsShow = val;
      },
      formatTime(row, column, cellValue) {
        return moment(cellValue).format('DD-MM-YYYY HH:mm:ss')
        // return moment(cellValue).format('DD-MM-YYYY')
      },
      getIpList() {
        const vm = this;
        let beginTime = '',
          endTime = '';
        if (vm.searchTime.toString() !== '') {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
        if (!this.username) {
          this.$alert('please inut user name', '系统提示', {
            confirmButtonText: '确定',
          });
        }
        request.http(
          'get',
          '/ip/list', {
            PageNum: vm.pageNum,
            PageSize: vm.pageSize,
            loginname: trim(vm.username),
            // ip: vm.ip,
            // detail: vm.keywords,
            beginTime: beginTime,
            endTime: endTime,
            // is_test: vm.is_test
          },
          (success) => {
            vm.loading = false;
            let code = success.returncode;
            if (code === 200) {
              vm.ipListData = success.data;
              vm.pageNum = Number(success.PageNum);
              vm.total = success.count;
              vm.succee();
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
        this.is_test = '0';
        // this.ip = '';
        // this.keywords = '';
      },
      handleSearch() {
        this.getIpList();
        // console.log(this.username, this.searchTime, this.ip, this.keywords)
      },
    }
  }

</script>
<style>
  /* @import '../../publicCss/header.css'; */

</style>
