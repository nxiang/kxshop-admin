import React from 'react';
import Css from './PhotoSignIn.module.scss';
import { getPropertiesArrData } from '@/utils/editorBusiUtils'

export default props => {
  const { propertiesArr } = props;
  const { hasPdTb, hasPdLR, hasRadius } = getPropertiesArrData(propertiesArr)
  return (
    <div  className={`
      ${Css['photo-alipay-mkt-box']}
      ${hasPdTb && Css['propPaddingTB']} 
      ${hasPdLR && Css['propPaddingLR']}
      ${hasRadius && Css['propRadius']}
    `}>
      <img 
        className={`
          ${hasRadius && Css['propRadius']}
        `} 
        src="https://img.kxll.com/admin_manage/signInImg.png" alt=""
      />
    </div>
  );
};
