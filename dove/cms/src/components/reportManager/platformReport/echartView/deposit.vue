<template>
  <div id="echart-main">
    <p class="no-result" v-if="showResult">No Result</p>
  </div>
</template>
<script>
import moment from "moment";
import request from "@/axios/axios.js";
export default {
  name: 'overview',
  props: {
    searchTime: {},
    title: {},
  },
  data() {
    return {
      msg: 'nihao',
      showResult: false,
      echartData: []
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
    getEchartData() {
      const vm = this;
      let beginTime = "",
        endTime = "";
      if (vm.searchTime) {
        if (vm.searchTime.toString() !== "") {
          beginTime = new Date(vm.searchTime[0]);
          endTime = new Date(vm.searchTime[1]);
        }
      }
      request.http(
        "get",
        "/chart/platform/daily/list",
        {
          start_at: beginTime,
          end_at: endTime,
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
          vm.echartData = [];
          vm.randerEchart();
          console.log(error);
        }
      );
    },
    formatMoney(value) {
      if (value) {
        return Number(value).toFixed(2);
      }
      return 0;
    },
    formatData(data) {
      const vm = this;
      if(data.length === 0){
        this.showResult = true
      }
      let times = [];
      let values = [];
      let deposit = {
        name: 'Deposit',
        type: 'line',
        data: []
      },
      first_deposit = {
        name: 'First Deposit',
        type: 'line',
        data: []
      },
      withdrawal = {
        name: 'Withdrawal',
        type: 'line',
        data: []
      },
      gift = {
        name: 'Gift',
        type: 'line',
        data: []
      };
      data.filter(item => {
        if(item._id){
          times.push(moment(item._id.day).format("DD/MM"))
        }
        deposit.data.push(vm.formatMoney(item.deposit));
        first_deposit.data.push(vm.formatMoney(item.first_deposit));
        withdrawal.data.push(vm.formatMoney(item.withdrawal));
        gift.data.push(vm.formatMoney(item.gift));
      });
      values.push( deposit, first_deposit, withdrawal, gift )
      return {times, values}
    },
    randerEchart() {
      const vm = this;
      let {times, values} = this.formatData(this.echartData);
      if(times.length === 0) return
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
        legend: {
          data:['Deposit','First Deposit','Withdrawal','Gift'],
          x: 'center',
          y: 'bottom'
        },
        xAxis: {
          type : 'category',
          data: times
        },
        yAxis: {
          name: 'Amount(THB)'
        },
        series: values
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  }
}
</script>
<style lang="scss" scoped>
</style>


