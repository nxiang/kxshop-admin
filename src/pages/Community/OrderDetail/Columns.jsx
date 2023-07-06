import React from 'react';
import {Image} from 'antd';
const detailScope = ({ orderStatus = 1 }) => {
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
      render: text => <Image style={{ height: '61px' }} src={text} />,
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
      render: text => {
        if (typeof text == 'string') {
          const str = text.trim();
          return (
            <div
              style={{ whiteSpace: 'pre-wrap' }}
              dangerouslySetInnerHTML={{ __html: str.replace(/\s+/g, '\n') }}
            />
          );
        }
      },
    },
    {
      title: '商品单价',
      dataIndex: 'price',
      key: 'price',
      render: text => text / 100,
    },
    {
      title: '购买数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '实付金额',
      dataIndex: 'actualAmount',
      key: 'actualAmount',
      render: text => text / 100,
    },
  ];

  if (orderStatus == 5)
    data.push({
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
    });

  return data;
};

export { detailScope };
