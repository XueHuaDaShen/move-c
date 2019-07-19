<template>
  <div class="rechargeLot-wrap el-custom">
    <div class="data-table" v-loading="loading">
      <el-table :data="teamReportListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="500" :show-summary="true" sum-text="Total" :summary-method="getSummaries">
        <el-table-column align="center" label="Provider" prop="_id.provider">
        </el-table-column>
        <el-table-column align="center" label="GameID" prop="_id.gameid">
        </el-table-column>
        <el-table-column align="center" label="Game Name" prop="gamename">
        </el-table-column>
        <el-table-column align="center" label="Day" prop="day" :formatter="formatTime">
        </el-table-column>
        <el-table-column align="center" label="Bet" prop="bet" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" label="Reward" prop="reward" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" label="Rollback" prop="rollback" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" label="Win/Loss" prop="bet_profit" :formatter="formatMoney">
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
import DialogUserInfo from "@/components/dialog-user-info/DialogUserInfo";
import moment from "moment";
import {
  trim
} from '@/lib/utils/validator';
export default {
  name: "userReport",
  props: {
    searchData: {}
  },
  components: {
    DialogUserInfo
  },
  data() {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 40,
      total: 0,
      teamReportListData: [],
      userid: "",
      loginname: "",
      duration: 1000,
      dialog: false,
      dialogIsShow: false,
      copyTime: '',
      currId: ""
    };
  },
  created() {
    this.getTableData();
    this.copyTime = this.searchData.time;
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
        let values = data.map(item => Number(item[column.property]));
        if (index === 4 || index === 5 || index === 6 || index === 7) {
          values = data.map(item => Number(item[column.property]));
        }
        if (!values.every(value => isNaN(value))) {
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
    success() {
      const vm = this;
      this.$message({
        message: "Load Success",
        type: "success",
        duration: vm.duration,
        center: true
      });
    },
    error() {
      const vm = this;
      this.$message({
        message: "Load Failure",
        type: "error",
        duration: vm.duration,
        center: true
      });
    },
    formatMoney(row, column, cellValue) {
      if (cellValue) {
        return this.$store.state.toThousands(Number(cellValue));
      }
      return "0.00";
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getTableData();
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
      const vm = this;
      if (cellValue) {
        return moment(cellValue).format("DD-MM-YYYY");
      }else if(vm.copyTime){
        return moment(vm.copyTime[0]).format("DD-MM-YYYY") + ' To ' + moment(vm.copyTime[1]).format("DD-MM-YYYY");
      }else{
        return '--';
      }
    },
    getTableData() {
      const vm = this;
      let beginTime = "",
        endTime = "";
      if (vm.searchData.time) {
        if (vm.searchData.time.toString() !== "") {
          beginTime = new Date(vm.searchData.time[0]);
          endTime = new Date(vm.searchData.time[1]);
        }
      }
      vm.loading = true;
      request.http(
        "get",
        "/chart/game/user/list", {
          pageNum: vm.pageNum,
          pageSize: vm.pageSize,
          start_at: beginTime,
          end_at: endTime,
          sort: vm.searchData.sort,
          order: vm.searchData.order,
          provider: vm.searchData.provider,
          gameid: vm.searchData.gameid,
        },
        success => {
          vm.loading = false;
          // console.log("teamReportList--------", success);
          let code = success.returncode;
          if (code === 200) {
            vm.teamReportListData = success.data;
            vm.pageNum = Number(success.pageNum) || 1;
            vm.total = success.total;
            vm.success();
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          }
        },
        error => {
          vm.loading = false;
          vm.error();
          console.log(error);
        }
      );
    }
  }
};

</script>
<style lang="scss" scoped>
</style>

