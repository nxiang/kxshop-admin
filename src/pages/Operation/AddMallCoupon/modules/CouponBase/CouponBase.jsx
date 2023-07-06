import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Input, InputNumber, Select } from 'antd'
import { Component } from 'react'
import Css from './CouponBase.module.scss'

const { Option } = Select
const { TextArea } = Input

class CouponBase extends Component {
  state = {
    // maxQuantityValue: ''
  }

  // 公共取整
  commonChangeToInt(e) {
    let str = e
    if (!str) {
      return
    }
    if (!isNaN(Number(str))) {
      str = String(str).replace(/^(-)*(\d+)\.(\d{1,4}).*$/, '$1$2')
    } else {
      str = ''
    }
    return str
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.props.form
    return (
      <div className={Css['CouponBase']}>
        <div className={Css['title']}>优惠基本信息配置</div>
        <Form.Item required label="名称">
          {getFieldDecorator('couponName', {
            rules: [
              {
                required: true,
                message: '名字不能为空'
              },
              {
                max: 9,
                message: '优惠券名称过长'
              }
            ]
          })(<Input placeholder="请输入优惠券名称" />)}
        </Form.Item>
        <Form.Item label="备注">
          {getFieldDecorator('comment', {
            rules: [
              {
                max: 15,
                message: '备注名称过长'
              }
            ]
          })(<Input placeholder="系统备注顾客不可见" />)}
        </Form.Item>

        <Form.Item required label="类型">
          {getFieldDecorator('couponType', {
            initialValue: getFieldValue('couponType') || 'NORMAL',
            rules: [
              {
                required: true,
                message: '请选择优惠券类型'
              }
            ]
          })(
            <Select style={{ width: 468 }}>
              <Option value="DISCOUNT">折扣券</Option>
              <Option value="NORMAL">代金券</Option>
            </Select>
          )}
        </Form.Item>
        {getFieldValue('couponType') === 'NORMAL' ? (
          <Form.Item required label="优惠金额">
            {getFieldDecorator('couponAmount', {
              rules: [
                {
                  required: true,
                  message: '请输入正确的优惠金额'
                }
              ]
            })(
              <InputNumber
                style={{ width: 468 }}
                min={0.01}
                max={9999}
                step={1}
                placeholder="请输入优惠金额"
              />
            )}
          </Form.Item>
        ) : (
          <div>
            <Form.Item required label="折扣额度">
              {getFieldDecorator('discountPercent', {
                rules: [
                  {
                    required: true,
                    message: '请输入正确的折扣额度'
                  }
                ]
              })(
                <InputNumber
                  style={{ width: 468 }}
                  min={0.01}
                  max={9.99}
                  step={0.01}
                  placeholder="0.01至9.99间的数字"
                />
              )}
            </Form.Item>
            <Form.Item required label="最多抵扣">
              {getFieldDecorator('maxDiscountAmount', {
                rules: [
                  {
                    required: true,
                    message: '请输入正确的最多抵扣'
                  }
                ]
              })(
                <InputNumber
                  style={{ width: 468 }}
                  min={0.01}
                  step={0.01}
                  max={99999.99}
                  placeholder="折扣券最多抵扣的金额"
                />
              )}
            </Form.Item>
          </div>
        )}

        <Form.Item label="券数量">
          {getFieldDecorator('maxQuantity', {
            rules: [{ required: true, message: '请填写正确的券数量' }],
            getValueFromEvent: this.commonChangeToInt
          })(
            <InputNumber
              placeholder="优惠券总数，最多99，999，999"
              style={{ width: 468 }}
              min={1}
              max={99999999}
            />
          )}
        </Form.Item>

        <Form.Item label="使用须知">
          {getFieldDecorator('instructions')(
            <TextArea
              placeholder="请输入文本说明，最多300字，可换行"
              maxLength={300}
              style={{ width: 468, height: 88 }}
            />
          )}
        </Form.Item>
      </div>
    )
  }
}

export default Form.create()(CouponBase)
