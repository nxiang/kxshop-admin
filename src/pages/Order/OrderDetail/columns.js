import React from 'react';
import { Row, Col, Button, Image, Typography, InputNumber, Space, Form } from 'antd';
import { refundStateTypeStatus } from '@/utils/baseData';

const { Text } = Typography;

export const orderDetailColumn = ({ initiateMerchantsRefund }) => {
  const data = [
    {
      title: '商品ID',
      dataIndex: 'itemId',
      key: 'itemId',
    },
    {
      title: '商品图片',
      dataIndex: 'itemImgSrc',
      key: 'itemImgSrc',
      render: record => <Image style={{ width: 61 }} src={record} />,
    },
    {
      title: '商品名称',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: '规格',
      dataIndex: 'skuDesc',
      key: 'skuDesc',
      render: record => {
        if (typeof record == 'string') {
          return (
            <div style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: record }} />
          );
        }
      },
    },
    {
      title: '商品单价',
      dataIndex: 'price',
      key: 'price',
      render: record => record / 100,
    },
    {
      title: '购买数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '订单金额',
      dataIndex: 'actualAmount',
      key: 'actualAmount',
      render: record => record / 100,
    },
    {
      title: '售后状态',
      dataIndex: 'refundStatus',
      key: 'refundStatus',
      render: text => {
        switch (text) {
          case 1:
            return '退款中';
          case 2:
            return '退款成功';
          case 3:
            return '退款关闭';
          default:
        }
      },
    },
    {
      title: '退款方式',
      key: 'itemId',
      render: record => {
        // 售后状态 (无退款 退款关闭) 和 订单状态 （已发货 已成功 已评价）展示主动退款按钮
        if (
          (record.refundStatus === 0 || record.refundStatus === 3) &&
          (record.subOrderStatus === 3 ||
            record.subOrderStatus === 4 ||
            record.subOrderStatus === 6)
        )
          return (
            <Button onClick={() => initiateMerchantsRefund(record.subBizOrderId)}>主动退款</Button>
          );
        // 售后状态 退款成功 展示信息
        if (record.refundStatus === 2)
          return (
            refundStateTypeStatus.find(item => item.value == record?.refundStateType)?.label || ''
          );
        return ""
      },
    },
  ];

  return data;
};

export const MerchantsRefundColumn = () => {
  const data = [
    {
      title: '商品ID',
      width: 220,
      render: record => (
        <Row gutter={[8, 0]} justify="start" align="middle">
          <Col span={8}>
            <Image width={60} src={record.itemImgSrc} />
          </Col>
          <Col span={16}>
            <Space direction="vertical">
              <Text>{record.itemName}</Text>
              <Text type="secondary">id: {record.itemId}</Text>
            </Space>
          </Col>
        </Row>
      ),
    },
    {
      title: '可退金额',
      dataIndex: 'canInitiativeAmount',
      key: 'itemId',
    },
    {
      title: '退款金额（元）',
      key: 'itemId',
      render: (text, record, index) => (
        <Form.Item
          name={['refundAmount', index]}
          rules={[
            {
              required: true,
              message: '请输入退款金额',
            },
          ]}
          noStyle
        >
          <InputNumber
            max={record.canInitiativeAmount}
            min={0}
            precision={2}
            placeholder="请输入退款金额"
          />
        </Form.Item>
      ),
    },
  ];

  return data;
};
