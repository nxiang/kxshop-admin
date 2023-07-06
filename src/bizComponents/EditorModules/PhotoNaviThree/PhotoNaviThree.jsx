import React, { useState, useMemo } from 'react';
import Css from './PhotoNaviThree.module.scss';

export default function PhotoNaviThree(props) {
  const { itemData, itemStyle } = props;
  return (
    <div className={Css['photo-nav-three-box']}>
      {itemData.map((item, index) => {
        return (
          <div className={Css['nav-item']} key={index}>
            {itemStyle === 1 && (
              <img
                className={Css['item-img']}
                src={
                  item.image === ''
                    ? 'https://img.kxll.com/admin_manage/icon/decoration_default_img.png'
                    : item.image
                }
                alt=""
              />
            )}
            {itemStyle === 2 && (
              <img
                className={Css['item-circle-img']}
                src={
                  item.image === ''
                    ? 'https://img.kxll.com/admin_manage/icon/decoration_default_img.png'
                    : item.image
                }
                alt=""
              />
            )}
            <p className={Css['item-text']}>{item.title}</p>
          </div>
        );
      })}
    </div>
  );
}
