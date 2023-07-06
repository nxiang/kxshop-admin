// 商品关键字选择
import React, { Component } from 'react';
import { Modal, Input } from 'antd';
import Css from './AlipayCouponSelect.module.scss';

class AlipayCouponSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyText: '',
      visible: false,
    };
  }

  empty(e) {
    this.props.alterData('');
    e.stopPropagation();
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value.trim(),
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
      keyText: this.props.itemData,
    });
  };

  handleOk = e => {
    let data = this.state.keyText;
    this.props.alterData(data);
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
    // const itemData = this.props.itemData
    console.log(itemData);
    return (
      <div className={Css['keyword-select-box']}>
        <div
          style={{ width: this.props.width ? `${this.props.width}px` : '238px' }}
          className={Css['selectInput']}
          onClick={this.showModal}
        >
          {itemData ? itemData : '请设置要跳转的模板'}
          {itemData ? (
            <img
              onClick={this.empty.bind(this)}
              className={Css['slesctImg']}
              src="https://img.kxll.com/admin_manage/del-icon.png"
            />
          ) : null}
        </div>
        <Modal
          title="支付宝会员模板设置"
          width={'674px'}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>请设置要跳转的支付宝会员模板ID</p>
          <Input
            type={'text'}
            placeholder={'请输入，256个字以内'}
            maxLength={256}
            value={this.state.keyText}
            name="keyText"
            onChange={this.onChange}
          />
        </Modal>
      </div>
    );
  }
}

export default AlipayCouponSelect;
