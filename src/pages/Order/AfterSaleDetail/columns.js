import React from 'react';
import { history } from '@umijs/max';
import { Image, Typography } from 'antd';
import { refundTypeRenderStatus } from '@/utils/baseData';

const { Link } = Typography;

export const refundDetailColumn = ({ bizOrderId }) => {
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
      render: record => (
        <Link
          onClick={() => {
            history.push(`/order/orderList/OrderDetail/${bizOrderId}`);
          }}
        >
          {record}
        </Link>
      ),
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
      render: record =>
        record === 0
          ? '无售后'
          : refundTypeRenderStatus.find(item => item.value == record)?.label || '- -',
    },
  ];

  return data;
};
