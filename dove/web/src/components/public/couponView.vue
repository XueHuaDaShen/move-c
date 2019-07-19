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
  border-radius:8px;
  background-color: #242424;
  overflow: hidden;
  display:-webkit-box;
  position: relative;
  .cash{
    width:130px;
    height:130px;
    padding:25px 0;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-box-pack:justify;
    color:#000;
    p{
      text-align:center;
    }
    .num{
      font-size:28px;
    }
    .unit{
      font-size:14px;
    }
    .desc{
      font-size:12px;
    }
  }
  .info{
    -webkit-box-flex:1;
    padding:15px;
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
      font-size:14px;
      .tag{
        font-size:10px;
        display:inline-block;
        width:46px;
        height:20px;
        text-align:center;
        line-height:20px;
        margin-right:10px;
        border-radius:4px;
      }
    }
    .time{
      font-size:14px;
      color:#888;
      height:30px;
      line-height:30px;
      position: relative;
      .use-btn{
        width:80px;
        height:30px;
        text-align:center;
        line-height:30px;
        font-size:14px;
        color:#000;
        position: absolute;
        top:0;
        right:0;
        border-radius:20px;
        font-weight:bold;
      }
    }
    .source{
      color:#666;
      font-size:12px;
      .icon{
        display:inline-block;
        width:12px;
        height:12px;
        margin-right:5px;
        margin-bottom:-1px;
        background:url(../../assets/img/coupon/note.png);
        background-size:100% 100%;
      }
    }
  }
  .money-icon{
    width:82px;
    height:auto;
    position: absolute;
    right:10px;
    top:30px;
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


