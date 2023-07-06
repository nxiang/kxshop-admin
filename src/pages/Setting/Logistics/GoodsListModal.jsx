import React, { useEffect, useState } from 'react';
import { Link } from '@umijs/max';
import { Col, Modal, Row, Table, Typography, Image, Space, Button } from 'antd';
import { detailItemList } from '@/services/freight';

const { Text } = Typography;

const columns = [
  {
    title: '商品名称',
    render: record => (
      <Space>
        <Image width={60} height={60} src={record.imagePath} alt="" />
        <Space direction="vertical">
          <Text
            style={{
              width: 260,
            }}
            ellipsis={{
              rows: 2,
              expandable: true,
            }}
          >
            {record.name}
          </Text>
          <Text>id:{record.id}</Text>
        </Space>
      </Space>
    ),
  },
  {
    title: '去操作',
    width: 140,
    render: record => (
      <Link to={`/goods/manageList/addGoods?type=edit&itemId=${record.id}`}>去编辑</Link>
    ),
  },
];

export default ({ visible, onCancel, freightId }) => {
  const [goodsList, setGoodsList] = useState({});

  useEffect(() => {
    if (visible) {
      detailItemListApi(1);
    }
  }, [visible]);

  const detailItemListApi = page => {
    detailItemList({
      page: page || 1,
      pageSize: 10,
      freightId,
    }).then(res => {
      if (res?.success) {
        setGoodsList(res.data);
      }
    });
  };

  return (
    <Modal
      visible={visible}
      onCancel={() => onCancel()}
      footer={[
        <Button onClick={() => onCancel()} type="primary">
          确定
        </Button>,
      ]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Text>所选运费模版已被以下商品使用</Text>
        </Col>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={goodsList.rows}
            pagination={{
              current: goodsList.current,
              pageSize: goodsList.pageSize,
              total: goodsList.total,
            }}
            onChange={({ current }) => detailItemListApi(current)}
          />
        </Col>
      </Row>
    </Modal>
  );
};
