/**
 * http://mock.kxg.local/project/33/interface/api/1547
 */

import {
  StockAddParams,
  StockAddResponse,
  StockNewParams,
  StockNewResponse,
  StockTerminateParams,
  StockTerminateResponse,
  WechatSendCouponParams,
  WechatSendCouponResponse
} from '@/types/coupon'
import { http } from '@/utils/http'

// 创建优惠券批次
export const newCoupon = (data: StockNewParams) => {
  return http('post', '/favor/stock/new', data) as StockNewResponse
}

// 查询应用开通渠道
export const clientList = (data) =>
  http('get', '/kxshop/admin/client/list', data)

// 编辑优惠券批次信息
export const editCoupon = (data) => http('post', '/favor/stock/edit', data)

// 删除优惠券草稿
export const deleteCoupon = (data) => http('post', 'favor/stock/delete', data)

// 优惠券商品搜索
export const search = (data) => http('get', '/favor/stock/item/search', data)

// 查询优惠券有效商品列表
export const goodsList = (data) => http('get', '/favor/stock/item/list', data)

// 查询优惠券批次列表
export const couponList = (data) => http('get', '/favor/stock/list', data)

// 暂停发放优惠券
export const pause = (data) => http('post', '/favor/stock/pause', data)

// 继续发放优惠券
export const continueC = (data) => http('post', '/favor/stock/continue', data)

// 查询优惠券批次详情
export const detail = (data) => http('get', '/favor/stock/detail', data)

// 查询优惠券二维码
export const qrCode = (data) => http('get', '/favor/stock/qr-code', data)

// 增发优惠券
export const add = (data: StockAddParams) =>
  http('post', '/favor/stock/add', data) as StockAddResponse

// 查询领券明细
export const couponUse = (data) =>
  http('post', '/favor/stock/coupon/list', data)

// 导出领券明细
export const exportGetCoupon = (data) =>
  http('post', '/favor/stock/coupon/export', data)

// 券列表导出
export const exportCoupon = (data) => http('post', '/favor/stock/export', data)

// 查看小程序的基本信息
export const getMiniAppBaseInfoApi = (data) =>
  http('post', '/tenant/program/baseInfo', data)

// 查询优惠券列表
export const getCouponListApi = (data) =>
  http('post', '/favor/stock/pageCouponResult', data)

// 立即发布
export const publishCouponApi = (data) =>
  http('post', '/favor/stock/publish', data)

// 终止活动
export const terminateCouponApi = (data: StockTerminateParams) =>
  http('post', '/favor/stock/terminate', data) as StockTerminateResponse

/** 获取微信发券参数 */
export const wechatSendCouponParams = (data: WechatSendCouponParams) =>
  http(
    'get',
    '/favor/coupon/wechat/sendCouponParams',
    data
  ) as WechatSendCouponResponse
