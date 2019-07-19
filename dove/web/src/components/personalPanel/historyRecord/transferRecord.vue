<template>
  <div class="transferRecord">
    <div class="mt-60 row">
      <label class="lab-desc">{{$t("message.begin")}}</label>
      <el-date-picker v-model="beginTime" prefix-icon="" type="date" format="dd / MM / yyyy" :placeholder="$t('message.select_date')"
        class="ml-10 user-date-picker">
      </el-date-picker>
      <label class="ml-30 lab-desc">{{$t("message.end")}}</label>
      <el-date-picker v-model="endTime" prefix-icon="" type="date" format="dd / MM / yyyy" :placeholder="$t('message.select_date')"
        class="ml-10 user-date-picker">
      </el-date-picker>
      <button class="user-btn ml-30 h-36" @click="search()">{{$t('message.search')}}</button>
    </div>
    <div class="user-table mt-40" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
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
              <div class="cell">{{($t('message.source'))}}</div>
            </th>
            <th>
              <div class="cell">{{($t('message.destination'))}}</div>
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
              <div class="cell"><button class="detail-btn" @click="getDetail(item)">{{$t('message.detail')}}</button></div>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="dataNull" class="no-result">
          <tr>
            <td colspan="8">
              <p>{{$t('message.no_result')}}</p>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="record-pagination clearfix" v-if="!dataNull" v-cloak>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex"
        :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
        <!-- <span>Total <span class="num">{{this.totalPageNum}}</span> pages, current page <span class="num">{{this.pageIndex}}</span></span> -->
      </el-pagination>
    </div>
    <div class="detail-dialog" v-if="showDetail">
      <!-- <h2 class="title">{{$t("message.detail")}}</h2> -->
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
        pageSize: 10,
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
            return this.$t('message.lower_slots');
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
        this.showDetail = true;
        this.$store.dispatch('setAlertBG', true);
      },
      closeDetail() {
        this.showDetail = false;
        this.$store.dispatch('setAlertBG', false);
        this.detailData = [];
      }
    },
    computed: {},
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {},
    beforeMount() {},
    mounted() {
      this.search();
    },
    watch: {},
  }

</script>
<style lang="scss" scoped>
  .transferRecord {
    // padding: 0 30px;

    .row {
      display: flex;
      justify-content: center;
      align-items: center;

      .lab-desc {
        
        font-size: 14px;
        color: #ababab;
      }
    }

    .h-36 {
      height: 36px;
    }

    .user-date-picker {
      width: 200px;
    }
    .detail-btn{
      width:74px;
      height:30px;
      border-radius:20px;
      background-color: #212121;
      color: #f2b672;
      cursor: pointer;
    }
    .detail-dialog{
      width: 500px;
      height: 395px;
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      background-color: #212121;
      border-radius: 4px;
      z-index: 1099;
      padding: 20px 0;
      box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.5);
      .title{
        width:100%;
        padding:20px;
        color: #ababab;
        font-size:16px;
        text-align:center;
        visibility: hidden;
      }
      .table-head{
        width:100%;
        display:-webkit-box;
        li{
          -webkit-box-flex:1;
          text-align:center;
          height: 40px;
          line-height:40px;
          font-size:14px;
          color: #ababab;
          background:#1a1a1a;
          &:last-child{
            max-width:163px;
          }
        }
        li.width-120{
          max-width:150px;
        }
      }
      .table-body{
        width:100%;
        li{
          width:100%;
          display:-webkit-box;
          border-bottom:1px solid #000;
          div{
            -webkit-box-flex:1;
            text-align:center;
            font-size:14px;
            color:#fff;
            padding: 16px 0;
            &:first-child{
              text-align:left;
              text-indent:23px;
              background-color: #1a1a1a;
              color: #ababab;
            }
            &:last-child{
              max-width:163px;
            }
          }
          div.width-120{
            max-width:150px;
          }
        }
      }
      .table-footer{
        width:100%;
        padding-top:20px;
        display:-webkit-box;
        -webkit-box-pack:center;
        button{
          width: 100px;
          height: 30px;
          background-image: linear-gradient(134deg, #fadcab 0%, #d99d59 100%, #f2b672 100%);
          border-radius: 20px;
          font-size:12px;
          color: #111111;
          cursor: pointer;
        }
      }
    }
  }

</style>
