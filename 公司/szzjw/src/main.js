// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import vueResource from 'vue-resource'
import App from './App'
import router from './router'
import store from './vuex/store'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/common.scss'
import * as filters from '@/assets/js/filter';
import config from './config/config';
// console.log('main--------------', config);
Vue.use(ElementUI)
Vue.use(vueResource)
Vue.config.productionTip = false

Vue.http.options.emulateJSON = false;
Vue.http.options.crossOrigin = true;
// Vue.http.options.emulateHTTP = true;
Vue.http.options.headers = {
  'Content-Type': 'application/json',
}
let ROOT_URL = '';
if(process.env.NODE_ENV === 'development'){
  ROOT_URL = config.development; // 开发环境
}else{
  ROOT_URL = config.product; // 服务器环境
}
Vue.http.interceptors.push((request, next) => {
  let url = request.url;
  let TOKEN = localStorage.getItem('token');
  // alert(TOKEN)
  if (TOKEN) {
    // 如果请求时TOKEN存在,就为每次请求的headers中设置好TOKEN
    request.headers.set('token', TOKEN);
  }
  if (url) {
    // 如果url存在，拼接host+url;
    request.url = ROOT_URL + url;
  }
  // next((response) => {});
});
// 注册全局过滤器
Object.keys(filters).forEach(item => Vue.filter(item, filters[item]))

// console.log(process.env.NODE_ENV)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
