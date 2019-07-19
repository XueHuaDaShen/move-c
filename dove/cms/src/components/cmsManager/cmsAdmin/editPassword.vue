<!-- 代理开户 -->
<template>
  <div class="content-header agentLink el-custom">
    <div class="title">
      <h2>{{titleName}}</h2>
    </div>
    <div class="search-wrap">
      <div class="nav-title">
        <span :class="item.checked?'current':''" v-for="(item, index) in routerArr" :key="index" @click="handleChangeRouter(item.name)">{{item.title}}</span>
      </div>
      <div class="search-content">
        <table class="search-table" v-loading="loading">
          <tbody>
            <tr>
              <td><label>Old Password：</label></td>
              <td><el-input type="password" v-model.trim="old_pwd" placeholder="old password" clearable style="width:140px;"></el-input></td>
            </tr>
            <tr>
              <td><label>New Password：</label></td>
              <td><el-input type="password" v-model.trim="new_pwd" placeholder="new password" clearable style="width:140px;"></el-input></td>
            </tr>
            <tr>
              <td><label>Confirm New Password：</label></td>
              <td><el-input type="password" v-model.trim="confirm_new_pwd" placeholder="confirm new password" clearable style="width:140px;"></el-input></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div style="margin-top:30px;"><el-button type="primary" class="yes" @click="createLink">Save</el-button></div>
  </div>
</template>
<script>
  import request from '@/axios/axios.js'
  import * as validator from "@/lib/utils/validator";
  import moment from 'moment';
  import MD5 from 'MD5';

  export default {
    name: 'editPassword',
    data() {
      return {
        index1: 0,
        index2: 0,
        duration: 1000,
        titleName: '',
        routerArr: [],
        old_pwd: '',
        new_pwd: '',
        confirm_new_pwd: '',
        loading: false,
      }
    },
    created() {
      this.routerArr = [];
      let query = this.$route.query;
      this.index1 = Number(query.index1);
      this.index2 = Number(query.index2);
      let data = this.$store.state.formatMenuFn(this.index1, this.index2, 'editPassword');
      this.routerArr = data.routerArr;
      this.titleName = data.titleName;
      
    },
    methods: {
      handleChangeRouter(name) {
        this.$router.push({
          name: name,
          query: {
            index1: this.index1,
            index2: this.index2
          }
        })
        // console.log(name)
      },
      success() {
        const vm = this;
        this.$message({
          message: 'Load Success',
          type: 'success',
          duration: vm.duration,
          center: true
        })
      },
      error() {
        const vm = this;
        this.$message({
          message: 'Load Failure',
          type: 'error',
          duration: vm.duration,
          center: true
        })
      },
      //message
      message(text, type) {
        const vm = this;
        this.$message({
          message: text,
          type: type,
          duration: vm.duration,
          center: true
        })
      },
      createLink() {
        const vm = this;
        if(!vm.old_pwd){
          vm.message('please input old password', 'error');
          return false;
        }
        if (!validator.regexpPsd(vm.old_pwd)) {
          vm.message("A combination of letters and numbers with a old password of more than 6 digits", "error");
          return;
        }
        if(!vm.new_pwd){
          vm.message('please input new password', 'error');
          return false;
        }
        if (!validator.regexpPsd(vm.new_pwd)) {
          vm.message("A combination of letters and numbers with a new password of more than 6 digits", "error");
          return;
        }
        if(!vm.confirm_new_pwd){
          vm.message('Please fill in the confirm password again', 'error');
          return false;
        }
        if(vm.confirm_new_pwd !== vm.new_pwd){
          vm.message('The two passwords don\'t match', 'error');
          return false;
        }
        vm.loading = true;
        request.login(
          "post",
          "/admin/random", {
            loginname: localStorage.getItem('dove-cms-loginname')
          },
          success => {
            if (success.returncode == 200) {
              let random = success.data.random;
              let new_password = CryptoJS.HmacMD5(
                CryptoJS.MD5(vm.old_pwd).toString(),
                random
              ).toString();
              request.http(
                'post',
                '/admin/change/pw',
                {
                  oldpw: new_password,
                  newpw: MD5(vm.new_pwd),
                },
                success => {
                  vm.loading = false;
                  let code = success.returncode;
                  if(code == 200){
                    vm.message('Create Success', 'success');
                    vm.old_pwd = '';
                    vm.new_pwd = '';
                    vm.confirm_new_pwd = '';
                  } else if (code === 101 || code === 103 || code === 106) {
                    request.loginAgain(vm)
                  } else if (code == 304) {
                    vm.message("The user does not exist", "error")
                  } else if (code == 305){
                    vm.message('Old Password mistake', 'error');
                  } else if (code == 306){
                    vm.message('Your account was accessed by a ban, please contact your administrator', 'error');
                  } else if (code == 303){
                    vm.message('Server error', 'error');
                  } else{
                    vm.message('Create Failure', 'error');
                  }
                  // console.log(success)
                },
                error => {
                  vm.loading = false;
                  vm.error();
                }
              )
            } else {
              vm.error();
              vm.loading = false;
            }
            // console.log('/user/random---success', success)
          },
          error => {
            vm.error();
            vm.loading = false;
            console.log("/user/random---error", error);
          }
        );
      }
    }
  }

</script>
<style lang="scss">
.agentLink {
  .el-input__inner{
    min-width:auto !important;
  }
  .error-ruler .el-input__inner{
    border-color:#c83a4c;
  }
}
</style>

<style lang="scss" scoped>
  /* @import '../../publicCss/header.css'; */

  .box-card {
    background-color: #fff;
    width: 96%;
    margin: 15px auto 42px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
  }

  .content-container {
    width: 100%;
    margin: 0px auto;
    padding-top: 20px;
  }

  .search-table{
    width:100%;
    padding-bottom:25px;
    td{
      text-align:left;
      padding: 5px 0;
      &:first-child{
        width:45%;
        text-align:right;
      }
      label{
        font-size: 12px;
        color: #191919;
      }
    }
  }

</style>
