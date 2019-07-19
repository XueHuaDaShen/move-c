<template>
  <div>
    <div class="border-bottom-bj">
      <img src="@/assets/img/home/border-bottom-bj.png" alt>
    </div>
    <div class="header-nav">
      <img src="@/assets/img/logo.png" class="logo">
      <img src="@/assets/img/home-nav/header-title.png" class="header-title" alt="">
      <nav v-if="login">
        <span class="span-nav" v-if="login&&getType(item.type)" @mouseleave="handleLeaveNav($event)" :class="nav[getRouterTagIndex||0].name === item.name?'active':''"
          v-for="(item, index) in nav" :key="index" @click="setTag(index, item.url, '', $event)">
          <i @mouseover="handleHoverNav($event)">
            <em :class="nav[getRouterTagIndex||0].name === item.name?item.icon+'-ed':item.icon"></em>
            {{$t("message."+item.name)}}
            <em :class="nav[getRouterTagIndex||0].name === item.name?'nav-icon-ed':'nav-icon'" v-if="item.list"></em>
          </i>
          <ul class="item-list">
            <em class="sanjiao" v-if="item.list"></em>
            <li v-for="(list, l) in item.list" :key="l" v-if="getListItemVisible(list)" @click="setTag(index, list.url, '', $event)">
              <span>{{$t("message."+list.name)}}</span>
              <el-badge is-dot :hidden="msgHidden" v-if="list.url === 'inbox' " class="badge"></el-badge>
              <el-badge is-dot :hidden="withdrawMsgHidden&&rechargeMsgHidden" class="badge" v-if="list.url === 'rechargeApply'"></el-badge>
            </li>
          </ul>
          <el-badge is-dot :hidden="msgHidden" v-if="item.name === 'xiao_xi_zhong_xin' " class="badge"></el-badge>
          <el-badge is-dot :hidden="withdrawMsgHidden&&rechargeMsgHidden" class="badge" v-if="item.name === 'dai_li_zhong_xin'"></el-badge>
        </span>
        <span class="span-nav" v-if="!login" @mouseleave="handleLeaveNav($event)" :class="nav[getRouterTagIndex||0].name === item.name?'active':''"
          v-for="(item, index) in noLoginNav" :key="index" @click="setTag(index, item.url, '', $event)">
          <i @mouseover="handleHoverNav($event)">
            <em :class="nav[getRouterTagIndex||0].name === item.name?item.icon+'-ed':item.icon"></em>
            {{$t("message."+item.name)}}
            <em :class="nav[getRouterTagIndex||0].name === item.name?'nav-icon-ed':'nav-icon'" v-if="item.list"></em>
          </i>
          <ul class="item-list">
            <em class="sanjiao" v-if="item.list"></em>
            <li v-for="(list, l) in item.list" :key="l" @click="setTag(index, list.url, '', $event)">{{$t("message."+list.name)}}</li>
          </ul>
        </span>
        <!-- <em class="tag" :class="tagClass" v-if="tagClass"></em> -->
      </nav>
      <div class="user">
        <span v-if="login" @mouseover="getUsername">
          <em class="user-icon">
            <img src="@/assets/img/user-icon.png" alt>
          </em>
          {{$t("message.yu_e")}}：{{getCash |
          formatCash}}
          THB
          <em class="refresh-icon">
            <img @click="getProfile" src="@/assets/img/icon-refresh.png" alt>
          </em>
          <ul class="item-list">
            <em class="sanjiao"></em>
            <li>{{username}}</li>
            <li @click="logout">
              <em class="logout-icon">
                <img src="@/assets/img/logout-icon.png" alt>
              </em>
              {{$t("message.logout")}}
            </li>
          </ul>
        </span>
        <!-- <span v-if="$i18n.locale == 'th'" @click="changeLanguage">
          <em class="zh-icon">
            <img src="@/assets/img/zh-icon.png" alt>
          </em>
          {{$i18n.locale == 'zh' ? 'Thai' : 'Chinese'}}
        </span>
        <span v-if="$i18n.locale == 'zh'" @click="changeLanguage">
          <em class="th-icon">
            <img src="@/assets/img/th-icon.png" alt>
          </em>
          {{$i18n.locale == 'zh' ? 'Thai' : 'Chinese'}}
        </span>-->
      </div>
      <div class="show-nav-icon" v-if="login" style="top:20px;" @click="showNav = !showNav">
        <img src="@/assets/img/home-nav/home-icon.png" alt="">
        <span>home</span>
      </div>
      <!-- <i class="show-nav-icon el-icon-tickets" @click="showNav = !showNav"></i> -->
      <ul class="nav-list" v-if="showNav">
        <li v-if="login&&getType(item.type)" :class="nav[getRouterTagIndex||0].name === item.name?'active':''" v-for="(item, index) in nav"
          :key="index" @click="setTag(index, item.url, 'hide', $event)">
          <i>
            <em :class="(nav[getRouterTagIndex||0].name === item.name  && showNav)?item.icon+'-ed':item.icon"></em>
            {{$t("message."+item.name)}}
            <em :class="(nav[getRouterTagIndex||0].name === item.name  && showNav)?'nav-icon-ed':'nav-icon'" v-if="item.list"></em>
          </i>
          <el-badge is-dot :hidden="msgHidden" v-if="item.name === 'xiao_xi_zhong_xin' " class="badge"></el-badge>
          <el-badge is-dot :hidden="withdrawMsgHidden || rechargeMsgHidden" class="badge" v-if="item.name === 'dai_li_zhong_xin'"></el-badge>
          <ul class="item-list" v-if="nav[getRouterTagIndex||0].name === item.name && showNav">
            <li v-for="(list, l) in item.list" v-if="getListItemVisible(list)" :key="l" @click="setTag(index, list.url, 'hide', $event)">
              <span style="position:relative">
                {{$t("message."+list.name)}}
                <el-badge is-dot :hidden="msgHidden" v-if="list.url === 'inbox' " class="badge"></el-badge>
                <el-badge is-dot :hidden="withdrawMsgHidden || rechargeMsgHidden" class="badge" v-if="list.url === 'rechargeApply'"></el-badge>
              </span>
            </li>
          </ul>
        </li>
        <li v-if="!login" :class="nav[getRouterTagIndex||0].name === item.name?'active':''" v-for="(item, index) in noLoginNav" :key="index"
          @click="setTag(index, item.url, 'hide', $event)">
          <i>
            <em :class="(nav[getRouterTagIndex||0].name === item.name  && showNav)?item.icon+'-ed':item.icon"></em>
            {{$t("message."+item.name)}}
            <em :class="(nav[getRouterTagIndex||0].name === item.name  && showNav)?'nav-icon-ed':'nav-icon'" v-if="item.list"></em>
          </i>
          <ul class="item-list" v-if="nav[getRouterTagIndex||0].name === item.name && showNav">
            <li v-for="(list, l) in item.list" :key="l" @click="setTag(index, list.url, 'hide', $event)">{{$t("message."+list.name)}}</li>
          </ul>
        </li>
        <li class="custom" v-if="login">
          {{$t("message.yu_e")}}：{{getCash | formatCash}} THB
          <em class="refresh-icon">
            <img @click="getProfile" src="@/assets/img/icon-refresh.png" alt>
          </em>
        </li>
        <li class="custom" v-if="login">
          <em class="user-icon">
            <img src="@/assets/img/user-icon.png" alt>
          </em>
          {{username}}
        </li>
        <li class="custom" v-if="login" @click="logout">
          <!-- <em class="logout-icon">
            <img src="@/assets/img/logout-icon.png" alt>
          </em> -->
          {{$t("message.logout")}}
        </li>
        <!-- <li v-if="$i18n.locale == 'th'" @click="changeLanguage">
          <em class="zh-icon">
            <img src="@/assets/img/zh-icon.png" alt>
          </em>
          {{$i18n.locale == 'zh' ? 'Thai' : 'Chinese'}}
        </li>
        <li v-if="$i18n.locale == 'zh'" @click="changeLanguage">
          <em class="th-icon">
            <img src="@/assets/img/th-icon.png" alt>
          </em>
          {{$i18n.locale == 'zh' ? 'Thai' : 'Chinese'}}
        </li>-->
      </ul>
    </div>
    <div class="border-bottom-bj">
      <img src="@/assets/img/home/border-bottom-bj.png" alt>
    </div>
  </div>
