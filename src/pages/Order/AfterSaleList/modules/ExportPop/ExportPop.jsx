import React, { useState } from 'react'
import { Modal, Form, Col, Row, message, Space } from 'antd'
import Css from './ExportPop.module.scss'

// 引入接口
import { refundExportLaunchApi } from '@/services/order'
import {
  refundTypeStatus,
  refundTypeRenderStatus,
  refundStateTypeStatus,
  orderStatus as orderStatusShow
} from '@/utils/baseData'

export default ({ searchList = {}, show, setShow }) => {
  const [confirmLoading, setConfirmLoading] = useState(false)

  const {
    bizOrderId,
    refundSn,
    createOrderStartTime,
    createOrderEndTime,
    createStartTime,
    createEndTime,
    status,
    orderStatus,
    refundType,
    buyerName,
    phone,
    refundStateType
  } = searchList

  const layout = {
    labelCol: {
      span: 3
    },
    wrapperCol: {
      span: 21
    }
  }

  const handleOk = () => {
    setConfirmLoading(true)
    refundExportLaunchApi({
      ...searchList
    })
      .then((res) => {
        setConfirmLoading(false)
        if (res?.success) {
          setShow(false)
          message.success('导出请求成功，请至导出记录查看')
        }
      })
      .catch((err) => {
        setConfirmLoading(false)
      })
  }

  const handleCancel = () => {
    setConfirmLoading(false)
    setShow(false)
  }

  return (
    <Modal
      width="800px"
      title="批量导出售后订单"
      okText="确认导出"
      visible={show}
      confirmLoading={confirmLoading}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form name="basic" {...layout} initialValues={{}} autoComplete="off">
        <Form.Item label="查询条件">
          <Space
            direction="vertical"
            size={16}
            className={Css['searchParamsBox']}
          >
            {/* 申请售后时间 */}
            <Row>
              <Col flex="100px">订单下单时间:</Col>
              <Col flex="auto">
                {createOrderStartTime
                  ? `${createOrderStartTime}~${createOrderEndTime}`
                  : '- -'}
              </Col>
            </Row>
            {/* 申请售后时间 */}
            <Row>
              <Col flex="100px">申请售后时间:</Col>
              <Col flex="auto">
                {createStartTime
                  ? `${createStartTime}~${createEndTime}`
                  : '- -'}
              </Col>
            </Row>
            {/* 订单编号&售后单号 */}
            <Row>
              <Col flex="70px">售后单号:</Col>
              <Col flex="1">{refundSn || '- -'}</Col>
              <Col flex="70px">订单编号:</Col>
              <Col flex="1">{bizOrderId || '- -'}</Col>
            </Row>
            {/* 售后状态&买家名称 */}
            <Row>
              <Col flex="70px">售后状态:</Col>
              <Col flex="1">
                {refundTypeRenderStatus.find((item) => item.value == status)
                  ?.label || '- -'}
              </Col>
              <Col flex="70px">买家名称:</Col>
              <Col flex="1">{buyerName || '- -'}</Col>
            </Row>
            {/* 售后类型&收件人手机号 */}
            <Row>
              <Col flex="70px">售后类型:</Col>
              <Col flex="1">
                {refundTypeStatus.find((item) => item.value == refundType)
                  ?.label || '- -'}
              </Col>
              <Col flex="100px">收件人手机号:</Col>
              <Col flex="1">{phone || '- -'}</Col>
            </Row>
            <Row>
              <Col flex="70px">退款方式:</Col>
              <Col flex="1">
                {refundStateTypeStatus.find(
                  (item) => item.value == refundStateType
                )?.label || '- -'}
              </Col>
              <Col flex="70px">订单状态:</Col>
              <Col flex="1">
                {orderStatusShow.find(
                  (item) => item.value == orderStatus
                )?.label || '- -'}
              </Col>
            </Row>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
