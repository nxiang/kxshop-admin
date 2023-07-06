import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Button, Form, Select, Input, DatePicker, Space } from 'antd';

const EditModal = props => {
  const { form, visible, onCancel, editValue, handleSearch } = props;
  // eslint-disable-next-line no-unused-vars
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  useEffect(() => {
    if (visible) {
      if (editValue?.id) {
        setEditId(editValue.id);
        setEditName('编辑');
        form.setFieldsValue({});
      } else {
        setEditId('');
        setEditName('新增');
      }
    }
  }, [visible]);
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 24 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 0,
      },
    },
  };
  const handleChange = () => {};
  return (
    <Modal title={editName} width={600} footer={null} visible={visible} onCancel={onCancel}>
      <Form form={form} {...formItemLayout} onFinish={handleSearch} labelCol={5}>
        <Row>
          <Col span={24}>
            <Form.Item
              label="标签名称"
              name="ratio"
              {...tailFormItemLayout}
              rules={[{ required: true, message: '请填写标签名称' }]}
            >
              <Input showCount maxLength={5} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Row justify="end">
                <Space>
                  <Button onClick={onCancel}>取消</Button>
                  <Button type="primary" htmlType="submit">
                    确认
                  </Button>
                </Space>
              </Row>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export { EditModal };
