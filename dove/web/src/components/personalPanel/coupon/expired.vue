<template>
  <div class="unused" v-loading="loading">
    <ul v-if="list.length>0">
      <li v-for="(item, i) in list" :key="i">
        <coupon status="expired" :coupon="item"></coupon>
      </li>
    </ul>
    <p class="no-result" v-if="noresult">{{$t("message.no_data")}}</p>
  </div>
</template>
<script>
import moment from 'moment';
import coupon from '@/components/public/couponView';
export default {
  name: 'unused',
  components: {
    coupon
  },
  data() {
    return {
      list: [],
      noresult: false,
      loading: false,
    };
  },
  methods: {
    getCouponList() {
      const vm = this;
      const url = "/coupon/list";
      this.loading = true;
      vm.$http.get(url, {}).then(
        response => {
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.logout(this);
            } else if (status == 200) {
              vm.formatData(response.body.data)
            } else {}
          }else{
            vm.formatData([])
          }
        },
        error => {
          vm.loading = false;
          vm.formatData([])
          console.log("error", error);
        }
      );
    },
    formatData(data) {
      if(data.length === 0){
        this.noresult = true;
        return;
      }else{
        this.noresult = false;
        this.list = data.filter(v => {return v.status == 2})
      }
      if(this.list.length === 0){
        this.noresult = true;
      }else{
        this.noresult = false;
      }
    }
  },
  computed: {},
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {
    this.getCouponList();
  },
  beforeMount() {},
  mounted() {
    //
  },
  watch: {},
}

</script>
<style lang="scss" scoped>
.unused{
  width:420px;
  margin:0 auto;
  li{
    margin-top:30px;
  }
  .no-result{
    font-size:16px;
    text-align:center;
    margin-top:30px;
    color:#fff;
  }
}
</style>
