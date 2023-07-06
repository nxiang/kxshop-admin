import React, { Component } from 'react';
import { Carousel } from 'antd';
import Css from './PhotoCouponAd.module.scss';

class PhotoCouponAd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carouselList: [],
    };
  }

  render() {
    const { itemData, itemStyle } = this.props;
    const carouselList = [];
    if (itemData.length) {
      for (let i = 1; i <= Math.ceil(itemData.length / 3); i++) {
        carouselList.push(i);
      }
    }
    return (
      <div className={Css['photo-coupon-ad-box']}>
        {itemData && itemData.length > 0 && itemStyle === 1 && (
          <Carousel dotPosition="bottom">
            {itemData.map((item, index) => {
              return (
                <div className={Css['coupon-img-box']} key={index}>
                  {item.image === '' ? (
                    <div className={Css['coupon-default-img']}>
                      <img
                        className={Css['default-img']}
                        src="https://img.kxll.com/admin_manage/icon/decoration_default_img.png"
                        alt=""
                        draggable="false"
                      />
                    </div>
                  ) : (
                    <img className={Css['coupon-img']} src={item.image} alt="" draggable="false" />
                  )}
                </div>
              );
            })}
          </Carousel>
        )}
        {itemData && itemData.length > 0 && itemStyle === 2 && (
          <div className={Css['coupon-three-img-box']}>
            <div className={Css['coupon-three-item-box']}>
              {itemData.map((item, index) => {
                return (
                  <div key={index}>
                    {item.image === '' ? (
                      <div className={Css['coupon-default-img']}>
                        <img
                          className={Css['default-img']}
                          src="https://img.kxll.com/admin_manage/icon/decoration_default_img.png"
                          alt=""
                          draggable="false"
                        />
                      </div>
                    ) : (
                      <img
                        className={Css['coupon-img']}
                        src={item.image}
                        alt=""
                        draggable="false"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          // <Carousel dotPosition='bottom'>
          //   {carouselList.map((item) => {
          //     return <div key={item}>
          //       <div className={Css["coupon-three-img-box"]}>
          //         {
          //           itemData[item * 3 - 3] ?
          //             <img className={Css["coupon-img"]} src={itemData[item * 3 - 3].image} alt="" /> :
          //             <div className={Css["coupon-default-img"]}>
          //               <img className={Css["default-img"]} src="https://img.kxll.com/admin_manage/icon/decoration_default_img.png" alt="" />
          //             </div>
          //         }
          //         {
          //           itemData[item * 3 - 2] ?
          //             <img className={Css["coupon-img"]} src={itemData[item * 3 - 2].image} alt="" /> :
          //             <div className={Css["coupon-default-img"]}>
          //               <img className={Css["default-img"]} src="https://img.kxll.com/admin_manage/icon/decoration_default_img.png" alt="" />
          //             </div>
          //         }
          //         {
          //           itemData[item * 3 - 1] ?
          //             <img className={Css["coupon-img"]} src={itemData[item * 3 - 1].image} alt="" /> :
          //             <div className={Css["coupon-default-img"]}>
          //               <img className={Css["default-img"]} src="https://img.kxll.com/admin_manage/icon/decoration_default_img.png" alt="" />
          //             </div>
          //         }
          //       </div>
          //     </div>
          //   })}
          // </Carousel>
        )}
      </div>
    );
  }
}

export default PhotoCouponAd;
