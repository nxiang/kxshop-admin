export const isDev = process.env.NODE_ENV === 'development'

/** 生成默认图片装修配置 */
export const genDefaultPicConfig = () => {
  return {
    image: '',
    data: '',
    type: 'none'
  }
}

/** 默认小程序首页 */
export const defualtMiniProgramHomePath = '/pages/home/home'

/** 渠道类型，接口用，支付宝：1，微信：2 */
export const channelTypeMap = {
  alipay: '1',
  wechat: '2'
}

/** 正则：只允许大小写字母，数字，中划线，下划线 */
// export const letterNumberLineThroughUnderlineReg = '^[a-z|A-Z|0-9|_|-]+$'
/** 正则：只允许大小写字母，数字，下划线 */
export const letterNumberLineThroughUnderlineReg = '^[a-z|A-Z|0-9|_]+$'
