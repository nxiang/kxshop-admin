import React, { useState, useEffect } from 'react';
import Css from './PhotoShopInfo.module.scss';

export default function PhotoShopInfo(props) {
  const { itemData } = props;
  return (
    <div className={Css['photo-shop-info-box']}>
      <div className={Css['shop-info-box']}>
        <div className={Css['shop-info-title']}>
          <p className={Css['title-text']}>{itemData.shopName}</p>
          <img
            className={Css['icon-phone']}
            src="https://img.kxll.com/admin_manage/shop_info_phone.png"
            alt=""
          />
        </div>
        <div className={Css['shop-info-time']}>营业时间：{itemData.shopTime}</div>
        <div className={Css['shop-info-address']}>
          <img
            className={Css['icon-address']}
            src="https://img.kxll.com/admin_manage/shop_info_address.png"
            alt=""
          />
          <p className={Css['address-text']}>{itemData.shopAddress}</p>
        </div>
      </div>
    </div>
  );
}
