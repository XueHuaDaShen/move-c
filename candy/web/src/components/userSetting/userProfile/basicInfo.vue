<template>
  <div class="basic-info-wrap common">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item selected" :to="{name:'basicInfo'}">
          <div class="item-inner">
            {{$t('message.basic_information')}}
          </div>
        </router-link>
        <router-link class="tab-item" :to="{name:'contactInfo'}">
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
                  <label>{{$t('message.user_type')}}:</label>
                </td>
                <td class="right">
                  <label>{{ filterType(userType)}}</label>
                </td>
              </tr>
              <tr>
                <td class="left">
                  <label>{{$t('message.username')}}:</label>
                </td>
                <td class="right">
                  <label>{{loginname}}</label>
                </td>
              </tr>
              <!-- <tr>
                <td class="left">
                  <label>{{$t('message.email')}}:</label>
                </td>
                <td class="right">
                  <label>{{email ? email : '--'}}</label>
                </td>
              </tr> -->
              <!-- <tr>
                <td class="left">
                  <label>{{$t('message.xin_yong_e')}}:</label>
                </td>
                <td class="right">
                  <label>{{cash_credit ? cash_credit : '--'}}</label>
                </td>
              </tr> -->
            </tbody>
          </table>
          <p class="mt-60 list-title">{{$t('message.lottery_setting')}}</p>
          <div class="table-container">
            <table class="table-list mt-20">
              <thead>
                <tr>
                  <th>
                    <div class="cell">{{$t('message.cai_zhong')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.wan_fa')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.min_tou_zhu_e')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.max_tou_zhu_e')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.pei_lv')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.discount')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.stock')}}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in user_refund" :key="index">
                  <td :rowspan="item.parentspan" :class="{hidden: item.parentdis}">
                    <div class="cell" v-if="$i18n.locale==='zh'">{{item.parentid && item.parentid.parentid ?
                      item.parentid.parentid.name_cn :
                      '--'}}</div>
                    <div class="cell" v-if="$i18n.locale==='th'">{{item.parentid && item.parentid.parentid ?
                      item.parentid.parentid.name_th :
                      '--'}}</div>
                  </td>
                  <td>
                    <div class="cell" v-if="$i18n.locale==='zh'">{{item.name_cn ? item.name_cn : '--'}}</div>
                    <div class="cell" v-if="$i18n.locale==='th'">{{item.name_th ? item.name_th : '--'}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.min_bet}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.max_bet}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.prize}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.discount}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.stock }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'basicInfo',
    components: {},
    props: {},
    data() {
      return {
        userType: '',
        loginname: '',
        cash_credit: '',
        cash: "",
        loading: false,
        email: '',
        user_refund: []
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      sessionStorage.setItem("th_tag_url", "basicInfo");
    },
    mounted() {
      this.getProfile();
    },
    methods: {
      getProfile() {
        const vm = this;
        this.$http.get('/user/profile', {}).then(response => {
          // console.log('response', response);
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.reLogin(this);
            } else if (status == 200) {
              let data = response.body.data;
              vm.userType = data.type;
              vm.loginname = data.loginname;
              // vm.cash_credit = data.cash_credit;
              vm.email = data.email;
              vm.cash = data.cash;
              localStorage.setItem('candy-cash', data.cash);
              localStorage.setItem("candy-birthday", data.birthday||'');
              this.$store.dispatch("setCash", data.cash);
              localStorage.setItem('candy-cash_credit', data.cash_credit);
              localStorage.setItem('candy-loginname', data.loginname);
              localStorage.setItem('candy-email', data.email);
              localStorage.setItem('candy-loginid', data._id);
              localStorage.setItem('candy-phone', data.phone);
              localStorage.setItem('candy-lineid', data.lineid);
              localStorage.setItem('candy-firstname', data.firstname);
              localStorage.setItem('candy-lastname', data.lastname);
              if (data.superiorid) {
                if (data.superiorid.phone) {
                  localStorage.setItem("candy-superiorphone", data.superiorid.phone);
                }
                if (data.superiorid.lineid) {
                  localStorage.setItem("candy-superiorlineid", data.superiorid.lineid);
                }
              }
              localStorage.setItem('candy-type', data.type);
              vm.getMember();
            } else {
              vm.$store.state.message(vm.$t("message.get_profile_failed"), 'error', 1500, vm);
            }
          }
        }, response => {
          // console.log('error', error);
          vm.loading = false;
        });
      },
      getMember() {
        const vm = this;
        vm.loading = true;
        let url = '/lottery/limites';
        vm.$http.get(url, {
          params: {
            id: localStorage.getItem('candy-loginid')
          }
        }).then(response => {
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.reLogin(this);
            } else if (status == 200) {
              let data = response.body.data;
              data.sort(
                function compareFunction(param1, param2) {
                  let id1 = param1.parent;
                  let id2 = param2.parent;
                  return id1.localeCompare(id2);
                }
              )
              vm.user_refund = this.combineCell(data);
            } else {
              vm.$store.state.message(this.$t("message.get_lottery_setting_failed") + ":" + status, 'error', 1500, vm);
            }
          }
        }, response => {
          // console.log('error', error);
          vm.loading = false;
        });
      },
      filterType(v) {
        const vm = this;
        if (v || v === 0) {
          switch (Number(v)) {
            case 0:
              return this.$t('message.user_type_1');
            case 1:
              return this.$t('message.user_type_2');
            case 2:
              return this.$t('message.user_type_3');
          }
        }
        return '--';
      },
      combineCell(list) {
        let field = 'parent';
        var k = 0;
        while (k < list.length) {
          list[k][field + 'span'] = 1;
          list[k][field + 'dis'] = false;
          for (var i = k + 1; i <= list.length - 1; i++) {
            if (list[k][field] == list[i][field] && list[k][field] != '') {
              list[k][field + 'span']++;
              list[k][field + 'dis'] = false;
              list[i][field + 'span'] = 1;
              list[i][field + 'dis'] = true;
            } else {
              break;
            }
          }
          k = i;
        }
        return list;
      },
    },
  }

</script>

<style lang="scss" scoped>
  .basic-info-wrap {
    background: #efefef;
    padding: 60px 0;

    td.hidden {
      display: none !important;
    }

    .table-container {
      padding-bottom: 20px;
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

    .list-title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #191919;
      text-align: left;
    }

    table.table-list {
      border-collapse: collapse;
      width: 100%;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #191919;
      text-align: center;


      thead {
        background: #ededed;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #191919;
        line-height: 40px;
        height: 40px;
        text-align: center;
      }

      tr {
        >td {
          padding: 15px 10px;
          border: 1px solid #e8e8e8;
          white-space: nowrap;
        }
      }
    }

    .card-body {
      padding: 60px 20px 0;
    }
  }

</style>
