<template>
  <div class="common message-send-wrap">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item" :to="{name:'inbox'}">
          <div class="item-inner">
            {{$t('message.inbox')}}
          </div>
        </router-link>
        <router-link class="tab-item selected" :to="{name:'outbox'}">
          <div class="item-inner">{{$t('message.outbox')}}</div>
        </router-link>
      </div>
      <div class="card mt-30">
        <div class="card-body">
          <table class="send-table">
            <tbody>
              <tr>
                <td class="left">
                  <label>{{$t('message.fa_song_zhi')}}:</label>
                </td>
                <td class="right">
                  <el-select v-model="user" :placeholder="$t('message.qing_xuan_ze')" @focus="getUserFocus"
                    :loading-text="$t('message.loading')" :loading="userLoading" :no-data-text="$t('message.zan_wu_shu_ju')">
                    <el-option v-for="(item,index) in userOptions" :key='index' :value="item" :label="item.loginname">
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.theme')}}:</label>
                </td>
                <td class="right">
                  <input class="c-input" type="text" v-model.trim="title" :placeholder="$t('message.qing_shu_ru') + $t('message.theme')" />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="editor-wrap">
            <div class="editor-title">
              {{$t('message.edit_content')}}
            </div>
            <vue-editor v-model="editor" class="editor-content"></vue-editor>
            <div class="submit-row mt-60">
              <button class="confirm" @click="onSubmit">{{$t('message.send')}}</button>
              <button class="refuse" @click="goBack">{{$t('message.fan_hui')}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    VueEditor
  } from 'vue2-editor'

  export default {
    name: 'messageSend',
    components: {
      VueEditor
    },
    props: {},
    data() {
      return {
        editor: null,
        userLoading: false,
        userOptions: [],
        user: {},
        title: ""
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
      getUserFocus() {
        const vm = this;
        if (vm.userOptions.length === 0) {
          vm.userLoading = true;
          let url = '/message/receiver/list';
          vm.$http.get(url, {}).then(response => {
            vm.userLoading = false;
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                this.$store.state.reLogin(this);
              } else if (status == 200) {
                vm.userOptions = response.body.data;
              } else {
                vm.userOptions = [];
                vm.$store.state.message(vm.$t("message.server_cuo_wu"), 'error', 1500, vm);
                return;
              }
            }
          }, response => {
            vm.userLoading = false;
            vm.userOptions = [];
          });
        }
      },
      onSubmit() {
        const vm = this;
        if (!this.user.type.toString()) {
          vm.$store.state.message(vm.$t("message.qing_xuan_ze") + this.$t("message.fa_song_ren"), 'error', 1500, vm);
          return;
        }
        if (!this.title) {
          vm.$store.state.message(vm.$t("message.qing_shu_ru") + this.$t("message.theme"), 'error', 1500, vm);
          return;
        }
        if (!this.editor) {
          vm.$store.state.message(vm.$t("message.qing_shu_ru") + this.$t("message.fa_song_nei_rong"), 'error', 1500, vm);
          return;
        }
        vm
          .$confirm(vm.$t("message.que_ren_fa_song_me"), vm.$t("message.que_ren"), {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning"
          })
          .then(() => {
            vm.loading = true;
            let url = "/message/create";
            let data = {
              title: vm.title,
              message: vm.editor,
              type: vm.user.type.toString()
            };
            if (vm.user._id) {
              data['receiverid'] = vm.user._id;
            }
            vm.$http
              .post(url, data)
              .then(
                response => {
                  // console.log('response', response);
                  vm.loading = false;
                  let status = response.body.returncode;
                  if (status) {
                    if (status == 103 || status == 106 || status == 101) {
                      this.$store.state.reLogin(this);
                    } else if (status == 200) {
                      vm.$store.state.message(vm.$t("message.fa_song_cheng_gong"), 'success', 1500, vm);
                      vm.resetForm();
                    } else {
                      vm.$store.state.message(vm.$t("message.fa_song_shi_bai"), 'error', 1500, vm);
                    }
                  }
                },
                response => {
                  console.log("error", error);
                  vm.loading = false;
                }
              );
          })
          .catch(() => {
            vm.$store.state.message(vm.$t("message.kai_hu_yi_qu_xiao"), 'info', 1500, vm);
          });
      },
      resetForm() {
        this.title = '';
        this.editor = null;
        this.selectedUserItem = {};
      },
      goBack() {
        this.$router.push({
          name: 'outbox'
        });
      }
    },
  }

</script>

<style lang="scss" scoped>
  .message-send-wrap {
    background: #efefef;
    padding: 60px 0;

    .card-body {
      padding: 60px 0;

      .send-table {
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
        margin-left: auto;
        margin-right: auto;
        max-width: 396px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .confirm {
          background-image: linear-gradient(-180deg, #eb5228 0%, #c14726 100%);
        }

        .refuse {
          background-image: linear-gradient(-180deg, #afafaf 0%, #777777 100%);
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

      .editor-wrap {
        max-width: 873px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 60px;

        .editor-title {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #191919;
          text-align: left;
        }

        .editor-content {
          width: 100%;
          margin-top: 20px;
        }
      }
    }
  }

</style>
