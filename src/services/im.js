import axios from 'axios';
import { notification } from 'antd';
// axios.defaults.baseURL = "/";

const newAxios = axios.create({
  baseURL: '/node',
  timeout: 0,
});

function randomString(length) {
  let res = '';
  const chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  for (let i = 0; i < length; i += 1) {
    const id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }
  return res;
}

newAxios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.error(error);
  }
);

// 响应拦截
newAxios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response);
    }
    notification.error({
      description: '出了一点小问题',
      message: '错误',
    });
    return Promise.reject(new Error(false));
  },
  error => {
    notification.error({
      description: '出了一点问题',
      message: '错误',
    });
    return Promise.reject(new Error(false));
  }
);

function im(method, url, opts = {}, type) {
  const random = randomString(32);
  const data = {
    method,
    url,
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/json;charset=UTF-8',
      // appId: "20191105",
      // tId: 2,
      appId: localStorage.getItem('appId') || '20200239',
      tId: localStorage.getItem('tId') || 54,
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      clientId: 10,
    },
  };
  if (method === 'post') {
    data.data = { ...opts, callback: random };
  } else if (method === 'get') {
    data.params = { ...opts, callback: random };
  }
  if (type === 'form') {
    data.headers['Content-Type'] = 'application/json;charset=UTF-8';
    data.params = opts;
  }
  return new Promise((resolve, reject) => {
    newAxios(data)
      .then(res => {
        const reg = new RegExp(/\{.*\}/);
        if (res.data.search(`${random}`) == -1) {
          reject(new Error(false));
        }
        if (reg.exec(res.data) != null) {
          resolve(JSON.parse(reg.exec(res.data)[0]));
        } else {
          reject(new Error(false));
        }
        // if (!res.data && res.config.url === 'https://kxgshop.oss-cn-hangzhou.aliyuncs.com') {
        //   resolve(res); //oss图片上传兼容
        // } else {
        //   if (res.data.success) {
        //     resolve(res.data);
        //   } else {
        //     message.error(res.data.errorMsg || res.data.msg);
        //     reject(false);
        //   }
        // }
      })
      .catch(err => {
        reject(new Error(false));
      });
  });
}

// 获取历史联系人的json数据
export const hisLinkmanJson = data => im('get', '/seller/his_linkman/json', data);

// 获取单个联系人信息
export const getLinkMan = data => im('get', '/seller/get_link_man', data);

// 获取单个联系人聊天信息
export const hisMsg = data => im('get', '/seller/his_msg', data);

// 卖家发送消息
export const send = data => im('get', '/seller/send', data);

// 买家删除联系人
export const delLinkMan = data => im('get', '/seller/del_link_man', data);

// 长连接，监听消息
export const sub = data => im('get', '/seller/sub', data);

// 心跳检测联系人在线情况
export const heartlm = data => im('get', '/seller/heartlm', data);

// 获取客服头像、通知
export const getAvatarMsg = data => im('get', '/seller/get_avatar_msg', data);

// 设置客服头像、通知
export const setAvatarMsg = data => im('get', '/seller/set_avatar_msg', data);
