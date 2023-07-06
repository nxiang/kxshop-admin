import React, { useState, useEffect } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import Css from './AlterAlipayMkt.models.scss';

const { confirm } = Modal;

export default props => {
  const { alterDel } = props;

  const moduleDel = () => {
    const that = this;
    confirm({
      title: '删除',
      content: '确定删除此模块吗',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        alterDel();
        message.success('模块删除成功');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <div className={Css['alter-assist-ad-box']}>
      <div className={Css['alter-header']}>
        <div className={Css['header-left']}>
          <p className={Css['header-left-title']}>支付宝劵组件</p>
        </div>
        <div className={Css['header-right']} onClick={() => moduleDel()}>
          <DeleteOutlined className={Css['header-right-icon']} />
          <p className={Css['header-right-text']}>删除</p>
        </div>
      </div>
      <div className={Css['alter-content']}>
        添加后请在支付宝中设置在本小程序中推广优惠券，即可在该组件中展示优惠券
      </div>
    </div>
  );
};
