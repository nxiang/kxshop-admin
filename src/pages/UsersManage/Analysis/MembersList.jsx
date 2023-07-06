import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';
import Css from './Analysis.module.scss';

import { analyzeSex, analyzeAge, openCardSource } from '@/services/queryUser';
import { getBizCharts } from '@/utils/compatible';

const { Chart, Axis, Interval, Tooltip, Coordinate, Legend } = getBizCharts()

export default props => {
  const { clientId = 1 } = props;
  const [type, setType] = useState(undefined);
  const [genderData, setGenderData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [entranceData, setEntranceData] = useState([
    {
      name: 'John',
      vote: 35654,
    },
    {
      name: 'Damon',
      vote: 65456,
    },
    {
      name: 'Patrick',
      vote: 45724,
    },
  ]);

  useEffect(() => {
    analyzeSexApi();
    analyzeAgeApi();
    openCardSourceApi();
  }, []);

  const analyzeSexApi = () => {
    analyzeSex({
      clientId,
    }).then(res => {
      if (res?.success) {
        setGenderData(
          res.data.map(item => {
            return {
              type: item.name,
              value: Number(item.value),
              percent: item.percent,
            };
          })
        );
      }
    });
  };

  const analyzeAgeApi = () => {
    analyzeAge({
      clientId,
    }).then(res => {
      if (res?.success) {
        setAgeData(
          res.data.map(item => {
            return {
              type: item.name,
              value: Number(item.value),
              percent: item.percent,
            };
          })
        );
      }
    });
  };

  const openCardSourceApi = () => {
    openCardSource({
      clientId,
    }).then(res => {
      if (res?.success) {
        setEntranceData(
          res.data.map(item => {
            return {
              name: item.name,
              vote: Number(item.value),
            };
          })
        );
      }
    });
  };

  return (
    <div>
      <div className={Css['models-header']}>
        <div className={Css['models-header-title']}>会员分析</div>
        {/* <div className={Css['models-header-radio']}>
          <Radio.Group
            options={[
              { label: '全部', value: undefined },
              { label: '仅看会员访问', value: 1 },
              { label: '领券地区分布', value: 2 },
            ]}
            value={type}
            onChange={e => setType(e.target.value)}
          />
        </div> */}
      </div>
      <div className={Css['models-analysis-box']}>
        <div className={Css['models-analysis-item']}>
          <h4 className={Css['subTitle']}>会员性别</h4>
          <Chart height={306} data={genderData} autoFit>
            <Coordinate type="theta" radius={0.75} />
            <Tooltip showTitle={false} />
            <Axis visible={false} />
            <Interval
              position="value"
              adjust="stack"
              color="type"
              style={{
                lineWidth: 1,
                stroke: '#fff',
              }}
              label={[
                'count',
                {
                  content: data => {
                    return `${data.type}: ${data.percent}%`;
                  },
                },
              ]}
            />
            <Legend name="type" position="right" />
          </Chart>
        </div>
        <div className={Css['models-analysis-item']}>
          <h4 className={Css['subTitle']}>会员年龄占比</h4>
          <Chart height={306} data={ageData} autoFit>
            <Coordinate type="theta" radius={0.75} />
            <Tooltip showTitle={false} />
            <Axis visible={false} />
            <Interval
              position="value"
              adjust="stack"
              color="type"
              style={{
                lineWidth: 1,
                stroke: '#fff',
              }}
              label={[
                'count',
                {
                  content: data => {
                    return `${data.type}: ${data.percent}%`;
                  },
                },
              ]}
            />
            <Legend name="type" position="right" />
          </Chart>
        </div>
        <div className={Css['models-header']}>
          <div className={Css['models-header-title']}>开卡入口分析</div>
        </div>
        <div className={Css['models-analysis-item-long']}>
          <Chart
            data={entranceData}
            padding={[60, 20, 40, 60]}
            scale={{
              vote: {
                min: 0,
              },
            }}
            autoFit
            height={300}
          >
            <Axis name="vote" labels={null} title={null} line={null} tickLine={null} />
            <Interval
              position="name*vote"
              color={['name', ['#7f8da9', '#fec514', '#db4c3c', '#daf0fd']]}
            />
            <Legend name="name" offsetY={8} />
            <Tooltip />
          </Chart>
        </div>
      </div>
    </div>
  );
};
