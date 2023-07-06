// 商品关键字选择
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Space, Button } from 'antd';
import Css from './KeywordSelect.module.scss';

export default props => {
  const { width, itemData, alterData } = props;
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const handleOk = e => {
    alterData(e.alterText);
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div className={Css['keyword-select-box']}>
      <div
        style={{ width: width ? `${width}px` : '238px' }}
        className={Css['selectInput']}
        onClick={() => {
          setVisible(true);
          form.setFieldsValue({
            alterText: itemData,
          });
        }}
      >
        {itemData ? itemData : '请选择要跳转的内容'}
        {itemData ? (
          <img
            onClick={() => alterData('')}
            className={Css['slesctImg']}
            src="https://img.kxll.com/admin_manage/del-icon.png"
          />
        ) : null}
      </div>
      <Modal
        form={form}
        title="商品关键字设置"
        width={'674px'}
        visible={visible}
        footer={false}
        onCancel={handleCancel}
      >
        <p>请设置要跳转的商品关键字</p>
        <Form onFinish={handleOk}>
          <Form.Item
            name="alterText"
            rules={[
              {
                required: true,
                message: '请输入，12个字以内',
                max: 12,
              },
            ]}
          >
            <Input maxLength={12} />
          </Form.Item>
          <Row>
            <Space>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit">
                确认
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
