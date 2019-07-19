<template>
  <div class="time-prize-wrap common">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item selected" :to="{name:'timePrize'}">
          <div class="item-inner">
            {{$t('message.an_shi_jian_fen_lei')}}
          </div>
        </router-link>
        <router-link class="tab-item" :to="{name:'lotteryPrize'}">
          <div class="item-inner">{{$t('message.an_cai_zhong_fen_lei')}}</div>
        </router-link>
      </div>
      <div class="search-box">
        <!-- <p class="search-item"> -->
          <label class="item-title">{{$t("message.bet_time")}}：</label>
          <el-date-picker class="input-bet-time" v-model="betTime" type="date" format="dd-MM-yyyy" :placeholder="$t('message.qing_xuan_ze')+$t('message.bet_time')">
          </el-date-picker>
        <!-- </p> -->
        <button class="submit search-btn" @click="getPrizeList">{{$t("message.search")}}</button>
      </div>
      <div class="inner-box">
        <div class="inner-left" v-if="othersTable.length > 0">
          <div class="talbe-box" v-for="(other, o) in othersTable" :key="o">
            <h2 class="title">{{other[key_lang]}}&nbsp;&nbsp;{{moment(other.open_at).format("DD-MM-YYYY")}}</h2>
            <table>
              <thead>
                <tr>
                  <td v-for="(title, t) in (other.name_cn.indexOf('泰国') > -1 ? othersTableTitle : noshishicai)"
                    :key="t">{{$t("message."+title)}}</td>
                </tr>
              </thead>
              <tbody>
                <tr v-if="other.luck_no">
                  <!-- <td>{{other.issue_no}}</td> -->
                  <td v-for="(num, n) in other.luck_no.split(',')" :key="n">{{n == 0 ? (num.replace(/-/g,'')) : (num.replace(/-/g,' '))}}</td>
                  <!-- <td><button class="detail-btn" @click="toDetail(other)">{{$t("message.detail")}}</button></td> -->
                </tr>
                <tr v-if="!other.luck_no">
                  <td v-for="(title, t) in (other.name_cn.indexOf('泰国') > -1 ? othersTableTitle : noshishicai)"
                    :key="t">{{$t("message.deng_dai_jie_guo")}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="inner-right">
          <div class="talbe-box" v-if="quicklottoTable.length>0">
            <h2 class="title">{{quicklottoTable[0][key_lang]}}</h2>
            <table>
              <thead>
                <tr>
                  <td>{{$t("message.xu_hao")}}</td>
                  <td v-for="(title, t) in quicklottoTableTitle" :key="t">{{$t("message."+title)}}</td>
                  <td>{{$t("message.detail")}}</td>
                </tr>
              </thead>
              <tbody>
                <tr v-if="quicklotto.luck_no" v-for="(quicklotto, q) in quicklottoTable" :key="q">
                  <td><span style="font-weight:bold;color:#c83a4c;">{{quicklotto.issue_no.slice(8)}}</span></td>
                  <td>{{quicklotto.issue_no.slice(0, 8)}}<span style="font-weight:bold;color:#c83a4c;">{{quicklotto.issue_no.slice(8)}}</span></td>
                  <td v-for="(num, n) in quicklotto.luck_no.split(',')" :key="n">{{num}}</td>
                  <td><button class="detail-btn" @click="toDetail(quicklotto)">{{$t("message.detail")}}</button></td>
                </tr>
                <tr v-if="!quicklotto.luck_no" v-for="(quicklotto, q) in quicklottoTable" :key="q">
                  <td v-for="(title, t) in quicklottoTableTitle" :key="t">{{$t("message.deng_dai_jie_guo")}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  export default {
    name: 'timePrize',
    components: {},
    props: {},
    data() {
      return {
        consoleFn: this.$store.state.consoleFn,
        moment: moment,
        key_lang: '',
        othersTable: [],
        quicklottoTable: [],
        othersTableTitle: ['yi_deng_jiang', 'xia_san_wei_qian', 'xia_san_wei_hou', 'xia_liang_wei'],
        noshishicai: ['san_wei', 'liang_wei'],
        quicklottoTableTitle: ['qi_shu', 'san_wei', 'liang_wei'],
        betTime: moment(new Date()).format('YYYY-MM-DD'),
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    beforeCreate() {},
    created() {
      let local_lang = this.$i18n.locale;
      if (local_lang === 'th') {
        this.key_lang = 'name_th';
      } else {
        this.key_lang = 'name_cn';
      }
      sessionStorage.setItem('th_tag_url', 'timePrize');
      this.getPrizeList();
    },
    mounted() {},
    methods: {
      setIssue() {},
      getPrizeList() {
        const vm = this;
        this.$http.get('/lottery/issue/list', {
          params: {
            begintime: moment(new Date(vm.betTime)).format('YYYY-MM-DD'),
            endtime: ''
          }
        }).then(res => {
          let code = res.data.returncode;
          if (code == 200) {
            this.othersTable = res.data.data.others;
            this.quicklottoTable = res.data.data.quicklotto;
          } else {
            this.othersTable = [];
            this.quicklottoTable = [];
          }
          this.consoleFn(res)
        }).then(err => {})
      },
      toDetail(lottery) {
        // this.consoleFn(lottery)
        this.$router.push({
          name: 'betsDetail',
          query: {
            gameid: lottery.gameid._id,
            issue_no: lottery.issue_no
          }
        })
      },
    },
  }

</script>

<style lang="scss">
  .time-prize-wrap {
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
  .time-prize-wrap {
    background: #efefef;
    padding: 60px 0;

    .search-box {
      width: 100%;
      padding: 60px 20px;
      display: -webkit-box;
      -webkit-box-pack: center;
      -webkit-box-align: center;
      background: #FFFFFF;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);
      margin-top: 30px;
      .item-title{
        display:block;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #191919;
        text-align: left;
      }
      .submit {
        display:block;
        background-image: linear-gradient(-180deg, #EB5228 0%, #C14726 100%);
        width: 100px;
        height: 34px;
        line-height: 34px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #FFFFFF;
        text-align: center;
        cursor: pointer;
        margin-left:10px;
      }
    }

    .inner-box {
      width: 100%;
      display: table;
      margin-top: 30px;

      .talbe-box {
        width: 100%;
        padding: 20px;
        background: #FFFFFF;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);
        margin-bottom: 20px;

        h2.title {
          font-size: 16px;
          color: #EB5228;
          text-align: left;
          margin-bottom: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;

          thead {
            td {
              background: #EDEDED;
              font-weight: 600;
            }
          }

          td {
            padding: 10px 0;
            font-size: 14px;
            color: #191919;
            .detail-btn{
              background-image: linear-gradient(-180deg, #EB5228 0%, #C14726 100%);
              color:#fff;
              padding:6px 12px;
              border-radius:5px;
              cursor: pointer;
            }
          }
        }
      }

      .inner-left {
        // width: 48%;
        width:50%;
        float: left;
        padding-right:15px;
      }

      .inner-right {
        // width: 48%;
        width:50%;
        float: right;
        padding-left:15px;
      }
    }
    @media screen and (max-width:768px) {
      .search-box {
        -webkit-box-orient:vertical;
        .item-title{
          margin-bottom:10px;
        }
        .submit {
          width: auto !important;
          padding: 0 14px;
          margin-top:10px;
          margin-left:0;
        }
      }
      .inner-box {

        div.inner-left {
          width:100%;
          padding-right:0;
        }

        div.inner-right {
          width:100%;
          padding-left:0;
        }
      }
    }
  }

</style>
