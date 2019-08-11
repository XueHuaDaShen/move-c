import { ua } from "..";
import { getSdk } from './utils';

// 关闭页面
class CloseWindowClass {
  async exec(options = {}) {
    return this[ua](options);
  }

  async wechat(options) {
    const sdk = await getSdk()

    sdk.closeWindow(options);
  }

  async alipay(options) {
    // alert('支付宝关页面, 联系潇洒的孙大圣')
    const sdk = await getSdk();
    const { closeActionType = 'exitSelf', animated = true } = options;
    sdk.call('exitApp', { closeActionType, animated })
  }
}

const CloseWindow = new CloseWindowClass();

export default CloseWindow;
