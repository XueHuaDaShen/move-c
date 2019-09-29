<template>
  <div class="index">
    <div class="slide">
      <el-menu
        :default-active="default_active_menu"
        class="el-menu-vertical-demo"
        background-color="#363636"
        text-color="#999"
        active-text-color="#fff"
        unique-opened
        router
      >
        <el-menu-item v-for="(menu, m) in slide_menu" :index="menu.url" :key="m">
          <span slot="title">{{menu.name}}</span>
        </el-menu-item>
      </el-menu>
      <el-button @click="logout" style="margin-top:20px;" size="mini">退出登录</el-button>
    </div>
    <div class="right-container">
      <div class="view">
        <h2 class="title">虹星科技工地智能化管理信息系统</h2>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/axios/axios";
export default {
  name: 'index',
  data() {
    return {
      showAdmin: false,
      defaultMenus: [
        {
          name: '主页',
          val: '8',
          url: 'home'
        },
        // {
        //   name: '设备注册',
        //   val: '9',
        //   url: 'deviceReg'
        // },
        {
          name: '设备管理',
          val: '11',
          url: 'deviceStatus'
        },
        {
          name: '班组管理',
          val: '10',
          url: 'groupManager'
        },
        {
          name: '人员管理',
          val: '3',
          url: 'peopleManager'
        },
        {
          name: '通行记录',
          val: '1',
          url: 'throughLog',
          icon: require('@/assets/img/slide/task.png')
        },
        {
          name: '考勤统计',
          val: '2',
          url: 'workLog'
        },
        // {
        //   name: 'LED公告',
        //   val: '4',
        //   url: 'led'
        // },
        {
          name: '系统设置',
          val: '5',
          url: 'setting'
        },
        {
          name: '用户管理',
          val: '6',
          url: 'userManager',
          icon: require('@/assets/img/slide/user.png')
        },
        {
          name: '修改密码',
          val: '7',
          url: 'editPwd',
          icon: require('@/assets/img/slide/pass.png')
        },
      ],
      slide_menu: [],
      default_active_menu: '',
      nav_bar: [],
      nav_bar_default_value: '',
    }
  },
  created() {
    // let isLogin = localStorage.getItem('isLogin') === 'true';
    // if(!isLogin){
    //   this.logout();
    //   return;
    // }
    // let menus = JSON.parse(localStorage.getItem('menus'));
    // let arr = [];
    // for(let i=0; i<menus.length; i++){
    //   let menu = menus[i];
    //   this.defaultMenus.map(item => {
    //     if(item.url === menu.url){
    //       arr.push(item);
    //     }
    //   })
    // }
    this.slide_menu = this.defaultMenus;
    this.default_active_menu = this.$route.name;
    this.nav_bar_default_value = this.$route.name;
    let tree = this.$store.state.treeData;
    if(tree.length === 0){
      this.getTreeData();
    }
  },
  mounted() {
    const vm = this;
  },
  computed: {
  },
  watch: {
    $route() {
      this.default_active_menu = this.$route.name;
      this.nav_bar_default_value = this.$route.name;
    },
  },
  methods: {
    // 获取树形 数据
    getTreeData() {
      const vm = this;
      request({
        url: '/companyGroupUser/structureList',
        param: {},
        method: 'get',
        onError: err => {
          vm.loading = false;
          vm.isClick = false;
        },
        vm,
      }).then(res => {
        console.log(res)
        let code = res.code;
        let data = [];
        if(code === 200) {
          data = res.data;
        }
        vm.$store.dispatch('setTreeData', data)
      });
    },
    logout() {
      const vm = this;
      request({
        url: '/admin/logout',
        param: {},
        method: 'post',
        onError: err => {
          // vm.loading = false;
          // vm.isClick = false;
        },
        vm,
      }).then(res => {
        console.log(res)
      });
      localStorage.clear();
      this.$router.push({
        name: 'login'
      })
    },
  },
}
</script>
<style lang="scss">
.index{
  .el-menu{
    border-right:none;
  }
  .slide{
    .el-icon-arrow-down::before{
      content:"\E790";
    }
    i{
      color:#999!important;
    }
  }
  .el-submenu__title, .el-menu-item{
    text-align:left;
  }
}
</style>

<style lang="scss" scoped>
.index{
  width:100%;
  height:100%;
  // display:-webkit-box;
  clear: both;
  .slide{
    width:200px;
    height:100%;
    background:#363636;
    overflow-y:auto;
    float: left;
    .el-icon-my-set-icon{
      margin-right:0;
      img{
        width:18px;
        height:18px;
        display:block;
      }
    }
  }
  .right-container{
    // -webkit-box-flex:1;
    // width:auto;
    // padding-left:200px;
    background:#fff;
    height:100%;
    overflow-y: auto;
    .top{
      text-align:right;
      padding-right:20px;
      height:30px;
      line-height: 30px;
      >div{
        display:inline-block;
      }
      .download{
        margin-right:20px;
        cursor: pointer;
      }
      .admin{
        cursor: pointer;
        position: relative;
        z-index: 3;
        .admin-info{
          // display:none;
          position: absolute;
          width:100%;
          left:0;
          top:30px;
        }
      }
    }
    .view{
      // -webkit-box-flex:1;
      height:100%;
      background:#f2f2f2;
      overflow-y:auto;
      padding:40px;
      position: relative;
      .title{
        position: absolute;
        left:40px;
        top:0;
        height:40px;
        line-height:40px;
        font-weight:normal;
        letter-spacing: 4px;
        font-size:16px;
      }
    }
  }
}
</style>