import { ua } from '..';

const loadWechat = () => import(/* webpackChunkName: "jssdk" */ '../../assets/js/jssdk');
const loadAlipay = () => import(/* webpackChunkName: "apsdk" */ '../../assets/js/apsdk');

// 根据环境异步获取 sdk 脚本
// eslint-disable-next-line
const sdk = () => {
  let rs = null;

  return async () => {
    if (rs) return rs.default;

    if (ua === 'wechat') {
      rs = await loadWechat();
      return rs.default;
    }
    if (ua === 'alipay') {
      rs = await loadAlipay();
      return rs.default;
    }
    return null;
  };
};

export const getSdk = sdk();

export const getQQMap = () => {
  // 因为本VUE项目要在https环境下使用腾讯地图 故不能使用3.0版本;
  const key = 'TPJBZ-UJSKK-LLCJS-AKHGX-7IDNF-RWFKP&referer=wx';
  const BMap_URL = `https://map.qq.com/api/js?v=2.exp&callback=init&key=${key}`;
  return new Promise((resolve) => {
    window.init = () => {
      resolve(qq);
    };

    // 插入script脚本
    const scriptNode = document.createElement('script');
    scriptNode.setAttribute('type', 'text/javascript');
    scriptNode.setAttribute('src', BMap_URL);
    document.body.appendChild(scriptNode);
  });
}

