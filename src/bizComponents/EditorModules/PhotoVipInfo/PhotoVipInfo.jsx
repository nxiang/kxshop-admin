import React, { Component } from 'react';
import Css from './PhotoVipInfo.module.scss';
import { getPropertiesArrData } from '@/utils/editorBusiUtils';

class PhotoVipInfo extends Component {
  render() {
    const { itemData, propertiesArr } = this.props;
    console.log('itemdata', itemData);
    console.log('backgroundColor=', itemData.backgroundColor);
    let { hasPdTb, hasPdLR, hasRadius } = getPropertiesArrData(propertiesArr);
    return (
      <div
        className={`
        ${Css['content']} 
        ${hasPdTb && Css['propPaddingTB']} 
        ${hasPdLR && Css['propPaddingLR']}
        ${hasRadius && Css['propRadius']}
        `}
        style={{
          background: `${
            itemData.backgroundType == 2
              ? `rgba(${itemData.backgroundColor.r},${itemData.backgroundColor.g},${
                  itemData.backgroundColor.b
                },${itemData.backgroundColor.a})`
              : `url(${itemData.image}) no-repeat 100%`
          }`
        }}
      >
        <div className={`${Css['assis-ad-img']}`}>
          <div className={Css.contentLeft}>
            <div className={Css.leftImgBox}>
              <img
                className={Css.contentimg}
                src="https://img.kxll.com/kxshop_uniapp/morentouxiang.png"
                alt=""
              />
            </div>
            <div className={Css.usersinfo}>
              <span>用户昵称</span>
              <span>白银</span>
            </div>
          </div>
          <div className={Css.contentRight}>
            {itemData.integ == 1 ? (
              <div>
                <div className={Css.contentSign}>
                  <span>积分</span>
                  <span>11</span>
                </div>
              </div>
            ) : null}
            {itemData.balance == 1 ? (
              <div>
                <div className={Css.contentBalance}>
                  <span>余额</span>
                  <span>11</span>
                </div>
              </div>
            ) : null}
            {itemData.coupon == 1 ? (
              <div>
                <div className={Css.contentCoupon}>
                  <span>优惠券</span>
                  <span>立即领券</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default PhotoVipInfo;
