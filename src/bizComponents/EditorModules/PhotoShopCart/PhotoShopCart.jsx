import React, { Component } from 'react';
import Css from './PhotoShopCart.module.scss';

class ShopCart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { itemData } = this.props;
    return (
      <div className={Css['photo-shop-cart-box']}>
        <img className={Css['photo-shop-cart-img']} src={itemData.img||'https://img.kxll.com/admin_manage/icon/decoration_default_img.png'}></img>
        <div className={Css['photo-shop-cart-info']}>
          <div className={Css['cart-price']}>
            合计：<span className={Css['cart-price-num']}>¥99.99</span>
          </div>
          <div className={Css['coupon-and-carriage']}>
            <span className={`${Css['coupon-price']} ${Css['red']}`}>预估优惠: ¥20.00</span>
            <span className={Css['carriage']}>需另付9.9元运费</span>
          </div>
        </div>
        <div className={Css['photo-shop-cart-btn']}>去结算</div>
      </div>
    );
  }
}

export default ShopCart;
