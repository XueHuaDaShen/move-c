<template>
  <div class="help user-common">
    <pageTitle title="help" class="mb-30"></pageTitle>
    <div class="help-content">
      <div class="game-title mb-30">
        <div class="icon-text"><span class="icon"></span><span class="text">{{lowerText($t('message.help'))}}</span></div>
      </div>
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
  </div>
</template>
<script>
import pageTitle from '@/components/public/pageTitle';
export default {
  name: 'help',
  components: {
    pageTitle
  },
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
  created() {},
  beforeMount() {},
  mounted() {},
  watch: {},
  methods: {
    slideDownDesc(index) {
      let show = this.stepList[index].show;
      this.stepList[index].show = !show;
      let h = 160;
      if(this.stepList[index].show){
        document.getElementsByClassName('step-desc-'+index)[0].style.height = h+"px";
        document.getElementsByClassName('step-desc-'+index)[0].style.padding = "20px 60px";
      }else{
        document.getElementsByClassName('step-desc-'+index)[0].style.height = "0px";
        document.getElementsByClassName('step-desc-'+index)[0].style.padding = "0px 60px";
      }
      // console.log(document.getElementsByClassName('step-desc-'+index))
    },
    lowerText(text) {
      if(text === 'HELP') {
        return ( text.charAt(0) + text.substr(1).toLocaleLowerCase() )
      }else{
        return text;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.help{
  width:100%;
  min-height:1285px;
  background: #111111;
  .help-content{
    width:1100px;
    margin:30px auto;
  }
  .game-title{
    .icon{
      width:40px;
      height:40px;
      background:url(../assets/img/help/help.png);
      background-size:100% 100%;
    }
  }
  .help-step-list{
    width:100%;
    li{
      width:100%;
      height:auto;
      border-radius:4px;
      overflow: hidden;
      margin-bottom:20px;
      cursor: pointer;
      &:last-child{
        margin-bottom:0;
      }
    }
    .step-title{
      width:100%;
      height:54px;
      line-height:54px;
      color: #ababab;
      font-size:16px;
      padding:0 60px;
      position: relative;
      text-align:left;
      background: #1f1e1f;
    }
    .slide-down-icon{
      width:16px;
      height:16px;
      position: absolute;
      top:50%;
      margin-top:-8px;
      right:60px;
      cursor: pointer;
      transition: all .3s ease;
    }
    .slide-up-icon{
      transform: rotateZ(180deg);
      transition: all .3s ease;
    }
    .step-desc{
      height:0;
      padding:0 60px;
      color: #ffffff;
      font-size:14px;
      background: #161616;
      text-align:left;
      line-height:20px;
      // display:none;
      transition: all .3s;
    }
  }
}
</style>


