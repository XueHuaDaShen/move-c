<template>
  <div class="activityDetail user-common">
    <h2 class="title">{{contentData.title}}</h2>
    <p class="time mt-10">{{moment(contentData.create_at).format('DD/MM/YYYY hh:mm:ss')}}</p>
    <img class="img mt-10" :src="contentData.content_photo" alt="">
    <div class="content-foot mt-30" v-html="contentData.content"></div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: 'activityDetail',
  data() {
    return {
      msg: 'nihao',
      moment: moment,
      contentData: {},
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {
    this.$store.dispatch('setHeaderName', this.$t("message.activity"));
    this.getActivityDetail();
  },
  beforeMount() {},
  mounted() {},
  watch: {},
  methods: {
    // banner 图片
    getActivityDetail() {
      this.$http.get('/active/list', {
        params: {
          id: this.$route.query.id
        }
      }).then(res => {
        if(res.body.returncode == 200){
          // console.log(res.body.data)
          this.contentData = res.body.data.data[0];
        }
        // console.log(res)
      }).then(err => {})
    },
  }
}
</script>
<style lang="scss" scoped>
.activityDetail{
  text-align:center;
  padding-top:4vw;
  padding-bottom:8vw;
  .title{
    font-size: 4.8vw;
    color: #ababab;
  }
  .time{
    font-size: 3.73vw;
    color: #9c9ea2;
  }
  .img{
    width:100%;
  }
  .content-foot{
    padding:0 4vw;
    color: #ababab;
    font-size:4vw;
  }
}
</style>


