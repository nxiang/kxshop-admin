import React, { useState, useEffect } from 'react';
import { Radio, DatePicker, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import Css from './Analysis.module.scss';
import { quantityStat, memberQuantity } from '@/services/queryUser';
import { getBizCharts } from '@/utils/compatible';

// externals兼容，import取不到的话，从window上取
const { Chart, LineAdvance } = getBizCharts()
const { RangePicker } = DatePicker;

export default props => {
  const { clientId = 1 } = props;
  // 用户类型列表
  const [tabList, setTabList] = useState([]);
  // 用户类型选择
  const [tabListSet, setTabListSet] = useState(0);
  // 时间访问
  const [timeSet, setTimeSet] = useState({
    type: 'DAY',
    startTime: undefined,
    endTime: undefined,
  });
  // 渲染折线图数据
  const [data, setData] = useState([]);

  useEffect(() => {
    quantityStatApi();
  }, [clientId]);

  useEffect(() => {
    if (tabList?.length > 0) {
      memberQuantityApi();
    }
  }, [tabList, tabListSet, timeSet]);

  const quantityStatApi = () => {
    quantityStat({ clientId }).then(res => {
      if (res?.success) {
        setTabList([
          {
            title: '日新增用户',
            userNum: res.data?.dayNewMemberQuantity,
            proportion: res.data?.dayNewMemberQuantityIncrease,
            name: 'dayNewMemberQuantity',
            tipsText: '访问小程序即为用户',
          },
          {
            title: '日新增注册',
            userNum: res.data?.dayRegisteredMemberQuantity,
            proportion: res.data?.dayRegisteredMemberQuantityIncrease,
            name: 'dayRegisteredMemberQuantity',
            tipsText: '通过授权或领取会员卡绑定手机号的用户为会员',
          },
          {
            title: '日注册转化率',
            userNum: res.data?.conversionRate,
            proportion: res.data?.conversionRateIncrease,
            name: 'conversionRate',
            tipsText: '新增会员/新增用户',
          },
          {
            title: '累计用户',
            userNum: res.data?.totalMemberQuantity,
            proportion: res.data?.totalMemberQuantityIncrease,
            name: 'totalMemberQuantity',
          },
          {
            title: '累计会员',
            userNum: res.data?.totalRegisteredMemberQuantity,
            proportion: res.data?.totalRegisteredMemberQuantityIncrease,
            name: 'totalRegisteredMemberQuantity',
          },
        ]);
      }
    });
  };

  const memberQuantityApi = () => {
    memberQuantity({
      clientId,
      analyzeScope: timeSet.type,
      beginDate: timeSet.startTime?.format('YYYY-MM-DD') || undefined,
      endDate: timeSet.endTime?.format('YYYY-MM-DD') || undefined,
      type: tabList[tabListSet].name,
    }).then(res => {
      if (res?.success) {
        setData(
          res.data.map(item => {
            return {
              type: item.name,
              value: Number(item.value),
            };
          })
        );
      }
    });
  };

  // 设置用户类型
  const tabItemSet = index => {
    setTabListSet(index);
    setTimeSet({
      type: 'DAY',
      startTime: undefined,
      endTime: undefined,
    });
  };

  // 设置搜索时间
  const setTime = e => {
    console.log(typeof e);
    if (typeof e == 'string') {
      setTimeSet({
        type: e,
        startTime: undefined,
        endTime: undefined,
      });
    }
    if (typeof e == 'object') {
      console.log(e);
      setTimeSet({
        type: 'CUSTOM',
        startTime: e[0],
        endTime: e[1],
      });
    }
  };

  return (
    <div>
      <div className={Css['models-header']}>
        <div className={Css['models-header-title']}>用户概览</div>
      </div>
      <div className={Css['user-set-tab-box']}>
        <div className={Css['user-set-tab']}>
          <div style={{ display: 'flex' }}>
            {tabList?.length > 0 &&
              tabList.map((item, index) => {
                return (
                  <div
                    className={`${Css['user-set-tab-item']} 
                      ${tabListSet == index && Css['user-set-tab-item-hover']}`}
                    key={item.title}
                    onClick={() => tabItemSet(index)}
                  >
                    <div className={Css['item-header']}>
                      {item.title}
                      {item?.tipsText && (
                        <Tooltip title={item.tipsText}>
                          <InfoCircleOutlined />
                        </Tooltip>
                      )}
                    </div>
                    <div className={Css['item-num']}>{item.userNum}</div>
                    <div className={Css['item-time']}>
                      较前日
                      {item.proportion?.indexOf('-') > -1 ? (
                        <span className={Css['item-time-proportion-green']}>{item.proportion}</span>
                      ) : (
                        <span className={Css['item-time-proportion']}>{item.proportion}</span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className={Css['models-header']}>
        <div className={Css['models-header-title']}>
          {{ DAY: '当日', WEEK: '近七天', MONTH: '近三十日', CUSTOM: '自定义时间' }[timeSet.type]}
        </div>
        <div className={Css['models-header-radio']}>
          日期范围：
          <Radio.Group
            options={[
              { label: '近一日', value: 'DAY' },
              { label: '近七日', value: 'WEEK' },
              { label: '近30日', value: 'MONTH' },
            ]}
            value={timeSet.type}
            onChange={e => setTime(e.target.value)}
            optionType="button"
          />
          <RangePicker
            className={timeSet.type == 4 && Css['range-picker-box-hover']}
            allowClear={false}
            inputReadOnly
            format="YYYY-MM-DD"
            value={[timeSet.startTime, timeSet.endTime]}
            onChange={e => setTime(e)}
          />
        </div>
      </div>
      <Chart
        padding={[10, 20, 50, 40]}
        autoFit
        height={400}
        data={data}
        // scale={{ value: { alias: '用户数', type: 'linear-strict' } }}
        scale={{
          value: {
            alias:
              tabList?.length > 0
                ? {
                    dayNewMemberQuantity: '用户数',
                    dayRegisteredMemberQuantity: '用户数',
                    conversionRate: '转化率',
                    totalMemberQuantity: '用户数',
                    totalRegisteredMemberQuantity: '会员数',
                  }[tabList[tabListSet].name]
                : '',
            type: 'linear-strict',
          },
        }}
      >
        <LineAdvance shape="smooth" point area position="type*value" />
      </Chart>
    </div>
  );
};
