
// 页面跳转
import React, { useState } from 'react';
import { Modal, Form, Input, Row, Space, Button } from 'antd';
import Css from './PageSkip.module.scss';

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

  const empty = e => {
    alterData('');
    e.stopPropagation();
  };


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
        title="小程序页面跳转链接设置"
        width="674px"
        visible={visible}
        footer={false}
        onCancel={handleCancel}
      >
        <p>请设置要跳转的小程序页面链接</p>
        <Form form={form} onFinish={handleOk}>
          <Form.Item
            name="alterText"
            rules={[
              {
                required: true,
                message: '请输入页面跳转地址',
                max: 256,
              },
            ]}
          >
            <Input maxLength={256} placeholder="/pages/home/home" />
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

