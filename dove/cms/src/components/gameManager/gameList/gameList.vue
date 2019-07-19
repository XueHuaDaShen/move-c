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
            <label>Provider：</label>
            <el-select v-model="searchData.provider" clearable placeholder="Select Provider" class="small" @change="getGameList">
              <el-option v-for="item in providerArr" :key="item.code" :label="item.title" :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>GameID：</label>
            <el-select v-model="searchData.gameid" clearable placeholder="Select GameID" class="small">
              <el-option v-for="item in gameList" :key="item.gameid" :label="item.gameid" :value="item.gameid">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Game Name：</label>
            <el-input clearable v-model="searchData.gamename" placeholder="Game Name" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <label>Game Type：</label>
            <el-select v-model="searchData.gametype" clearable placeholder="Select Game Type" class="small">
              <el-option v-for="item in gameType" :key="item.code" :label="item.title" :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Status：</label>
            <el-select v-model="searchData.status" clearable placeholder="Select Status" class="small">
              <el-option v-for="item in statusArr" :key="item.code" :label="item.title" :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">Search</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">Reset</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table :data="teamReportListData" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;"
        max-height="500" :show-summary="false" sum-text="Total">
        <el-table-column align="center" label="Provider" prop="provider">
        </el-table-column>
        <el-table-column align="center" label="GameID" prop="gameid">
        </el-table-column>
        <el-table-column align="center" label="Game Name" prop="gamename">
        </el-table-column>
        <el-table-column align="center" label="Game Type" prop="gametype">
        </el-table-column>
        <el-table-column align="center" label="Enabled" prop="enabled" :formatter="formatStatus">
        </el-table-column>
        <el-table-column align="center" label="Recommend" prop="recommend">
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
export default {
  name: "gameList",
  data() {
    return {
      index1: 0,
      index2: 0,
      titleName: "",
      routerArr: [],
      providerArr: [
        {
          title: "GSS",
          code: "GSS"
        },
        {
          title: "SA",
          code: "SA"
        },
        {
          title: "GPI",
          code: "GPI"
        },
        {
          title: "NT",
          code: "NT"
        },
      ],
      gameType: [
        {
          title: "All",
          code: ""
        },
        {
          title: "Slots",
          code: "Slots"
        },
        {
          title: "Live",
          code: "Live"
        },
      ],
      statusArr: [
        {
          title: "All",
          code: ""
        },
        {
          title: "Disabled",
          code: "0"
        },
        {
          title: "Enabled",
          code: "1"
        },
      ],
      searchData: {
        provider: '',
        gameid: '',
        gamename: '',
        gametype: '',
        status: '',
      },
      gameList: [],
      loading: false,
      pageNum: 1,
      pageSize: 40,
      total: 0,
      teamReportListData: [],
      duration: 1000,
    };
  },
  created() {
    this.routerArr = [];
    let query = this.$route.query;
    this.index1 = Number(query.index1);
    this.index2 = Number(query.index2);
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'gameList');
    this.routerArr = data.routerArr;
    this.titleName = data.titleName;
    
    this.handleSearch();
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
    formatStatus(row, column, cellValue) {
      switch(cellValue){
        case 0: return 'Disabled';
        case 1: return 'Enabled';
      }
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
    getTableData() {
      const vm = this;
      vm.loading = true;
      request.http(
        "get",
        "/game/list", {
          pageNum: vm.pageNum,
          pageSize: vm.pageSize,
          provider: vm.searchData.provider,
          gameid: vm.searchData.gameid,
          gametype: vm.searchData.gametype,
          enabled: vm.searchData.status,
          gamename: vm.searchData.gamename,
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
    },
    getGameList() {
      const vm = this;
      if(!vm.searchData.provider) return
      request.http(
        "get",
        "/game/list", {
          pageNum: 1,
          pageSize: 9999,
          provider: vm.searchData.provider,
        },
        success => {
          // console.log("teamReportList--------", success);
          let code = success.returncode;
          if (code === 200) {
            vm.gameList = success.data;
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          }
        },
        error => {
          vm.gameList = [];
          vm.error();
          console.log(error);
        }
      );
    },
    handleReset() {
      this.searchData = {
        provider: '',
        gameid: '',
        gamename: '',
        gametype: '',
        status: '',
      };
    },
    handleSearch() {
      this.getTableData()
    }
  }
};

</script>
<style lang="scss" scoped>
</style>

