import Panel from '@/components/Panel'
import { floatObj, showBut } from '@/utils/utils'
import { history } from '@umijs/max'
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Image,
  Modal,
  Row,
  Space,
  Spin,
  Statistic,
  message
} from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import Css from './CouponDetail.module.scss'
import CouponLink from './modules/CouponLink/CouponLink'
import CouponNumAdd from './modules/CouponNumAdd'
import CouponStatus from './modules/CouponStatus'
import GoodsTabledShow from './modules/GoodsTableShow'

import {
  continueC,
  detail,
  pause,
  publishCouponApi,
  qrCode,
  terminateCouponApi
} from '@/services/coupon'
import { useLocation } from '@/utils/compatible'
import { parseInterfacePrice } from '@/utils/tools'
import copy from 'copy-to-clipboard'

const defaultExtCouponType = {
  text: '',
  businessBelong: '所属商家',
  limitPhoneDesc: '手机号限制'
}

const extCouponTypeMap = {
  wechat: {
    text: '微信',
    businessBelong: '所属商家',
    limitPhoneDesc: '可疑账号拦截'
  },
  alipay: {
    text: '支付宝',
    businessBelong: '所属商家',
    limitPhoneDesc: '手机号限制'
  }
}
const getExtCouponTypeConfig = (type) => {
  return extCouponTypeMap[type] || defaultExtCouponType
}
export default (props) => {
  // const { collapsed } = props
  const location = useLocation()

  // 券批次ID
  const stockId = location.query?.id
  // laoding
  const [spinning, setSpinning] = useState(false)

  const [goodsTableOpen, setGoodsTableOpen] = useState(false)
  const [tyingGoodsTableOpen, setTyingGoodsTableOpen] = useState(false)
  const [addCouponOpen, setAddCouponOpen] = useState(false)
  const [couponInfo, setCouponInfo] = useState({})
  const [stockUrls, setStockUrls] = useState([])
  /** 搭售弹框的ref */
  const tyingRef = useRef()
  // 页面数据
  const {
    totalQuantity,
    stockQuantity,
    receivedQuantity,
    usedQuantity,
    usedRate,
    isMappingExtCoupon,
    scope,
    couponName,
    state,
    syncStatus,
    instructions,
    comment,
    gmtCreated,
    couponUseRule = {},
    couponSendRule = {},
    extActivityId,
    extCouponConfig = {},
    couponType,
    extCouponType,
    availableBeginTime,
    availableEndTime,
    redirectPath
  } = couponInfo

  const {
    couponAvailableClients = [],
    fixedNormalCoupon = {},
    discountCoupon = {},
    specialCoupon = {},
    availableItems = [],
    couponAvailableTime = {},
    couponBundleItem
  } = couponUseRule

  const { couponReceiveWay, maxCouponsPerUser, maxQuantity } = couponSendRule
  const {
    merchantId,
    brandName,
    brandLogo,
    voucherImage,
    voucherDetailImages = [],
    customerServiceMobile,
    naturalPersonLimit,
    phoneNumberLimit,
    miniAppId,
    miniAppPath,
    goodsName
  } = extCouponConfig

  // 字典
  const couponTypeDic = {
    SPECIAL: '特价券',
    NORMAL: '满减券',
    DISCOUNT: '折扣券'
  }
  const clientStr = couponAvailableClients
    .map((item) => ({ 1: '支付宝', 2: '微信' }[item]))
    .filter(Boolean)
    ?.join('、')

  const { confirm } = Modal

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    setSpinning(true)
    try {
      const info = await detail({ stockId })
      if (info.success) setCouponInfo(info.data)
    } catch (error) {
      console.error(error)
    }
    setSpinning(false)
  }

  // 前往修改
  const goEdit = () => {
    if (scope == 1) {
      history.push(
        `/operation/addCoupon/couponItemConfig?id=${stockId}&scope=1`
      )
    } else {
      history.push('/operation/addCoupon/editMallCoupon', { id: stockId })
      // history.push({
      //   pathname: '/operation/addCoupon/editMallCoupon',
      //   state: { id: stockId }
      // })
    }
  }

  // 领券链接
  const getLink = async () => {
    const info = await qrCode({ stockId })
    if (info.success) {
      if (info.data.length == 0) {
        info.data = [{}, {}]
      } else if (info.data.length == 1) {
        info.data.push({})
      }
      setStockUrls(info.data)
    }
    console.log('领券链接')
  }

  // 复制链接
  const copyLink = (e) => {
    if (copy(e)) {
      message.info('复制成功')
    } else {
      message.info('复制失败')
    }
  }

  // 暂停活动
  const pauseActivity = () => {
    confirm({
      title: '确认暂停？',
      content: '暂停后当前优惠券不会进行展示无法领取，已领取的券支持核销',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        loadingFn(async () => {
          const info = await pause({ stockId })
          if (info.success) {
            message.success('暂停成功')
            getData()
          }
        })
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  // 继续活动
  const reStartActivity = () => {
    confirm({
      title: '确认继续发放？',
      content: '继续后当前优惠券重新进行展示，可被领取使用',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        loadingFn(async () => {
          const info = await continueC({ stockId })
          if (info.success) {
            message.success('继续活动成功')
            getData()
          }
        })
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  // 终止活动
  const stopActivity = () => {
    confirm({
      title: '确认终止活动',
      content: '活动终止后不可继续，请确认是否终止',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        loadingFn(async () => {
          const info = await terminateCouponApi({ stockId })
          if (info.success) {
            message.success('终止活动成功')
            getData()
          }
        })
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  // 立即发布
  const publickNow = async () => {
    loadingFn(async () => {
      const info = await publishCouponApi({ stockId })
      if (info.success) {
        message.success('发布成功')
        getData()
      }
    })
    setSpinning(false)
  }

  const loadingFn = async (nextFn) => {
    console.log('loadingFn', nextFn)
    try {
      setSpinning(true)
      await nextFn?.()
    } catch (error) {
      console.error(error)
    }
    setSpinning(false)
  }

  const copyCouponToEdit = () => {
    localStorage.setItem('copyCoupon', JSON.stringify(couponInfo))
    history.push(`/operation/addCoupon/couponItemConfig?scope=1&isCopy=1`)
  }

  /** 搭售描述 */
  const tyingDesc = useMemo(() => {
    if (!couponBundleItem) return ''
    const { bundleValue = 0, type } = couponBundleItem
    if (type === 1) {
      /** 商品数量 */
      return `单笔订单搭售指定商品数量满${bundleValue}件可用`
    }
    if (type === 2) {
      /** 商品金额 */
      return `单笔订单搭售指定商品金额满${parseInterfacePrice(
        bundleValue
      )}元可用`
    }
  }, [couponBundleItem])

  return (
    <Panel>
      <Spin size="large" spinning={spinning}>
        <div direction="vertical" className={Css['couponDetailPage']}>
          {/* 顶部领取数据 */}
          <Row wrap={false}>
            <Col flex="120px">
              <div className={Css['couponCard']}>
                {isMappingExtCoupon && (
                  <div className={Css['couponCardTips']}>
                    <span>
                      {
                        getExtCouponTypeConfig(extCouponType)?.businessBelong
                          ?.text
                      }
                    </span>
                    <span>商家券</span>
                  </div>
                )}
                <div>{scope == 1 ? '单品' : '全场'}</div>
                <div>优惠券</div>
              </div>
            </Col>
            <Col flex="280px">
              <div className={Css['couponCardInfo']}>
                <h3>{couponName}</h3>
                <CouponStatus status={state} />
              </div>
            </Col>
            <Col flex="auto">
              <Card size="small">
                <Statistic title="发券总数" value={totalQuantity} />
              </Card>
            </Col>
            <Col flex="auto">
              <Card size="small">
                <Statistic title="剩余张数" value={stockQuantity} />
              </Card>
            </Col>
            <Col flex="auto">
              <Card size="small">
                <Statistic title="领取张数" value={receivedQuantity} />
              </Card>
            </Col>
            <Col flex="auto">
              <Card size="small">
                <Statistic title="核销张数" value={usedQuantity} />
              </Card>
            </Col>
            <Col flex="auto">
              <Card size="small">
                <Statistic
                  title="核销率"
                  value={floatObj.divide(usedRate, 100) || 0}
                  precision={2}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>

          <Divider />

          <Space className={Css['couponDetailContent']} direction="vertical">
            {/* 中部信息 */}
            <Descriptions>
              <Descriptions.Item label="批次ID">{stockId}</Descriptions.Item>
              <Descriptions.Item label="备注">
                {comment || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {gmtCreated}
              </Descriptions.Item>
              <Descriptions.Item label="可用渠道">
                {clientStr}
              </Descriptions.Item>
              <Descriptions.Item label="三方活动ID or 批次号">
                {extActivityId || '-'}
              </Descriptions.Item>
              <Descriptions.Item
                label={getExtCouponTypeConfig(extCouponType)?.businessBelong}
              >
                {merchantId || '-'}
              </Descriptions.Item>
            </Descriptions>

            {/* 操作栏  */}

            {/* 优惠券状态0 待发布 1 已发布 2 已暂停 3 已结束 4 未开始 5 进行中 */}
            <Space>
              {state === 0 && (
                <Button
                  type="primary"
                  disabled={[0, 1].includes(syncStatus)}
                  onClick={() => publickNow()}
                >
                  立即发布
                </Button>
              )}

              {/* 未开始、进行中、已暂停且直接领取支持领券链接 */}
              {[4, 5, 2].includes(state) && couponReceiveWay === 0 && (
                <CouponLink
                  context={this}
                  stockUrls={stockUrls}
                  getLink={() => getLink()}
                  copyLink={(e) => copyLink(e)}
                />
              )}

              {/* 未开始、进行中、已暂停支持追加券 */}
              {showBut('couponManage', 'coupon_manage_add') &&
                [4, 5, 2].includes(state) &&
                ![0, 1].includes(syncStatus) && (
                  <Button type="primary" onClick={() => setAddCouponOpen(true)}>
                    增加券数量
                  </Button>
                )}

              {/* 已结束不支持修改其余均支持 */}
              {showBut('couponManage', 'coupon_manage_edit') &&
                extCouponType !== 'wechat' &&
                ![3].includes(state) && (
                  <Button type="primary" onClick={() => goEdit()}>
                    修改
                  </Button>
                )}

              {/* 为单品券支持复制 */}
              {scope === 1 && (
                <Button type="primary" onClick={() => copyCouponToEdit()}>
                  复制
                </Button>
              )}

              {/* 暂停 */}
              {showBut('couponManage', 'couponManage_stop') &&
                [4, 5].includes(state) &&
                !isMappingExtCoupon && (
                  <Button type="primary" onClick={() => pauseActivity()}>
                    暂停
                  </Button>
                )}

              {[4, 5, 2].includes(state) && (
                <Button type="danger" onClick={() => stopActivity()}>
                  终止
                </Button>
              )}

              {showBut('couponManage', 'coupon_manage_continue') &&
                state === 2 && (
                  <Button type="primary" onClick={() => reStartActivity()}>
                    继续
                  </Button>
                )}
            </Space>

            {/* 内容 */}
            {/* 优惠设置 */}
            <Descriptions
              title="优惠设置"
              column={1}
              labelStyle={{ width: '180px' }}
            >
              <Descriptions.Item label="优惠类型">
                {couponTypeDic[couponType]}
              </Descriptions.Item>
              <Descriptions.Item label="优惠规则">
                {couponType === 'SPECIAL' &&
                  `
                  ${scope === 1 ? '指定商品消费，满' : '全场商品消费，满'}
                  ${floatObj.divide(specialCoupon.transactionMinimum, 100)}
                  享特价
                  ${floatObj.divide(specialCoupon.specialAmount, 100)}`}
                {couponType === 'NORMAL' &&
                  `
                  ${scope === 1 ? '指定商品消费，满' : '全场商品消费，满'}
                  ${floatObj.divide(fixedNormalCoupon.transactionMinimum, 100)}
                  减
                  ${floatObj.divide(fixedNormalCoupon.couponAmount, 100)}`}
                {couponType === 'DISCOUNT' &&
                  `
                  ${scope === 1 ? '指定商品消费，满' : '全场商品消费，满'}
                  ${floatObj.divide(discountCoupon.transactionMinimum, 100)}
                  享折扣
                  ${floatObj.divide(discountCoupon.discountPercent, 100)}折`}
              </Descriptions.Item>
              {couponType === 'SPECIAL' && (
                <Descriptions.Item label="最高商品单价">
                  ¥{' '}
                  {floatObj.divide(specialCoupon?.ceilingItemUnitPrice, 100) ||
                    ''}
                </Descriptions.Item>
              )}
              {couponType === 'SPECIAL' && (
                <Descriptions.Item label="最多优惠商品件数">
                  {specialCoupon?.ceilingItemQuantity} 件
                </Descriptions.Item>
              )}
              <Descriptions.Item label="最高优惠金额">
                ¥{' '}
                {floatObj.divide(
                  fixedNormalCoupon.couponAmount ||
                    specialCoupon?.ceilingAmount ||
                    discountCoupon?.maxDiscountAmount,
                  100
                ) || ''}
              </Descriptions.Item>
              {couponBundleItem && (
                <Descriptions.Item label="其它规则">
                  <span className="mr-4">{tyingDesc}</span>
                  <span
                    className="text-blue-400 cursor-pointer"
                    onClick={() => {
                      setTyingGoodsTableOpen(true)
                    }}
                  >
                    查看搭售商品
                  </span>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* 营销预算 */}
            <Descriptions
              title="营销预算"
              column={1}
              labelStyle={{ width: '180px' }}
            >
              <Descriptions.Item label="总发券张数">
                <div>
                  {totalQuantity}张
                  {/* <br />
                  <span className={Css['descriptionsTtemTips']}>总预算=¥500.00元</span> */}
                </div>
              </Descriptions.Item>
            </Descriptions>

            {/* 使用限制与说明 */}
            <Descriptions
              title="使用限制与说明"
              column={1}
              labelStyle={{ width: '180px' }}
            >
              {scope == 1 && (
                <Descriptions.Item label="参与优惠商品">
                  <Space>
                    已添加{availableItems.length}个商品
                    <a onClick={() => setGoodsTableOpen(true)}>查看</a>
                  </Space>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="派券方式">
                {couponReceiveWay === 0 ? '直接领取' : '活动领取'}
              </Descriptions.Item>
              <Descriptions.Item label="每人领取张数限制">
                {maxCouponsPerUser === maxQuantity
                  ? '不限制'
                  : `限领${maxCouponsPerUser}张`}
              </Descriptions.Item>
              <Descriptions.Item label="每人核销张数限制">
                不限制
              </Descriptions.Item>
              <Descriptions.Item label="券使用说明">
                {instructions}
              </Descriptions.Item>
              {redirectPath && (
                <Descriptions.Item label="点击“去使用”跳转">
                  {redirectPath}
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* 时间设置 */}
            <Descriptions
              title="时间设置"
              column={1}
              labelStyle={{ width: '180px' }}
            >
              <Descriptions.Item label="券领取时间">
                {availableBeginTime} 至 {availableEndTime}
              </Descriptions.Item>
              <Descriptions.Item label="券可用时间">
                {/* 固定时间 */}
                {couponAvailableTime?.isFixedTime &&
                  `固定时间段生效 
                  ${couponAvailableTime?.availableBeginTime} 
                  至
                  ${couponAvailableTime?.availableEndTime}`}
                {/* 非固定立即生效 */}
                {!couponAvailableTime?.isFixedTime &&
                  couponAvailableTime?.daysAvailableAfterReceive === 0 &&
                  `领取后立即生效，有效期
                  ${couponAvailableTime?.availableDays}
                  天`}
                {/* 非固定非立即生效 */}
                {!couponAvailableTime?.isFixedTime &&
                  couponAvailableTime?.daysAvailableAfterReceive !== 0 &&
                  `领取后
                  ${couponAvailableTime?.daysAvailableAfterReceive}
                  天生效，有效期
                  ${couponAvailableTime?.availableDays}
                  天`}
              </Descriptions.Item>
              <Descriptions.Item label="时间段限制">
                券可用时间内，任意时段可用
              </Descriptions.Item>
            </Descriptions>

            {isMappingExtCoupon && (
              <>
                {/* 商家信息 */}
                <Descriptions
                  title="商家信息"
                  column={1}
                  labelStyle={{ width: '180px' }}
                >
                  <Descriptions.Item label="商家PID">
                    {merchantId}
                  </Descriptions.Item>
                  {extCouponType !== 'wechat' && (
                    <>
                      <Descriptions.Item label="商家名称">
                        {brandName}
                      </Descriptions.Item>
                      <Descriptions.Item label="商家logo">
                        {brandLogo ? (
                          <Image
                            className={Css['descriptionsItemImg']}
                            height={60}
                            src={brandLogo}
                            preview
                          />
                        ) : (
                          '暂无'
                        )}
                      </Descriptions.Item>
                    </>
                  )}
                  {extCouponType !== 'wechat' && (
                    <Descriptions.Item label="客服电话">
                      {customerServiceMobile}
                    </Descriptions.Item>
                  )}
                </Descriptions>

                {/* 券详情页 */}
                {extCouponType !== 'wechat' && (
                  <Descriptions
                    title="券详情页"
                    column={1}
                    labelStyle={{ width: '180px' }}
                  >
                    <Descriptions.Item label="券详情封面图">
                      <Image height={60} src={voucherImage} preview />
                    </Descriptions.Item>
                    <Descriptions.Item label="券详细图列表">
                      {voucherDetailImages.map((item, index) => (
                        <Image
                          className={Css['descriptionsItemImg']}
                          key={index}
                          height={60}
                          src={item}
                          preview
                        />
                      ))}
                    </Descriptions.Item>
                  </Descriptions>
                )}

                {/* 指定小程序 */}
                <Descriptions
                  title="指定小程序"
                  column={1}
                  labelStyle={{ width: '180px' }}
                >
                  <Descriptions.Item label="小程序APPID">
                    {miniAppId || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="跳转路径">
                    {miniAppPath || '-'}
                  </Descriptions.Item>
                </Descriptions>

                {/* 领券安全防刷 */}
                <Descriptions
                  title="领券安全防刷"
                  column={1}
                  labelStyle={{ width: '180px' }}
                >
                  <Descriptions.Item label="自然人限制">
                    {naturalPersonLimit ? '是' : '否'}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      getExtCouponTypeConfig(extCouponType)?.limitPhoneDesc
                    }
                  >
                    {/* 可疑账号拦截 */}
                    {phoneNumberLimit ? '是' : '否'}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}
          </Space>
        </div>

        {/* 参与优惠商品表格弹窗 */}
        <GoodsTabledShow
          title="参与优惠商品"
          show={goodsTableOpen}
          itemIds={availableItems || []}
          setShow={setGoodsTableOpen}
        />

        {/* 搭售商品表格弹窗 */}
        <GoodsTabledShow
          title="搭售商品"
          show={tyingGoodsTableOpen}
          itemIds={couponBundleItem?.itemIds || []}
          setShow={setTyingGoodsTableOpen}
        />

        {/* 追加券数量 */}
        <CouponNumAdd
          show={addCouponOpen}
          setShow={setAddCouponOpen}
          value={{ totalNum: totalQuantity, stockId }}
          getData={() => getData()}
        />
      </Spin>
    </Panel>
  )
}
