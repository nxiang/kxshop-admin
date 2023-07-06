/**
 * 表单数据转换给接口使用
 * @param extConfig
 */
export const setExtConfig = (extConfig) => {
  const config = extConfig
  const { alipayIntegralExchange } = config
  /** 后端接口，不支持多层对象，所以序列化一下再给接口 */
  config.alipayIntegralExchange = JSON.stringify(alipayIntegralExchange)
  return config
}
/**
 * 接口响应转换给表单使用
 * @param extConfig
 * @returns
 */
export const getExtConfig = (extConfig) => {
  const config = extConfig
  if (!config) {
    // 返回默认值
    return {
      /** 支付宝积分兑换配置 */
      alipayIntegralExchange: {
        /** 开启/关闭 */
        open: false,
        /** 积分兑换券模板ID */
        voucherTemplateId: undefined,
        /** 商品编码 */
        goodsId: undefined
      }
    }
  }
  const { alipayIntegralExchange } = config
  if (typeof alipayIntegralExchange === 'string') {
    // 字符串，需反序列化
    config.alipayIntegralExchange = JSON.parse(alipayIntegralExchange)
  }
  return config
}
