import { stringify } from 'qs';
import request from '../utils/request';

// =====================日志===========================

export async function usualList(params) {
  return request(`/swordApi/blade-log/usual/list?${stringify(params)}`);
}

export async function usualDetail(params) {
  return request(`/swordApi/blade-log/usual/detail?${stringify(params)}`);
}

export async function apiList(params) {
  return request(`/swordApi/blade-log/api/list?${stringify(params)}`);
}

export async function apiDetail(params) {
  return request(`/swordApi/blade-log/api/detail?${stringify(params)}`);
}

export async function errorList(params) {
  return request(`/swordApi/blade-log/error/list?${stringify(params)}`);
}

export async function errorDetail(params) {
  return request(`/swordApi/blade-log/error/detail?${stringify(params)}`);
}
