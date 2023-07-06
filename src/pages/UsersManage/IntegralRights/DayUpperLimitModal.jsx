import { Col, Radio, Row, Modal, InputNumber, message } from 'antd';
import React, { useState, useEffect } from 'react';

import { memberPointsRuleEdit } from '@/services/member';

export default props => {
  const { visible = false, incomingData = '', confirmConfig = {}, setVisible = {} } = props;
  const [radioSelect, setRadioSelect] = useState('-1');
  const [timeNum, setTimeNum] = useState(1);

  useEffect(() => {
    if (visible) {
      if (incomingData == -1) {
        setRadioSelect('-1');
        setTimeNum(1);
      } else {
        setRadioSelect('0');
        setTimeNum(incomingData);
      }
    }
  }, [visible]);

  const setData = () => {
    let data;
    if (radioSelect == -1) {
      data = -1;
    } else {
      data = timeNum;
    }
    memberPointsRuleEdit({
      ruleKey: 'DAY_UPPER_LIMIT',
      ruleValue: data,
    }).then(res => {
      if (res?.success) {
        message.success('每日获取上限设置成功');
        confirmConfig();
      }
    });
  };

  return (
    <Modal
      width={800}
      title="配置积分获取上限"
      visible={visible}
      onCancel={() => setVisible(false)}
      okText="保存"
      onOk={() => setData()}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Radio checked={radioSelect == '-1'} onClick={() => setRadioSelect('-1')} />
          不限制
        </Col>
        <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
          <Radio checked={radioSelect == '0'} onClick={() => setRadioSelect('0')} />
          每个会员每日获取积分奖励上限为
          <InputNumber
            min={0}
            max={99999}
            precision={0}
            style={{ margin: '0 8px' }}
            value={timeNum}
            onChange={e => setTimeNum(e)}
          />
        </Col>
        <div style={{ marginLeft: 32 }}>*仅针对每购买金额X元、每成功交易X笔赠送的积分有效</div>
      </Row>
    </Modal>
  );
};
