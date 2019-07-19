<template>
  <div class="coupon" :class="status">
    <div class="cash">
      <p class="money">
        <span class="num">{{coupon.packageid.free}}</span>
        <span class="unit">THB</span>
      </p>
      <p class="desc">{{$t("message.coupon.desc")}}{{coupon.packageid.payload}}</p>
    </div>
    <div class="info">
      <p class="type">
        <span class="tag">{{coupon.packageid.account_type.toUpperCase()}}</span>
        {{$t("message.coupon.type")}} {{coupon.packageid.account_type}}
      </p>
      <p class="time">
        {{$t("message.coupon.time")}}：{{coupon.expire | formatTimeDay}}
        <span class="use-btn" v-if="status === 'unused'" @click="callback(coupon)">{{$t("message.coupon.unused")}}</span>
        <span class="use-btn" v-if="status === 'used'">{{$t("message.used")}}</span>
        <span class="use-btn" v-if="status === 'expired'">{{$t("message.expired")}}</span>
      </p>
      <p class="source">
        <span class="icon"></span>
        {{coupon.packageid.name}}
      </p>
    </div>
    <div class="money-icon"><img src="@/assets/img/coupon/money-icon.png" alt=""></div>
  </div>
</template>
<script>
export default {
  name: 'coupon',
  props: {
    status: {
      required: true,
      type: String
    },
    coupon: {
      required: true,
    },
    callback: {
      type: Function,
      required: false
    }
  },
  data() {
    return {
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
  }
}
</script>
<style lang="scss" scoped>
.coupon{
  width:100%;
  border-radius:2.13vw;
  background-color: #242424;
  overflow: hidden;
  display:-webkit-box;
  position: relative;
  .cash{
    width:30.67vw;
    height:30.67vw;
    padding:7.33vw 0;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-box-pack:justify;
    color:#000;
    .money{
      height:7.87vw;
      // line-height:7.87vw;
      display:-webkit-box;
      -webkit-box-align:center;
      -webkit-box-pack:center;
      span{
        display:block;
      }
    }
    p{
      text-align:center;
    }
    .num{
      font-size:5.6vw;
    }
    .unit{
      font-size:3.67vw;
    }
    .desc{
      font-size:3.2vw;
    }
  }
  .info{
    -webkit-box-flex:1;
    padding:2.67vw 2.53vw 2.53vw 2.67vw;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-box-pack:justify;
    color:#888888;
    position: relative;
    z-index:2;
    p{
      text-align:left;
    }
    .type{
      color:#fff;
      font-size:3.73vw;
      .tag{
        font-size:3.2vw;
        display:inline-block;
        width:13.07vw;
        height:6vw;
        text-align:center;
        line-height:6vw;
        margin-right:2.67vw;
        border-radius:1.07vw;
      }
    }
    .time{
      font-size:3.2vw;
      color:#888;
      height:7.47vw;
      line-height:7.47vw;
      position: relative;
      .use-btn{
        width:18vw;
        height:7.47vw;
        text-align:center;
        line-height:7.47vw;
        font-size:3.73vw;
        color:#000;
        position: absolute;
        top:0;
        right:0;
        border-radius:4.4vw;
        font-weight:bold;
      }
    }
    .source{
      color:#666;
      font-size:3.2vw;
      .icon{
        display:inline-block;
        width:3.2vw;
        height:3.2vw;
        margin-right:1.33vw;
        margin-bottom:-1px;
        background:url(../../assets/img/coupon/note.png);
        background-size:100% 100%;
      }
    }
  }
  .money-icon{
    width:21.47vw;
    height:auto;
    position: absolute;
    right:4vw;
    top:4vw;
  }
}
.unused{
  .cash{
    background-image: linear-gradient(180deg,#cdb07a 0%,#a08553 100%);
  }
  .tag{
    background-color: #f98c69;
  }
  .use-btn{
    background-image: linear-gradient(134deg, #fadcab 0%, #d99d59 100%, #f2b672 100%);
    cursor: pointer;
  }
}
.used, .expired{
  .cash{
    background-image: none;
    background:#666666;
  }
  .tag{
    background:#666666;
  }
  .use-btn{
    background-image: none;
    background:#666666;
  }
}
</style>


