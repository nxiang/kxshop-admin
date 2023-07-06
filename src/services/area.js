import { http } from '@/utils/http';

// 售后订单详情
export const getAreaTree = data => http('get', '/area/getAreaTree', data);