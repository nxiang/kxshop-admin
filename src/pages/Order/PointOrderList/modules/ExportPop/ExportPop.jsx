import React, { useState } from 'react';
import { Modal, Form, Col, Row, message } from 'antd';
import Css from './ExportPop.module.scss';
import { integralOrderStatus } from '@/utils/baseData';

// 引入接口
import { exportPointOrder } from '@/services/order';

export default ({ searchData = {}, classInfo = [], visible, onCancel }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const {
    orderStatus,
    classId,
    bizOrderId,
    buyerPhone,
    createOrderStartTime,
    createOrderEndTime,
    sendStartTime,
    sendEndTime,
  } = searchData;

  const layout = {
    labelCol: {
      span: 3,
    },
    wrapperCol: {
      span: 21,
    },
  };

  const handleOk = () => {
    setConfirmLoading(true);
    exportPointOrder({
      ...searchData,
    })
      .then(res => {
        setConfirmLoading(false);
        if (res?.success) {
          message.success('导出请求成功，请至导出记录查看');
          onCancel();
        }
      })
      .catch(err => {
        setConfirmLoading(false);
      });
  };

  return (
    <Modal
      width="800px"
      title="批量导出订单"
      okText="确认导出"
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={() => handleOk()}
      onCancel={() => onCancel()}
    >
      <Form name="basic" {...layout} autoComplete="off">
        <Form.Item label="查询条件">
          <div className={Css['searchParamsBox']}>
            {/* 下单时间 */}
            <Row>
              <Col flex="70px">下单时间:</Col>
              <Col flex="auto">
                {createOrderStartTime ? `${createOrderStartTime}~${createOrderEndTime}` : '- -'}
              </Col>
            </Row>
            {/* 发货时间 */}
            <Row>
              <Col flex="70px">发货时间:</Col>
              <Col flex="1">{sendStartTime ? `${sendStartTime}~${sendEndTime}` : '- -'}</Col>
            </Row>
            <Row>
              <Col flex="100px">积分订单状态:</Col>
              <Col flex="1">
                {integralOrderStatus.find(item => item.value == orderStatus)?.label || '全部'}
              </Col>
              <Col flex="100px">收件人手机号:</Col>
              <Col flex="1">{buyerPhone || '- -'}</Col>
            </Row>
            {/* 订单状态&支付方式 */}
            <Row>
              <Col flex="70px">订单类型:</Col>
              <Col flex="1">
                {classInfo.find(item => item.classId == classId)?.className || '全部'}
              </Col>
              <Col flex="70px">订单编号:</Col>
              <Col flex="1">{bizOrderId || '- -'}</Col>
            </Row>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
