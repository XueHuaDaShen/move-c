<template>
  <div class="bets-detail common">
    <div class="detail-wrap">
      <h2 class="text-center">{{$t("message.di")+issue+$t("message.qi")}}</h2>
      <h2 class="text-center text-danger">{{$t("message.huo_de_shu_zi_jiang")}}</h2>
      <div class="row">
        <div class="col">
          <div class="content-box">
            <h3>{{$t("message.zong_shu")}}</h3>
            <h1 class="text-info">{{totalCount}}</h1>
          </div>
        </div>
        <div class="col">
          <div class="content-box">
            <h3>{{$t("message.di_16_hang")}}</h3>
            <h1 class="text-info">{{sixteen}}</h1>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="content-box">
            <h3>{{$t("message.xu_lie")+$t("message.di_1_hang")}}</h3>
            <h1 class="text-info">{{first_name}}</h1>
          </div>
        </div>
        <div class="col">
          <div class="content-box">
            <h3>{{$t("message.xu_lie")+$t("message.di_16_hang")}}</h3>
            <h1 class="text-danger">{{sixteen_name}}</h1>
          </div>
        </div>
      </div>
      <div class="row" v-if="diff_value">
        <div class="col">
          <div class="content-box">
            <h3>{{$t("message.zhong_jiang")}}</h3>
            <h1>{{setNum(0, 3)}} <span class="text-success">{{setNum(-5, -3)}}</span> <span class="text-danger">{{setNum(-3)}}</span></h1>
          </div>
        </div>
        <div class="col">
          <div class="content-box">
            <h3>{{$t("message.san_wei")}}</h3>
            <h1 class="text-danger">{{setNum(-3)}}</h1>
          </div>
        </div>
        <div class="col">
          <div class="content-box">
            <h3>{{$t("message.liang_wei")}}</h3>
            <h1 class="text-danger">{{setNum(-5, -3)}}</h1>
          </div>
        </div>
      </div>
      <div class="row">
        <table>
          <thead>
            <tr>
              <td class="order">{{$t("message.xu_lie")}}</td>
              <td class="num">{{$t("message.shu_zi")}}</td>
              <td class="name">{{$t("message.yong_hu_ming")}}</td>
              <td class="time">{{$t("message.ti_jiao_shi_jian")}}</td>
            </tr>
          </thead>
          <tbody>
            <tr :class="(i==0 || i==15) ? 'success' : ''" v-for="(item, i) in lotteryNumList" :key="i">
              <td>{{i+1}}</td>
              <td>{{item.serial_no}}</td>
              <td>{{setUserName(item.loginname)}}</td>
              <td>{{moment(item.create_at).format("DD-MM-YYYY HH:mm:ss")}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  export default {
    name: 'betsDetail',
    components: {},
    props: {},
    data() {
      return {
        consoleFn: this.$store.state.consoleFn,
        moment: moment,
        kindList: [],
        lotteryNumList: [],
        gameid: '',
        issue: '',

        totalCount: '',
        sixteen: '',
        first_name: '',
        sixteen_name: '',
        diff_value: '',

        key_lang: '',
        othersTable: [],
        quicklottoTable: [],
        othersTableTitle: ['qi_shu', 'yi_deng_jiang', 'zheng_san_wei', 'fan_san_wei', 'liang_wei', 'detail'],
        quicklottoTableTitle: ['qi_shu', 'san_wei', 'liang_wei', 'detail'],
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
      
      this.gameid = this.$route.query.gameid;
      this.issue = this.$route.query.issue_no;

      this.getLotteryNumListFn();
      this.getResultList();
    },
    mounted() {},
    methods: {
      setNum(s, e) {
        return this.diff_value.toString().slice(s, e);
      },
      // 设置用户名*显示
      setUserName(name) {
        let str;
        if(name.length < 5){
          str = name.slice(0, 1) + name.slice(1, name.length-1).replace(/./g,'*') + name.slice(name.length-1);
        }else{
          str = name.slice(0, 2) + name.slice(2, name.length-2).replace(/./g,'*') + name.slice(name.length-2);
        }
        return str;
      },
      // 获取 号码列表
      getLotteryNumListFn() {
        this.$http.get('/ssc/serial/list', {
          params: {
            gameid: this.gameid,
            issue_no: this.issue
          }
        }).then(res => {
          if(res.data.returncode == 200){
            this.lotteryNumList = res.data.data;
          }else{
            this.lotteryNumList = [];
          }
          this.consoleFn(res)
        }).then(err => {})
      },
      getResultList() {
        this.$http.get('/ssc/serial/result', {
          params: {
            gameid: this.gameid,
            issue_no: this.issue
          }
        }).then(res => {
          this.consoleFn(res)
          let code = res.data.returncode;
          let data = res.data.data;
          if (code == 200) {
            this.totalCount = data.sum;
            this.sixteen = data.sixteen;
            this.first_name = data.first_name;
            this.sixteen_name = data.sixteen_name;
            this.diff_value = data.diff;
          } else {
            this.totalCount = '0';
            this.sixteen = '0';
            this.first_name = '';
            this.sixteen_name = '';
            this.diff_value = '0';
          }
        }).then(error => {
          this.consoleFn(error);
        })
      },
      handleSelectLottery(e) {
        this.gameid = e.target.value;
        this.consoleFn(e.target.value)
      },
    },
  }

</script>

<style lang="scss">
  .bets-detail {
    .search-box {
      p {
        .el-input__inner {
          background: #FFFFFF;
          border: 1px solid #979797;
          box-shadow: inset 0 1px 1px 0 rgba(0, 0, 0, 0.50);
          border-radius: 2px;
        }

        .el-input__prefix {
          display: none;
        }
      }
    }
  }

</style>


<style lang="scss" scoped>
.bets-detail {
  padding:20px 30px;
  .detail-wrap{
    width:100%;
    padding:10px;
    background:#fff;
  }
  h1,h2,h3,h4,h5,h6{
    margin-top:10px;
    margin-bottom:5px;
  }
  h1{
    font-size:30px;
    font-weight:normal;
  }
  h2{
    font-size:24px;
    font-weight:normal;
  }
  h3{
    font-size:16px;
    font-weight:normal;
  }
  .text-center{
    text-align:center;
  }
  .text-danger{
    color:#ed5565;
  }
  .text-success{
    color:#1c84c6;
  }
  .text-info{
    color:#23c6c8;
  }
  
  .row{
    width:100%;
    display:-webkit-box;
    -webkit-box-align:center;
    -webkit-box-pack:center;
    .col{
      width:25%;
      padding:0 15px;
      .content-box{
        padding:20px;
        border:1px solid #ddd;
        margin-bottom:20px;
      }
    }
    table{
      width:80%;
      border-collapse: collapse;
      // border: 1px solid #DDD;
    }
    td{
      padding:8px;
      border: 1px solid #DDD;
    }
    tr.success{
      td{
        background-color: #dff0d8;
      }
    }
    tr{
      &:nth-of-type(odd){
        background-color: #f9f9f9;
      }
    }
    @media (max-width:992px) {
      .col{
        width:33.3333333%;
      }
    }
  }
  @media (max-width:900px) {
    .row{
      width:100%;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-box-align:center;
      -webkit-box-pack:center;
      .col{
        width:100%;
      }
      table{
        width:100%;
      }
    }
  }
}

</style>
