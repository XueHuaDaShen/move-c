<template>
  <div class="lottery-kind" v-loading.fullscreen="loading">
    <ul class="lottery-kind-list">
      <li v-for="(lottery, i) in lotteryList" :key="i">
        <lottery :lottery="lottery" :buyHistoryNum="buyHistoryNum" :yes="lottery.name_cn === buyHistoryNum.ordername ? true : false"></lottery>
      </li>
    </ul>
  </div>
</template>
<script>
  import moment from "moment";
  import lottery from './lottery';
  import {
    setInterval
  } from 'timers';
  export default {
    name: 'lotteryKind',
    components: {
      lottery
    },
    props: {},
    data() {
      return {
        consoleFn: this.$store.state.consoleFn,
        moment: moment,
        lotteryList: [],
        key_lang: '',
        loading: false,
        buyHistoryNum: {
          ordername: '',
          orderid: '',
        },
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      this.getLotteryKind();
      sessionStorage.setItem("th_tag_index", 1);
      this.$store.dispatch("setRouterTagIndex", 1);
      let query = this.$route.query;
      if(query.orderid){
        this.buyHistoryNum.ordername = query.ordername;
        this.buyHistoryNum.orderid = query.orderid;
        this.loading = true;
      }
      let local_lang = this.$i18n.locale;
      if (local_lang === 'th') {
        this.key_lang = 'name_th';
      } else {
        this.key_lang = 'name_cn';
      }
      sessionStorage.setItem("candy-query", '');
      // this.consoleFn(this.$i18n.locale)
    },
    mounted() {},
    methods: {
      getLotteryKind() {
        this.$http.get('/lottery/list', {}).then(res => {
          this.consoleFn(res)
          let code = res.data.returncode;
          let data = res.data.data;
          if (code == 200) {
            this.lotteryList = data;
          } else if (status == 103 || status == 106 || status == 101) {
            this.$store.state.reLogin(this);
            // alert('请登录')
            return false;
          } else {
            this.lotteryList = [];
          }
        }).then(error => {
          this.consoleFn(error);
        })
      },
      toDetail(lottery) {
        let id = lottery._id;
        this.consoleFn(lottery)
        // this.$store.dispatch('setBetModel', true)
        // this.$store.dispatch('setIssue', lottery.issue.issue_no);
        // this.$store.dispatch('setLotteryName', lottery[this.key_lang]);
        this.$router.push({
          name: 'lotteryDetail',
          query: {
            id: id,
            lotteryName: lottery[this.key_lang],
            issue: lottery.issue.issue_no,
          }
        })
      }
    },
  }

</script>

<style lang="scss" scoped>
  .lottery-kind {
    width: 100%;
    padding: 15px;
    background: #EFEFEF;

    .lottery-kind-list {
      width: 100%;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;

      li {
        padding:15px;
        cursor: pointer;
      }
    }
  }

  @media screen and (max-width: 660px) {
    .lottery-kind {
      padding: 7.5px;
      .lottery-kind-list {
        display:inline-flex;
        flex-wrap: wrap;

        li {
          padding: 7.5px;
        }
      }
    }
  }
</style>
