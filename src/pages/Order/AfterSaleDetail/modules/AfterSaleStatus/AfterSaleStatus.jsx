import React, { useState, useMemo, useRef, useEffect, Fragment } from 'react'
import {
  Button,
  Modal,
  Input,
  message,
  Image,
  Select,
  Space,
  Form,
  Row,
  Col,
  Popover
} from 'antd'
import {
  BellOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined
} from '@ant-design/icons'
import Css from './AfterSaleStatus.module.scss'
import {
  refundStateTypeStatus,
  refundTypeStatus,
  orderStatus
} from '@/utils/baseData'
import { useReactive } from 'ahooks'

import {
  refundAgree,
  refundReject,
  confirmReceipt,
  rejectReceipt,
  refundShipSave,
  refundQuery
} from '@/services/afterSale'
import { getShopAddressSelectDataApi } from '@/services/shop'
import { shipList } from '@/services/ship'
import { centBecomeDollar } from '@/utils/tools'

const { TextArea } = Input
const { Option } = Select

const itemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 }
}

export default function AfterSaleStatus(props) {
  const { data, refresh, logisticsQuery = () => {} } = props
  const [status, setStatus] = useState({})
  const [show, setShow] = useState(false)
  const [btndisabled, setbtndisabled] = useState(false)
  const [modalContent, setModalContent] = useState({})
  const [isAgree, setAgree] = useState(1) // 1.同意弹窗；2.拒绝弹窗；3.确认收货弹窗;4.拒绝收货弹窗
  const [msg, setMsg] = useState('') // 同意拒绝的原因
  const [shopAddress, setShopAddress] = useState(null)
  const [shopAddressSelData, setShopAddressSelData] = useState([])
  const [chooseLoading, setChooseLoading] = useState(false)
  const [refundType, setRefundType] = useState('')
  // 代填写物流相关参数
  const substituteLogistics = useReactive({
    visible: false,
    companyList: []
  })
  // 退款明细相关参数
  const refundDetails = useReactive({
    visible: false,
    loading: false,
    info: {
      refundAmount: null,
      refundDetailItemList: [
        {
          amount: null,
          fundChannel: ''
        }
      ],
      refundStatus: '',
      sendBackFee: null,
      totalAmount: null
    }
  })

  function showFn(type) {
    // setMsg('')
    if (typeof type != 'object') {
      setAgree(type)
    }
    setShow(!show)
  }

  const RefundDetailsBtn = () =>
    useMemo(
      () => (
        <Popover
          visible={refundDetails.visible}
          open={refundDetails.visible}
          title={false}
          content={
            <Row style={{ width: 200 }}>
              <Col span={24}>
                <Row justify="end">
                  <CloseOutlined
                    onClick={() => {
                      refundDetails.visible = false
                    }}
                  />
                </Row>
              </Col>
              <Col span={24}>退款状态：已完成</Col>
              <Col span={24}>
                应退金额：
                {centBecomeDollar(refundDetails.info?.refundAmount)}
              </Col>
              <Col span={24}>
                实退金额：
                {centBecomeDollar(refundDetails.info?.sendBackFee)}
              </Col>
              <Col span={24}>退款明细：</Col>
              {refundDetails.info?.refundDetailItemList?.length > 0 &&
                refundDetails.info.refundDetailItemList.map((item) => (
                  <Fragment>
                    <Col offset={4} span={12}>
                      <Row justify="end">{item.fundChannel}：</Row>
                    </Col>
                    <Col span={8}>{centBecomeDollar(item?.amount)}</Col>
                  </Fragment>
                ))}
            </Row>
          }
        >
          <Button
            loading={refundDetails.loading}
            type="primary"
            onClick={() => getRefundDetail()}
          >
            查询退款明细
          </Button>
        </Popover>
      ),
      [refundDetails.loading, refundDetails.visible]
    )

  useEffect(() => {
    const newStatus = {}
    // 售后类型（1：退款，2：退货）
    if (data.refundType === 1) {
      newStatus.bell = (
        <div>
          <p className={Css.bellMsg}>
            ·如对售后申请有疑问，请及时与买家沟通协调
          </p>
          <p className={Css.bellMsg}>·同意后，金额将会返还用户支付账户</p>
        </div>
      )
      switch (data.status) {
        case 1:
          newStatus.name = '待审核'
          newStatus.msg = '收到买家售后申请，请尽快处理'
          newStatus.btn = (
            <div>
              <Button type="primary" onClick={showFn.bind(this, 1)}>
                同意
              </Button>
              <Button
                style={{ marginLeft: '8px' }}
                onClick={showFn.bind(this, 2)}
              >
                拒绝
              </Button>
            </div>
          )
          break
        case 2:
          newStatus.name = '待审核'
          newStatus.msg = '收到买家售后申请，请尽快处理'
          newStatus.btn = (
            <div>
              <Button type="primary" onClick={showFn.bind(this, 1)}>
                同意
              </Button>
              <Button
                style={{ marginLeft: '8px' }}
                onClick={showFn.bind(this, 2)}
              >
                拒绝
              </Button>
            </div>
          )
          break
        case 3:
          newStatus.name = '售后成功'
          newStatus.msg = '款项将再稍后退还至用户支付账户内'
          newStatus.btn = <RefundDetailsBtn />
          break
        case 4:
          newStatus.name = '售后关闭'
          newStatus.msg =
            '拒绝后，买家仍有机会再次提交售后申请，请及时关注退单信息'
          break
        case 5:
          newStatus.name = '等待卖家确认'
          break
        case 6:
          newStatus.name = '已取消'
          break
        default:
      }
    } else if (data.refundType === 2) {
      newStatus.bell = (
        <div>
          <p className={Css.bellMsg}>
            ·如对售后申请有疑问，请及时与买家沟通协调
          </p>
          <p className={Css.bellMsg}>
            ·点击确认收货按钮后，金额将会返还用户支付账户
          </p>
          <p className={Css.bellMsg}>·请对用户退还的商品进行二次确认</p>
        </div>
      )
      switch (data.status) {
        case 1:
          newStatus.name = '待审核'
          newStatus.msg = '收到买家售后申请，请尽快处理'
          newStatus.btn = (
            <div>
              <Button type="primary" onClick={showFn.bind(this, 1)}>
                同意
              </Button>
              <Button
                style={{ marginLeft: '8px' }}
                onClick={showFn.bind(this, 2)}
              >
                拒绝
              </Button>
            </div>
          )
          break
        case 2:
          newStatus.name = '等待买家寄回商品'
          newStatus.msg = '等待买家把商品退回，请稍后再来查看退单信息'
          newStatus.btn = (
            <Button
              type="primary"
              onClick={() => {
                if (substituteLogistics.companyList.length == 0)
                  getCompanyList()
                substituteLogistics.visible = true
              }}
            >
              代填写物流单号
            </Button>
          )
          break
        case 3:
          newStatus.name = '售后成功'
          newStatus.msg = '款项将再稍后退还至用户支付账户内'
          newStatus.btn = <RefundDetailsBtn />
          break
        case 4:
          newStatus.name = '售后关闭'
          newStatus.msg =
            '拒绝后，买家仍有机会再次提交售后申请，请及时关注退单信息'
          break
        case 5:
          newStatus.name = '等待买家寄回商品'
          newStatus.msg =
            '买家已退回商品，请收到买家退回的商品后，再点击【确认收货】按钮，完成本次售后'
          newStatus.btn = (
            <div>
              <Button type="primary" onClick={showFn.bind(this, 3)}>
                确认收货
              </Button>
              <Button
                style={{ marginLeft: '8px' }}
                onClick={showFn.bind(this, 4)}
              >
                拒绝
              </Button>
            </div>
          )
          break
        case 6:
          newStatus.name = '已取消'
          // newStatus.msg = '已取消';
          break
        default:
      }
    }
    setRefundType(data.refundType)
    setStatus(newStatus)
  }, [data, show, refundDetails.loading, refundDetails.visible])

  useEffect(() => {
    let con
    switch (isAgree) {
      case 1:
        con = (
          <div>
            <p className={Css.modalTitle}>
              <CheckCircleOutlined
                className={Css.modalIco}
                style={{ color: '#02C316' }}
              />
              确认同意该笔售后申请
            </p>
            <Space className={Css.width100} direction="vertical">
              {refundType == 2 && (
                <div className={Css.modalCon}>
                  <label className={Css.required}>退货地址:</label>
                  <Select
                    className={Css.width100}
                    value={shopAddress}
                    placeholder="请选择退货地址"
                    loading={chooseLoading}
                    onChange={(e) => setShopAddress(e)}
                    allowClear
                  >
                    {shopAddressSelData.map((item) => (
                      <Select.Option value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              )}
              <div className={Css.modalCon}>
                <label>备注:</label>
                <TextArea
                  rows={4}
                  maxLength={500}
                  placeholder="请输入备注内容"
                  onChange={(e) => {
                    setMsg(e.target.value)
                  }}
                />
              </div>
            </Space>
          </div>
        )
        break
      case 3:
        con = (
          <div>
            <p className={Css.modalTitle}>
              <InfoCircleOutlined
                className={Css.modalIco}
                style={{ color: '#02C316' }}
              />
              确认收货完成本次售后
            </p>
            <div className={Css.modalCon}>
              <label>备注:</label>
              <TextArea
                rows={4}
                maxLength={500}
                placeholder="请输入备注内容"
                onChange={(e) => {
                  setMsg(e.target.value)
                }}
              />
            </div>
          </div>
        )
        break
      default:
        con = (
          <div>
            <p className={Css.modalTitle}>
              <CloseCircleOutlined
                className={Css.modalIco}
                style={{ color: '#F72633' }}
              />
              拒绝后，买家仍有机会再次提交售后申请，请及时关注退单信息
            </p>
            <div className={Css.modalCon}>
              <label>拒绝原因:</label>
              <TextArea
                rows={4}
                maxLength={500}
                placeholder="请输入拒绝理由"
                onChange={(e) => {
                  setMsg(e.target.value)
                }}
              />
            </div>
          </div>
        )
        break
    }
    setModalContent(con)
  }, [isAgree, shopAddressSelData, shopAddress, chooseLoading, refundType])

  useEffect(() => {
    getSelectData()
  }, [])

  // 获取商家地址选择列表数据
  async function getSelectData() {
    setChooseLoading(true)
    try {
      let res = await getShopAddressSelectDataApi()
      if (res.success) {
        let tmp = res.data.map((item) => {
          const { address, addressId } = item
          item.label = address
          item.value = addressId
          return item
        })
        setShopAddressSelData(tmp)
      }
    } catch (error) {
      console.error(error)
    }
    setChooseLoading(false)
  }

  async function clickFn() {
    if (btndisabled) {
      return
    }
    let info
    if (msg.length > 500) {
      message.error('输入文字不能超过500字')
      return
    }
    if (refundType == 2 && !shopAddress && isAgree === 1)
      return message.warning('请选择退货地址')
    setbtndisabled(true)
    // if (data.refundType === 1) {
    // 退款
    const params = { refundSn: data.refundSn, sellerMessage: msg }
    if (isAgree === 1) {
      if (refundType == 2) params.storeAddressId = shopAddress
      info = await refundAgree(params)
    } else if (isAgree === 2) {
      info = await refundReject(params)
    } else if (isAgree === 3) {
      info = await confirmReceipt(params)
    } else if (isAgree === 4) {
      info = await rejectReceipt(params)
    }
    if (info?.success || info?.errorCode == 200041002) {
      // setMsg('')
      setShow(false)
      refresh()
    }
    setbtndisabled(false)
    // } else {
    // 退货
    // }
  }

  // 获取快递列表
  const getCompanyList = () => {
    shipList().then((res) => {
      if (res?.success) {
        const newData = res.data.list.map((item) => {
          return {
            value: item.shipId,
            label: item.shipName
          }
        })
        console.log(newData)
        substituteLogistics.companyList = newData
      }
    })
  }

  // 查询退款详情
  const getRefundDetail = () => {
    if (!data?.refundSn) return
    refundDetails.loading = true
    refundQuery({
      refundSn: data.refundSn
    })
      .then((res) => {
        if (res?.success) {
          refundDetails.visible = true
          refundDetails.info = res.data
        }
        refundDetails.loading = false
      })
      .catch(() => {
        refundDetails.loading = false
      })
  }

  // 提交代填写物流单号
  const companySubmit = (val) => {
    if (!data?.refundSn || !data?.buyerId) return
    const { shipId, shipSn } = val
    const submitData = {
      refundSn: data.refundSn,
      shipId: shipId,
      shipSn: shipSn,
      memberId: data.buyerId
    }
    refundShipSave(submitData).then((res) => {
      if (res?.success) {
        message.success('代填写物流单号成功')
        refresh()
        substituteLogistics.visible = false
      }
    })
  }

  return (
    <div className={Css.box}>
      <div className={Css.leftBox}>
        <div className={Css.title}>订单状态</div>
        <div className={Css.stateBox}>
          <div className={Css.state}>{status.name}</div>
          <div style={{ margin: '12px auto' }}>{status.msg}</div>
          {status.btn}
        </div>
        <div className={Css.bellBox}>
          <p className={Css.bellTitle}>
            <BellOutlined />
            特别提醒
          </p>
          {status.bell}
        </div>
      </div>
      <Modal
        title="售后处理"
        footer={null}
        visible={show}
        onCancel={showFn}
        width="740px"
      >
        {modalContent}
        <div className={Css['foot-box']}>
          <Button style={{ marginRight: 8 }} type="primary" onClick={clickFn}>
            确定
          </Button>
          <Button style={{ marginRight: 8 }} onClick={showFn}>
            取消
          </Button>
        </div>
      </Modal>
      <Modal
        title="请协助用户填写物流单号"
        footer={null}
        visible={substituteLogistics.visible}
        onCancel={() => (substituteLogistics.visible = false)}
        destroyOnClose
      >
        <Form preserve={false} onFinish={(val) => companySubmit(val)}>
          <Form.Item
            {...itemLayout}
            label="物流公司"
            name="shipId"
            rules={[
              {
                required: true,
                message: '请选择物流公司'
              }
            ]}
          >
            <Select placeholder="请选择物流公司">
              {substituteLogistics.companyList.map((item) => {
                return (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item
            {...itemLayout}
            label="物流单号"
            name="shipSn"
            rules={[
              {
                required: true,
                message: '请填写物流单号'
              }
            ]}
          >
            <Input placeholder="请填写物流单号" />
          </Form.Item>
          <Row justify="center">
            <Space span={24}>
              <Button onClick={() => (substituteLogistics.visible = false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
      <div className={Css.rightBox}>
        <div className={Css.title}>退单信息</div>
        {/* 是否整笔订单退款（1：是，0：否） */}
        {!data.isAll && data.refundItem ? (
          <div className={Css.picTxt}>
            <Image
              style={{ width: '45px', height: '45px' }}
              src={data.refundItem.itemImgSrc}
            />
            <div className={Css.picMsg}>
              <div style={{ fontWeight: 600 }}>{data.refundItem.itemName}</div>
              {data.refundItem.skuDesc && <div>{data.refundItem.skuDesc}</div>}
            </div>
          </div>
        ) : (
          <p>
            <span>订单商品全部退款</span>
          </p>
        )}
        <p>
          <span>售后类型：</span>
          {refundTypeStatus.find((item) => item.value == data.refundType)
            ?.label || '- -'}
        </p>
        <p>
          <span>退款方式：</span>
          {refundStateTypeStatus.find(
            (item) => item.value == data.refundStateType
          )?.label || '- -'}
        </p>
        <p>
          <span>申请退款金额：</span>
          <span style={{ color: '#F72633' }}>{data.refundAmount / 100}</span>
        </p>
        <p>
          <span>积分：</span>
          {data?.refundPoints}
        </p>
        {data.refundStateType != 1 && (
          <p>
            <span>退款原因：</span>
            {data.buyerMessage}
          </p>
        )}
        <p>
          <span>
            {{ 1: '退款说明：', 2: '退货说明：' }[data.refundType] ||
              '退款说明：'}
          </span>
          {data.buyerExplain || '- -'}
        </p>
        <p>
          <span>售后单号：</span>
          {data.refundSn}
        </p>
        <p>
          <span>申请售后时间：</span>
          {data.addTime}
        </p>
        {data.refundType == 2 && (data.status == 5 || data.status == 3) && (
          <p>
            <span>商品退回信息：</span>
            <Space>
              卖家已退回商品
              <a onClick={() => logisticsQuery('refund')}>查看物流信息</a>
            </Space>
          </p>
        )}
        <div className={Css.title}>订单信息</div>
        <p>
          <span>订单编号：</span>
          {data.bizOrderId}
        </p>
        <p>
          <span>订单状态：</span>
          {data?.bizOrderStatus &&
            orderStatus.find((item) => item.value == data.bizOrderStatus)
              ?.label}
        </p>
        <p>
          <span>付款时间：</span>
          {data.payTime}
        </p>
        <p>
          <span>付款人名称：</span>
          {data.buyerName}
        </p>
        <p>
          <span>用户ID：</span>
          {data.buyerId}
        </p>
        <p>
          <span>收货地址：</span>
          {data.receiveAddress}
        </p>
        <p>
          <span>收件人姓名：</span>
          {data.receiveName}
        </p>
        <p>
          <span>联系电话：</span>
          {data.receivePhone}
        </p>
        <p>
          <span>物流单号：</span>
          <Space>
            {data.orderLogistics?.shipName}
            {data.orderLogistics?.shipNo}
            {data.orderLogistics?.shipNo && (
              <a onClick={() => logisticsQuery('order')}>查看物流信息</a>
            )}
          </Space>
        </p>
      </div>
    </div>
  )
}
