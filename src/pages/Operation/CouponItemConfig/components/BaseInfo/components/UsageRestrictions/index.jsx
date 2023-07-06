import judgeDisabled from '@/pages/Operation/CouponItemConfig/judgeDisabled'
import { Checkbox, Form, Input, InputNumber, Radio, Space } from 'antd'
import Css from './index.module.scss'

export default (props) => {
  const {
    form,
    couponAvailableClientsLable,
    couponSendRule,
    reviceTJ,
    notDisabled,
    isWxSingle,
    goUseRequired
  } = props

  // 商品搭售勾选
  const checked = Form.useWatch(
    ['couponUseRule', 'couponBundleItem', 'checked'],
    form
  )

  const { TextArea } = Input
  // 每人领取张数限制的张数Form
  const reciveZsForm = (type) => {
    return type == 2
      ? {
          hidden: false,
          rules: [{ required: true, message: '请输入限领张数' }]
        }
      : ''
  }

  return (
    <>
      <h2>使用限制与说明</h2>
      <div>
        <Form.Item
          label="可用渠道"
          name={['couponUseRule', 'couponAvailableClients']}
          tooltip="两个渠道同时投放优惠券，则无法同步至支付宝卡包"
          rules={[{ required: true, message: '请选择可用渠道' }]}
        >
          <Checkbox.Group
            disabled={judgeDisabled(notDisabled, 'couponAvailableClients')}
            options={couponAvailableClientsLable}
          />
        </Form.Item>
        <Form.Item label="派券方式" required>
          <div>
            <div className={Css['couponValueTopLine']}>
              <Form.Item
                name={['couponSendRule', 'couponReceiveWay']}
                noStyle
                rules={[{ required: true, message: '请选择派券方式' }]}
              >
                <Radio.Group
                  disabled={judgeDisabled(notDisabled, 'couponReceiveWay')}
                >
                  <Radio value={0}>直接领取</Radio>
                  <Radio value={1}>活动领取</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div className={Css['couponTips']}>
              直接领取的优惠券通过领券中心、二维码或链接直接领取，活动领取需要通过活动发送，无对应的领券链接或二维码
            </div>
          </div>
        </Form.Item>
        <Form.Item
          className="specialCouponFormItem"
          label="每人领取张数限制"
          name="reviceTJ"
          extra={
            isWxSingle && (
              <div className={Css['couponTips']}>
                微信商家券每人领取张数最大限制100
              </div>
            )
          }
          rules={[{ required: true, message: '请选择每人领取张数限制' }]}
        >
          <Radio.Group disabled={judgeDisabled(notDisabled, 'reviceTJ')}>
            <Space direction="vertical">
              <Radio value={1}>不限制</Radio>
              <Radio value={2}>
                <Space align="center">
                  限领张数
                  <Form.Item
                    hidden
                    {...reciveZsForm(reviceTJ)}
                    name={['couponSendRule', 'maxCouponsPerUser']}
                    noStyle
                  >
                    <InputNumber
                      min={1}
                      max={couponSendRule?.maxQuantity}
                      disabled={
                        !reciveZsForm(reviceTJ) ||
                        !couponSendRule?.maxQuantity ||
                        judgeDisabled(notDisabled, 'maxCouponsPerUser')
                      }
                      precision={0}
                      className={Css['inputNumberW']}
                      addonAfter="张"
                    />
                  </Form.Item>
                </Space>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="每人核销张数限制" required>
          <Radio.Group defaultValue={1}>
            <Radio value={1}>不限制</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="券使用说明" tooltip="向用户展示" required>
          <div>
            <Form.Item
              noStyle
              name="instructions"
              rules={[{ required: true, message: '请输入券使用说明' }]}
              initialValue={`1、本券不可兑换现金，不可找零。
2、如果消费并使用优惠券后，订单发生退款，优惠 券无法退还。
3、本券为单品优惠券，非全场通用，需购买特定商品时才可使用。
4、本券不可与已享受其它优惠的活动商品、特价商品叠加优惠使用。
5、具体使用详情，以下单页为准。`}
            >
              <TextArea
                disabled={judgeDisabled(notDisabled, 'instructions')}
                rows={6}
                placeholder="不超过1000字"
                maxLength={1000}
              />
            </Form.Item>
            <div className={Css['couponTips']}>
              使用说明仅可描述券的使用规则、例如本优惠券不可转让等
            </div>
          </div>
        </Form.Item>
        <Form.Item
          label="点击“去使用”跳转"
          name="redirectPath"
          rules={[
            { required: checked || goUseRequired, message: '请填写跳转地址' }
          ]}
        >
          <Input
            className="w-72"
            placeholder="若不填写，则跳转到 券可用商品列表页"
          />
        </Form.Item>
      </div>
    </>
  )
}
