<template>
  <div class="changePassword">
    <div class="changePassword-inner">
      <!-- <div class="user-card mt-30">
        <div class="row title">{{$t('message.transfer_account')}}</div>
        <div class="row mt-30 flex-justify-between">
          <span>{{$t('message.account_name')}}</span>
          <span class="normal-num">{{getDoveName}}</span>
        </div>
        <div class="row mt-20 flex-justify-between">
          <span>{{$t('message.mobile_account_name')}}</span>
          <span class="normal-num">{{getMobileDoveName}}</span>
        </div>
        <div class="row mt-20">
          <span class="normal-num">({{$t('message.mobile_tip')}})</span>
        </div>
      </div> -->
      <div class="fill-amount">
        <div class="title insert-to-bottom-line mt-30">{{$t('message.safety_management')}}</div>
        <div class="mt-30 label">{{$t('message.change_password')}}</div>
        <div class="mt-30 input-outer amount-row">
          <input class="user-input flex-col" :placeholder="$t('message.pl_enter_old_pw')" v-model.trim="form.oldpw.val"
            type="password" />
        </div>
        <div class="mt-30 input-outer amount-row">
          <input class="user-input flex-col" :placeholder="$t('message.pl_enter_new_pw')" v-model.trim="form.newpw.val"
            type="password" />
        </div>
        <div class="mt-30 input-outer amount-row">
          <input class="user-input flex-col" :placeholder="$t('message.pl_confirm_new_pw')" v-model.trim="form.confirm_newpw.val"
            type="password" />
        </div>
        <div class="amount-row mt-60">
          <button class="user-btn changePassword-btn ml-30" @click="onSubmit()">{{$t('message.confirm')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import paramCryptFn from "@/assets/js/cryptData";
  import * as validator from "@/assets/js/utils/validator";

  export default {
    name: 'changePassword',
    data() {
      return {
        form: {
          oldpw: {
            val: '',
            require: true,
            message: 'pl_enter_old_pw',
            clear: true,
          },
          newpw: {
            val: '',
            require: true,
            message: 'pl_enter_new_pw',
            clear: true,
          },
          confirm_newpw: {
            val: '',
            require: true,
            message: 'pl_confirm_new_pw',
            clear: true,
          },
        }
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
      onSubmit() {
        const vm = this;
        let data = {};
        let validate = true;
        for (let key in vm.form) {
          let obj = vm.form[key];
          if (!obj.val && obj.require) {
            vm.$store.state.message(vm.$t('message.' + obj.message), 'warning', 3000, vm);
            validate = false;
            return;
          }
          data[key] = obj.val;
        }
        if (!validator.regexpPsd(vm.form.newpw.val)) {
          vm.$store.state.message(vm.$t("message.login_and_registered.error_tip.password_ruler_error"), 'warning', 3000, vm);
          validate = false;
          return;
        }
        if(vm.form.newpw.val !== vm.form.confirm_newpw.val){
          vm.$store.state.message(vm.$t('message.new_pw_not_same'), 'warning', 3000, vm);
          validate = false;
          return;
        }
        if (validate) {
          vm.changePw(data)
        }
      },
      // 更新个人资料
      changePw(data) {
        const url = '/user/password/change';
        const vm = this;
        // vm.loading = true;
        vm.$http.post('/user/random', {
          loginname: localStorage.getItem('dove-app-loginname')
        }, {
          emulateJSON: true
        }).then(res => {
          let data = res.data;
          if (data.returncode == 200) {
            let random = data.data.random;
            let old_password = CryptoJS.HmacMD5(CryptoJS.MD5(vm.form.oldpw.val).toString(), random).toString()
            let new_password = CryptoJS.MD5(vm.form.newpw.val).toString();
            var param = {
              oldpw: old_password,
              newpw: new_password
            };
            this.$http.post(url, paramCryptFn(param), {
              emulateJSON: true
            }).then(res => {
              let code = res.data.returncode;
              let data = res.data.data;
              if (code == 200) {
                vm.$store.state.message(vm.$t('message.pw_change_success'), 'success', 1000, vm);
                vm.resetForm(vm.form)
              } else if (code == 301) {
                // 参数错误
                vm.$store.state.message(vm.$t('message.param_error'), 'error', 2000, vm);
              } else if (code == 307) {
                // 用户密码相同
                vm.$store.state.message(vm.$t('message.same_as'), 'error', 2000, vm);
              } else if (code == 303) {
                // 服务器错误
                vm.$store.state.message(vm.$t('message.login_and_registered.error_tip.server_error'), 'error', 2000, vm);
              } else if (code == 306) {
                // 用户被禁
                vm.$store.state.message(vm.$t('message.user_disabled'), 'error', 2000, vm);
              } else if (code == 305) {
                // 用户密码错误
                vm.$store.state.message(vm.$t('message.old_pwd_error'), 'error', 2000, vm);
              } else if (code == 304) {
                // 用户密码错误
                vm.$store.state.message(vm.$t('message.login_and_registered.error_tip.user_not_exist'), 'error', 2000, vm);
              } else if (code == 103 || code == 106 || code == 101) {
                this.$store.state.logout(this);
              }
            }).then(error => {})
          }
        }).then(error => {
          // this.consoleFn(error)
        })
      },
      resetForm(form) {
        for (let obj in form) {
          if (obj.clear) {
            obj.val = "";
          }
        }
      }
    },
    computed: {
      getDoveName() {
        return this.$store.state.doveName;
      },
      getMobileDoveName() {
        return this.$store.state.doveName;
      }
    }
  }

</script>
<style lang="scss" scoped>
  .changePassword {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 4vw;

    .changePassword-inner {
      background: #111111;
      text-align: center;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
    }

    .bank-image {
      width: 150px;
      height: 42px;
    }

    .fill-amount {
      width: 100%;
      text-align: left;
      // font-family: PingFangSC-Medium;
      color: #fff;

      .amount-row {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .label{
        font-size:4vw;
      }
      .title{
        font-size:4.27vw;
      }
      .user-input{
        width:100%;
        padding:0 4vw;
        height:11.73vw;
        line-height:11.73vw;
      }
    }

    .input-outer {
      width: 100%;
    }
    .user-btn{
      width:52.53vw;
    }
  }

</style>
