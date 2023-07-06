// 订单状态
export const orderStatus = [
  { label: '待付款', value: 1 },
  { label: '待发货', value: 2 },
  { label: '已发货', value: 3 },
  { label: '已成功', value: 4 },
  { label: '已取消', value: 5 },
  { label: '已评价', value: 6 }
]

// 积分订单状态
export const integralOrderStatus = [
  { label: '待发货', value: 2 },
  { label: '已发货', value: 3 },
  { label: '完成', value: 4 },
  { label: '交易关闭', value: 5 }
]

// 订单售后状态
export const orderRefundStatus = [
  { label: '售后中', value: 1 },
  { label: '售后成功', value: 2 },
  { label: '售后关闭', value: 3 },
  { label: '无需售后或售后关闭', value: '0,3' }
]

// 售后订单售后状态
export const refundTypeRenderStatus = [
  { label: '待审核', value: 1 },
  { label: '等待买家退货', value: 2 },
  { label: '等待卖家确认', value: 5 },
  { label: '售后成功', value: 3 },
  { label: '售后关闭', value: 4 },
  { label: '已取消', value: 6 }
]

// 支付方式
export const payChannelStatus = [
  { label: '余额支付', value: 'BALANCE_PAY' },
  { label: '微信', value: 'WXPAY' },
  { label: '支付宝', value: 'ALIPAY' }
]

// 售后类型
export const refundTypeStatus = [
  { label: '退款', value: 1 },
  { label: '退货', value: 2 }
]

// 退款方式
export const refundStateTypeStatus = [
  { label: '买家申请退款', value: 0 },
  { label: '卖家主动退款', value: 1 }
]
