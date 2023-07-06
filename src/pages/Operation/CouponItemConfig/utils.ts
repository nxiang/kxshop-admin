import { parseInterfacePrice } from '@/utils/tools'

/** 搭售类型：1.商品数量，2. 商品金额  */
type Type = 1 | 2
/** 券搭售，表单字段 */
interface CouponBundleItemForm {
  /** 是否勾选 */
  checked: boolean
  /** 商品id列表 */
  itemIds: Array<number>
  type: Type
  /** 搭售件数，仅前端使用 */
  bundlePieces: number
  /** 搭售金额，仅前端使用 */
  bundlePrice: number
}

/** 券搭售，接口字段 */
interface CouponBundleItemInterface {
  /** 商品id列表 */
  itemIds: Array<number>
  type: Type
  /** 搭售值 */
  bundleValue: number
}
/**
 * 后端接口字段对接
 */
export const filedTransform = {
  /** 券搭售 */
  couponBundleItem: {
    /** 接口转表单，调用完详情时使用 */
    interfaceToForm: (
      couponBundleItem: CouponBundleItemInterface
    ): CouponBundleItemForm => {
      /** 接口返回该字段则选中 */
      const checked = !!couponBundleItem
      const itemIds = couponBundleItem?.itemIds || []
      const type = couponBundleItem?.type || 1
      const bundleValue = couponBundleItem?.bundleValue
      const bundlePieces = type === 1 ? bundleValue : undefined
      const bundlePrice =
        type === 2 ? parseInterfacePrice(bundleValue) : undefined
      return {
        checked,
        itemIds,
        type,
        bundlePieces,
        bundlePrice
      }
    },
    /** 调用新建/编辑接口时，字段转换逻辑 */
    formToInterface: (
      couponBundleItem: CouponBundleItemForm
    ): CouponBundleItemInterface | null => {
      const { checked, itemIds, type, bundlePieces, bundlePrice } =
        couponBundleItem
      /** 未选中，直接给接口传null */
      if (!checked) return null
      /** 搭售值，根据类型选择，金额需要乘100 */
      const bundleValue = type === 1 ? bundlePieces : bundlePrice * 100
      return {
        itemIds,
        type,
        bundleValue
      }
    }
  }
}
