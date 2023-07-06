import React, { useState, useEffect } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import Css from './AlterShopInfo.module.scss';
import { Modal, message, Input } from 'antd';

const { confirm } = Modal;
const { TextArea } = Input;

export default function AlterShopInfo(props) {
  // 修改文本
  const alterText = e => {
    let itemData = props.itemData;
    if ([e.target.name] == 'shopPhone') {
      itemData = {
        ...itemData,
        [e.target.name]: e.target.value.replace(/[\u4E00-\u9FA5]|[A-Za-z]|'/g, ''),
      };
    } else {
      itemData = {
        ...itemData,
        [e.target.name]: e.target.value,
      };
    }
    props.alterTrigger(itemData);
  };

  // 删除当前模块
  const moduleDel = () => {
    confirm({
      title: '删除',
      content: '确定删除此模块吗',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        props.alterDel();
        message.success('模块删除成功');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const { itemData } = props;
  return (
    <div className={Css['alter-shop-info-box']}>
      <div className={Css['alter-header']}>
        <div className={Css['header-left']}>
          <p className={Css['header-left-title']}>店铺信息设置</p>
          {/* <p className={Css['header-left-text']}>*最多添加5张</p> */}
        </div>
        <div className={Css['header-right']} onClick={() => moduleDel()}>
          <DeleteOutlined className={Css['header-right-icon']} />
          <p className={Css['header-right-text']}>删除</p>
        </div>
      </div>
      <div className={Css['alter-content']}>
        <div className={Css['alter-content-item']}>
          <p className={Css['item-title']}>店铺名称:</p>
          <Input
            className={Css['item-input']}
            placeholder="请输入，最多12个字"
            maxLength={12}
            name="shopName"
            value={itemData.shopName}
            onChange={e => alterText(e)}
          />
        </div>
        <div className={Css['alter-content-item']}>
          <p className={Css['item-title']}>营业时间:</p>
          <Input
            className={Css['item-input']}
            placeholder="请输入，最多20个字"
            maxLength={20}
            name="shopTime"
            value={itemData.shopTime}
            onChange={e => alterText(e)}
          />
        </div>
        <div className={Css['alter-content-item']}>
          <p className={Css['item-title']}>店铺地址:</p>
          <TextArea
            className={Css['item-input']}
            placeholder="请输入，最多50个字"
            maxLength={50}
            style={{ height: 110 }}
            name="shopAddress"
            value={itemData.shopAddress}
            onChange={e => alterText(e)}
          />
        </div>
        <div className={Css['alter-content-item']}>
          <p className={Css['item-title']}>店铺电话:</p>
          <Input
            className={Css['item-input']}
            placeholder="请输入"
            maxLength={20}
            name="shopPhone"
            value={itemData.shopPhone}
            onChange={e => alterText(e)}
          />
        </div>
      </div>
    </div>
  );
}
