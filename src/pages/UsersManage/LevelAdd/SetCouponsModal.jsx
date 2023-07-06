import { Col, Modal, Row, Table, Form, Input, Button, message } from 'antd';
import React, { useState, useEffect } from 'react';
import Columns from './columns';

import { availableCouponList } from '@/services/member';

export default props => {
  const { visible = false, setVisible = {}, setCoupons = {}, selectedList = [] } = props;
  const [listData, setListData] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchData, setSeacrchData] = useState({});

  useEffect(() => {
    if (visible) {
      availableCouponListApi();
      setSelectedRowKeys('');
      setSelectedRows([]);
    }
  }, [visible, searchData]);

  const availableCouponListApi = page => {
    availableCouponList({
      page: page ? page : 1,
      ignoreStockIds: selectedList.join(','),
      ...searchData,
    }).then(res => {
      if (res?.success) {
        setListData(res.data);
      }
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    // getCheckboxProps: record => ({
    //   disabled: record.name === 'Disabled User',
    //   // Column configuration not to be checked
    //   name: record.name,
    //   id: record.id,
    // }),
  };

  const setCouponsId = () => {
    if (!(selectedRows?.length > 0)) return message.warning('请选中优惠券');
    setCoupons(selectedRows);
  };

  const onFinish = newValue => {
    setSeacrchData(newValue);
  };

  return (
    <Modal
      width={800}
      title="添加优惠券"
      visible={visible}
      onCancel={() => setVisible(false)}
      okText="保存"
      onOk={() => setCouponsId()}
    >
      <Row gutter={[8, 8]}>
        <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Form layout="inline" onFinish={onFinish}>
            <Form.Item name="couponName">
              <Input placeholder="优惠券名称" />
            </Form.Item>
            <Form.Item noStyle>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={24}>
          <Table
            dataSource={listData.rows}
            rowKey="stockId"
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            columns={Columns.CouponsScope({})}
            pagination={{
              current: listData?.current,
              pageSize: listData?.pageSize,
              total: listData?.total,
              // onChange: page => setformData({ ...formData, ...{ page: page } }),
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};
