import React, { useState, useEffect } from 'react';
import Css from './index.module.scss';
import { Button, Modal, Form, InputNumber, message } from 'antd';
import { setSignConfigApi } from '@/services/member';

export default props => {
  const { 
    show, // 弹窗展示状态
    setShow, // 设置弹窗展示方法
    modalType, // 弹窗类型 edit 编辑， add 新增
    index = '', // 编辑回显数据 列表索引
    listData = [], // 表格所有数据
    onGetDetailData, // 获取更新数据
  } = props;

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [okButtonProps, setOkButtonProps] = useState({
    disabled: false
  });

  const [form] = Form.useForm();


  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
  };
  
  const formTailLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8, offset: 4 },
  };

  // 展示、类型变化响应
  // 
  useEffect(() => {
    setVisibleFn(show);
    if(modalType==='edit') {
      // 设置回显
      const { presentPoint, continueDays } = listData[index]
      form?.setFieldsValue({
        presentPoint,
        continueDays
      })
      setOkButtonProps({ disabled: false })
    } else if(modalType==='add') {
      form?.resetFields()
      setOkButtonProps({ disabled: true })
    }
  }, [show, modalType]);

  // 设置弹窗状态
  const setVisibleFn = bol => {
    setVisible(bol);
    setShow(bol);
    if(!bol) form?.resetFields()
  };

  // 确定按钮
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let continueSignForms = []
      // 新增数据
      let flag = listData?.findIndex(item => item.continueDays === values.continueDays) || -1
      if(flag >= 0 && index!==flag) {
        message.error(`已存在该连续天数的奖励规则`)
        return
      }
      if(modalType==='add') {
        continueSignForms = [
          ...(listData||[]),
          values
        ]
      } else if(modalType==='edit') { // 编辑数据
        listData.splice(index, 1, values)
        continueSignForms = listData
      }
      submitData(continueSignForms)
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  // 保存连签设置
  const submitData = async (continueSignForms = []) => {
    let params = {
      continueSignForms,
      includeContinueSignIn: true
    }
    try {
      setConfirmLoading(true);
      let res = await setSignConfigApi(params)
      if (res.success) {
        setVisibleFn(false)
        message.success('保存成功')
        onGetDetailData()
      }
      setConfirmLoading(false);
    } catch (error) {
      setConfirmLoading(false);
    }
  }

  const onCancel = () => {
    setVisibleFn(false)
  }

  const onValuesChange = (changedValues, allValues) => {
    const { continueDays, presentPoint } = allValues
    let disabled = false
    if(!continueDays || !presentPoint) {
      disabled = true
    }
    setOkButtonProps({ disabled })
  }

  return (
    <Modal
      title={modalType === 'edit' ? '编辑连签奖励' : '设置连签奖励'}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      okButtonProps={okButtonProps}
    >
      <Form form={form} name="dynamic_rule" onValuesChange={onValuesChange}>
        <Form.Item
          {...formItemLayout}
          name="continueDays"
          label="连续签到"
          rules={[
            {
              required: true,
              message: '请输入连续签到天数',
            },
          ]}
        >
          <InputNumber
            addonAfter={<div>天</div>}
            min={2}
            max={9999}
            precision={0}
          />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="presentPoint"
          label="连签奖励"
          rules={[
            {
              required: true,
              message: '请输入连签奖励',
            },
          ]}
        >
          <InputNumber
            addonAfter={<div>积分</div>}
            min={1}
            max={9999}
            precision={0}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
