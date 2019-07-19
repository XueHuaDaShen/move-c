<!-- 代理开户 -->
<template>
  <div class="content-header el-custom linkList">
    <div class="title">
      <h2>{{titleName}}</h2>
    </div>
    <div class="search-wrap">
      <div class="nav-title">
        <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
      </div>
      <!-- <div class="search-content">
        <div class="search-inner-wrap">
          <label>User Name：</label>
          <el-input v-model.trim="loginname" placeholder="user name" clearable style="width:140px;"></el-input>
        </div>
        <div class="search-inner-wrap">
          <el-button type="danger" @click="handleSearch" size="medium" class="small yes">Search</el-button>
          <el-button type="info" @click="handleReset" size="medium" class="small no">Reset</el-button>
        </div>
      </div> -->
    </div>
    <!-- <div class="content-middle">
      <div class="search-wrap">
        <div class="search-inner-wrap">
          <el-button type="success" @click="createTemplate" size="medium" class="edit">Create Template</el-button>
        </div>
      </div>
    </div> -->
    <div class="data-table el-custom" v-loading="loading">
      <el-table :data="linkList" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <!-- <el-table-column align="center" label="url" prop="url">
        </el-table-column>
        <el-table-column align="center" label="code" prop="code">
        </el-table-column>
        <el-table-column align="center" label="user" prop="loginid.loginname">
        </el-table-column>
        <el-table-column align="center" :formatter="setType" label="type" prop="type">
        </el-table-column>
        <el-table-column align="center" label="credit" prop="cash_credit">
        </el-table-column>
        <el-table-column align="center" :formatter="formatTime" label="create_at" prop="create_at">
        </el-table-column> -->
        <el-table-column align="center" label="user" prop="loginid.loginname">
        </el-table-column>
        <el-table-column align="center" label="name" prop="name">
        </el-table-column>
        <el-table-column align="center" label="operation">
          <template slot-scope="scope">
            <!-- <el-button @click="editLink(scope.row)" class="small yes" style="margin-bottom:10px;">edit</el-button><br> -->
            <el-button @click="detailLink(scope.row)" class="small edit">detail</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page_num"
          :page-size="page_size" :total="total" :page-sizes="[10, 20, 40, 80,160,350,700,1000]" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="Detail" :visible.sync="dialogTableVisible">
      <el-table :data="dataList" :span-method="objectSpanMethod" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" width="120" label="Catetory" prop="parent_en">
        </el-table-column>
        <el-table-column align="center" width="100" label="Method" prop="name_en">
        </el-table-column>
        <el-table-column align="center" label="Min Bet" prop="min_bet">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:60px;" :disabled="disabledInput" @blur="handleMinBet(scope.row, $event, 'edit')" v-model="scope.row.copy_min_bet" :max="scope.row.min_bet"></el-input> &lt;= {{scope.row.min_bet}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Max Bet" prop="max_bet">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:60px;" :disabled="disabledInput" @blur="handleMaxBet(scope.row, $event, 'edit')" v-model="scope.row.copy_max_bet" :max="scope.row.max_bet"></el-input> &lt;= {{scope.row.max_bet}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Reward" prop="prize">
          <template slot-scope="scope">
            <el-row>
              <p v-if="scope.row.showRuler" style="color:#c83a4c;">ILLEGAL</p>
              <el-input :class="scope.row.showRuler?'error-ruler':''" style="width:60px;" :disabled="disabledInput" @blur="handlePrize(scope.row, $event, 'edit')" v-model="scope.row.copy_prize" :max="scope.row.prize"></el-input> &lt;= {{scope.row.prize}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Discount" prop="discount">
          <template slot-scope="scope">
            <el-row>
              <p v-if="scope.row.showRuler" style="color:#c83a4c;">ILLEGAL</p>
              <el-input :class="scope.row.showRuler?'error-ruler':''" style="width:60px;" :disabled="disabledInput" @blur="handleDiscount(scope.row, $event, 'edit')" v-model="scope.row.copy_discount"></el-input> &lt;= {{scope.row.discount}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Stock" prop="stock">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:70px;" :disabled="disabledInput" @blur="handleStock(scope.row, $event, 'edit')" v-model="scope.row.copy_stock"></el-input> &lt;= {{scope.row.stock}}
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="Create" :center="false" :visible.sync="detailVisible">
      <div class="body-middle">
        <el-form>
          <el-form-item label="Name：">
            <el-input v-model.trim="templateName" >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="dataList" :span-method="objectSpanMethod" header-row-class-name="table-header" stripe border style="width: 100%;font-size:12px;">
        <el-table-column align="center" width="120" label="Catetory" prop="parent_en">
        </el-table-column>
        <el-table-column align="center" width="100" label="Method" prop="name_en">
        </el-table-column>
        <el-table-column align="center" label="Min Bet" prop="min_bet">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:60px;" @blur="handleMinBet(scope.row, $event, 'create')" v-model="scope.row.copy_min_bet" :max="scope.row.min_bet"></el-input> &lt;= {{scope.row.min_bet}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Max Bet" prop="max_bet">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:60px;" @blur="handleMaxBet(scope.row, $event, 'create')" v-model="scope.row.copy_max_bet" :max="scope.row.max_bet"></el-input> &lt;= {{scope.row.max_bet}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Reward" prop="prize">
          <template slot-scope="scope">
            <el-row>
              <p v-if="scope.row.showRuler" style="color:#c83a4c;">ILLEGAL</p>
              <el-input :class="scope.row.showRuler?'error-ruler':''" style="width:60px;" @blur="handlePrize(scope.row, $event, 'create')" v-model="scope.row.copy_prize" :max="scope.row.prize"></el-input> &lt;= {{scope.row.prize}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Discount" prop="discount">
          <template slot-scope="scope">
            <el-row>
              <p v-if="scope.row.showRuler" style="color:#c83a4c;">ILLEGAL</p>
              <el-input :class="scope.row.showRuler?'error-ruler':''" style="width:60px;" @blur="handleDiscount(scope.row, $event, 'create')" v-model="scope.row.copy_discount"></el-input> &lt;= {{scope.row.discount}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Stock" prop="stock">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:70px;" @blur="handleStock(scope.row, $event, 'create')" v-model="scope.row.copy_stock"></el-input> &lt;= {{scope.row.stock}}
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmCreateFn" class="yes">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import request from '@/axios/axios.js'
  import moment from 'moment';

  export default {
    name: 'linkTemplate',
    data() {
      return {
        index1: 0,
        index2: 0,
        moment: moment,
        duration: 1000,
        titleName: '',
        routerArr: [],
        userType: [
          {name: 'Member', value: '0'},
          {name: 'Agent', value: '1'}
        ],
        linkList: [],
        loginname: '',
        user: '',
        page_num: 1,
        page_size: 10,
        total: 0,
        loading: false,
        is_test: '0',
        disabledInput: true,

        dataList: [],
        dialogTableVisible: false,
        detailVisible: false,
        templateName: '',
        linkid: '',
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'linkTemplate');
      this.routerArr = data.routerArr;
      this.titleName = data.titleName;
      this.getDataList();
    },
    methods: {
      createTemplate(){
        const vm = this;
        this.detailVisible = true;
        request.http(
          'get',
          '/lottery/limits',
          {loginid: ''},
          success => {
            let code = success.returncode;
            if(code == 200){
              vm.dataList = success.data;
              vm.dataList.filter(v => {
                v.copy_min_bet = v.min_bet;
                v.copy_max_bet = v.max_bet;
                v.copy_prize = v.prize;
                v.copy_discount = v.discount;
                v.copy_stock = v.stock;
                v.showRuler = vm.prizeRulerFn(v);
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
      },
      confirmCreateFn() {
        const vm = this;
        let isOk = this.dataList.every(v => v.showRuler === false);
        if(!isOk){
          vm.message('Items that do not conform to the rules', 'error');
          return false;
        }
        let user_refund = [];
        this.dataList.filter(v => {
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
        request.http(
          'post',
          '/agency/link/create',
          {
            superiorname: '',
            type: 3,
            name: vm.templateName,
            user_refund: user_refund
          },
          success => {
            let code = success.returncode;
            if (code === 200) {
              vm.message('success', 'success');
              vm.getDataList();
              vm.detailVisible = false;
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
      setType(row, column, cellValue) {
        let txt = '';
        this.userType.filter(v => {
          if(v.value == cellValue){
            txt = v.name;
          }
        })
        return txt;
      },
      formatTime(row, column, cellValue) {
        if (cellValue) {
          return moment(cellValue).format('DD-MM-YYYY HH:mm:ss')
        }
        return '--'
      },
      handleReset() {
        this.loginname = "";
      },
      handleSearch() {
        this.getDataList();
        // console.log(this.username, this.searchTime, this.ip, this.keywords)
      },
      // 编辑 cash_credit
      editLink(row) {
        // console.log(row)
        this.cash_credit = row.cash_credit;
        this.linkid = row._id;
        this.detailVisible = true;
      },
      // update link
      updateLink() {
        const vm = this;
        request.http(
          'post',
          '/agency/link/credit',
          {
            linkid: vm.linkid,
            cash_credit: vm.cash_credit
          },
          success => {
            let code = success.returncode;
            if (code === 200) {
              vm.getDataList();
              vm.detailVisible = false;
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
      // update link param
      updateLinkParam(row) {
        let vm = this;
        let data = {
          linkid: this.linkid,
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
      
      handleMinBet(row, eve, type) {
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
        if(type == 'create'){
          return false;
        }
        this.updateLinkParam(row);
      },
      handleMaxBet(row, eve, type) {
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
        if(type == 'create'){
          return false;
        }
        this.updateLinkParam(row);
      },
      handlePrize(row, eve, type) {
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
        this.dataList.filter((v, vi) => {
          if(v._id === row._id){
            index = vi;
          }
        })
        this.dataList.splice(index, 1);
        this.dataList.splice(index, 0, row);
        if(row.showRuler){
          return false;
        }
        if(type == 'create'){
          return false;
        }
        this.updateLinkParam(row);
      },
      handleDiscount(row, eve, type) {
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
        this.dataList.filter((v, vi) => {
          if(v._id === row._id){
            index = vi;
          }
        })
        this.dataList.splice(index, 1);
        this.dataList.splice(index, 0, row);
        if(row.showRuler){
          return false;
        }
        if(type == 'create'){
          return false;
        }
        this.updateLinkParam(row);
      },
      handleStock(row, eve, type) {
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
        if(type == 'create'){
          return false;
        }
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
      // detail link
      detailLink(row) {
        const vm = this;
        this.linkid = row._id;
        // this.dialogTableVisible = true;
        let currentData = [];
        request.http(
          'get',
          '/agency/link/limit',
          {linkid: vm.linkid},
          success => {
            let code = success.returncode;
            if(code == 200){
              currentData = success.data;
              request.http(
                'get',
                '/lottery/limits',
                {loginid: ''},
                success => {
                  let code = success.returncode;
                  if(code == 200){
                    vm.dataList = success.data;
                    vm.dataList.filter(v => {
                      currentData.filter(c => {
                        if(c._id == v._id){
                          v.copy_min_bet = c.min_bet;
                          v.copy_max_bet = c.max_bet;
                          v.copy_prize = c.prize;
                          v.copy_discount = c.discount;
                          v.copy_stock = c.stock;
                          v.refundid = c.refundid;
                          v.showRuler = vm.prizeRulerFn(v);
                        }
                      })
                    })
                    vm.formartDataList('dataList', vm.dataList)
                    vm.dialogTableVisible = true;
                    // console.log(vm.dataList)
                  } else if (code === 101 || code === 103 || code === 106) {
                    request.loginAgain(vm)
                  }else{
                    vm.dataList = [];
                  }
                },
                error => {}
              )
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }else{
              // vm.dataList = [];
            }
          },
          error => {}
        )
      },
      //
      getDataList() {
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
              vm.linkList = success.data.data;
              vm.total = success.data.total;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            } else{
              vm.linkList = [];
            }
          },
          error => {}
        )
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.page_size = val;
        this.getDataList();
      },
      handleCurrentChange(val) {
        this.page_num = val;
        this.getDataList();
        // console.log(`当前页: ${val}`);
      },
    }
  }

</script>
<style lang="scss">
.linkList{
  .el-dialog{
    width:800px !important;
    .el-input__inner{
      min-width: auto !important;
    }
    .el-input__inner{
      padding:0 5px !important;
    }
  }
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

</style>
