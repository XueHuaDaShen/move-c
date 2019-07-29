/**
 * Created by wangleping on 2017/5/2.
 */
import request from 'axios';

export default function requestMiddleware({dispatch}) {
    return (next) => (action) => {
        const {type, url, data, callback, fallback, mh} = action;

        if (!url) {
            return next(action);
        }

        let method = data ? 'post' : 'get';
        if (mh) {
            method = mh;
        }
        /* request without Promise but can abort */
        // todo: CancelToken
        let source = request.CancelToken.source();
        let param = data || {};
        let config = {
            cancelToken: source.token
        };
        request[method](url, param, config).then((response) => {
            let result = response.data;
            let code = result.meta && result.meta.code;
            let redirect = window.global.redirect;
            if (code === 200) {
                // dispatch({
                //     ...result.data,
                //     type: type
                // });
                callback && callback(result.data);
            } else if (code === 401) {
                alert('Please Login!');
                if (location.href.indexOf(redirect) === -1) {
                    window.location = redirect + '?redirect=' + encodeURIComponent(location.href);
                }
            } else if (code === 403) {
                alert('You do not have permission!');
                window.location = redirect;
            } else {
                console.error(result.meta.errmsg || result.meta.error_message);
                alert('当前数据请求失败，请检查提交参数是否正确');
                fallback && fallback(result.meta);
            }
        }).catch((thrown) => {
            if (request.isCancel(thrown)) {
                console.warn('Request canceled', thrown.message);
            } else {
                console.error(thrown);
                alert('服务器响应错误，请稍后重试');
                fallback && fallback();
            }
        });
        return source;
    };
}
