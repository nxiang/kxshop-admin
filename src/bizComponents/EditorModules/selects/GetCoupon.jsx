// h5url选择
import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Row, Space, Button, Typography, Radio } from 'antd'
import Css from './GetCoupon.module.scss'

const { Text } = Typography

const alipayChannelTypeConfig = {
  alertTextRules: [
    {
      required: true,
      pattern: /^\w+(,\w+)*$/,
      message: '请输入正确的优惠券ID，多张请以英文逗号分割',
      max: 290
    }
  ]
}

/** 不同渠道的配置 */
const channelTypeConfig = {
  // 支付宝
  alipay: alipayChannelTypeConfig,
  // 微信
  wechat: {
    alertTextRules: [
      {
        required: true,
        validator: async (rule, value) => {
          if (value?.includes?.(',')) {
            throw new Error('一键领券(微信)，目前仅支持配置单张券')
          }
        },
        max: 290
      }
    ]
  }
}

// 默认取支付宝配置
const defaultConfig = alipayChannelTypeConfig

/** 获取不同渠道的配置 */
const getChannelTypeConfig = (type) => {
  return channelTypeConfig[type] || defaultConfig
}
export default (props) => {
  const { width, itemData, channelType, alterData } = props
  const [form] = Form.useForm()
  const receiveType = Form.useWatch('receiveType', form)
  const [visible, setVisible] = useState(false)
  const channelTypeConfig = getChannelTypeConfig(channelType)

  const onFinish = (e) => {
    console.log(e)
    alterData(e)
    // alterData(e.alterText);
    setVisible(false)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <div className={Css['url-select-box']}>
      <div
        style={{ width: width ? `${width}px` : '238px' }}
        className={Css.selectInput}
        onClick={() => {
          setVisible(true)
          form.setFieldsValue({
            alterText: itemData?.alterText || itemData,
            receiveType: itemData?.receiveType || 1
          })
        }}
      >
        {itemData?.alterText || itemData || '请选择要跳转的内容'}
        {(itemData?.alterText || itemData) && (
          <img
            onClick={(e) => {
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
              alterData('')
            }}
            className={Css.slesctImg}
            src="https://img.kxll.com/admin_manage/del-icon.png"
            alt=""
          />
        )}
      </div>
      <Modal
        title="添加优惠券活动ID"
        width="674px"
        visible={visible}
        footer={false}
        onCancel={handleCancel}
        getContainer={() => document.querySelector('#root')}
      >
        <Form
          form={form}
          initialValues={{
            receiveType: 1
          }}
          onFinish={onFinish}
        >
          <Text className="mb-0.5">请设置优惠券活动ID</Text>
          <Form.Item
            name="alterText"
            rules={channelTypeConfig.alertTextRules}
            extra={
              <div className="text-red-400">
                一键领券(微信)，目前仅支持配置单张券
              </div>
            }
          >
            <Input
              maxLength={290}
              placeholder="若一键领取多张券，则用”,“分割，最多10张，最多290字符。"
            />
          </Form.Item>
          {channelType === 'alipay' && (
            <>
              <Text>领取条件</Text>
              <Form.Item
                name="receiveType"
                extra={
                  receiveType == 2 &&
                  '用户领取支付宝会员完成注册后可领取优惠券（需事先创建会员卡）'
                }
              >
                <Radio.Group>
                  <Radio value={2}>开通会员</Radio>
                  <Radio value={1}>无限制</Radio>
                </Radio.Group>
              </Form.Item>
            </>
          )}
          <Row justify="end">
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
  )
}
