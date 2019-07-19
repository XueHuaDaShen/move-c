<!-- 代理开户 -->
<template>
  <div class="content-header agentLink el-custom">
    <div class="title">
      <h2>{{titleName}}</h2>
    </div>
    <div class="search-wrap">
      <div class="nav-title">
        <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
      </div>
      <div class="search-content">
        <table class="search-table">
          <tbody>
            <tr>
              <td><label>Type：</label></td>
              <td>
                <el-select style="width:140px" clearable v-model="user" disabled class="small">
                  <el-option v-for="item in userType" :key="item.value" :label="item.name" :value="item.value">
                  </el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td><label>King Name：</label></td>
              <td>
                <el-select style="width:140px" placeholder="agent name" clearable v-model="kingName" class="small">
                  <el-option v-for="item in kingNameArr" :key="item.value" :label="item.name" :value="item.value">
                  </el-option>
                </el-select>
              </td>
            </tr>
            <!-- <tr>
              <td><label>Credit：</label></td>
              <td><el-input v-model.trim="cash_credit" @blur="handleCredit($event)" placeholder="credit" clearable style="width:140px;"></el-input></td>
            </tr> -->
            <tr>
              <td><label>Template：</label></td>
              <td>
                <el-select style="width:140px" clearable placeholder="template" v-model="templateid" @change="handleSelectTemplate" class="small">
                  <el-option v-if="item.name!=='USER_A'" v-for="item in templateList" :key="item._id" :label="item.name" :value="item._id">
                  </el-option>
                </el-select>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- <div class="search-inner-wrap" style="margin:0 auto;margin-bottom:30px;">
          <label>Type：</label>
          <el-select style="width:140px" clearable v-model="user" disabled class="small">
            <el-option v-for="item in userType" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </div> -->
      </div>
    </div>
    <div class="data-table el-custom" v-loading="loading">
      <el-table :data="templateData" :span-method="objectSpanMethod" v-if="templateid" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" label="Catetory" prop="parent_en">
        </el-table-column>
        <el-table-column align="center" label="Method" prop="name_en">
        </el-table-column>
        <el-table-column align="center" label="Min Bet" prop="min_bet">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:70px;" @blur="handleMinBet(scope.row, $event)" v-model="scope.row.copy_min_bet" :max="scope.row.min_bet"></el-input> &lt;= {{scope.row.min_bet}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Max Bet" prop="max_bet">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:70px;" @blur="handleMaxBet(scope.row, $event)" v-model="scope.row.copy_max_bet" :max="scope.row.max_bet"></el-input> &lt;= {{scope.row.max_bet}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Reward" prop="prize">
          <template slot-scope="scope">
            <el-row>
              <!-- <p v-if="scope.row.showRuler" style="color:#c83a4c;">ILLEGAL</p> -->
              <el-input style="width:70px;" @blur="handlePrize(scope.row, $event)" v-model="scope.row.copy_prize" :max="scope.row.prize"></el-input> &lt;= {{scope.row.prize}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Discount" prop="discount">
          <template slot-scope="scope">
            <el-row>
              <!-- <p v-if="scope.row.showRuler" style="color:#c83a4c;">ILLEGAL</p> -->
              <el-input style="width:70px;" @blur="handleDiscount(scope.row, $event)" v-model="scope.row.copy_discount"></el-input> &lt;= {{scope.row.discount}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Stock" prop="stock">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:70px;" @blur="handleStock(scope.row, $event)" v-model="scope.row.copy_stock"></el-input> &lt;= {{scope.row.stock}}
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top:30px;"><el-button type="primary" class="yes" @click="createLink">Create</el-button></div>
  </div>
</template>
<script>
  import request from '@/axios/axios.js'
  import moment from 'moment';

  export default {
    name: 'agentLink',
    data() {
      return {
        index1: 0,
        index2: 0,
        titleName: '',
        routerArr: [],
        userType: [
          // {name: '用户', value: '0'},
          {name: 'Agent', value: '1'}
        ],
        kingNameArr: [
          {name: 'KINGA', value: 'KINGA'},
          {name: 'KINGC', value: 'KINGC'}
        ],
        duration: 1500,
        // pageNum: 1,
        // pageSize: 10,
        // total: 100,
        kingName: '',
        user: '1',
        cash_credit: '',
        limitList: [],
        templateList: [],
        dataList: [],
        templateData: [],
        templateid: '',
        loading: false,
        is_test: '0',
        maxCredit: 300000,
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'agentLink');
      this.routerArr = data.routerArr;
      this.titleName = data.titleName;
      // this.getDataList();
      this.getTemplate();
    },
    methods: {
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
      //message
      message(text, type) {
        const vm = this;
        this.$message({
          message: text,
          type: type,
          duration: vm.duration,
          center: true
        })
      },

      // 选择模板
      handleSelectTemplate(val) {
        if(!val){
          return false;
        }
        const vm = this;
        // this.dialogTableVisible = true;
        this.templateData = [];
        request.http(
          'get',
          '/agency/link/limit',
          {linkid: val},
          success => {
            let code = success.returncode;
            if(code == 200){
              vm.formartDataList('templateData', success.data)
              // vm.templateData = success.data;
              // vm.templateData.filter(v => {
              //   v.copy_min_bet = v.min_bet;
              //   v.copy_max_bet = v.max_bet;
              //   v.copy_prize = v.prize;
              //   v.copy_discount = v.discount;
              //   v.copy_stock = v.stock;
              //   v.refundid = v._id;
              //   v.showRuler = vm.prizeRulerFn(v);
              // })
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }else{
              // vm.dataList = [];
              vm.templateData = [];
            }
          },
          error => {}
        )
      },
      handleCredit(eve) {
        let copy = this.cash_credit;
        let realy = this.maxCredit;
        if(isNaN(copy)){
          this.message("ILLEGAL", "error");
          return false;
          copy = 0;
        }
        if(this.cash_credit){
          if(copy > realy){
            this.message("ILLEGAL", "error");
            return false;
            this.cash_credit = realy;
            eve.target.value = realy;
          }else if(copy <= 0){
            this.message("ILLEGAL", "error");
            return false;
            this.cash_credit = 0;
            eve.target.value = 0;
          }
        }
      },

      handleMinBet(row, eve) {
        let copy = row.copy_min_bet;
        let realy = row.min_bet;
        if(isNaN(copy)){
          this.message("ILLEGAL", "error");
          return false;
          copy = 0;
        }
        if(copy > realy){
          this.message("ILLEGAL", "error");
          return false;
          row.copy_min_bet = realy;
          eve.target.value = realy;
        }else if(copy <= 0){
          this.message("ILLEGAL", "error");
          return false;
          row.copy_min_bet = 1;
          eve.target.value = 1;
        }
      },
      handleMaxBet(row, eve) {
        let copy = row.copy_max_bet;
        let realy = row.max_bet;
        if(isNaN(copy)){
          this.message("ILLEGAL", "error");
          return false;
          copy = 0;
        }
        if(copy > realy){
          this.message("ILLEGAL", "error");
          return false;
          row.copy_max_bet = realy;
          eve.target.value = realy;
        }else if(copy <= 0){
          this.message("ILLEGAL", "error");
          return false;
          row.copy_max_bet = 1;
          eve.target.value = 1;
        }
      },
      handlePrize(row, eve, ruler) {
        let copy = row.copy_prize;
        let realy = row.prize;
        if(isNaN(copy)){
          this.message("ILLEGAL", "error");
          return false;
          copy = 0;
        }
        if(copy > realy){
          this.message("ILLEGAL", "error");
          return false;
          row.copy_prize = realy;
          eve.target.value = realy;
        }else if(copy <= 0){
          this.message("ILLEGAL", "error");
          return false;
          row.copy_prize = 0;
          eve.target.value = 0;
        }
        row.copy_prize = Number(row.copy_prize);
        eve.target.value = Number(row.copy_prize);
        
        if(!ruler){
          return false;
        }
        let index;
        row.showRuler = this.prizeRulerFn(row);
        this.dataList.filter((v, vi) => {
          if(v._id === row._id){
            index = vi;
          }
        })
        this.dataList.splice(index, 1);
        this.dataList.splice(index, 0, row);
      },
      handleDiscount(row, eve, ruler) {
        let copy = row.copy_discount;
        let realy = row.discount;
        if(isNaN(copy)){
          this.message("ILLEGAL", "error");
          return false;
          copy = 0;
        }
        if(copy > realy){
          this.message("ILLEGAL", "error");
          return false;
          row.copy_discount = realy;
          eve.target.value = realy;
        }else if(copy <= 0){
          this.message("ILLEGAL", "error");
          return false;
          row.copy_discount = 0;
          eve.target.value = 0;
        }
        row.copy_discount = Number(row.copy_discount);
        eve.target.value = Number(row.copy_discount);
        if(!ruler){
          return false;
        }
        let index;
        row.showRuler = this.prizeRulerFn(row);
        this.dataList.filter((v, vi) => {
          if(v._id === row._id){
            index = vi;
          }
        })
        this.dataList.splice(index, 1);
        this.dataList.splice(index, 0, row);
      },
      handleStock(row, eve) {
        let copy = row.copy_stock;
        let realy = row.stock;
        if(isNaN(copy)){
          this.message("ILLEGAL", "error");
          return false;
          copy = 0;
        }
        if(copy > realy){
          this.message("ILLEGAL", "error");
          return false;
          row.copy_stock = realy;
          eve.target.value = realy;
        }else if(copy <= 0){
          this.message("ILLEGAL", "error");
          return false;
          row.copy_stock = 0;
          eve.target.value = 0;
        }
        row.copy_stock = Number(row.copy_stock);
        eve.target.value = Number(row.copy_stock);
      },
      // 奖金 赔率 规则
      prizeRulerFn(row) {
        let prize = row.copy_prize;
        let motherprize = row.motherprize;
        let discount = row.copy_discount;
        return !(prize*100/motherprize + discount*1  < 100);
      },
      getDataList() {
        const vm = this;
        request.http(
          'get',
          '/lottery/limits',
          {loginid: ''},
          success => {
            let code = success.returncode;
            if(code == 200){
              vm.formartDataList('dataList', success.data)
              // vm.dataList = success.data;
              // vm.dataList.filter(v => {
              //   v.copy_min_bet = v.min_bet;
              //   v.copy_max_bet = v.max_bet;
              //   v.copy_prize = v.prize;
              //   v.copy_discount = v.discount;
              //   v.copy_stock = v.stock;
              //   v.showRuler = vm.prizeRulerFn(v);
              // })
              // console.log(vm.dataList)
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }else{
              vm.dataList = [];
            }
          },
          error => {}
        )
      },
      
      formartDataList(selfArr, data) {
        const vm = this;
        let concatIndex = 0;
        let start = 0;
        vm[selfArr] = [];
        let nameArr = [];
        for(let i in data){
          if(nameArr.indexOf(data[i].parent) < 0){
            nameArr.push(data[i].parent)
          }
        }
        for(let i in nameArr){
          let num = 0;
          let arr = [];
          for(let j in data){
            let v = data[j];
            if(v.parent === nameArr[i]){
              v.copy_min_bet = v.min_bet;
              v.copy_max_bet = v.max_bet;
              v.copy_prize = v.prize;
              v.copy_discount = v.discount;
              v.copy_stock = v.stock;
              v.showRuler = vm.prizeRulerFn(v);
              arr.push(v);
              num++;
            }
          }
          if(i == 0){
            start = num;
          }else{
            concatIndex = start + concatIndex;
            start = num;
          }
          for(let ar in arr){
            arr[ar].concatRowNum = num;
            arr[ar].concatIndex = concatIndex;
          }
          vm[selfArr].push(...arr)
        }
      },
      // 行合并
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex == row.concatIndex) {
            return {
              rowspan: row.concatRowNum,
              colspan: 1
            };
          }else{
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      // 获取模板
      getTemplate() {
        const vm = this;
        request.http(
          'get',
          '/agency/link/list',
          {
            page_num: vm.page_num,
            page_size: vm.page_size,
            superiorname: vm.loginname,
            type: [3]
          },
          success => {
            let code = success.returncode;
            if (code === 200) {
              vm.templateList = success.data.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else{
              vm.templateList = [];
            }
          },
          error => {}
        )
      },
      createLink() {
        const vm = this;
        let user_refund = [];
        let data = this.templateData;
        // if(this.templateid){
        //   data = this.templateData;
        // }else{
        //   data = this.dataList;
        //   let isOk = this.dataList.every(v => v.showRuler === false);
        //   if(!isOk){
        //     vm.message('Items that do not conform to the rules', 'error');
        //     return false;
        //   }
        // }
        data.filter(v => {
          let o = {};
          o.gameid = v.parentid.parentid._id;
          o.lotteryid = v._id;
          o.min_bet = v.copy_min_bet;
          o.max_bet = v.copy_max_bet;
          o.prize = v.copy_prize;
          o.discount = v.copy_discount;
          o.stock = v.copy_stock;
          user_refund.push(o);
        })
        if(!vm.kingName){
          vm.message('please select the agent name', 'error');
          return false;
        }
        if(!vm.templateid){
          vm.message('please select the template', 'error');
          return false;
        }
        request.http(
          'post',
          '/agency/link/create',
          {
            superiorname: vm.kingName,
            type: vm.user,
            // cash_credit: vm.cash_credit,
            user_refund: user_refund
          },
          success => {
            let code = success.returncode;
            if (code === 200) {
              vm.message('success', 'success');
              vm.templateid = '';
              vm.cash_credit = '';
              vm.user = '1';
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else if (code == 301){
              vm.message('Parameter error', 'error');
            } else if (code == 303){
              vm.message('Server error', 'error');
            } else{
              vm.message('failure', 'error');
            }
            // console.log(success)
          },
          error => {}
        )
      }
    }
  }

</script>
<style lang="scss">
.agentLink {
  .el-input__inner{
    min-width:auto !important;
  }
  .error-ruler .el-input__inner{
    border-color:#c83a4c;
  }
}
</style>

<style lang="scss" scoped>
  /* @import '../../publicCss/header.css'; */

  .box-card {
    background-color: #fff;
    width: 96%;
    margin: 15px auto 42px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
  }

  .content-container {
    width: 100%;
    margin: 0px auto;
    padding-top: 20px;
  }
  
  .search-table{
    width:100%;
    padding-bottom:25px;
    td{
      text-align:left;
      padding: 5px 0;
      &:first-child{
        width:45%;
        text-align:right;
      }
      label{
        font-size: 12px;
        color: #191919;
      }
    }
  }

</style>
