/**
 * @file cookie相关操作
 */

 const getRaw = function (key) {
    let reg = new RegExp('(^| )' + key + '=([^;]*)(;|\x24)');
    let result = reg.exec(document.cookie);

    if (result) {
        return result[2] || null;
    }

    return null;
};

const setRaw = function (key, value, options) {
    options = options || {};
    let expires = options.expires;
    if (typeof options.expires === 'number') {
        expires = new Date();
        expires.setTime(expires.getTime() + options.expires);
    }

    document.cookie = key + '=' + value
        + (options.path ? '; path=' + options.path : '')
        + (expires ? '; expires=' + expires.toGMTString() : '')
        + (options.domain ? '; domain=' + options.domain : '')
        + (options.secure ? '; secure' : '');
};

export const getCookie = function (key) {
    let value = getRaw(key);
    if (typeof value === 'string') {
        value = decodeURIComponent(value);
        return value;
    }
    return null;
};

/**
 * 设置cookie
 * @param {string} key     cookie的名称
 * @param {string} value   cookie的值
 * @param {Object} options
 *        {
 *            domain: 域名，默认为'.iqiyi.com'
 *            path: 路径，默认为'/',
 *            expires: 过期时间（相对时间），毫秒数，
 *            secure: Boolean, 如果为true，则在末尾加上'secure'.默认为false
 *        }
 */
export const setCookie = function (key, value, options) {
    if (options) {
        options.path = options.path || '/';
        options.domain = options.domain || '.baidu.com';
    }

    setRaw(key, encodeURIComponent(value), options);
};

/**
 * 删除cookie
 * @param  {string} key cookie名称
 */
export const delCookie = function (key) {
    if (!Array.isArray(key)) {
        key = [key];
    }

    key.forEach(cookieName => {
        setCookie(cookieName, '0', {
            expires: 0
        });
    });
};
