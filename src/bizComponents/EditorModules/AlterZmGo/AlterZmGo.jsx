import React, { useState, useEffect } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { message, Modal, Input } from 'antd';
import Css from './AlterZmGo.models.scss';
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

  const thirdAppIdChange = (e) => {
    props.itemData.thirdAppId = e.target.value;
    props.alterTrigger(itemData);
  }

  return (
    <div className={Css['alter-assist-ad-box']}>
      <AlterHeader title="芝麻Go" alterDel={() => alterDel()} />
      <div className={Css['alter-content']}>
        <div className={Css['item-rows']} >
          <div className="label">活动AppId：</div>
          <Input
            value={ itemData.thirdAppId }
            style={{ width: '150px' }}
            placeholder='请输入活动AppId'
            onChange={(e)=>thirdAppIdChange(e)}
          />
        </div>
        <div className={Css['error']}>注：芝麻Go组件，仅引入芝麻Go的展示区域</div>
        <div className={Css['normal']}>具体展示的芝麻Go活动信息，请按照文档步骤完成配置</div>
        <a className={Css['link']} href='https://otn2hbu6hn.feishu.cn/docx/doxcnQxEZULB30UcM2C0yJg8ICb' target="_blank">查看配置文档</a>
      </div>
    </div>
  );
};
