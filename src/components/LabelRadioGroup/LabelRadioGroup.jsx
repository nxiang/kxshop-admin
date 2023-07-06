import React from 'react';
import { Radio } from 'antd';
import Css from './LabelRadioGroup.module.scss';

const LabelRadioGroup = ({ label, value, radioList, radioChange, otherSetting }) => {

  return (
    <div className={`${Css['radio-box-item']} ${otherSetting&&Css['otherSetting']}`}>
      <div className={Css['radio-title']}>{label}</div>
      <Radio.Group onChange={radioChange} value={value}>
        {radioList && radioList.map(item => {
          return (
            <Radio key={item.id} value={item.value}>{item.label}</Radio>
          );
        })}
      </Radio.Group>
    </div>
  )
};

export default LabelRadioGroup