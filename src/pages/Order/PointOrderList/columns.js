import React from 'react';
import { Row, Col, Image } from 'antd';
import { showBut } from '@/utils/utils';

const columns = ({ handleSendModal }) => {
  const btnDisplay = data => {
    if (data?.orderStatus == 2 && data?.classId == 4) return '';
    return (
      <span
        className="g__link"
        onClick={() => {
          handleSendModal(data);
        }}
      >
        {data?.orderStatus == 2 && showBut('pointOrderList', 'pointOrderList_send')
          ? '发货'
          : data?.orderStatus == 3
          ? '发货详情'
          : showBut('pointOrderList', 'pointOrderList_view')
          ? '查看'
          : null}
      </span>
    );
  };

  const deliveryTypeDom = data => {
    return {
      0: '无需发货',
      1: '快递配送',
    }[data];
  };

  return [
    { title: '订单编号', dataIndex: 'bizOrderId', fixed: 'left' },
    {
      title: '商品信息',
      key: 'productInfo',
      width: 220,
      render: ({ item: { list } }) => (
        <Row gutter={[8, 0]} justify="start" align="middle">
          <Col>
            <Image width={60} src={list[0].itemImgSrc} />
          </Col>
          <Col>
            <div>{list[0].itemId}</div>
            <div>{list[0].itemName}</div>
          </Col>
        </Row>
      ),
    },
    { title: '兑换价格', width: 100, dataIndex: 'point', render: point => `${point}积分` },
    { title: '配送方式', width: 100, dataIndex: 'deliveryType', render: deliveryTypeDom },
    { title: '收件信息', dataIndex: 'receive' },
    { title: '状态', width: 100, dataIndex: 'orderStatusText' },
    { title: '下单时间', dataIndex: 'createOrderTime' },
    {
      title: '操作',
      width: 100,
      key: 'operation',
      fixed: 'right',
      render: btnDisplay,
    },
  ];
};

export default columns;
