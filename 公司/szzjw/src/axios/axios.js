/* eslint-disable no-unused-expressions */
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
import { Message } from 'element-ui';
import config from '../config/config';

// Message.config({
//   duration: 1500,
//   // maxCount: 1,
// });
const message = {
  error: function(txt) {
    Message.error({
      message: txt,
      duration: 1000
    })
  }
}
const AJAX_TIMEOUT = 'ECONNABORTED';

let ROOT_URL = '';
if (process.env.NODE_ENV === 'development') {
  ROOT_URL = config.development;
} else {
  ROOT_URL = config.product;
}

const newRequest = (url, params, method, onError, vm) =>
  new Promise((resolve, reject) => {
    let postData = {};
    const token = localStorage.getItem('token');
    // alert(token);
    // alert(ieVer());
    const isGetData =
      (url !== '/admin/login' && url !== '/admin/register') ? (token || '') : '';
    postData = {
      url: ROOT_URL + url,
      // url: 'http://192.168.111.67:8080/api/v1'+url,
      method,
      timeout: 60000,
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
        token: isGetData,
      },
      ...params,
    };
    axios(postData)
      .then(({ data }) => {
        const { code, msg } = data;
        // if (code === 101) {
        //   message.error('用户未登录');
        //   localStorage.clear();
        //   vm.$router.push({
        //     name: 'login'
        //   });
        // }
        // if (code === 102) {
        //   message.error('token 错误');
        //   localStorage.clear();
        //   vm.$router.push({
        //     name: 'login'
        //   });
        // }
        if (code === 103) {
          message.error('用户不存在');
        }
        if (code === 104) {
          message.error('密码错误');
        }
        if (code === 105) {
          message.error('用户名已存在');
        }
        if (code === 106) {
          message.error('新密码与旧密码相同');
        }
        if (code === 107) {
          message.error('用户被禁用');
          localStorage.clear();
          vm.$router.push({
            name: 'login'
          });
        }
        if (code === 108) {
          message.error('token 过期');
          localStorage.clear();
          vm.$router.push({
            name: 'login'
          });
        }
        if (code === 109) {
          message.error('身份证已存在');
        }
        if (code === 301) {
          message.error('参数错误');
        }
        if (code === 302) {
          message.error('参数或配置未找到');
        }
        if (code === 303) {
          message.error('数据保存失败');
        }
        if (code === 304) {
          message.error('同步记录到远程失败');
        }
        if (code === 310) {
          message.error('虹膜注册成功');
        }
        if (code === 311) {
          message.error('虹膜已存在');
        }
        if (code === 312) {
          message.error('证件信息不一致');
        }
        if (code === 313) {
          message.error('证件已注册');
        }
        if (code === 314) {
          message.error('证件已注册，虹膜未找到');
        }
        if (code === 315) {
          message.error('未知注册错误');
        }
        if (code === 320) {
          message.error('识别成功');
        }
        if (code === 321) {
          message.error('识别失败');
        }
        if (code === 322) {
          message.error('未知识别错误');
        }
        if (code === 330) {
          message.error('核验成功');
        }
        if (code === 331) {
          message.error('核验失败');
        }
        if (code === 332) {
          message.error('证件信息不一致');
        }
        if (code === 333) {
          message.error('未知核验错误');
        }
        if (code === 340) {
          message.error('虹膜内存与数据库中信息不一致');
        }
        if (code === 350) {
          message.error('设备不存在');
        }
        if (code === 351) {
          message.error('设备状态异常');
        }
        if (code === 400) {
          message.error('错误');
        }
        if (code === 401) {
          message.error('网络连接失败或超时');
        }
        if (code === 500) {
          message.error('服务器内部错误');
        }
        // if (code !== SUCCESS) {
        //   if (onError) {
        //     onError();
        //   } else {
        //     message.error(message);
        //     // reject(message);
        //   }
        // }
        resolve(data);
      })
      .catch(error => {
        onError && onError();
        if (error.code === AJAX_TIMEOUT) {
          message.error('请求超时，请重试');
        } else {
          message.error('请求失败，请重试');
          throw error;
        }
      });
  });

const request = ({ url = '', param = {}, method = 'get', onError, vm }) => {
  const Method = method.toLowerCase();
  if (Method === 'post') {
    return newRequest(url, { data: param }, 'post', onError, vm);
  }
  if (Method === 'put') {
    return newRequest(url, { data: param }, 'put', onError, vm);
  }
  if (Method === 'delete') {
    return newRequest(url, { params: param }, 'delete', onError, vm);
  }
  return newRequest(url, { params: param }, 'get', onError, vm); // 默认 Get 请求
};

request.get = (url, param, onError, vm) =>
  request({ method: 'get', url, param, onError, vm });
request.post = (url, param, onError, vm) =>
  request({ method: 'post', url, param, onError, vm });
request.put = (url, param, onError, vm) =>
  request({ method: 'put', url, param, onError, vm });
request.delete = (url, param, onError, vm) =>
  request({ method: 'delete', url, param, onError, vm });

export default request;
