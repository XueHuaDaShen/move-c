<template>
  <div class="member-wrap common">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item" :to="{name:'sponsoredLink'}">
          <div class="item-inner">{{$t('message.tui_guang_lian_jie')}}</div>
        </router-link>
        <router-link class="tab-item selected" :to="{name:'member'}">
          <div class="item-inner">
            {{$t('message.member')}}
          </div>
        </router-link>
      </div>
      <div class="card mt-30" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="card-body">
          <div class="table-container">
            <table class="record-table mt-60">
              <thead>
                <tr>
                  <th>
                    <div class="cell">{{$t('message.username')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.reg_date')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.zong_tou_zhu')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.shi_ji_shou_ru')}}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!noResult" v-for="(item,index) in list" :key="index">
                  <td>
                    <div class="cell">{{item.loginid && item.loginid.loginname}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.create_at | formatTime}}</div>
                  </td>
                  <td>
                    <div class="cell">{{ item.bid_total | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell">{{ item.refund_amount | formatCash}}</div>
                  </td>
                </tr>
                <tr v-if="noResult" class="no-result">
                  <td colspan="9">
                    <p>{{$t('message.no_result')}}</p>
                  </td>
                </tr>
              </tbody>
              <tfoot v-if="!noResult">
                <tr>
                  <td>
                    <div class="cell">{{$t('message.zong_ji')}}</div>
                  </td>
                  <td>
                    <div class="cell"></div>
                  </td>
                  <td>
                    <div class="cell">{{bid_total}}</div>
                  </td>
                  <td>
                    <div class="cell">{{reward}}</div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <!-- <div class="record-pagination clearfix">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex"
            :page-size="pageSize" layout="total, prev, pager, next" :total="total">
          </el-pagination>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';

  export default {
    name: 'member',
    components: {},
    props: {},
    data() {
      return {
        list: [],
        noResult: true,
        // totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 20, //单页条数
        loading: false,
        bid_total: 0,
        reward: 0,
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      // 如果当前为直客，则显示sponsoredLink
      const vm = this;
      let candy_type = localStorage.getItem('candy-type');
      let window_open = candy_type === '2';
      if (!window_open) {
        setTimeout(function () {
          vm.$router.push({
            name: 'home'
          });
        }, 1000)
      }
    },
    mounted() {
      this.getLinkList();
    },
    methods: {
      getLinkList() {
        const vm = this;
        let data = {
          page_size: vm.pageSize,
          page_num: vm.pageIndex,
          type: [2]
        };
        vm.loading = true;
        let url = "/agency/link/list";
        vm.$http
          .get(url, {
            params: data
          })
          .then(
            response => {
              vm.loading = false;
              let status = response.body.returncode;
              if (status) {
                if (status == 103 || status == 106 || status == 101) {
                  this.$store.state.reLogin(this);
                } else if (status == 200) {
                  vm.total = response.body.data.data[0].childs.length;
                  if (vm.total) {
                    vm.noResult = false;
                    vm.list = response.body.data.data[0].childs;
                    let bid_total = 0,
                      reward = 0;
                    for (let i = 0; i < vm.list.length; i++) {
                      let item = vm.list[i];
                      if (item.bid_total) {
                        bid_total += item.bid_total;
                      }
                      if (item.refund_amount) {
                        reward += item.refund_amount;
                      }
                    }
                    vm.bid_total = parseFloat(bid_total).toFixed(2);
                    vm.reward = parseFloat(reward).toFixed(2);
                  } else {
                    vm.noResult = true;
                    vm.list = [];
                  }
                }
              }
            },
            response => {
              vm.loading = false;
              vm.noResult = true;
              vm.list = [];
            }
          );
      },
      handleSizeChange(val) {},
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getLinkList();
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
  .member-wrap {
    padding: 60px 0;

    .card-body {
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
    }
  }

</style>
