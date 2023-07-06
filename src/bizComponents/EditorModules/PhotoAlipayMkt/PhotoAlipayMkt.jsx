import React, { useState, useEffect } from 'react';
import Css from './PhotoAlipayMkt.module.scss';

export default props => {
  // const { itemData } = props;

  return (
    <div className={Css['photo-alipay-mkt-box']}>
      <img src="https://img.kxll.com/admin_manage/icon/icon_alipay_mkt.jpg" alt="" />
    </div>
  );
};
