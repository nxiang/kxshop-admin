import React, { useEffect, useState } from 'react';
import Panel from '@/components/Panel';
import { Card, Table, Row, Col, Button, Modal, message, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Columns from './columns';
import { EditModal } from './modal';
const Tag = () => {
  const [listData, setListData] = useState(undefined);
  const [form] = Form.useForm();
  const [editVisible, setEditVisible] = useState(false);
  // 编辑
  const [editValue, setEditValue] = useState([]);
  const listApi = page => {};
  const itemEdit = () => {};
  const itemDelete = () => {};
  // 新增
  const addTags = ()=>{
    setEditVisible(true)
  }
  // 标签确认
  const comfirmTag = () => {};
  // 标签取消
  const cancleTag = () => {
    form.resetFields();
    setEditVisible(false)
  };
  return (
    <Panel title="商品标签">
      <Card>
        <Row>
          <Col span={20}>
            <Button type="primary" icon={<PlusOutlined />} onClick={addTags}>
              新建
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right', marginTop: '20px' }}>
            <Table
              dataSource={listData?.records}
              bordered
              rowKey="id"
              //   columns={Columns.TagScope({
              //     itemEdit,
              //     itemDelete,
              //   })}
              pagination={{
                current: listData?.current,
                pageSize: 10,
                total: listData?.total,
                showTotal: total => `共${total}条数据`,
                showSizeChanger: false,
                onChange: (page, pageSize) => listApi(page),
              }}
            />
          </Col>
        </Row>
      </Card>
      <EditModal form={form} visible={editVisible} handleSearch={comfirmTag} onCancel={cancleTag} editValue={editValue} />
    </Panel>
  );
};
export default Tag;
