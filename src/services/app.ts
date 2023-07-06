import { http } from '@/utils/http'
import {
  ExtendsConfigParams,
  ExtendsConfigResponse,
  ExtendsQueryParams,
  ExtendsQueryResponse
} from '@/types/app'

/** 租户扩展配置查询 */
export const extendsQuery = (data: ExtendsQueryParams) => {
  return http(
    'get',
    '/kxshop/admin/app/extends/query',
    data
  ) as ExtendsQueryResponse
}

/** 租户扩展配置设置 */
export const extendsConfig = (data: ExtendsConfigParams) => {
  return http(
    'post',
    '/kxshop/admin/app/extends/config',
    data
  ) as ExtendsConfigResponse
}
