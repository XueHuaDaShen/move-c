<template>
  <div class="transferRecord">
    <div class="mt-60 search-card" style="width:100%;padding:0 4vw;">
      <!-- <div class="title insert-to-bottom-line">{{$t('message.game_time')}}</div> -->
      <div class="row mt-30">
        <label class="lab-desc">{{$t("message.begin")}}</label>
        <el-date-picker v-model="beginTime" prefix-icon="" type="date" format="dd / MM / yyyy" :placeholder="$t('message.select_date')"
          class="user-date-picker">
        </el-date-picker>
      </div>
      <div class="row mt-30">
        <label class="lab-desc">{{$t("message.end")}}</label>
        <el-date-picker v-model="endTime" prefix-icon="" type="date" format="dd / MM / yyyy" :placeholder="$t('message.select_date')"
          class="user-date-picker">
        </el-date-picker>
      </div>
      <div class="row mt-30">
        <button class="user-btn" @click="search()">{{$t('message.search')}}</button>
      </div>
    </div>
    <div class="user-table mt-60" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
      <div class="user-table-thead-div">
        <table>
          <thead>
            <tr>
              <th>
                <div class="cell">{{$t('message.transfer_date')}}</div>
              </th>
              <th>
                <div class="cell">{{$t('message.amount')}}</div>
              </th>
              <th>
                <div class="cell">{{$t('message.bonus')}}</div>
              </th>
              <th>
                <div class="cell">{{$t('message.type')}}</div>
              </th>
              <th>
                <div class="cell">{{$t('message.source')}}</div>
              </th>
              <th>
                <div class="cell">{{$t('message.destination')}}</div>
              </th>
              <th>
                <div class="cell">{{$t('message.status')}}</div>
              </th>
              <th>
                <div class="cell">{{$t('message.detail')}}</div>
              </th>
            </tr>
          </thead>
          <tbody v-if="!dataNull">
            <tr v-for="(item,index) in list" :key="index">
              <td>
                <div class="cell">{{item.create_at | formatTime}}</div>
              </td>
              <td>
                <div class="cell">{{item.amount | filterCash}}</div>
              </td>
              <td>
                <div class="cell">{{item.packageid && item.packageid.free | filterCash}}</div>
              </td>
              <td>
                <div class="cell">{{filterType(item.type)}}</div>
              </td>
              <td>
                <div class="cell">{{filterAccount(item.from)}}</div>
              </td>
              <td>
                <div class="cell">{{filterAccount(item.to)}}</div>
              </td>
              <td>
                <div class="cell">{{filterStatus(item.status)}}</div>
              </td>
              <td>
                <div class="cell"><button class="user-btn detail-btn" @click="getDetail(item)">{{$t('message.detail')}}</button></div>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="dataNull" class="no-result">
            <tr>
              <td colspan="8">
                <p style="visibility:hidden;">{{$t('message.no_result')}}</p>
                <p style="position:fixed;left:45%;">{{$t('message.no_result')}}</p>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <div class="record-pagination clearfix" v-if="!dataNull" v-cloak>
      <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex"
        :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
        <!-- <span>Total <span class="num">{{this.totalPageNum}}</span> pages, current page <span class="num">{{this.pageIndex}}</span></span> -->
      </el-pagination>
    </div>
    <div class="detail-dialog" v-show="getAlertBG">
      <h2 class="title">{{$t("message.detail")}}</h2>
      <ul class="table-head">
        <li class="width-120">
          <div class="cell" style="visibility:hidden;">{{$t("message.before")}}</div>
        </li>
        <li>
          <div class="cell">{{$t("message.before")}}</div>
        </li>
        <li>
          <div class="cell">{{$t("message.current")}}</div>
        </li>
      </ul>
      <ul class="table-body">
        <li v-for="(item, i) in detailData" :key="i">
          <div class="width-120">{{$t("message."+item.name)}}</div>
          <div>{{item.before}}</div>
          <div>{{item.current}}</div>
        </li>
      </ul>
      <div class="table-footer"><button @click="closeDetail">{{$t("message.close")}}</button></div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';

  export default {
    name: 'transferRecord',
    data() {
      return {
        pageIndex: 1,
        pageSize: 15,
        dataNull: false,
        total: 0,
        totalPageNum: 0,
        list: [],
        loading: false,
        beginTime: '',
        endTime: '',
        showDetail: false,
        detailKeys: [
          {name: 'cash', current: 'cash', before: 'cash_before'},
          {name: 'lower_slots', current: 'cash_slot', before: 'cash_slot_before'},
          {name: 'slots_stake', current: 'stake_slot', before: 'stake_slot_before'},
          {name: 'live', current: 'cash_live', before: 'cash_live_before'},
          {name: 'live_stake', current: 'stake_live', before: 'stake_live_before'},
        ],
        detailData: [],
      };
    },
    methods: {
      search() {
        this.pageIndex = 1;
        this.onSubmit();
      },
      handleSizeChange(val) {},
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.onSubmit();
      },
      onSubmit() {
        const vm = this;
        let beginTime = vm.beginTime ? moment(new Date(vm.beginTime)).format('YYYY/MM/DD 00:00:00') : '';
        let endTime = vm.endTime ? moment(new Date(vm.endTime)).format('YYYY/MM/DD 23:59:59') : '';
        let url = '/record/transfer/list' + '?page_size=' + vm.pageSize + '&page_num=' + vm.pageIndex +
          '&beginTime=' + beginTime + "&endTime=" + endTime;
        vm.loading = true;
        vm.$http.get(url, {}).then(response => {
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.logout(this);
            } else if (status == 200) {
              vm.total = response.body.data.total;
              if (vm.total) {
                vm.dataNull = false;
                vm.totalPageNum = response.body.data.total_page_num;
                vm.list = response.body.data.data;
              } else {
                vm.dataNull = true;
                vm.list = [];
              }
            } else {
              vm.dataNull = true;
              vm.list = [];
            }
          }
        }, response => {
          // console.log('error', error);
          vm.loading = false;
          vm.dataNull = true;
          vm.list = [];
        });
      },
      filterStatus(val) {
        //1:申请 2：成功 3：失败
        switch (val) {
          case 1:
            return this.$t('message.apply');
          case 2:
            return this.$t('message.success');
          case 3:
            return this.$t('message.failed');
          default:
            return '--';
        }
      },
      filterType(val) {
        //1:申请 2：成功 3：失败
        switch (val) {
          case 1:
            return this.$t('message.out');
          case 2:
            return this.$t('message.in');
          default:
            return '--';
        }
      },
      filterAccount(val) {
        //1:申请 2：成功 3：失败
        switch (val) {
          case 'main':
            return this.$t('message.main');
          case 'slot':
            return this.$t('message.slot');
          case 'live':
            return this.$t('message.live');
          default:
            return '--';
        }
      },
      getDetail(row) {
        this.detailKeys.forEach(item => {
          this.detailData.push({
            name: item.name,
            before: row[item.before],
            current: row[item.current]
          })
        })
        // this.showDetail = true;
        this.$store.dispatch('setAlertBG', true);
        this.$nextTick(() => {
          let el = document.getElementsByClassName('detail-dialog')[0];
          document.getElementById('app').appendChild(el)
        })
      },
      closeDetail() {
        // this.showDetail = false;
        this.$store.dispatch('setAlertBG', false);
        this.detailData = [];
      }
    },
    computed: {
      getAlertBG() {
        return this.$store.state.alertBG;
      }
    },
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {},
    beforeMount() {},
    mounted() {
      this.search();
    },
    watch: {
    },
  }

</script>
<style lang="scss" scoped>
  .transferRecord {
    // padding: 0 4vw;

    .row {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .user-btn{
      width:52.53vw;
    }
    .user-table-thead-div{
      overflow: scroll;
      >table{
        table-layout: fixed;
        width: auto !important;
        min-width: 100%;
        border-collapse: collapse;
        font-family: PingFangSC-Regular;
        text-align: center;
        th,td{
          width:auto;
          .cell{
            white-space: nowrap;
          }
        }
      }
    }
    .detail-btn{
      width:28vw;
      height:8vw;
      min-width: 0;
      background: #212121;
      color: #f2b672;
      cursor: pointer;
    }
  }

</style>
