import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';

export async function list(params) {
  return request(`/swordApi/blade-system/client/list?${stringify(params)}`);
}

export async function submit(params) {
  return request('/swordApi/blade-system/client/submit', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/swordApi/blade-system/client/detail?${stringify(params)}`);
}

export async function remove(params) {
  return request('/swordApi/blade-system/client/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
