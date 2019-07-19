<template>
  <div class="help">
    <ul class="help-step-list">
      <li @click="slideDownDesc(i)" v-for="(item, i) in stepList" :key="i">
        <div class="step-title">
          <span>{{$t('message.help_step.step'+(i+1)+'.title')}}</span>
          <em class="slide-down-icon" :class="item.show?'slide-up-icon':''"><img src="@/assets/img/help/slide-down.png" alt=""></em>
        </div>
        <p class="step-desc" :class="'step-desc-'+i">{{$t('message.help_step.step'+(i+1)+'.desc')}}</p>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'help',
  data() {
    return {
      msg: 'nihao',
      showDesc: false,
      stepList: [
        {show: false},
        {show: false},
        {show: false},
        {show: false},
        {show: false},
        {show: false},
        // {show: false},
      ],
    }
  },
  beforeDestroy() {},
  destroyed() {},
  beforeCreate() {},
  created() {
    this.$store.dispatch('setHeaderName', this.$t("message.help"));
  },
  beforeMount() {},
  mounted() {},
  watch: {},
  methods: {
    slideDownDesc(index) {
      let show = this.stepList[index].show;
      this.stepList[index].show = !show;
      let h = 3.2;
      if(this.stepList[index].show){
        document.getElementsByClassName('step-desc-'+index)[0].style.height = h+"rem";
        document.getElementsByClassName('step-desc-'+index)[0].style.padding = "4vw";
      }else{
        document.getElementsByClassName('step-desc-'+index)[0].style.height = "0px";
        document.getElementsByClassName('step-desc-'+index)[0].style.padding = "0px 4vw";
      }
      // console.log(document.getElementsByClassName('step-desc-'+index))
    }
  }
}
</script>
<style lang="scss" scoped>
.help{
  width:100%;
  padding:4vw;
  background: #111111;
  .help-step-list{
    width:100%;
    li{
      width:100%;
      height:auto;
      border-radius:1.07vw;
      overflow: hidden;
      margin-bottom:4vw;
      cursor: pointer;
      &:last-child{
        margin-bottom:0;
      }
    }
    .step-title{
      width:100%;
      color: #ababab;
      font-size:4vw;
      // padding:5.73vw 16.93vw 5.73vw 4vw;
      padding:0 16.93vw 0 4vw;
      height:17.33vw;
      display:-webkit-box;
      -webkit-box-align:center;
      position: relative;
      text-align:left;
      background: #1f1e1f;
    }
    .slide-down-icon{
      width:4vw;
      height:4vw;
      position: absolute;
      top:50%;
      margin-top:-2vw;
      // margin-top:-.15rem;
      right:2.67vw;
      // right:.2rem;
      cursor: pointer;
      transition: all .3s ease;
    }
    .slide-up-icon{
      transform: rotateZ(180deg);
      transition: all .3s ease;
    }
    .step-desc{
      height:0;
      padding:0 4vw;
      color: #ababab;
      font-size:4vw;
      background: #010101;
      text-align:left;
      line-height:20px;
      // display:none;
      transition: all .3s;
    }
  }
}
</style>


