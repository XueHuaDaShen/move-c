<template>
  <div class="hello" style="height:100%;">
    <div class="cms-container" style="height:100%;display:-webkit-box;">
      <div class="aside-nav-wrap" :class="showNav?'showNav':'hideNav'">
        <div class="aside-logo">
          <img src="../img/logo.png">
        </div>
        <div class="user-info">
          <div class="avatar">
            <img src="../img/avatar.png">
          </div>
          <div class="username">{{userName}}</div>
        </div>
        <el-aside width="248px">
          <el-row class="tac">
            <el-col>
              <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" background-color="#1e1e28"
                text-color="#8989A1" :unique-opened="onlyOneMenuOpen" @select="handleSelect" active-text-color="#ffd04b">
                <el-submenu v-if="item.child.length>0" v-for="(item, index) in menuData" :key="index" :index="index.toString()">
                  <template slot="title">
                    <span class="check-box" :style="{'border': '2px solid '+colors[index]}"></span>
                    <span style="margin-right:10px;">{{item.menu_name}}</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item v-if="o.child.length>0" v-for="(o, oi) in item.child" :key="oi" :index="o.child[0].url+'-'+oi"
                      style="color:#777;">
                      <span style="position:relative;">
                        {{o.menu_name}}
                        <el-badge :value="rechargeCount" class="badge" v-if="rechargeCount&&rechargeCount!=0&&o.menu_name === 'Deposit'">
                        </el-badge>
                        <el-badge :value="withdrawCount" class="badge" v-if="withdrawCount&&withdrawCount!=0&&o.menu_name === 'Withdrawal'">
                        </el-badge>
                      </span>
                      <i class="nav-jiantou"></i>
                    </el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
          <!-- <div v-if="showAddBtn"><span class="add-menu">+</span></div> -->
        </el-aside>
        <div class="logout">
          <span @click="handleLogOut">
            <i></i>Logout</span>
        </div>
      </div>
      <div style="height:100%;-webkit-box-flex:1;display:-webkit-box;-webkit-box-orient:vertical;">
        <!-- <el-header>Header</el-header> -->
        <el-header style="padding:0;height:64px;position:relative;">
          <el-tabs v-model="editableTabsValue" @tab-click="handleClick" type="card" closable @edit="handleTabsremove">
            <el-tab-pane :key="item.name" v-for="(item) in editableTabs" :label="item.menu_name" :name="item.name" :title="item.title" :index1="item.index1" :index2="item.index2">
            </el-tab-pane>
          </el-tabs>
          <div class="slide-nav" @click="handleSlideNav">
            <!-- <span v-if="showNav">←</span>
            <span v-if="!showNav">→</span> -->
            <span v-if="showNav">
              <img src="../img/slide-nav.png">
            </span>
            <span v-if="!showNav">
              <img src="../img/slide-nav.png">
            </span>
          </div>
          <div class="currentTime">
            <em>Bankok Time</em>
            <strong>{{currentTime}}</strong>
          </div>
        </el-header>
        <el-main style="min-width:912px;-webkit-box-flex:1;background:#f4f8f9;overflow-y:auto;">
          <router-view />
        </el-main>
      </div>
    </div>
    <div class="iframe-dialog" v-if="getIframe.show">
      <i class="close el-icon-close" @click="closeIframe"></i>
      <iframe id="myIframe" :src="getIframe.url" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
