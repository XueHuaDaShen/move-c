<template>
  <div class="rechargeLot-wrap el-custom">
    <div class="data-table" v-loading="loading">
      <el-table :data="teamReportListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="500" :show-summary="true" sum-text="Total" :summary-method="getSummaries">
        <el-table-column align="center" label="Name" prop="Name">
        </el-table-column>
        <el-table-column align="center" label="Agent" prop="Agent">
        </el-table-column>
        <el-table-column align="center" label="Share" prop="Share" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" label="Paid" prop="Paid" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" label="Refund" prop="Refund" :formatter="formatMoney">
        </el-table-column>
        <el-table-column align="center" label="Win/Loss" prop="WinLoss" :formatter="formatMoney">
        </el-table-column>
      </el-table>
      <!-- <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-size="pageSize" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div> -->
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
      currId: ""
    };
  },
  created() {
    this.getTableData();
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
        if ((index === 2 || index === 3 || index === 4 || index === 5) && !values.every(value => isNaN(value))) {
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
    // formatTime(row, column, cellValue) {
    //   const vm = this;
    //   if (cellValue) {
    //     return moment(cellValue).format("DD-MM-YYYY");
    //   }else if(vm.copyTime){
    //     return moment(vm.copyTime[0]).format("DD-MM-YYYY") + ' To ' + moment(vm.copyTime[1]).format("DD-MM-YYYY");
    //   }else{
    //     return '--';
    //   }
    // },
    getTableData() {
      const vm = this;
      vm.loading = true;
      request.http(
        "get",
        "/analyze/lottery/agent",
        {
          gameid: vm.searchData.gameid,
          issue_no: vm.searchData.issue_no,
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

