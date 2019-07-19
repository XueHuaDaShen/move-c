<template>
  <div class="common notice-detail-wrap">
    <div class="container">
      <div class="card mt-30" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="card-body">
          <div class="title">
            <h1>{{detail[0].title ? detail[0].title : '--'}}</h1>
            <p>{{time}}</p>
            <hr class="user-split-line">
            <div class="notice-content">
              <div v-html="detail[0].content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  export default {
    name: 'noticeDetail',
    props: {},
    data() {
      return {
        loading: false,
        detail: []
      }
    },
    beforeDestroy() {},
    destroyed() {},
    computed: {
      time() {
        if (this.detail[0].create_at) {
          return moment(this.detail[0].create_at).format('DD-MM-YYYY HH:mm:ss');
        }
      }
    },
    created() {
      let id = this.$route.query && this.$route.query.id;
      if (id) {
        this.getDetail(id);
      } else {
        this.noMessage();
      }
    },
    mounted() {},
    methods: {
      noMessage() {
        let self = this;
        self.$alert(`<div class="lottery-title">${self.$t('message.message_not_exist')}</div>`,
          `${self.$t('message.system_tishi')}`, {
            confirmButtonText: self.$t("message.confirm"),
            center: true,
            lockScroll: false,
            dangerouslyUseHTMLString: true,
            customClass: "syxw-wrap-inner",
            callback: action => {
              setTimeout(function () {
                self.$router.push({
                  name: 'notice'
                });
              }, 1000)
            }
          })
      },
      getDetail(id) {
        const vm = this;
        let data = {
          page_size: vm.pageSize,
          page_num: vm.pageIndex,
          id: id
        };
        vm.loading = true;
        let url = '/notice/list';
        vm.$http.get(url, {
          params: data
        }).then(response => {
          vm.loading = false;
          let status = response.body.returncode;
          if (status) {
            if (status == 103 || status == 106 || status == 101) {
              this.$store.state.reLogin(this);
            } else if (status == 200) {
              vm.detail = response.body.data.data;
            } else {
              vm.detail = {};
              vm.$store.state.message(vm.$t("message.server_cuo_wu"), 'error', 1500, vm);
              return;
            }
          }
        }, response => {
          vm.loading = false;
          vm.detail = {};
        });
      },
    },
  }

</script>

<style lang="scss" scoped>
  .notice-detail-wrap {
    background: #efefef;

    .card-body {
      padding: 20px;
      min-height: 500px;
      color: #191919;

      .title {
        font-family: PingFangSC-Regular;
        color: #777777;
      }

      .title>h1 {
        font-size: 20px;
        font-weight: normal;
        color: #191919;
      }

      .title>p {
        font-size: 14px;
        margin: 20px 0;
        margin-top: 5px;
      }

      .notice-content {
        margin-top: 24px;
        text-align: left;
        font-size: 14px;
        color: #777;
        width: 100%;
      }
    }
  }

</style>
