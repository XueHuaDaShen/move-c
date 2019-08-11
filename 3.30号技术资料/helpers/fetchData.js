/**
 * by chenyao
 */

import 'whatwg-fetch';
import Cookie from 'js-cookie'
import { localStorage, defaultMpID, ua } from "."
import utlUtils from "./url";
import MessageBox from '../components/MessageBox'
import { delay, uuid } from './utils';
import getApiConfig from './callserver';
import location from "./bridge/location"

import mp from './bridge/mp';


/**
 * 将对象参数转化为URL参数
 * @param  {object} params 参数对象
 * @return {string}        URL参数字符串
 */
export const genUrlParams = (params = {}) => {
  const url = Object.keys(params).filter(key => params[key]).map((key) => {
    const val = params[key];
    let encodeUrl = '';
    if (Object.prototype.toString.call(val).indexOf('String') !== -1) {
      encodeUrl = `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
    } else {
      encodeUrl = `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(val))}`;
    }
    return encodeUrl;
  }).join('&');
  return url;
};

export const getLocation = async () => {
  try {
    const pos = await location.getLocation();
    return {
      lng: pos.longitude ? pos.longitude : '',
      lat: pos.latitude ? pos.latitude : '',
    }
  } catch (e) {
    return {
      lat: 39.939766,
      lng: 116.34656,
    }
  }
}


/**
 * 将对象参数转化为POST参数
 * @param  {string} type   数据格式('json'/'form')
 * @param  {object} params 参数对象
 * @return {string|object} 参数字符串或FormData对象
 */
export const genPostParams = (type, params = {}) => {
  if (type === 'JSON') return JSON.stringify(params);
  if (type === 'FORM') {
    // eslint-disable-next-line no-undef
    const formData = new FormData();
    Object.keys(params).forEach((key) => {
      formData.append(key, params[key]);
    });
    return formData;
  }
  return genUrlParams(params);
};

/**
 * 组装 fetch 函数的调用参数
 * @param  {[type]} api    [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export const getContentType = (type) => {
  let contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
  if (type === 'JSON') contentType = 'application/json;charset=UTF-8';
  if (type === 'FORM') contentType = '';
  return contentType ? { 'Content-Type': contentType } : {};
};

/**
 * 解析 url 中的参数
 * @param {string} url  在 callserver 中填写的接口地址
 * @param {object} params  从 params 中解析出 restUrl 中所需的参数
 */
export const parseRestUrl = (_url, _params = {}) => {
  const urlKeys = [];
  // 正则匹配并替换的参数
  const restUrl = _url.replace(/[:]{1}[^/.]*/ig, (item) => {
    const key = item.substr(1);
    if (!key || !_params[key]) throw new Error(`${item} is not defined`);

    urlKeys.push(key);
    return _params[key];
  });

  // 过滤掉 restUrl 总匹配的参数
  const restParams = Object.keys(_params)
    .filter(key => urlKeys.indexOf(key) === -1)
    .reduce((ret, key) => {
      const $ret = ret;
      $ret[key] = _params[key];
      return $ret;
    }, {});

  const hasParams = JSON.stringify(restParams) === '{}' ? 0 : restParams;
  return { restUrl, restParams, hasParams };
};

/**
 * 组装 fetch 函数的调用参数
 * @param  {[type]} api    [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export const genFetchArguments = async (api, params) => {
  const uid = uuid();
  const { url, options: { method, type, credentials } } = getApiConfig(api);
  // const { restUrl, restParams, hasParams } = parseRestUrl(url, params);
  const $method = method.toUpperCase();
  const $type = type.toUpperCase();
  const $url = $method === 'GET' ? `${url}?${genUrlParams(params)}` : url
  // const $url = $method === 'GET' && hasParams ? `${restUrl}?${genUrlParams(restParams)}` : restUrl;
  const ismp = await mp.isMp();
  const headers = {
    ...getContentType($type),
    'auth-type': 10,
    'X-B3-TraceId': uid,
    'x-b3-spanid': uid,
  };

  if (ua === 'alipay') {
    headers['auth-type'] = 30;
  }

  // 新版小程序重写header
  if (localStorage.get('mp_type') === 'new') {
    headers['auth-type'] = Number(localStorage.get('cType'))
  }

  if (ismp) {
    headers['x-appid'] = Cookie.get('x-appid');
  }

  const body = $method !== 'GET' ? { body: genPostParams($type, params) } : {};
  return { url: $url, method: $method, headers, credentials, ...body };
};

/**
 * 解析后台响应是否正常
 * @param  {Object} rsp 响应
 * @return {Object} { success:Boolean, code:String, msg:String }
 */
export const parseResponseJson = (json) => {
  const success = json.success === undefined ? json.code === '000' : json.success;
  const code = json.code;
  const msg = json.msg || json.message;
  return { success, code, msg };
};

/**
 * 接口请求通道锁
 */
// eslint-disable-next-line
export const channelUtils = (function () {
  let $choked = [];
  return {
    lock: (name, fn) => {
      const channel = $choked.filter(ch => ch.name === name)[0];
      if (channel) return channel.content;
      const content = fn();
      $choked.push({ name, content });
      return content;
    },
    unlock: (name) => {
      $choked = $choked.filter(ch => ch.name !== name);
    },
  };
})();

/**
 * 封装的 fetch 方法
 * !!This method can only be called on client side!!
 *
 * @param  {String}   api     API name, should be defined in './callserver.jsx'.
 * @param  {Object}   params  Request parameters.
 * @param  {Any}      cache   Use local cache without a remote request.
 * @param  {Object}   options See as follows.
 * @return {Promise}
 */

// eslint-disable-next-line
const appendGroupID = (cururl, api) => {
  const { query2Dict } = utlUtils;


  const pageDict = query2Dict(window.location.href);
  const cururlDict = query2Dict(cururl);
  const preqs = utlUtils.genUrlParams(cururlDict);

  cururlDict.groupID = pageDict.g || pageDict.groupID || '';

  const qs = utlUtils.genUrlParams(cururlDict);

  if (!preqs) {
    if (cururl.indexOf('?') !== -1) {
      return `${cururl}${qs}`;
    }

    return `${cururl}?${qs}`;
  }
  return cururl.replace(`?${preqs}`, `?${qs}`);
}

export const fetchData = (api, params, cache, {
  hsh = false, // 煌上煌授权
  _delay = 0, // delay for cached data
  path = '', // path for response
  throttle = false, // wait time for frequent ajax request; pass false to turn off
  disablePrompt = false,
  loginCallback = false,
} = {}) => {
  const channel = `${api}_${JSON.stringify(params)}`;
  const actionFn = () => new Promise(async (resolve, reject) => {
    // use cache
    if (cache !== undefined && cache !== null) {
      delay(() => {
        resolve(cache);
        channelUtils.unlock(channel);
      }, _delay);
    } else {
      const { url, ...options } = await genFetchArguments(api, params);
      const finalUrl = appendGroupID(url, api)

      fetch(finalUrl, options).then((response) => {
        // unlock channel
        delay(channelUtils.unlock, throttle, channel);

        if (response.status >= 200 && response.status < 300) {
          return response.json();
        }
        const error = new Error(response.statusText);
        error.response = response;

        MessageBox.alert('服务器正在努力工作，请稍后', '提示');
        throw error;

        // eslint-disable-next-line
      }).then((json) => {
        const { code, msg } = parseResponseJson(json);

        if (code.indexOf('grpcError') !== -1) {
          if (!path) {
            resolve(json);
          } else {
            const paths = path.split('.');
            const data = paths.reduce((ret, item) => {
              if (!ret) return ret;
              return ret[item];
            }, json);
            resolve(data);
          }
        } else {
          switch (code) {
            // 请求成功
            case '000':
              if (!path) {
                resolve(json);
              } else {
                const paths = path.split('.');
                const data = paths.reduce((ret, item) => {
                  if (!ret) return ret;
                  return ret[item];
                }, json);
                resolve(data);
              }
              break;
            // 需授权
            case '2211108001':
            // eslint-disable-next-line
            case '2211108006':
              if (hsh) {
                if (!loginCallback) {
                  MessageBox({
                    title: '提示',
                    message: '授权已过期, 请重新授权',
                    showCancelButton: false,
                    closeOnClickModal: false,
                  }).then(() => {
                    const getUrl = () => {
                      const queryUrl = utlUtils.filterQuery(window.location.href, ['code', 'state', 'auth_code'])
                      return decodeURIComponent(`${window.location.protocol}//${window.location.host}${window.location.pathname}?${queryUrl}`)
                    }
                    window.location.href = getUrl();
                  })
                } else {
                  loginCallback();
                }
                return;
              }

              const _query = utlUtils.query2Dict(window.location.href);
              const mpid = _query.mpid || _query.mpID || defaultMpID;
              const _groupID = _query.groupID || _query.g || '';
              // eslint-disable-next-line
              window.location.href = `/mauth/caa/recordAuth?callBack=${encodeURIComponent(window.location.href)}&appKey=${mpid}&groupID=${_groupID}&cType=${options.headers['auth-type']}`;

              break;
            case '2111100008':
              // 授权失败
              window.location.href = '/newm/warrantFaild';
              break;
            // 请求失败
            default:
              if (!disablePrompt && msg) {
                MessageBox.alert(msg, '提示');
              }

              reject({ code, msg, response: json })
          }
        }
      }).catch((error) => {
        reject(error);
      });
    }
  });

  if (throttle === false) return actionFn();
  return channelUtils.lock(channel, actionFn);
};

export default fetchData;
