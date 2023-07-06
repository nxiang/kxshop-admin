import React, { useState, useEffect } from 'react';
import { Col, Radio, Row, Modal, InputNumber, Select, message } from 'antd';

import { memberPointsRuleEdit } from '@/services/member';

export default props => {
  const { visible = false, incomingData = '', confirmConfig = {}, setVisible = {} } = props;
  const [timeNum, setTimeNum] = useState(1);

  useEffect(() => {
    if (visible) {
      setTimeNum(incomingData);
    }
  }, [visible]);

  const setData = () => {
    memberPointsRuleEdit({
      ruleKey: 'EXCHANGE_RATE',
      ruleValue: timeNum,
    }).then(res => {
      if (res?.success) {
        message.success('金额与积分换算倍率设置成功');
        confirmConfig();
      }
    });
  };

  return (
    <Modal
      width={800}
      title="配置积分奖励规则"
      visible={visible}
      onCancel={() => setVisible(false)}
      okText="保存"
      onOk={() => setData()}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          每消费1元奖励
          <InputNumber
            max={99999}
            min={0}
            precision={0}
            style={{ margin: '0 8px' }}
            value={timeNum}
            onChange={e => setTimeNum(e)}
          />
          积分
        </Col>
        <Col span={24}>*仅针对每购买金额X元、每成功交易X笔赠送的积分有效</Col>
      </Row>
    </Modal>
  );
};
