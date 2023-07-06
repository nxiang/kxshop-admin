import React from 'react';
import { message, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Css from './AlterHeader.module.scss';

const { confirm } = Modal;

export default ({ title = '', subTitle = '', alterDel }) => {
  const moduleDel = () => {
    confirm({
      title: '删除',
      content: '确定删除此模块吗',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        message.success('模块删除成功');
        alterDel()
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <div className={Css['alter-header']}>
      <div className={Css['header-left']}>
        <p className={Css['header-left-title']}>{title}</p>
        {subTitle && <p className={Css['header-left-text']}>{subTitle}</p>}
      </div>
      <div className={Css['header-right']} onClick={() => moduleDel()}>
        <DeleteOutlined className={Css['header-right-icon']} />
        <p className={Css['header-right-text']}>删除</p>
      </div>
    </div>
  );
};
