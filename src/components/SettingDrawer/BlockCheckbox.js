import React from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import style from './index.less';

const BlockCheckbox = ({ value, onChange, list }) => (
  <div className={style.blockChecbox} key={value}>
    {list.map(item => (
      <Tooltip title={item.title} key={item.key}>
        <div className={style.item} onClick={() => onChange(item.key)}>
          <img src={item.url} alt={item.key} />
          <div
            className={style.selectIcon}
            style={{
              display: value === item.key ? 'block' : 'none',
            }}
          >
            <CheckOutlined />
          </div>
        </div>
      </Tooltip>
    ))}
  </div>
);

export default BlockCheckbox;
