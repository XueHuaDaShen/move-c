<template>
  <div class="myRefund">
    <div class="mt-60 search-card" style="width:100%;padding:0 4vw;">
      <div class="row mt-30">
        <label class="lab-desc">{{$t("message.game_time")}}</label>
        <el-date-picker v-model="beginTime" prefix-icon="" type="month" format="MM / yyyy" :placeholder="$t('message.select_date')"
          class="ml-10 user-date-picker">
        </el-date-picker>
      </div>
      <div class="row mt-30">
        <button class="user-btn ml-30 h-36" @click="search()">{{$t('message.search')}}</button>
      </div>
    </div>
    <div class="user-table mt-40" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
      <table>
        <thead>
          <tr>
            <th>
              <div class="cell">{{$t("message.refundTable.name")}}</div>
            </th>
            <th>
              <div class="cell">{{$t("message.game")+' '+$t("message.profit")}}</div>
            </th>
            <th>
              <div class="cell">{{$t("message.refundTable.gift")}}</div>
            </th>
            <th>
              <div class="cell">{{$t("message.refundTable.total")+' '+$t("message.profit")}}</div>
            </th>
          </tr>
        </thead>
        <tbody v-if="!dataNull">
          <tr v-for="(item,index) in list" :key="index">
            <td>
              <div class="cell">{{item.loginname}}</div>
            </td>
            <td>
              <div class="cell">{{(-item.bet_profit) | filterCash}}</div>
            </td>
            <td>
              <div class="cell">{{item.gift | filterCash}}</div>
            </td>
            <td>
              <div class="cell">{{(-item.total) | filterCash}}</div>
            </td>
          </tr>
          <tr v-if="list.length>0">
            <td>
              <div class="cell">{{$t("message.refundTable.total")}}</div>
            </td>
            <td>
              <div class="cell">{{(-dataCount.bet_profit) | filterCash}}</div>
            </td>
            <td>
              <div class="cell">{{dataCount.gift | filterCash}}</div>
            </td>
            <td>
              <div class="cell">{{(-dataCount.total) | filterCash}}</div>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="dataNull" class="no-result">
          <tr>
            <td colspan="4">
              <p>{{$t("message.no_result")}}</p>
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
    name: 'myRefund',
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
        dataCount: {
          bet_profit: 0,
          gift: 0,
          total: 0
        },
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
        let beginTime = vm.beginTime ? moment(vm.beginTime).format('YYYY-MM') : '';
        // let endTime = vm.endTime ? moment(new Date(vm.endTime)).format('YYYY/MM/DD 23:59:59') : '';
        let url = '/agency/refund/list' + '?pageSize=' + vm.pageSize + '&pageNum=' + vm.pageIndex +
          '&time=' + beginTime;
        vm.loading = true;
        vm.$http.get(url, {}).then(response => {
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.logout(this);
            } else if (status == 200) {
              vm.total = response.body.total;
              if (vm.total) {
                vm.dataNull = false;
                vm.totalPageNum = response.body.totalPage;
                vm.list = response.body.data;
                vm.countTotal(vm.list)
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
      countTotal(data) {
        let bet_profit = 0, gift = 0, total = 0;
        for(let i in data){
          bet_profit = bet_profit += data[i].bet_profit;
          gift = gift += data[i].gift;
          total = total += data[i].total;
        }
        this.dataCount = {
          bet_profit,
          gift,
          total
        }
      },
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
<style lang="scss">
.myRefund{
  .el-input__inner{
    text-align:center;
  }
}
</style>

<style lang="scss" scoped>
  .myRefund {

    .h-36 {
      height: 36px;
    }
    .user-btn{
      width:52.53vw;
    }
  }

</style>
