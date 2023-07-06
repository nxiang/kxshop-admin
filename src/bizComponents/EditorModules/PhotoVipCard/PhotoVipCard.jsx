import React, { Component } from 'react';
import Css from './PhotoVipCard.module.scss';
import { getPropertiesArrData } from '@/utils/editorBusiUtils';

class PhotoVipCard extends Component {
  render() {
    const { itemData, propertiesArr } = this.props;
    let { hasPdTb, hasPdLR, hasRadius } = getPropertiesArrData(propertiesArr);
    return (
      <div
        className={`
      ${Css['photo-assis-ad-box']} 
      ${hasPdTb && Css['propPaddingTB']} 
      ${hasPdLR && Css['propPaddingLR']}
    `}
      >
        <img
          className={`${Css['assis-ad-img']} ${hasRadius && Css['propRadius']}`}
          src="https://img.kxll.com/admin_manage/vip.png"
          alt=""
        />
      </div>
    );
  }
}

export default PhotoVipCard;
