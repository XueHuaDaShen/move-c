<template>
  <div class="lottery-kind">
    <ul class="lottery-kind-list">
      <li v-for="(lottery, i) in lotteryList" :key="i">
        <sscLottery :lottery="lottery" :code="code" :name_cn="name_cn" :name_th="name_th" :gameid="gameid"></sscLottery>
      </li>
    </ul>
  </div>
</template>
<script>
  import moment from "moment";
  import sscLottery from './sscLottery';
  export default {
    name: 'sscList',
    components: {
      sscLottery
    },
    props: {},
    data() {
      return {
        consoleFn: this.$store.state.consoleFn,
        moment: moment,
        lotteryList: [],
        key_lang: '',
        name_cn: '',
        name_th: '',
        code: '',
        gameid: '',
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      this.getSscList();
      let local_lang = this.$i18n.locale;
      if (local_lang === 'th') {
        this.key_lang = 'name_th';
      } else {
        this.key_lang = 'name_cn';
      }
      sessionStorage.setItem("candy-query", '');
      let query = this.$route.query;
      this.name_cn = query.name_cn;
      this.name_th = query.name_th;
      this.code = query.code;
      this.gameid = query.gameid;
      // this.consoleFn(this.$i18n.locale)
    },
    mounted() {},
    methods: {
      getSscList() {
        this.$http.get('/lottery/ssc/issue/list', {}).then(res => {
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
    background: #EFEFEF;
    .lottery-kind-list {
      // max-width:1200px;
      padding:10px;
      width: 100%;
      margin: 0 auto;
      li {
        width:16.66667%;
        cursor: pointer;
        float:left;
      }
    }
  }

  @media screen and (max-width:1200px) {
    .lottery-kind {
      .lottery-kind-list {
        li {
          width:20%;
        }
      }
    }
  }
  @media screen and (max-width:1100px) {
    .lottery-kind {
      .lottery-kind-list {
        li {
          width:25%;
        }
      }
    }
  }
  
  @media screen and (max-width:900px) {
    .lottery-kind {
      .lottery-kind-list {
        li {
          width:33.333333%;
        }
      }
    }
  }
  
  @media screen and (max-width:600px) {
    .lottery-kind {
      .lottery-kind-list {
        li {
          width:50%;
        }
      }
    }
  }

  // @media screen and (min-width: 602px) and (max-width:928px) {
  //   .lottery-kind {
  //     .lottery-kind-list {
  //       li {
  //         &:nth-child(2n) {
  //           margin-right: 0;
  //         }

  //         &:nth-child(3n) {
  //           margin-right: 30px;
  //         }
  //       }
  //     }
  //   }
  // }
</style>
