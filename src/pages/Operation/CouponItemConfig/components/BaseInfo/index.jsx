import { floatObj } from '@/utils/utils'
import { DatePicker, Form, Input, InputNumber } from 'antd'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import judgeDisabled from '../../judgeDisabled'
import PreferentialSetting from './components/PreferentialSetting'
import TimeSetting from './components/TimeSetting'
import UsageRestrictions from './components/UsageRestrictions'
import Css from './index.module.scss'

export default forwardRef((props, ref) => {
  const {
    baseData, // 表单数据
    // type, // 类型 edit、add
    // status, // 券状态 当类型为edit时需要传入券状态拦截修改
    isNowStep, // 为当前步骤
    isWxSingle,
    notDisabled,
    onChange = () => {},
    couponAvailableClientsLable = [],
    goUseRequired
  } = props

  const { RangePicker } = DatePicker

  const [form] = Form.useForm()

  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      return form.validateFields()
    },
    setFieldsValue: (...args) => {
      form.setFieldsValue(...args)
    }
  }))

  const formLayout = {
    labelCol: { flex: '150px' },
    labelAlign: 'right',
    labelWrap: true,
    wrapperCol: { flex: 1 }
  }

  // 最大折扣优惠
  const [maxDisountMoney, setMaxDisountMoney] = useState(0)

  // 解构表单数据
  const {
    couponType,
    reviceTJ,
    couponTimeType,
    couponAvailableClients,
    couponSendRule,
    couponUseRule,
    availableBeginTime,
    availableEndTime
  } = baseData

  // 回显数据
  useEffect(() => {
    form.setFieldsValue(baseData)
  }, [baseData])

  // 动态设置最高价值
  useEffect(() => {
    if (couponUseRule?.specialCoupon) {
      const {
        ceilingItemUnitPrice = 0,
        specialAmount = 0,
        ceilingItemQuantity = 0
      } = couponUseRule.specialCoupon
      const num1 = floatObj.subtract(ceilingItemUnitPrice, specialAmount)
      const money = floatObj.multiply(num1, ceilingItemQuantity)
      setMaxDisountMoney(money)
    }
  }, [couponUseRule])

  // 当领取条件限制改变时操作form
  const reviceTJChange = (changedValues, allValues) => {
    if (changedValues?.reviceTJ) {
      allValues.couponSendRule.maxCouponsPerUser = ''
      form.setFieldsValue({
        couponSendRule: {
          ...allValues.couponSendRule,
          maxCouponsPerUser: ''
        }
      })
    }
    return allValues
  }

  // 表单值变化
  const formValueChange = (changedValues, allValues) => {
    // console.log('formValueChange',changedValues,allValues)
    allValues = reviceTJChange(changedValues, allValues)
    onChange(allValues)
  }

  return (
    <div
      className={`${
        !isNowStep && Css['hiddenBox']
      } singleItemCouponConfigBaseInfo`}
    >
      <Form
        {...formLayout}
        form={form}
        name="basicInfo"
        initialValues={baseData}
        autoComplete="off"
        onValuesChange={formValueChange}
      >
        {/* 基本信息 */}
        <h2>基本信息</h2>
        <div>
          <Form.Item
            label="券名称"
            name="couponName"
            rules={[{ required: true, message: '请输入券名称' }]}
            getValueFromEvent={(event) => event.target.value.trim()}
          >
            <Input
              className="w-52"
              // className={Css['selectW']}
              disabled={judgeDisabled(notDisabled, 'couponName')}
              placeholder="不超过12个字"
              maxLength={12}
            />
          </Form.Item>
          <Form.Item
            label="备注"
            name="comment"
            tooltip="不对用户展示，仅供商家在后台中管理活动"
          >
            <Input
              className="w-52"
              // className={Css['selectW']}
              disabled={judgeDisabled(notDisabled, 'comment')}
              placeholder="不超过20个字"
              maxLength={20}
            />
          </Form.Item>
        </div>

        {/* 优惠设置 */}
        <PreferentialSetting
          form={form}
          notDisabled={notDisabled}
          couponType={couponType}
          couponUseRule={couponUseRule}
          maxDisountMoney={maxDisountMoney}
        />

        {/* 营销预算 */}
        <h2>营销预算</h2>
        <div>
          <Form.Item
            label="发券数量"
            name={['couponSendRule', 'maxQuantity']}
            rules={[{ required: true, message: '请输入发券数量' }]}
          >
            <InputNumber
              min={couponSendRule?.maxCouponsPerUser || 1}
              max={999999}
              disabled={judgeDisabled(notDisabled, 'maxQuantity')}
              precision={0}
              className={Css['inputNumberW']}
              addonAfter="张"
            />
          </Form.Item>
        </div>

        {/* 使用限制与说明 */}
        <UsageRestrictions
          form={form}
          isWxSingle={isWxSingle}
          notDisabled={notDisabled}
          couponAvailableClientsLable={couponAvailableClientsLable}
          couponSendRule={couponSendRule}
          reviceTJ={reviceTJ}
          goUseRequired={goUseRequired}
        />

        {/* 时间设置 */}
        <TimeSetting
          notDisabled={notDisabled}
          couponTimeType={couponTimeType}
          couponUseRule={couponUseRule}
          isWxSingle={isWxSingle}
          availableBeginTime={availableBeginTime}
          availableEndTime={availableEndTime}
        />
      </Form>
    </div>
  )
})
