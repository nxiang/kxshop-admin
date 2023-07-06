import { http } from '@/utils/http';

// 计算运费信息--即时配送达达
export const queryFee = data => http('get', '/kxshop/admin/logistics/query-fee', data);

// 使用店铺信息
export const queryStore = data => http('get', '/kxshop/admin/logistics/query-store', data);

// 获取枚举列表
export const getEnumByType = data => http('get', '/logistics/common/getEnumByType', data);

// 后台自提点列表
export const pickUpList = data => http('post', '/logistics/pickUp/list', data);

// 获取工厂列表
export const listFactory = data => http('get', '/logistics/pickUpDistribution/listFactory', data);

// 获取配送站站列表
export const listDistribution = data => http('get', '/logistics/pickUpDistribution/listDistribution', data);