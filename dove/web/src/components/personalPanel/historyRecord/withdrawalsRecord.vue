<template>
  <div class="withdrawalsRecord">
    <div class="mt-60 row">
      <label class="lab-desc">{{$t('message.begin')}}</label>
      <el-date-picker v-model="beginTime" prefix-icon="" type="date" format="dd / MM / yyyy" :placeholder="$t('message.select_date')"
        class="ml-10 user-date-picker">
      </el-date-picker>
      <label class="ml-30 lab-desc">{{$t('message.end')}}</label>
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
              <div class="cell">{{$t('message.withdrawal_date')}}</div>
            </th>
            <th>
              <div class="cell">{{$t('message.amount')}}</div>
            </th>
            <th>
              <div class="cell">{{$t('message.status')}}</div>
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
              <div class="cell">{{filterStatus(item.status)}}</div>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="dataNull" class="no-result">
          <tr>
            <td colspan="5">
              <p>{{$t('message.no_result')}}</p>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="record-pagination clearfix" v-if="!dataNull">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex"
        :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
        <!-- <span>Total <span class="num">{{this.totalPageNum}}</span> pages, current page <span class="num">{{this.pageIndex}}</span></span> -->
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';

  export default {
    name: 'withdrawalsRecord',
    data() {
      return {
        beginTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 15,
        dataNull: false,
        total: 0,
        totalPageNum: 0,
        list: [],
        loading: false,
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
        vm.loading = true;
        let beginTime = vm.beginTime ? moment(new Date(vm.beginTime)).format('YYYY/MM/DD 00:00:00') : '';
        let endTime = vm.endTime ? moment(new Date(vm.endTime)).format('YYYY/MM/DD 23:59:59') : '';
        let url = '/record/withdrawal/list' + '?page_size=' + vm.pageSize + '&page_num=' + vm.pageIndex +
          '&beginTime=' + beginTime + "&endTime=" + endTime;
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
    filters: {

    }
  }

</script>
<style lang="scss" scoped>
  .withdrawalsRecord {
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
  }

</style>
