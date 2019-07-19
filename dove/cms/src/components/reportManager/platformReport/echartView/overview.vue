<template>
  <div id="echart-main"></div>
</template>
<script>
export default {
  name: 'overview',
  props: {
    echartData: {},
    title: {},
  },
  data() {
    return {
      msg: 'nihao'
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.randerEchart();
  },
  watch: {},
  methods: {
    formatMoney(value) {
      if (value) {
        return Number(value).toFixed(2);
      }
      return 0;
    },
    getData() {},
    randerEchart() {
      const vm = this;
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
      let data = this.echartData;
      let formatData = [
        {value: vm.formatMoney(data.bet_profit - data.gift), label: (data.bet_profit - data.gift) > 0 ? labelRight : labelLeft},
        {value: vm.formatMoney(data.bet_profit), label: Number(data.bet_profit) > 0 ? labelRight : labelLeft},
        {value: vm.formatMoney(data.deposit), label: Number(data.deposit) > 0 ? labelRight : labelLeft},
        {value: vm.formatMoney(data.gift), label: Number(data.gift) > 0 ? labelRight : labelLeft},
        {value: vm.formatMoney(data.withdrawal), label: Number(data.withdrawal) > 0 ? labelRight : labelLeft},
        {value: vm.formatMoney(data.first_deposit), label: Number(data.first_deposit) > 0 ? labelRight : labelLeft},
      ].reverse();
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('echart-main'));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: vm.title
        },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            align: 'left'
          }
        },
        // legend: {
        //   align: 'left',
        // },
        xAxis: {
          type: 'value',
          align: 'left',
        },
        yAxis: {
          type: 'category',
          align: 'left',
          data: ["Total Win/Loss","Game Win/Loss","Deposit","Gift","Withdrawal","First Deposit"].reverse()
        },
        series: [{
          align: 'left',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              // position: 'insideRight'
            }
          },
          data: formatData
        }]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  }
}
</script>
<style lang="scss" scoped>
</style>


