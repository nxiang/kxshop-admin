import React, { useState, useEffect } from 'react';
import Panel from '@/components/Panel';
import { QuestionCircleFilled } from '@ant-design/icons';
import { Col, PageHeader, Row, Table, Tooltip } from 'antd';
import Css from './IntegralRights.module.scss';
import Columns from './columns';
import ExpiresLimitModal from './ExpiresLimitModal';
import DayUpperLimitModal from './DayUpperLimitModal';
import ExchangeRateModal from './ExchangeRateModal';

import { memberPointsRuleDetail } from '@/services/member';

export default props => {
  const [headerList, setHeaderList] = useState([]);
  const [listData, setListData] = useState([]);

  // 积分有效期弹框参数
  const [limitVisible, setLimitVisible] = useState(false);
  // 积分获取上限弹框参数
  const [dayUpperVisible, setDayUpperVisible] = useState(false);
  // 积分获取上限弹框参数
  const [rateVisible, setRateVisible] = useState(false);
  // 统一传入data
  const [incomingData, setIncomingData] = useState('');

  useEffect(() => {
    memberPointsRuleDetailApi();
  }, []);

  const memberPointsRuleDetailApi = () => {
    memberPointsRuleDetail().then(res => {
      if (res?.success) {
        setHeaderList([
          {
            num: res.data.stat.totalAvailablePoints,
            title: '可用积分',
            tooltipText: '店铺会员可用积分总和',
          },
          {
            num: res.data.stat.totalSentPoints,
            title: '累计发放积分',
            tooltipText: '店铺发放的积分总和',
          },
          {
            num: res.data.stat.totalExpiredPoints,
            title: '已过期积分',
            tooltipText: '店铺过期的全部积分',
          },
          {
            num: res.data.stat.totalConsumedPoints,
            title: '累计消耗积分',
            tooltipText: '积分兑换消耗总和',
          },
          {
            num: res.data.stat.consumedRate,
            title: '积分消耗率',
            tooltipText: '累计消耗积分/累计发放积分',
          },
        ]);
        setListData(res.data.ruleList);
      }
    });
  };

  const setRules = record => {
    switch (record.ruleKey) {
      case 'EXPIRES_LIMIT':
        setLimitVisible(true);
        setIncomingData(record.ruleValue);
        break;
      case 'DAY_UPPER_LIMIT':
        setDayUpperVisible(true);
        setIncomingData(record.ruleValue);
        break;
      case 'EXCHANGE_RATE':
        setRateVisible(true);
        setIncomingData(record.ruleValue);
        break;
    }
  };

  // 确认内容，刷新列表
  const confirmConfig = () => {
    setLimitVisible(false);
    setDayUpperVisible(false);
    setRateVisible(false);
    memberPointsRuleDetailApi();
  };

  return (
    <Panel title="积分权益" content="积分展示和积分规则配置">
      <PageHeader style={{ backgroundColor: '#fff' }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div className={Css['header-box']}>
              {headerList?.length > 0 &&
                headerList.map(item => {
                  return (
                    <div className={Css['header-item']} key={item.title}>
                      <div className={Css['header-item-num']}>{item.num}</div>
                      <Tooltip title={item.tooltipText}>
                        <div className={Css['header-item-title']}>
                          {item.title}
                          <QuestionCircleFilled className={Css['header-item-icon']} />
                        </div>
                      </Tooltip>
                    </div>
                  );
                })}
            </div>
          </Col>
          <Col span={24}>
            <Table
              rowKey="ruleKey"
              columns={Columns.integralScope({ setRules })}
              dataSource={listData}
            />
          </Col>
        </Row>
      </PageHeader>
      <ExpiresLimitModal
        visible={limitVisible}
        incomingData={incomingData}
        setVisible={setLimitVisible}
        confirmConfig={confirmConfig}
      />
      <DayUpperLimitModal
        visible={dayUpperVisible}
        incomingData={incomingData}
        setVisible={setDayUpperVisible}
        confirmConfig={confirmConfig}
      />
      <ExchangeRateModal
        visible={rateVisible}
        incomingData={incomingData}
        setVisible={setRateVisible}
        confirmConfig={confirmConfig}
      />
    </Panel>
  );
};
