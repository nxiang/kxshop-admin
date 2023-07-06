import React, { Component } from 'react';
import { Carousel } from 'antd';
import Css from './PhotoAd.module.scss';
import { getPropertiesArrData } from '@/utils/editorBusiUtils'

class PhotoAd extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { itemData, itemStyle, propertiesArr } = this.props;
    let { hasPdTb, hasPdLR, hasRadius } = getPropertiesArrData(propertiesArr)
    let imgW = '100%';

    return (
      <div className={`
        ${Css['photo-ad-box']} 
        ${hasPdTb && Css['propPaddingTB']} 
        ${hasPdLR && Css['propPaddingLR']}
      `}>
        {itemData && itemData.length > 0 && (
          <Carousel dotPosition="bottom" autoplay>
            {itemData.map((item, index) => {
              return (
                <div key={index} className={Css['Carousel-img-box']}>
                  {item.image ? (
                    <img
                      className={`${Css['Carousel-img']} ${hasRadius && Css['propRadius']}`}
                      src={item.image}
                      alt=""
                      style={{ width: imgW }}
                    />
                  ) : (
                    <div
                      className={`${Css['coupon-default-img']} ${hasRadius && Css['propRadius']}`}
                      style={{ width: imgW, height: '170px' }}
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
          </Carousel>
        )}
      </div>
    );
  }
}

export default PhotoAd;
