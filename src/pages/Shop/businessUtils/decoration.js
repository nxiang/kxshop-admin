
import { dataSearch } from '@/services/shop';
import { cloneDeep } from 'lodash-es';
import {
  recommondItemTitleColor,
  picPropertiesArr,
} from '@/bizComponents/EditorTemplate/formatData';

// 用于装修数据变更，更改请注意全局查看各引用处使用的兼容
export const dealDecorationFn = async specialList => {
  const listLocation = [];
  const requestState = [];
  console.log('specialList==', specialList);
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
    'memberTask',
  ]
  specialList.forEach((item, index) => {
    if (!incluedsArr.includes(item.itemType)) {
      item.itemData.forEach((subItem, subIndex) => {
        if (
          (subItem?.type === 'goods' && subItem?.data != '') ||
          (subItem?.type === 'integral' && subItem?.data != '')
        ) {
          const listData = subItem.data.split(',');
          listLocation.push({
            type: subItem.type,
            listIndex: index,
            itemitemDataIndex: subIndex,
            startIndex: requestState.length,
            endIndex: requestState.length + listData.length,
          });
          if (Array.isArray(listData))
            listData.forEach(listItem => {
              requestState.push({
                type: subItem?.type,
                id: String(listItem),
              });
            });
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
            endIndex: requestState.length + 1,
          });
          requestState.push({
            type: subItem.type,
            id: String(subItem.data),
          });
        }
      });
    }

    // 兼容老数据
    if (item.itemType == 'recommend' && !item.itemTitleColor) {
      item.itemTitleColor = cloneDeep(recommondItemTitleColor);
    }
    if (item.itemType == 'integral' && !item.itemTitleColor) {
      item.itemTitleColor = cloneDeep(recommondItemTitleColor);
    }
    if (
      ['ad', 'images_ad', 'assist_ad', 'video', 'subscribe'].includes(item.itemType) &&
      !item.propertiesArr
    ) {
      item.propertiesArr = cloneDeep(picPropertiesArr);
    }
  });

  if (requestState.length > 0) {
    await dataSearch(requestState).then(res => {
      if (res.errorCode === '0') {
        listLocation.forEach(item => {
          const listData = res.data.slice(item.startIndex, item.endIndex);
          let newlistData;
          if (item.type === 'goods' || item.type === 'integral') {
            newlistData = listData.map(item => {
              return JSON.parse(item.value);
            });
          } else {
            // eslint-disable-next-line prefer-destructuring
            newlistData = listData[0];
          }
          specialList[item.listIndex].itemData[item.itemitemDataIndex].data = newlistData;
        });
      }
    });
  }
  console.log('-----');
  console.log('specialList', specialList);
  console.log('-----');
  return specialList || []
}

export const dealAdAndImagesAdData = (subItem) => {
  if (subItem.type === 'none') {
    return {
      ...subItem,
      data: '',
    };
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
      ...subItem,
    };
  }
  return {
    ...subItem,
    data: String(subItem?.data?.id || ''),
  };
}