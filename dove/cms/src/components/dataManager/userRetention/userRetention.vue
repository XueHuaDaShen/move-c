<template>
  <div class="userRetention el-custom">
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
            <label>Period：</label>
            <el-date-picker format="dd-MM-yyyy" :picker-options="pickerOptions" placeholder="please select date" v-model="searchTime" type="date" align="right">
            </el-date-picker>
          </div>
          <div class="search-inner-wrap">
            <label>Channel：</label>
            <el-select clearable v-model="channel" placeholder="please select" class="small">
              <el-option v-for="item in channels" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-inner-wrap">
            <el-button type="danger" @click="handleSearch" size="medium" class="yes small">Search</el-button>
            <el-button type="info" @click="handleReset" size="medium" class="no small">Reset</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="data-table" v-loading="loading">
      <p class="no-result" v-if="noresult">No Result</p>
      <div class="container" v-if="!noresult">
        <div class="left" :class="scrollNum > 0 ? 'shadow' : ''">
          <ul>
            <li>
              <span class="date">Day</span>
              <span class="num">New</span>
            </li>
            <li v-for="(item, i) in dateTime" :key="i">
              <span class="date">{{moment(new Date(item.day)).format('DD-MM-YYYY')}}</span>
              <span class="num">{{item.value}}</span>
            </li>
          </ul>
        </div>
        <div class="right">
          <p class="prev-jiantou" v-show="scrollNum>0" @mousedown="scrollLeftFn" @mouseup="stopLeft">
            <i class="el-icon-arrow-left"></i>
          </p>
          <p class="next-jiantou" v-show="scrollNum<maxScrollNum" @mousedown="scrollRightFn" @mouseup="stopRight">
            <i class="el-icon-arrow-right"></i>
          </p>
          <ul id="scroll-wrap">
            <li>
              <span class="date" v-for="i in dateLength" :key="i">D{{i}}</span>
            </li>
            <li v-for="(num, i) in dateData" :key="i">
              <span class="num" :class="setColor(n)" v-for="(n, ni) in num" :key="ni">{{n === 'none' ? '' : n + '%'}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/axios/axios.js";
import moment from 'moment'
import {
  trim
} from '@/lib/utils/validator';
export default {
  name: 'refund',
  data() {
    return {
      moment: moment,
      index1: 0,
      index2: 0,
      titleName: '',
      routerArr: [],
      loading: false,
      pageNum: 1,
      pageSize: 40,
      total: 0,
      withdrawListData: [],
      searchTime: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      channels: [
        {
          value: 'all',
          label: 'All'
        },
        {
          value: 'king',
          label: 'king'
        }, {
          value: 'yyy',
          label: 'yyy'
        }
      ],
      scrollNum: 0,
      maxScrollNum: 0,
      leftScroll: null,
      rightScroll: null,
      noresult: true,
      channel: 'all',
      duration: 1000,
      dateLength: 0,
      dateTime: [],
      dateData: [],
    }
  },
  created() {
    this.routerArr = [];
    let query = this.$route.query;
    this.index1 = Number(query.index1);
    this.index2 = Number(query.index2);
    let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'userRetention');
    this.routerArr = data.routerArr;
    this.titleName = data.titleName;
    // 设置默认时间 30天以前
    let nowTime = new Date();
    this.searchTime = new Date(nowTime.getTime() - 3600 * 1000 * 24 * 30);
    this.getWithdrawLotList();

    // for(let i=1; i<31; i++){
    //   this.dateTime.push(i)
    // }
  },
  methods: {
    // 获取滚动区域当前 向左滚动的宽度
    getScrollNum() {
      const vm = this;
      let ele = document.getElementById('scroll-wrap');
      let w = ele.clientWidth; // 容器宽度
      let sw = ele.scrollWidth; // 滚动内容宽度
      this.maxScrollNum = sw - w;
      ele.onscroll = function(e) {
        vm.scrollNum = e.target.scrollLeft;
      }
    },
    // 向左滚动
    scrollLeftFn() {
      const vm = this;
      let ele = document.getElementById('scroll-wrap');
      this.leftScroll = setInterval(() => {
        if(vm.scrollNum <= 0){
          vm.stopLeft()
        }else{
          vm.scrollNum -= 10;
          ele.scrollLeft = vm.scrollNum;
        }
      }, 10)
    },
    // 停止左滚动
    stopLeft() {
      const vm = this;
      clearInterval(vm.leftScroll);
    },
    // 向右滚动
    scrollRightFn() {
      const vm = this;
      let ele = document.getElementById('scroll-wrap');
      this.rightScroll = setInterval(() => {
        if(vm.scrollNum >= vm.maxScrollNum){
          vm.stopRight()
        }else{
          vm.scrollNum += 10;
          ele.scrollLeft = vm.scrollNum;
        }
      }, 10)
    },
    // 停止右滚动
    stopRight() {
      const vm = this;
      clearInterval(vm.rightScroll);
    },
    // 格式化 日期时间，以及 每天的数据
    formatData(data) {
      if(data.length === 0){
        this.noresult = true;
        return
      }else{
        this.scrollLeftFn();
        this.noresult = false;
        this.$nextTick(this.getScrollNum)
      }
      let time = new Date(this.searchTime).getTime();
      let day = 3600 * 1000 * 24 * 1; // 一天的时间
      this.dateTime = [];
      this.dateData = [];
      let coll = 30;
      this.dateLength = data[0].num_remain_user.length;
      for(let i in data){
        let t = time + day*(i+1);
        this.dateTime.push({day: data[i].day, value: data[i].num_new_user});
        let arr = [];
        let end = data[0].num_remain_user.length
        for(let j=0; j<end; j++){
          let remain = data[i].num_remain_user;
          let len = remain.length;
          if(j < len){
            arr.push(remain[j]&&data[i].num_new_user ? Math.round((remain[j]/data[i].num_new_user)*100) : 0)
          }else{
            arr.push('none')
          }
        }
        this.dateData.push(arr);
      }
    },
    // 
    setColor(num) {
      let color;
      if(num === 'none'){
        color = 'none';
      }else{
        color = 'percent50'
        if(num < 50){
          color = 'percent30'
        }
        if(num < 30){
          color = 'percent10'
        }
        if(num < 10){
          color = 'default'
        }
      }
      return color
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
    formatTime(row, column, cellValue) {
      if (cellValue) {
        return moment(cellValue).format('DD-MM-YYYY')
      }
      return "--"
    },
    getWithdrawLotList() {
      const vm = this;
      vm.loading = true;
      let time;
      if(vm.searchTime){
        time = moment(vm.searchTime).format('YYYY-MM-DD')
      }else{
        time = '';
      }
      request.http(
        'get',
        '/user/daily/active/list', {
          start_at: time,
          dataType: '2',
          channel: vm.channel,
        },
        (success) => {
          vm.loading = false;
          // console.log('withdrawLotList--------', success);
          let code = success.returncode;
          if (code === 200) {
            vm.formatData(success.data)
            vm.success();
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm)
          } else {
            vm.formatData([])
          }
        },
        (error) => {
          vm.loading = false;
          vm.error();
          console.log(error)
        }
      )
    },
    handleReset() {
      this.searchTime = '';
      this.channel = 'all';
    },
    handleSearch() {
      this.pageNum = 1;
      this.getWithdrawLotList();
    },
  },
  mounted() {
    const vm = this;
    window.onresize = function() {
      vm.getScrollNum();
    }
  },
  watch: {}
}