import request from "@/axios/axios.js";
import routerUrl from '@/lib/url.json';
import moment from "moment";
export default {
  name: 'home',
  data() {
    return {
      iframeStyle: {
        show: {
          zIndex: 99,
          height: '100%',
          padding: '30px'
        },
        none: {
          zIndex: -99,
          height: '0px',
          padding: '0px'
        }
      },
      iframeUrl: '',
      colors: ['#FF9291', '#51E6C2', '#FBB91B', '#E15454', '#5BD4FF', '#E98DF3', '#8EB4FF'],
      activeIndex: '/', //默认路由
      onlyOneMenuOpen: true, //保持一个子菜单展开
      userName: '',
      currentTime: '',
      routerArr: [],
      editableTabsValue: '0',
      editableTabs: [],
      tabIndex: 2,

      userMenu: [],
      menuData: [],
      menuName: [],

      rechargeCount: 0,
      withdrawCount: 0,

      showAddBtn: false,
      showNav: true
    }
  },
  created() {
    const vm = this;
    let isLogin = localStorage.getItem('candy-cms-isLogin') === 'true';
    if(!isLogin){
      this.$router.push({
        name: 'login'
      })
      return false;
    }

    // let host = window.location.host;
    // let url;
    // if(host.indexOf('localhost') > -1){
    //   // 本地测试
    //   url = 'http://localhost:8081/#/betRecord?create_f_d_template=true';
    // }else if(host.indexOf('kinglotto9') < 0){
    //   // 线下测试
    //   url = host + '/#/betRecord?create_f_d_template=true';
    // }else{
    //   // 线上
    //   url = host + '/#/betRecord?create_f_d_template=true';
    // }
    // this.iframeUrl = url;
    this.getCount();
    this.getCurrentTime();
    this.timeInterval();
    this.userName = localStorage.getItem('cms-loginname');
    this.menuData = JSON.parse(localStorage.getItem('cms-user-menu'));
  },
  computed: {
    getIframe() {
      return this.$store.state.iframeJson;
    }
  },
  watch: {
    'getIframe' (o, n) {
      const vm = this;
      if(vm.getIframe.show){
        this.$nextTick(() => {
          var myIframe = document.getElementById('myIframe'); //.contentWindow;
          myIframe.onload = function() {
            myIframe.contentWindow.postMessage(vm.getIframe.data, '*');
          }
        })
      }
    }
  },
  methods: {
    // 插入iframe
    // insetIframe() {
    //   let host = window.location.host;
    //   let url;
    //   if(host.indexOf('locahost') > -1){
    //     // 本地测试
    //     url = 'http://localhost:8081/#/betOrderDetail';
    //   }else if(host.indexOf('kinglotto9') < 0){
    //     // 线下测试
    //     url = host + '/#/betOrderDetail';
    //   }else{
    //     // 线上
    //     url = host + '/#/betOrderDetail';
    //   }
    //   let iframe = document.createElement('iframe');
    //   iframe.src = url;
    //   iframe.setAttribute('id', 'myIframe');
    //   let parent = document.getElementsByClassName('iframe-dialog')[0];
    //   parent.appendChild(iframe)
    // },
    // 关闭iframe
    closeIframe() {
      let iframe = this.getIframe;
      let data = {
        show: false,
        url: iframe.url,
        data: null
      };
      this.$store.dispatch("setIframeJson", data);
    },
    timeInterval() {
      const vm = this;
      setInterval(vm.getCurrentTime, 1000)
      setInterval(vm.getCount, 1000 * 60 * 5)
    },
    getCurrentTime() {
      this.currentTime = moment(new Date()).utcOffset(7).format('HH:mm');
    },
    getCount() {
      const vm = this;
      request.http(
        'get',
        '/recharge/withdraw/count', {},
        (success) => {
          vm.rechargeCount = success.data.rechargeCount || 0;
          vm.withdrawCount = success.data.withdrawCount || 0;
        },
        (error) => {
          console.log(error)
        }
      )
    },
    handleSlideNav() {
      this.showNav = !this.showNav;
    },
    pushRouter(index, menu_name) {
      // console.log(index, menu_name, routerUrl.menu, this.routerArr)
      this.editableTabs = [];
      if (this.routerArr.indexOf(index) < 0) {
        this.routerArr.push(index);
        this.menuName.push(menu_name)
      }
      for (var i in this.routerArr) {
        let o = new Object();
        let url = '';
        let name = '';
        routerUrl.menu.filter((v, vi) => {
          v.data.filter((k, ki) => {
            k.data.filter(m => {
              if (m.url === this.routerArr[i]) {
                // url = m.title;
                url = k.title
                name = this.menuName[i];
                o.index1 = vi;
                o.index2 = ki;
              }
            })
          })
        })
        o.title = this.routerArr[i];
        o.name = ((i * 1) + 1).toString();
        o.url = url;
        o.menu_name = name;
        this.editableTabs.push(o);
      }
      // console.log(this.editableTabs)
      this.editableTabsValue = this.routerArr.length.toString();
    },
    handleSelect(index, indexPath) {
      // let arr = index.split('/');
      let arr = index.split('-');
      let name = arr[0];
      // console.log(name)
      let n1 = indexPath[0];
      let n2 = arr[1];
      let menu_name = this.menuData[n1].child[n2].menu_name;
      // console.log(name)
      this.pushRouter(name, menu_name, n1, n2);
      var selectName = '';
      for (var i in this.editableTabs) {
        if (name == this.editableTabs[i].title) {
          selectName = this.editableTabs[i].name;
        }
      }
      this.editableTabsValue = selectName;
      this.$router.push({
        name: name,
        query: {
          index1: n1,
          index2: n2
        }
      })
    },
    handleTabsremove(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              this.$router.push({
                name: nextTab.title,
                query: {
                  index1: nextTab.index1,
                  index2: nextTab.index2
                }
              })
            }
          }
        });
      }
      var name = tabs.filter(tab => tab.name === targetName)[0].title;
      this.routerArr = this.routerArr.filter(title => name !== title)
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    },
    handleClick(index) {
      // console.log(index)
      this.$router.push({
        name: index.$attrs.title,
        query: {
          index1: index.$attrs.index1,
          index2: index.$attrs.index2
        }
      })
    },
    handleLogOut() {
      const vm = this;
      request.http(
        'post',
        '/admin/logout', {},
        (success) => {
          // console.log(success);
          // let code = success.returncode;
          request.loginAgain(vm)
        },
        (error) => {
          console.log(error)
        }
      )
    }
  },
  mounted() {
    var cl = document.getElementsByClassName('el-submenu__title');
    try {
      for (var i in cl) {
        cl[i].style.display = '-webkit-box';
      }
    } catch (e) {
      // console.log(e);
    }
  }
}

