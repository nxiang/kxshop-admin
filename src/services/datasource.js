import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';

export async function list(params) {
  return request(`/swordApi/blade-develop/datasource/list?${stringify(params)}`);
}

export async function select(params) {
  return request(`/swordApi/blade-develop/datasource/select?${stringify(params)}`);
}

export async function submit(params) {
  return request('/swordApi/blade-develop/datasource/submit', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/swordApi/blade-develop/datasource/detail?${stringify(params)}`);
}

export async function remove(params) {
  return request('/swordApi/blade-develop/datasource/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
