import judgeDisabled from '@/pages/Operation/CouponItemConfig/judgeDisabled'
import { isEmpty } from '@/utils/tools'
import { floatObj } from '@/utils/utils'
import { Checkbox, Form, InputNumber, Radio, Space } from 'antd'
import { useRef } from 'react'
import GoodsChooseTable from '../../../GoodsChooseTable'
import Css from './index.module.scss'

export default (props) => {
  const { form, couponType, maxDisountMoney, couponUseRule, notDisabled } =
    props
  // 券类型label
  const couponTypeOption = [
    { label: '满减券', value: 'NORMAL' },
    { label: '折扣券', value: 'DISCOUNT' },
    { label: '特价券', value: 'SPECIAL' }
  ]

  /** 搭售弹框的ref */
  const tyingRef = useRef()

  // 商品搭售勾选
  const checked = Form.useWatch(
    ['couponUseRule', 'couponBundleItem', 'checked'],
    form
  )
  console.log('checked', checked)

  /** 选择指定商品的ids */
  const availableItems = Form.useWatch(
    ['couponUseRule', 'availableItems'],
    form
  )

  /** 搭售商品的ids */
  const itemIds = Form.useWatch(
    ['couponUseRule', 'couponBundleItem', 'itemIds'],

    form
  )
  /** 搭售类型 */
  const type = Form.useWatch(
    ['couponUseRule', 'couponBundleItem', 'type'],
    form
  )

  console.log('itemIdsx', itemIds)

  const couponBundleItem = Form.useWatch(
    ['couponUseRule', 'couponBundleItem'],
    form
  )
  console.log('couponBundleItem', couponBundleItem)

  return (
    <>
      <h2>优惠设置</h2>
      <div>
        <Form.Item
          label="指定商品可用"
          name={['couponUseRule', 'availableItems']}
          rules={[{ required: true, message: '请选择可用的商品' }]}
        >
          <GoodsChooseTable
            disabled={judgeDisabled(notDisabled, 'availableItems')}
            unSelectedRowKeys={itemIds}
          />
        </Form.Item>
        <Form.Item
          label="券类型"
          name="couponType"
          rules={[{ required: true, message: '请选择券类型' }]}
        >
          <Radio.Group
            disabled={judgeDisabled(notDisabled, 'couponType')}
            options={couponTypeOption}
          />
        </Form.Item>

        {couponType === 'NORMAL' && (
          <Form.Item label="优惠规则" required>
            <Space align="center">
              指定商品消费满{' '}
              <Form.Item
                noStyle
                name={[
                  'couponUseRule',
                  'fixedNormalCoupon',
                  'transactionMinimum'
                ]}
                rules={[{ required: true, message: '请输入需要满足的金额' }]}
              >
                <InputNumber
                  className={Css['inputNumberW']}
                  addonAfter="元"
                  disabled={judgeDisabled(notDisabled, 'transactionMinimum')}
                  min={0.1}
                  max={50000}
                  precision={2}
                />
              </Form.Item>
              减
              <Form.Item
                noStyle
                name={['couponUseRule', 'fixedNormalCoupon', 'couponAmount']}
                rules={[{ required: true, message: '请输入优惠金额' }]}
              >
                <InputNumber
                  className={Css['inputNumberW']}
                  disabled={judgeDisabled(notDisabled, 'couponAmount')}
                  addonAfter="元"
                  min={0.1}
                  max={3000}
                  precision={2}
                />
              </Form.Item>
            </Space>
          </Form.Item>
        )}

        {couponType === 'DISCOUNT' && (
          <>
            <Form.Item label="优惠规则" required>
              <Space align="center">
                指定商品消费满{' '}
                <Form.Item
                  noStyle
                  name={[
                    'couponUseRule',
                    'discountCoupon',
                    'transactionMinimum'
                  ]}
                  rules={[{ required: true, message: '请输入需要满足的金额' }]}
                >
                  <InputNumber
                    className={Css['inputNumberW']}
                    disabled={judgeDisabled(notDisabled, 'transactionMinimum')}
                    addonAfter="元"
                    min={0.1}
                    max={50000}
                    precision={2}
                  />
                </Form.Item>
                享折扣
                <Form.Item
                  noStyle
                  name={['couponUseRule', 'discountCoupon', 'discountPercent']}
                  rules={[{ required: true, message: '请输入优惠折扣' }]}
                >
                  <InputNumber
                    className={Css['inputNumberW']}
                    disabled={judgeDisabled(notDisabled, 'discountPercent')}
                    addonAfter="折"
                    min={0.1}
                    max={9.9}
                    precision={1}
                  />
                </Form.Item>
              </Space>
            </Form.Item>
            <Form.Item
              label="最高优惠金额"
              name={['couponUseRule', 'discountCoupon', 'maxDiscountAmount']}
              rules={[{ required: true, message: '请输入最高优惠金额' }]}
            >
              <InputNumber
                className={Css['inputNumberW']}
                disabled={judgeDisabled(notDisabled, 'maxDiscountAmount')}
                addonAfter="元"
                min={0.1}
                max={15000}
                precision={2}
              />
            </Form.Item>
          </>
        )}

        {couponType === 'SPECIAL' && (
          <>
            <Form.Item label="优惠规则" required>
              <Space align="center">
                指定商品消费满{' '}
                <Form.Item
                  noStyle
                  name={[
                    'couponUseRule',
                    'specialCoupon',
                    'transactionMinimum'
                  ]}
                  rules={[{ required: true, message: '请输入需要满足的金额' }]}
                >
                  <InputNumber
                    className={Css['inputNumberW']}
                    disabled={judgeDisabled(notDisabled, 'transactionMinimum')}
                    addonAfter="元"
                    min={0.1}
                    max={50000}
                    precision={2}
                  />
                </Form.Item>
                享特价
                <Form.Item
                  noStyle
                  name={['couponUseRule', 'specialCoupon', 'specialAmount']}
                  rules={[{ required: true, message: '请输入特价价格' }]}
                >
                  <InputNumber
                    className={Css['inputNumberW']}
                    disabled={judgeDisabled(notDisabled, 'specialAmount')}
                    addonAfter="元"
                    min={0}
                    max={
                      couponUseRule?.specialCoupon?.ceilingItemUnitPrice || 999
                    }
                    precision={2}
                  />
                </Form.Item>
              </Space>
            </Form.Item>
            <Form.Item
              label="最高商品单价"
              name={['couponUseRule', 'specialCoupon', 'ceilingItemUnitPrice']}
              rules={[{ required: true, message: '请输入最高商品单价' }]}
            >
              <InputNumber
                disabled={
                  (!couponUseRule?.specialCoupon?.specialAmount &&
                    couponUseRule?.specialCoupon?.specialAmount !== 0) ||
                  judgeDisabled(notDisabled, 'ceilingItemUnitPrice')
                }
                className={Css['inputNumberW']}
                addonAfter="元"
                min={
                  couponUseRule?.specialCoupon?.specialAmount
                    ? floatObj.add(
                        couponUseRule?.specialCoupon?.specialAmount,
                        0.1
                      )
                    : '' || 0.1
                }
                max={9999}
                precision={2}
              />
            </Form.Item>
            <Form.Item
              label="最多优惠商品件数"
              name={['couponUseRule', 'specialCoupon', 'ceilingItemQuantity']}
              rules={[{ required: true, message: '请输入最多优惠商品件数' }]}
            >
              <InputNumber
                min={1}
                max={99}
                precision={0}
                disabled={judgeDisabled(notDisabled, 'ceilingItemQuantity')}
                className={Css['inputNumberW']}
                addonAfter="件"
              />
            </Form.Item>
            <Form.Item label="最高优惠金额">
              <Space direction="vertical" size="0">
                <h1 className={Css?.['maxDiscountMoney']}>
                  ¥{maxDisountMoney}
                </h1>
                <div className={Css?.['couponTips']}>
                  最高优惠金额 =（最高商品单价 - 特价）* 优惠数量限制
                </div>
              </Space>
            </Form.Item>
          </>
        )}

        <Form.Item label="其它规则">
          <div className="text-gray-400 mt-1.5">
            除满足门槛金额外，还需满足以下规则 才能使用该优惠券。用 于随单带走
            等活动场景下 配券
          </div>
          <div className="flex items-center">
            <Form.Item
              label=""
              className="m-0"
              name={['couponUseRule', 'couponBundleItem', 'checked']}
              valuePropName="checked"
            >
              <Checkbox disabled={judgeDisabled(notDisabled, 'checked')}>
                满足 指定商品搭售
              </Checkbox>
            </Form.Item>
            <span className="text-gray-400">
              下订单时，订单中包含 指定搭售商品，才能核销该优惠券
            </span>
          </div>

          <div className={`${checked ? '' : 'hidden'}`}>
            <Form.Item
              className="ml-4 mb-0"
              label={
                <span
                  onClick={() => {
                    console.log('tyingRef', tyingRef)
                    tyingRef.current?.lookup?.()
                  }}
                  className="text-blue-400 cursor-pointer"
                >
                  已添加 {itemIds?.length || 0}件 搭售商品
                </span>
              }
              colon={false}
              name={['couponUseRule', 'couponBundleItem', 'itemIds']}
              rules={[
                {
                  validator: async (_, value) => {
                    let reuslt
                    /** 未勾选，则直接通过 */
                    if (!checked) {
                      reuslt = Promise.resolve()
                    } else if (isEmpty(value) || value?.length === 0)
                      reuslt = Promise.reject(new Error('请添加需要搭售的商品'))
                    else {
                      reuslt = Promise.resolve()
                    }
                    return reuslt
                  }
                }
              ]}
            >
              <GoodsChooseTable
                dialogRef={tyingRef}
                disabled={judgeDisabled(notDisabled, 'itemIds')}
                isCheckedTips={false}
                buttonProps={{
                  text: '添加商品',
                  type: 'primary',
                  size: 'small'
                }}
                unSelectedRowKeys={availableItems}
              />
            </Form.Item>
            <Form.Item
              label=""
              className="mt-2"
              name={['couponUseRule', 'couponBundleItem', 'type']}
            >
              <Radio.Group disabled={judgeDisabled(notDisabled, 'type')}>
                <Radio value={1}>
                  <div className="flex items-center">
                    <div>搭售指定商品数量 满</div>
                    <Form.Item
                      className="mb-0"
                      name={[
                        'couponUseRule',
                        'couponBundleItem',
                        'bundlePieces'
                      ]}
                      rules={[
                        {
                          validator: async (_, value) => {
                            const num = Number(value)
                            let reuslt
                            if (!checked) {
                              /** 未勾选搭售，则直接通过 */
                              reuslt = Promise.resolve()
                            } else if (type !== 1) {
                              /** 单选未勾选，则直接通过 */
                              reuslt = Promise.resolve()
                            } else if (isEmpty(value))
                              reuslt = Promise.reject(new Error('必填项'))
                            else if (!Number.isInteger(num)) {
                              reuslt = Promise.reject(new Error('请填入正整数'))
                            } else if (num <= 0) {
                              reuslt = Promise.reject(new Error('需大于零'))
                            } else {
                              reuslt = Promise.resolve()
                            }
                            return reuslt
                          }
                        }
                      ]}
                    >
                      <InputNumber
                        disabled={
                          type !== 1 ||
                          judgeDisabled(notDisabled, 'bundlePieces')
                        }
                        // min={1}
                        // max={999}
                        precision={0}
                        addonAfter="件"
                        controls={false}
                        className="ml-2 w-16"
                      />
                    </Form.Item>
                  </div>
                </Radio>
                <br />
                <Radio value={2} className="mt-2">
                  <div className="flex items-center">
                    <div>搭售指定商品金额 满</div>
                    <Form.Item
                      className="mb-0"
                      name={[
                        'couponUseRule',
                        'couponBundleItem',
                        'bundlePrice'
                      ]}
                      rules={[
                        {
                          validator: async (_, value) => {
                            const num = Number(value)
                            let reuslt
                            if (!checked) {
                              /** 未勾选搭售，则直接通过 */
                              reuslt = Promise.resolve()
                            } else if (type !== 2) {
                              /** 单选未勾选，则直接通过 */
                              reuslt = Promise.resolve()
                            } else if (isEmpty(value))
                              reuslt = Promise.reject(new Error('必填项'))
                            else if (num <= 0) {
                              reuslt = Promise.reject(new Error('需大于零'))
                            } else {
                              reuslt = Promise.resolve()
                            }
                            return reuslt
                          }
                        }
                      ]}
                    >
                      <InputNumber
                        disabled={
                          type !== 2 ||
                          judgeDisabled(notDisabled, 'bundlePrice')
                        }
                        // min={0}
                        // max={999}
                        precision={2}
                        addonAfter="元"
                        controls={false}
                        className="ml-2 w-16"
                      />
                    </Form.Item>
                  </div>
                </Radio>
              </Radio.Group>
            </Form.Item>
          </div>
        </Form.Item>
      </div>
    </>
  )
}
