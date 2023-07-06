import {
  BeastEditParams,
  BeastEditResponse,
  BeastListParams,
  BeastListResponse,
  BeastSaveParams,
  BeastSaveResponse,
  DetailParams,
  DetailResponse,
  ItemListParams,
  ItemListResponse,
  ListByIdsParams,
  ListByIdsResponse
} from '@/types/item'
import { http } from '@/utils/http'

// 查询商品列表
export const itemList = (data: Partial<ItemListParams>) => {
  return http('get', '/kxshop/admin/item/list', data) as ItemListResponse
}

// 编辑商品名称
export const itemEditName = (data) =>
  http('post', '/kxshop/admin/item/edit-name', data)

// 编辑商品展示顺序
export const itemEditDisplaySort = (data) =>
  http('post', '/kxshop/admin/item/edit-display-sort', data)

// 商品下架
export const itemDelisting = (data) =>
  http('post', '/kxshop/admin/item/delisting', data)

// 商品上架
export const itemListing = (data) =>
  http('post', '/kxshop/admin/item/listing', data)

// 删除商品
export const itemDelete = (data) =>
  http('post', '/kxshop/admin/item/delete', data)

// 查询商品全部规格
export const itemSkuList = (data) =>
  http('get', '/kxshop/admin/item/sku/list', data)

// 更新sku售价和库存
export const itemSkuEditPriceStorage = (data) =>
  http('post', '/kxshop/admin/item/sku/edit-price-storage', data)

// 新增商品
export const addItem = (data) =>
  http('post', '/kxshop/admin/item/publish', data)

// 编辑商品
export const editItem = (data) => http('post', '/kxshop/admin/item/edit', data)

// 积分商品列表查询
export const pointItemList = (data) =>
  http('get', '/kxshop/admin/point-item/list', data)

// 积分商品可添加优惠券列表查询
export const availableCouponList = (data) =>
  http('get', '/kxshop/admin/item/availableCouponList', data)

// 禁售区域新增&编辑
export const prohibitionAreaAddOrUpdate = (data) =>
  http('post', '/item/prohibitionArea/addOrUpdate', data)

// 禁售区域列表查询
export const prohibitionAreaLists = (data) =>
  http('post', '/item/prohibitionArea/lists', data)

// 禁售区域删除
export const prohibitionAreaDelete = (data) =>
  http('get', '/item/prohibitionArea/delete', data)

// 禁售区域导出
export const prohibitionAreaDownLoad = (data) =>
  http('post', '/item/prohibitionArea/downLoad', data)

// 禁售区域导入
export const prohibitionAreaUpload = (data) =>
  http('post', '/item/prohibitionArea/upload', data)

// 导航设置保存
export const saveOrUpdateDecorateNavi = (data) =>
  http(
    'post',
    '/kxshop/admin/store/storeDecorateNavi/saveOrUpdateDecorateNavi',
    data
  )

// 导航设置查询
export const getStoreDecorateNavi = (data) =>
  http(
    'get',
    '/kxshop/admin/store/storeDecorateNavi/getStoreDecorateNavi',
    data
  )

// 商品设置
export const saveOrUpdateItemActivity = (data) =>
  http('post', '/kxshop/admin/item/saveOrUpdateItemActivity', data)
// 商品设置详情
export const itemActivityDetail = (data) =>
  http('get', '/kxshop/admin/item/itemActivityDetail', data)

/** 新增热销商品 */
export const beastSave = (data: BeastSaveParams) => {
  return http(
    'post',
    '/kxshop/admin/item/beast/save',
    data
  ) as BeastSaveResponse
}

/** 热销商品列表 */
export const beastList = (data: Partial<BeastListParams>) => {
  return http('get', '/kxshop/admin/item/beast/list', data) as BeastListResponse
}

/** 删除热销商品 */
// export const beastDelete = (data: BeastDeleteParams) => {
//   return http(
//     'post',
//     '/kxshop/admin/item/beast/delete',
//     data
//   ) as BeastDeleteResponse
// }

/** 删除热销商品 */
export const beastEdit = (data: BeastEditParams) => {
  return http(
    'post',
    '/kxshop/admin/item/beast/edit',
    data
  ) as BeastEditResponse
}

/** 商品列表，根据id查询 */
export const itemListByIds = (data: ListByIdsParams) => {
  return http('get', '/kxshop/admin/item/listByIds', data) as ListByIdsResponse
}

// 查询商品详情
export const itemDetail = (data: DetailParams) => {
  return http('get', '/kxshop/admin/item/detail', data) as DetailResponse
}
