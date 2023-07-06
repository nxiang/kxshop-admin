import { Button, Form, InputNumber, Modal, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';

export default ({ visible = true, type = 'add', data = '', setVisible = '', onFinish = '' }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (type == 'add') {
        form.resetFields();
      }
      if (type == 'edit') {
        form.setFieldsValue({
          day: data.day,
          reward: data.reward,
        });
      }
    }
  }, [visible]);

  const handleOk = val => {
    let newValue = { ...val };
    if (type == 'edit') newValue = { ...newValue, day: data.day };
    onFinish(newValue);
  };

  return (
    <Modal visible={visible} onCancel={() => setVisible(false)} title="设置连签奖励" footer={false}>
      <Form form={form} onFinish={val => handleOk(val)}>
        {type == 'add' && (
          <Form.Item label="连续签到">
            <Space>
              <Form.Item
                name="day"
                noStyle
                rules={[
                  {
                    required: true,
                    message: '请输入连续签到天数',
                  },
                ]}
              >
                <InputNumber min={0} max={99999} precision={0} placeholder="请输入" />
              </Form.Item>
              天
            </Space>
          </Form.Item>
        )}
        <Form.Item label="连签奖励">
          <Space>
            <Form.Item
              name="reward"
              rules={[
                {
                  required: true,
                  message: '请输入连签奖励积分',
                },
              ]}
              noStyle
            >
              <InputNumber min={0} max={99999} precision={0} placeholder="请输入" />
            </Form.Item>
            积分
          </Space>
        </Form.Item>
        <Row>
          <Space>
            <Button onClick={() => setVisible(false)}>取消</Button>
            <Button htmlType="submit" type="primary">
              确认
            </Button>
          </Space>
        </Row>
      </Form>
    </Modal>
  );
};
