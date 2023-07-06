import fetch from 'dva/fetch';
import { notification, message } from 'antd';
import { history } from '@umijs/max';
import hash from 'hash.js';
import { Base64 } from 'js-base64';
import { decryptByDES } from 'kx-des';
import RequestForm from '@/utils/RequestForm';
import { clientId, clientSecret } from '../defaultSettings';
import { getToken, removeAll } from './authority';
import logger from '@/utils/logger';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = response => {
  if (
    (response.status >= 200 && response.status < 300) ||
    // 针对于要显示后端返回自定义详细信息的status, 配置跳过
    (response.status == 400 || response.status == 500)
  ) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const checkServerCode = async res => {
  let response;
  if (typeof res === 'string') {
    try {
      response = await JSON.parse(decryptByDES(res));
    } catch (error) {
      response = {};
      message.error('接口请求失败');
    }
  } else {
    // eslint-disable-next-line prefer-destructuring
    response = res;
  }
  if (
    (response.errorCode >= 200 && response.errorCode < 300) ||
    (response.code >= 200 && response.code < 300)
  ) {
    return response;
  }
  if (response.errorCode == 400 || response.code == 400) {
    notification.error({
      message: response.msg || response.errorMsg || codeMessage[response.errorCode],
    });
  } else if (response.errorCode == 401 || response.code == 401) {
    if (window.location.hash.endsWith('/user/login')) return false;
    notification.error({
      message: response.msg || response.errorMsg || codeMessage[response.errorCode],
    });
    removeAll();
    // @HACK
    /* eslint-disable no-underscore-dangle */
    // window.g_app._store.dispatch({
    //   type: 'login/logout',
    // });
    return history.push('/user/login');
  } else if (response.errorCode == 404 || response.code == 404) {
    notification.error({
      message: response.msg || response.errorMsg || codeMessage[response.errorCode],
    });
  } else if (response.errorCode == 500 || response.code == 500) {
    notification.error({
      message: response.msg || response.errorMsg || codeMessage[response.errorCode],
    });
  }
  return response;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  const options = {
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };

  newOptions.headers = {
    ...newOptions.headers,
    // 客户端认证
    Authorization: `Basic ${Base64.encode(`${clientId}:${clientSecret}`)}`,
  };

  const token = getToken();
  if (token) {
    newOptions.headers = {
      ...newOptions.headers,
      // token鉴权
      'Blade-Auth': token,
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      clientId: 10,
    };
  }

  if (newOptions.method == 'POST' || newOptions.method == 'PUT' || newOptions.method == 'DELETE') {
    if (!(newOptions.body instanceof FormData) && !(newOptions.body instanceof RequestForm)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        ...newOptions.headers,
      };
      if (typeof newOptions.body !== 'string') {
        newOptions.body = JSON.stringify(newOptions.body);
      }
    } else if (newOptions.body instanceof RequestForm) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        ...newOptions.headers,
      };
      newOptions.body = newOptions.body.parse();
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  newOptions.startTime = Date.now();
  return fetch(url, newOptions)
    .then(res => {
      // 日志收集
      const time = Date.now();
      logger().api({
        api: res.url,
        success: res.status == 200,
        time,
        code: res.status,
        msg: res.statusText,
        begin: newOptions.startTime,
      });
      return res;
    })
    .then(checkStatus)
    .then(response => cachedSave(response, hashcode))
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method == 'DELETE' || response.status == 204) {
        return response.text();
      }
      return response.json();
    })
    .then(checkServerCode)
    .catch(e => {
      const status = e.name;
      if (status == 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // environment should not be used
      if (status == 403) {
        history.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        history.push('/exception/500');
      }
    });
}
