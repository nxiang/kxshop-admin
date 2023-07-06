import { http } from '@/utils/http'
import {
  CustomConfigParams,
  CustomConfigResponse,
  CustomQueryParams,
  CustomQueryResponse
} from '@/types/store'

/** 页面自定义装修查询 */
export const customQuery = (data: CustomQueryParams) => {
  return http(
    'get',
    '/kxshop/admin/store/page/custom/query',
    data
  ) as CustomQueryResponse
}

/** 页面自定义装修 */
export const customConfig = (data: CustomConfigParams) => {
  return http(
    'post',
    '/kxshop/admin/store/page/custom/config',
    data
  ) as CustomConfigResponse
}
