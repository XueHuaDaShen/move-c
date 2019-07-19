<template>
  <div class="refundHIstory">
    <div class="user-table mt-40" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
      <table>
        <thead>
          <tr>
            <th>
              <div class="cell">{{$t("message.game_time")}}</div>
            </th>
            <th>
              <div class="cell">{{$t("message.refundTable.total")+' '+$t("message.profit")}}</div>
            </th>
            <th>
              <div class="cell">{{$t("message.refund")}}</div>
            </th>
            <th>
              <div class="cell">{{$t("message.status")}}</div>
            </th>
          </tr>
        </thead>
        <tbody v-if="!dataNull">
          <tr v-for="(item,index) in list" :key="index">
            <td>
              <div class="cell">{{item.month | formatMonth}}</div>
            </td>
            <td>
              <div class="cell">{{item.profit | filterCash}}</div>
            </td>
            <td>
              <div class="cell">{{item.refund | filterCash}}</div>
            </td>
            <td>
              <div class="cell" v-if="item.status == 1">
                <button class="user-btn" style="height:30px;" @click="handleApply(item)">{{filterRefundStatus(item.status)}}</button>
              </div>
              <div class="cell" v-else>{{filterRefundStatus(item.status)}}</div>
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
    name: 'refundHistory',
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
        refundStatus: [
          {status: 1, val: 'withdrawal'},
          {status: 0, val: 'apply'},
          {status: 2, val: 'success'}
        ]
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
        let url = '/agency/refund/history' + '?page_size=' + vm.pageSize + '&page_num=' + vm.pageIndex;
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

      // 申请提现
      handleApply(item) {
        this.$http.post('/agency/refund/apply', {
          id: item._id
        }, {
          emulateJSON: true
        }).then(res => {
          let code = res.data.returncode;
          if (code == 200) {
            this.$store.state.message('success', 'success', 1500, this);
            this.onSubmit();
          }else if (code == 103 || code == 106 || code == 101) {
            this.$store.state.logout(this);
          } else {
            this.$store.state.message('error', 'error', 1500, this);
          }
        }).then(err => {
          if(err){
            this.$store.state.message('error', 'error', 1500, this);
          }
        })
      },
      
      filterRefundStatus(status) {
        if (status != undefined && status.toString()) {
          return this.$t("message."+this.refundStatus.filter(s => {return s.status == status})[0].val)
        }
        return '--'
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
<style lang="scss" scoped>
  .refundHIstory {
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
