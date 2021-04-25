
import {fetch} from 'whatwg-fetch';
import jsonp from 'fetch-jsonp';
import {getCookie, setCookie} from './cookie';
import router from '../router/index';

const MODE = [
    // 同源
    'same-origin',
    // 跨域不使用cors
    'no-cors',
    // 跨域 默认
    'cors'
];

const sleep = time => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('timeout');
        }, time);
    });
};

export const serialize = params => {
    const esc = encodeURIComponent;
    return Object.keys(params).sort()
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');
};

/**
 * http 请求
 * @param {string} url 请求的地址
 * @param {Object} options
 *    {
 *        method,
 *        mode:
 *            （默认）其他值将不会改变credentials的值.该值的应用场景通常是，发完请求就不管了，不需要使用返回的数据。
 *            'no-cors'：将会设置credentials为same-origin,并且会导致stream.type === 'opaque'，请求的返回为     *             undefined。
 *        contentType,
 *        params = {},
 *        dataType,
 *        credentials <String>
 *            include:（默认: 带cookie）。
 *            '': 不带cookie
 *            关于credentials的意义参考：https://github.com/github/fetch#sending-cookies
 *        timeout: <Number> 默认为5000
 *    }
 * @return {Promise.<void>}
 */
export async function $http(url, options = {}) {
    let request;
    let method = (options.method || 'GET').toUpperCase();
    let mode = options.mode || MODE[2];
    let contentType = options.contentType || '';
    let timeout = options.timeout || 10000;
    let dataType = options.dataType || '';
    // 为'inlcude'时带cookie
    let credentials = options.credentials || 'include';
    let params = options.params || {};
    
    params = serialize(params);
    console.log(params)
    let sendObj = {
        method,
        mode,
        timeout: options.timeout
    };
    if (contentType === 'form') {
        sendObj['headers'] = {
            'Content-type': 'application/json'
        };
    } else if (contentType === 'text') {
        sendObj['headers'] = {
            'Content-type': 'text/plain'
        };
    } else if (contentType === 'multipart') {
        sendObj['headers'] = {
            'Content-type': 'multipart/form-data'
        };
    } else if (!options.body) {
        sendObj['headers'] = {
            'Content-type': 'application/x-www-form-urlencoded'
        };
    }
    
    if (credentials) {
        if (mode === 'no-cors') {
            sendObj['credentials'] = 'same-origin';
        } else {
            sendObj['credentials'] = credentials;
        }
    }
    let xsrf = getCookie('xsrf-token');
    sendObj.headers['X-XSRF-TOKEN'] = xsrf || '';
    // 是否为get请求
    if (method === 'GET') {
        url = params ? url + (url.indexOf('?') === -1 ? '?' : '&') + params : url;
    } else if (contentType === 'json') {
        sendObj.body = JSON.stringify(params);
    } else {
        sendObj.body = params;
    }
    if (options.body) {
        sendObj.body = options.body;
    }
    // 如果是GET并指定了jsonp或者浏览器不支持cors
    if (method === 'GET' && ((dataType && dataType === 'jsonp'))) {
        request = jsonp;
        if (options.callback) {
            sendObj.jsonpCallbackFunction = options.callback;
        }
    } else {
        request = fetch;
    }

    const reqPromise = request(url, sendObj);
    const timePromise = sleep(timeout);
    const stream = await Promise.race([reqPromise, timePromise]);
    if (stream === 'timeout') {
        return Promise.resolve({timeout: true});
    }

    let result;

    if (stream.ok) {
        if (contentType === 'text') {
            result = await stream.text();
        } else {
            result = await stream.json();
        }

        return result;
    } else if (stream.type === 'opaque') {
        // return;
    } else {
        let data = {};
        try {
            if (stream.json) {
                data = await stream.json();
            }
        } catch (error) {
            data = error;
        }
        if (stream && stream.status === 401) {
            router.replace({
                path: '/login',
                query: {
                    u: document.location
                }
            });
            return;
        }
        throwError(url, '返回出错！');
    }
}

function throwError(url, result) {
    throw new Error(result);
}
