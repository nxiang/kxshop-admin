import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from '@/utils/compatible'
import Css from './AddCoupon.module.scss';
import Panel from '@/components/Panel';

const listData = [
  {
    title: '系统优惠券',
    description: '线上商城内购买商品时直接抵扣使用',
    children: [
      {
        iconName: 'https://img.kxll.com/admin_manage/coupon-store-pay.png',
        itemTitle: '商城优惠券',
        itemDescription: '可在商城内部使用的优惠券，在下单页直接抵扣',
        path: '/operation/addCoupon/addMallCoupon',
      },
    ],
  },

  //   title: '支付优惠券',
  //   description: '线上商城内购买商品时直接抵扣使用',
  //   children: [
  //     {
  //       iconName: 'https://img.kxll.com/admin_manage/coupon-wechat-pay.png',
  //       itemTitle: '微信支付优惠劵',
  //       itemDescription: '使用微信支付付款时直接抵扣，支持线上线下消费',
  //       path: '/addMallCoupon'
  //     },
  //     {
  //       iconName: 'https://img.kxll.com/admin_manage/coupon-alipay-pay.png',
  //       itemTitle: '支付宝支付优惠券',
  //       itemDescription: '使用支付宝支付付款时直接抵扣，支持线上线下消费',
  //       path: '/aliPayCoupon/add'
  //     }
  //   ]
  // }
];

class AddCoupon extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Panel title="新建优惠券" content="新建系统优惠券或支付优惠券，快速拓展老客维护">
        <div className={Css['add-coupon-box']}>
          <div className={Css['coupon-content-box']}>
            {listData.map((item, index) => {
              return (
                <div key={index}>
                  <div className={Css['content-header']}>
                    <div className={Css['blue-box']} />
                    <p className={Css['header-text']}>{item.title}</p>
                  </div>
                  <div className={Css['content-description']}>{item.description}</div>
                  <div className={Css['coupon-item-box']}>
                    {item.children &&
                      item.children.length > 0 &&
                      item.children.map((item, index) => {
                        return (
                          <Link to={item.path} className={Css['item-box']} key={index}>
                            <img className={Css['item-icon']} src={item.iconName} alt="" />
                            <p className={Css['item-title']}>{item.itemTitle}</p>
                            <p className={Css['item-description']}>{item.itemDescription}</p>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>
    );
  }
}

export default withRouter(AddCoupon);
