/*
*   author:langyan
*   date：20200228
*  explain:  用户管理模用户分类组件
* */
import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import Css from './useClassify.module.scss'

function UseClassify(prop) {
  return (
    <div className={Css["use-classify"]}>
      {
        prop.useClassifyNum.map((item) => {
          return (
            <div
              className={prop.screenData.label === item.code ? `${Css["use-classify-item"]} ${Css["use-classify-item-hover"]}` : Css["use-classify-item"]}
              key={item.name}
              onClick={() => prop.useClassifyClick(item)}
            >
              <Tooltip title={item.tipsText}>
                <div className={Css["use-text-box"]}>
                  <p className={Css["use-classify-tag"]}>{item.name}</p>
                  <InfoCircleOutlined />
                </div>
              </Tooltip>
              <b className={Css["user-classify-b"]}>{item.num}</b>
            </div>
          );
        })
      }

    </div>
  );
}

export default UseClassify;