</script>
<style>
  @import '../publicCss/header.css';

  .hello .el-aside .el-menu .el-submenu .el-submenu__title {
    display: -webkit-box !important;
  }

  .hello .el-menu--inline {
    padding-bottom: 14px;
  }

  .hello .el-menu {
    border-right: none;
  }

  .hello .el-tabs__nav-next,
  .hello .el-tabs__nav-prev {
    font-size: 24px;
    line-height: 64px;
  }

  .hello .el-tabs__header {
    padding: 0 100px;
    margin-bottom: 0;
    box-shadow: 5px 0 8px 0px #ccc;
  }

  .hello .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #e4e7ed;
  }

  .hello .el-tabs__item {
    height: 64px;
    line-height: 64px;
  }

  .hello .el-tabs--card>.el-tabs__header .el-tabs__nav {
    border: none;
  }

  .hello .el-submenu .el-menu-item {
    height: 46px;
    line-height: 46px;
  }

  .hello .el-submenu__title {
    height: 46px;
    line-height: 46px;
  }

  .el-button--text {
    user-select: auto;
  }

  .hello .aside-nav-wrap .el-submenu__title i {
    color: #777;
    font-size: 14px;
    font-weight: bolder;
    right: inherit;
  }

  .hello .el-menu-item.is-active {
    background: #34343d !important;
    color: #fff !important;
  }

  .hello .el-menu-item-group__title {
    height: 15px;
  }

