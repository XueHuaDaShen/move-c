<template>
  <div class="index">
    <div class="slide">
      <el-menu
        :default-active="default_active_menu"
        class="el-menu-vertical-demo"
        background-color="#1e1e1e"
        text-color="#999"
        active-text-color="#fff"
        unique-opened
        router
      >
        <el-menu-item v-for="(menu, m) in slide_menu" :index="menu.url" :key="m">
          <i class="el-icon-my-set-icon"><img :src="menu.icon" alt=""></i>
          <span slot="title">{{menu.name}}</span>
        </el-menu-item>
      </el-menu>
      <el-button @click="logout" style="margin-top:20px;" size="mini">退出登录</el-button>
    </div>
    <div class="right-container">
      <div class="view">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'index',
  data() {
    return {
      showAdmin: false,
      defaultMenus: [
        {
          name: '设备注册',
          val: '1',
          url: 'task',
          icon: require('@/assets/img/slide/task.png')
        },
        {
          name: '设备状态管理',
          val: '2',
          url: 'data'
        },
        {
          name: '数据上报',
          val: '3',
          url: 'suanfa'
        },
        {
          name: '用户数据库',
          val: '4',
          url: 'configFile'
        },
        {
          name: '识别记录',
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
    let isLogin = localStorage.getItem('isLogin') === 'true';
    if(!isLogin){
      this.logout();
      return;
    }
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
    logout() {
      const vm = this;
      this.$http.post('/admin/logout',{}).then(res => {
        //
      }).catch(err => {
      })
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
    background:#1e1e1e;
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
      background:#fafafa;
      overflow-y:auto;
      padding:10px;
    }
  }
}
</style>