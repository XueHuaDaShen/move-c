<template>
  <div class="common inbox-wrap">
    <div class="container">
      <div class="tab">
        <router-link class="tab-item selected" :to="{name:'inbox'}">
          <div class="item-inner">
            {{$t('message.inbox')}}
          </div>
        </router-link>
        <router-link class="tab-item" :to="{name:'outbox'}">
          <div class="item-inner">{{$t('message.outbox')}}</div>
        </router-link>
      </div>
      <div class="card mt-30" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="card-body padding-20">
          <div class="table-container">
            <table class="record-table">
              <thead>
                <tr>
                  <th>
                    <div class="cell">{{$t('message.theme')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.fa_jian_ren')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.status')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.time')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.cao_zuo')}}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!noResult" v-for="(item,index) in list" :key="index">
                  <td>
                    <div class="cell">{{item.title}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.type !=2 ? item.loginname : $t('message.system')}}</div>
                  </td>
                  <td>
                    <div class="cell">{{formatStatus(item.status)}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.create_at | formatTime}}</div>
                  </td>
                  <td>
                    <div class="cell">
                      <router-link class="detail" :to="{name:'inboxDetail',query:{id:item._id}}">{{$t('message.check')}}</router-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="
                        noResult" class="no-result">
                  <td colspan="9">
                    <p>{{$t('message.zan_wu_you_jian')}}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="record-pagination clearfix">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex"
              :page-size="pageSize" layout="total, prev, pager, next" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  export default {
    name: 'inbox',
    components: {},
    props: {},
    data() {
      return {
        list: [],
        noResult: true,
        totalPageNum: 0, //总页数
        total: 0, //总条数
        pageIndex: 1, //当前页
        pageSize: 15, //单页条数
        loading: false,
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {},
    created() {
      sessionStorage.setItem("th_tag_url", "inbox");
    },
    mounted() {
      this.getInlist();
      this.hasNewMessage();
    },
    methods: {
      // 新消息提示
      hasNewMessage() {
        const vm = this;
        vm.$http.get("/message/notice", {}).then(
          response => {
            let status = response.body.returncode;
            if (status) {
              if (status == 103 || status == 106 || status == 101) {
                vm.$store.state.reLogin(vm);
              } else if (status == 200) {
                vm.$store.dispatch("setMsgHidden", false);
              } else if (status === 301) {
                vm.$store.dispatch("setMsgHidden", true);
              } else {
                vm.$store.dispatch("setMsgHidden", true);
              }
            }
          },
          response => {}
        );
      },
      getInlist() {
        const vm = this;
        let data = {
          page_size: vm.pageSize,
          page_num: vm.pageIndex,
          type: '2'
        };
        vm.loading = true;
        let url = '/message/list';
        vm.$http.get(url, {
          params: data
        }).then(response => {
          // console.log('response', response);
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.reLogin(this);
            } else if (status == 200) {
              vm.total = response.body.data.total;
              if (vm.total) {
                vm.noResult = false;
                vm.totalPageNum = response.body.data.total_page_num;
                vm.list = response.body.data.data;
              } else {
                vm.noResult = true;
                vm.list = [];
              }
            } else {
              vm.noResult = true;
              vm.list = [];
            }
          }
        }, response => {
          // console.log('error', error);
          vm.loading = false;
          vm.noResult = true;
          vm.list = [];
        });
      },
      handleSizeChange(val) {},
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.onSubmit();
      },
      formatStatus(v) {
        if (v || v === 0) {
          switch (v) {
            case 0:
              return this.$t('message.unread');
            case 1:
              return this.$t('message.read');
            default:
              return v;
          }
        }
        return '--';
      }
    },
    filters: {
      formatTime(v) {
        if (v) {
          return moment(v).format('DD-MM-YYYY HH:mm:ss')
        }
        return '--'
      },
    }
  }

</script>

<style lang="scss" scoped>
  .inbox-wrap {
    background: #efefef;
    padding: 60px 0;

    table.record-table {
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
          padding: 15px 0;
        }

        &:last-child {
          >td {
            padding-bottom: 30px;
          }
        }
      }
    }

    .detail {
      background-image: linear-gradient(-180deg, #7C7C7C 0%, #464646 100%);
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #FFFFFF;
      text-align: center;
      width: 72px;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      display: inline-block;
      text-decoration: none;
    }

    .card-body {
      padding-top: 20px;
    }
  }

  .padding-20 {
    padding: 0 20px;
  }

</style>
