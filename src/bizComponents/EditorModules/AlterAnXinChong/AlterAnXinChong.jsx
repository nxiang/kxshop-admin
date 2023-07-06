import React, { useState, useEffect } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import Css from './AlterAnXinChong.models.scss';
import LabelRadioGroup from '@/components/LabelRadioGroup/LabelRadioGroup';
import AlterHeader from '../Modules/AlterHeader/AlterHeader';

const { confirm } = Modal;

export default props => {
  const { alterDel, itemData } = props;

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

  const moduleRadioChange = (e) => {
    itemData.type = e.target.value;
    this.props.alterTrigger(itemData);
  }

  return (
    <div className={Css['alter-assist-ad-box']}>
      <AlterHeader title="支付宝安心充" alterDel={() => alterDel()} />
      <div className={Css['alter-content']}>
        <LabelRadioGroup
          label="卡片样式"
          value={itemData.type}
          radioList={[{id: 1, label: '独立卡片', value: 'card' }]}
          radioChange={(e)=>moduleRadioChange(e)}
        />
        <div className={Css['spec-tips']}>
          <div>说明:</div>
          <p>使用安心充组件前，请确保以下2点:</p>
          <p>1、当前租户已开通安心充能力</p>
          <p>2、当前小程序已添加”安心充插件“</p>
        </div>
      </div>
    </div>
  );
};
