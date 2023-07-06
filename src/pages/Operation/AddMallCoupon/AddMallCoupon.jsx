import Panel from '@/components/Panel'
import { detail, newCoupon } from '@/services/coupon'
import { withRouter } from '@/utils/compatible'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { history } from '@umijs/max'
import { Button, DatePicker, InputNumber, Modal, Radio, message } from 'antd'
import moment from 'moment'
import { Component } from 'react'
import Css from './AddMallCoupon.module.scss'
import CouponBase from './modules/CouponBase/CouponBase'
import UseRules from './modules/UseRules/UseRules'

const { confirm } = Modal
const { RangePicker } = DatePicker
class AddMallCoupon extends Component {
  constructor() {
    super()
    this.state = {
      couponSendRule: [
        {
          name: '直接领取',
          value: 0
        },
        {
          name: '活动领取',
          value: 1
        }
      ],
      stockId: false,
      loading: false
    }
  }

  componentWillMount() {
    if (this.props.location.state && this.props.location.state.id) {
      this.setState(
        {
          stockId: this.props.location.state.id
        },
        () => {
          this.getData()
        }
      )
    }
  }
  async getData() {
    const info = await detail({ stockId: this.state.stockId })
    const values = info.data
    this.props.form.setFieldsValue({
      couponName: values['couponName'],
      comment: values['comment'],
      couponType: values['couponType'],
      instructions: values['instructions'],
      couponReceiveWay: values.couponSendRule['couponReceiveWay'],
      maxQuantity: values.couponSendRule['maxQuantity'],
      maxCouponsPerUser: values.couponSendRule['maxCouponsPerUser'],
      isFixedTime: values.couponUseRule.couponAvailableTime['isFixedTime'],
      couponAvailableClients: values.couponUseRule['couponAvailableClients'],
      useProductList: values.couponUseRule['availableItems'],
      availableBeginTime: [
        moment(values.availableBeginTime),
        moment(values.availableEndTime)
      ]
    })

    if (values['couponType'] === 'NORMAL') {
      this.props.form.setFieldsValue({
        couponAmount:
          values.couponUseRule.fixedNormalCoupon['couponAmount'] / 100,
        transactionMinimum:
          values.couponUseRule.fixedNormalCoupon['transactionMinimum'] / 100
      })
    } else {
      this.props.form.setFieldsValue({
        maxDiscountAmount:
          values.couponUseRule.discountCoupon['maxDiscountAmount'] / 100,
        discountPercent:
          values.couponUseRule.discountCoupon['discountPercent'] / 100,
        transactionMinimum:
          values.couponUseRule.discountCoupon['transactionMinimum'] / 100
      })
    }
    if (values.couponUseRule.couponAvailableTime['isFixedTime']) {
      this.props.form.setFieldsValue({
        availableTime: [
          moment(values.couponUseRule.couponAvailableTime.availableBeginTime),
          moment(values.couponUseRule.couponAvailableTime.availableEndTime)
        ]
      })
    } else {
      this.props.form.setFieldsValue({
        receiveTime:
          values.couponUseRule.couponAvailableTime.daysAvailableAfterReceive,
        effectiveTime: values.couponUseRule.couponAvailableTime.availableDays
      })
    }
  }

