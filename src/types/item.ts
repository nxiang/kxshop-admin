import { IResponse } from '@/types'

export enum EItemState {
  /** 已下架 */
  offShelf = '0',
  /** 出售中 */
  onSale = '1',
  /** 已售罄 */
  soldOut = '2'
}

/**
 * 排序类型：
 * salesVolume 销量
 * salePrice 价格
 * storage 库存
 * disSort 展示顺序
 */
export type SortType = 'salesVolume' | 'salePrice' | 'storage' | 'disSort'

/**
 * 排序顺序：
 * asc 升序
 * desc 降序
 */
export type SortOrder = 'asc' | 'desc'

/** 商品类型，0 普通商品 1 积分商品 默认0 */
export type ItemType = 0 | 1

export interface ItemListParams {
  /** 页 */
  page: number
  /** 页大小 */
  pageSize: number
  /** 商品状态 */
  state: EItemState
  /** 店铺商品类ID */
  storeLabelId: number
  /** 商品名称 */
  itemName: string
  /** 商品ID */
  itemId: string
  /** 商家货号 */
  itemCode: string
  /** 排序类型 */
  sortType: SortType
  /** 商品分类 */
  classId: number
  /** 商品类型 */
  itemType: ItemType
}

export interface Record {
  /** 商品ID */
  itemId: string
  /** 商品名称 */
  itemName: string
  /** 主图 */
  imageSrc: string
  /** 展示价格 */
  showPrice: string
  /** 普通商品：最低销售价，单位分 积分商品：最低所需积分 */
  minSalePrice: string
  /** 普通商品：最高销售价，单位分 积分商品：最高所需积分 */
  maxSalePrice: string
  /** 库存 */
  storage: string
  /** 销量 */
  saleVolume: string
  /** 展示顺序 */
  disSort: number
  /** 发布时间，格式：yyyy-MM-dd hh:mm:ss */
  gmtCreated: number
  /** 状态 */
  state: EItemState
  /** 商品编码 */
  itemCode: string
  /** 商品分类ID */
  classId: string
  /** 商品分类名称 */
  className: string
  /** 商品类型：0 普通商品 1 积分商品 默认0 */
  itemType: number
  /** 划线价 */
  linePrice: number
  /** 兑换所需积分 */
  expendPoint: string
}

export type ItemListResponse = IResponse<{
  /** 当前页 */
  current: number
  /** 每页数据条数 */
  pageSize: number
  /** 总记录数 */
  total: number
  /** 总页数 */
  pages: number
  /** 行 */
  rows: Array<Record>
}>

export interface BeastSaveParams {
  /** 商品id */
  itemIds: Array<string>
}

export type BeastSaveResponse = IResponse<boolean>

export interface BeastListParams {
  /** 页 */
  page: number
  /** 页大小 */
  pageSize: number
}

// /** 商品状态  */
// export enum EState = EItemState

/** 表格项：热销商品 */
export interface HotSaleRecord {
  /** 商品ID */
  itemId: number
  /** 商品名称 */
  itemName: string
  /** 主图 */
  imageSrc: string
  /** 销售价 */
  salePrice: string
  /** 库存 */
  storage: string
  /** 销量 */
  saleVolume: string
  /** 展示顺序 */
  disSort: string
  /** 商品状态 0 下架 1 上架 2 禁售 3 待审核 4 审核失败 */
  state: EItemState
}

export type BeastListResponse = IResponse<{
  /** 当前页 */
  current: number
  /** 每页数据条数 */
  pageSize: number
  /** 总记录数 */
  total: number
  /** 总页数 */
  pages: number
  /** 行 */
  rows: Array<HotSaleRecord>
}>

// export interface BeastDeleteParams {
//   /** 热销商品id */
//   beastId: number
// }

// export type BeastDeleteResponse = IResponse<boolean>

export interface BeastEditParams {
  /** 商品id */
  itemId: number
  /** 排序字段 默认 0 */
  disSort?: string
  /** 是否删除 1 删除 */
  isDel?: 0 | 1
}

export type BeastEditResponse = IResponse<boolean>

export interface ListByIdsParams {
  /** 商品id集合，以逗号分隔 */
  itemIds: string
}
interface Item {
  brand: string
  imageSrc: string
  itemId: number
  itemName: string
  salePrice: number
  storage: number
}
export type ListByIdsResponse = IResponse<Array<Item>>

export interface DetailParams {
  /** 商品ID */
  itemId: string
}

export type SkuList = Array<{
  activityOutSerial: string
  basePrice: number
  colorValueId: number
  expendPoint: any
  guaranteeDay: any
  imageSrc: string
  itemId: number
  itemName: any
  itemState: any
  itemType: any
  linePrice: number
  outSerial: string
  productDate: any
  salePrice: number
  skuId: number
  specList: Array<{
    classSpecFlag: boolean
    specId: number
    specName: string
    specValue: string
    specValueId: number
  }>
  storage: number
  storeId: any
}>

export interface ItemDetail {
  alipayActivityId: string
  appId: number
  attributeList: Array<any>
  bannerData: string
  brand: string
  classId: number
  className: string
  commissionRatio: number
  consigneeAddress: any
  couponHide: string
  couponStock: any
  couponStockList: Array<any>
  detail: {
    detailContentList: Array<any> | null
    itemId: number
  }
  displayBanner: boolean
  displayWindow: boolean
  evaluateNum: number
  extConfig: {
    alipayIntegralExchange: string
  }
  gmtCreated: string
  hide: number
  ifCommission: boolean
  imageList: Array<{
    colorValueId: number
    imageId: any
    imageSort: number
    imageSrc: string
    itemId: number
    mainFlag: boolean
    type: number
  }>
  imageSrc: string
  isJoinBigSale: any
  itemCategoryList: Array<any>
  itemCode: string
  itemFreight: {
    buyNum: number
    deliveryAfterHours: any
    deliveryBetweenDays: any
    deliveryMode: number
    freightAmount: number
    freightAmountRange: Array<number>
    freightId: number
    freightVolume: number
    freightWeight: number
    isDeliver: boolean
    isFreeDeliver: boolean
    isPointItem: any
    itemId: number
    type: number
  }
  itemId: number
  itemName: string
  itemType: number
  jingle: string
  payType: string
  positiveFeedbackRate: number
  salePrice: number
  salesVolume: number
  secondAreaId: any
  skuList: SkuList
  sortPriority: number
  specList: Array<{
    classSpecFlag: boolean
    specId: number
    specName: string
    specValueList: Array<{
      imageSrc?: string
      specValue: string
      specValueId: number
    }>
  }>
  state: number
  storage: number
  storeId: number
  storeLabel?: string
  tid: number
}

export type DetailResponse = IResponse<ItemDetail>
