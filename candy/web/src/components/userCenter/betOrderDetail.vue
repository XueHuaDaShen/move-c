<template>
  <div class="common bet-wrap">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item" :to="{name:'betRecord'}" v-if="userType!='1'">
          <div class="item-inner">{{$t('message.tou_zhu_ji_lu')}}</div>
        </router-link>
        <router-link class="tab-item selected" :to="{name:'betOrderDetail'}" v-if="userType!='1'">
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
          {{$t('message.tou_zhu_xiang_qing')}}
        </div>
        <div class="card-body padding-20">
          <div class="search-form mt-60">
            <label class="search-desc">{{$t('message.qing_xuan_ze')+$t('message.cai_zhong')}}：</label>
            <select name="" id="" @change="handleSelectLottery($event)">
              <option value="">{{$t('message.qing_xuan_ze')+$t('message.cai_zhong')}}</option>
              <option :value="option._id" v-for="(option, o) in kindList" :key="o">{{option[key_lang]}}</option>
            </select>
            <label class="search-desc">{{$t('message.qing_xuan_ze')+$t('message.issue')}}：</label>
            <select name="" id="" @change="handleSelectIssue($event)">
              <option value="">{{$t('message.qing_xuan_ze')+$t('message.issue')}}</option>
              <option :value="option.issue_no" v-for="(option, o) in issueList" :key="o">{{option.issue_no}}</option>
            </select>
            <button class="submit ml-20 search-btn" @click="handleSearch">{{$t('message.search')}}</button>
          </div>
          <div class="table-container">
            <table class="record-table mt-60">
              <thead>
                <tr>
                  <th><div class="cell">{{$t('message.xu_hao')}}</div></th>
                  <th><div class="cell">{{$t('message.wan_fa')}}</div></th>
                  <th><div class="cell">{{$t('message.hao_ma')}}</div></th>
                  <th><div class="cell">{{$t('message.tou_zhu_e')}}</div></th>
                  <th><div class="cell">{{$t('message.shi_ji_tou_zhu_e')}}</div></th>
                  <th><div class="cell">{{$t('message.kai_jiang_hao_ma')}}</div></th>
                  <th><div class="cell">{{$t('message.award_cash')}}</div></th>
                  <th><div class="cell">{{$t('message.status')}}</div></th>
                </tr>
              </thead>
              <tbody v-if="!noResult">
                <tr v-for="(item,index) in list" :key="index">
                  <td>{{(pageIndex-1)*pageSize+(index+1)}}</td>
                  <td>
                    <span v-if="$i18n.locale==='zh'">{{item.gamename_cn}}&nbsp;{{item.lotteryname_cn}}</span>
                    <span v-if="$i18n.locale==='th'">{{item.gamename_th}}&nbsp;{{item.lotteryname_th}}</span>
                  </td>
                  <td>{{item.vote_no}}</td>
                  <td>{{item.vote_cash | formatCash}}</td>
                  <td>{{item.vote_cash_discount | formatCash}} <i class="el-icon-warning i-custom-detail" @click="getTradeDetail(item.vote_cash_discount,item._id,57,item.loginid)"></i></td>
                  <td>{{item.luck_no ? item.luck_no : '--'}}</td>
                  <td :class="item.award_cash > 0 ? 'color-red' : 'color-green'">{{item.award_cash | formatCash}} <i
                      class="el-icon-warning i-custom-detail" v-if="item.status === 5" @click="getTradeDetail(item.award_cash,item._id,58,item.loginid)"></i></td>
                  <td :class="item.status == 5 ? 'color-red' : (item.status == 4 ? 'color-green' : '')">{{formatStatus(item.status)}}</td>
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
                    <div class="cell">{{countCash.toFixed(2)}}</div>
                  </th>
                  <th>
                    <div class="cell">{{countPayed.toFixed(2)}}</div>
                  </th>
                  <th>
                    <div class="cell">--</div>
                  </th>
                  <th>
                    <div class="cell">{{countAwardCash.toFixed(2)}}</div>
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
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" :before-close="handleClose" @closed="closed()"
      v-loading="dialogLoading" top="0" custom-class="common-dialog no-padding" center>
      <div slot="title" class="dialog-header">
        <span class="title">Cash Detail</span>
      </div>
      <div class="body">
        <table class="table-list">
          <thead>
            <tr>
              <th>
                <div class="cell">{{$t('message.username')}}</div>
              </th>
              <th>
                <div class="cell">{{$t('message.jin_e')}}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in finalItemTable" :key="index">
              <td style="border:none !important">
                <span>{{item.loginname }}</span>
              </td>
              <td style="border:none !important">
                <span>{{item.amount}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import moment from 'moment';
  export default {
    name: 'betOrderDetail',
    components: {},
    props: {},
    data() {
      return {
        beginTime: '',
        endTime: '',
        gameid: '',
        issue: '',
        kindList: [],
        issueList: [],
        key_lang: '',
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
        dialogLoading: false,
        dialogVisible: false,
        finalItemTable: [],
        disabled: false,
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      let local_lang = this.$i18n.locale;
      if (local_lang === 'th') {
        this.key_lang = 'name_th';
      } else {
        this.key_lang = 'name_cn';
      }
      sessionStorage.setItem("th_tag_url", "betOrderDetail");
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
      // this.handleSearch();
      this.getLotteryKind();
    },
    methods: {
      handleOpen(totalCash, arr, keyArr) {
        const vm = this;
        let itemTable = [];
        let downCashTotal = 0;
        if (arr.length > 0) {
          for (let i = 0; i < keyArr.length; i++) {
            let ret1 = arr.find((item) => {
              return item.loginname === keyArr[i].name ? keyArr[i].name : keyArr[i].loginname;
            })
            if (ret1) {
              itemTable.push(ret1);
            }
          }
          vm.finalItemTable = itemTable;
        }
        this.dialogVisible = true;
      },
      handleClose() {
        this.dialogVisible = false;
      },
      getTradeDetail(totalCash, id, type, ancestors) {
        const vm = this;
        let type_ = new Array();
        type_.push(type);
        let data = {
          detail: id,
          ancestors: ancestors,
          type: type_
        };
        vm.dialogLoading = true;
        let url = '/user/trade/list';
        vm.$http.get(url, {
          params: data
        }).then(response => {
          vm.dialogLoading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.reLogin(this);
            } else if (status == 200) {
              if (response.body.data.length > 0) {
                vm.handleOpen(totalCash, response.body.data, response.body.descendants);
              } else {
                vm.dialogVisible = false;
                vm.$message({
                  message: vm.$t('message.zan_wu_shu_ju'),
                  center: true,
                  type: 'error',
                  duration: 1000
                });
              }
            }
          }
        }, response => {
          vm.dialogLoading = false;
        });
      },
      // 获取彩票种类
      getLotteryKind() {
        this.$http.get('/lottery/list', {}).then(res => {
          // this.consoleFn(res)
          let code = res.data.returncode;
          let data = res.data.data;
          if (code == 200) {
            this.kindList = data;
            // this.gameid = data[0]._id;
            // this.getPrizeList();
          } else {
            this.kindList = [];
          }
        }).then(error => {
          // this.consoleFn(error);
        })
      },
      handleSelectLottery(e) {
        this.gameid = e.target.value;
        this.getIssue();
      },
      handleSelectIssue(e) {
        this.issue = e.target.value;
      },
      // 获取期号
      getIssue() {
        this.$http.get('/lottery/issueno/list', {
          params: {
            gameid: this.gameid
          }
        }).then(res => {
          // this.consoleFn(res)
          let code = res.data.returncode;
          let data = res.data.data;
          if (code == 200) {
            this.issueList = data;
          } else {
            this.issueList = [];
          }
        }).then(error => {
          // this.consoleFn(error);
        })
      },
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
        vm.$http.get('/lottery/vote/list', {
          params: {
            gameid: vm.gameid,
            issue_no: vm.issue,
            // issue_no: '2019032152',
            page_num: vm.pageIndex,
            page_size: vm.pageSize
          }
        }).then(response => {
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
          //是否中奖  0:默认, 1: 待开奖 2. 等待中  3: 已撤销 4: 未中奖 5: 中奖
          switch (Number(v)) {
            case 0:
              return this.$t('message.default');
            case 1:
              return this.$t('message.dai_kai_jiang');
            case 2:
              return this.$t('message.deng_dai_zhong');
            case 3:
              return this.$t('message.yi_che_xiao');
            case 4:
              return this.$t('message.wei_zhong_jiang');
            case 5:
              return this.$t('message.zhong_jiang');
            default:
              return v;
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
    .i-custom-detail {
      margin-left: 5px;
      color: rgb(230, 162, 60);
      cursor: pointer;
    }
    .search-form {
      select {
        width: 136px;
        height: 32px;
        background-image: linear-gradient(-180deg, #EEEEEE 0%, #D8D8D8 100%);
        border: 1px solid #979797;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.20);
      }
    }
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
        .cell{
          padding:0 10px;
        }
      }

      tr {
        >td {
          padding: 15px 0;
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
    table.table-list {
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

      tbody {
        max-height: 300px;
        overflow: scroll;
      }

      tr {
        >td {
          padding: 15px 10px;
          border: 1px solid #e8e8e8;
          white-space: nowrap;
        }
      }

      .td_input {
        display: inline-block;
        height: 32px;
        width: 80px;
        background: #FFFFFF;
        border: 1px solid #979797;
        box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.50);
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #191919;
        text-align: center;

        &.error {
          border: 1px solid #f00;
          box-shadow: inset 0 1px 3px 0 rgba(255, 0, 0, 0.5);
        }

        &:disabled {
          background-color: #f5f7fa;
          color: #c0c4cc;
          cursor: not-allowed;
          border: 1px solid #e4e7ed;
          box-shadow: none;
        }
      }

      // .td_num {}
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
