<template>
  <div class="contactUs user-common">
    <!-- <h2 style="font-weight:normal;" class="insert-to-bottom-line">{{$t('message.contact_us')}}</h2> -->
    <div class="game-title contact_us">
      <div class="icon-text"><span class="icon"></span><span class="text">{{$t("message.contact_us")}}</span></div>
    </div>
    <div class="line-qr mt-30"><img src="@/assets/img/home/qr-code.png" alt=""></div>
    <ul class="contact-info">
      <li class="mt-20">
        <span class="icon-line"><img src="@/assets/img/sponsoredLink/icon_Line@3x.png" alt=""></span>
        <span class="text">Line ID : <a href="line://ti/p/%40glk4347i">@kingslot9</a></span>
      </li>
      <li class="mt-20">
        <span class="icon-facebook"><img src="@/assets/img/sponsoredLink/icon_Facebook@3x.png" alt=""></span>
        <span class="text">Facebook : <a href="https://www.facebook.com/Kingslot9-418399282269037/">Kingslot9</a></span>
      </li>
      <li class="mt-20">
        <span class="icon-phone"><img src="@/assets/img/help/phone.png" alt=""></span>
        <span class="text">Call : 0970252570</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'contactUs',
  data() {
    return {
      msg: 'nihao'
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  watch: {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.contactUs{
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-box-align:center;
  color:#eee;
  padding-bottom:8.13vw;
  .contact_us{
    margin-bottom:0!important;
    .icon{
      width:7.07vw;
      height:8.53vw;
      background:url(../assets/img/home/contact.png);
      background-size:100% 100%;
    }
  }
  .line-qr{
    width:40vw;
    height:40vw;
  }
  .contact-info{
    li{
      display:-webkit-box;
      -webkit-box-align:center;
      -webkit-box-pack:start;
      font-size:4vw;
      color: #fff;
      span{
        display:block;
      }
      .icon-line{
        width:4.27vw;
        height:3.87vw; 
        margin-right:1.33vw;
      }
      .icon-facebook, .icon-phone{
        width:4.27vw;
        height:4.27vw;
        margin-right:1.33vw;
      }
      a{
        color:#fff;
        &:visited{
          color:#fff;
        }
      }
    }
  }
}
</style>


