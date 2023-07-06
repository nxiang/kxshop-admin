import React, { useState, useEffect, useRef, useMemo } from 'react';
import Css from './index.module.scss';
import OssUpload from '../OssUpload';
import { Space } from 'antd';

export default props => {
  const {
    value = [], // vmodel的值（资源的url）eg: ['http://xxx.jpg']
    widthPx, // 上传器的宽度 （widthPx和heightPx，选一必传）eg:'100px'
    heightPx, // 上传器的高度 （widthPx和heightPx，选一必传）eg:'100px'
    limitSize = 2, // 以M为单位，若限制为100K则传入 0.1 eg: 0.1
    hasClose = true, // 是否存在删除
    limitFormat = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'], // 限制的类型，mdn:https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
    resolvingPower = [], // 分辨率限制
    onChange = () => {}, // 变化事件
    limitNum = 1, // 上传张数限制
    disabled = false, // 禁用
  } = props;

  const ossUploadProps = {
    widthPx,
    heightPx,
    limitSize,
    hasClose,
    limitFormat,
    resolvingPower,
    disabled
  };

  const touchOnchange = (e, index) => {
    console.log(e, index);
    if(e) {
      value[index] = e
    } else {
      value.splice(index, 1)
    }
    console.log('value', value);
    onChange(value);
  };

  return (
    <div className={Css['item-img-box']}>
      <Space>
        {value.map((item, index) => {
          return (
            <OssUpload key={index} {...ossUploadProps} value={item} onChange={e => touchOnchange(e, index)} />
          );
        })}
        {value.length >= limitNum ? (
          ''
        ) : (
          <OssUpload key={666} {...ossUploadProps} onChange={e => touchOnchange(e, value.length)} />
        )}
      </Space>
    </div>
  );
};
