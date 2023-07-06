import React, { useState, useEffect } from 'react';
import { Modal, Form, Radio, Col, Row, message } from 'antd';
import {
  orderStatus as orderStatusArray,
  orderRefundStatus,
  payChannelStatus as payChannelStatusArray,
} from '@/utils/baseData';
import Css from './ExportPop.module.scss';
// 引入接口
import { exportLaunch } from '@/services/order';

export default ({ searchList = {}, show, setShow }) => {
  const [exportType, setExportType] = useState('MAIN');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const {
    bizOrderId,
    outerPayNo,
    createOrderStartTime,
    createOrderEndTime,
    sendStartTime,
    sendEndTime,
    orderStatus,
    refundStatusList,
    payChannel,
    buyerName,
    buyerPhone,
    shipNo,
  } = searchList;

  const layout = {
    labelCol: {
      span: 3,
    },
    wrapperCol: {
      span: 21,
    },
  };

  useEffect(() => {
    handleModalShow(show);
  }, [show]);

  const handleOk = () => {
    setConfirmLoading(true);
    exportLaunch({
      ...searchList,
      type: exportType,
    })
      .then(res => {
        setConfirmLoading(false);
        if (res?.success) {
          handleModalShow(false);
          message.success('导出请求成功，请至导出记录查看');
        }
      })
      .catch(err => {
        setConfirmLoading(false);
      });
    // Modal.confirm({
    //   title: '导出列表',
    //   content: '是否导出当前选项列表，确认后请至导出记录查看',
    //   onOk: () => {
    //   },
    //   onCancel: () => {
    //     setConfirmLoading(false)
    //   }
    // });
  };

  const handleCancel = () => {
    setConfirmLoading(false);
    handleModalShow(false);
  };

  const handleModalShow = bol => {
    setShow(bol);
    setIsModalOpen(bol);
  };

  return (
    <Modal
      width="800px"
      title="批量导出订单"
      okText="确认导出"
      visible={isModalOpen}
      confirmLoading={confirmLoading}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        name="basic"
        {...layout}
        initialValues={{
          exportType: 'MAIN',
        }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
        onValuesChange={e => setExportType(e.exportType)}
      >
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
            {/* 订单状态&支付方式 */}
            <Row>
              <Col flex="70px">订单状态:</Col>
              <Col flex="1">
                {orderStatusArray.find(item => item.value === orderStatus)?.label || '全部'}
              </Col>
              <Col flex="70px">支付方式:</Col>
              <Col flex="1">
                {payChannelStatusArray.find(item => item.value === payChannel)?.label || '全部'}
              </Col>
            </Row>
            {/* 订单编号&售后状态 */}
            <Row>
              <Col flex="70px">订单编号:</Col>
              <Col flex="1">{bizOrderId || '- -'}</Col>
              <Col flex="70px">售后状态:</Col>
              <Col flex="1">
                {orderRefundStatus.find(item => item.value === refundStatusList)?.label ||
                  '全部'}
              </Col>
            </Row>
            {/* 买家名称&收件人手机号 */}
            <Row>
              <Col flex="70px">买家名称:</Col>
              <Col flex="1">{buyerName || '- -'}</Col>
              <Col flex="100px">收件人手机号:</Col>
              <Col flex="1">{buyerPhone || '- -'}</Col>
            </Row>
            {/* 快递单号 */}
            <Row>
              <Col flex="70px">快递单号:</Col>
              <Col flex="1">{shipNo || '- -'}</Col>
              <Col flex="100px">支付流水号:</Col>
              <Col flex="1">{outerPayNo || '- -'}</Col>
            </Row>
          </div>
        </Form.Item>

        <Form.Item label="导出类型" name="exportType">
          <Radio.Group>
            <Radio value="MAIN">订单维度</Radio>
            <Radio value="SUB">订单商品维度</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
      <div className={Css['ExportTypeDesc']}>
        1、订单维度：每个订单一行，包含订单金额、优惠金额、商家实收金额等信息，适合核算订单收入时使用；
        <br />
        2、订单商品维度：每个商品一行，包含商品及收货人、子订单优惠等信息，适合发货、核对商品明细时使用。
      </div>
    </Modal>
  );
};
