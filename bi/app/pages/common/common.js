import createHistory from 'history/createHashHistory'
import request from 'axios';
import {Config} from '../../config';

const history = createHistory();

// export const getData = (url, param) => {
//     return (
//         axios.get(`${url}`)
//     )
// }
//
// export const postData = (url, param) => {
//     return (
//         axios.post(`${url}`, param)
//     )
// }
export function Axios(method, url, params, headers, callback, fallback) {
    request.defaults.baseURL = Config.apiUrl;
    if (method === 'get') {
        request({
            method: method,
            url: url,
            params: params,
            headers: headers,
        }).then((response) => {
            let result = response.data;
            let code = result.returncode;
            const handleResult = handlerErr(code, function () {
                Axios(method, url, params, headers, callback, fallback)
            });
            if (handleResult === true) {
                callback && callback(result.data);
            } else if (handleResult === false) {
                return;
            } else if (fallback) {
                fallback(handleResult);
            }

        }).catch((thrown) => {
            if (request.isCancel(thrown)) {
                console.warn('Request canceled', thrown.message);
            } else {
                console.error(thrown);
            }
        });
    } else if (method === 'post') {
        request({
            method: method,
            url: url,
            data: params,
            headers: headers,
        }).then((response) => {
            let result = response.data;
            let code = result.returncode;
            const handleResult = handlerErr(code, function () {
                Axios(method, url, params, headers, callback, fallback)
            });
            if (handleResult === true) {
                callback && callback(result.data);
            } else if (handleResult === false) {
                return;
            } else if (fallback) {
                fallback(handleResult);
            }
        }).catch((thrown) => {
            if (request.isCancel(thrown)) {
                console.warn('Request canceled', thrown.message);
            } else {
                console.error(thrown);
            }
        });
    }
}
export function Axios2(method, url, params, headers, callback, fallback) {
    request.defaults.baseURL = Config.apiUrl2;
    if (method === 'get') {
        request({
            method: method,
            url: url,
            params: params,
            headers: headers,
        }).then((response) => {
            let result = response.data;
            let code = result.returncode;
            const handleResult = handlerErr(code, function () {
                Axios2(method, url, params, headers, callback, fallback)
            });
            if (handleResult === true) {
                callback && callback(result.data);
            } else if (handleResult === false) {
                return;
            } else if (fallback) {
                fallback(handleResult);
            }

        }).catch((thrown) => {
            if (request.isCancel(thrown)) {
                console.warn('Request canceled', thrown.message);
            } else {
                console.error(thrown);
            }
        });
    } else if (method === 'post') {
        request({
            method: method,
            url: url,
            data: params,
            headers: headers,
        }).then((response) => {
            let result = response.data;
            let code = result.returncode;
            const handleResult = handlerErr(code, function () {
                Axios2(method, url, params, headers, callback, fallback)
            });
            if (handleResult === true) {
                callback && callback(result.data);
            } else if (handleResult === false) {
                return;
            } else if (fallback) {
                fallback(handleResult);
            }
        }).catch((thrown) => {
            if (request.isCancel(thrown)) {
                console.warn('Request canceled', thrown.message);
            } else {
                console.error(thrown);
            }
        });
    }
}
const loginReq = request.create({
    baseURL: Config.loginUrl
});

const refreshReq = request.create({
    baseURL: Config.loginUrl
});


export function AxiosLogin(method, url, params, headers, callback, fallback) {
    if (method === 'get') {
        loginReq({
            method: method,
            url: url,
            params: params,
            headers: headers,
        }).then((response) => {
            let result = response.data;
            let code = result.returncode;
            const handleResult = handlerErrLogin(code);
            if (handleResult === true) {
                callback && callback(result.data);
            } else if (handleResult === false) {
                return;
            } else if (fallback) {
                fallback(handleResult);
            }
        }).catch((thrown) => {
            if (request.isCancel(thrown)) {
                console.warn('Request canceled', thrown.message);
            } else {
                console.error(thrown);
            }
        });
    } else if (method === 'post') {
        loginReq({
            method: method,
            url: url,
            data: params,
            headers: headers,
        }).then((response) => {
            let result = response.data;
            let code = result.returncode;
            const handleResult = handlerErrLogin(code);
            if (handleResult === true) {
                callback && callback(result.data);
            } else if (handleResult === false) {
                return;
            } else if (fallback) {
                fallback(handleResult);
            }
        }).catch((thrown) => {
            if (request.isCancel(thrown)) {
                console.warn('Request canceled', thrown.message);
            } else {
                console.error(thrown);
            }
        });
    }

}

function handlerErr(code, cb) {
    let suc = false;
    if (code) {
        if (code === 200) {
            suc = true;
        } else if (code === 104) {
            refreshToken(cb);
        } else if (code === 303) {
            return {
                code: 303,
                // err: '服务器内部错误'
                err: 'An exception occurred in the service'
            }
        } else if (code === 304 || code === 106 || code === 103 || code === 102 ) {
            // alert(code);
            // alert('登录已过期，请重新登录');
            alert('The account has expired. Please login again！');
            history.push('/');
        } else if (code === 109) {
            // alert(code);
            // alert('您没有权限查看此内容，请联系管理员！');
            alert('you don\'t have the permission to access');
            history.push('/');
        } else {
            console.log('returncode-----' + code);
            return {
                code: code,
                err: 'other errors'
            }
        }
    } else {
        alert("request error");
    }
    return suc;
}


function handlerErrLogin(code) {
    let suc = false;
    if (code) {
        if (code === 200) {
            suc = true;
        } else if (code === 103) {
            alert('The account has expired. Please login again！');
            history.push('/');
        } else if (code === 305) {
            return {
                code: 305,
                err: 'the password is not correct'
            }
        } else if (code === 303) {
            return {
                code: 303,
                err: 'the server has problem...'
            }
        } else if (code === 304) {
            // this.loginAgain(that);
            return {
                code: 304,
                err: 'The user does not exist'
            }
        } else if (code === 306) {
            return {
                code: 306,
                err: 'you don\'t have the permission to access'
            }
        } else {
            console.log('returncode-----' + code);
        }
    } else {
        alert("An exception occurred in the service");
    }
    return suc;
}

export function getToken(bearer, userid, username, cb) {
    Axios(
        'get',
        '/authorise',
        {},
        {
            "authorization": bearer
        },
        function (data) {
            let code = data.code;
            AxiosLogin(
                'post',
                '/oauth/token',
                {
                    code: code
                },
                {
                    "authorization": bearer
                },
                function (data) {
                    cb();
                    localStorage.setItem('BI-A-TOKEN', data.access_token);
                    localStorage.setItem('BI-R-TOKEN', data.refresh_token);
                    localStorage.setItem('BI-USERNAME', username);
                    localStorage.setItem('BI-USERID', userid);
                    history.push('/app');

                },
                function (err) {
                    console.log(err);
                }
            )
        }
    )
}

function refreshToken(cb) {
    refreshReq({
        method: 'post',
        url: '/oauth/refreshToken',
        data: {
            refresh_token: localStorage.getItem('BI-R-TOKEN')
        }
    }).then((data) => {
        console.log(data);
        if (data.data.returncode === 200) {
            localStorage.setItem('BI-A-TOKEN', data.data.data.access_token);
            localStorage.setItem('BI-R-TOKEN', data.data.data.refresh_token);
            // alert(cb);
            cb();
        } else {
            alert(data.data.returncode);
        }
    }).catch((err) => {
        console.log(err);
    })
}


