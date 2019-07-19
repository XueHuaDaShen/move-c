<template>
  <div>
    <div class="content-header el-custom">
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
                <td><label>User：</label></td>
                <td>
                  <div class="search-inner-wrap" style="margin-bottom:0;">
                    <el-input style="width:140px" v-model.trim="username" placeholder="user" clearable></el-input>
                    <el-button :type="check.ok ? 'success' : 'danger'" :loading="check.loading" :icon="check.ok ? 'el-icon-check' : ''" @click="checkUser" size="medium" class="small" :class="check.ok?'edit':'yes'">Check</el-button>
                  </div>
                </td>
              </tr>
              <tr v-if="check.ok">
                <td><label>Order：</label></td>
                <td>
                  <div class="search-inner-wrap" style="margin-bottom:0;">
                    <el-button type="danger" @click="showOrder" size="medium" class="small yes">Create</el-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="data-table el-custom" v-if="tableList.data.length">
      <div class="table-list" v-for="(order, oi) in tableList.data" :key="oi">
        <div class="search-inner-wrap">
          <label>Order {{oi*1+1}}</label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-button @click="showNumberDialog(order, 5)" class="small yes">中奖号</el-button>
          <el-button @click="showNumberDialog(order, 4)" class="small no">非中奖号</el-button>
        </div>
        <el-table
          :data="order.data"
          style="width: 100%">
          <el-table-column
            prop="number"
            label="Number">
          </el-table-column>
          <el-table-column
            prop="time"
            label="Time">
          </el-table-column>
          <el-table-column
            prop="name_cn"
            label="Name">
          </el-table-column>
          <el-table-column
            prop="parent"
            label="Parent">
          </el-table-column>
          <el-table-column
            prop="cash"
            label="Bet Amount">
          </el-table-column>
          <el-table-column
            prop="realCash"
            label="Real Bet Amount">
          </el-table-column>
          <el-table-column
            prop="discount"
            label="Discount">
          </el-table-column>
          <el-table-column
            prop="prize"
            label="Prize">
          </el-table-column>
          <el-table-column
            prop="reward"
            label="Reward">
          </el-table-column>
        </el-table>
      </div>
      <el-button type="danger" @click="toIfream(false)" size="medium" class="small yes">Product view</el-button>
    </div>
    <div class="el-custom">
      <el-dialog title="Create Order" :before-close="closeOrder" :visible.sync="dialogVisibleOrder">
        <div class="body-middle">
          <div class="form">
            <div class="form-row">
              <span class="exp">Lotto</span>
              <span class="exp-after">：</span>
              <el-select style="width:140px" v-model="type.value" clearable placeholder="please select" class="small" @focus="typeFocus()" @change="typeChange">
                <el-option v-for="(item,index) in type.options" :key="index" :label="item.name_en" :value="item._id +'-'+ item.name_cn">
                </el-option>
              </el-select>
            </div>
            <div class="form-row">
              <span class="exp">Issue</span>
              <span class="exp-after">：</span>
              <el-input type="text" clearable placeholder="Issue" v-model.number="form.lotteryNo.value"></el-input>
              <el-button type="danger" style="margin-left:20px;" @click="getStopTime" size="medium" class="small yes">Check</el-button>
              <!-- <el-select style="width:140px" v-model="form.lotteryNo.value" clearable placeholder="please select" @change="getStopTime" class="small">
                <el-option v-for="(item,index) in issueData" :key="index" :label="item" :value="item">
                </el-option>
              </el-select> -->
            </div>
            <div class="form-row">
              <span class="exp">Winning Number</span>
              <span class="exp-after">：</span>
              <el-input readonly type="text" v-model.trim="lotteryNum"></el-input>
            </div>
            <div class="form-row">
              <span class="exp">Time</span>
              <span class="exp-after">：</span>
              <el-time-picker
                v-model="createTime"
                :picker-options="{
                  selectableRange: betTime
                }"
                placeholder="Time">
              </el-time-picker>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="createOrder" class="yes">Confirm</el-button>
          <el-button @click="closeOrder" class="no">Cancel</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="el-custom">
      <el-dialog title="Create Bet Number" :before-close="closeNumber" :visible.sync="dialogVisibleNumber">
        <div class="body-middle">
          <div class="form">
            <div class="form-row">
              <span class="exp">Kind</span>
              <span class="exp-after">：</span>
              <el-select v-model="playKindId" @change="getCurrentLimit" placeholder="please select">
                <el-option-group
                  v-for="group in playKindList"
                  :key="group._id"
                  :label="group.name_th + ' ' + group.name_cn">
                  <el-option
                    v-for="item in group.children"
                    :key="item._id"
                    :label="item.name_th + ' ' + item.name_cn"
                    :value="item._id">
                  </el-option>
                </el-option-group>
              </el-select>
            </div>
            <div class="form-row">
              <span class="exp">Number</span>
              <span class="exp-after">：</span>
              <el-input style="width:140px" v-model="betNumber" placeholder="Number" clearable></el-input>
            </div>
            <div class="form-row">
              <span class="exp">Cash</span>
              <span class="exp-after">：</span>
              <el-input style="width:140px" v-model.number="betCash" placeholder="Cash" clearable></el-input>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="orderDataPushNumber" class="yes" :loading="orderLoading">Confirm</el-button>
          <el-button @click="closeNumber" class="no">Cancel</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import request from "@/axios/axios.js";
