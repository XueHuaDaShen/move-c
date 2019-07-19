<template>
  <div class="lottery-vue" :class="copy_lottery.status == 0?'background-none':''" @click="toDetail(copy_lottery)">
    <h2 class="lottery-name">{{$t("message."+copy_lottery.code)}}</h2>
    <p v-if="copy_lottery.name_cn === '时时彩' && !pre_countDownTime" class="lottery-issue m-t20">{{$t("message.quan_tian_96")}}</p>
    <!-- <p v-if="copy_lottery.name_cn !== '时时彩' || pre_countDownTime" :class="copy_lottery.name_cn === '时时彩' ? 'm-t20' : 'm-t10'" class="lottery-issue">{{$t("message.di")+copy_lottery.issue.issue_no+$t("message.qi")}}</p> -->
    <p v-if="copy_lottery.issue.openTime" class="lottery-endTime m-t20">{{$t("message.jie_zhi_shi_jian")}}</p>
    <p v-if="copy_lottery.issue.openTime" class="lottery-endTime">{{moment(copy_lottery.issue.openTime).format('DD-MM-YYYY')}}</p>
    <p v-if="copy_lottery.issue.openTime" class="lottery-endTime">{{moment(copy_lottery.issue.openTime).format('HH:mm:ss')}}</p>
    <p v-else class="lottery-endTime hour">24 {{$t("message.hour")}}</p>
    <p v-if="copy_lottery.status != 0" class="lottery-time m-t15">
      <span class="shutdown" v-if="countDownTime.hour==0&&countDownTime.min==0&&countDownTime.sec==0">{{$t("message.shutdown")}}</span>
      <span v-else style="width:100%;display: -webkit-box;-webkit-box-pack: center;">
        <img src="@/assets/img/time.png" class="time-icon">
        <span>{{formatTimeFn(countDownTime.hour)}}:{{formatTimeFn(countDownTime.min)}}:{{formatTimeFn(countDownTime.sec)}}</span>
      </span>
    </p>
    <p :class="copy_lottery.name_cn === '时时彩' ? 'm-t20' : 'm-t15'" v-if="copy_lottery.status == 0" class="lottery-time"><span class="shutdown">{{$t("message.no_open")}}</span></p>
  </div>
