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
        return this.$store.state.toThousands(Number(value).toFixed(2));
      }
      return 0;
    },
    formatData(data) {
      if(data.length === 0){
        this.showResult = true
      }
      let times = [];
      let values = [];
      let register = {
        name: 'Register',
        type: 'bar',
        stack: '总量',
        color: '#65a4f7',
        label: {
          normal: {
            show: true,
            position: 'insideTop',
            formatter: function (params) {
              if (params.value > 0) {
                return params.value;
              } else {
                return '';
              }
            },
          }
        },
        data: []
      },
      login = {
        name: 'Login',
        type: 'bar',
        stack: '总量',
        color: '#7ac84a',
        label: {
          normal: {
            show: true,
            position: 'insideTop',
            formatter: function (params) {
              if (params.value > 0) {
                return params.value;
              } else {
                return '';
              }
            },
          }
        },
        data: []
      };
      data.filter(item => {
        if(item._id){
          times.push(moment(item._id.day).format("DD/MM"))
        }
        register.data.push(item.num_registered);
        login.data.push(item.num_login);
      });
      values.push( register, login )
      return {times, values}
    },
    randerEchart() {
      const vm = this;
      let {times, values} = this.formatData(this.echartData);
      if(times.length === 0) return
      // console.log(times, values)
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
          data:['Register','Login'],
          x: 'center',
          y: 'bottom'
        },
        xAxis: [
          {
            type: 'category',
            data: times
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Users'
          }
        ],
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


