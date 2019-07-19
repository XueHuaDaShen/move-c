<template>
  <div class="contact-info-wrap common">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item" :to="{name:'basicInfo'}">
          <div class="item-inner">{{$t('message.basic_information')}}</div>
        </router-link>
        <router-link class="tab-item selected" :to="{name:'contactInfo'}">
          <div class="item-inner">{{$t('message.contact_way')}}</div>
        </router-link>
        <router-link class="tab-item" :to="{name:'passwordSetting'}">
          <div class="item-inner">{{$t('message.change_password')}}</div>
        </router-link>
      </div>
      <div class="card mt-30" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="card-body">
          <table class="user-table">
            <tbody>
              <tr>
                <td class="left">
                  <label>{{$t('message.firstname')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" :class="isNull.firstname?'disabled':''" v-model.trim="firstname" :disabled="isNull.firstname">
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.lastname')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" :class="isNull.lastname?'disabled':''" v-model.trim="lastname" :disabled="isNull.lastname">
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.email')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" :class="isNull.email?'disabled':''" v-model.trim="email" :disabled="isNull.email">
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.phone')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" :class="isNull.phone?'disabled':''" v-model.trim="phone" :disabled="isNull.phone" :placeholder="$t('message.qing_shu_ru') + $t('message.phone')">
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.line_id')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" v-model.trim="lineId" :placeholder="$t('message.qing_shu_ru') + $t('message.line_id')">
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.birth')}}:</label>
                </td>
                <td class="right">
                  <el-date-picker :picker-options="pickerDisabled" class="input-birth" v-model="birthday" type="date" format="dd-MM-yyyy" :placeholder="$t('message.qing_xuan_ze')+$t('message.birth')"></el-date-picker>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="submit-row">
            <button class="confirm" @click="profileUpdate">{{$t('message.que_ren')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import * as validator from "../../../../static/utils/validator";

  export default {
    name: "basicInfo",
    components: {},
    props: {},
    data() {
      return {
        isNull: null,
        phone: "" || localStorage.getItem("candy-phone"),
        lineId: "" || localStorage.getItem("candy-lineid"),
        birthday: "",
        firstname: localStorage.getItem("candy-firstname") != "undefined" ?
          localStorage.getItem("candy-firstname") : "",
        lastname: localStorage.getItem("candy-lastname") != "undefined" ?
          localStorage.getItem("candy-lastname") : "",
        loading: false,
        email: localStorage.getItem("candy-email") != "undefined" ?
          localStorage.getItem("candy-email") : "",
        pickerDisabled:  {  //验证时间范围
          disabledDate:(time)=>{
            let beginVal = new Date();
            if(beginVal) { 
              return time.getTime() > beginVal;
            }
          }
        },
      };
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      let birth = localStorage.getItem("candy-birthday");
      if(birth != '' && birth !== 'undefined'){
        this.birthday = new Date(birth)
      }
      this.isNull = {
        firstname: this.firstname ? true : false,
        lastname: this.lastname ? true : false,
        email: this.email ? true : false,
        phone: this.phone ? true : false,
      }
      sessionStorage.setItem("th_tag_url", "contactInfo");
    },
    mounted() {},
    methods: {
      profileUpdate() {
        const vm = this;
        if (!this.firstname) {
          vm.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.firstname"), 'error', 1500, vm);
          return;
        }
        if (!this.lastname) {
          vm.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.lastname"), 'error', 1500, vm);
          return;
        }
        if (!this.email) {
          vm.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.email"), 'error', 1500, vm);
          return;
        }
        if (!validator.email(this.email)) {
          vm.$store.state.message(this.$t("message.email") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, vm);
          return false;
        }
        if (!this.phone) {
          vm.$store.state.message(this.$t("message.qing_shu_ru") + this.$t("message.phone"), 'error', 1500, vm);
          return;
        }
        if (!validator.cellphone(this.phone)) {
          vm.$store.state.message(this.$t("message.phone") + this.$t("message.ge_shi_bu_zheng_que"), 'error', 1500, vm);
          return;
        }
        vm.loading = true;
        let url = "/user/profile/update";
        vm.$http
          .post(url, {
            firstname: vm.firstname,
            lastname: vm.lastname,
            email: vm.email.toLowerCase(),
            phone: vm.phone,
            lineid: vm.lineId,
            birthday: vm.birthday
          })
          .then(
            response => {
              vm.loading = false;
              let status = response.body.returncode;
              if (status) {
                if (status == 103 || status == 106 || status == 101) {
                  this.$store.state.reLogin(this);
                } else if (status == 200) {
                  localStorage.setItem("candy-firstname", vm.firstname);
                  localStorage.setItem("candy-lastname", vm.lastname);
                  localStorage.setItem("candy-email", vm.email);
                  localStorage.setItem("candy-phone", vm.phone);
                  localStorage.setItem("candy-phone", vm.phone);
                  localStorage.setItem("candy-birthday", vm.birthday);
                  this.isNull = {
                    firstname: true,
                    lastname: true,
                    email: true,
                    phone: true,
                  }
                  vm.$store.state.message(vm.$t("message.commit_success"), 'success', 1500, vm);
                } else {
                  vm.$store.state.message(vm.$t("message.update_contact_failed") + ":" + status, 'error', 1500, vm);
                }
              }
            },
            response => {
              vm.loading = false;
            }
          );
      }
    }
  };

</script>

<style lang="scss" scoped>
  .contact-info-wrap {
    background: #efefef;
    padding: 60px 0;

    .disabled {
      background-color: #f5f7fa;
      color: #c0c4cc;
      cursor: not-allowed;
      border: 1px solid #e4e7ed;
      box-shadow: none;
    }

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
