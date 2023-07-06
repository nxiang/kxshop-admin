import React, { useState, useEffect } from 'react';
import Css from './PhotoPromotionGoods.module.scss';
import { floatObj } from '@/utils/utils';

export default function PhotoPromotionGoods(props) {
  const { itemData: { data: { imageSrc, itemName, salePrice }, discountedPrice } } = props;
  console.log('discountedPrice', discountedPrice)
  return (
    <div className={Css['photo-promotion-box']}>
      <div className={Css['photo-promotion-ctn']}>
        <img className={Css['photo-promotion-ctnImg']} src={imageSrc||'https://img.kxll.com/admin_manage/icon/decoration_default_img.png'} alt="" />
        <div className={Css['photo-promotion-info']}>
          <div className={Css['info-title']}>{itemName}</div>
          <div className={Css['info-price']}>
            {(discountedPrice||discountedPrice===0)?<span className={Css['red-price']}>
              优惠价：¥{ discountedPrice ? floatObj.divide(discountedPrice, 100).toFixed(2) : discountedPrice }
            </span>:''}
            {!discountedPrice&&discountedPrice!==0&&salePrice&&<span className={Css['red-price']}>¥{salePrice ? floatObj.divide(salePrice, 100).toFixed(2) : salePrice }</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
