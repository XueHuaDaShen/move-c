<template>
  <div class="common bet-detail-wrap">
    <div class="container">
      <div class="card" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="card-body padding-20">
          <p class="detail-title"><span v-if="$i18n.locale==='zh'">{{cai_zhong.parent ? cai_zhong.parent :
              '--'}}</span>
            <span v-if="$i18n.locale==='th'">{{cai_zhong.parent_th ? cai_zhong.parent_th :
              '--'}}</span></p>
          <p class="detail-title2">{{vote_no}} —— {{$t('message.di')}}{{issue_no}}{{$t('message.qi')}}</p>
          <button class="cancel-btn" @click="cancelBet" v-if="status === 0" :disabled="disabled">{{$t('message.che_xiao_tou_zhu')}}</button>
          <div class="table-container">
            <table class="record-table mt-60">
              <thead>
                <tr>
                  <!-- <th>{{$t('message.xu_hao')}}</th> -->
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
                  <!-- <td>{{item._id ? item._id : '--'}}</td> -->
                  <td>
                    <div class="cell" v-if="$i18n.locale==='zh'">{{item.parent}}&nbsp;{{item.name_cn}}</div>
                    <div class="cell" v-if="$i18n.locale==='th'">{{item.parent_th}}&nbsp;{{item.name_th}}</div>
                  </td>
                  <td><div class="cell">{{item.number}}</div></td>
                  <td><div class="cell">{{item.cash | formatCash}}</div></td>
                  <td><div class="cell">{{item.realCash | formatCash}} <i class="el-icon-warning i-custom-detail"></i></div></td>
                  <td><div class="cell">{{item.lotteryNum ? item.lotteryNum : '--'}}</div></td>
                  <td :class="item.prize > 0 ? 'color-red' : 'color-green'"><div class="cell">{{item.prize | formatCash}} <i class="el-icon-warning i-custom-detail" v-if="item.status === 5"></i></div></td>
                  <td :class="item.status == 5 ? 'color-red' : (item.status == 4 ? 'color-green' : '')"><div class="cell">{{formatStatus(item.status)}}</div></td>
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
          <div class="detail-line"></div>
          <p class="detail-total">{{$t('message.zong_ji_zhong_jiang_jin_e')}}：{{getTotal | formatCash}} THB</p>
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
  import paramCryptFn from '@/assets/js/cryptData';

  import moment from 'moment';
  import {
    setTimeout
  } from 'timers';
  export default {
    name: 'betRecordDetail',
    components: {},
    props: {},
    data() {
      return {
        issue_no: "",
        vote_no: "",
        id: "",
        list: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 15, //单页条数
        loading: false,
        status: '',
        cai_zhong: '',
        dialogLoading: false,
        dialogVisible: false,
        finalItemTable: [],
        disabled: false,
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {
      getTotal() {
        let total = 0;
        if (this.list.length > 0) {
          for (let i = 0; i < this.list.length; i++) {
            let item = this.list[i];
            if (item.prize) {
              total += item.prize;
            }
          }
        }
        return total;
      }
    },
    created() {
      let query = this.$route.query;
      const vm = this;
      if (query && query.issue_no && query.order_no && query.status) {
        this.vote_no = query.order_no;
        this.issue_no = query.issue_no;
        this.status = Number(query.status);
        this.getList();
      } else {
        vm.$message({
          message: vm.$t('message.ding_dan_you_wu'),
          center: true,
          type: 'error',
          duration: 2000
        });
        setTimeout(function () {
          vm.close();
        }, 3000)
      }
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
      closed() {
        this.resetForm();
      },
      resetForm() {
        this.finalItemTable = [];
      },
      close() {
        // 重置window.opener用来获取打开当前窗口的窗口引用
        // 这里置为null,避免IE下弹出关闭页面确认框
        window.opener = null;
        // JS重写当前页面
        window.open("", "_self", "");
        // 顺理成章的关闭当前被重写的窗口
        window.close();
      },
      getList() {
        const vm = this;
        vm.list = JSON.parse(localStorage.getItem('falseOrderDetailData')).data;
        // console.log(vm.list)
        vm.total = vm.list.length;
        if (vm.total) {
          vm.noResult = false;
          vm.cai_zhong = vm.list[0];
        } else {
          vm.noResult = true;
          vm.list = [];
        }
      },
      handleSizeChange(val) {},
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getList();
      },
      cancelBet() {
        const vm = this;
        return
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
  .bet-detail-wrap {
    background: #efefef;
    padding: 60px 0;

    .i-custom-detail {
      margin-left: 5px;
      color: rgb(230, 162, 60);
      cursor: pointer;
    }

    table.record-table {
      border-collapse: collapse;
      width: 100%;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #191919;
      text-align: center;
      thead{
        tr{
          background: #EDEDED;
        }
      }
      tr {
        &:first-child {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #191919;
          line-height: 40px;
          height: 40px;
          text-align: center;

          >td {
            padding-top: 20px;
          }
        }

        .color-red {
          color: #2D996E;
        }

        .color-green {
          color: #c83a4c;
        }

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

    .detail-title {
      font-family: PingFangSC-Medium;
      font-size: 26px;
      color: #EB5228;
      text-align: center;
      width: 100%;
      padding-top: 60px;
    }

    .detail-title2 {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #191919;
      text-align: center;
      width: 100%;
      margin-top: 10px;
    }

    .cancel-btn {
      background-image: linear-gradient(-180deg, #AFAFAF 0%, #777777 100%);
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #FFFFFF;
      text-align: center;
      margin: 0 auto;
      margin-top: 30px;
      margin-bottom: 60px;
      width: 145px;
      height: 44px;
      cursor: pointer;
    }

    .detail-line {
      background: #D0D0D0;
      height: 1px;
      width: 100%;
    }

    .detail-total {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #EB5228;
      text-align: left;
      padding: 20px 0;
    }
  }

  .padding-20 {
    padding: 0 20px;
  }

</style>
