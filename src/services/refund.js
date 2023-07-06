import { http } from '@/utils/http';

// 售后列表
export const refundList = data => http('get', '/kxshop/admin/refund/list', data);