  handleSubmit(isDraft) {
    this.setState({ loading: true }, () => {
      this.props.form.validateFields(async (err, values) => {
        // console.log(values)
        if (err) {
          this.setState({ loading: false })
          return false
        }
        const data = {
          couponName: values['couponName'],
          comment: values['comment'],
          couponType: values['couponType'],
          instructions: values['instructions'],
          availableBeginTime: values['availableBeginTime'][0].format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          availableEndTime: values['availableBeginTime'][1].format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          couponSendRule: {
            couponReceiveWay: values['couponReceiveWay'],
            maxQuantity: values['maxQuantity'],
            maxCouponsPerUser: values['maxCouponsPerUser']
          },
          couponUseRule: {
            couponAvailableTime: {
              isFixedTime: values['isFixedTime']
            },
            couponAvailableClients: values['couponAvailableClients'],
            availableItems: values['useProductList']
          },
          isDraft
        }
        if (values['isFixedTime']) {
          data.couponUseRule.couponAvailableTime.availableBeginTime = values[
            'availableTime'
          ][0].format('YYYY-MM-DD HH:mm:ss')
          data.couponUseRule.couponAvailableTime.availableEndTime = values[
            'availableTime'
          ][1].format('YYYY-MM-DD HH:mm:ss')
        } else {
          data.couponUseRule.couponAvailableTime.daysAvailableAfterReceive =
            values['receiveTime']
          data.couponUseRule.couponAvailableTime.availableDays =
            values['effectiveTime']
        }
        if (values['couponType'] === 'NORMAL') {
          data.couponUseRule.fixedNormalCoupon = {
            couponAmount: values['couponAmount'] * 100,
            transactionMinimum: values['transactionMinimum'] * 100
          }
        } else {
          data.couponUseRule.discountCoupon = {
            maxDiscountAmount: values['maxDiscountAmount'] * 100,
            discountPercent: values['discountPercent'] * 100,
            transactionMinimum: values['transactionMinimum'] * 100
          }
        }
        if (this.state.stockId) {
          data.stockId = this.state.stockId
        }
        const info = await newCoupon(data)
        if (info) {
          message.success('创建成功')
          history.push('/operation/couponManage')
        }

        this.setState({ loading: false })
      })
    })
  }
  goBack() {
    const self = this
    confirm({
      title: '提示',
      content: '取消后所有信息都将丢失，确认取消吗?',
      onOk() {
        history.push('/operation/couponManage')
      },
      onCancel() {}
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Panel title="新增商城优惠券" content="配置商城优惠券信息">
        <div className={Css['AddCoupon']}>
          <Form labelCol={{ span: 3, offset: 0 }}>
            {/* CouponBase */}
            <CouponBase props={this.props} />

            {/* useRules */}
            <UseRules props={this.props} stockId={this.state.stockId} />

            {/* GetCoupon */}
            <div className={Css['GetCoupon']}>
              <div className={Css['title']}>优惠券领券</div>
              <Form.Item required label="可领取时间">
                {getFieldDecorator('availableBeginTime', {
                  rules: [
                    {
                      required: true,
                      message: '请输入可领取时间'
                    }
                  ]
                })(
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                  />
                )}
              </Form.Item>
              <Form.Item className={Css['useBox']} required label="派券方式">
                {getFieldDecorator('couponReceiveWay', {
                  rules: [
                    {
                      required: true,
                      message: '请选择派券方式'
                    }
                  ]
                })(
                  <Radio.Group className={Css['RadioBox']}>
                    {this.state.couponSendRule.map((item, index) => {
                      return (
                        <Radio key={index} value={item.value}>
                          {item.name}
                        </Radio>
                      )
                    })}
                  </Radio.Group>
                )}
              </Form.Item>
              <div className={Css['msgTxt']}>
                直接领取的优惠券通过领券中心、二维码或链接直接领取，活动发送需要通过活动发送，无对应的领券链接或二维码。
              </div>
              <Form.Item
                className={Css['checkBoxLeft']}
                required
                label="每人限领张数"
              >
                {getFieldDecorator('maxCouponsPerUser', {
                  rules: [
                    {
                      required: true,
                      message: '请输入优惠券每人限领数量'
                    }
                  ]
                })(
                  <InputNumber
                    style={{ width: 297 }}
                    min={0}
                    max={999}
                    step={1}
                    className={Css['checkBoxInput']}
                    placeholder="可领取优惠券数量"
                  />
                )}
              </Form.Item>
              <Form.Item className={Css['submitRow']}>
                <Button
                  type="primary"
                  loading={this.state.loading}
                  onClick={this.handleSubmit.bind(this, false)}
                >
                  立即发放
                </Button>
                <Button
                  loading={this.state.loading}
                  onClick={this.handleSubmit.bind(this, true)}
                >
                  保存
                </Button>
                <Button onClick={this.goBack.bind(this)}>取消</Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Panel>
    )
  }
}

export default withRouter(Form.create()(AddMallCoupon))