</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  body {
    position: relative;
  }

  * {
    box-sizing: border-box;
  }

  .aside-nav-wrap {
    position: relative;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background: #1E1E28;

    .check-box {
      width: 14px;
      height: 14px; // border: 2px solid #FF9291;
      border-radius: 2px;
      display: inline-block;
      margin-right: 30px;
    }

    .nav-jiantou {
      position: absolute;
      width: 8px;
      height: 8px;
      right: 29.5px;
      top: 50%;
      margin-top: -4px;
      /*border-top: 2px solid  rgba(179, 193, 198, 1);
      border-right: 2px solid  rgba(179, 193, 198, 1);*/
      border-top: 2px solid #646464;
      border-right: 2px solid #646464;
      transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      /* IE 9 */
      -moz-transform: rotate(45deg);
      /* Firefox */
      -webkit-transform: rotate(45deg);
      /* Safari 和 Chrome */
      -o-transform: rotate(45deg);
    }

    .aside-logo {
      min-width: 248px;
      max-width: 249px;
      position: relative;
      padding: 22px 0;
      display: -webkit-box;
      -webkit-box-align: center;
      -webkit-box-pack: center;
      border-bottom: 1px solid #333;

      img {
        // width: 198px;
        height: 54px;
      }
    }

    .user-info {
      min-width: 248px;
      max-width: 249px;
      position: relative;
      padding: 31px 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-box-align: center;
      -webkit-box-pack: center;
      border-bottom: 1px solid #333;

      .avatar {
        width: 76px;
        height: 76px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .username {
        width: 100%;
        text-align: center;
        color: #868EA7;
        font-size: 16px;
        margin-top: 10px;
      }
    }
    
    .badge{
      position: absolute;
      right:-25px;
    }
  }

  .showNav {
    // transform:scale(1, 0)
    width: 248px;
    transition: all .3s;
  }

  .hideNav {
    // transform:scale(1, 0)
    width: 0px;
    transition: all .3s;
  }

  .currentTime {
    position: absolute;
    top: 10px;
    right: 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;

    em {
      display: block;
      font-style: normal;
      font-size: 12px;
      color: #777777;
    }

    strong {
      display: block;
      font-style: normal;
      font-size: 20px;
      color: #191919;
      margin-top: 2px;
    }
  }

  .logout {
    // position: absolute;
    // top: 10px;
    // right: 10px;
    min-width: 248px;
    max-width: 249px;
    margin-top: 15px;
    text-align: center;

    span {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #C83A4C;
      border-radius: 5px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;

      >i {
        width: 15px;
        height: 16px;
        display: inline-block;
        background: url("../assets/icon_Dropout@3x.png") no-repeat;
        background-size: contain;
        margin-right: 10px;
      }
    }
  }

  .slide-nav {
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: #fff;
    background: #1E1E28;
    border-radius: 4px;
    position: absolute;
    top: 10px;
    left: 10px;
    cursor: pointer;

    span {
      display: inline-block;
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .el-header,
  .el-footer {
    color: #333;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
  }

  .el-aside div {
    padding-left: 0;
  }

  .el-main {
    background-color: #fff;
    color: #333;
  }

  body>.el-container {
    margin-bottom: 40px;
  }

  .add-menu {
    display: inline-block;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    color: rgb(255, 255, 255);
    background-color: rgb(84, 92, 100);
    border-radius: 50%;
    cursor: pointer;
  }

  .add-item {
    display: inline-block;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    color: rgb(84, 92, 100);
    background-color: #D3DCE6;
    border-radius: 50%;
    cursor: pointer;
    margin-left: 10px;
  }
  .iframe-dialog{
    position: absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    background: #fff;
    padding:30px;
    z-index:99;
    .close{
      position: absolute;
      right:10px;
      top:10px;
      cursor: pointer;
    }
    iframe{
      width:100%;
      height:100%;
    }
  }
</style>
