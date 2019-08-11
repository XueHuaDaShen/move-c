import { ua } from "..";
import config from './config';
import { getSdk } from './utils';

class ScanClass {
  // 扫码
  async exec(options = {
    needResult: 0,
    scanType: ['qrCode', 'barCode'],
  }) {
    return this[ua](options);
  }

  async wechat(options) {
    const { needResult } = options;
    const sdk = await config()

    return new Promise((resolve, reject) => {
      sdk.scanQRCode({
        needResult, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: (res) => {
          resolve(res);
        },
        fail: (e) => {
          reject(e);
        },
      });
    });
  }

  async alipay(options) {
    // 操作类型actionType: 'scan', 'scanAndRoute', 'route'
    const { type = 'qr', actionType = 'scanAndRoute' } = options;
    const sdk = await getSdk();
    return new Promise((resolve) => {
      sdk.call('scan', { type, actionType }, (result) => {
        resolve(result)
      })
    })
  }
}

const Scan = new ScanClass()

export default Scan