</template>
<script>
  export default {
    name: "myHeader",
    components: {},
    props: {},
    data() {
      return {
        ul_height: 451,
        nav: [{
            name: "shou_ye",
            icon: 'nav-icon-home',
            url: "home"
          },
          {
            name: "cai_zhong",
            icon: 'nav-icon-lottery',
            url: "lotteryKind"
          },
          {
            name: "kai_jiang_jie_guo",
            icon: 'nav-icon-prize',
            url: "timePrize"
          },
          {
            name: "ge_ren_zhong_xin",
            icon: 'nav-icon-per',
            list: [{
                name: "chong_zhi",
                url: "recharge"
              },
              {
                name: "ti_xian",
                url: "withdraw"
              },
              {
                name: "ge_ren_zhong_xin",
                url: "betRecord"
              },
              {
                name: "user_profit",
                url: "userProfit"
              }
            ]
          },
          {
            name: "my_tui_jian",
            icon: 'nav-icon-tuijian',
            url: "sponsoredLink",
            type: "2"
          },
          {
            name: "dai_li_zhong_xin",
            icon: 'nav-icon-agent',
            type: "1",
            list: [{
                name: "tuan_dui_guan_li",
                url: "memberList"
              },
              {
                name: "tuan_dui_ji_lu",
                url: "teamBet"
              },
              {
                name: "tuan_dui_chong_ti",
                url: "rechargeApply"
              },
              {
                name: "team_profit",
                url: "teamProfit"
              }
            ]
          },
          {
            name: "xiao_xi_zhong_xin",
            icon: 'nav-icon-message',
            list: [{
                name: "ping_tai_gong_gao",
                url: "notice"
              },
              {
                name: "zhan_nei_xin",
                url: "inbox"
              }
            ]
          },
          {
            name: "ge_ren_she_zhi",
            icon: 'nav-icon-set',
            list: [{
                name: "ge_ren_zi_liao",
                url: "basicInfo"
              },
              {
                name: "bank_account",
                url: "bankAccount"
              },
              {
                name: "contact_agent",
                url: "agentContact"
              }
            ]
          },
          {
            name: "download",
            icon: 'nav-icon-download',
            url: "download"
          }
        ],
        noLoginNav: [{
            name: "shou_ye",
            url: "home"
          },
          {
            name: "cai_zhong",
            url: "lotteryKind"
          },
          {
            name: "kai_jiang_jie_guo",
            url: "timePrize"
          },
          {
            name: "download",
            url: "download"
          }
        ],

        routerQuery: "",

        username: "",
        showUser: false,
        tagClass: "",
        showNav: false,

        login: false,
        userType: "", // 用户类型
        //新消息定时对象
        myInterval: null,
        rechargeInterval: null,
        withdrawInterval: null,
      };
    },
    destroyed() {},
    created() {
      let isLogin = localStorage.getItem("candy-login");
      if (isLogin === "true") {
        this.getProfile();
        // this.hasNewMessage();
        // this.hasNewRecharge();
        // this.hasNewWithdraw();
      }
      this.cash = localStorage.getItem("candy-cash") || 0;
      this.$store.dispatch("setCash", this.cash);
      this.login = localStorage.getItem("candy-login") === "true";
      if(this.$route.query.create_f_d_template){
        this.login = true;
      }
      this.userType = localStorage.getItem("candy-type");
      let tag = sessionStorage.getItem("th_tag_index");
      let url = sessionStorage.getItem("th_tag_url");
      let routerTagIndex = this.$store.state.routerTagIndex;
      tag = routerTagIndex ? routerTagIndex : tag;
      let index = tag ? tag : 0;
      let arr = window.location.hash.split("?")[0].split("/");
      if (arr[1] === "betRecordDetail" || arr[1] === "reg") {
        return;
      }
      this.$store.dispatch("setRouterTagIndex", index);
      // this.navClass = this.nav[index].name;
    },
    mounted() {
      const vm = this;
      window.addEventListener("popstate", function (ev) {
        let url = location.hash.split("/")[1];
        // console.log(url)
        let index = 0;
        vm.nav.filter((v, vi) => {
          if (v.url == url) {
            index = vi;
          } else {
            if (v.list) {
              v.list.filter(l => {
                if (l.url == url) {
                  index = vi;
                }
              });
            }
          }
        });
        if (url == "lotteryPrize") {
          index = 2;
        }
        if (url.indexOf("lotteryDetail") > -1) {
          index = 1;
        }
        sessionStorage.setItem("th_tag_index", index);
        vm.$store.dispatch("setRouterTagIndex", index);
      });
    },
    methods: {
      //getUsername
      getUsername() {
        this.username = localStorage.getItem("candy-loginname") || 0;
        this.cash = localStorage.getItem("candy-cash") || 0;
      },
      // 新消息提示
      hasNewMessage() {
        const vm = this;
        vm.$http.get("/message/notice", {}).then(
          response => {
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                vm.$store.state.reLogin(vm);
              } else if (status == 200) {
                vm.$store.dispatch("setMsgHidden", false);
              } else if (status === 301) {
                vm.$store.dispatch("setMsgHidden", true);
              } else {
                vm.$store.dispatch("setMsgHidden", true);
              }
            }
          },
          response => {}
        );
      },
      // 新充值消息提示
      hasNewRecharge() {
        const vm = this;
        vm.$http.get("/agency/team/recharge/notice", {}).then(
          response => {
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                vm.$store.state.reLogin(vm);
              } else if (status == 200) {
                vm.$store.dispatch("setRechargeMsgHidden", false);
              } else if (status === 301) {
                vm.$store.dispatch("setRechargeMsgHidden", true);
              } else {
                vm.$store.dispatch("setRechargeMsgHidden", true);
              }
            }
          },
          response => {}
        );
      },
      // 新提现消息提示
      hasNewWithdraw() {
        const vm = this;
        vm.$http.get("/agency/team/withdraw/notice", {}).then(
          response => {
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                vm.$store.state.reLogin(vm);
              } else if (status == 200) {
                vm.$store.dispatch("setWithdrawMsgHidden", false);
              } else if (status === 301) {
                vm.$store.dispatch("setWithdrawMsgHidden", true);
              } else {
                vm.$store.dispatch("setWithdrawMsgHidden", true);
              }
            }
          },
          response => {}
        );
      },
      // 定时获取新消息是否存在
      getNewMessage() {
        const vm = this;
        vm.hasNewMessage();
        vm.myInterval = setInterval(() => {
          vm.hasNewMessage();
        }, 10 * 60 * 1000);
      },
      // 定时获取新充值消息是否存在
      getNewRecharge() {
        const vm = this;
        vm.hasNewRecharge();
        vm.rechargeInterval = setInterval(() => {
          vm.hasNewRecharge();
        }, 10 * 60 * 1000);
      },
      // 定时获取新提现消息是否存在
      getNewWithdraw() {
        const vm = this;
        vm.hasNewWithdraw();
        vm.withdrawInterval = setInterval(() => {
          vm.hasNewWithdraw();
        }, 10 * 60 * 1000);
      },
      getType(type) {
        let candy_type = localStorage.getItem("candy-type");
        if (type) {
          if (candy_type === type) {
            // //如果是当前用户为代理，则全显示
            // if (type === '2') {
            //   return false;
            // }
            return true;
          } else {
            return false;
          }
        }
        return true;
      },
      getListItemVisible(item) {
        // 如果当前为直客，则显示sponsoredLink
        let candy_type = localStorage.getItem("candy-type");
        if (item.url === "sponsoredLink") {
          return candy_type === "2";
        }
        /* if (item.url === "userProfit") {
          return candy_type != "1";
        } */
        return true;
      },
      handleHoverNav(e) {
        if (e.target.nextElementSibling) {
          e.target.nextElementSibling.style.display = "inline-block";
        }
      },
      handleLeaveNav(e) {
        // console.log(e)
        if (e.target.children[1]) {
          e.target.children[1].style.display = "none";
        }
      },
      setTag(index, url, hide, eve) {
        if (eve) {
          eve.stopPropagation();
          eve.preventDefault();
        }
        const vm = this;
        this.userType = localStorage.getItem("candy-type");
        // let query = sessionStorage.getItem("candy-query");
        // query = query ? JSON.parse(query) : '';
        if (this.nav[index].url) {
          this.tagClass = "left" + index;
        } else {
          this.tagClass = "";
        }
        // this.navClass = this.nav[index].name;
        sessionStorage.setItem("th_tag_index", index);
        this.$store.dispatch("setRouterTagIndex", index);
        if (url) {
          sessionStorage.setItem("th_tag_url", url);
          // sessionStorage.setItem('candy-query', query);
          if (this.userType == "1") {
            if (url === "betRecord") {
              this.$router.push({
                name: "rechargeRecord"
              });
            } else {
              this.$router.push({
                name: url
              });
            }
          } else {
            this.$router.push({
              name: url
            });
          }
          if (hide) {
            this.showNav = false;
          }
        } else {
          sessionStorage.setItem(
            "th_tag_url",
            vm.nav[index].url || sessionStorage.getItem("th_tag_url")
          );
          // sessionStorage.setItem('candy-query', query);
          if (this.userType == "1") {
            if (this.nav[index].url === "betRecord") {
              this.$router.push({
                name: "rechargeRecord"
              });
            } else {
              this.$router.push({
                name: vm.nav[index].url
              });
            }
          } else {
            this.$router.push({
              name: vm.nav[index].url
            });
          }
        }
      },
      // 切换语言
      changeLanguage() {
        let language = this.$i18n.locale;
        // return false;
        // console.log(this.$t("message"))
        if (language === "zh") {
          this.$i18n.locale = "th";
          localStorage.setItem("candy-locale", "th");
        } else {
          this.$i18n.locale = "zh";
          localStorage.setItem("candy-locale", "zh");
        }
        this.showNav = false;
        // window.location.reload(true);
      },
      // 退出登录
      logout() {
        localStorage.removeItem("candy-login");
        localStorage.removeItem("candy-cash");
        localStorage.removeItem("candy-cash_credit");
        localStorage.removeItem("candy-loginname");
        localStorage.removeItem("candy-firstname");
        localStorage.removeItem("candy-lastname");
        localStorage.removeItem("candy-phone");
        localStorage.removeItem("candy-email");
        localStorage.removeItem("candy-superiorphone");
        localStorage.removeItem("candy-superiorlineid");
        localStorage.removeItem("candy-token");
        localStorage.removeItem("candy-loginid");
        localStorage.removeItem("candy-type");
        sessionStorage.removeItem("th_tag_index");
        sessionStorage.removeItem("th_tag_url");
        sessionStorage.removeItem("noticeShowed");
        this.$store.dispatch("setRouterTagIndex", false);
        // history.go(0)
        // console.log(this.$route)
        this.showNav = false;
        this.$router.push({
          name: "login"
        });
        // if(this.$route.name === 'home'){
        //   window.location.reload(true);
        // }else{
        //   this.$router.push({
        //     name: 'login'
        //   })
        // }
      },
      getProfile() {
        const vm = this;
        this.$http.get("/user/profile", {}).then(
          response => {
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.reLogin(this);
              } else if (status == 200) {
                let data = response.body.data;
                localStorage.setItem("candy-cash", data.cash);
                localStorage.setItem("candy-birthday", data.birthday||'');
                this.$store.dispatch("setCash", data.cash);
                localStorage.setItem("candy-cash_credit", data.cash_credit);
                localStorage.setItem("candy-loginname", data.loginname);
                localStorage.setItem("candy-loginid", data._id);
                localStorage.setItem("candy-phone", data.phone);
                localStorage.setItem("candy-email", data.email);
                localStorage.setItem("candy-lineid", data.lineid);
                localStorage.setItem("candy-firstname", data.firstname);
                localStorage.setItem("candy-lastname", data.lastname);
                localStorage.setItem("candy-type", data.type);
                if (data.superiorid) {
                  if (data.superiorid.phone) {
                    localStorage.setItem(
                      "candy-superiorphone",
                      data.superiorid.phone
                    );
                  }
                  if (data.superiorid.lineid) {
                    localStorage.setItem(
                      "candy-superiorlineid",
                      data.superiorid.lineid
                    );
                  }
                }
                // vm.getMember();
              } else {
                alert(response.body.returncode);
              }
            }
          },
          response => {
            // console.log('error', error);
          }
        );
      },
    },
    watch: {
      $route(t, f) {
        // console.log(t, f)
        if(!this.$route.query.create_f_d_template){
          if (t.name === "login" && f.name === "login") {
            location.reload();
          }
          const vm = this;
          this.login = localStorage.getItem("candy-login") === "true";
          if (!this.login) {
            clearInterval(vm.myInterval);
            clearInterval(vm.rechargeInterval);
            clearInterval(vm.withdrawInterval);
          } else {
            vm.getNewMessage();
            vm.getNewRecharge();
            vm.getNewWithdraw();
          }
          if (t.name === "home" || t.name === "login") {
            // this.navClass = "shou_ye";
            this.$store.dispatch("setRouterTagIndex", 0);
          }
          if (t.name != "login" && t.name != "reg" && t.name != "losePassword") {
            if (!this.login) {
              this.$router.push({
                name: "login"
              });
            }
          }
          this.username = localStorage.getItem("candy-loginname");
          this.cash = localStorage.getItem("candy-cash") || 0;
          this.$store.dispatch("setCash", this.cash);
          if (document.documentElement && document.documentElement.scrollTop) {
            document.documentElement.scrollTop = 0;
          } else if (document.body) {
            document.body.scrollTop = 0;
          }
        }else{
          this.login = true;
        }
      },
      showNav(o, n) {
        if(!this.username){
          this.getUsername();
        }
      }
    },
    filters: {
      formatCash(v) {
        if (v || v === 0) {
          let num = parseFloat(v).toFixed(2);
          //如果num是负数，则获取她的符号
          var sign = '';
          if (Number(num) < 0) {
            sign = '-';
          }
          // 绝对值
          var numAbs = Math.abs(num);
          var decimal = String(numAbs).split('.')[1] || ''; //小数部分
          var tempArr = [];
          var revNumArr = String(numAbs).split('.')[0].split("").reverse(); //倒序
          for (let i in revNumArr) {
            tempArr.push(revNumArr[i]);
            if ((i + 1) % 3 === 0 && i != revNumArr.length - 1) {
              tempArr.push(',');
            }
          }
          var zs = tempArr.reverse().join(''); //整数部分
          return decimal ? sign + zs + '.' + decimal : sign + zs;
        }
        return '0';
      }
    },
    computed: {
      getCash() {
        return this.$store.state.cash;
      },
      msgHidden() {
        return this.$store.state.msgHidden;
      },
      rechargeMsgHidden() {
        return this.$store.state.rechargeMsgHidden;
      },
      withdrawMsgHidden() {
        return this.$store.state.withdrawMsgHidden;
      },
      getRouterTagIndex() {
        return this.$store.state.routerTagIndex;
      }
    }
  };

