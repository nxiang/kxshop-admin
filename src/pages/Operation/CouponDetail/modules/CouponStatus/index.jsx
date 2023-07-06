import React, { useState } from 'react';
import Css from './index.module.scss';
import { history } from '@umijs/max';
import { Space } from 'antd';

export default props => {
  // 优惠券状态0 待发布 1 已发布 2 已暂停 3 已结束 4 未开始 5 进行中
  const { status, isList } = props;
  return (
    <>
      {status === 0 && (
        <div className={Css['pendding']}>
          <Space align="center" size={3}>
            <div className={Css['cirRadio']} />
            <span className={`${Css['text']} ${isList && Css['list']}`}>待发布</span>
          </Space>
        </div>
      )}
      {status === 1 && (
        <div className={Css['success']}>
          <Space align="center" size={3}>
            <div className={Css['cirRadio']} />
            <span className={`${Css['text']} ${isList && Css['list']}`}>已发布</span>
          </Space>
        </div>
      )}
      {status === 2 && (
        <div className={Css['info']}>
          <Space align="center" size={3}>
            <div className={Css['cirRadio']} />
            <span className={`${Css['text']} ${isList && Css['list']}`}>已暂停</span>
          </Space>
        </div>
      )}
      {status === 3 && (
        <div className={Css['disabled']}>
          <Space align="center" size={3}>
            <div className={Css['cirRadio']} />
            <span className={`${Css['text']} ${isList && Css['list']}`}>已结束</span>
          </Space>
        </div>
      )}
      {status === 4 && (
        <div className={Css['toStart']}>
          <Space align="center" size={3}>
            <div className={Css['cirRadio']} />
            <span className={`${Css['text']} ${isList && Css['list']}`}>未开始</span>
          </Space>
        </div>
      )}
      {status === 5 && (
        <div className={Css['success']}>
          <Space align="center" size={3}>
            <div className={Css['cirRadio']} />
            <span className={`${Css['text']} ${isList && Css['list']}`}>进行中</span>
          </Space>
        </div>
      )}
    </>
  );
};
