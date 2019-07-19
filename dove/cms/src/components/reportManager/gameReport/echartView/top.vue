<template>
  <div id="echart-main">
    <div class="echart-search" v-if="echartData.length>0">
      <div class="search-inner-wrap">
        <label>Size：</label>
        <el-select v-model="size" clearable class="small" @change="getEchartData">
          <el-option v-for="(item, i) in sizeArr" :key="i" :label="item" :value="item">
          </el-option>
        </el-select>
      </div>
    </div>
    <div id="render-wrap">
      <p class="no-result" v-if="showResult">No Result</p>
    </div>
  </div>
</template>
<script>
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
      echartData: [],
      sizeArr: ['10', '20', '50', '100', '400'],
      size: 10,
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
        "/chart/game/top/list",
        {
          start_at: beginTime,
          end_at: endTime,
          top: vm.size,
          sort: vm.searchData.sort,
          order: vm.searchData.order
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
    formatData(data) {
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
      const vm = this;
      let values = [];
      let names = [];
      data.filter(item => {
        if(item._id){
          names.push(item._id.gameid)
          let value;
          if(vm.searchData.sort){
            value = vm.formatMoney(item[vm.searchData.sort])
          }else{
            value = vm.formatMoney(item.bet_profit)
          }
          values.push(
            {value, label: Number(value)>0 ? labelRight : labelLeft}
          )
        }
      });
      return {values, names}
    },
    randerEchart() {
      const vm = this;
      let {values, names} = this.formatData(this.echartData);
      if(values.length === 0) return
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('render-wrap'));

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
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: names
        },
        series: [{
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
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
#render-wrap{
  width:100%;
  height:100%;
}
#echart-main{
  position: relative;
}
.echart-search{
  position: absolute;
  right:0;
  top:0;
  z-index: 2;
}
</style>


