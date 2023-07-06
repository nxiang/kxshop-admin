import { EItemState } from '@/types/item'

/** 热销商品状态 */
export const hotShopStatusMap = {
  [EItemState.offShelf]: {
    text: '已下架',
    color: 'text-gray-400'
  },
  [EItemState.onSale]: {
    text: '出售中',
    color: 'text-green-400'
  },
  [EItemState.soldOut]: {
    text: '已售罄',
    color: 'text-gray-400'
  },
  // [EState.reviewFail]: {
  //   text: '审核失败',
  //   color: 'text-red-400'
  // },
  // [EState.willReview]: {
  //   text: '待审核',
  //   color: 'text-yellow-400'
  // }
}
