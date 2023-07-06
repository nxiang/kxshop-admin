import { genDefaultPicConfig } from '@/consts'
import { dataSearch } from '@/services/shop'
import { message } from 'antd'
import { cloneDeep } from 'lodash-es'
import { picPropertiesArr, recommondItemTitleColor } from './formatData'

export default function modalSubmitJudge(specialList, channelType) {
  try {
    // 微信侧校验
    // if (channelType === 'wechat') {
    //   // 一键领券不允许，多个装修组件间配置同样的券ID
    //   const couponIdsMap = {}
    //   specialList.forEach((item) => {
    //     item?.itemData?.forEach?.((ele) => {
    //       if (ele.type === 'getCoupon') {
    //         const alterText = ele?.data?.alterText
    //         if (!couponIdsMap[alterText]) {
    //           couponIdsMap[alterText] = 1
    //         } else {
    //           couponIdsMap[alterText]++
    //         }
    //       }
    //     })
    //   })
    //   // 券配置装修组件数量大于1的券ID
    //   const notAllowCouponList = []
    //   Object.keys(couponIdsMap).forEach((key) => {
    //     const value = couponIdsMap[key]
    //     if (value > 1) notAllowCouponList.push(key)
    //   })
    //   if (notAllowCouponList.length) {
    //     message.warning(
    //       `在微信侧，单个优惠券不允许同时配置在多个装修组件中，请检查这些优惠券ID：${notAllowCouponList.join(
    //         '，'
    //       )} 的装修配置`
    //     )
    //     return false
    //   }
    //   console.log('modalSubmitJudge channelType', channelType, couponIdsMap)
    // }
    specialList.forEach((item) => {
      console.log(item)
      // 多子类组件判断
      if (Array.isArray(item.itemData))
        item.itemData.forEach((subItem) => {
          // 子类空图片判断
          if (subItem.image === '') {
            if (item.itemType === 'ad') {
              message.warning('轮播-图片未配置')
              throw new Error()
            }
            if (item.itemType === 'images_ad') {
              message.warning('图片-图片未配置')
              throw new Error()
            }
            if (item.itemType === 'assist_ad') {
              message.warning('辅助图片-图片未配置')
              throw new Error()
            }
            if (item.itemType === 'subscribe') {
              message.warning('订阅组件-图片未配置')
              throw new Error()
            }
            if (item.itemType === 'coupon_ad') {
              message.warning('优惠券-图片未配置')
              throw new Error()
            }
            if (item.itemType === 'navi') {
              message.warning('导航-图片未配置')
              throw new Error()
            }
            if (item.itemType === 'vipinfo') {
              console.log('subItem=', subItem)
            }
          }
          // 子类空跳转判断
          if (
            subItem.data === '' &&
            subItem.type !== 'none' &&
            subItem.type !== 'skipInvitation' &&
            subItem.type !== 'live' &&
            subItem.type !== 'integralMall' &&
            subItem.type !== 'memberCenter' &&
            subItem.type !== 'dailyAttendance' &&
            subItem.type !== 'community'
          ) {
            if (item.itemType === 'ad') {
              message.warning('轮播-跳转未配置')
              throw new Error()
            }
            if (item.itemType === 'images_ad') {
              message.warning('图片-跳转未配置')
              throw new Error()
            }
            if (item.itemType === 'navi') {
              message.warning('导航-跳转未配置')
              throw new Error()
            }
          }
          // 子类空优惠券判断
          if (subItem.type === 'alipayCoupon') {
            if (!subItem?.data?.couponText) {
              if (item.itemType === 'ad') {
                message.warning('轮播-支付宝优惠券未配置')
                throw new Error()
              }
              if (item.itemType === 'images_ad') {
                message.warning('图片-支付宝优惠券未配置')
                throw new Error()
              }
              if (item.itemType === 'navi') {
                message.warning('导航-支付宝优惠券未配置')
                throw new Error()
              }
            }
            // 子类空模板ID判断
            if (
              subItem?.data?.couponType == 1 &&
              !subItem?.data?.couponCardUrl
            ) {
              if (item.itemType === 'ad') {
                message.warning('轮播-支付宝优惠券对应支付宝会员模板ID未配置')
                throw new Error()
              }
              if (item.itemType === 'images_ad') {
                message.warning('图片-支付宝优惠券对应支付宝会员模板ID未配置')
                throw new Error()
              }
              if (item.itemType === 'navi') {
                message.warning('导航-支付宝优惠券对应支付宝会员模板ID未配置')
                throw new Error()
              }
            }
          }
        })
      // 视频组件空数据判断
      if (item.itemType == 'video') {
        if (item.itemData.videoUrl == '') {
          message.warning('视频-视频内容不能为空')
          throw new Error()
        }
        if (item.itemData.videoCover == '') {
          message.warning('视频-视频封面不能为空')
          throw new Error()
        }
      }
      // 店铺信息组件空数据判断
      if (item.itemType == 'shop_info') {
        if (item.itemData.shopName == '') {
          message.warning('店铺信息-店铺名称不能为空')
          throw new Error()
        }
        if (item.itemData.shopTime == '') {
          message.warning('店铺信息-营业时间不能为空')
          throw new Error()
        }
        if (item.itemData.shopAddress == '') {
          message.warning('店铺信息-店铺地址不能为空')
          throw new Error()
        }
        if (item.itemData.shopPhone == '') {
          message.warning('店铺信息-店铺电话不能为空')
          throw new Error()
        }
      }
      // 店铺信息组件空数据判断
      if (item.itemType == 'recommend' || item.itemType == 'integral') {
        const { itemSubTitle, itemData, itemNum } = item
        let flag = false
        let dataFlag = false
        if (itemNum != 1) {
          for (let i = 0; i < itemData.length; i++) {
            const element = itemData[i]
            if (
              (itemSubTitle == 1 && !element.subTitle.trim()) ||
              !element.title.trim()
            )
              flag = true
            if (!element.data || !element.data?.length) dataFlag = true
          }
        } else {
          if (!itemData[0].data || !itemData[0].data?.length) dataFlag = true
        }
        if (flag && item.itemType == 'recommend') {
          message.warning('商品推荐-主副标题不能为空')
          throw new Error()
        } else if (flag && item.itemType == 'integral') {
          message.warning('积分商品-主副标题不能为空')
          throw new Error()
        }
        if (dataFlag && item.itemType == 'recommend') {
          message.warning('商品推荐-商品未添加')
          throw new Error()
        } else if (dataFlag && item.itemType == 'integral') {
          message.warning('积分商品-商品未添加')
          throw new Error()
        }
      }
      // 促销商品组件空数据判断
      if (item.itemType == 'promotion_goods') {
        const { itemData } = item
        if (!itemData.data) {
          message.warning('促销商品组件-商品选择不能为空')
          throw new Error()
        }
      }
      // 快捷购物车组件空数据判断
      if (item.itemType == 'shop_cart') {
        const { itemData } = item
        if (!itemData.img) {
          message.warning('快捷购物车-图片不能为空')
          throw new Error()
        }
      }
      // 判断会员信息
      if (item.itemType == 'vipinfo') {
        if (item.itemData.backgroundType == 1 && item.itemData.image == '') {
          message.warning('会员信息-背景图片不能为空')
          throw new Error()
        } else if (
          item.itemData.backgroundType == 2 &&
          item.itemData.backgroundColor.a == ''
        ) {
          message.warning('会员信息-背景颜色不能为空')
          throw new Error()
        }
        // console.log('object',item.itemData);
        // if(item.)
      }
      // 芝麻go空数据判断
      if (item.itemType == 'zmGo') {
        const { itemData } = item
        if (!itemData.thirdAppId) {
          message.warning('芝麻Go组件-活动AppId不能为空')
          throw new Error()
        }
      }
      //
      // 社区团购入口组件空数据判断
      // if (item.itemType === 'community') {
      //   if (item.itemEntrance.entranceImg == '') {
      //     message.warning('社区团购-入口图片不能为空');
      //     throw new Error();
      //   }
      //   if (String(item.itemData) == []) {
      //     message.warning('社区团购-团购商品不能为空');
      //     throw new Error();
      //   }
      // }
    })
    return true
  } catch (err) {
    // console.log(err);
    console.log('跳出来了')
    return false
  }
}

