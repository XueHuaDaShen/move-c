import request from 'axios'

let ROOT_URL = '';
if(process.env.NODE_ENV === 'development'){
  ROOT_URL = 'http://192.168.111.67:8010/api/v1'; // 开发环境
}else{
  ROOT_URL = 'http://192.168.111.237:8010/api/v1'; // 服务器环境
}
request.defaults.baseURL = ROOT_URL

export default {
  http (method, url, params, callback, fallback) {
    var header = {
      token: localStorage.getItem('token')
    }
    // console.log(header)
    var o = {}
    if (method === 'get') {
      o = {
        method: method,
        headers: header,
        url: url,
        params: params
      }
    } else if (method === 'post') {
      o = {
        method: method,
        headers: header,
        url: url,
        data: params
      }
    }
    request(o).then((res) => {
      let result = res.data
      callback(result)
    }).catch(error => {
      fallback(error)
    })
  }
}
