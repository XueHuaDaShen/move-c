<template>
  <div class="number-view">
    <div class="search-wrap">
      <div class="search-inner-wrap" style="text-align:right;">
        <label>Category：</label>
        <el-select v-model="play" clearable placeholder="all" class="small" @change="changePlayType">
          <el-option v-for="item in playType" :key="item._id" :label="item.name_en" :value="item._id">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="" v-loading="loading">
      <p class="no-result" v-if="showResult">No Result</p>
      <ul class="number-list" v-if="!showResult" :class="selectPercent">
        <li v-for="(item, i) in numberList" :key="i">
          <div class="cash" :class="setColor(item.cash)">
            <span class="cash">{{item.cash ? item.cash.amountBet : 0}}</span>
          </div>
          <div class="model">
            <div class="bj"></div>
            <div class="inner">
              <span class="number">Number: {{item.num}}</span>
              <span class="number">Cash: {{item.cash ? item.cash.amountBet : 0}}</span>
              <span class="number">Prize: {{item.cash ? item.cash.reward : 0}}</span>
              <span class="number">Discount: {{item.cash ? item.cash.validBet : 0}}</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="percent-size" v-if="!showResult">
        <div class="input-wrap">
          <input :class="'p'+pi+' '+((selectPercent.substr(-1) == pi && selectPercent) ? 'active':'')" @blur="selectPercent = ''" readonly v-for="(p, pi) in percent" :key="pi" @click="selectPercent = 'percent'+pi">
        </div>
        <div class="span-wrap">
          <span v-for="(p, pi) in percent" :key="pi">{{p}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import request from "@/axios/axios.js";
export default {
  name: 'overview',
  props: {
    searchData: {
      required: true
    },
    playType: {
      required: true
    },
  },
  data() {
    return {
      msg: 'nihao',
      loading: false,
      showResult: false,
      play: '',
      numberList: [],
      maxCash: 0,
      percent: [0, 1, 50, 90],
      selectPercent: '',
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    if(this.numberList.length === 0){
      this.showResult = true;
    }
    // this.setNumber()
    // this.getData();
  },
  watch: {},
  methods: {
    // 获取数据
    getData() {
      const vm = this;
      vm.loading = true;
      request.http(
        "get",
        "/analyze/lottery/voteno",
        {
          gameid: vm.searchData.gameid,
          issue_no: vm.searchData.issue_no,
          lotteryid: vm.play
        },
        success => {
          vm.loading = false;
          // console.log("getdata--------", success);
          let code = success.returncode;
          if (code === 200) {
            vm.setNumber(success.data)
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
    changePlayType(val) {
      // console.log('val', val);
      if (val) {
        this.getData();
      } else {
        // this.wanfalist.options = [];
        // this.lotteryid = "";
      }
    },
    setColor(cash) {
      // console.log(cash)
      let percent = 0;
      if(cash){
        percent = (cash.amountBet/this.maxCash*100).toFixed(2);
      }
      let color = 'p3';
      if(percent < 90){
        color = 'p2'
      }
      if(percent < 50){
        color = 'p1'
      }
      if(percent < 1){
        color = 'p0'
      }
      return color
    },
    randomCash() {
      return Math.floor(Math.random()*100);
    },
    setNumber(data) {
      if(data.length === 0){
        this.showResult = true;
        return
      }else{
        this.showResult = false;
      }
      this.numberList = [];
      for(let i=0; i<1000; i++){
        let num = i;
        if(i<100){
          num = '0'+i;
        }
        if(i<10){
          num = '00'+i;
        }
        let cash = data.filter(v => {return Number(v._id.vote_no) === Number(num)})[0];
        this.numberList.push({num: num.toString(), cash: cash})
      }
      this.maxCash = data.sort((p, c) => {return c.amountBet- p.amountBet})[0].amountBet;
    },
  }
}
</script>
<style lang="scss" scoped>
.p1{
  background:#fffc79;
}
.p2{
  background:#ff9300;
}
.p3{
  background:#ff2600;
}
.number-list{
  width:100%;
  border-left:1px solid #333;
  border-top:1px solid #333;
  display:table;
  li{
    float: left;
    width:49.33px;
    height:30px;
    position: relative;
    list-style: none;
    border-right:1px solid #333;
    border-bottom:1px solid #333;
    cursor: pointer;
    // &:first-child{
    //   .model{
    //     display:block;
    //   }
    // }
    &:hover{
      .model{
        display:block;
      }
    }
    .cash{
      width:100%;
      height:100%;
      color:#000;
      font-size:16px;
      line-height:30px;
    }
    .model{
      width:140px;
      height:122px;
      position: absolute;
      left:-45px;
      top:-130px;
      display: none;
      .bj{
        position: absolute;
        width:100%;
        height:100%;
        left:0;
        top:0;
        background:#000;
        border-radius:5px;
        opacity:.8;
        z-index:2;
      }
      .inner{
        padding:0 10px;
        position: absolute;
        left:0;
        top:0;
        text-align:left;
        // line-height:50px;
        color:#fff;
        font-size:16px;
        z-index:3;
        span{
          margin: 10px 0;
          display:block;
        }
      }
    }
  }
}
.percent0{
  .p0{
    box-shadow: 3px 3px 0 0 rgba(0,0,0,0.5) inset;
  }
}
.percent1{
  .p1{
    box-shadow: 3px 3px 0 0 rgba(0,0,0,0.5) inset;
  }
}
.percent2{
  .p2{
    box-shadow: 3px 3px 0 0 rgba(0,0,0,0.5) inset;
  }
}
.percent3{
  .p3{
    box-shadow: 3px 3px 0 0 rgba(0,0,0,0.5) inset;
  }
}
.percent-size{
  width:100%;
  margin-top:30px;
  background:#eee;
  display:table;
  position: relative;
  .input-wrap, .span-wrap{
    padding:30px 0;
    width:100%;
    height:100%;
    float: left;
    display:-webkit-box;
    -webkit-box-pack:center;
  }
  .input-wrap{
    position: relative;
    z-index:3;
  }
  .span-wrap{
    z-index:1;
    position: absolute;
    left:0;
    top:0;
  }
  span{
    display:block;
    width:80px;
    height:20px;
    text-align:left;
    line-height: 55px;
    color:#000;
    font-size:16px;
    cursor: pointer;
  }
  input{
    display:block;
    width:80px;
    height:20px;
    cursor: pointer;
    border:none;
    outline: none;
  }
  .active{
    border:1px solid #333;
  }
  .p0{
    background:#fff;
  }
}
</style>


