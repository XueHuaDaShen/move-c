<template>
  <div id="echart-main" v-loading="loading">
    <p class="no-result" v-if="showResult">No Result</p>
    <div id="echart1"></div>
    <div id="echart2"></div>
    <div id="echart3"></div>
  </div>
</template>
<script>
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
    title: {
      required: true
    },
    title2: {
      required: true
    },
    title3: {
      required: true
    },
  },
  data() {
    return {
      msg: 'nihao',
      showResult: false,
      echartData: null,
      loading: false
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.getEchartData();
  },
  watch: {},
  methods: {
    formatMoney(value) {
      if (value) {
        return Number(value).toFixed(2);
      }
      return 0;
    },
    getEchartData() {
      const vm = this;
      vm.loading = true;
      request.http(
        "get",
        "/analyze/lottery",
        {
          gameid: vm.searchData.gameid,
          issue_no: vm.searchData.issue_no,
        },
        success => {
          let code = success.returncode;
          if (code === 200) {
            if (success.data && success.data.length > 0) {
              vm.echartData = success.data;
            } else {
              vm.echartData = [];
            }
            vm.randerEchart();
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          }
        },
        error => {
          vm.loading = false;
          vm.echartData = [];
          vm.randerEchart();
          console.log(error);
        }
      );
    },
    formatData(data) {
      if(data.length === 0){
        this.showResult = true
      }
      let xAxis = [];
      let values = [];
      let allBet = 0, allDis = 0, allRew = 0;
      let bet = {
        name: 'Bet',
        type: 'bar',
        data: []
      },
      discount = {
        name: 'Discount',
        type: 'bar',
        data: []
      },
      reward = {
        name: 'Reward',
        type: 'bar',
        data: []
      };
      this.playType.filter(item => {
        this.echartData.filter(d => {
          if(item._id === d._id.lotteryid){
            xAxis.push(d.name_cn)
            bet.data.push({name: d.name_cn, value: d.amountBet})
            discount.data.push({name: d.name_cn, value: d.validBet})
            reward.data.push({name: d.name_cn, value: d.reward})
            allBet += d.amountBet;
            allDis += d.validBet;
            allRew += d.reward;
          }
        })
      })
      this.randerEchart2(bet.data, xAxis)
      this.randerEchart3(reward.data, xAxis)
      bet.data.unshift(allBet.toFixed(2));
      discount.data.unshift(allDis.toFixed(2));
      reward.data.unshift(allRew.toFixed(2));
      xAxis.unshift('All');
      values.push(bet, discount, reward)
      return {xAxis, values}
    },
    randerEchart() {
      const vm = this;
      let {xAxis, values} = this.formatData(this.echartData);
      this.loading = false;
      // console.log(xAxis, values)
      if(values.length === 0) return
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('echart1'));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: vm.title,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            align: 'left'
          }
        },
        legend: {
          data:['Bet','Discount','Reward'],
          x: 'center',
          y: 'bottom'
        },
        xAxis: {
          data: xAxis,
        },
        yAxis: {
          name: 'Amount(THB)'
        },
        series: values
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    randerEchart2(data, xAxis) {
      const vm = this;
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('echart2'));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: vm.title2,
          left: 'center'
        },
        // tooltip: {
        //   trigger: 'axis',
        //   textStyle: {
        //     align: 'left'
        //   }
        // },
        tooltip : {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          bottom: 10,
          left: 'center',
          data: xAxis
        },
        series: [
          {
            type: 'pie',
            radius : '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    randerEchart3(data, xAxis) {
      const vm = this;
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('echart3'));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: vm.title3,
          left: 'center'
        },
        // tooltip: {
        //   trigger: 'axis',
        //   textStyle: {
        //     align: 'left'
        //   }
        // },
        tooltip : {
          trigger: 'item',
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          bottom: 10,
          left: 'center',
          data: xAxis
        },
        series: [
          {
            type: 'pie',
            radius : '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  }
}
</script>
<style lang="scss" scoped>
#echart-main{
  width:100%;
  clear: both;
  display:table;
  #echart1, #echart2, #echart3{
    width:100%;
    display:block;
    height:500px;
    float: left;
    margin-bottom:20px;
  }
  .no-result{
    float: left;
    width:100%;
  }
}
</style>


