// http://mock.kxg.local/project/33/interface/api/7667
import { http } from '@/utils/http'

// 售后订单详情
export const refundDetail = (data) =>
  http('get', '/kxshop/admin/refund/detail', data)

// 退款详情查询
export const refundQuery = (data) =>
  http('get', '/kxshop/admin/refund/refundQuery', data)

// 售后协商记录
export const refundHistory = (data) =>
  http('get', '/kxshop/admin/refund/history', data)

// 查看物流--买家寄回商品
export const logisticsBuyer = (data) =>
  http('get', '/kxshop/admin/order/logistics-buyer', data)

// 售后-同意退款（1.7.0）
export const refundAgree = (data) =>
  http('post', '/kxshop/admin/refund/agree', data)

// 售后-拒绝退款（1.7.0）
export const refundReject = (data) =>
  http('post', '/kxshop/admin/refund/reject', data)

// 确认收货
export const confirmReceipt = (data) =>
  http('post', '/kxshop/admin/refund/confirmReceipt', data)

// 拒绝收货
export const rejectReceipt = (data) =>
  http('post', '/kxshop/admin/refund/rejectReceipt', data)

// 增加物流单号
export const refundShipSave = (data) =>
  http('post', '/kxshop/admin/refund/ship/save', data)
