<!-- 代理开户 -->
<template>
  <div class="content-header agentLink el-custom">
    <div class="data-table el-custom" v-loading="loading">
      <el-table :data="dataList" :span-method="objectSpanMethod" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" label="Catetory" prop="parent_en">
        </el-table-column>
        <el-table-column align="center" label="Method" prop="name_en">
        </el-table-column>
        <el-table-column align="center" label="Min Bet" prop="min_bet" v-if="disabledInput">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:70px;" @blur="handleRootMinBet(scope.row, $event)" v-model="scope.row.copy_min_bet" :max="scope.row.copy_max_bet"></el-input> &lt;= {{scope.row.max_bet}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Max Bet" prop="max_bet" v-if="disabledInput">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:70px;" @blur="handleRootMaxBet(scope.row, $event)" v-model="scope.row.max_bet"></el-input>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Min Bet" prop="min_bet" v-if="!disabledInput">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:70px;" @blur="handleMinBet(scope.row, $event)" v-model="scope.row.copy_min_bet" :max="scope.row.min_bet"></el-input> &lt;= {{scope.row.min_bet}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Max Bet" prop="max_bet" v-if="!disabledInput">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:70px;" @blur="handleMaxBet(scope.row, $event)" v-model="scope.row.copy_max_bet" :max="scope.row.max_bet"></el-input> &lt;= {{scope.row.max_bet}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Reward" prop="prize">
          <template slot-scope="scope">
            <el-row v-if="!disabledInput">
              <p v-if="scope.row.showRuler" style="color:#c83a4c;">ILLEGAL</p>
              <el-input :class="scope.row.showRuler?'error-ruler':''" style="width:70px;" @blur="handlePrize(scope.row, $event)" v-model="scope.row.copy_prize" :max="scope.row.prize"></el-input> &lt;= {{scope.row.prize}}
            </el-row>
            <el-row v-if="disabledInput">
              <el-input style="width:70px;" :disabled="disabledInput" @blur="handlePrize(scope.row, $event)" v-model="scope.row.copy_prize" :max="scope.row.prize"></el-input> &lt;= {{scope.row.prize}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Discount" prop="discount">
          <template slot-scope="scope">
            <el-row v-if="!disabledInput">
              <p v-if="scope.row.showRuler" style="color:#c83a4c;">ILLEGAL</p>
              <el-input :class="scope.row.showRuler?'error-ruler':''" style="width:70px;" @blur="handleDiscount(scope.row, $event)" v-model="scope.row.copy_discount"></el-input> &lt;= {{scope.row.discount}}
            </el-row>
            <el-row v-if="disabledInput">
              <el-input style="width:70px;" :disabled="disabledInput" @blur="handleDiscount(scope.row, $event)" v-model="scope.row.copy_discount"></el-input> &lt;= {{scope.row.discount}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Stock" prop="stock">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:70px;" :disabled="disabledInput||isType0" @blur="handleStock(scope.row, $event)" v-model="scope.row.copy_stock"></el-input> &lt;= {{scope.row.stock}}
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div style="margin-top:30px;"><el-button type="primary" class="yes" @click="createLink">Create</el-button></div> -->
  </div>
</template>
<script>
  import request from '@/axios/axios.js'
  import moment from 'moment';

  export default {
    name: 'setting',
    props: {
      loginname: {
        type: String
      },
      userType: {
        type: Number
      }
    },
    data() {
      return {
        duration: 1500,
        // cash_credit: '',
        // limitList: [],
        dataList: [],
        loading: false,
        is_test: '0',
        disabledInput: false,
        isType0: false
      }
    },
    created() {
      this.disabledInput = this.loginname === 'KINGA' || this.loginname === 'KINGU' || this.loginname === 'KINGT' || this.userType == 2 || this.loginname === 'KINGC';
      this.isType0 = this.userType == 0;
      // console.log(this.disabledInput, this.loginname)
      this.getDataList();
    },
    methods: {
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
      handleRootMinBet(row, eve) {
        let copy = row.copy_min_bet;
        let realy = row.copy_max_bet;
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
        this.updateLinkParam(row);
      },
      handleRootMaxBet(row, eve) {
        let copy = row.max_bet;
        let realy = row.copy_min_bet;
        if(isNaN(copy)){
          this.message("ILLEGAL", "error");
          return false;
          copy = 0;
        }
        if(copy <= realy){
          this.message("ILLEGAL", "error");
          return false;
          row.max_bet = realy;
          eve.target.value = realy;
        }
        row.copy_max_bet = row.max_bet;
        this.updateLinkParam(row);
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
        this.updateLinkParam(row);
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
        this.updateLinkParam(row);
      },
      handlePrize(row, eve) {
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
        
        let index;
        row.showRuler = this.prizeRulerFn(row);
        // this.dataList.filter((v, vi) => {
        //   if(v._id === row._id){
        //     index = vi;
        //   }
        // })
        // this.dataList.splice(index, 1);
        // this.dataList.splice(index, 0, row);
        if(row.showRuler){
          return false;
        }
        this.updateLinkParam(row);
      },
      handleDiscount(row, eve) {
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
        let index;
        row.showRuler = this.prizeRulerFn(row);
        // this.dataList.filter((v, vi) => {
        //   if(v._id === row._id){
        //     index = vi;
        //   }
        // })
        // this.dataList.splice(index, 1);
        // this.dataList.splice(index, 0, row);
        if(row.showRuler){
          return false;
        }
        this.updateLinkParam(row);
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
        this.updateLinkParam(row);
      },
      // 奖金 赔率 规则
      prizeRulerFn(row) {
        let prize = row.copy_prize;
        let motherprize = row.motherprize;
        let discount = row.copy_discount;
        return !(prize*100/motherprize + discount*1  < 100);
      },
      //
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
      // update link param
      updateLinkParam(row) {
        // console.log(row)
        let vm = this;
        let data = {
          linkid: row.linkid,
          min_bet: row.copy_min_bet,
          max_bet: row.copy_max_bet,
          prize: row.copy_prize,
          refundid: row.refundid,
          // gameid: row.gameid,
          lotteryid: row._id,
          stock: row.copy_stock,
          discount: row.copy_discount
        }
        request.http(
          'post',
          '/agency/link/reward',
          data,
          success => {
            let code = success.returncode;
            if (code === 200) {
              vm.message('update success', 'success')
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else if (code === 301 || code === 303) {
              vm.message('Parameter error', 'error')
            } else {
              vm.message(success.returncode, 'error')
            }
          },
          error => {}
        )
      },
      getDataList() {
        const vm = this;
        request.http(
          'get',
          '/lottery/limits',
          {superiorname: vm.loginname},
          success => {
            let code = success.returncode;
            if(code == 200){
              var currentData = success.data;
              request.http(
                'get',
                '/lottery/limits',
                {
                  superiorname: vm.loginname,
                  parent: '1',
                },
                success => {
                  let code = success.returncode;
                  if(code == 200){
                    vm.dataList = success.data;
                    vm.dataList.filter(v => {
                      currentData.filter(c => {
                        if(c._id == v._id){
                          v.copy_min_bet = c.min_bet;
                          v.copy_max_bet = c.max_bet;
                          v.min_bet = c.min_bet;
                          v.max_bet = c.max_bet;
                          v.copy_prize = c.prize;
                          v.copy_discount = c.discount;
                          v.copy_stock = c.stock;
                          v.refundid = c.refundid;
                          v._id = c._id;
                          v.showRuler = vm.prizeRulerFn(v);
                        }
                      })
                    })
                    vm.formartDataList('dataList', vm.dataList)
                    // console.log(vm.dataList)
                  } else if (code === 101 || code === 103 || code === 106) {
                    request.loginAgain(vm)
                  }else{
                    vm.dataList = [];
                  }
                },
                error => {}
              )
              // console.log(vm.dataList)
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }else{
              vm.dataList = [];
            }
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
