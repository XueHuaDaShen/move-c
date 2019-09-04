/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/**
|--------------------------------------------------
| 封装的异步请求函数
|--------------------------------------------------
*/
import axios from 'axios';
import { JrMessage } from 'ui';
import { SUCCESS } from './http-code';
import response from './response';
import ieVer from './ie-version';
import config from '../config/config';

const AJAX_TIMEOUT = 'ECONNABORTED';

let ROOT_URL = '';
if (process.env.NODE_ENV === 'development') {
  ROOT_URL = config.development;
} else {
  ROOT_URL = config.product;
}

const newRequest = (url, params, method, onError) =>
  new Promise((resolve, reject) => {
    let postData = {};
    const token = localStorage.getItem('token');
    // alert(ieVer());
    const isGetData =
      url !== '/admin/login' && url !== '/admin/register' ? token || '' : '';
    if (url === 'http://123.57.236.72/gateway/v1.json') {
      postData = {
        url,
        method,
        timeout: 60000,
        // withCredentials: false,
        headers: {
          // 'Content-Type': 'application/json;charset=utf-8',
          // token: isGetData,
        },
        ...params,
      };
    } else {
      postData = {
        url: ROOT_URL + url,
        method,
        timeout: 60000,
        withCredentials: false,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          token: isGetData,
        },
        ...params,
      };
    }
    // alert(token);
    // alert(isGetData);
    // alert(token === isGetData);
    axios(postData)
      .then(({ data }) => {
        const { code, message } = data;
        // if (code === 401 || code === 403) {
        //   reject(new Error('没有权限，请重新登录！'));
        //   localStorage.clear();
        //   response.push('/');
        // }
        if (code === 101) {
          JrMessage.error('用户未登录');
          localStorage.clear();
          response.push('/');
        }
        if (code === 102) {
          JrMessage.error('token 错误');
          localStorage.clear();
          response.push('/');
        }
        if (code === 103) {
          JrMessage.error('用户不存在');
        }
        if (code === 104) {
          JrMessage.error('密码错误');
        }
        if (code === 105) {
          JrMessage.error('用户名已存在');
        }
        if (code === 106) {
          JrMessage.error('新密码与旧密码相同');
        }
        if (code === 107) {
          JrMessage.error('用户被禁用');
          localStorage.clear();
          response.push('/');
        }
        if (code === 108) {
          JrMessage.error('token 过期');
          localStorage.clear();
          response.push('/');
        }
        if (code === 201) {
          JrMessage.success('离线保存成功');
        }
        if (code === 301) {
          JrMessage.error('参数错误');
        }
        if (code === 302) {
          JrMessage.error('参数或配置未找到');
        }
        if (code === 302) {
          JrMessage.error('数据保存失败');
        }
        if (code === 401) {
          JrMessage.error('网络连接失败或超时');
        }
        if (code === 500) {
          JrMessage.error('服务器内部错误');
        }
        // if (code !== SUCCESS) {
        //   if (onError) {
        //     onError();
        //   } else {
        //     JrMessage.error(message);
        //     // reject(message);
        //   }
        // }
        resolve(data);
      })
      .catch(error => {
        onError();
        if (error.code === AJAX_TIMEOUT) {
          JrMessage.error('请求超时，请重试');
        } else {
          JrMessage.error('请求失败，请重试');
          throw error;
        }
      });
  });

const request = ({ url = '', param = {}, method = 'get', onError }) => {
  const Method = method.toLowerCase();
  if (Method === 'post') {
    return newRequest(url, { data: param }, 'post', onError);
  }
  if (Method === 'put') {
    return newRequest(url, { data: param }, 'put', onError);
  }
  if (Method === 'delete') {
    return newRequest(url, { params: param }, 'delete', onError);
  }
  return newRequest(url, { params: param }, 'get', onError); // 默认 Get 请求
};

request.get = (url, param, onError) =>
  request({ method: 'get', url, param, onError });
request.post = (url, param, onError) =>
  request({ method: 'post', url, param, onError });
request.put = (url, param, onError) =>
  request({ method: 'put', url, param, onError });
request.delete = (url, param, onError) =>
  request({ method: 'delete', url, param, onError });

export default request;
