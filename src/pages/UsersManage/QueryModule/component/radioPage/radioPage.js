/*
*   author:langyan
*   date：20200228
*  explain:  用户管理模单选组件
* */

import React from 'react';
import { Radio } from 'antd';
import Css from './radioPage.module.scss';

function RadioPage(props) {
  return (
    <Radio.Group className={Css["radio-group"]} value={Number(props.screenData.clientId)} buttonStyle="solid">
      {
        props.userSource.map((item) => {
          return (
            <Radio.Button
              className={Css["radio-button-wrapper"]}
              value={Number(item.clientId)}
              key={item.clientId}
              onChange={() => props.radioChange(item)}
            >{item.clientName}
            </Radio.Button>
          );
        })
      }
    </Radio.Group>
  );
}
export default RadioPage;
