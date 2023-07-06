import React, { Component } from 'react';
import Css from './PhotoAssistAd.module.scss';
import { getPropertiesArrData } from '@/utils/editorBusiUtils'

class PhotoAssistAd extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { itemData, propertiesArr } = this.props;
    let { hasPdTb, hasPdLR, hasRadius } = getPropertiesArrData(propertiesArr)
    return (
      <div className={`
        ${Css['photo-assis-ad-box']} 
        ${hasPdTb && Css['propPaddingTB']} 
        ${hasPdLR && Css['propPaddingLR']}
      `}>
        {itemData[0].image ? (
          <img className={`${Css['assis-ad-img']} ${hasRadius && Css['propRadius']}`} src={itemData[0].image} alt="" />
        ) : (
          <div className={`${Css['coupon-default-img']} ${hasRadius && Css['propRadius']}`}>
            <img
              className={Css['default-img']}
              src="https://img.kxll.com/admin_manage/icon/decoration_default_img.png"
              alt=""
            />
            <p className={Css['default-text']}>请在右侧编辑模块内容</p>
          </div>
        )}
      </div>
    );
  }
}

export default PhotoAssistAd;
