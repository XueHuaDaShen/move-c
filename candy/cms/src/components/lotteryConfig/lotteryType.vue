<template>
  <div class="el-custom">
    <div class="content-header">
      <div class="title">
        <h2>{{titleName}}</h2>
      </div>
      <div class="search-wrap">
        <div class="nav-title">
          <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
        </div>
      </div>
    </div>
    <div class="tag-router">
      <span v-for="(item, i) in breadcrumbArr" :key="i"><el-button type="text" size="small" @click="handleClickTag(item)">{{item.name_en}}</el-button> / </span>
    </div>
    <div class="data-table" v-loading="loading">
      <el-table v-if="lotteryTypeData.length>0" :data="lotteryTypeData" stripe border style="width: 100%;font-size:12px;" :show-header="true">
        <el-table-column align="center" v-if="!showChildChild" prop="order" label="Order">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:50px;" @blur="handleEditName(scope.row, 'order', showChild?'1':'0')" v-model="scope.row.order"></el-input>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" v-if="!showChildChild" prop="name_en" label="Name_EN">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:100px;" @blur="handleEditName(scope.row, 'name_en', showChild?'1':'0')" v-model="scope.row.name_en"></el-input>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" v-if="!showChildChild" prop="name_th" label="Name_TH">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:100px;" @blur="handleEditName(scope.row, 'name_th', showChild?'1':'0')" v-model="scope.row.name_th"></el-input>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" v-if="!showChildChild" prop="name_cn" label="Name_CN">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:100px;" @blur="handleEditName(scope.row, 'name_cn', showChild?'1':'0')" v-model="scope.row.name_cn"></el-input>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" v-if="!showChildChild" label="Enable/Disable">
          <template slot-scope="scope">
            <el-switch @change="handleEditEnabled(scope.row, 'enabled', showChild?'1':'0')" :inactive-value="0" :active-value="1" v-model="scope.row.enabled"
              active-color="#2D996E" inactive-color="#C83A4C"></el-switch>
          </template>
        </el-table-column>

        <el-table-column align="center" v-if="showChildChild" prop="order" label="Order">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:50px;" @blur="handleEditName(scope.row, 'order', '2')" v-model="scope.row.order"></el-input>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" width="130" v-if="showChildChild" prop="name_en" label="Name_EN">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:100px;" @blur="handleEditName(scope.row, 'name_en', '2')" v-model="scope.row.name_en"></el-input>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" width="130" v-if="showChildChild" prop="name_th" label="Name_TH">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:100px;" @blur="handleEditName(scope.row, 'name_th', '2')" v-model="scope.row.name_th"></el-input>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" width="130" v-if="showChildChild" prop="name_cn" label="Name_CN">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:100px;" @blur="handleEditName(scope.row, 'name_cn', '2')" v-model="scope.row.name_cn"></el-input>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" v-if="showChildChild" prop="prize" label="Prize">
          <template slot-scope="scope">
            <el-row>
              {{scope.row.prize}}
            </el-row>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" width="120" v-if="showChildChild" prop="min_bet" label="Min Bet">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:80px;" @blur="handleMinBet(scope.row, $event)" v-model="scope.row.copy_min_bet"></el-input> &lt;= {{scope.row.max_bet}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120" v-if="showChildChild" prop="max_bet" label="Max Bet">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:80px;" @blur="handleMaxBet(scope.row, $event)" v-model="scope.row.copy_max_bet"></el-input> &lt;= {{scope.row.total_bet}}
            </el-row>
          </template>
        </el-table-column> -->
        <el-table-column align="center" width="120" v-if="showChildChild" prop="total_bet" label="TotalBet">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:80px;" @blur="handleTotalBet(scope.row, $event)" v-model="scope.row.copy_total_bet"></el-input> &gt;= {{scope.row.max_bet}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120" v-if="showChildChild" prop="all_bet" label="AllBet">
          <template slot-scope="scope">
            <el-row>
              <el-input style="width:80px;" @blur="handleAllBet(scope.row, $event)" v-model="scope.row.copy_all_bet"></el-input> &gt;= {{scope.row.total_bet}}
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" v-if="showChildChild" label="Enable/Disable">
          <template slot-scope="scope">
            <el-switch @change="handleEditEnabled(scope.row, 'enabled', '2')" :inactive-value="0" :active-value="1" v-model="scope.row.enabled"
              active-color="#2D996E" inactive-color="#C83A4C"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Action" v-if="!showChildChild">
          <template slot-scope="scope">
            <el-button class="small edit" v-if="!showChild" @click="pushRouterTag(scope.row, '1')">Enter</el-button>
            <el-button class="small edit" v-if="showChild" @click="pushRouterTag(scope.row, '2')">Enter</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import request from "@/axios/axios.js";
  import DialogUserInfo from '../dialog-user-info/DialogUserInfo';
  import tableBtn from '../littleStyle/tableBtn.vue';
  import moment from 'moment'
  export default {
    name: 'lotteryType',
    components: {
      tableBtn,
      DialogUserInfo
    },
    data() {
      return {
        index1: 0,
        index2: 0,
        gameid: "",
        lotteryList: "",
        titleName: '',
        routerArr: [],
        loading: false,
        pageNum: 1,
        pageSize: 40,
        total: 0,
        tableData: 0,
        lotteryTypeData: [],
        ip: '',
        duration: 1000,
        dialog: false,
        dialogIsShow: false,
        breadcrumbArr: [{name_en: 'ROOT', _id: ''}],
        first_id: '',
        showChild: false,
        showChildChild: false,
        currentRowId: '',
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'lotteryType');
      this.routerArr = data.routerArr;
      this.titleName = data.titleName;
      this.getLotteryTypeList();
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
      formatTime(row, column, cellValue) {
        return moment(cellValue).format('DD-MM-YYYY HH:mm:ss')
        // return moment(cellValue).format('DD-MM-YYYY')
      },
      getLotteryTypeList() {
        const vm = this;
        this.lotteryTypeData = [];
        request.http(
          'get',
          '/lottery/game/list', {},
          (success) => {
            vm.loading = false;
            // console.log('lotteryType--------', success);
            let code = success.returncode;
            if (code === 200) {
              vm.lotteryTypeData = success.data;
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
      handleEditEnabled(row, key, type) {
        const vm = this;
        let value = row[key];
        this.rowKey = row._id;
        if(type == 0){
          this.updateData(key, value, vm.getLotteryTypeList);
        }else{
          this.updateData(key, value, vm.handleGetChild, type);
        }
      },

      pushRouterTag(row, type) {
        if(type == 1){
          this.first_id = row._id;
        }
        row.childType = type;
        this.breadcrumbArr.push(row);
        this.currentRowId = row._id;
        this.handleGetChild(type)
      },

      handleGetChild(type) {
        const vm = this;
        this.lotteryTypeData = [];
        request.http(
          'get',
          '/lottery/list',
          {
            gameid: vm.currentRowId
          },
          (success) => {
            let code = success.returncode;
            if (code === 200) {
              vm.succee();
              if(type == 1){
                this.showChild = true;
                this.showChildChild = false;
              }else{
                this.showChild = false;
                this.showChildChild = true;
              }
              success.data.filter(v => {
                v.copy_min_bet = v.min_bet;
                v.copy_max_bet = v.max_bet;
                v.copy_total_bet = v.total_bet;
                v.copy_all_bet = v.all_bet;
              })
              vm.lotteryTypeData = success.data;
            } else if (code === 101 || code === 103 || code === 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.error();
            console.log(error)
          }
        )
      },

      handleEditName(row, key, type) {
        let value = row[key];
        const vm = this;
        this.rowKey = row._id;
        if(type == 0){
          this.first_id = row._id;
          this.updateData(key, value, vm.getLotteryTypeList);
        }else{
          this.updateData(key, value, vm.handleGetChild, type);
        }
      },
      handleMinBet(row, eve) {
        const vm = this;
        this.rowKey = row._id;
        let copy = row.copy_min_bet;
        let realy = row.max_bet;
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
          row.copy_min_bet = 1;
          eve.target.value = 1;
        }
        this.updateData('min_bet', row.copy_min_bet, vm.handleGetChild, '2')
      },
      handleMaxBet(row, eve) {
        const vm = this;
        this.rowKey = row._id;
        let copy = row.copy_max_bet;
        let realy = row.total_bet;
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
        this.updateData('max_bet', row.copy_max_bet, vm.handleGetChild, '2')
      },
      handleTotalBet(row, eve) {
        const vm = this;
        this.rowKey = row._id;
        let copy = row.copy_total_bet;
        let realy = row.max_bet;
        let realy2 = row.all_bet;
        if(isNaN(copy)){
          this.message("ILLEGAL", "error");
          return false;
          copy = 0;
        }
        if(copy <= realy){
          this.message("ILLEGAL", "error");
          return false;
          row.copy_total_bet = realy;
          eve.target.value = realy;
        }
        if(copy >= realy2){
          this.message("ILLEGAL", "error");
          return false;
          row.copy_total_bet = realy2;
          eve.target.value = realy2;
        }
        this.updateData('total_bet', row.copy_total_bet, vm.handleGetChild, '2')
      },
      handleAllBet(row, eve) {
        const vm = this;
        this.rowKey = row._id;
        let copy = row.copy_all_bet;
        let realy = row.total_bet;
        if(isNaN(copy)){
          this.message("ILLEGAL", "error");
          return false;
          copy = 0;
        }
        if(copy <= realy){
          this.message("ILLEGAL", "error");
          return false;
          row.copy_total_bet = realy;
          eve.target.value = realy;
        }
        this.updateData('all_bet', row.copy_all_bet, vm.handleGetChild, '2')
      },
      updateData(key, value, callback, callCan1) {
        const vm = this;
        let data = {};
        data[key] = value;
        data.id = vm.rowKey;
        data.delId = vm.first_id;
        request.http(
          'post',
          '/lottery/update',
          data,
          (success) => {
            let code = success.returncode;
            if (code == 200) {
              callback(callCan1);
            } else if (code == 101 || code == 103 || code == 106) {
              request.loginAgain(vm)
            }
          },
          (error) => {
            vm.error();
            console.log(error)
          }
        )
      },
      
      // 面包屑
      handleClickTag(tag) {
        if(tag.name_en == 'ROOT'){
          this.breadcrumbArr = [];
          this.breadcrumbArr.push(tag);
          this.showChild = false;
          this.showChildChild = false;
          this.getLotteryTypeList();
        }else{
          let index;
          this.breadcrumbArr.filter((v, vi) => {
            if(v._id === tag._id){
              index = vi;
            }
          })
          if(index == (this.breadcrumbArr.length-1)){
            // 点击当前的用户
          }else{
            // 点击上一层用户
            let arr = this.breadcrumbArr.splice(0, Number(index));
            this.breadcrumbArr = [];
            this.breadcrumbArr.push(...arr, tag);
            this.currentRowId = tag._id;
            this.handleGetChild(tag.childType);
          }
        }
      },
    }
  }

</script>
<style lang="scss" scoped>
.tag-router{
  padding:20px;
  background:#fff;
  text-align:left;
}
</style>
