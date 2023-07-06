import React, { useState, useEffect } from 'react';
import Css from './PhotoAnXinChong.module.scss';

export default props => {
  // const { itemData } = props;

  return (
    <div className={Css['photo-alipay-mkt-box']}>
      <img src="https://img.kxll.com/admin_manage/anXinChongImg.png" alt="" />
    </div>
  );
};
