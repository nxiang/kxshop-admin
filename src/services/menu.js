import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';

// =====================菜单===========================

export async function dynamicRoutes() {
  return request('/swordApi/blade-system/menu/routes');
}

export async function dynamicButtons() {
  return request('/swordApi/blade-system/menu/buttons');
}

export async function list(params) {
  return request(`/swordApi/blade-system/menu/list?${stringify(params)}`);
}

export async function tree(params) {
  return request(`/swordApi/blade-system/menu/tree?${stringify(params)}`);
}

export async function grantTree(params) {
  return request(`/swordApi/blade-system/menu/grant-tree?${stringify(params)}`);
}

export async function roleTreeKeys(params) {
  return request(`/swordApi/blade-system/menu/role-tree-keys?${stringify(params)}`);
}

export async function remove(params) {
  return request('/swordApi/blade-system/menu/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function submit(params) {
  return request('/swordApi/blade-system/menu/submit', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/swordApi/blade-system/menu/detail?${stringify(params)}`);
}

export async function routesAuthority() {
  return request('/swordApi/blade-system/menu/auth-routes');
}
