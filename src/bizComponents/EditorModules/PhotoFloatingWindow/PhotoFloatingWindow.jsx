import React from 'react';
import Css from './PhotoFloatingWindow.module.scss';

export default props => {
  const {
    itemData: { antForestShow, shopShow },
  } = props;
  return (
    <div className={Css['floating-box']}>
      {antForestShow && (
        <div className={Css['floating-item']}>
          <img
            className={Css['floating-item-img']}
            src="https://img.kxll.com/kxshop_uniapp/suspension/suspension-antforest.gif"
            alt=""
          />
        </div>
      )}
      {shopShow && (
        <div className={Css['floating-item']}>
          <img
            className={Css['floating-item-img']}
            src="https://img.kxll.com/kxshop_uniapp/suspension/suspension-shopping.png"
            alt=""
          />
        </div>
      )}
    </div>
  );
};
