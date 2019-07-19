<template>
  <div class="common bet-wrap">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item selected" :to="{name:'teamBet'}">
          <div class="item-inner">{{$t('message.team_bet')}}</div>
        </router-link>
        <router-link class="tab-item" :to="{name:'teamRecharge'}">
          <div class="item-inner">
            {{$t('message.team_recharge')}}
          </div>
        </router-link>
        <router-link class="tab-item" :to="{name:'teamWithdraw'}">
          <div class="item-inner">
            {{$t('message.team_withdraw')}}
          </div>
        </router-link>
        <router-link class="tab-item" :to="{name:'teamZB'}">
          <div class="item-inner">
            {{$t('message.team_zb')}}
          </div>
        </router-link>
      </div>
      <div class="card mt-30" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="card-title">
          {{$t('message.team_bet')}}
        </div>
        <div class="card-body padding-20">
          <div class="search-form mt-60">
            <label class="search-desc">{{$t('message.bet_time')}}：</label>
            <el-date-picker v-model="beginTime" type="datetime" format="dd-MM-yyyy" :placeholder="$t('message.qing_xuan_ze') + $t('message.begin_time')">
            </el-date-picker>
            <span>-</span>
            <el-date-picker v-model="endTime" type="datetime" format="dd-MM-yyyy" :placeholder="$t('message.qing_xuan_ze') + $t('message.end_time')">
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
                    <div class="cell">{{$t('message.username')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.firstname')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.user_type')}}</div>
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
                    <div class="cell">{{item.order_no}}</div>
                  </td>
                  <td>
                    <div class="cell"></div>{{item.loginname}}
                  </td>
                  <td>
                    <div class="cell">{{item.firstname}}</div>
                  </td>
                  <td>
                    <div class="cell">{{filterType(item.loginid&&item.loginid.type )}}</div>
                  </td>
                  <td>
                    <div class="cell" v-if="$i18n.locale==='zh'">{{item.gameid && item.gameid.name_cn}}</div>
                    <div class="cell" v-if="$i18n.locale==='th'">{{item.gameid && item.gameid.name_th}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.issue_no}}</div>
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
                    <div class="cell">{{ formatStatus(item.status)}}</div>
                  </td>
                  <td>
                    <div class="cell">
                      <router-link class="detail cell-btn" target="_blank" :to="{name:'betRecordDetail',query:{id: item._id,issue_no: item.issue_no,order_no: item.order_no,status: item.status}}">{{$t('message.detail')}}</router-link>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody v-if="noResult">
                <tr class="no-result">
                  <td colspan="12">
                    <p>{{$t('message.no_result')}}</p>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr v-if="!noResult">
                  <td>
                    <div class="cell">Total</div>
                  </td>
                  <td>
                    <div class="cell">--</div>
                  </td>
                  <td>
                    <div class="cell">--</div>
                  </td>
                  <td>
                    <div class="cell">--</div>
                  </td>
                  <td>
                    <div class="cell">--</div>
                  </td>
                  <td>
                    <div class="cell">--</div>
                  </td>
                  <td>
                    <div class="cell">--</div>
                  </td>
                  <td>
                    <div class="cell">{{countCash.toFixed(2)}}</div>
                  </td>
                  <td>
                    <div class="cell">{{countPayed.toFixed(2)}}</div>
                  </td>
                  <td>
                    <div class="cell">{{countAwardCash.toFixed(2)}}</div>
                  </td>
                  <td>
                    <div class="cell">--</div>
                  </td>
                  <td>
                    <div class="cell">--</div>
                  </td>
                </tr>
              </tfoot>
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
    name: 'teamBet',
    components: {},
    props: {},
    data() {
      return {
        beginTime: "",
        endTime: "",
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
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      sessionStorage.setItem("th_tag_url", "teamBet");
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
      onSubmit() {
        const vm = this;
        vm.countCash = 0;
        vm.countPayed = 0;
        vm.countAwardCash = 0;
        vm.loading = true;
        let url = '/agency/team/vote/list' + '?page_size=' + vm.pageSize + '&page_num=' + vm.pageIndex +
          '&beginTime=' + new Date(vm.beginTime).toISOString() + "&endTime=" +
          new Date(vm.endTime).toISOString();
        vm.$http.get(url, {}).then(response => {
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
          vm.loading = false;
          vm.noResult = true;
          vm.list = [];
        });
      },
      setTimeToday() {
        const end = new Date();
        const start = new Date(moment(new Date()).format('YYYY/MM/DD')).getTime();
        end.setTime(new Date(moment(new Date()).format('YYYY/MM/DD')).getTime() + 24 * 60 * 60 * 1000 - 1);
        this.endTime = end;
        this.beginTime = start;
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
              return vm.$t("message.user_type_3");
          }
        }
        return '--';
      }
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

          .color-red {
            color: #2D996E;
          }

          .color-green {
            color: #c83a4c;
          }
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
      display: inline-block;
      text-decoration: none;
    }
  }

  .padding-20 {
    padding: 0 20px;
  }

</style>
