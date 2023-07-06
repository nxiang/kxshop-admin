import { Checkbox, Form, Input, Space } from 'antd'
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from 'react'
import Css from './index.module.scss'
import OssUpload from '@/components/OssUpload'
import OssUploadMul from '@/components/OssUploadMul'
import judgeDisabled from '../../../judgeDisabled'

export default forwardRef((props, ref) => {
  const {
    baseData, // 表单数据
    type, // 类型 edit、add
    status, // 券状态 当类型为edit时需要传入券状态拦截修改,
    // isDisplay, // 为当前步骤
    notDisabled,
    miniAppData = {},
    onChange = () => {}
  } = props

  const [form] = Form.useForm()

  // const [alipayMiniAppData, setAlipayMiniAppData] = useState({})

  const formLayout = {
    labelCol: { flex: '150px' },
    labelAlign: 'right',
    labelWrap: true,
    wrapperCol: { flex: 1 }
  }

  // 解构表单数据
  const { voucherDetailImages, isMappingExtCoupon = [] } = baseData
  const [isMappingExtCouponBol] = isMappingExtCoupon
  // ref的状态
  const stateRef = useRef({
    // 用户未操作表单除「同步支付宝商家券」的其它字段
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
      'alipayinfo baseData',
      baseData,
      miniAppData,
      stateRef.current.change
    )
    // 未勾选「同步商家券」，直接返回
    if (!isMappingExtCouponBol) return
    // 用户未操作表单除「同步支付宝商家券」的其它字段
    if (stateRef.current.change) return
    const data = { ...baseData }
    // 没有值的话，尝试从miniAppData
    data.miniAppId = data.miniAppId || miniAppData?.alipayAppid
    data.merchantId = data.merchantId || miniAppData?.alipayPid
    form.setFieldsValue(data)
  }, [isMappingExtCouponBol, baseData, miniAppData])

  // 自动获取AppId
  // useEffect(() => {
  //   getMiniAppData();
  // }, []);

  // useEffect(() => {
  //   const data = { ...baseData }
  //   const miniAppId = miniAppData?.alipayAppid
  //   const merchantId = miniAppData?.alipayPid

  // }, [miniAppData, baseData])

  // useEffect(() => {
  //   console.log('AlipayInfo123', isMappingExtCouponBol, miniAppData)
  //   let appid = ''
  //   let pid = ''
  //   if (isMappingExtCouponBol) {
  //     appid = miniAppData?.alipayAppid
  //     pid = miniAppData?.alipayPid
  //     setMiniAppIdValue(appid, pid)
  //   }
  // }, [isMappingExtCouponBol, miniAppData])

  // 表单值变化
  const formValueChange = (changedValues, allValues) => {
    console.log(
      'formValueChange',
      !!isMappingExtCouponBol,
      !!allValues?.isMappingExtCoupon?.[0]
    )
    // 是否勾选同步支付宝商家券
    const oldIsOpen = !!isMappingExtCouponBol
    const isOpen = !!allValues?.isMappingExtCoupon?.[0]
    // 「同步支付宝商家券」勾选上时
    if (!oldIsOpen && isOpen) {
      // 勾选上的时候，重置该字段
      stateRef.current.change = false
    } else {
      // 标识用户操作了表单的其它字段
      stateRef.current.change = true
    }
    console.log('formValueChange', isOpen, allValues)
    onChange(allValues)
  }

  // 获取支付宝小程序相关信息
  // const getMiniAppData = async () => {
  //   let params = {
  //     appId: localStorage.getItem('appId'),
  //     type: '1', // 小程序类型1支付宝2微信
  //   };
  //   let res = await getMiniAppBaseInfoApi(params);
  //   if (res.success) {
  //     setAlipayMiniAppData(res.data.program);
  //     const { alipayAppid, alipayPid } = res.data.program;
  //     setMiniAppIdValue(alipayAppid, alipayPid);
  //   }
  // };

  // 设置appid的值
  // const setMiniAppIdValue = (miniAppId, merchantId) => {
  //   console.log('setMiniAppIdValue', miniAppId, merchantId)
  //   let baseData = form.getFieldsValue(true)
  //   // if (baseData?.merchantId === merchantId) return
  //   let changedValues = { miniAppId, merchantId }
  //   let allValues = {
  //     ...baseData,
  //     ...changedValues
  //   }
  //   form.setFieldsValue(changedValues)
  //   onChange(allValues)
  // }

  // !isDisplay && Css['hiddenBox']
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
          <Form.Item label="同步支付宝商家券">
            <Form.Item name="isMappingExtCoupon" noStyle>
              <Checkbox.Group
                disabled={judgeDisabled(notDisabled, 'isMappingExtCoupon')}
              >
                <Checkbox value>领取后可同步至支付宝卡包</Checkbox>
              </Checkbox.Group>
            </Form.Item>
            <span className={Css['couponTips']}>
              注：若无需为支付宝商家券，请直接保存
            </span>
          </Form.Item>
        </div>

        {isMappingExtCoupon?.[0] ? (
          <>
            {/* 商家信息 */}
            <h2>商家信息</h2>
            <div>
              <Form.Item
                label="商家PID"
                name="merchantId"
                rules={[{ required: true, message: '请输入商家PID' }]}
                getValueFromEvent={(event) => event.target.value.trim()}
              >
                <Input
                  disabled={judgeDisabled(notDisabled, 'merchantId')}
                  className={Css['selectW']}
                  placeholder="请输入商家PID"
                />
              </Form.Item>
              <Form.Item
                label="商家品牌名称"
                name="brandName"
                tooltip="向用户进行展示"
              >
                <Input
                  disabled={judgeDisabled(notDisabled, 'brandName')}
                  className={Css['selectW']}
                  placeholder="不超过12个字"
                  maxLength={12}
                />
              </Form.Item>
              <Form.Item label="商家logo">
                <Form.Item name="brandLogo" noStyle>
                  <OssUpload
                    widthPx="100px"
                    heightPx="100px"
                    limitFormat={['image/jpeg', 'image/jpg', 'image/png']}
                    resolvingPower={[600, 600]}
                    disabled={judgeDisabled(notDisabled, 'brandLogo')}
                  />
                </Form.Item>
                <div className={Css['couponTips']}>
                  上传图片尺寸为600*600，支持格式：png，jpg，大小不超过2MB
                </div>
              </Form.Item>
              <Form.Item
                label="客服电话"
                name="customerServiceMobile"
                getValueFromEvent={(event) => event.target.value.trim()}
              >
                <Input
                  disabled={judgeDisabled(notDisabled, 'customerServiceMobile')}
                  className={Css['selectW']}
                  placeholder="请输入客服电话"
                  maxLength={20}
                />
              </Form.Item>
            </div>

            {/* 商品信息 */}
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

            {/* 券详情页 */}
            <h2>券详情页</h2>
            <div>
              <Form.Item label="券详情封面图" required>
                <Form.Item
                  name="voucherImage"
                  noStyle
                  rules={[{ required: true, message: '请上传券详情封面图' }]}
                >
                  <OssUpload
                    widthPx="202px"
                    heightPx="100px"
                    limitFormat={['image/jpeg', 'image/jpg', 'image/png']}
                    // resolvingPower={[670, 335]}
                    disabled={judgeDisabled(notDisabled, 'voucherImage')}
                  />
                </Form.Item>
                <div className={Css['couponTips']}>
                  上传图片尺寸为670*335，支持格式：png，jpg，大小不超过2MB
                </div>
              </Form.Item>
              <Form.Item label="券详细图列表">
                <Form.Item name="voucherDetailImages" noStyle>
                  <OssUploadMul
                    limitNum={3}
                    widthPx="100px"
                    heightPx="100px"
                    limitFormat={['image/jpeg', 'image/jpg', 'image/png']}
                    resolvingPower={[600, 600]}
                    disabled={judgeDisabled(notDisabled, 'voucherDetailImages')}
                  />
                </Form.Item>
                <div className={Css['couponTips']}>
                  上传图片尺寸为600*600，最多上传3张图，支持格式：png，jpg，单张大小不超过2MB
                </div>
              </Form.Item>
            </div>

            {/* 指定小程序 */}
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
                      <Checkbox value>
                        自然人限制：如用户使用同一身份证号注册或绑定多个支付宝账号，此用户只能通过一个支付宝账号完成领取
                      </Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                  <Form.Item name="phoneNumberLimit" noStyle>
                    <Checkbox.Group
                      disabled={judgeDisabled(notDisabled, 'phoneNumberLimit')}
                    >
                      <Checkbox value>
                        手机号限制：如一个手机号注册或绑定多个支付宝账号，此用户仅能通过一个支付宝账号完成领取
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
