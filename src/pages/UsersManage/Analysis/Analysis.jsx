import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Panel from '@/components/Panel';
import { PageHeader, Row, Col, Button } from 'antd';
import Css from './Analysis.module.scss';
import GrowthList from './GrowthList';
import ModelsList from './ModelsList';
import MembersList from './MembersList';

export default () => {
  return (
    <Panel>
      <PageHeader style={{ background: '#fff' }} title="用户分析">
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <Button type="primary">支付宝</Button>
          </Col>
          <Col span={24}>
            <GrowthList />
          </Col>
          {/* <Col span={24}>
            <ModelsList />
          </Col> */}
          <Col span={24}>
            <MembersList />
          </Col>
        </Row>
      </PageHeader>
    </Panel>
  );
};
