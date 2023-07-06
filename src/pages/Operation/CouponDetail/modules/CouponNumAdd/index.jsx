import React, { useState } from 'react';
import Css from './index.module.scss';
import { history } from '@umijs/max';
import { Modal, Form, InputNumber, message } from 'antd';
import { floatObj } from '@/utils/utils';

import { add } from '@/services/coupon';

export default props => {
  const [form] = Form.useForm();
  const { show, setShow, value, getData } = props;
  const [confirmLoading, setConfirmLoading] = useState(false)

  const { totalNum, addQuantity, stockId } = value;

  const submit = () => {
    console.log('submit');
    form
      .validateFields()
      .then(async values => {
        console.log('values', values);
        const { addQuantity } = values
        setConfirmLoading(true)
        try {
          const info = await add({ stockId, maxQuantity: totalNum, addQuantity });
          if (info) {
            message.success('增加成功');
            form.resetFields();
            setShow(false);
            getData()
          }
        } catch (error) {
          console.log(error)
        }
        setConfirmLoading(false)
      })
      .catch(errorInfo => {
        console.log('errorInfo', errorInfo);
      });
  };

  const onCancel = () => {
    form.resetFields();
    setShow(false);
  };

  return (
    <Modal
      width="680px"
      title="追加券数量"
      visible={show}
      confirmLoading={confirmLoading}
      onCancel={() => onCancel()}
      onOk={() => submit()}
    >
      <Form
        layout="inline"
        form={form}
        initialValues={{
          totalNum,
          addQuantity,
        }}
      >
        <Form.Item label="券总数量" name="totalNum">
          <InputNumber addonAfter="张" disabled />
        </Form.Item>
        <Form.Item
          label="追加"
          name="addQuantity"
          rules={[{ required: true, message: '请输入追加数量' }]}
        >
          <InputNumber addonAfter="张" precision={0} min={1} max={floatObj.subtract(999999, totalNum)} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
