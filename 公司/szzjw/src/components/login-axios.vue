<template>
  <div class="login" v-loading.fullscreen="loading">
    <!-- <span class="icon">
      <img src="@/assets/img/login/logo.png" alt="">
    </span> -->
    <div class="login-wrap">
      <h2 class="title">用户登录</h2>
      <div class="item">
        <el-row>
          <el-col :span="4" style="line-height:40px"><label>用户名：</label></el-col>
          <el-col :span="20"><div><el-input type="text" size="large" v-model="user" autocomplete="off"></el-input></div></el-col>
        </el-row>
      </div>
      <div class="item">
        <el-row>
          <el-col :span="4" style="line-height:40px"><label>密码：</label></el-col>
          <el-col :span="20"><div><el-input type="password" size="large" v-model="pwd" autocomplete="off"></el-input></div></el-col>
        </el-row>
      </div>
      <div class="item">
        <el-button size="large" type="primary" @click="login" :disabled="isClick" round>登录</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/axios/axios";
export default {
  name: 'login',
  data() {
    return {
      isClick: false, // 双击
      loading: false,
      user: '',
      pwd: ''
    }
  },
  created() {
    localStorage.clear();
  },
  mounted() {
    const vm = this;
    document.onkeypress = function(e) {
      if(e.keyCode === 13){
        vm.login()
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 随机值
    getRandom(len) {
      let arr = [];
      for(let i=1; i<=len; i++){
        arr.push( Math.floor(Math.random()*10) );
      }
      return arr.join('');
    },
    login() {
      const vm = this;
      if(!vm.user){
        vm.$message({
          message: '请输入用户名',
          type: 'error',
          duration: 1500,
        })
        return;
      }
      if(!vm.pwd){
        vm.$message({
          message: '请输入密码',
          type: 'error',
          duration: 1500,
        })
        return;
      }
      vm.loading = true;
      vm.isClick = true;
      request({
        url: '/admin/login',
        param: {
          username: vm.user,
          password: CryptoJS.HmacMD5(
            CryptoJS.MD5(vm.pwd).toString(),
            '12345'
          ).toString(),
          random: '12345',
          t: new Date()*1
        },
        method: 'post',
        onError: () => {
          // removeLoading();
          vm.loading = false;
          vm.isClick = false;
        },
        vm,
      }).then(res => {
        console.log(res);
        vm.loading = false;
        vm.isClick = false;
        if (res.code === 200) {
          localStorage.setItem('token', res.content.token);
          localStorage.setItem('isLogin', 'true');
          vm.$router.push({
            name: 'home'
          })
          // localStorage.setItem('realname', data.content.realname);
          // localStorage.setItem('cardno', data.content.cardno);
          // vm.getMenuList();
        }
      });
    },
    getMenuList() {
      const vm = this;
      request({
        url: `/rolemenu/getByRole?t=${new Date() * 1}`,
        param: {},
        method: 'get',
        onError: err => {
          vm.loading = false;
          vm.isClick = false;
        },
        vm,
      }).then(res => {
        console.log(res)
        vm.loading = false;
        vm.isClick = false;
        if (res.code === 200) {
          const data = res.content;
          if (data.length === 0) {
            vm.$message({
              message: '获取菜单失败',
              type: 'error',
              duration: 1500,
            })
            localStorage.clear();
          } else {
            localStorage.setItem('isLogin', 'true');
            localStorage.setItem('menus', JSON.stringify(data));
            vm.$router.push({
              name: 'home'
            })
          }
        }
      });
    }
  },
}
</script>
<style lang="scss">
// .login{
//   .el-input__inner{
//     background-color:#eee !important;
//     border:none;
//     color:#e5e5e5;
//   }
// }
</style>
<style lang="scss" scoped>
.login{
  width:100%;
  height:100%;
  background:url(../assets/img/login/bj.png) no-repeat;
  background-size:100%;
  position: relative;
  .icon{
    width:35.2%;
    height:auto;
    max-width:507px;
    position: absolute;
    left:0;
    top:0;
  }
  .login-wrap{
    width:454px;
    height:297px;
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    margin: auto;
    background:#fff;
    // color:#e5e5e5;
    padding:75px 45px 35px;
    .title{
      position: absolute;
      left:0;
      top:0;
      width: 100%;
      height:75px;
      line-height:75px;
      text-align:center;
      font-size:18pt;
      font-weight:normal;
    }
    .item{
      margin-bottom:35px;
      // display:flex;
      align-items: center;
      justify-content : center;
      label{
        white-space: nowrap;
        width:65px;
        text-align:right;
        display:block;
      }
      >div{
        flex:1;
      }
      button{
        width:140px;
        // background:#5780C9;
        color:#fff;
        border:none;
      }
    }
  }
}
</style>

