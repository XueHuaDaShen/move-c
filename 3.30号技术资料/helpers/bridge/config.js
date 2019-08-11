import { fetchData } from ".."
import { getSdk } from './utils';

let isconfig = false;

// 获取微信配置
const config = (opts = {
  url: window.location.href,
  // eslint-disable-next-line
}) => {
  return new Promise(async (resolve, reject) => {
    // 获取当前环境的 sdk
    const sdk = await getSdk();

    if (isconfig) resolve(sdk);

    // 拉取配置
    fetchData('getWXConfig', opts).then((_config) => {
      sdk.config({
        ..._config.data,
        jsApiList: ['scanQRCode', 'addCard', 'openCard', 'hideMenuItems', ..._config.data.jsApiList],
      })
      sdk.ready(() => {
        isconfig = true;
        resolve(sdk)
      })
    }).catch((error) => {
      reject(error)
    })
  })
}

export default config;
