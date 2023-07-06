import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';
import Css from './Analysis.module.scss';
import { getBizCharts } from '@/utils/compatible';

const { TreemapChart } = getBizCharts()

export default props => {
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState({
    name: 'root',
    children: [
      { name: '分类 1', value: 560 },
      { name: '分类 2', value: 500 },
      { name: '分类 3', value: 150 },
      { name: '分类 4', value: 140 },
      { name: '分类 5', value: 115 },
      { name: '分类 6', value: 95 },
      { name: '分类 7', value: 90 },
      { name: '分类 8', value: 75 },
      { name: '分类 9', value: 98 },
      { name: '分r类 10', value: 60 },
      { name: '分类 11', value: 45 },
      { name: '分类 12', value: 40 },
      { name: '分类 13', value: 40 },
      { name: '分类 14', value: 35 },
      { name: '分类 15', value: 40 },
      { name: '分类 16', value: 40 },
      { name: '分类 17', value: 40 },
      { name: '分类 18', value: 30 },
      { name: '分类 19', value: 28 },
      { name: '分类 20', value: 16 },
    ],
  });

  useEffect(() => {}, [checked]);

  return (
    <div>
      <div className={Css['models-header']}>
        <div className={Css['models-header-title']}>
          用户机型分布<span className={Css['models-header-subTitle']}>前30%</span>
        </div>
        <div className={Css['models-header-radio']}>
          <Radio checked={checked} onClick={() => setChecked(!checked)}>
            仅看会员
          </Radio>
        </div>
      </div>
      <TreemapChart height={400} data={data} colorField="name" />
    </div>
  );
};
