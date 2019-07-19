<template>
  <div class="common outbox-wrap">
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
      <div class="card mt-30" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="card-body padding-20 clearfix">
          <div class="create-row">
            <router-link class="btn-copy mb-20" :to="{name:'messageSend'}">{{$t('message.send_message')}}</router-link>
          </div>
          <div class="table-container">
            <table class="record-table">
              <thead>
                <tr>
                  <th>
                    <div class="cell">{{$t('message.theme')}}</div>
                  </th>
                  <th>
                    <div class="cell">{{$t('message.receiver')}}</div>
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
                    <div class="cell">{{item.type !=0 ? item.receivername : $t('message.system')}}</div>
                  </td>
                  <td>
                    <div class="cell">{{item.create_at | formatTime}}</div>
                  </td>
                  <td>
                    <div class="cell">
                      <router-link class="detail cell-btn" :to="{name:'outboxDetail',query:{id:item._id}}">{{$t('message.check')}}</router-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="noResult" class="no-result">
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
    name: 'outbox',
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
      sessionStorage.setItem("th_tag_url", "outbox");
      this.getOutList();
    },
    methods: {
      getOutList() {
        const vm = this;
        let data = {
          page_size: vm.pageSize,
          page_num: vm.pageIndex,
          type: '1'
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
    },
    filters: {
      formatTime(v) {
        if (v) {
          return moment(v).format('DD-MM-YYYY HH:mm:ss')
        }
        return '--'
      },
      formatStatus(v) {
        if (v) {
          switch (v) {
            default:
              return v;
          }
        }
        return '--';
      }
    }
  }

</script>

<style lang="scss" scoped>
  .outbox-wrap {
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
      text-decoration: none;
      display: inline-block;
    }

    .card-body {
      padding-top: 20px;

      .btn-copy {
        width: 100px;
        text-decoration: none;
        display: inline-block;
      }
    }

    .create-row {
      text-align: right;
    }
  }

  .padding-20 {
    padding: 0 20px;
  }

</style>
