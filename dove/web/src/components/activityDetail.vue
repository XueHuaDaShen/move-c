<template>
  <div class="activityDetail user-common">
    <div class="title">
      <p class="mt-40">{{contentData.title}}</p>
      <p class="time mt-10">{{moment(contentData.create_at).format('DD/MM/YYYY hh:mm:ss')}}</p>
    </div>
    <img class="img" :src="contentData.content_photo" alt="">
    <div class="content-foot mt-30" v-html="contentData.content"></div>
  </div>
</template>
<script>
import moment from "moment";
import pageTitle from '@/components/public/pageTitle';
export default {
  name: 'activityDetail',
  components: {
    pageTitle
  },
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
        let code = res.body.returncode;
        if(code == 200){
          this.contentData = res.body.data.data[0];
        }else if (code == 103 || code == 106 || code == 101) {
          this.$store.state.logout(this);
        } else {
          this.$store.state.message('error', 'error', 1500, this);
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
  position: relative;
  width:100%;
  background: #111111;
  .title {
    width: 100%;
    height: 135px;
    font-size: 40px;
    color: #ababab;
    background: url(../assets/img/home/pageTitle.png);
    background-size: 100% 100%;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-box-align:center;
  }
  .time{
    font-size: 14px;
    color: #9c9ea2;
  }
  .img{
    width:1100px;
    height:auto;
    margin:0 auto;
  }
  .content-foot{
    width:1100px;
    color: #ababab;
    font-size:14px;
    margin:30px auto;
  }
}
</style>


