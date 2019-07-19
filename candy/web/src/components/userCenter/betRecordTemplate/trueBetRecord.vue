<template>
  <div class="common bet-wrap">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item selected" :to="{name:'betRecord'}" v-if="userType!='1'">
          <div class="item-inner">{{$t('message.tou_zhu_ji_lu')}}</div>
        </router-link>
        <router-link class="tab-item" :to="{name:'betOrderDetail'}" v-if="userType!='1'">
          <div class="item-inner">{{$t('message.tou_zhu_xiang_qing')}}</div>
        </router-link>
        <router-link class="tab-item" :to="{name:'rechargeRecord'}">
          <div class="item-inner">
            {{$t('message.chong_zhi_ji_lu')}}
          </div>
        </router-link>
        <router-link class="tab-item" :to="{name:'withdrawRecord'}">
          <div class="item-inner">
            {{$t('message.ti_xian_ji_lu')}}
          </div>
        </router-link>
        <router-link class="tab-item" :to="{name:'accountRecord'}" v-if="userType!='1'">
          <div class="item-inner">
            {{$t('message.zhang_bian_ji_lu')}}
          </div>
        </router-link>
      </div>
      <div class="card mt-30" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="card-title">
          {{$t('message.tou_zhu_ji_lu')}}
        </div>
        <div class="card-body padding-20">
          <div class="search-form mt-60">
            <label class="search-desc">{{$t('message.bet_time')}}：</label>
            <el-date-picker v-model="beginTime" type="datetime" format="dd-MM-yyyy HH:mm:ss" :placeholder="$t('message.xuan_ze_kai_shi_shi_jian')">
            </el-date-picker>
            <span>-</span>
            <el-date-picker v-model="endTime" type="datetime" format="dd-MM-yyyy HH:mm:ss" :placeholder="$t('message.xuan_ze_jie_shu_shi_jian')">
            </el-date-picker>
            <button class="submit ml-20 search-btn" @click="handleSearch">{{$t('message.search')}}</button>
          </div>
          <div class="table-container">
            <table class="record-table mt-60">
              <thead>
                <tr>
                  <th>
                    <div class="cell">{{$t('message.order_no')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.cai_zhong')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.issue')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.bet_time')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.bet_cash')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.shi_ji_tou_zhu_e')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.award_cash')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.status')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.check')}}</div>
                  </th>
                </tr>
              </thead>
              <tbody v-if="!noResult">
                <tr v-for="(item,index) in list" :key="index">
                  <td>
                    <div class="cell">{{item.order_no ? item.order_no : '--'}}</div>
                  </td>
                  <td>
                    <div class="cell" v-if="$i18n.locale==='zh'">{{item.gamename_cn ? item.gamename_cn : '--'}}</div>
                    <div class="cell" v-if="$i18n.locale==='th'">{{item.gamename_th ? item.gamename_th : '--'}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.issue_no ? item.issue_no : '--'}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.create_at | formatTime}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.cash | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.cash_discount | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell" :class="item.award_cash > 0 ? 'color-red' : 'color-green'">{{item.award_cash |
                      formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell">{{formatStatus(item.status)}}</div>
                  </td>
                  <td>
                    <div class="cell btn-wrap">
                      <router-link class="detail cell-btn" target="_blank" :to="{name:'betRecordDetail',query:{id: item._id,issue_no: item.issue_no,order_no: item.order_no,status: item.status}}">{{$t('message.detail')}}</router-link>
                      <router-link class="detail cell-btn" :to="{name:'lotteryKind',query:{orderid: item._id, ordername: item.gamename_cn}}">添加到购彩篮</router-link>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div class="cell">Total</div>
                  </th>
                  <th>
                    <div class="cell">--</div>
                  </th>
                  <th>
                    <div class="cell">--</div>
                  </th>
                  <th>
                    <div class="cell">--</div>
                  </th>
                  <th>
                    <div class="cell">{{countCash.toFixed(2)}}</div>
                  </th>
                  <th>
                    <div class="cell">{{countPayed.toFixed(2)}}</div>
                  </th>
                  <th>
                    <div class="cell">{{countAwardCash.toFixed(2)}}</div>
                  </th>
                  <th>
                    <div class="cell">--</div>
                  </th>
                  <th>
                    <div class="cell">--</div>
                  </th>
                </tr>
              </tbody>
              <tbody v-if="noResult">
                <tr class="no-result">
                  <td colspan="9">
                    <p>{{$t('message.no_result')}}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="record-pagination clearfix">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex"
              :page-size="pageSize" layout="total, prev, pager, next" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  export default {
    name: 'betRecord',
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
        pageSize: 20, //单页条数
        loading: false,
        countCash: 0,
        countPayed: 0,
        countAwardCash: 0,
        userType: '', // 用户类型
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      sessionStorage.setItem("th_tag_url", "betRecord");
      this.userType = localStorage.getItem("candy-type");
      //   如果当前为代理，则不显示该页面
      const vm = this;
      let candy_type = localStorage.getItem("candy-type").toString();
      let window_open = candy_type === "1";
      if (window_open) {
        setTimeout(function () {
          vm.$router.push({
            name: "home"
          });
        }, 1000);
      }
    },
    mounted() {
      this.setTimeToday();
      this.handleSearch();
    },
    methods: {
      handleSearch() {
        this.pageIndex = 1;
        this.onSubmit();
      },
      // goDetail(item) {
      //   let queryArr = [];
      //   queryArr.push({
      //     url: 'teamBet',
      //     query: {
      //       id: item._id,
      //       issue_no: item.issue_no,
      //       order_no: item.order_no,
      //       status: item.status
      //     }
      //   })
      //   sessionStorage.setItem("candy-urlArr", JSON.stringify(queryArr));
      //   this.$router.push({
      //     name: 'betRecordDetail'
      //   })
      // },
      onSubmit() {
        const vm = this;
        vm.countCash = 0;
        vm.countPayed = 0;
        vm.countAwardCash = 0;
        let data = {
          pageSize: vm.pageSize,
          pageNum: vm.pageIndex,
          beginTime: new Date(vm.beginTime).toISOString(),
          endTime: new Date(vm.endTime).toISOString()
        };
        vm.loading = true;
        let url = '/user/lottery/order/list' + '?page_size=' + vm.pageSize + '&page_num=' + vm.pageIndex +
          '&beginTime=' + new Date(vm.beginTime).toISOString() + "&endTime=" +
          new Date(vm.endTime).toISOString();
        vm.$http.get(url, {}).then(response => {
          // console.log('response', response);
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.reLogin(this);
            } else if (status == 200) {
              vm.total = response.body.data.total;
              if (vm.total) {
                response.body.data.data.filter(v => {
                  vm.countCash += v.cash ? Number(v.cash) : 0;
                  vm.countPayed += v.cash_discount ? Number(v.cash_discount) : 0;
                  vm.countAwardCash += v.award_cash ? Number(v.award_cash) : 0;
                })
                vm.noResult = false;
                vm.totalPageNum = response.body.data.total_page_num;
                vm.list = response.body.data.data;
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
        if (v) {
          // 0:待开奖 1：已开奖 2：已撤销
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
        return '——';
      }
    },
    filters: {
      formatTime(v) {
        if (v) {
          return moment(v).format('DD-MM-YYYY HH:mm:ss')
        }
        return '——'
      },
      formatCash(v) {
        if (v || v === 0) {
          return parseFloat(v).toFixed(2);
        }
        return '--';
      }
    }
  }

</script>

<style lang="scss" scoped>
  .bet-wrap {
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
          .btn-wrap{
            display:-webkit-box;
            -webkit-box-pack:center;
            a{
              display:block;
            }
          }
        }

        .color-red {
          color: #2D996E;
        }

        .color-green {
          color: #c83a4c;
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
      min-width: 72px;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      display: inline-block;
      text-decoration: none;
      padding:0 10px;
      margin:0 5px;
    }
  }

  .padding-20 {
    padding: 0 20px;
  }

</style>
