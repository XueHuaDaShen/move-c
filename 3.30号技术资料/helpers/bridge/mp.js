import { url, ua } from '..';
import { getSdk } from './utils';

class MpClass {
  // 获取地理位置
  async isMp() {
    const sdk = await getSdk();
    return new Promise((resolve) => {
      if (ua === 'wechat') {
        sdk.miniProgram.getEnv((res) => {
          resolve(res.miniprogram)
        })
      } else {
        resolve(false);
      }
    })
  }

  async navigateTo(options) {
    const sdk = await getSdk();
    sdk.miniProgram.navigateTo(options)
  }

  async switchTab(options) {
    const sdk = await getSdk();
    sdk.miniProgram.switchTab(options)
  }

  async reLaunch(options) {
    const sdk = await getSdk();
    sdk.miniProgram.reLaunch(options)
  }

  async postMessage(options) {
    const sdk = await getSdk();
    sdk.miniProgram.postMessage(options);
  }

  async navigateBack() {
    const sdk = await getSdk();
    sdk.miniProgram.navigateBack();
  }

  toPay(query) {
    this.navigateTo({
      url: `/pages/order/newm_pay?${url.genUrlParams(query)}`,
    })
  }
}

const Mp = new MpClass()

export default Mp
