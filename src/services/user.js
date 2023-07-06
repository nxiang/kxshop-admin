import {
  stringify
} from 'qs';
import {
  encryptByDES,
  decryptByDES
} from 'kx-des'
import request from '../utils/request';
import func from '../utils/Func';
import {
  getCaptchaKey
} from '../utils/authority';
import {
  captchaMode
} from '../defaultSettings';


// =====================用户===========================

export async function accountLogin(params) {
  const values = params;
  values.grantType = captchaMode ? 'captcha' : 'password';
  values.scope = 'all';
  return request('/swordApi/blade-auth/token', {
    headers: {
      'Captcha-key': getCaptchaKey(),
      'Captcha-code': values.code,
    },
    method: 'POST',
    body: encryptByDES(`${JSON.stringify(params)}`),
    // func.toFormData(params)
  });
}

export async function query() {
  return request('/swordApi/users');
}

export async function queryCurrent() {
  return request('/swordApi/currentUser');
}

export async function list(params) {
  return request(`/swordApi/blade-user/list?${stringify(params)}`);
}

export async function grant(params) {
  return request('/swordApi/blade-user/grant', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function resetPassword(params) {
  return request('/swordApi/blade-user/reset-password', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

// 密码重置获取密码
export async function resetGetPass(params) {
  return request(`/swordApi/blade-user/getResetPwd?${stringify(params)}`);
}

export async function remove(params) {
  return request('/swordApi/blade-user/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function submit(params) {
  const temp = JSON.stringify({
    ...params,
    ...{
      tenantAccountId: localStorage.getItem('tenantAccountId')
    }
  });
  const param = encryptByDES(`${temp}`);
  return request('/swordApi/blade-user/submit', {
    method: 'POST',
    body: param
  });
}

export async function adminPassword() {
  return request('/swordApi/blade-user/password/info');
}

export async function update(params) {
  const temp = JSON.stringify(params);
  const param = encryptByDES(`${temp}`);
  return request('/swordApi/blade-user/update', {
    method: 'POST',
    body: param,
  });
}

export async function detail(params) {
  return request(`/swordApi/blade-user/detail?${stringify(params)}`);
}

export async function getUserInfo() {
  return request('/swordApi/blade-user/info');
}

export async function updatePassword(params) {
  return request('/swordApi/blade-user/update-password', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function getCaptchaImage() {
  return request('/swordApi/blade-auth/captcha');
}
