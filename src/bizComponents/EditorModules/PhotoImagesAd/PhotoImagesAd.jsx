import React from 'react';
import Css from './PhotoImagesAd.module.scss';
import { getPropertiesArrData } from '@/utils/editorBusiUtils'

export default function PhotoImagesAd(props) {
  const { itemData, itemStyle = 1, propertiesArr } = props;
  let { hasPdTb, hasPdLR, hasRadius } = getPropertiesArrData(propertiesArr)
  return (
    <div className={`
      ${Css['photo-images-ad-box']}
      ${itemStyle==5&&Css['scroll-photo-images-ad-box']}
      ${itemStyle==5 && hasRadius &&  Css['propRadius']}
      ${hasPdTb && Css['propPaddingTB']} 
      ${hasPdLR && Css['propPaddingLR']}
    `}>
      {itemData &&
        itemData.length > 0 &&
        itemData.map((item, index) => {
          return (
            <div key={index} className={`${Css['Carousel-img-box']} `}>
              {item.image ? (
                <img
                  className={`${Css['Carousel-img']} ${hasRadius && itemStyle!=5 && Css['propRadius']}`}
                  src={item.image}
                  alt=""
                />
              ) : (
                <div
                  className={`${Css['coupon-default-img']} ${hasRadius && itemStyle!=5 && Css['propRadius']}`}
                  style={{
                    height: { 1: 140, 2: 140, 3: 91, 4: 69 }[itemStyle],
                  }}
                >
                  <img
                    className={Css['default-img']}
                    src="https://img.kxll.com/admin_manage/icon/decoration_default_img.png"
                    alt=""
                  />
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
