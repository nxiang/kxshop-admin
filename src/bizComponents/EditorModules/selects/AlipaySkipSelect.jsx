// 支付宝外部跳转
import React, { useState } from 'react';
import { Modal, Form, Input, Row, Space, Button } from 'antd';
import Css from './AlipaySkipSelect.module.scss';

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

  const empty = (e) => {
    alterData('')
    e.stopPropagation();
  }

  return (
    <div className={Css['url-select-box']}>
      <div
        style={{ width: width ? `${width}px` : '238px' }}
        className={Css.selectInput}
        onClick={() => {
          setVisible(true);
          form.setFieldsValue({
            alterText: itemData,
          });
        }}
      >
        {itemData || '请选择要跳转的内容'}
        {itemData ? (
          <img
            onClick={(e) => empty(e)}
            className={Css.slesctImg}
            src="https://img.kxll.com/admin_manage/del-icon.png"
            alt=""
          />
        ) : null}
      </div>
      <Modal
        title="支付宝跳转链接设置"
        width="674px"
        visible={visible}
        footer={false}
        onCancel={handleCancel}
      >
        <p>请设置要跳转的支付宝链接</p>
        <Form form={form} onFinish={handleOk}>
          <Form.Item
            name="alterText"
            rules={[
              {
                required: true,
                // pattern: '^(alipays://)',
                message: '请输入支付宝跳转地址',
                max: 256,
              },
            ]}
          >
            <Input maxLength={256} />
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
