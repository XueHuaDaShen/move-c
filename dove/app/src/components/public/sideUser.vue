<template>
  <div class="sideUser">
    <div class="profile">
      <a class="user-icon-inner mt-60"><img class="user-icon" src="../../assets/img/sideUser/Avatar@3x.png"></a>
      <p v-if="!isLogout" class="important mt-10">{{getAccountName}}</p>
      <p class="p-title mt-30">{{$t('message.account_balance')}}</p>
      <p class="important mt-10">{{ getCash | filterCash}} THB</p>
    </div>
    <dl class="mt-120">
      <dt v-for="(data_,index) in tabs.data" :key="index" @click="routerChange(data_)">
        <div :class="{'active':(data_.component.indexOf(routeName)>-1)}">
          <span :class="data_.iconClass" class="left-icon"></span>
          <span class="a-title">{{$t('message.'+data_.title)}}</span>
        </div>
      </dt>
    </dl>
  </div>
</template>
<script>
  import * as personal from "../../assets/json/personal";

  export default {
    name: 'sideUser',
    data() {
      return {
        isLogout: false,
        loading: false,
        menuActivated: 0 /*当前选中的menu*/ ,
        tabs: {
          //用户管理中心模块数组
          data: personal,
          activehref: "",
          firstActive: 0
        },
      }
    },
    computed: {
      // doveName
      getAccountName() {
        return this.$store.state.doveName;
      },
      // 账户余额
      getCash() {
        return this.$store.state.cash;
      },
      // route name
      routeName() {
        return this.$route.name;
      }
    },
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {},
    beforeMount() {},
    mounted() {
      this.$store.dispatch('setDoveName', localStorage.getItem('dove-app-loginname'));
    },
    watch: {},
    methods: {
      routerChange(data_) {
        this.$router.push({
          path: data_.component[0]
        });
      },
    },
  }

</script>
<style lang="scss" scoped>
  .sideUser {
    width: 200px;
    background: #111111;
    box-shadow: 2px 0 10px 0 rgba(0, 0, 0, 0.5);
    float: left;
    margin-bottom: -99999px;
    padding-bottom: 99999px;
    position: relative;
    z-index: 1;

    .profile {
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      flex-direction: column;

      .user-icon-inner {
        align-self: center;
        cursor: pointer;
        outline: none;
        display: inherit;
        width: 86px;
        height: 86px;
        border: solid 6px #323131;
        border-radius: 50%;
      }

      >img {
        display: block;
      }

      .important {
        text-align: center;
        // font-family: Arial-Black;
        font-size: 20px;
        color: #ababab;
      }

      .p-title {
        text-align: center;
        
        font-size: 16px;
        color: #ababab;
      }
    }

    dl {
      // margin: 20px 0;
    }

    dt {
      cursor: pointer;
      width: 100%;
      position: relative;
      background: #151515;
      border-radius: 4px;
      width: 104px;
      height: 106px;
      margin: 0 auto;
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;

      &:last-child {
        margin-bottom: 0;
      }

      >div {
        text-decoration: none;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        
        font-size: 16px;
        color: #ababab;
        flex-direction: column;
        width: 100%;
        white-space: normal;
        word-break: break-all;
        word-break: break-word;

        .left-icon {
          display: inline-block;
          margin-bottom: 5px;
        }

        .a-title {
          display: block;
          
          font-size: 14px;
          color: #ababab;
          white-space: normal;
        }

        .icon_0 {
          width: 34px;
          height: 40px;
          background: url("../../assets/img/sideUser/icon_Fundss@3x.png");
          background-size: cover;
        }

        .icon_1 {
          width: 35px;
          height: 37px;
          background: url("../../assets/img/sideUser/icon_Funds@3x.png");
          background-size: cover;
        }

        .icon_2 {
          width: 40px;
          height: 36px;
          background: url("../../assets/img/sideUser/icon_Proxy@3x.png");
          background-size: cover;
        }

        .icon_3 {
          width: 32px;
          height: 36px;
          background: url("../../assets/img/sideUser/icon_Notes@3x.png");
          background-size: cover;
        }

        .icon_4 {
          width: 40px;
          height: 38px;
          background: url("../../assets/img/sideUser/icon_Setting@3x.png");
          background-size: cover;
        }

        &.active,
        &:hover {
          .a-title {
            color: #F2CE72;
          }

          .icon_0 {
            background: url("../../assets/img/sideUser/icon_Fundss_a@3x.png");
            background-size: cover;
          }

          .icon_1 {
            background: url("../../assets/img/sideUser/icon_Funds_a@3x.png");
            background-size: cover;
          }

          .icon_2 {
            background: url("../../assets/img/sideUser/icon_Proxy_a@3x.png");
            background-size: cover;
          }

          .icon_4 {
            background: url("../../assets/img/sideUser/icon_Setting_a@3x.png");
            background-size: cover;
          }

          .icon_3 {
            background: url("../../assets/img/sideUser/icon_Notes_a@3x.png");
            background-size: cover;
          }
        }
      }
    }
  }

</style>
