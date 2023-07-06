import { IResponse } from '@/types'
export interface ExtendsQueryParams {
  /** 配置key */
  extendKey: string
}

export type ExtendsQueryResponse = IResponse<{
  /** [配置key]:配置value */
  [key: string]: string
}>

export interface ExtendsConfigParams {
  /** 配置key */
  extendKey: string
  /** 配置value */
  extendValue: string
}

export type ExtendsConfigResponse = IResponse<boolean>
