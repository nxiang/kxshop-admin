import React, { useState, useEffect } from 'react';
import reactCSS from 'reactcss';
import Css from './PhotoStyleBackground.module.scss';

export default function PhotoStyleBackground(props) {
  const {
    itemData: { backgroundImg, backgroundColor, backgroundType, antForestShow, shopShow },
  } = props;
  const styles = reactCSS({
    default: {
      color: {
        background: `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${
          backgroundColor.a
        })`,
      },
    },
  });
  return (
    <div className={Css['photo-style-back-box']}>
      {backgroundType == 1 && (
        <div className={Css['photo-style-back-img-box']}>
          <img
            draggable="false"
            className={Css['photo-style-back-img']}
            src={props.itemData.backgroundImg}
            alt=""
          />
        </div>
      )}
      {backgroundType == 2 && (
        <div className={Css['photo-style-back-color-box']} style={styles.color} />
      )}
    </div>
  );
}
