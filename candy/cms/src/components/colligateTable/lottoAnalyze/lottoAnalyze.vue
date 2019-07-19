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
            <label>Lotto：</label>
            <el-select v-model="searchData.gameid" clearable placeholder="all" class="small" @change="gameidChange">
              <el-option v-for="item in lotteryList" :key="item.code" :label="item.name_en" :value="item._id">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <label>Issue：</label>
            <el-input clearable v-model.trim="searchData.issue_no" placeholder="issue" style="width:114px;"></el-input>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="small yes">Search</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="small no">Reset</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="echarts-wrap" v-if="isGetData">
      <div class="nav-title">
        <span :class="item.checked?'current':''" v-for="(item, index) in echartView" :key="index" @click="handleChangeEchart(index)">{{item.name}}</span>
      </div>
      <div class="echart-view" v-if="showEchart">
        <overview v-if="echartValue === 'overview'" :playType="playType" :searchData="searchData" title="Bet & Discount & Reward" title2="Bet" title3="Reward"></overview>
        <numberView v-if="echartValue === 'number'" :playType="playType" :searchData="searchData" title="Number View"></numberView>
        <user v-if="echartValue === 'user'" :searchData="searchData" title="User Win/Loss"></user>
        <agent v-if="echartValue === 'agent'" :searchData="searchData" title="Agent Win/Loss"></agent>
      </div>
    </div>
  </div>
</template>
<script>
import overview from "./echartView/overview";
import numberView from "./echartView/numberView";
import user from "./echartView/user";
import agent from "./echartView/agent";
import request from "@/axios/axios.js";
export default {
  name: "lottoAnalyze",
  components: {
    overview,
    numberView,
    user,
    agent
  },
  data() {
    return {
      index1: 0,
      index2: 0,
      titleName: "",
      routerArr: [],
      total: 0,
      lotteryList: [],
      searchData: {
        gameid: '',
        issue_no: '',
      },
      duration: 1000,
      echartView: [
        {name: 'Overview', value: 'overview', checked: false},
        {name: 'Number View', value: 'number', checked: false},
        {name: 'User Win/Loss', value: 'user', checked: false},
        {name: 'Agent Win/Loss', value: 'agent', checked: false},
      ],
      playType: [],
      echartValue: '',
      echartData: null,
      showEchart: false,
      isGetData: false,
    };
  },
  created() {
    this.routerArr = [];
    let query = this.$route.query;
    this.index1 = Number(query.index1);
    this.index2 = Number(query.index2);
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'lottoAnalyze');
    this.routerArr = data.routerArr;
    this.titleName = data.titleName;
    
    this.handleChangeEchart(0);
    this.getType();
  },
  methods: {
    handleChangeEchart(index) {
      if(this.echartValue === this.echartView[index].value) return
      this.echartView.forEach(v => {v.checked = false;})
      this.echartView[index].checked = true;
      this.echartValue = this.echartView[index].value;
    },
    handleReset() {
      this.searchData = {
        gameid: '',
        issue_no: '',
      };
      this.isGetData = false;
    },
    message(type, text) {
      const vm = this;
      this.$message({
        message: text,
        type: type,
        duration: vm.duration,
        center: true
      });
    },
    //彩票种类
    getType() {
      const vm = this;
      request.http(
        'get',
        '/lottery/game/list', {},
        (success) => {
          let code = success.returncode;
          if (code === 200) {
            vm.lotteryList = success.data;
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm)
          }
        },
        (error) => {
          // vm.type.loading = false;
        }
      )
    },
    gameidChange(val) {
      // console.log('val', val);
      if (val) {
        this.getwanfalist(val);
      } else {
        // this.wanfalist.options = [];
        // this.lotteryid = "";
      }
    },
    getwanfalist(id) {
      let vm = this;
      request.http(
        "get",
        "/lottery/last/list", {
          gameid: id
        },
        success => {
          let code = success.returncode;
          if (code === 200) {
            vm.playType = success.data;
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          }
        },
        error => {
          console.log(error);
        }
      );
    },
    handleSearch() {
      const vm = this;
      if(!vm.searchData.gameid){
        vm.message("error", "Please select Lotto")
        return false;
      }
      if(!vm.searchData.issue_no){
        vm.message("error", "Please enter a Issue")
        return false;
      }
      vm.isGetData = true;
      vm.showEchart = false;
      setTimeout(() => {
        vm.showEchart = true;
      }, 100);
    }
  }
};

</script>
<style lang="scss" scoped>
</style>