</script>

<style lang="scss" scoped>
  .nav-icon-home,
  .nav-icon-home-ed,
  .nav-icon-lottery,
  .nav-icon-lottery-ed,
  .nav-icon-prize,
  .nav-icon-prize-ed,
  .nav-icon-per,
  .nav-icon-per-ed,
  .nav-icon-agent,
  .nav-icon-agent-ed,
  .nav-icon-tuijian,
  .nav-icon-tuijian-ed,
  .nav-icon-message,
  .nav-icon-message-ed,
  .nav-icon-set,
  .nav-icon-set-ed,
  .nav-icon-download,
  .nav-icon-download-ed {
    width: 14px;
    height: 14px;
    display: inline-block;
    margin-right: 10px;
  }

  .nav-icon-home {
    background: url(../../assets/img/home-nav/home.png) no-repeat;
    background-size: 100%;
    margin-bottom: -1px;
  }

  .nav-icon-lottery {
    background: url(../../assets/img/home-nav/lottery.png) no-repeat;
    background-size: 100%;
    margin-bottom: -1px;
  }

  .nav-icon-prize {
    background: url(../../assets/img/home-nav/prize.png) no-repeat;
    background-size: 100%;
    margin-bottom: -1px;
  }

  .nav-icon-per {
    background: url(../../assets/img/home-nav/per.png) no-repeat;
    background-size: 100%;
    margin-bottom: -1px;
  }

  .nav-icon-tuijian {
    width: 15px;
    height: 15px;
    background: url(../../assets/img/home-nav/tuijian.png) no-repeat;
    background-size: 100%;
    margin-bottom: -2px;
  }

  .nav-icon-agent {
    width: 17px;
    background: url(../../assets/img/home-nav/agent.png) no-repeat;
    background-size: 100%;
    margin-bottom: -2px;
  }

  .nav-icon-message {
    width: 15px;
    background: url(../../assets/img/home-nav/message.png) no-repeat;
    background-size: 100%;
    margin-bottom: -2px;
  }

  .nav-icon-set {
    width: 15px;
    height: 15px;
    background: url(../../assets/img/home-nav/set.png) no-repeat;
    background-size: 100%;
    margin-bottom: -2px;
  }

  .nav-icon-download{
    width: 16px;
    height: 12px;
    background: url(../../assets/img/home-nav/download.png) no-repeat;
    background-size: 100%;
    margin-bottom: -2px;
  }

  .nav-icon-home-ed {
    background: url(../../assets/img/home-nav/home-ed.png) no-repeat;
    background-size: 100%;
    margin-bottom: -1px;
  }

  .nav-icon-lottery-ed {
    background: url(../../assets/img/home-nav/lottery-ed.png) no-repeat;
    background-size: 100%;
    margin-bottom: -1px;
  }

  .nav-icon-prize-ed {
    background: url(../../assets/img/home-nav/prize-ed.png) no-repeat;
    background-size: 100%;
    margin-bottom: -1px;
  }

  .nav-icon-per-ed {
    background: url(../../assets/img/home-nav/per-ed.png) no-repeat;
    background-size: 100%;
    margin-bottom: -1px;
  }

  .nav-icon-tuijian-ed {
    width: 15px;
    height: 15px;
    background: url(../../assets/img/home-nav/tuijian-ed.png) no-repeat;
    background-size: 100%;
    margin-bottom: -2px;
  }

  .nav-icon-agent-ed {
    width: 17px;
    background: url(../../assets/img/home-nav/agent-ed.png) no-repeat;
    background-size: 100%;
    margin-bottom: -2px;
  }

  .nav-icon-message-ed {
    width: 15px;
    background: url(../../assets/img/home-nav/message-ed.png) no-repeat;
    background-size: 100%;
    margin-bottom: -2px;
  }

  .nav-icon-set-ed {
    width: 15px;
    height: 15px;
    background: url(../../assets/img/home-nav/set-ed.png) no-repeat;
    background-size: 100%;
    margin-bottom: -2px;
  }

  .nav-icon-download-ed{
    width: 16px;
    height: 12px;
    background: url(../../assets/img/home-nav/download-ed.png) no-repeat;
    background-size: 100%;
    margin-bottom: -2px;
  }

  .header-nav {
    // max-width:1200px;
    width: 100%;
    // margin:0 auto;
    display: table;
    position: relative;
  }

  .logo {
    width: auto;
    height: 88px;
    float: left;
    margin-left: 10px;
    margin-right: 30px;
  }

  .show-nav-icon,
  .header-title,
  .nav-list {
    display: none;
  }

  .show-nav-icon {
    -webkit-box-orient: vertical;
    -webkit-box-pack: center;
    -webkit-box-align: center;

    img {
      width: 22px;
      height: 22px;
    }

    span {
      display: block;
      font-size: 20px;
      color: #EA3323;
    }
  }

  .header-title {
    width: 95px;
    height: auto;
    // height:22px;
    position: absolute;
    left: 50%;
    top: 35px;
    margin-left: -47.5px;
  }

  nav {
    color: #fff;
    // float:right;
    float: left;
    // margin-left:30px;
    // margin-top:20px;
    margin-top: 30px;
    margin-bottom: 18px;
    position: relative;

    .item-list {
      position: absolute;
      display: none;
      z-index: 2;
      background: #fff;
      color: #000;
      font-size: 16px;
      width: 100%;
      left: 0;
      // left: 50%;
      // margin-left: -60px;
      top: 51px;

      .sanjiao {
        position: absolute;
        width: 5px;
        height: 5px;
        /*border-top: 2px solid  rgba(179, 193, 198, 1);
        border-right: 2px solid  rgba(179, 193, 198, 1);*/
        border-top: 5px solid #fff;
        border-right: 5px solid #fff;
        transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        /* IE 9 */
        -moz-transform: rotate(45deg);
        /* Firefox */
        -webkit-transform: rotate(45deg);
        /* Safari 和 Chrome */
        -o-transform: rotate(45deg);
        top: -3px;
        left: 50%;
      }

      li {
        // width: 120px;
        padding: 20px;
        overflow: hidden;
        cursor: pointer;
        border-bottom: 1px solid #d0d0d0;
        position: relative;

        &:hover {
          background: #efefef;
        }

        &:last-child {
          border-bottom: none;
        }

        >.badge {
          position: absolute;
          right: 10px;
          top: 7.5px;
        }
      }

      li.active {
        color: #c59a37;
      }
    }

    .span-nav {
      padding: 15px 20px;
      // padding:10px 32px;
      display: block;
      float: left;
      font-size: 16px;
      cursor: pointer;
      position: relative;
      border-right: 2px solid #fffefe;

      .badge {
        position: absolute;
        right: 10px;
        top: 7.5px;
      }

      &:last-child {
        border-right: none;
      }

      i {
        font-style: normal;
      }

      .nav-icon {
        width: 14px;
        height: 12px;
        display: inline-block;
        background: url(../../assets/img/nav-icon.png) no-repeat;
        background-size: 100% 100%;
        margin-left: 5px;
      }

      em.nav-icon-ed {
        width: 14px;
        height: 12px;
        display: inline-block;
        background: url(../../assets/img/nav-icon.png) no-repeat;
        // background: url(../../assets/img/nav-icon-ed.png) no-repeat;
        background-size: 100% 100%;
        margin-left: 5px;
      }
    }

    span.active {
      color: #c59a37;
    }

    .tag {
      width: 70px;
      height: 4px;
      background: #c59a37;
      position: absolute;
      bottom: -4px;
      transition: all 0.3s;
    }

    em.left0 {
      // left:14px;
      left: -3px;
    }

    em.left1 {
      // left:109px;
      left: 58px;
    }

    em.left2 {
      // left:205px;
      left: 135px;
    }

    em.left3 {
      // left:317px;
      left: 229px;
    }

    em.left4 {
      // left:445px;
      left: 323px;
    }

    em.left5 {
      // left:573px;
      left: 417px;
    }

    em.left6 {
      // left:702px;
      left: 511px;
    }

    em.left7 {
      // left:702px;
      left: 606px;
    }

    .logo {
      width: auto;
      height: 88px;
      float: left;
    }
  }

  .user {
    margin-top: 30px;
    margin-right: 10px;
    margin-bottom: 18px;
    float: right;

    .user-icon {
      width: 14px;
      display: inline-block;
      margin-right: 5px;
      margin-bottom: -3px;
    }

    .zh-icon,
    .th-icon {
      width: 16px;
      display: inline-block;
      margin-right: 5px;
      margin-bottom: -3px;
    }

    .logout-icon {
      width: 14px;
      height: 14px;
      display: inline-block;
      margin-right: 5px;
      margin-bottom: -3px;
    }

    .item-list {
      position: absolute;
      display: none;
      z-index: 2;
      background: #fff;
      color: #000;
      font-size: 16px;
      left: 0;
      width: 100%;
      // left: 50%;
      // margin-left: -60px;
      top: 50px;

      .sanjiao {
        position: absolute;
        width: 5px;
        height: 5px;
        /*border-top: 2px solid  rgba(179, 193, 198, 1);
        border-right: 2px solid  rgba(179, 193, 198, 1);*/
        border-top: 5px solid #fff;
        border-right: 5px solid #fff;
        transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        /* IE 9 */
        -moz-transform: rotate(45deg);
        /* Firefox */
        -webkit-transform: rotate(45deg);
        /* Safari 和 Chrome */
        -o-transform: rotate(45deg);
        top: -3px;
        left: 50%;
      }

      li {
        // width: 120px;
        padding: 20px;
        overflow: hidden;
        cursor: pointer;
        border-bottom: 1px solid #d0d0d0;

        &:hover {
          background: #efefef;
        }

        &:last-child {
          border-bottom: none;
        }
      }

      li.active {
        color: #c59a37;
      }
    }

    span {
      display: inline-block;
      padding: 15px 10px;
      cursor: pointer;
      color: #fff;
      vertical-align: center;
      position: relative;

      &:hover {
        .item-list {
          display: block;
        }
      }
    }
  }

  .refresh-icon {
    width: 14px;
    display: inline-block;
    margin-left: 5px;
  }

  @media screen and (max-width: 710px) {

    nav,
    .user {
      display: none;
    }

    .show-nav-icon {
      display: -webkit-box;
      position: absolute;
      right: 5%;
      font-size: 36px;
      color: red;
      top: 10px;
    }

    .header-title {
      display: block;
    }

    .nav-list {
      width: 100%;
      height: auto;
      position: relative;
      z-index: 2;
      background: #000;
      color: #d2d2d2;
      font-size: 16px;
      left: 0;
      top: 0;
      transition: all 0.3s;
      display: block;
      overflow: hidden;

      .nav-icon {
        width: 14px;
        height: 12px;
        display: inline-block;
        background: url(../../assets/img/nav-icon.png) no-repeat;
        background-size: 100% 100%;
        margin-left: 5px;
      }

      em.nav-icon-ed {
        width: 14px;
        height: 12px;
        display: inline-block;
        background: url(../../assets/img/nav-icon.png) no-repeat;
        // background: url(../../assets/img/nav-icon-ed.png) no-repeat;
        background-size: 100% 100%;
        margin-left: 5px;
      }

      .item-list {
        display: none;
      }

      .user-icon {
        width: 14px;
        display: inline-block;
        margin-right: 5px;
        margin-bottom: -3px;
      }

      .zh-icon,
      .th-icon {
        width: 20px;
        display: inline-block;
        margin-right: 5px;
        margin-bottom: -3px;
      }

      .logout-icon {
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-right: 5px;
        margin-bottom: -3px;
      }

      li {
        width: 100%;
        padding: 15px 20px;
        text-align: left;
        border-top: 1px solid #333;
        cursor: pointer;

        i {
          font-style: normal;
        }

        // &:hover {
        //   background: #efefef;
        //   color: #191919;
        // }

        .item-list {
          display: block;

          li {
            // &:hover {
            //   background: #fff;
            // }
            padding-left: 30px;

            &:first-child {
              border: none;
            }

            &:last-child {
              padding-bottom: 0;
            }

            .badge {
              position: absolute;
              right: -15px;
              top: 0;
            }
          }
        }
      }

      li.custom {
        text-align: center;
      }

      li.active {
        i {
          color: #c59a37;
        }
      }
    }
  }

</style>