</template>
<script>
  import moment from "moment";
  export default {
    name: 'lottery',
    components: {},
    props: {
      lottery: {
        type: Object,
        required: true
      },
      yes: {},
      buyHistoryNum: {}
    },
    data() {
      return {
        consoleFn: this.$store.state.consoleFn,
        copy_lottery: {},
        moment: moment,
        countDownTime: '',
        pre_countDownTime: '',
        key_lang: '',
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      let local_lang = this.$i18n.locale;
      if (local_lang === 'th') {
        this.key_lang = 'name_th';
      } else {
        this.key_lang = 'name_cn';
      }
      for (let i in this.lottery) {
        this.copy_lottery[i] = this.lottery[i];
      }
    },
    mounted() {
      this.pre_countDownTime = this.lottery.issue.nextTime;
      this.getCountDownTime(this.lottery.issue.countdown);
      if(this.yes){
        this.toDetail(this.copy_lottery, this.buyHistoryNum.orderid)
      }
      // this.newIssueInterval();
    },
    methods: {
      newIssueInterval() {
        const vm = this;
        this.$http.get('/lottery/latest/issue', {
          params: {
            gameid: vm.copy_lottery._id,
            preIssue: vm.copy_lottery.preIssue || ''
          }
        }).then(res => {
          let code = res.data.returncode;
          if (code == 200) {
            let data = res.data.data;
            for (let i in this.copy_lottery.issue) {
              if (data[i]) {
                this.copy_lottery.issue[i] = data[i];
              } else {
                this.copy_lottery.issue[i] = this.lottery.issue[i];
              }
            }
            this.pre_countDownTime = data.nextTime;
            this.getCountDownTime(data.countdown)
          }
          this.consoleFn(res, this.copy_lottery)
        }).then(err => {})
      },
      // 获取倒计时的开始时间
      getCountDownTime(s) {
        // let s = 499;
        // var t;
        if(s<0){
          var hour = 0;
          var min = 0;
          var sec = 0;
          this.countDownTime = {
            hour,
            min,
            sec
          }
          return false;
        }
        s = Math.floor(s);
        if (s > -1) {
          var hour = Math.floor(s / 3600);
          var min = Math.floor(s / 60) % 60;
          var sec = s % 60;
          this.countDownTime = {
            hour,
            min,
            sec
          }
        }
        // this.pre_countdownFn();
        this.startTime()
        // return t;
      },
      //格式化 时分秒
      formatTimeFn(time) {
        let t;
        if (time < 10) {
          t = '0' + time;
        } else {
          t = time;
        }
        return t;
      },
      // 上一轮倒计时
      pre_countdownFn() {
        if(!this.pre_countDownTime){
          return false;
        }
        const vm = this;
        let time = this.pre_countDownTime*1;
        let set_st = setInterval(() => {
          time --;
          if(time == 0){
            clearInterval(set_st)
            vm.newIssueInterval();
          }
        }, 1000);
      },
      // 开始计时
      startTime() {
        const vm = this;
        let {
          hour,
          min,
          sec
        } = this.countDownTime;
        if (hour === 0 && min === 0 && sec === 0){
          return false;
        }
        let st = setInterval(() => {
          sec--;
          if (sec < 0 && min > 0) {
            min--;
            sec = 59;
          } else if (min <= 0 && hour > 0) {
            hour--;
            min = 59;
            sec = 59;
          }
          vm.countDownTime = {
            hour,
            min,
            sec
          };
          if (hour === 0 && min === 0 && sec === 0) {
            clearInterval(st)
            // clearInterval(vm.myInterval);
            // vm.getNewIssue();
            if(this.pre_countDownTime){
              return false;
            }
            vm.newIssueInterval();
          }
        }, 1000)
      },
      toDetail(lottery, orderid) {
        let id = lottery._id;
        this.consoleFn(lottery)
        if (lottery.issue.closed == 1) {
          return false;
        }
        // this.$store.dispatch('setBetModel', true)
        // this.$store.dispatch('setIssue', lottery.issue.issue_no);
        // this.$store.dispatch('setLotteryName', lottery[this.key_lang]);
        let {
          hour,
          min,
          sec
        } = this.countDownTime;
        sessionStorage.setItem('candy-countDownTime', JSON.stringify(this.countDownTime))
        // if (hour === 0 && min === 0 && sec === 0){
        //   sessionStorage.setItem('candy-countDownTime', JSON.stringify(this.countDownTime))
        // }else{
        //   // this.countDownTime.min = this.countDownTime.min*1+2;
        //   sessionStorage.setItem('candy-countDownTime', JSON.stringify(this.countDownTime))
        // }
        if(lottery.name_cn === '时时彩'){
          this.$router.push({
            name: 'sscList',
            query: {
              gameid: id,
              code: lottery.code,
              name_cn: lottery.name_cn,
              name_th: lottery.name_th
            }
          })
        }else{
          this.$router.push({
            name: 'lotteryDetail',
            query: {
              id: id,
              lotteryName: lottery.name_cn,
              lotteryName_th: lottery.name_th,
              issue: lottery.issue.issue_no,
              status: lottery.status,
              orderid: orderid
              // countdown: this.countDownTime
            }
          })
        }
        // if(this.pre_countDownTime != '' && this.pre_countDownTime != undefined && hour === 0 && min === 0 && sec === 0){
        //   this.$router.push({
        //     name: 'betsDetail',
        //     query: {
        //       gameid: id,
        //       issue_no: lottery.issue.issue_no,
        //       // countdown: this.countDownTime
        //     }
        //   })
        // }else{
        //   this.$router.push({
        //     name: 'lotteryDetail',
        //     query: {
        //       id: id,
        //       lotteryName: lottery.name_cn,
        //       issue: lottery.issue.issue_no,
        //       // countdown: this.countDownTime
        //     }
        //   })
        // }
      }
    },
  }

</script>
<style lang="scss" scoped>
  .lottery-vue{
    font-family: PingFangSC-Medium;
    width: 278px;
    height:252px;
    padding:0 3px;
    background:url(../../assets/img/home-nav/lottery-bj.png) no-repeat;
    background-size:100% 100%;
  }
  .background-none{
    background:url(../../assets/img/lottery-bj-ed.png) no-repeat;
    background-size:100% 100%;
  }
  .lottery-name {
    height: 65px;
    line-height: 65px;
    text-align: center;
    font-size: 18px;
    color: #4B77BE;
    border-bottom: 1px solid #D0D0D0;
    font-weight: normal;
  }
  .m-t10{
    margin-top:10px;
  }
  .m-t15{
    margin-top:15px;
  }
  .m-t20{
    margin-top:20px;
  }

  .lottery-issue {
    text-align: center;
    font-size: 16px;
    color: #191919;
  }

  .lottery-endTime {
    width:100%;
    font-size: 16px;
    color: #191919;
    text-align: center;
    // max-width: 156px;
  }
  .hour{
    font-size:26px;
    color:#EB5228;
    margin-top:5px !important;
  }

  .lottery-time {
    font-size: 26px;
    color: #EB5228;
    display: -webkit-box;
    -webkit-box-pack: center;

    span {
      display: block;
    }

    .time-icon {
      width: 28px;
      height: 28px;
      display:inline-block;
      margin-right: 5px;
      margin-bottom:-5px;
    }
    
    .shutdown{
      // padding:5px 20px;
      font-size:26px;
      color:#EB5228;
      // background:#ccc;
    }
  }

  @media screen and (max-width: 660px) {
    .lottery-vue{
      width:165px;
      height:168px;
    }
    .lottery-name {
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      color: #4B77BE;
      border-bottom: 1px solid #D0D0D0;
      font-weight: normal;
    }
    .m-t10{
      margin-top:5px;
    }
    .m-t20{
      margin-top:10px;
    }
    .lottery-issue {
      font-size: 13px;
    }
    .lottery-endTime {
      font-size: 12px;
    }
    .hour{
      font-size:18px;
      color:#EB5228;
    }
    .lottery-time {
      font-size: 17px;
      color: #EB5228;
      display: -webkit-box;
      -webkit-box-pack: center;

      span {
        display: block;
      }

      .time-icon {
        width: 18px;
        height: 18px;
        margin-right: 5px;
        margin-bottom:-2.5px;
      }
    }
  }

</style>
