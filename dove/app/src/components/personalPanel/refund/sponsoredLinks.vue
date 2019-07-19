<template>
  <div class="recommendation user-common">
    <div class="recommendation-inner">
      <div class="fill-amount search-card">
        <div class="insert-to-bottom-line" style="text-align:left;">{{$t('message.your_link')}}</div>
        <div class="mt-30 input-outer amount-row">
          <span class="user-input" style="white-space:wrap">
            {{link}}
          </span>
          <!-- <input class="user-input flex-col" readonly :value="link" /> -->
        </div>
        <div class="amount-row mt-20">
          <button class="user-btn recommendation-btn ml-30" id="tuiguang_link" @click="copyLink('tuiguang_link')"
            :data-clipboard-text="link">{{$t('message.copy')}}</button>
        </div>
        <div class="insert-to-bottom-line mt-60" style="text-align:left;">{{$t('message.share_to')}}</div>
        <div class="amount-row mt-20">
          <a class="share-link" style="background:#309f54;" target="_blank" :href="'https://social-plugins.line.me/lineit/share?url='+link">
            <img alt='Line' class="inline-block line-icon" src="@/assets/img/sponsoredLink/icon_ Line@3x.png" />
            <span>{{$t('message.line')}}</span>
          </a>
        </div>
        <div class="amount-row mt-30">
          <a class="share-link" style="background:#3c5b97;" target="_blank" :href="'http://www.facebook.com/sharer/sharer.php?u=' + link">
            <img alt='Line' class="inline-block facebook-icon" src="@/assets/img/sponsoredLink/icon_ Facebook@3x.png" />
            <span>{{$t('message.facebook')}}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Clipboard from 'clipboard';

  export default {
    name: 'recommendation',
    data() {
      return {
        link: localStorage.getItem('dove-app-link')
      }
    },
    beforeDestroy() {},
    destroyed() {},
    beforeCreate() {},
    created() {
      this.$store.dispatch('setHeaderName', this.$t("message.recommendation"));
    },
    beforeMount() {},
    mounted() {},
    watch: {},
    methods: {
      copyLink(id) {
        const flag = Clipboard.isSupported();
        const vm = this;
        if (flag) {
          var clipboard = new Clipboard(`#${id}`); /*创建方法*/
          clipboard.on('success', e => {
            e.clearSelection();
            vm.$message({
              type: "success",
              message: vm.$t('message.copy_success')
            });
            clipboard.destroy();
          })
          clipboard.on('error', e => {
            vm.$message({
              type: "error",
              message: vm.$t('message.copy_failure')
            });
            clipboardDemos.destroy();
          })
        } else {
          /*浏览器不支持时，进入手动复制方法*/
          vm.$message({
            type: "error",
            message: vm.$t('message.copy_failure')
          });
          clipboardDemos.destroy();
        }
      },
    }
  }

</script>
<style lang="scss" scoped>
  .recommendation {

    .recommendation-inner {
      background: #111111;
      text-align: center;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 4vw;
      flex-direction: column;
    }

    .fill-amount {
      width: 100%;
      text-align: left;
      // font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #ababab;

      .amount-row {
        display: flex;
        justify-content: center;
        align-items: center;
        height:12vw !important;
      }
    }

    .input-outer {
      width: 100%;
    }
    .user-btn{
      width:52.53vw;
    }

    .share-link {
      border-radius: 1.07vw;
      width: 100%;
      height: 100%;
      
      font-size: 4vw;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      text-decoration: none;

      .line-icon {
        width: 6.27vw;
        height: 5.6vw;
        margin-right: 1.07vw;
      }

      .facebook-icon {
        width: 6.13vw;
        height: 6.13vw;
        margin-right: 1.07vw;
      }
    }
  }

</style>