</script>
<style>
  /* @import '../../publicCss/header.css'; */

  .userRetention .el-form-item__content {
    text-align: left;
  }

  .userRetention .flex-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .userRetention .flex-row>button {
    flex: 1;
    padding: 0;
  }

</style>

<style scoped lang="scss">
.container{
  display:-webkit-box;
  background:#fff;
  font-size:12px;
  ul,li{
    list-style: none;
  }
  li{
    display:-webkit-box;
    color:#1b1b1b;
    &:first-child{
      span{
        margin-top:0;
      }
    }
    span{
      text-align:center;
      height:40px;
      line-height:40px;
      display:block;
      margin-top:7px;
    }
  }
  .shadow{
    box-shadow: 2px 0 3px -1px rgba(0, 0, 0, 0.08);
  }
  .left{
    width:200px;
    position: relative;
    z-index:5;
    .date{
      width:60%;
    }
    .num{
      -webkit-box-flex:1;
    }
  }
  .right{
    -webkit-box-flex:1;
    position: relative;
    .prev-jiantou, .next-jiantou{
      position: absolute;
      top:0;
      background:#fff;
      width:50px;
      height:40px;
      line-height:40px;
      color:#409EFF;
      font-size:20px;
      cursor: pointer;
    }
    .prev-jiantou{
      left:0;
    }
    .next-jiantou{
      right:0;
    }
    ul{
      width:100%;
      overflow:scroll;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    span{
      width:50px;
    }
    li{
      span{
        margin-left:7px;
        &:last-child{
          margin-right:7px;
        }
      }
    }
    li{
      &:last-child{
        span{
          margin-bottom:7px;
        }
      }
    }
    .default{
      background:#f8f8f8;
    }
    .percent50{
      background:#F56C6C;
    }
    .percent30{
      background:#faecd8;
    }
    .percent10{
      background:#b3d8ff;
    }
    .none{
      border:2px solid #f8f8f8;
    }
  }
}
</style>
