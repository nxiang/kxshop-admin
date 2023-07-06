// 商品关键字选择
import React, { Component } from 'react';
import { Modal, Input, Radio } from 'antd';
import Css from './AlipayCouponSelect.module.scss';

class AlipayCouponSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      couponText: '',
      couponType: '1',
      couponCardUrl: '',
      visible: false,
    };
  }

  empty(e) {
    this.props.alterData({
      couponText: '',
      couponType: '1',
      couponCardUrl: '',
    });
    e.stopPropagation();
  }

  onChange = e => {
    this.setState({
      [e.target.name]: String(e.target.value).trim(),
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
      couponText: this.props.itemData?.couponText?.length > 0 ? this.props.itemData.couponText : '',
      couponType: this.props.itemData?.couponType ? this.props.itemData.couponType : '1',
      couponCardUrl:
        this.props.itemData?.couponCardUrl?.length > 0 ? this.props.itemData.couponCardUrl : '',
    });
  };

  handleOk = e => {
    const { couponText, couponType, couponCardUrl } = this.state;
    this.props.alterData({
      couponText,
      couponType,
      couponCardUrl,
    });
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { itemData } = this.props;
    const { couponText, couponType, couponCardUrl } = this.state;
    return (
      <div className={Css['keyword-select-box']}>
        <div
          style={{ width: this.props.width ? `${this.props.width}px` : '238px' }}
          className={Css['selectInput']}
          onClick={this.showModal}
        >
          {itemData?.couponText?.length > 0 ? itemData.couponText : '请选择要跳转的内容'}
          {itemData?.couponText?.length > 0 ? (
            <img
              onClick={this.empty.bind(this)}
              className={Css['slesctImg']}
              src="https://img.kxll.com/admin_manage/del-icon.png"
            />
          ) : null}
        </div>
        <Modal
          title="支付宝优惠券链接设置"
          width={674}
          visible={this.state.visible}
          // visible={true}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p className={Css['alipay-coupon-modal-title']}>请设置要跳转的支付宝优惠券链接</p>
          <Input
            type="text"
            style={{ marginBottom: 16 }}
            placeholder="请输入，256个字以内"
            maxLength={256}
            value={this.state.couponText}
            name="couponText"
            onChange={this.onChange}
          />
          <p className={Css['alipay-coupon-modal-title']}>领取条件</p>
          <p className={Css['alipay-coupon-modal-subtitle']}>注册会员</p>
          <div className={Css['alipay-coupon-modal-item-box']}>
            <Radio.Group value={couponType} name="couponType" onChange={this.onChange}>
              <Radio value="1">开通会员卡注册</Radio>
              <Radio value="2">授权手机号注册</Radio>
            </Radio.Group>
          </div>
          {couponType == '1' && (
            <div>
              <p className={`${Css['alipay-coupon-modal-item-box']} ${Css['text-grey']}`}>
                用户领取支付宝会员卡完成注册后可领取优惠券（需事先创建会员卡）
              </p>
              <Input
                type="text"
                placeholder="请输入会员卡模板ID，32个字以内"
                value={couponCardUrl}
                maxLength={32}
                name="couponCardUrl"
                onChange={this.onChange}
              />
            </div>
          )}
          {couponType == '2' && (
            <div>
              <p className={`${Css['alipay-coupon-modal-item-box']} ${Css['text-grey']}`}>
                选择后点击领卡弹出手机号授权完成会员注册，如下图所示，已授权手机号或通过开卡获取手机号的用户不会重复发起授权
              </p>
              <img
                style={{ width: 480 }}
                src="https://img.kxll.com/admin_manage/zfb_authorization_demo.png"
              />
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

export default AlipayCouponSelect;