/** dataSearch接口参数格式化 */
export const formatDataSearch = (subItems = []) => {
  const datas = []
  console.log('formatDataSearch subItems', subItems)
  subItems.forEach((subItem) => {
    if (
      (subItem?.type === 'goods' && subItem?.data != '') ||
      (subItem?.type === 'integral' && subItem?.data != '')
    ) {
      const listData = subItem.data.split(',')
      if (Array.isArray(listData)) {
        listData.forEach((listItem) => {
          datas.push({
            type: subItem?.type,
            id: String(listItem)
          })
        })
      }
    } else if (
      subItem?.type !== 'none' &&
      subItem?.type !== 'keyword' &&
      subItem?.type !== 'h5Url' &&
      subItem?.type !== 'pageSkip' &&
      subItem?.type !== 'wxapp' &&
      subItem?.type !== 'aliapp' &&
      subItem?.type !== 'alipayCoupon' &&
      subItem?.type !== 'alipayMembers' &&
      subItem?.type !== 'alipaySkip' &&
      subItem?.type !== 'getCoupon' &&
      subItem?.data != ''
    ) {
      datas.push({
        type: subItem.type,
        id: String(subItem.data)
      })
    }
  })
  return datas
}

/** 单项，解析dataSearch接口响应 */
export const parseSingleDataSearchResponse = async (data) => {
  let res, json
  if (data) {
    json = JSON.parse(data)
    const params = formatDataSearch([json])
    res = await dataSearch(params)
  }
  const item = res?.data?.[0]
  const defaultPicConfig = genDefaultPicConfig()
  return {
    image: json?.image,
    type: item?.type || json?.type || defaultPicConfig.type,
    data: item || json?.data || defaultPicConfig.data
  }
}

