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
    searchData: {},
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
      if (vm.searchData.time) {
        if (vm.searchData.time.toString() !== "") {
          beginTime = new Date(vm.searchData.time[0]);
          endTime = new Date(vm.searchData.time[1]);
        }
      }
      request.http(
        "get",
        "/chart/user/daily/active/list",
        {
          start_at: beginTime,
          end_at: endTime,
          loginname: vm.searchData.username
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
      if(data.length === 0){
        this.showResult = true
      }
      let times = [];
      let values = [];
      data.filter(item => {
        if(item._id){
          let time = item._id;
          times.push(moment(new Date(time.year+'-'+time.month+'-'+time.day)).format("DD/MM"))
        }
        values.push(item.count)
      });
      return {times, values}
    },
    randerEchart() {
      const vm = this;
      let {times, values} = this.formatData(this.echartData);
      if(values.length === 0) return
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
        //   data:['销量']
        // },
        xAxis: {
          data: times
        },
        yAxis: {
          name: 'Active'
        },
        series: [{
          type: 'bar',
          barWidth: 2,
          data: values
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


