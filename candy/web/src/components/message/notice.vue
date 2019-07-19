<template>
  <div class="notice-wrap common">
    <div class="container">
      <div class="card">
        <div class="card-title">{{$t('message.message_center')}}</div>
        <div class="card-body">
          <div v-if="!noResult" class="notice-list clearfix">
            <router-link :to="{name:'noticeDetail',query:{id:item._id}}" target="_blank" class="list-row" v-for="(item,index) in list"
              :key="index">
              <span class="row-desc">{{item.title
                ? item.title : '--'}}
              </span><span class="row-time">{{item.create_at
                | formatTime}}</span>
            </router-link>
          </div>
          <div v-if="noResult" class="no-result mt-60">
            <p>{{$t('message.zan_wu_xiao_xi_ji_lu')}}</p>
          </div>
          <div v-if="!noResult" class="record-pagination clearfix">
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
    name: 'notice',
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
      sessionStorage.setItem("th_tag_url", "notice");
    },
    mounted() {
      this.handleSearch();
    },
    methods: {
      handleSearch() {
        this.pageIndex = 1;
        this.onSubmit();
      },
      onSubmit() {
        const vm = this;
        let data = {
          pageSize: vm.pageSize,
          pageNum: vm.pageIndex,
        };
        vm.loading = true;
        let url = '/notice/list';
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
  .notice-wrap {
    background: #efefef;
    padding: 60px 0;

    .notice-list {
      width: 100%;
      min-height: 100px;

      .list-row {
        width: 100%;
        border-bottom: 1px solid #EDEDED;
        height: 60px;
        padding: 20px;
        text-decoration: none;
        cursor: pointer;
        display: block;

        &:hover {
          background: #f2f2f2;
        }

        .row-desc {
          float: left;
          display: inline-block;
          max-width: 50%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #191919;
          text-align: left;
          text-decoration: none;
        }

        .row-time {
          float: right;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #191919;
          text-align: left;
          max-width: 40%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }

</style>
