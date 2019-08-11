import { ua } from "..";
import { getSdk } from './utils'

class ShareClass {
  async exec(options) {
    this[ua](options)
  }

  async wechat(options) {
    const sdk = await getSdk()

    return new Promise((resolve) => {
      sdk.config({
        debug: false,
        appId: options.appId,
        timestamp: options.timeStamp,
        nonceStr: options.nonceStr,
        signature: options.signature,
        jsApiList: ['onMenuShareAppMessage'],
      });

      sdk.ready(() => {
        wx.onMenuShareAppMessage({
          title: options.title, // 分享的标题
          desc: options.desc, // 分享的描述
          link: options.link, // 分享的链接
          imgUrl: options.imgUrl, // 分享的图标
          success: () => {
            resolve('success'); // 确认分享后执行的回调
          },
          fail: () => {
            resolve('fail'); // 分享失败时的回调函数
          },
          cancle: () => {
            resolve('cancle'); // 取消分享后的回调函数
          },
        });
      });
    });
  }

  async alipay(options) {
    const sdk = await getSdk();
    return new Promise((resolve, reject) => {
      sdk.call('startShare', { onlySelectChannel: ['ALPContact'] }, (data) => {
        sdk.call('shareToChannel', {
          name: data.channelName,
          params: {
            titile: options.title,
            imageUrl: options.imageUrl,
            captureScreen: options.captureScreen ? options.captureScreen : false,
            url: options.url,
          },
          function(result) {
            if (result.error) {
              reject(result.error)
            }
            resolve(result)
          },
        })
      })
    })
  }
}

const Share = new ShareClass();

export default Share;
