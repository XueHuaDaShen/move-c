<template>
  <div class="common account-wrap">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item" :to="{name:'betRecord'}" v-if="userType!='1'">
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
        <router-link class="tab-item selected" :to="{name:'accountRecord'}" v-if="userType!='1'">
          <div class="item-inner">
            {{$t('message.zhang_bian_ji_lu')}}
          </div>
        </router-link>
      </div>
      <div class="card mt-30" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="card-title">
          {{$t('message.zhang_bian_ji_lu')}}
        </div>
        <div class="card-body padding-20">
          <div class="search-form mt-60">
            <label class="search-desc">{{$t('message.time')}}：</label>
            <el-date-picker v-model="beginTime" type="datetime" format="dd-MM-yyyy HH:mm:ss" :placeholder="$t('message.xuan_ze_kai_shi_shi_jian')">
            </el-date-picker>
            <span>-</span>
            <el-date-picker v-model="endTime" type="datetime" format="dd-MM-yyyy HH:mm:ss" :placeholder="$t('message.xuan_ze_jie_shu_shi_jian')">
            </el-date-picker>
            <button class="submit ml-20 search-btn" @click='handleSearch'>{{$t('message.search')}}</button>
          </div>
          <div class="table-container">
            <table class="record-table mt-60">
              <thead>
                <tr>
                  <th>
                    <div class="cell">{{$t('message.liu_shui_hao')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.username')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.user_type')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.accout_type')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.jiao_yi_e')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.zhang_hu_yu_e')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.zhang_bian_shi_jian')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.miao_shu_xin_xi')}}</div>
                  </th>
                </tr>
              </thead>
              <tbody v-if="!noResult">
                <tr v-for="(item,index) in list" :key="index">
                  <td>
                    <div class="cell">{{item.order_no}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.loginid | formatName}}</div>
                  </td>
                  <td>
                    <div class="cell">{{filterUserType(item.usertype)}}</div>
                  </td>
                  <td>
                    <div class="cell">{{getAccoutType(item.type) }}</div>
                  </td>
                  <td>
                    <div class="cell">{{ item.amount | formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell">{{ item.trade_current|formatCash}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.create_at | formatTime}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.message}}</div>
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
        </div>
        <div class="record-pagination clearfix">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex"
            :page-size="pageSize" layout="total, prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  export default {
    name: 'accountRecord',
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
        accountTypeOptions: [],
        userType: '', // 用户类型
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      sessionStorage.setItem("th_tag_url", "accountRecord");
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
      this.getAccountTypeList();
    },
    mounted() {
      this.setTimeToday();
      this.handleSearch();
    },
    methods: {
      filterUserType(v) {
        const vm = this;
        // console.log('vm', vm);
        if (v) {
          switch (v) {
            case '0':
              return vm.$t('message.user_type_1');
            case '1':
              return vm.$t('message.user_type_2');
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
        let url = '/user/trade/list' + '?page_size=' + vm.pageSize + '&page_num=' + vm.pageIndex +
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
              vm.total = response.body.count;
              if (vm.total) {
                vm.noResult = false;
                vm.totalPageNum = response.body.totalPage;
                vm.list = response.body.data;
              } else {
                vm.noResult = true;
                vm.list = [];
              }
            } else {
              vm.noResult = true;
              vm.list = [];
            }
          }
        }, error => {
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
        this.beginTime = moment(start).format();
        this.endTime = moment(end).format();
      },
      handleSizeChange(val) {},
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.onSubmit();
      },
      // 帐变类型
      getAccountTypeList() {
        const vm = this;
        vm.loading = true;
        vm.$http.get('/trade/type/list', {}).then(
          response => {
            // console.log('response', response);
            vm.loading = false;
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.reLogin(this);
              } else if (status == 200) {
                vm.accountTypeOptions = response.body.data;
              } else {
                vm.accountTypeOptions = [];
              }
            }
          }, error => {
            console.log('error', error);
            vm.loading = false;
            vm.accountTypeOptions = [];
          }
        );
      },
      getAccoutType(type) {
        for (let i = 0; i < this.accountTypeOptions.length; i++) {
          let o = this.accountTypeOptions[i];
          if (type === o.type) {
            if (this.$i18n.locale === 'zh') {
              return o.name_cn;
            } else if (this.$i18n.locale === 'th') {
              return o.name_th;
            }
          }
        }
        return "--"
      },
    },
    filters: {
      formatTime(v) {
        if (v) {
          return moment(v).format('DD-MM-YYYY HH:mm:ss')
        }
        return '--'
      },
      formatName(v) {
        return localStorage.getItem('candy-loginname')
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
  .account-wrap {
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
