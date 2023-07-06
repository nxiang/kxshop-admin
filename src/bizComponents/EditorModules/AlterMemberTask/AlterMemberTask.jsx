import React from 'react';
import { message, Modal } from 'antd';
import Css from './AlterMemberTask.models.scss';
import LabelRadioGroup from '@/components/LabelRadioGroup/LabelRadioGroup';
import AlterHeader from '../Modules/AlterHeader/AlterHeader';

const { confirm } = Modal;

export default props => {
  const { alterDel, propertiesArr, alterPropertiesArr } = props;
  
  const propertiesRadioChange = (index, e) =>  {
    propertiesArr[index].value = e.target.value;
    alterPropertiesArr(propertiesArr);
  }

  return (
    <div className={Css['alter-assist-ad-box']}>
      <AlterHeader title="任务列表" alterDel={() => alterDel()} />
        {propertiesArr &&
          propertiesArr.map((item, index) => {
            return (
              <LabelRadioGroup
                key={item.id}
                label={item.label}
                value={item.value}
                radioList={item.radioList}
                radioChange={(e) => propertiesRadioChange(index, e)}
              />
            );
          })}
    </div>
  );
};
