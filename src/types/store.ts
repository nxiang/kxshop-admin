import { IResponse } from '@/types'

/** 配置类型， */
export enum EConfigType {
  /** 支付成功页 */
  PaySuccess = 1
}

export interface CustomQueryParams {
  /** 配置类型 */
  configType: EConfigType.PaySuccess
}

export type CustomQueryResponse = IResponse<{
  /** 配置类型 */
  configType: EConfigType.PaySuccess
  /** 配置内容 */
  configData: string
}>

export interface CustomConfigParams {
  /** 配置类型 */
  configType: EConfigType.PaySuccess
  /** 配置内容 */
  configData: string
}

export type CustomConfigResponse = IResponse<boolean>