// 用于装修数据变更，更改请注意全局查看各引用处使用的兼容
export const dealDecorationFn = async (specialList) => {
  const listLocation = []
  const requestState = []
  console.log('specialList==', specialList)
  let incluedsArr = [
    'assist_ad',
    'subscribe',
    'notice',
    'video',
    'rich_text',
    'shop_info',
    'alipay_mkt',
    'shop_cart',
    'promotion_goods',
    'anXinChong',
    'vipcard',
    'vipinfo',
    'zmGo',
    'signIn',
    'memberTask'
  ]
  specialList.forEach((item, index) => {
    if (!incluedsArr.includes(item.itemType)) {
      item.itemData.forEach((subItem, subIndex) => {
        if (
          (subItem?.type === 'goods' && subItem?.data != '') ||
          (subItem?.type === 'integral' && subItem?.data != '')
        ) {
          const listData = subItem.data.split(',')
          listLocation.push({
            type: subItem.type,
            listIndex: index,
            itemitemDataIndex: subIndex,
            startIndex: requestState.length,
            endIndex: requestState.length + listData.length
          })
          if (Array.isArray(listData))
            listData.forEach((listItem) => {
              requestState.push({
                type: subItem?.type,
                id: String(listItem)
              })
            })
        } else if (
          subItem?.type !== 'none' &&
          subItem?.type !== 'keyword' &&
          subItem?.type !== 'h5Url' &&
          subItem?.type !== 'pageSkip' &&
          subItem?.type !== 'wxapp' &&
          subItem?.type !== 'aliapp' &&
          subItem?.type !== 'alipayCoupon' &&
          subItem?.type !== 'alipayMembers' &&
          subItem?.type !== 'alipaySkip' &&
          subItem?.type !== 'getCoupon' &&
          subItem?.data != ''
        ) {
          listLocation.push({
            type: subItem.type,
            listIndex: index,
            itemitemDataIndex: subIndex,
            startIndex: requestState.length,
            endIndex: requestState.length + 1
          })
          requestState.push({
            type: subItem.type,
            id: String(subItem.data)
          })
        }
      })
    }

    // 兼容老数据
    if (item.itemType == 'recommend' && !item.itemTitleColor) {
      item.itemTitleColor = cloneDeep(recommondItemTitleColor)
    }
    if (item.itemType == 'integral' && !item.itemTitleColor) {
      item.itemTitleColor = cloneDeep(recommondItemTitleColor)
    }
    if (
      ['ad', 'images_ad', 'assist_ad', 'video', 'subscribe'].includes(
        item.itemType
      ) &&
      !item.propertiesArr
    ) {
      item.propertiesArr = cloneDeep(picPropertiesArr)
    }
  })

  if (requestState.length > 0) {
    await dataSearch(requestState).then((res: any) => {
      if (res.errorCode === '0') {
        listLocation.forEach((item) => {
          const listData = res.data.slice(item.startIndex, item.endIndex)
          let newlistData
          if (item.type === 'goods' || item.type === 'integral') {
            newlistData = listData.map((item) => {
              return JSON.parse(item.value)
            })
          } else {
            // eslint-disable-next-line prefer-destructuring
            newlistData = listData[0]
          }
          specialList[item.listIndex].itemData[item.itemitemDataIndex].data =
            newlistData
        })
      }
    })
  }
  console.log('-----')
  console.log('specialList', specialList)
  console.log('-----')
  return specialList || []
}

export const dealAdAndImagesAdData = (subItem) => {
  if (subItem.type === 'none') {
    return {
      ...subItem,
      data: ''
    }
  }
  if (
    subItem.type === 'keyword' ||
    subItem.type === 'h5Url' ||
    subItem.type === 'pageSkip' ||
    subItem.type === 'wxapp' ||
    subItem.type === 'aliapp' ||
    subItem.type === 'alipayCoupon' ||
    subItem.type === 'alipayMembers' ||
    subItem.type === 'alipaySkip' ||
    subItem.type === 'getCoupon'
  ) {
    return {
      ...subItem
    }
  }
  return {
    ...subItem,
    data: String(subItem?.data?.id || '')
  }
}

interface Item {
  // type:
  //   | 'none'
  //   | 'skipInvitation'
  //   | 'dailyAttendance'
  //   | 'live'
  //   | 'integralMall'
  //   | 'memberCenter'
  //   | 'dailyAttendance'
  //   | 'community'
  //   | 'special'
  //   | 'goodsDetail'
  type: string
  data?: string
  image?: string
}
/** 校验装修配置项 */
export const validateConfigItem = (item: Item) => {
  const { type, data, image } = item
  let msg = '',
    flag = true
  if (type === 'special' && !data) {
    msg = '请选择具体的专题页'
    flag = false
  } else if (type === 'goodsDetail' && !data) {
    msg = '请选择具体的商品'
    flag = false
  } else if (
    ![
      'none',
      'skipInvitation',
      'dailyAttendance',
      'live',
      'integralMall',
      'memberCenter',
      'dailyAttendance',
      'community'
    ].includes(type) &&
    !data
  ) {
    msg = '请选择具体跳转参数'
    flag = false
  } else if (!image) {
    msg = '请添加图片'
    flag = false
  }
  return {
    flag,
    msg
  }
}
