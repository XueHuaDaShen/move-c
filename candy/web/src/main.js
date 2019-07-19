// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import vueResource from 'vue-resource';
import router from './router'
import store from './vuex/store'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import thLocale from 'element-ui/lib/locale/lang/th'
import '../static/font-pingfang/font-pingfangsc.css';
import '../static/font-pslx/pslx.css';
import './scss/common.scss';
import './scss/element-variables.scss';
import '../static/icon-font/iconfont.css';

import language from './language/language'
import config from '@/http/config';

Vue.use(vueResource)
Vue.use(VueI18n)
const messages = {
  th: {
    message: language.th.message,
    ...thLocale // 或者用 Object.assign({ message: 'hello' }, thLocale)
  },
  zh: {
    message: language.zh.message,
    ...zhLocale // 或者用 Object.assign({ message: '你好' }, zhLocale)
  }
}
let locale = localStorage.getItem('candy-locale');
const defaultLanguage = 'zh';
// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: locale || defaultLanguage, // set locale
  messages, // set locale messages
})

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})


Vue.config.productionTip = false

Vue.http.options.emulateJSON = false;
Vue.http.options.crossOrigin = true;
// Vue.http.options.emulateHTTP = true;

Vue.http.interceptors.push((request, next) => {
  let TOKEN = localStorage.getItem('candy-token');
  let url = request.url;
  if (TOKEN) {
    // 如果请求时TOKEN存在,就为每次请求的headers中设置好TOKENs
    request.headers.set('authorization', TOKEN);
  }
  if (url) {
    // 如果url存在，拼接host+url;
    request.url = config.login + url;
  }
  next((response) => {
    // console.log('response', response);
    // let status = response.body.returncode;
    // if (TOKEN) {
    //   if (status == 103 || status == 106 || status == 101) {
    //     // alert('token过期，请重新登录');
    //     // var isOk = confirm('请重新登录')
    //     // if (isOk) {
    //     //   location.href = '/login'
    //     // }
    //     setTimeout(function () {
    //       localStorage.removeItem('candy-login');
    //       localStorage.removeItem('candy-cash');
    //       localStorage.removeItem('candy-cash_credit');
    //       localStorage.removeItem('candy-loginname');
    //       localStorage.removeItem('candy-firstname');
    //       localStorage.removeItem('candy-lastname');
    //       localStorage.removeItem('candy-token');
    //       localStorage.removeItem('candy-loginid');
    //       sessionStorage.removeItem('th_tag_index');
    //       sessionStorage.removeItem('th_tag_url');
    //       sessionStorage.removeItem('noticeShowed');
    //       window.location.reload(true);
    //     }, 2000);
    //   }
    // }
    // return response;
  });
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: {
    App
  },
  template: '<App/>'
})
