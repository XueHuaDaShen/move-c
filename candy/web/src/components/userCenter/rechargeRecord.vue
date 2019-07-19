<template>
  <div class="common recharge-wrap">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item" :to="{name:'betRecord'}" v-if="userType!='1'">
          <div class="item-inner">{{$t('message.tou_zhu_ji_lu')}}</div>
        </router-link>
        <router-link class="tab-item" :to="{name:'betOrderDetail'}" v-if="userType!='1'">
          <div class="item-inner">{{$t('message.tou_zhu_xiang_qing')}}</div>
        </router-link>
        <router-link class="tab-item selected" :to="{name:'rechargeRecord'}">
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
          {{$t('message.chong_zhi_ji_lu')}}
        </div>
        <div class="card-body padding-20">
          <div class="search-form mt-60">
            <label class="search-desc">{{$t('message.time')}}：</label>
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
                    <div class="cell">{{$t('message.username')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.user_type')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.shen_qing_shi_jian')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.shen_qing_jin_e')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.shi_ji_chong_zhi')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.shou_xu_fei')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.status')}}</div>
                  </th>
                </tr>
              </thead>
              <tbody v-if="!noResult">
                <tr v-for="(item,index) in list" :key="index">
                  <td>
                    <div class="cell">{{item.order_no}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.loginname}}</div>
                  </td>
                  <td>
                    <div class="cell">{{filterType(item.usertype)}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.create_at | formatTime}}</div>
                  </td>
                  <td>
                    <div class="cell">{{ item.cash_apply | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.cash_recharged | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.cash_service_fee | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell">{{formatStatus(item.status)}}</div>
                  </td>
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
    name: 'rechargeRecord',
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
        userType: '', // 用户类型
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      sessionStorage.setItem("th_tag_url", "rechargeRecord");
      this.userType = localStorage.getItem("candy-type");
    },
    mounted() {
      this.setTimeToday();
      this.handleSearch();
    },
    methods: {
      formatStatus(v) {
        if (v) {
          switch (v) {
            case 1:
              return this.$t('message.shen_qing');
            case 2:
              return this.$t('message.cheng_gong');
            case 3:
              return this.$t('message.shi_bai');
            default:
              return v;
          }
        }
        return '--';
      },
      handleSearch() {
        this.pageIndex = 1;
        this.onSubmit();
      },
      onSubmit() {
        const vm = this;
        /* let data = {
          pageSize: vm.pageSize,
          pageNum: vm.pageIndex,
          beginTime: new Date(vm.beginTime).toISOString(),
          endTime: new Date(vm.endTime).toISOString(),
        }; */
        vm.loading = true;
        let url = '/user/trade/recharge/list' + '?page_size=' + vm.pageSize + '&page_num=' + vm.pageIndex +
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
  .recharge-wrap {
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
