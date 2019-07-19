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
          <div class="search-inner-wrap">
            <label>Channel：</label>
            <el-select clearable v-model="channel" placeholder="please select" class="small">
              <el-option v-for="item in channels" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
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
        max-height="500">
        <el-table-column align="center" prop="day" label="Day" :formatter="formatTime">
        </el-table-column>
        <el-table-column align="center" prop="num_new_user" label="DNU">
        </el-table-column>
        <el-table-column align="center" prop="num_active_user" label="DAU">
        </el-table-column>
        <el-table-column align="center" prop="num_deposit" label="DEP_COUNT">
        </el-table-column>
        <el-table-column align="center" prop="num_deposit_user" label="DEP_USER">
        </el-table-column>
        <el-table-column align="center" prop="num_deposit_first" label="DEP_USER_FIRST" :formatter="formatMoney">
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
import moment from 'moment'
import {
  trim
} from '@/lib/utils/validator';
export default {
  name: 'refund',
  data() {
    return {
      index1: 0,
      index2: 0,
      titleName: '',
      routerArr: [],
      loading: false,
      pageNum: 1,
      pageSize: 40,
      total: 0,
      withdrawListData: [],
      channels: [
        {
          value: 'all',
          label: 'All'
        },
        {
          value: 'king',
          label: 'king'
        }, {
          value: 'yyy',
          label: 'yyy'
        }
      ],
      channel: 'all',
      duration: 1000,
    }
  },
  created() {
    this.routerArr = [];
    let query = this.$route.query;
    this.index1 = Number(query.index1);
    this.index2 = Number(query.index2);
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'userData');
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
        return cellValue;
      }
      return "0"
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
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageNum = 1;
      this.pageSize = val;
      this.getWithdrawLotList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getWithdrawLotList();
      // console.log(`当前页: ${val}`);
    },
    formatTime(row, column, cellValue) {
      if (cellValue) {
        return moment(cellValue).format('DD-MM-YYYY')
      }
      return "--"
    },
    getWithdrawLotList() {
      const vm = this;
      vm.loading = true;
      request.http(
        'get',
        '/user/daily/active/list', {
          dataType: '1',
          pageSize: vm.pageSize,
          pageNum: vm.pageNum,
          channel: vm.channel,
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
      this.channel = 'all';
    },
    handleSearch() {
      this.pageNum = 1;
      this.getWithdrawLotList();
    },
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

</style>
