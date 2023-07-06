import { http, excel } from '@/utils/http';

// 打印小票时获取订单信息
export const printOrder = data => http('get', '/kxshop/admin/trade/print-detail', data);

// 订单消息轮询
export const messageList = data => http('get', '/kxshop/admin/trade/message/list', data);

// 订单消息列表
export const messageListPage = data => http('get', '/kxshop/admin/trade/message/list-page', data);

// 订单消息详情
export const messageDetail = data => http('get', '/kxshop/admin/trade/detail', data);

// 订单列表
export const orderList = data => http('get', '/kxshop/admin/order/list', data);

// 订单详情
export const detail = data => http('get', '/kxshop/admin/order/detail', data);

// 修改订单卖家备注
export const modifySellerMemo = data => http('post', '/kxshop/admin/order/modifySellerMemo', data);

// 发货
export const orderSend = data => http('get', '/kxshop/admin/order/send', data);

// 确认发货
export const orderSendConfirm = data => http('post', '/kxshop/admin/order/send-confirm', data);

// 修改物流
export const logisticsModify = data => http('post', '/kxshop/admin/order/logistics-modify', data);

// 获取配送方式
export const deliveryWay = data => http('get', '/kxshop/admin/order/delivery-way', data);

// 普通物流信息
export const logistics = data => http('get', '/kxshop/admin/order/logistics', data);

// 即时配送-物流信息
export const logisticsDD = data => http('get', '/kxshop/admin/order/logistics-dada', data);

// 取消订单
export const logisticsCanel = data => http('get', '/kxshop/admin/order/logistics-cancel', data);

// 订单记录导出发起
export const exportLaunch = data => http('get', '/kxshop/admin/order/exportLaunch', data);

// 积分订单记录导出发起
export const exportPointOrder = data => http('get', '/kxshop/admin/order/exportPointOrder', data);

// 主动退款前置查询
export const getOrderRefundInitiativeInfo = data => http('get', '/kxshop/admin/order/getOrderRefundInitiativeInfo', data);

// 主动退款触发按钮
export const refundInitiativeInfo = data => http('post', '/kxshop/admin/order/refundInitiativeInfo/save', data);

// 订单记录导出订单
export const orderExportRecordList = data =>
  http('get', '/kxshop/admin/order-export-record/list', data);

// 订单导出记录下载
export const orderExportRecordDownload = data =>
  excel('get', '/kxshop/admin/order-export-record/download', data);

// 订单导出记录删除
export const orderExportRecordDelete = data =>
  http('post', '/kxshop/admin/order-export-record/delete', data);

// http://mock.kxg.local/project/84/interface/api/14411
// 评价列表
export const evaluateList = data => http('get', '/kxshop/admin/evaluate/list', data);

// 评价隐藏
export const evaluateHide = data => http('post', '/kxshop/admin/evaluate/hide', data);

// 评价置顶
export const evaluateTop = data => http('post', '/kxshop/admin/evaluate/top', data);

// 评价取消置顶
export const evaluateNoTop = data => http('post', '/kxshop/admin/evaluate/noTop', data);

// 评价显示
export const evaluateShow = data => http('post', '/kxshop/admin/evaluate/show', data);

// 社区团购订单列表
export const communityList = data => http('get', '/kxshop/admin/community-group-order/list', data);

// 社区团购订单导出
export const communityDownload = data => excel('post', '/kxshop/admin/community-group-order/download', data);

// 售后订单记录导出发起
export const refundExportLaunchApi = data => http('get', '/kxshop/admin/refund/exportLaunch', data);

// 订单记录导出订单
export const refundExportRecordList = data =>
  http('get', '/kxshop/admin/refund-export-record/list', data);

// 订单导出记录下载
export const refundExportRecordDownload = data =>
  excel('get', '/kxshop/admin/refund-export-record/download', data);

// 订单导出记录删除
export const refundExportRecordDelete = data =>
  http('post', '/kxshop/admin/refund-export-record/delete', data);