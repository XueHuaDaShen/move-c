<template>
  <div class="common bet-wrap">
    <trueBetRecord v-if="showTemplate"></trueBetRecord>
    <falseBetRecord :falseData="falseData" v-if="!showTemplate&&falseData.length>0"></falseBetRecord>
  </div>
</template>
<script>
import trueBetRecord from './betRecordTemplate/trueBetRecord';
import falseBetRecord from './betRecordTemplate/falseBetRecord';
export default {
  name: 'betRecord',
  components: {
    trueBetRecord,
    falseBetRecord
  },
  props: {},
  data() {
    return {
      showTemplate: false,
      falseData: [],
    }
  },
  beforeDestroy() {},
  destroyed() {},
  computed: {},
  created() {
    let query = this.$route.query;
    if(query.create_f_d_template){
      this.showTemplate = false;
    }else{
      this.showTemplate = true;
    }
    localStorage.removeItem('falseOrderDetailData')
    this.$store.dispatch("setRouterTagIndex", 3);
  },
  beforeMount() {
    
  },
  mounted() {
    const vm = this;
    vm.falseData = [];
    window.addEventListener('message',function(event) {
      // console.log(event);
      //if(event.origin !== 'http://localhost:8080') return;
      // console.log('message lister:  ' + event.data,event);
      vm.falseData = event.data.data || [];
      localStorage.setItem('candy-loginname', event.data.username)
      vm.$store.dispatch("setCash", event.data.cash);
      localStorage.setItem("candy-cash", event.data.cash);
      localStorage.setItem("candy-cash_credit", event.data.cash);
    },false);
  },
  methods: {}
}

</script>
