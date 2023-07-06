import React, { useState, useEffect } from 'react';
import { Col, Radio, Row, Modal, InputNumber, Select, message } from 'antd';

import { memberPointsRuleEdit } from '@/services/member';

const { Option } = Select;

export default props => {
  const { visible = false, incomingData = '', confirmConfig = {}, setVisible = {} } = props;
  const [radioSelect, setRadioSelect] = useState('-1');
  const [timeValue, setTimeValue] = useState('YEAR');
  const [timeNum, setTimeNum] = useState(1);

  useEffect(() => {
    if (visible) {
      if (incomingData == -1) {
        setRadioSelect('-1');
        setTimeValue('YEAR');
        setTimeNum(1);
      }
      if (incomingData.indexOf('Y') > -1) {
        setRadioSelect('0');
        setTimeValue('YEAR');
        setTimeNum(incomingData.substring(0, incomingData.indexOf('Y')));
      }
      if (incomingData.indexOf('M') > -1) {
        setRadioSelect('0');
        setTimeValue('MONTH');
        setTimeNum(incomingData.substring(0, incomingData.indexOf('M')));
      }
      if (incomingData.indexOf('D') > -1) {
        setRadioSelect('0');
        setTimeValue('DAY');
        setTimeNum(incomingData.substring(0, incomingData.indexOf('D')));
      }
    }
  }, [visible]);

  useEffect(() => {
    switch (timeValue) {
      case 'YEAR':
        if (timeNum > 3) setTimeNum(3);
        break;
      case 'MONTH':
        if (timeNum > 18) setTimeNum(18);
        break;
      case 'DAY':
        if (timeNum > 365) setTimeNum(365);
        break;
    }
  }, [timeValue]);

  const setData = () => {
    let data;
    if (radioSelect == -1) {
      data = -1;
    } else {
      switch (timeValue) {
        case 'YEAR':
          data = `${timeNum}Y`;
          break;
        case 'MONTH':
          data = `${timeNum}M`;
          break;
        case 'DAY':
          data = `${timeNum}D`;
          break;
      }
    }
    memberPointsRuleEdit({
      ruleKey: 'EXPIRES_LIMIT',
      ruleValue: data,
    }).then(res => {
      if (res?.success) {
        message.success('积分有效期设置成功');
        confirmConfig();
      }
    });
  };

  const numLimit = {
    max: { YEAR: 3, MONTH: 18, DAY: 365 }[timeValue],
    min: 1,
  };

  return (
    <Modal
      width={800}
      title="配置积分有效期"
      visible={visible}
      onCancel={() => setVisible(false)}
      okText="保存"
      onOk={() => setData()}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Radio checked={radioSelect == '-1'} onClick={() => setRadioSelect('-1')} />
          永久有效
        </Col>
        <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
          <Radio checked={radioSelect == '0'} onClick={() => setRadioSelect('0')} />
          每笔积分有效期为
          <InputNumber
            {...numLimit}
            style={{ margin: '0 8px' }}
            precision={0}
            value={timeNum}
            onChange={e => setTimeNum(e)}
          />
          <Select style={{ width: 80 }} value={timeValue} onChange={e => setTimeValue(e)}>
            <Option value="YEAR">年</Option>
            <Option value="MONTH">月</Option>
            <Option value="DAY">日</Option>
          </Select>
        </Col>
        <div style={{ marginLeft: 32 }}>
          * “年” 支持1-3年，“月” 支持1-18个月，“日” 支持1-365日。
        </div>
      </Row>
    </Modal>
  );
};
