import { IResponse } from '@/types'
/**
 * 优惠券类型：
 * NORMAL 固定面额满减券
 * DISCOUNT 折扣券
 */
export type CouponType = 'NORMAL' | 'DISCOUNT'

/** 发送方式 */
export enum ECouponReceiveWay {
  /** 0 直接领取  */
  DirectCollection = 0,
  /** 1 活动领取 */
  ActivityCollection = 1
}

/** 优惠券发送规则 */
export interface CouponSendRule {
  /** 发送方式 */
  couponReceiveWay: ECouponReceiveWay
  /** 优惠券数量 */
  maxQuantity: number
  /** 优惠券每人限领数量 */
  maxCouponsPerUser: number
}

/** 优惠券生效时间 */
export interface CouponAvailableTime {
  /**
   * 是否固定时间：
   * false 否
   * true 是
   */
  isFixedTime: boolean
  /** 领取后多少天生效 */
  daysAvailableAfterReceive?: number
  /** 有效天数 */
  availableDays?: number
  /** 生效开始时间，2019-05-21T13:29:35.120+08:00 */
  availableBeginTime?: string
  /** 生效结束时间，2019-05-21T13:29:35.120+08:00 */
  availableEndTime?: string
}

/** 固定面额满减券，当couponType= NORMAL时，必填 */
export interface FixedNormalCoupon {
  /** 优惠券面额 */
  couponAmount: number
  /** 最低交易限额 */
  transactionMinimum: number
}

/** 折扣优惠券，当couponType=DISCOUNT时，必填 */
export interface DiscountCoupon {
  /** 折扣封顶金额 */
  maxDiscountAmount?: number
  /** 折扣 示例：895 表示8.95折 */
  discountPercent?: number
  /** 最低交易限额 */
  transactionMinimum?: number
  /** 最高商品单价，单位分 */
  ceilingItemUnitPrice?: number
  /** 多优惠商品数量 */
  ceilingItemQuantity?: number
}

/** 特价优惠券，当couponType=SPECIAL时，必填 */
export interface SpecialCoupon {
  /** 最低交易限额，单位分 */
  transactionMinimum: number
  /** 特价金额，单位分 */
  specialAmount: number
  /** 最高商品单价，单位分 */
  ceilingItemUnitPrice: number
  /** 最多优惠商品数量 */
  ceilingItemQuantity: number
  /** 封顶优惠金额，单位分 */
  ceilingAmount: number
}

/** 优惠券核销规则 */
export interface CouponUseRule {
  /** 优惠券生效时间 */
  couponAvailableTime: CouponAvailableTime
  /** 优惠券可使用渠道 */
  couponAvailableClients: Array<number>
  /** 优惠券可使用商品 */
  availableItems?: Array<number>
  /** 固定面额满减券，当couponType= NORMAL时，必填 */
  fixedNormalCoupon?: FixedNormalCoupon
  /** 折扣优惠券，当couponType=DISCOUNT时，必填 */
  discountCoupon?: DiscountCoupon
  /** 特价优惠券，当couponType=SPECIAL时，必填 */
  specialCoupon?: SpecialCoupon
}

/** 适用范围 */
export enum EScope {
  /** 全场 */
  FullCourt = 0,
  /** 单品 */
  SingleProduct = 1
}

/** 外部券类型 alipay 支付宝商家券 wechat 微信商家券 */
export type ExtCouponType = 'alipay' | 'wechat'

/** 外部券配置 */
export interface ExtCouponConfig {
  /** 商户ID */
  merchantId: string
  /** 商户品牌名称 */
  brandName?: string
  /** 商户品牌logo */
  brandLogo?: string
  /** 券详情页封面图 */
  voucherImage?: string
  /** 券详细图列表 */
  voucherDetailImages?: Array<string>
  /** 客服电话 */
  customerServiceMobile?: string
  /** 自然人领取限制  false 无限制 true 限制 */
  naturalPersonLimit?: boolean
  /** 商户品牌名称 */
  phoneNumberLimit?: string
  /** 小程序appId */
  miniAppId?: string
  /** 小程序页面路径 */
  miniAppPath?: string
  /** 商品名称 */
  goodsName?: string
}

export interface StockNewParams {
  /** 优惠券名称 */
  couponName: string
  /** 备注 */
  comment?: string
  /** 优惠券类型 */
  couponType: CouponType
  /** 使用须知 */
  instructions?: string
  /** 批次开始时间，2019-05-21T13:29:35.120+08:00 */
  availableBeginTime: string
  /** 批次结束时间，2019-05-21T13:29:35.120+08:00 */
  availableEndTime: string
  /** 优惠券发送规则 */
  couponSendRule: CouponSendRule
  /** 优惠券核销规则 */
  couponUseRule: CouponUseRule
  /** 优惠券批次号，草稿编辑必须输入 */
  stockId: number
  /** 是否草稿：false 否，true 是 */
  isDraft: boolean
  /** 适用范围 0:全场 1:单品  */
  scope: EScope
  /** 是否关联外部券 */
  isMappingExtCoupon: boolean
  /** 外部券类型 alipay 支付宝商家券 wechat 微信商家券 */
  extCouponType?: ExtCouponType
  /** 外部券配置 */
  extCouponConfig?: ExtCouponConfig
}

export type StockNewResponse = IResponse<{
  /** 优惠券批次号 */
  stockId: number
}>

export interface StockAddParams {
  /** 优惠券批次号 */
  stockId: number
  /** 优惠券数量 */
  maxQuantity: number
  /** 增发数量 */
  addQuantity: number
}

export type StockAddResponse = IResponse<{
  /** 优惠券批次号 */
  stockId: number
  /** 优惠券数量 */
  maxQuantity: number
}>

export interface StockTerminateParams {
  /** 优惠券批次号 */
  stockId: number
}

export type StockTerminateResponse = IResponse<{
  /** 优惠券批次号 */
  stockId: number
  /** 修改时间 */
  gmtModified: number
}>

export interface WechatSendCouponParams {
  /** 微信优惠券批次id，多个以,号拼接 */
  stockIds: string
}

export type WechatSendCouponResponse = IResponse<{
  /** 签名 */
  sign: string
  /** 发券参数 */
  sendCouponParams: string
  /** 发券商户号 */
  send_coupon_merchant: string
}>
