<template>
  <div class="recommendation">
    <!-- <pageTitle :title="'recommendation'" :showBG="false"></pageTitle> -->
    <div class="recommendation-inner user-common">
      <div class="fill-amount mt-60">
        <div class="user-tab-title">{{$t('message.your_link')}}</div>
        <div class="mt-10 input-outer amount-row">
          <input class="user-input flex-col" readonly :value="link" />
        </div>
        <div class="user-tab-title mt-30">{{$t('message.share_to')}}</div>
        <div class="mt-10 amount-row flex-justify-start">
          <a class="share-link line" target="_blank" :href="'https://social-plugins.line.me/lineit/share?url='+link">
            <img alt='Line' class="inline-block line-icon" src="@/assets/img/sponsoredLink/icon_ Line@3x.png" />
            <span>{{$t('message.line')}}</span>
          </a>
          <a class="share-link facebook ml-20" target="_blank" :href="'http://www.facebook.com/sharer/sharer.php?u=' + link">
            <img alt='Line' class="inline-block facebook-icon" src="@/assets/img/sponsoredLink/icon_ Facebook@3x.png" />
            <span>{{$t('message.facebook')}}</span>
          </a>
          <button class="user-btn recommendation-btn ml-30" id="tuiguang_link" @click="copyLink('tuiguang_link')"
            :data-clipboard-text="link">{{$t('message.copy')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import pageTitle from '@/components/public/pageTitle';
  import Clipboard from 'clipboard';

  export default {
    name: 'recommendation',
    components: {
      pageTitle
    },
    data() {
      return {
        link: localStorage.getItem(
          'dove-web-link')
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
      // padding: 30px 0;
      flex-direction: column;
    }

    .fill-amount {
      width: 600px;
      text-align: left;
      
      font-size: 14px;
      color: #ababab;

      .amount-row {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .user-tab-title {
      line-height: 22px;
      height: 22px;
      font-size: 16px;
      color:#fff;
    }

    .input-outer {
      line-height: 50px;
      height: 50px;
      width: 100%;
      input{
        background:#000000;
        border-radius:25px;
      }
    }

    .recommendation-btn {
      width:180px;
      height: 36px;
      line-height: 36px;
      color:#fff;
    }

    .share-link {
      // background: #1E2126;
      border-radius: 20px;
      width: 180px;
      height: 40px;
      
      font-size: 16px;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      text-decoration: none;

      .line-icon {
        width: 24px;
        height: 22px;
        margin-right: 10px;
      }

      .facebook-icon {
        width: 25px;
        height: 25px;
        margin-right: 10px;
      }
    }
    .line{
      background-color: #309f54;
    }
    .facebook{
      background-color: #3c5b97;
    }
  }

</style>
