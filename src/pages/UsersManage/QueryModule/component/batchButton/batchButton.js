/*
*   author:langyan
*   date：20200228
*  explain:  用户管理模块批量操作按钮组件
* */
import { Button } from 'antd';
import React from 'react';
import Css from './batchButton.module.scss';
import { showBut } from '@/utils/utils'

function BatchButton(props) {
  return (
    <div className={Css["screen-condition-operate"]}>
      { showBut('list', 'users_set') && <Button className={Css["operate-item"]} type="primary" onClick={() => props.batchButtonFun(1)}>批量设置标签</Button> }
      { showBut('list', 'users_coupon') && <Button className={Css["operate-item"]} type="primary" onClick={() => props.batchButtonFun(2)}>送优惠券</Button> }
    </div>
  );
}

export default BatchButton;
