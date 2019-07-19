<template>
  <div class="password-wrap common">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item" :to="{name:'basicInfo'}">
          <div class="item-inner">
            {{$t('message.basic_information')}}
          </div>
        </router-link>
        <router-link class="tab-item" :to="{name:'contactInfo'}">
          <div class="item-inner">{{$t('message.contact_way')}}</div>
        </router-link>
        <router-link class="tab-item selected" :to="{name:'passwordSetting'}">
          <div class="item-inner">{{$t('message.change_password')}}</div>
        </router-link>
      </div>
      <div class="card mt-30" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="card-body">
          <table class="user-table">
            <tbody>
              <tr>
                <td class="left">
                  <label>{{$t('message.old_password')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" type="password" v-model.trim="old_password" :placeholder="$t('message.que_ren') + $t('message.old_password')" />
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.new_password')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" type="password" v-model.trim="new_password" :placeholder="$t('message.qing_shu_ru') + $t('message.new_password')" />
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.que_ren')+$t('message.new_password')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" type="password" v-model.trim="re_new_password" :placeholder="$t('message.qing_que_ren') + $t('message.confirm_pwd')" />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="submit-row">
            <button class="confirm" @click="confirmUpdate">{{$t('message.que_ren')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import * as validator from "../../../../static/utils/validator";
  import paramCryptFn from '@/assets/js/cryptData';

  export default {
    name: 'basicInfo',
    components: {},
    props: {},
    data() {
      return {
        old_password: "",
        new_password: "",
        re_new_password: "",
        loading: false,
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      sessionStorage.setItem("th_tag_url", "passwordSetting");
    },
    mounted() {},
    methods: {
      confirmUpdate() {
        if (!this.old_password) {
          this.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.old_password"), 'error', 1500, this);
          return;
        }
        if (!validator.regexpPsd(this.old_password)) {
          this.$store.state.message(this.$t("message.old_password") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, this);
          return;
        }
        if (!this.new_password) {
          this.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.new_password"), 'error', 1500, this);
          return;
        }
        if (!validator.regexpPsd(this.new_password)) {
          this.$store.state.message(this.$t("message.new_password") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, this);
          return;
        }
        if (!this.re_new_password) {
          this.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.confirm_pwd"), 'error', 1500, this);
          return;
        }
        if (!validator.regexpPsd(this.re_new_password)) {
          this.$store.state.message(this.$t("message.confirm_pwd") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, this);
          return;
        }
        if (this.new_password != this.re_new_password) {
          this.$store.state.message(this.$t("message.qian_hou_mi_ma_bu_yi_zhi"), 'error', 1500, this);
          return;
        }
        const vm = this;
        let url = '/user/password/change';
        vm.$http.post(
          '/user/random', {
            loginname: localStorage.getItem('candy-loginname')
          }, {
            emulateJSON: true
          }
        ).then(response => {
          let status = response.body.returncode;
          if (status == 200) {
            let random = response.body.data.random;
            let oldpw = CryptoJS.HmacMD5(CryptoJS.MD5(vm.old_password).toString(), random).toString();
            let newpw = CryptoJS.MD5(vm.new_password).toString();

            var data = {
              oldpw: oldpw,
              newpw: newpw
            }
            // console.log(data);
            vm.$http.post(url, paramCryptFn(data), {
              emulateJSON: true
            }).then(
              response => {
                vm.loading = false;
                let code = response.body.returncode;
                if (code == 200) {
                  vm.$message({
                    showClose: true,
                    message: vm.$t('message.mi_ma_xiu_gai_cheng_gong'),
                    type: 'success'
                  });
                  vm.old_password = '';
                  vm.new_password = '';
                  vm.re_new_password = '';
                } else if (code == 101 || code == 103 || code ==
                  106) {
                  vm.$message({
                    showClose: true,
                    message: response.body.returncode,
                    type: 'error'
                  });
                } else if (code == 301) {
                  // 参数错误
                  vm.$message({
                    showClose: true,
                    message: vm.$t('message.can_shu_cuo_wu'),
                    type: 'error'
                  });
                } else if (code == 307) {
                  // 用户密码相同
                  vm.$message({
                    showClose: true,
                    message: vm.$t('message.yong_hu_mi_ma_xiang_tong'),
                    type: 'error'
                  });
                } else if (code == 303) {
                  // 服务器错误
                  vm.$message({
                    showClose: true,
                    message: vm.$t('message.server_cuo_wu'),
                    type: 'error'
                  });
                } else if (code == 306) {
                  // 用户被禁
                  vm.$message({
                    showClose: true,
                    message: vm.$t('message.yong_hu_bei_jin'),
                    type: 'error'
                  });
                } else if (code == 305) {
                  // 用户密码错误
                  vm.$message({
                    showClose: true,
                    message: vm.$t('message.yong_hu_mi_ma_cuo_wu'),
                    type: 'error'
                  });
                } else {
                  vm.$message({
                    showClose: true,
                    message: response.body.returncode,
                    type: 'error'
                  });
                }
              }, error => {
                vm.loading = false;
                vm.$message({
                  showClose: true,
                  message: error.body.returncode,
                  type: 'error'
                });
              }
            );
          } else {
            vm.loading = false;
            vm.$message({
              showClose: true,
              message: response.body.returncode,
              type: "error"
            });
          }
        }, error => {
          vm.loading = false;
          console.log('/user/random---error', error)
        });
      }
    },
  }

</script>

<style lang="scss" scoped>
  .password-wrap {
    background: #efefef;
    padding: 60px 0;

    .card-body {
      padding-top: 60px;
    }

    .user-table {
      width: 100%;
      display: table;
      font-size: 16px;

      tr {
        td {
          padding-top: 20px;

          &.left {
            width: 46%;
            text-align: right;
            padding-right: 20px;
          }

          &.right {
            text-align: left;
          }

          >label {
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #191919;
            text-align: right;
          }
        }

        &:first-child {
          td {
            padding-top: 0;
          }
        }

        &.line-tip {
          td {
            padding-top: 10px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #777777;
          }
        }

        &.text-area {
          td.left {
            vertical-align: top;
          }
        }
      }
    }

    .submit-row {
      max-width: 396px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      padding: 60px 0;

      .confirm {
        background-image: linear-gradient(-180deg, #eb5228 0%, #c14726 100%);
      }

      >button {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        width: 145px;
        height: 44px;
        line-height: 44px;
        cursor: pointer;
      }
    }
  }

</style>
