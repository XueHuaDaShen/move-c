<template>
  <div class="common bet-detail-wrap">
    <trueBetRecordDetail v-if="showTemplate"></trueBetRecordDetail>
    <falseBetRecordDetail v-if="!showTemplate"></falseBetRecordDetail>
  </div>
</template>
<script>
import trueBetRecordDetail from './betRecordDetailTemplate/trueBetRecordDetail';
import falseBetRecordDetail from './betRecordDetailTemplate/falseBetRecordDetail';
export default {
  name: 'betRecordDetail',
  components: {
    trueBetRecordDetail,
    falseBetRecordDetail
  },
  props: {},
  data() {
    return {
      showTemplate: false
    }
  },
  beforeDestroy() {},
  destroyed() {},
  created() {
    let query = this.$route.query;
    if(query.create_f_d_template){
      this.showTemplate = false;
    }else{
      this.showTemplate = true;
    }
    this.$store.dispatch("setRouterTagIndex", 3);
  }
}

</script>
