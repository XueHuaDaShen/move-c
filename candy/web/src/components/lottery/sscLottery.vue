<template>
  <div class="lottery-vue" :class="countDownTime.hour==0&&countDownTime.min==0&&countDownTime.sec==0?'background-none':''" @click="toDetail(copy_lottery)">
    <h2 class="lottery-name">{{$t("message.lun")}}<span>{{copy_lottery.issue_no.slice(8)}}</span></h2>
    <p class="lottery-issue m-t5">{{$t("message.di")}}{{copy_lottery.issue_no}}{{$t("message.qi")}}</p>
    <p class="lottery-time m-t10" v-if="countDownTime.hour==0&&countDownTime.min==0&&countDownTime.sec==0"><span class="shutdown">{{$t("message.shutdown")}}</span></p>
    <p class="lottery-time m-t10" v-else><span>{{formatTimeFn(countDownTime.hour)}}:{{formatTimeFn(countDownTime.min)}}:{{formatTimeFn(countDownTime.sec)}}</span></p>
  </div>
</template>
<script>
  import moment from "moment";
  export default {
    name: 'sscLottery',
    components: {},
    props: {
      lottery: {
        type: Object,
        required: true
      },
      code: {
        type: String,
        required: true
      },
      gameid: {
        type: String,
        required: true
      },
      name_cn: {
        type: String,
        required: true
      },
      name_th: {
        type: String,
        required: true
      },
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
      this.getCountDownTime(this.lottery.countdown);
    },
    methods: {
      // 获取倒计时的开始时间
      getCountDownTime(s) {
        // let s = 499;
        // var t;
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
          }
        }, 1000)
      },
      toDetail(lottery) {
        const vm = this;
        this.consoleFn(lottery)
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
        if(hour === 0 && min === 0 && sec === 0){
          this.$router.push({
            name: 'betsDetail',
            query: {
              gameid: vm.gameid,
              issue_no: lottery.issue_no,
              // countdown: this.countDownTime
            }
          })
        }else{
          this.$router.push({
            name: 'lotteryDetail',
            query: {
              id: vm.gameid,
              lotteryName: vm.name_cn,
              lotteryName_th: vm.name_th,
              issue: lottery.issue_no,
              // countdown: this.countDownTime
            }
          })
        }
      }
    },
  }

</script>
<style lang="scss" scoped>
  .lottery-vue{
    padding:15px;
    background: linear-gradient(to bottom, rgba(11,188,1,1) 0%, rgba(13,164,1,1) 100%);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    margin-top:1px;
    color:#fff;
    .lottery-name {
      border-bottom: 1px solid #fff;
    }
  }
  .background-none{
    background: linear-gradient(to bottom, #f9f9f9 0%, #d8d8d7 100%);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    color:#333;
    .lottery-name{
      border-bottom: 1px solid #a2a2a2;
    }
    .shutdown{
      // padding:5px 20px;
      font-size:21px;
      color:#EB5228;
      // background:#ccc;
    }
  }
  .lottery-name {
    text-align: center;
    font-size: 16px;
    // color: #c83a4c;
    border-bottom: 1px solid #D0D0D0;
    font-weight: normal;
    padding-top:5px;
    padding-bottom:10px;
  }
  .m-t5{
    margin-top:5px;
  }
  .m-t10{
    margin-top:10px;
  }
  .m-t20{
    margin-top:20px;
  }

  .lottery-issue {
    text-align: center;
    font-size: 14px;
    // color: #191919;
  }

  .lottery-endTime {
    width:100%;
    font-size: 16px;
    // color: #191919;
    text-align: center;
    // max-width: 156px;
  }

  .lottery-time {
    font-size: 24px;
    // color: #EB5228;
    display: -webkit-box;
    -webkit-box-pack: center;

    span {
      display: block;
    }

    .time-icon {
      width: 28px;
      height: 28px;
      margin-right: 5px;
    }
  }

</style>
