import { http, excel } from '@/utils/http';

// 预约订单列表
export const orderList = data => http('get', '/kxshop/admin/reserve-order/list', data);

// 预约订单详情
export const orderDetail = data => http('get', '/kxshop/admin/reserve-order/detail', data);

// 预约订单开单
export const orderConfirm = data => http('post', '/kxshop/admin/reserve-order/confirm', data);

// 预约订单延期
export const orderDelay = data => http('post', '/kxshop/admin/reserve-order/delay', data);

// 预约订单取消
export const orderCancel = data => http('post', '/kxshop/admin/reserve-order/cancel', data);

// 查看预约核销码
export const qrcode = data => http('post', '/kxshop/admin/reserve-order/confirm-qrcode', data);