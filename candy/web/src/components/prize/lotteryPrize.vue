<template>
  <div class="time-prize-wrap common">
    <div class="container">
      <div class="tab" style="margin-bottom:30px;margin-top:60px;">
        <router-link class="tab-item" :to="{name:'timePrize'}">
          <div class="item-inner">
            {{$t('message.an_shi_jian_fen_lei')}}
          </div>
        </router-link>
        <router-link class="tab-item selected" :to="{name:'lotteryPrize'}">
          <div class="item-inner">{{$t('message.an_cai_zhong_fen_lei')}}</div>
        </router-link>
      </div>
      <div class="card">
        <div class="card-body padding-20" style="padding-bottom:20px">
          <div class="search-form" style="padding-top:60px; margin-bottom:60px;">
            <label class="search-desc">{{$t('message.qing_xuan_ze')+$t('message.cai_zhong')}}：</label>
            <select name="" id="" @change="handleSelectLottery($event)">
              <!-- <option value="">{{$t('message.qing_xuan_ze')+$t('message.cai_zhong')}}</option> -->
              <option :value="option._id" v-for="(option, o) in kindList" :key="o">{{option[key_lang]}}</option>
            </select>
            <button class="submit ml-20 search-btn" @click="getPrizeList">{{$t("message.search")}}</button>
          </div>
          <div class="talbe-box" v-for="(lottery, l) in lotteryList" :key="l">
            <h2 class="title">{{lottery[key_lang]}}&nbsp;&nbsp;{{lottery.name_cn.indexOf('时时彩') < 0 ? moment(lottery.open_at).format("DD-MM-YYYY") : ''}}</h2>
            <table>
              <thead>
                <tr>
                  <td v-for="(title, t) in (lottery.name_cn.indexOf('泰国') > -1 ? othersTableTitle : (lottery.name_cn.indexOf('时时彩') > -1 ? quicklottoTableTitle: noshishicai))" :key="t">{{$t("message."+title)}}</td>
                  <td v-if="lottery.name_cn.indexOf('时时彩') > -1">{{$t("message.detail")}}</td>
                </tr>
              </thead>
              <tbody>
                <tr v-if="lottery.luck_no">
                  <!-- <td v-if="lottery.name_cn.indexOf('时时彩') < 0">{{lottery.issue_no}}</td> -->
                  <td v-if="lottery.name_cn.indexOf('时时彩') > -1">{{lottery.issue_no.slice(0, 8)}}<span style="font-weight:bold;color:#c83a4c;">{{lottery.issue_no.slice(8)}}</span></td>
                  <td v-for="(num, n) in lottery.luck_no.split(',')" :key="n">{{n == 0 ? (num.replace(/-/g,'')) : (num.replace(/-/g,' '))}}</td>
                  <td v-if="lottery.name_cn.indexOf('时时彩') > -1"><button class="detail-btn" @click="toDetail(lottery)">{{$t("message.detail")}}</button></td>
                </tr>
                <tr v-if="!lottery.luck_no">
                  <td v-for="(title, t) in (lottery.name_cn.indexOf('泰国') > -1 ? othersTableTitle : (lottery.name_cn.indexOf('时时彩') > -1 ? quicklottoTableTitle: noshishicai))"
                    :key="t">{{$t("message.deng_dai_jie_guo")}}</td>
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
    name: 'lotteryPrize',
    components: {},
    props: {},
    data() {
      return {
        consoleFn: this.$store.state.consoleFn,
        moment: moment,
        kindList: [],
        lotteryList: [],
        gameid: '',
        key_lang: '',
        othersTable: [],
        quicklottoTable: [],
        othersTableTitle: [ 'yi_deng_jiang', 'xia_san_wei_qian', 'xia_san_wei_hou', 'xia_liang_wei'],
        noshishicai: [ 'san_wei', 'liang_wei'],
        quicklottoTableTitle: ['qi_shu', 'san_wei', 'liang_wei'],
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
      sessionStorage.setItem('th_tag_url', 'lotteryPrize');
      this.getLotteryKind();
    },
    mounted() {},
    methods: {
      getPrizeList() {
        const vm = this;
        this.$http.get('/lottery/issue/list', {
          params: {
            gameid: this.gameid
          }
        }).then(res => {
          let code = res.data.returncode;
          if (code == 200) {
            this.lotteryList = res.data.data;
          } else {
            this.lotteryList = [];
          }
          this.consoleFn(res)
        }).then(err => {})
      },
      getLotteryKind() {
        this.$http.get('/lottery/list', {}).then(res => {
          this.consoleFn(res)
          let code = res.data.returncode;
          let data = res.data.data;
          if (code == 200) {
            this.kindList = data;
            this.gameid = data[0]._id;
            this.getPrizeList();
          } else {
            this.kindList = [];
          }
        }).then(error => {
          this.consoleFn(error);
        })
      },
      handleSelectLottery(e) {
        this.gameid = e.target.value;
        this.consoleFn(e.target.value)
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

    .search-form {
      select {
        width: 236px;
        height: 32px;
        background-image: linear-gradient(-180deg, #EEEEEE 0%, #D8D8D8 100%);
        border: 1px solid #979797;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.20);
      }
    }

    .talbe-box {
      width: 100%;
      // padding:20px;
      background: #FFFFFF;
      margin-top: 20px;

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

          .detail-btn {
            background-image: linear-gradient(-180deg, #EB5228 0%, #C14726 100%);
            color: #fff;
            padding: 6px 12px;
            border-radius: 5px;
            cursor: pointer;
          }
        }
      }
    }

    .padding-20 {
      padding: 0 20px;
    }

  }

</style>