import moment from 'moment'
import { setTimeout } from 'timers';
export default {
  name: 'lotteryDelay',
  components: {},
  data() {
    return {
      index1: 0,
      index2: 0,
      titleName: '',
      routerArr: [],

      loading: false,

      tableList: {
        username: '',
        cash: '999',
        data: []
      },
      currentOrder: null, // 正在创建的订单
      orderNumArr: [], // 订单号集合，用来判断订单号不能重复
      numberStatus: '', // 创建的每个号码的状态 5,4 中奖或不中

      playKindList: [],
      playKindId: '',
      betNumber: '',
      betCash: '',

      username: '',

      duration: 1000,
      orderLoading: false,
      dialogVisibleOrder: false,
      dialogVisibleNumber: false,
      check: {
        ok: false,
        loading: false,
        type: 'success'
      },

      type: {
        value: "",
        text: '',
        options: [],
        loading: false,
        loadingText: "Loading...",
      },
      lotteryType: {
        value: "",
        text: '',
        options: [],
      },
      form: {
        lotteryKind: {
          options: [],
          value: "",
          loading: false,
          loadingText: "Loading...",
        },
        lotteryNo: {
          options: [],
          value: "",
          text: '',
          loading: false,
          loadingText: "Loading...",
          placeholder: "please select an issue"
        }, // 彩期
        awardNo: "" //彩票号码
      },
      lotteryNumArr: [],
      lotteryNum: '', // 开奖号码
      issueData: [],
      stop_at: '',
      createTime: '',

      limitsData: [],
      currentLimit: null,
      betTime: '', // 投注时间区间 字符串，例：'18:30:00 - 20:30:00'
    }
  },
  created() {
    this.routerArr = [];
    let query = this.$route.query;
    this.index1 = Number(query.index1);
    this.index2 = Number(query.index2);
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'pageViewer');
    this.routerArr = data.routerArr;
    this.titleName = data.titleName;
    this.toIfream(true)
  },
  methods: {
    // 降序
    descOrder(arr) {
      return arr.sort((a, b) => {return b-a})
    },
    // 判断当前地址，跳转
    toIfream(isLoadUrl) {
      // isLoadUrl 仅仅用来第一次加载iframe url
      const vm = this;
      let host = window.location.host;
      let url;
      if(host.indexOf('localhost') > -1){
        // 本地测试
        // url = 'http://localhost:8082/#/betRecord?create_f_d_template=true';
        url = 'http://www.kinglotto9.com/#/betRecord?create_f_d_template=true';
      }else if(host.indexOf('kinglotto9') < 0){
        // 线下测试
        url = 'http://123.56.6.6:4040/#/betRecord?create_f_d_template=true';
      }else{
        // 线上
        url = 'http://www.kinglotto9.com/#/betRecord?create_f_d_template=true';
      }
      var countCash = function(data, key) {
        let result;
        if(data.length === 0){
          result = '';
        }
        if(data.length === 1){
          result = data[0][key];
        }else{
          let num = 0;
          for(let i in data){
            if(data[i] && data[i][key]){
              num += Number(data[i][key])
            }
          }
          result = num;
        }
        return result
      }
      if(!isLoadUrl) {
        vm.tableList.data.filter(order => {
          //parent, parent_th, cash, realCash, prize
          if(order.data.length){
            order.parent = order.data[0].parent;
            order.parent_th = order.data[0].parent_th;
            order.cash = countCash(order.data, 'cash')
            order.realCash = countCash(order.data, 'realCash')
            order.prize = countCash(order.data, 'prize')
          }
        })
      }
      let data = {
        show: !isLoadUrl,
        url: url,
        data: vm.tableList
      }
      // console.log(data)
      this.$store.dispatch("setIframeJson", data);
    },
    // 检查用户是否存在
    checkUser() {
      const vm = this;
      if(!vm.username){
        vm.message('please input the user', 'error');
        return
      }
      this.check.ok = false;
      this.check.loading = true;
      // setTimeout(() => {
      //   vm.check.ok = true;
      //   vm.check.loading = false;
      // }, 1500)
      request.http(
        'post',
        '/user/check',
        {
          loginname: vm.username
        },
        (success) => {
          let code = success.returncode;
          // console.log(success)
          if (code === 200) {
            vm.check.ok = true;
            vm.check.loading = false;
            vm.getUserDiscount();
          } else if (code === 201) {
            vm.message(success.data, 'error');
            vm.check.ok = false;
            vm.check.loading = false;
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm)
          }
        },
        (error) => {
          vm.message(error, 'error');
          vm.check.ok = false;
          vm.check.loading = false;
        }
      )
    },
    // 获取用户的 折扣
    getUserDiscount() {
      const vm = this;
      request.http(
        'get',
        '/lottery/limits',
        {superiorname: vm.username},
        success => {
          let code = success.returncode;
          if(code == 200){
            vm.limitsData = success.data;
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm)
          }else{
            vm.limitsData = [];
          }
        },
        error => {}
      )
    },
    // 显示订单弹框
    showOrder() {
      this.tableList.username = this.username;
      this.dialogVisibleOrder = true;
      this.resetOrder();
    },
    // 关闭订单弹框
    closeOrder() {
      this.dialogVisibleOrder = false;
      this.resetOrder();
    },
    // 重置订单
    resetOrder() {
      this.form.lotteryNo.value = '';
      this.type.value = '';
      this.createTime = '';
      this.stop_at = '';
      this.lotteryNum = '';
    },
    // 获取每一期的投注截止时间
    getStopTime() {
      const vm = this;
      request.http(
        'get',
        '/lottery/issue/stop/time', {
          gameid: vm.type.value.split('-')[0],
          issue_no: vm.form.lotteryNo.value,
        },
        (success) => {
          let code = success.returncode;
          if (code === 200) {
            if(!success.data.is_opened){
              vm.message('The current issue number is not open', 'error');
            }else{
              vm.stop_at = success.data.stop_at;
              vm.setBetTime(vm.stop_at);
              vm.lotteryNum = success.data.luck_no;
            }
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm)
          } else {
            vm.message('error', 'error');
          }
        },
        (error) => {
          // vm.type.loading = false;
        }
      )
    },
    splitLotteryNum(num) {
      let str = num.slice(0, 3) +'-'+ num.slice(num.length-3);
      return str;
    },
    // 创建订单，获取每一期的投注截止时间
    createOrder() {
      const vm = this;
      let gameid = vm.type.value.split('-')[0];
      let issue_no = vm.form.lotteryNo.value;
      // let numArr = [];
      // let isOk = this.lotteryNumArr.every(v => v.value.length==v.max);
      // this.lotteryNumArr.filter(v => {
      //   let str;
      //   if(v.max == 6){
      //     str = vm.splitLotteryNum(v.value);
      //   }else{
      //     str = v.value;
      //   }
      //   numArr.push(str);
      // })
      if (!gameid) {
        vm.message('please select lotto', "warning");
        return;
      }
      if (!issue_no) {
        vm.message('please select an issue', "warning");
        return;
      }
      if (!vm.createTime) {
        vm.message('please choose the betting time.', "warning");
        return;
      }
      if (!vm.lotteryNum) {
        vm.message('Please set the lottery number.', "error");
        // vm.message('Winning number should be separated by comma', "error");
        return;
      }
      let parent = ''; // 父级玩法 中文名
      let parent_th = ''; // 泰文名
      let cash = ''; // 投注金额
      let realCash = '' // 实际投注额
      let prize = '' // 中奖金额
      let status = 1; // 已开奖
      let time = moment(new Date(vm.createTime)).format('YYYY/MM/DD hh:mm:ss');
      let order_no = this.proOrderNum(time);
      
      let option = {
        order_no, // 订单号
        parent, // 彩种
        parent_th,
        issue_no, // 期号
        cash,
        realCash,
        prize,
        status,
        gameid: gameid,
        lotteryNum: vm.lotteryNum,
        time,
        data: [],
      }
      vm.orderPushData(option);
      this.dialogVisibleOrder = false;
    },
    orderPushData(option) {
      this.tableList.data.push(option);
    },
    // 设置投注时间，投注截止时间前5分钟
    setBetTime(stop_at) {
      let minutes = 5; // 分钟
      let ss = minutes*60*1000; // 毫秒
      let end = new Date(stop_at)*1;
      let begin = end - ss;
      this.createTime = new Date(begin);
      // 投注时间区间 字符串，例：'18:30:00 - 20:30:00'
      this.betTime = moment(new Date(begin)).format('HH:mm:ss') + ' - ' + moment(new Date(end)).format('HH:mm:ss');
    },
    // 获取玩法 kind
    getPlayKind(order) {
      const vm = this;
      request.http(
        'get',
        '/lottery/detail',
        {
          gameid: order.gameid
        },
        success => {
          if(success.returncode == 200){
            vm.playKindList = success.data.children;
          }else{
            vm.playKindList = [];
          }
          // console.log(success)
        },
        error => {}
      )
    },
    // 选择玩法，获取当前的折扣
    getCurrentLimit(val) {
      this.currentLimit = this.limitsData.filter(item => {return item._id === val});
    },
    // 显示创建号码的弹框
    showNumberDialog(order, status) {
      // status 5: 中奖号码, 4: 非中奖号码;
      this.getPlayKind(order);
      this.currentOrder = order;
      this.numberStatus = status;
      this.dialogVisibleNumber = true;
      this.lotteryNumArr = [];
      this.lotteryNum = '';
      this.resetNumber();
    },
    // 关闭创建号码的弹框
    closeNumber() {
      this.currentOrder = null;
      this.numberStatus = '';
      this.dialogVisibleNumber = false;
      this.resetNumber();
    },
    // 重置号码
    resetNumber() {
      this.playKindId = "";
      this.betCash = "";
      this.betNumber = "";
    },
    // 创建号码
    orderDataPushNumber() {
      const vm = this;
      if (!vm.playKindId) {
        vm.message('Please select kind', "warning");
        return;
      }
      if (!vm.betNumber) {
        vm.message('Please enter the number.', "warning");
        return;
      }
      if (!vm.betCash) {
        vm.message('Please enter the amount', "warning");
        return;
      }
      let discount = this.currentLimit[0].discount; // 折扣
      let name_cn = this.currentLimit[0].name_cn; // 玩法 中文名
      let name_th = this.currentLimit[0].name_th; // 泰文名
      let parent = this.currentLimit[0].parent; // 父级玩法 中文名
      let parent_th = this.currentLimit[0].parent_th; // 泰文名
      let cash = this.betCash; // 投注金额
      let number = this.betNumber; // 投注号码
      let realCash = cash*(100-discount)/100 // 实际投注额
      let lotteryNum = this.currentOrder.lotteryNum; // 中奖号码
      let prize = this.numberStatus === 5 ? this.currentLimit[0].prize * cash : 0; // 中奖金额
      let reward = prize - realCash; // 盈亏
      let time = moment(new Date(vm.currentOrder.time)).format('YYYY/MM/DD hh:mm:ss');
      let status = this.numberStatus; // 号码状态
      this.currentOrder.data.push({
        discount,
        name_cn,
        name_th,
        parent,
        parent_th,
        number,
        cash,
        realCash,
        lotteryNum,
        prize,
        reward,
        time,
        status
      })
      this.dialogVisibleNumber = false;
    },
    // 生成订单号
    proOrderNum(time) {
      let num = time.replace(/[\/\s\:]/g, '').substr(2);
      let suiji = this.randomNum();
      return num+suiji;
    },
    // 随机五位数字
    randomNum(len=5) {
      let arr = [];
      let orderNum = this.orderNumArr;
      for(let i=0; i<len; i++){
        let num = Math.floor(Math.random()*10); // 0-9
        arr.push(num);
      }
      let suiji = arr.join('');
      if(orderNum.indexOf(suiji) < 0){
        this.orderNumArr.push(suiji)
      }
      return suiji;
    },
    //
    message(text, type) {
      const vm = this
      this.$message({
        message: text,
        type: type,
        duration: vm.duration,
        center: true
      })
    },
    typeFocus() {
      if (this.type.options.length === 0) {
        this.getType();
      }
    },
    //彩票种类
    getType() {
      const vm = this;
      vm.type.loading = true;
      request.http(
        'get',
        '/lottery/game/list', {},
        (success) => {
          vm.type.loading = false;
          let code = success.returncode;
          if (code === 200) {
            vm.type.options = success.data;
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm)
          }
        },
        (error) => {
          vm.type.loading = false;
        }
      )
    },
    typeChange(value) {
      this.form.lotteryNo.value = '';
      if (value) {
        let obj = {};
        obj = this.type.options.find((item) => {
          return item._id === value.split('-')[0];
        });
        // this.getIssueData();
        this.type.text = obj.name;
        this.lotteryType.options = obj.childLotterys;
        this.lotteryType.value = '';
        this.lotteryType.text = '';
      } else {
        this.type.text = '';
        this.lotteryType.options = [];
        this.lotteryType.value = '';
        this.lotteryType.text = '';
        this.issueData = [];
      }
      let type = value.split('-')[1];
      this.lotteryNumArr = [];
      this.lotteryNum = '';
      this.createTime = '';
      if(type === '泰国官方彩'){
        for(let i=0; i<3; i++){
          this.lotteryNumArr.push({
            max: 6,
            value: ''
          })
        }
        this.lotteryNumArr.push({
          max: 2,
          value: ''
        })
      }else{
        this.lotteryNumArr.push({max: 3, value: ''}, {max: 2, value: ''})
      }
    },
    getIssueData() {
      const vm = this;
      request.http(
        'get',
        '/lottery/issue/three',
        {
          PageNum: 1,
          PageSize: 1000000,
          id: vm.type.value.split('-')[0],
        },
        success => {
          if(success.returncode == 200){
            vm.issueData = vm.descOrder(success.data);
          }else{
            vm.issueData = [];
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
    },
  },
}

</script>
<style lang="scss" scoped>

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
.table-list{
  padding:10px 0;
  margin:10px 0;
  background:#fff;
  .search-inner-wrap{
    padding:10px 20px;
    text-align:left;
  }
}
</style>

