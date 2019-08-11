import { ua } from "..";
import { getSdk } from './utils';

class PayClass {
  // 扫码
  async exec(options = {}) {
    return this[ua](options);
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
        jsApiList: ['chooseWXPay'],
      });

      sdk.ready(() => {
        sdk.chooseWXPay({
          timestamp: options.timeStamp, // 支付签名时间戳
          nonceStr: options.nonceStr, // 支付签名随机串
          package: options.packageStr, // 统一支付接口返回的prepay_id参数值
          signType: options.signType || 'MD5', // 签名方式，默认为'sha1'，使用新版支付需传入'md5'
          paySign: options.paySign, // 支付签名
          success: () => {
            resolve('success');
          },
          fail: () => {
            resolve('fail');
          },
          cancel: () => {
            resolve('cancel')
          },
        });
      });
    });
  }

  async alipay(options) {
    // alert('阿里支付, 联系帅气的孙大圣')
    const sdk = await getSdk();
    const tradeNO = options.aliAppID;
    // const { partnerID } = '2016091301901253';
    return new Promise((resolve, reject) => {
      sdk.call('tradePay', { tradeNO, bizType: 'trade' }, (result) => {
        if (result.error) {
          reject(result.error);
        }
        resolve(result);
      })
    })
  }
}

const Pay = new PayClass()

export default Pay
