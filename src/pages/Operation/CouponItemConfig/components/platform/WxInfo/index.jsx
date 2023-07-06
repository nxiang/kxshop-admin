import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from 'react'
import { Form, Input, Space, Checkbox } from 'antd'
import judgeDisabled from '../../../judgeDisabled'
import VoucherWriteOffInfo from './VoucherWriteOffInfo'
import Css from '../AlipayInfo/index.module.scss'

export default forwardRef((props, ref) => {
  const {
    baseData, // 微信部分的表单数据
    baseInfoData, // 步骤一的表单数据
    // type, // 类型 edit、add
    // status, // 券状态 当类型为edit时需要传入券状态拦截修改,
    // isDisplay, // 为当前步骤
    notDisabled,
    miniAppData = {},
    onChange = () => {}
  } = props

  const [form] = Form.useForm()

  const formLayout = {
    labelCol: { flex: '150px' },
    labelAlign: 'right',
    labelWrap: true,
    wrapperCol: { flex: 1 }
  }

  // 解构表单数据
  const { isMappingExtCoupon = [] } = baseData
  const [isMappingExtCouponBol] = isMappingExtCoupon

  // ref的状态
  const stateRef = useRef({
    // 用户未操作表单除「同步商家券」的其它字段
    change: false
  })

  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      return form.validateFields()
    }
  }))

  // 回显数据
  useEffect(() => {
    console.log(
      'wxInfo baseData',
      isMappingExtCouponBol,
      baseData,
      miniAppData,
      stateRef.current.change
    )
    // 未勾选「同步商家券」，直接返回
    if(!isMappingExtCouponBol) return
    // 用户未操作表单除「同步商家券」的其它字段
    if (stateRef.current.change) return
      const data = { ...baseData }
      // 没有值的话，尝试从miniAppData
      data.miniAppId = data.miniAppId || miniAppData?.weixinAppid
      form.setFieldsValue(data)
  }, [isMappingExtCouponBol, baseData, miniAppData])

  // useEffect(() => {
  //   if (isMappingExtCouponBol) {
  //     const miniAppId = miniAppData?.weixinAppid
  //     console.log('isMappingExtCouponBol', miniAppData)
  //     // pid = miniAppData?.alipayPid
  //     setMiniAppIdValue(miniAppId)
  //   }
  // }, [isMappingExtCouponBol, miniAppData])

  // 表单值变化
  const formValueChange = (changedValues, allValues) => {
    console.log('formValueChange', !!isMappingExtCouponBol, !!allValues?.isMappingExtCoupon?.[0])
     // 是否勾选同步商家券
     const oldIsOpen = !!isMappingExtCouponBol
     const isOpen = allValues?.isMappingExtCoupon?.[0]
     // 「同步商家券」勾选上时
     if (!oldIsOpen && isOpen) {
       // 勾选上的时候，重置该字段
       stateRef.current.change = false
     } else {
       // 标识用户操作了表单的其它字段
       stateRef.current.change = true
     }
    onChange(allValues)
  }

  // 设置appid的值
  // const setMiniAppIdValue = (miniAppId) => {
  //   const baseData = form.getFieldsValue(true)
  //   // if (baseData?.miniAppId === miniAppId) return
  //   const changedValues = { miniAppId }
  //   const allValues = {
  //     ...baseData,
  //     ...changedValues
  //   }
  //   form.setFieldsValue(changedValues)
  //   onChange(allValues)
  // }

  return (
    <div className="singleItemCouponConfigBaseInfo">
      <Form
        {...formLayout}
        form={form}
        name="basicInfo"
        initialValues={baseData}
        autoComplete="off"
        onValuesChange={formValueChange}
      >
        {/* 券同步设置 */}
        <h2>券同步设置</h2>
        <div>
          <Form.Item label="同步微信商家券" className="mb-0">
            <Form.Item name="isMappingExtCoupon" noStyle>
              <Checkbox.Group
                disabled={judgeDisabled(notDisabled, 'isMappingExtCoupon')}
              >
                <Checkbox value={true}>领取后可同步至微信卡包</Checkbox>
                <span className={Css['couponTips']}>
                  注：若无需为微信商家券，请直接保存
                </span>
              </Checkbox.Group>
            </Form.Item>
          </Form.Item>
          {isMappingExtCoupon?.[0] && (
            <Form.Item
              label=" "
              colon={false}
              name="buildPartner"
              valuePropName="checked"
              className="mb-0"
            >
              <Checkbox>委托营销：微信支付有优惠(1800008659)</Checkbox>
            </Form.Item>
          )}
        </div>

        {isMappingExtCoupon?.[0] ? (
          <>
            {/* 券核销信息 */}
            <VoucherWriteOffInfo baseInfoData={baseInfoData} />

            <h2>商品信息</h2>
            <div>
              <Form.Item
                label="商品名称"
                name="goodsName"
                getValueFromEvent={(event) => event.target.value.trim()}
                rules={[{ required: true, message: '请输入商品名称' }]}
              >
                <Input
                  disabled={judgeDisabled(notDisabled, 'goodsName')}
                  className={Css['selectW']}
                  placeholder="不超过12个字"
                  maxLength={12}
                />
              </Form.Item>
            </div>
            <h2>指定小程序</h2>
            <div>
              <Form.Item label="APPID">
                <Form.Item
                  name="miniAppId"
                  noStyle
                  rules={[{ required: true, message: '请输入APPID' }]}
                >
                  <Input
                    className={Css['selectW']}
                    placeholder="请输入APPID"
                    disabled={judgeDisabled(notDisabled, 'miniAppId')}
                  />
                </Form.Item>
                <div className={Css['couponTips']}>
                  需正确填写APPID，否则指定小程序无效
                </div>
              </Form.Item>
              <Form.Item label="券核销跳转">
                <Form.Item name="miniAppPath" noStyle>
                  <Input
                    className={Css['selectW']}
                    placeholder="请输入券核销跳转"
                    disabled={judgeDisabled(notDisabled, 'miniAppPath')}
                  />
                </Form.Item>
                <div className={Css['couponTips']}>
                  若不填写则将跳转至小程序首页
                </div>
              </Form.Item>
              <Form.Item label="领券安全防刷">
                <Space className={Css['paddingTop']} direction="vertical">
                  <Form.Item name="naturalPersonLimit" noStyle>
                    <Checkbox.Group
                      disabled={judgeDisabled(
                        notDisabled,
                        'naturalPersonLimit'
                      )}
                    >
                      <Checkbox value={true}>
                        自然人限制：如用户使用同一身份证号注册或绑定多个微信账号，此用户只能通过一个微信账号完成领取
                      </Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                  <Form.Item name="phoneNumberLimit" noStyle>
                    <Checkbox.Group
                      disabled={judgeDisabled(notDisabled, 'phoneNumberLimit')}
                    >
                      <Checkbox value={true}>
                        可疑账号拦截：黑灰产账号等可疑账号拦截。
                      </Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                </Space>
              </Form.Item>
            </div>
          </>
        ) : (
          ''
        )}
      </Form>
    </div>
  )
})
