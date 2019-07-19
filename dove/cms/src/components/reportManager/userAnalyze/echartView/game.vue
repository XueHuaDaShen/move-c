<template>
  <div id="echart-main" v-loading="loading">
    <p class="no-result" v-if="showResult">No Result</p>
    <div id="echart1"></div>
    <div id="echart2"></div>
  </div>
</template>
<script>
import request from "@/axios/axios.js";
export default {
  name: 'overview',
  props: {
    searchData: {},
    title: {},
    title2: {},
  },
  data() {
    return {
      msg: 'nihao',
      showResult: false,
      loading: false,
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    const vm = this;
    // this.getEchartData(vm.searchData.provider, 'randerEchart1');
    this.getEchartData(vm.searchData.gameid, 'randerEchart2');
  },
  watch: {},
  methods: {
    formatMoney(value) {
      if (value) {
        return Number(value).toFixed(2);
      }
      return 0;
    },
    getEchartData(group, cb) {
      const vm = this;
      this.loading = true;
      let beginTime = "",
        endTime = "";
      if (vm.searchData.time) {
        if (vm.searchData.time.toString() !== "") {
          beginTime = new Date(vm.searchData.time[0]);
          endTime = new Date(vm.searchData.time[1]);
        }
      }
      request.http(
        "get",
        "/chart/user/game/list",
        {
          start_at: beginTime,
          end_at: endTime,
          loginname: vm.searchData.username
        },
        success => {
          let code = success.returncode;
          if (code === 200) {
            vm.loading = false;
            let arr = [];
            if (success.data && success.data.length > 0) {
              arr = success.data;
            }
            vm[cb](arr);
          } else if (code === 101 || code === 103 || code === 106) {
            request.loginAgain(vm);
          }
        },
        error => {
          vm[cb]([]);
          vm.loading = false;
        }
      );
    },
    formatData(data) {
      const vm = this;
      if(data.length === 0){
        this.showResult = true
      }
      var labelRight = {
        normal: {
          position: 'insideRight'
        }
      };
      var labelLeft = {
        normal: {
          position: 'insideLeft'
        }
      };
      let values = [];
      let tag = ['SA', 'GSS','GPI','NT'];
      let echart1Data = [];
      let names = [];
      let sa = tag[0], gss = tag[1], gpi = tag[2], nt = tag[3];
      let saNum = 0, gssNum = 0, gpiNum = 0, ntNum = 0;
      data.filter(item => {
        if(item._id){
          if(item._id.provider.toUpperCase() === sa){
            saNum += Number(item.bet_profit);
          }
          if(item._id.provider.toUpperCase() === gss){
            gssNum += Number(item.bet_profit);
          }
          if(item._id.provider.toUpperCase() === gpi){
            gpiNum += Number(item.bet_profit);
          }
          if(item._id.provider.toUpperCase() === nt){
            ntNum += Number(item.bet_profit);
          }
        }
        values.push({value: vm.formatMoney(item.bet_profit), provider: item._id.provider, gameid: item._id.gameid})
        names.push(item._id.gameid)
      });
      echart1Data.push(
        {value: vm.formatMoney(saNum), name: sa, label: saNum>0 ? labelRight : labelLeft},
        {value: vm.formatMoney(gssNum), name: gss, label: gssNum>0 ? labelRight : labelLeft},
        {value: vm.formatMoney(gpiNum), name: gpi, label: gpiNum>0 ? labelRight : labelLeft},
        {value: vm.formatMoney(ntNum), name: nt, label: ntNum>0 ? labelRight : labelLeft}
      );
      if(data.length !== 0){
        this.randerEchart1(echart1Data, tag)
      }
      return {values, tag, names}
    },
    randerEchart1(values, tag) {
      const vm = this;
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('echart1'));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: vm.title,
        },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            align: 'left'
          }
        },
        // legend: {
        //   bottom: 10,
        //   left: 'center',
        //   data: tag
        // },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: tag
        },
        series: [{
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              // position: 'insideRight'
            }
          },
          data: values,
        }]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    randerEchart2(data) {
      const vm = this;
      let {values, tag, names} = this.formatData(data);
      if(values.length === 0) return
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('echart2'));

      // 指定图表的配置项和数据
      var formatName = function(data) {
        return `Provider : ${data[0].data.provider}<br/>GameID : ${data[0].data.gameid}<br/>Win/Loss : ${data[0].data.value}`
      }
      var option = {
        title: {
          text: vm.title2,
        },
        tooltip: {
          trigger: 'axis',
          formatter: formatName,
          textStyle: {
            align: 'left'
          }
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: names
        },
        series: [{
          type: 'bar',
          // label: {
          //   formatter: '{c}'
          // },
          data:values,
        }]
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
  #echart1, #echart2{
    width:100%;
    display:block;
    height:500px;
    float: left;
  }
  .no-result{
    float: left;
    width:100%;
  }
}
</style>


