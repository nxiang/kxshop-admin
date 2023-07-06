/**
 * 支付宝小程序跳转
 */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Space, Button } from 'antd';
import Css from './WxappSelect.module.scss';

export default props => {
  const { width, itemData, alterData } = props;
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const handleOk = e => {
    console.log({
      aliappid: e.aliappid,
      alipath: e.alipath || '',
    });
    alterData({
      aliappid: e.aliappid,
      alipath: e.alipath || '',
    });
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div className={Css['select-box']}>
      <div
        style={{ width: width ? `${width}px` : '238px' }}
        className={Css['selectInput']}
        onClick={() => setVisible(true)}
      >
        {itemData?.aliappid ? itemData.aliappid : '请选择要跳转的支付宝小程序'}
        {itemData?.aliappid ? (
          <img
            onClick={() => alterData('')}
            className={Css['slesctImg']}
            src="https://img.kxll.com/admin_manage/del-icon.png"
            alt=''
          />
        ) : null}
      </div>
      <Modal
        form={form}
        title="支付宝小程序跳转设置"
        width="674px"
        visible={visible}
        footer={false}
        onCancel={handleCancel}
      >
        <p>请设置要跳转的支付宝小程序</p>
        <Form
          onFinish={handleOk}
          initialValues={{
            aliappid: itemData.aliappid || '',
            alipath: itemData.alipath || '',
          }}
        >
          <Form.Item
            name="aliappid"
            rules={[
              {
                required: true,
                message: '请输入小程序appid',
                min: 16,
                max: 16,
              },
            ]}
          >
            <Input placeholder="请输入小程序appid" maxLength={16} />
          </Form.Item>
          <Form.Item name="alipath">
            <Input placeholder="请输入小程序路径，为空跳转首页" maxLength={256} />
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
