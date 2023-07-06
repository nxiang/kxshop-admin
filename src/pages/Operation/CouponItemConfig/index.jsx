import Panel from '@/components/Panel'
import { defualtMiniProgramHomePath } from '@/consts'
import {
  clientList,
  detail,
  editCoupon,
  getMiniAppBaseInfoApi,
  newCoupon
} from '@/services/coupon'
import { useLocation } from '@/utils/compatible'
import { floatObj } from '@/utils/utils'
import { history } from '@umijs/max'
import { Button, Modal, Space, Spin, message } from 'antd'
import { connect } from 'dva'
import { cloneDeep } from 'lodash-es'
import moment from 'moment'
import { useEffect, useMemo, useRef, useState } from 'react'
import BaseInfo from './components/BaseInfo/index'
import AlipayInfo from './components/platform/AlipayInfo/index'
import WxInfo from './components/platform/WxInfo/index'
import Css from './index.module.scss'
// eslint-disable-next-line import/no-unresolved
import { filedTransform } from './utils'

const mapStateToProps = (state) => {
  return {
    collapsed: state.global.collapsed
  }
}

export default connect(mapStateToProps)((props) => {
  const { collapsed } = props
  const location = useLocation()

  // 券批次ID
  const {
    query: { id, scope, isCopy }
  } = location

  const baseInfoRefs = useRef()
  const alipayInfoRefs = useRef()
  const wxInfoRefs = useRef()
  /** 「点击“去使用”跳转」，是否必填，编辑时，若详情返回有值则必填 */
  const [goUseRequired, setGoUseRequired] = useState(false)
  /** 表单数据 */
  const [baseInfoData, setBaseInfoData] = useState({
    couponType: 'NORMAL',
    couponSendRule: { couponReceiveWay: 0 },
    reviceTJ: 1,
    couponTimeType: 1,
    couponUseRule: {
      couponBundleItem: {
        /** 是否勾选，仅前端使用 */
        checked: false,
        /** 商品id列表 */
        itemIds: [],
        /** 搭售类型：1.商品数量，2. 商品金额  */
        type: 1,
        // /** 搭售值 */
        // bundleValue: 0,
        /** 搭售件数，仅前端使用 */
        bundlePieces: undefined,
        /** 搭售金额，仅前端使用 */
        bundlePrice: undefined
      }
    }
  })
  /** 步骤二：数据 */
  const [step2Data, setStep2Data] = useState({
    isMappingExtCoupon: [],
    voucherDetailImages: []
  })
  /** 步骤二：微信商家券数据 */
  // const [wxInfoData, setWxInfoData] = useState({
  //   isMappingExtCoupon: []
  // })
  // 小程序配置
  const [miniAppData, setMiniAppData] = useState({
    alipayAppid: undefined,
    alipayPid: undefined,
    weixinAppid: undefined
  })
  // console.log('step2Data', step2Data)

  // laoding
  const [spinning, setSpinning] = useState(false)
  // 步骤
  const [step, setStep] = useState(1)
  // 是否能下一步
  const [isNextStep, setIsNextStep] = useState(false)

  // 可编辑列表
  const [notDisabled, setNotDisabled] = useState({ all: true })

  // 可用渠道
  const [couponAvailableClientsLable, setCouponAvailableClientsLable] =
    useState([
      // { label: '支付宝', value: 1 },
      // { label: '微信', value: 2 },
    ])

  // 提示弹窗
  const [tipsVisible, setTipsVisible] = useState(false)

  const { couponUseRule, couponSendRule } = baseInfoData
  // 是否关联外部券
  const isMappingExtCouponBol = !!step2Data.isMappingExtCoupon?.[0]

  // 处理详情或者复制的数据
  const dealCouponInfo = (couponInfo) => {
    console.log('dealCouponInfo start', couponInfo)
    const {
      availableBeginTime,
      availableEndTime,
      couponName,
      couponType,
      instructions,
      comment,
      couponSendRule = {},
      couponUseRule = {},
      isMappingExtCoupon,
      extCouponConfig = {},
      /** 跳转路径 */
      redirectPath
    } = couponInfo
    setGoUseRequired(!!(id && redirectPath))

    const {
      couponAvailableTime,
      fixedNormalCoupon,
      discountCoupon,
      specialCoupon,
      couponBundleItem
    } = couponUseRule

    if (couponAvailableTime?.isFixedTime) {
      couponAvailableTime.availableBeginTime = moment(
        couponAvailableTime.availableBeginTime
      )
      couponAvailableTime.availableEndTime = moment(
        couponAvailableTime.availableEndTime
      )
    }

    if (fixedNormalCoupon) {
      fixedNormalCoupon.couponAmount = floatObj.divide(
        fixedNormalCoupon.couponAmount,
        100
      )
      fixedNormalCoupon.transactionMinimum = floatObj.divide(
        fixedNormalCoupon.transactionMinimum,
        100
      )
    }
    if (discountCoupon) {
      discountCoupon.maxDiscountAmount = floatObj.divide(
        discountCoupon.maxDiscountAmount,
        100
      )
      discountCoupon.discountPercent = floatObj.divide(
        discountCoupon.discountPercent,
        100
      )
      discountCoupon.transactionMinimum = floatObj.divide(
        discountCoupon.transactionMinimum,
        100
      )
    }
    if (specialCoupon) {
      specialCoupon.transactionMinimum = floatObj.divide(
        specialCoupon.transactionMinimum,
        100
      )
      specialCoupon.specialAmount = floatObj.divide(
        specialCoupon.specialAmount,
        100
      )
      specialCoupon.ceilingItemUnitPrice = floatObj.divide(
        specialCoupon.ceilingItemUnitPrice,
        100
      )
      specialCoupon.ceilingItemQuantity = specialCoupon.ceilingItemQuantity
    }

    const baseInfo = {
      couponName,
      comment,
      couponType,
      instructions,
      availableBeginTime: moment(availableBeginTime),
      availableEndTime: moment(availableEndTime),
      couponSendRule,
      couponUseRule: {
        ...couponUseRule,
        couponAvailableTime,
        /** 接口数据转换为表单使用值 */
        couponBundleItem:
          filedTransform.couponBundleItem.interfaceToForm(couponBundleItem)
      },
      redirectPath
    }

    // 设置 reviceTJ
    if (couponSendRule?.maxCouponsPerUser === couponSendRule?.maxQuantity) {
      baseInfo.reviceTJ = 1
      couponSendRule.maxCouponsPerUser = ''
    } else {
      baseInfo.reviceTJ = 2
    }
    // 设置 couponTimeType
    if (couponAvailableTime?.isFixedTime) {
      baseInfo.couponTimeType = 1
    } else {
      baseInfo.couponTimeType =
        couponAvailableTime?.daysAvailableAfterReceive === 0 ? 2 : 3
    }
    setBaseInfoData(baseInfo)
    // 处理第二步数据
    if (isMappingExtCoupon) {
      const { naturalPersonLimit, phoneNumberLimit } = extCouponConfig
      const step2Data = {
        ...extCouponConfig,
        isMappingExtCoupon: isMappingExtCoupon ? [isMappingExtCoupon] : [],
        naturalPersonLimit: naturalPersonLimit ? [naturalPersonLimit] : [],
        phoneNumberLimit: phoneNumberLimit ? [phoneNumberLimit] : []
      }
      // console.log('isZfbSingle dealCouponInfo',isZfbSingle,alipayInfo)
      setStep2Data(step2Data)
    }
  }

  // 获取优惠券信息
  const getCouponData = async () => {
    setSpinning(true)
    try {
      const info = await detail({ stockId: id })
      if (info.success) {
        dealCouponInfo(info.data)
        // 处理不禁用的数据
        const notDisabled = {
          comment: true,
          // availableItems: true,
          instructions: true,
          availableEndTime: true,
          availableDays: true,
          miniAppPath: true,
          brandLogo: true,
          customerServiceMobile: true,
          voucherImage: true,
          voucherDetailImages: true,
          csmVal: info.data?.extCouponConfig?.customerServiceMobile,
          getAvailableEndTimeMoment: moment(info.data.availableEndTime)
        }
        if (info.data.couponUseRule?.couponAvailableTime?.isFixedTime) {
          notDisabled.useAvailableEndTimeMoment = moment(
            info.data.couponUseRule?.couponAvailableTime.availableEndTime
          )
        } else {
          notDisabled.oldAvailableDays =
            info.data.couponUseRule?.couponAvailableTime?.availableDays
        }
        setNotDisabled(notDisabled)
      }
    } catch (error) {
      console.error(error)
    }
    setSpinning(false)
  }

  // 初始化可用渠道
  const initChannel = async () => {
    const info = await clientList()
    if (info && info.data.length > 0) {
      const newlist = []
      info.data.forEach((val) => {
        const { clientName: label, clientId: value } = val
        newlist.push({ label, value: parseInt(value, 10) })
      })
      setCouponAvailableClientsLable(newlist)
    } else {
      setTipsVisible(true)
    }
  }

  // 单选微信小程序时，券可用时间不能选中立即生效
  // useEffect(() => {
  //   const { couponTimeType } = baseInfoData
  //   if (isWxSingle && couponTimeType == 2) {
  //     console.log('修改券可用类型')
  //     baseInfoRefs.current?.setFieldsValue?.({ couponTimeType: 1 })
  //   }
  // }, [baseInfoData, isWxSingle, baseInfoRefs])
  // console.log('baseInfoData', baseInfoData)

  useEffect(() => {
    // 可用渠道
    initChannel()
    // 获取详情
    if (id) getCouponData()
  }, [])

  // 复制数据
  useEffect(() => {
    try {
      if (isCopy == 1) {
        const jsonStr = localStorage.getItem('copyCoupon')
        if (!jsonStr) return
        const couponInfo = JSON.parse(jsonStr)
        dealCouponInfo(couponInfo)
        localStorage.removeItem('copyCoupon')
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

  const couponAvailableClients = couponUseRule?.couponAvailableClients
  console.log('couponAvailableClients', couponAvailableClients)
  // 可用渠道：单选微信
  const isWxSingle = useMemo(() => {
    if (!Array.isArray(couponAvailableClients)) return false
    if (couponAvailableClients.length !== 1) return false
    return couponAvailableClients[0] === 2
  }, [couponAvailableClients])
  // 可用渠道：单选支付宝
  const isZfbSingle = useMemo(() => {
    if (!Array.isArray(couponAvailableClients)) return false
    if (couponAvailableClients.length !== 1) return false
    return couponAvailableClients[0] === 1
  }, [couponAvailableClients])
  // 可用渠道，全选
  const isAllChannel = useMemo(() => {
    if (!Array.isArray(couponAvailableClients)) return false
    if (couponAvailableClients.length !== 2) return false
    return couponAvailableClients[0] === 1 && couponAvailableClients[1] === 2
  }, [couponAvailableClients])

  const { couponReceiveWay } = couponSendRule
  useEffect(() => {
    // console.log('isAllChannel', isAllChannel, couponReceiveWay)
    // 可用渠道：全选，或选择活动领取
    if (isAllChannel || couponReceiveWay === 1) {
      // 重置关联外部券的状态
      setStep2Data({
        ...step2Data,
        isMappingExtCoupon: []
      })
    }
  }, [isAllChannel, couponReceiveWay])

  // 获取微信小程序相关信息
  const getMiniAppData = async () => {
    const tasks = []
    // 检查可用渠道是否有支付宝
    const isZfb = couponAvailableClientsLable.some((item) => item.value == 1)
    console.log('getMiniAppData', couponAvailableClientsLable)
    const appId = localStorage.getItem('appId')
    const miniAppData = {
      weixinAppid: '',
      alipayAppid: '',
      alipayPid: ''
    }
    if (isZfb) {
      const task = new Promise(async (resolve) => {
        const res = await getMiniAppBaseInfoApi({
          appId,
          type: '1'
        })
        if (!res?.success) return resolve()
        const program = res?.data?.program || {}
        const { alipayAppid, alipayPid } = program
        if (!alipayAppid || !alipayPid) return resolve()
        miniAppData.alipayPid = alipayPid
        miniAppData.alipayAppid = alipayAppid

        console.log('alipayAppidxxx', alipayAppid, alipayPid)
        resolve()
      })
      // await task
      tasks.push(task)
    }
    // 检查可用渠道是否有微信
    const isWx = couponAvailableClientsLable.some((item) => item.value == 2)
    if (isWx) {
      const task = new Promise(async (resolve) => {
        const res = await getMiniAppBaseInfoApi({
          appId,
          type: '2'
        })
        if (!res?.success) return resolve()
        const program = res?.data?.program || {}
        const { weixinAppid, alipayPid } = program
        if (!weixinAppid) return resolve()
        console.log('weixinAppidxxx', weixinAppid)
        miniAppData.weixinAppid = weixinAppid
        resolve()
      })
      // await task
      tasks.push(task)
    }
    await Promise.all(tasks)
    setMiniAppData(miniAppData)
    // console.log('miniAppDataxx', miniAppData)
  }

  // 获取微信/小程序相关信息
  useEffect(() => {
    // 没有可用渠道直接返回
    if (!couponAvailableClientsLable?.length) return
    // 编辑时直接返回
    if (id) return
    getMiniAppData()
  }, [couponAvailableClientsLable, id])

  // 判断关键字段 用以修改 是否能够同步支付宝字段
  useEffect(() => {
    // 选择活动领取、可用渠道多选，页面按钮直接为【保存】和【立即发布】
    // couponSendRule?.couponReceiveWay == 1 || couponUseRule?.couponAvailableClients?.includes(2)
    // eslint-disable-next-line no-unused-expressions
    couponSendRule?.couponReceiveWay == 1 ||
    couponAvailableClients?.length === 2
      ? setIsNextStep(false)
      : setIsNextStep(true)
  }, [couponSendRule])

  // 信息校验判断
  const getBaseInfoData = async (nextFn, nowStep) => {
    function errorDeal(errorInfo) {
      if (!errorInfo) return
      const { errorFields = [] } = errorInfo
      console.log('errorInfo', errorInfo)
      if (errorFields.length > 1) {
        message.warning('请填写完整信息')
      } else {
        const [errorInfo] = errorFields
        message.warning(errorInfo?.errors?.[0] || '请填写完整信息')
      }
    }
    try {
      await baseInfoRefs.current.handleSubmit()
      if (nowStep == 1) {
        // eslint-disable-next-line no-unused-expressions
        nextFn && nextFn()
      } else if (nowStep == 2) {
        let handleSubmit
        if (isZfbSingle) {
          handleSubmit = alipayInfoRefs.current.handleSubmit
        } else if (isWxSingle) {
          handleSubmit = wxInfoRefs.current.handleSubmit
        }
        await handleSubmit?.()
        // eslint-disable-next-line no-unused-expressions
        nextFn && nextFn()
      }
    } catch (error) {
      errorDeal(error)
    }
  }

  // 获取编辑的数据
  const getParams = ({ isMappingExtCouponBol = false, isDraft }) => {
    const baseInfo = cloneDeep(baseInfoData)
    const step2Info = cloneDeep(step2Data)
    // const wxInfo = cloneDeep(wxInfoData)
    console.log('getParams', baseInfo, step2Info)
    /** 外部券类型 alipay 支付宝商家券 wechat 微信商家券 */
    let extCouponType
    // // 步骤二的表单数据
    // let step2Info = {}
    if (isZfbSingle) {
      // step2Info = alipayInfo
      extCouponType = 'alipay'
    } else if (isWxSingle) {
      // step2Info = wxInfo
      extCouponType = 'wechat'
    }
    const {
      couponName,
      comment,
      couponType,
      instructions,
      couponSendRule,
      couponUseRule,
      availableBeginTime,
      availableEndTime,
      reviceTJ,
      couponTimeType,
      redirectPath
    } = baseInfo

    couponUseRule.couponBundleItem =
      filedTransform.couponBundleItem.formToInterface(
        couponUseRule.couponBundleItem
      )

    const params = {
      couponName,
      comment,
      couponType,
      instructions,
      couponSendRule,
      couponUseRule,
      availableBeginTime: moment(availableBeginTime).format(
        'YYYY-MM-DD HH:mm:ss'
      ),
      availableEndTime: moment(availableEndTime).format('YYYY-MM-DD HH:mm:ss'),
      redirectPath
    }
    // 单品or全场
    params.scope = scope
    // 是否草稿
    params.isDraft = isDraft
    // 是否关联外部券
    params.isMappingExtCoupon = isMappingExtCouponBol
    // 券批次Id
    if (id) params.stockId = id
    // 是否固定时间 ，couponTimeType为1设置为true其余为false
    params.couponUseRule.couponAvailableTime.isFixedTime = couponTimeType == 1
    // 若不是固定时间则需要配置时间转化
    if (couponTimeType == 1) {
      const { availableBeginTime: startTime, availableEndTime: endTime } =
        params.couponUseRule.couponAvailableTime
      params.couponUseRule.couponAvailableTime.availableBeginTime = moment(
        startTime
      )?.format('YYYY-MM-DD HH:mm:ss')
      params.couponUseRule.couponAvailableTime.availableEndTime = moment(
        endTime
      )?.format('YYYY-MM-DD HH:mm:ss')
    }

    // 若为不限制，自动设置可领张数为最大值
    if (reviceTJ == 1) {
      couponSendRule.maxCouponsPerUser = couponSendRule.maxQuantity
    }

    // 微信侧用户领取，限制最大是100
    if (extCouponType === 'wechat') {
      couponSendRule.maxCouponsPerUser = Math.min(
        couponSendRule.maxCouponsPerUser,
        100
      )
    }

    // 设置金额为分
    if (couponType === 'NORMAL') {
      const { couponAmount, transactionMinimum } =
        params.couponUseRule.fixedNormalCoupon
      params.couponUseRule.fixedNormalCoupon = {
        couponAmount: floatObj.multiply(couponAmount, 100),
        transactionMinimum: floatObj.multiply(transactionMinimum, 100)
      }
    } else if (couponType === 'DISCOUNT') {
      const { maxDiscountAmount, discountPercent, transactionMinimum } =
        params.couponUseRule.discountCoupon
      params.couponUseRule.discountCoupon = {
        maxDiscountAmount: floatObj.multiply(maxDiscountAmount, 100),
        discountPercent: floatObj.multiply(discountPercent, 100),
        transactionMinimum: floatObj.multiply(transactionMinimum, 100)
      }
    } else if (couponType === 'SPECIAL') {
      const {
        transactionMinimum,
        specialAmount,
        ceilingItemUnitPrice,
        ceilingItemQuantity,
        ceilingAmount
      } = params.couponUseRule.specialCoupon
      params.couponUseRule.specialCoupon = {
        ceilingItemQuantity,
        specialAmount: floatObj.multiply(specialAmount, 100),
        ceilingItemUnitPrice: floatObj.multiply(ceilingItemUnitPrice, 100),
        ceilingAmount: floatObj.multiply(ceilingAmount, 100),
        transactionMinimum: floatObj.multiply(transactionMinimum, 100)
      }
    }
    // 当选择立即生效是，设置领取后0天生效
    if (couponTimeType == 2) {
      params.couponUseRule.couponAvailableTime.daysAvailableAfterReceive = 0
      // isWxSingle ? undefined : 0
    }

    if (isMappingExtCouponBol) {
      let { miniAppPath } = step2Info
      const {
        merchantId,
        brandName,
        brandLogo,
        voucherImage,
        voucherDetailImages,
        customerServiceMobile,
        naturalPersonLimit,
        phoneNumberLimit,
        miniAppId,
        goodsName,
        buildPartner
      } = step2Info
      // 处理支付宝数据
      params.extCouponType = extCouponType
      console.log(
        'isMappingExtCouponBol',
        isMappingExtCouponBol,
        extCouponType,
        miniAppPath
      )
      // 同步微信券时，如果跳转路径为空，则写小程序默认首页路径
      if (isMappingExtCouponBol && extCouponType === 'wechat' && !miniAppPath) {
        miniAppPath = defualtMiniProgramHomePath
      }
      params.extCouponConfig = {
        // 微信委托营销
        buildPartner,
        merchantId,
        brandName,
        brandLogo,
        voucherImage,
        voucherDetailImages,
        customerServiceMobile,
        naturalPersonLimit: naturalPersonLimit?.length
          ? naturalPersonLimit[0]
          : false,
        phoneNumberLimit: phoneNumberLimit?.length
          ? phoneNumberLimit[0]
          : false,
        miniAppId,
        miniAppPath,
        goodsName
      }
    }

    return params
  }

  // 下一步
  const goNextStep = () => {
    getBaseInfoData(() => {
      return setStep(2)
    }, 1)
  }

  // 保存数据
  const submitData = (isDraft) => {
    // 判断是否同步支付宝
    getBaseInfoData(async () => {
      setSpinning(true)
      try {
        const params = getParams({ isMappingExtCouponBol, isDraft })
        console.log('newCoupon params', params)
        const info = await newCoupon(params)
        if (info.success) {
          message.success('创建成功')
          history.push('/operation/couponManage')
        }
      } catch (error) {
        console.log(error)
      }
      setSpinning(false)
    }, step)
  }
  console.log('isZfbSingle', isZfbSingle)

  // 判断是否不能不填写电话号码
  const haveToSetPhone = () => {
    return notDisabled?.csmVal && !step2Data?.customerServiceMobile
  }

  // 提交编辑
  const submitEdit = () => {
    getBaseInfoData(async () => {
      if (haveToSetPhone()) return message.warning('请填写支付宝客服电话')
      setSpinning(true)
      try {
        const data = getParams({ isMappingExtCouponBol, isDraft: false })
        const {
          comment,
          instructions,
          availableBeginTime,
          availableEndTime,
          couponUseRule = {},
          isMappingExtCoupon,
          redirectPath
        } = data
        let { extCouponConfig = {} } = data
        const {
          brandLogo,
          voucherImage,
          voucherDetailImages,
          customerServiceMobile,
          miniAppPath
        } = extCouponConfig
        let couponAvailableTime

        if (!couponUseRule.couponAvailableTime?.isFixedTime) {
          couponAvailableTime = {
            availableDays: couponUseRule.couponAvailableTime.availableDays,
            daysAvailableAfterReceive:
              couponUseRule.couponAvailableTime.daysAvailableAfterReceive
          }
        } else {
          couponAvailableTime = {
            availableEndTime: couponUseRule.couponAvailableTime.availableEndTime
          }
        }

        if (isMappingExtCoupon) {
          extCouponConfig = {
            brandLogo,
            voucherImage,
            voucherDetailImages,
            customerServiceMobile,
            miniAppPath
          }
        }

        const params = {
          stockId: id,
          comment,
          instructions,
          availableBeginTime,
          availableEndTime,
          availableItems: couponUseRule?.availableItems,
          couponAvailableTime,
          extCouponConfig,
          redirectPath
        }

        const info = await editCoupon(params)
        if (info.success) {
          message.success('更新数据成功')
          history.push('/operation/couponManage')
        }
      } catch (error) {
        console.log(error)
      }
      setSpinning(false)
    }, step)
  }

  const goback = () => {
    history.push('/operation/couponManage')
  }

  return (
    <Panel title={id ? '编辑优惠券' : '新增优惠券'}>
      <Spin size="large" spinning={spinning}>
        <div className={Css['singleItemCouponPage']}>
          <BaseInfo
            isNowStep={step == 1}
            ref={baseInfoRefs}
            isWxSingle={isWxSingle}
            baseData={baseInfoData}
            notDisabled={notDisabled}
            onChange={setBaseInfoData}
            goUseRequired={goUseRequired}
            couponAvailableClientsLable={couponAvailableClientsLable}
          />
          {step == 2 && isZfbSingle && (
            <AlipayInfo
              ref={alipayInfoRefs}
              baseData={step2Data}
              notDisabled={notDisabled}
              miniAppData={miniAppData}
              onChange={setStep2Data}
            />
          )}
          {step == 2 && isWxSingle && (
            <WxInfo
              ref={wxInfoRefs}
              baseData={step2Data}
              baseInfoData={baseInfoData}
              notDisabled={notDisabled}
              miniAppData={miniAppData}
              onChange={setStep2Data}
            />
          )}
        </div>
        {/* 保存按钮 */}
        <div
          className={Css['config-foot']}
          style={{ left: collapsed ? 80 : 256 }}
        >
          <Space size={30}>
            {/* 下一步 */}
            {step === 1 && isNextStep && (
              <Button type="primary" onClick={() => goNextStep()}>
                下一步
              </Button>
            )}

            {/* 上一步 */}
            {step === 2 && (
              <Button type="primary" onClick={() => setStep(1)}>
                上一步
              </Button>
            )}

            {/* 保存 */}
            {(!isNextStep || step === 2) && !id && (
              <Button type="primary" onClick={() => submitData(true)}>
                保存
              </Button>
            )}

            {/* 立即发布 */}
            {((!isMappingExtCouponBol && step === 2) || !isNextStep) && !id && (
              <Button type="primary" onClick={() => submitData(false)}>
                立即发布
              </Button>
            )}

            {/* 编辑保存 */}
            {id && (
              <Button type="primary" onClick={() => submitEdit()}>
                编辑保存
              </Button>
            )}
          </Space>
        </div>
      </Spin>
      {/* 无可用渠道 */}
      <Modal
        title="提示"
        visible={tipsVisible}
        okText="知道了"
        onOk={() => goback()}
        onCancel={() => goback()}
      >
        <p>暂无可用渠道，无法创建优惠券</p>
      </Modal>
    </Panel>
  )
})
