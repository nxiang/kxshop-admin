import React from 'react'
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Space
} from 'antd'
import {
  orderStatus,
  refundTypeStatus,
  refundStateTypeStatus,
  refundTypeRenderStatus
} from '@/utils/baseData'

const { RangePicker } = DatePicker
const { Option } = Select

const itemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

const AdvanceSearch = ({
  form,
  refundSubmit,
  refundReset,
  initialValues = {}
}) => {
  return (
    <Form
      form={form}
      layout="inline"
      initialValues={{
        ...initialValues
      }}
    >
      <Form.Item {...itemLayout} label="订单编号" name="bizOrderId">
        <Input style={{ width: 170 }} placeholder="请输入订单编号" />
      </Form.Item>
      <Form.Item {...itemLayout} label="下单时间" name="createOrderTime">
        <RangePicker showTime />
      </Form.Item>
      <Form.Item {...itemLayout} label="订单状态" name="orderStatus">
        <Select style={{ width: 170 }} placeholder="全部" allowClear>
          {orderStatus &&
            orderStatus.map((item) => {
              return <Option value={item.value}>{item.label}</Option>
            })}
        </Select>
      </Form.Item>
      <Form.Item {...itemLayout} label="售后单号" name="refundSn">
        <Input style={{ width: 170 }} placeholder="请输入退单编号" />
      </Form.Item>
      <Form.Item {...itemLayout} label="申请售后时间" name="createTime">
        <RangePicker showTime />
      </Form.Item>
      <Form.Item {...itemLayout} label="售后状态" name="status">
        <Select style={{ width: 170 }} placeholder="全部">
          <Option value={0}>全部售后订单</Option>
          {refundTypeRenderStatus.map((item) => (
            <Option value={item.value}>{item.label}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item {...itemLayout} label="售后类型" name="refundType">
        <Select style={{ width: 170 }} placeholder="全部">
          {refundTypeStatus.map((item) => (
            <Option value={item.value}>{item.label}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item {...itemLayout} label="买家名称" name="buyerName">
        <Input style={{ width: 170 }} placeholder="请输入买家名称" />
      </Form.Item>
      <Form.Item {...itemLayout} label="收件人手机号" name="phone">
        <InputNumber
          min={1}
          controls={false}
          style={{ width: 170 }}
          placeholder="请输入收件人手机号"
        />
      </Form.Item>
      <Form.Item {...itemLayout} label="退款方式" name="refundStateType">
        <Select style={{ width: 170 }} placeholder="请选择退款方式">
          {refundStateTypeStatus.map((item) => (
            <Option value={item.value}>{item.label}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Space size={16}>
          <Button
            style={{ marginLeft: 70 }}
            type="primary"
            onClick={refundSubmit}
          >
            筛选
          </Button>
          <Button onClick={refundReset}>条件重置</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default AdvanceSearch
