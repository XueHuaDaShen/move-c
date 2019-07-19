<template>
  <div class="common user-profit-wrap">
    <div class="container">
      <div class="card" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="card-title">
          {{$t('message.user_profit')}}
        </div>
        <div class="card-body padding-20">
          <div class="search-form mt-60">
            <label class="search-desc">{{$t('message.bet_time')}}：</label>
            <el-date-picker v-model="beginTime" type="datetime" format="dd-MM-yyyy HH:mm:ss" :placeholder="$t('message.qing_xuan_ze') + $t('message.begin_time')">
            </el-date-picker>
            <span>-</span>
            <el-date-picker v-model="endTime" type="datetime" format="dd-MM-yyyy HH:mm:ss" :placeholder="$t('message.qing_xuan_ze') + $t('message.end_time')">
            </el-date-picker>
            <button class="submit ml-20 search-btn" @click="handleSearch">{{$t('message.search')}}</button>
          </div>
          <div class="table-container">
            <table class="record-table mt-60">
              <thead>
                <tr>
                  <th>
                    <div class="cell">{{$t('message.username')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.shang_ji_dai_li')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.zong_tou_zhu')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.you_xiao_tou_zhu')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.fan_jiang')}}</div>
                  </th>
                  <th>
                    <div class="cell" v-show="getUserType === '1'">{{$t('message.tou_zhu_fen_cheng')}}</div>
                  </th>
                  <th>
                    <div class="cell" v-show="getUserType === '1'">{{$t('message.zhong_jiang_pei_fu')}}</div>
                  </th>
                  <th>
                    <div class="cell" v-show="getUserType === '2'">{{$t('message.tou_zhu_fan_dian')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.ying_kui')}}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in list" :key="index">
                  <td>
                    <div class="cell">{{item._id.loginname}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item._id.parent && item._id.parent.name ? item._id.parent.name : '--' }}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.bid_total | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.bid_valid | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.reward | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell" v-show="getUserType === '1'">{{item.dividend | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell" v-show="getUserType === '1'">{{item.payreward | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell" v-show="getUserType === '2'">{{item.refund | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.profit | formatCash}}</div>
                  </td>
                </tr>
                <tr v-if="noResult" class="no-result">
                  <td colspan="9">
                    <p>{{$t('message.no_result')}}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- <div class="record-pagination clearfix">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex"
              :page-size="pageSize" layout="total, prev, pager, next" :total="total">
            </el-pagination>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';

  export default {
    name: 'userProfit',
    components: {},
    props: {},
    data() {
      return {
        beginTime: '',
        endTime: '',
        list: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 15, //单页条数
        loading: false,
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      //   如果当前为代理，则不显示该页面
      // const vm = this;
      // let candy_type = localStorage.getItem("candy-type").toString();
      // let window_open = candy_type != "1";
      // if (!window_open) {
      //   setTimeout(function () {
      //     vm.$router.push({
      //       name: "home"
      //     });
      //   }, 1000);
      // }
    },
    mounted() {
      this.setTimeToday();
      this.handleSearch();
    },
    computed: {
      getUserType() {
        return localStorage.getItem('candy-type').toString();
      }
    },
    methods: {
      handleSearch() {
        this.pageIndex = 1;
        this.onSubmit();
      },
      onSubmit() {
        const vm = this;
        vm.loading = true;
        // let loginname = localStorage.getItem('candy-loginname').toString();
        let url = '/report/user/profit' +
          '?beginTime=' + new Date(vm.beginTime).toISOString() + "&endTime=" +
          new Date(vm.endTime).toISOString() + "&who=2";
        vm.$http.get(url, {}).then(response => {
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.reLogin(this);
            } else if (status == 200) {
              vm.total = response.body.self.length;
              if (vm.total) {
                vm.noResult = false;
                // vm.totalPageNum = response.body.totalPage;
                vm.list = response.body.self;
              } else {
                vm.noResult = true;
                vm.list = [];
              }
            } else {
              vm.noResult = true;
              vm.list = [];
            }
          }
        }, response => {
          // console.log('error', error);
          vm.loading = false;
          vm.noResult = true;
          vm.list = [];
        });
      },
      setTimeToday() {
        const end = new Date();
        const start = new Date(moment(new Date()).format('YYYY/MM/DD')).getTime();
        end.setTime(new Date(moment(new Date()).format('YYYY/MM/DD')).getTime() + 24 * 60 * 60 * 1000 - 1);
        this.beginTime = start;
        this.endTime = end;
      },
      handleSizeChange(val) {},
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.onSubmit();
      },
      formatStatus(v) {
        //状态 0:待开奖  1:已开奖 2：已撤销
        if (v) {
          switch (Number(v)) {
            case 0:
              return this.$t('message.dai_kai_jiang');
            case 1:
              return this.$t('message.yi_kai_jiang');
            case 2:
              return this.$t('message.yi_che_xiao');
            default:
              return v;
          }
        }
        return '--';
      },
      filterType(v) {
        const vm = this;
        if (v || v === 0) {
          switch (Number(v)) {
            case 0:
              return this.$t('message.user_type_1');
            case 1:
              return this.$t('message.user_type_2');
            case 2:
              return this.$t('message.user_type_3');
          }
        }
        return '--';
      },
    },
    filters: {
      formatTime(v) {
        if (v) {
          return moment(v).format('DD-MM-YYYY HH:mm:ss')
        }
        return '--'
      },
      formatCash(v) {
        if (v || v === 0) {
          let num = parseFloat(v).toFixed(2);
          //如果num是负数，则获取她的符号
          var sign = '';
          if (Number(num) < 0) {
            sign = '-';
          }
          // 绝对值
          var numAbs = Math.abs(num);
          var decimal = String(numAbs).split('.')[1] || ''; //小数部分
          var tempArr = [];
          var revNumArr = String(numAbs).split('.')[0].split("").reverse(); //倒序
          for (let i in revNumArr) {
            tempArr.push(revNumArr[i]);
            if ((i + 1) % 3 === 0 && i != revNumArr.length - 1) {
              tempArr.push(',');
            }
          }
          var zs = tempArr.reverse().join(''); //整数部分
          return decimal ? sign + zs + '.' + decimal : sign + zs;
        }
        return '0';
      }
    }
  }

</script>

<style lang="scss" scoped>
  .user-profit-wrap {
    background: #efefef;
    padding: 60px 0;

    table.record-table {
      border-collapse: collapse;
      width: 100%;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #191919;
      text-align: center;

      thead {
        background: #ededed;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #191919;
        line-height: 40px;
        height: 40px;
        text-align: center;
      }

      tr {
        >td {
          padding: 15px 0;
        }

        &:last-child {
          >td {
            padding-bottom: 30px;
          }
        }
      }
    }

    .submit {
      background-image: linear-gradient(-180deg, #EB5228 0%, #C14726 100%);
      width: 100px;
      height: 34px;
      line-height: 34px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #FFFFFF;
      text-align: center;
      cursor: pointer;
    }

    .detail {
      background-image: linear-gradient(-180deg, #7C7C7C 0%, #464646 100%);
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #FFFFFF;
      text-align: center;
      width: 72px;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
    }
  }

  .padding-20 {
    padding: 0 20px;
  }

</style>
