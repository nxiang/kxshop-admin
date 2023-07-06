import React, { useState, useEffect } from 'react'
import Css from './CouponManage.module.scss'
import Panel from '@/components/Panel'
import {
  Button,
  Form,
  Input,
  Radio,
  Select,
  DatePicker,
  Col,
  Row,
  Space,
  Table,
  Modal,
  Spin,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { history } from '@umijs/max'
import { deleteCoupon, getCouponListApi, exportCoupon } from '@/services/coupon'
import { groupBy } from 'lodash-es'
import { floatObj } from '@/utils/utils'
import { showBut } from '@/utils/utils'
import CouponStatus from '../CouponDetail/modules/CouponStatus'

export default (props) => {
  const { confirm } = Modal
  const [form] = Form.useForm()
  // laoding
  const [spinning, setSpinning] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tableData, setTableData] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    rows: []
  })
  // 优惠券类型
  const couponTypeDic = [
    { value: null, label: '全部类型' },
    { value: 'SPECIAL', label: '特价券' },
    { value: 'NORMAL', label: '满减券' },
    { value: 'DISCOUNT', label: '折扣券' }
  ]
  const couponTypeDicObj = groupBy(couponTypeDic, 'value')
  console.log('couponTypeDicObj', couponTypeDicObj)
  // 优惠券状态0 待发布 1 已发布 2 已暂停 3 已结束 4 未开始 5 进行中
  const couponStatusDic = [
    { value: null, label: '全部状态' },
    { value: 0, label: '待发布' },
    { value: 4, label: '未开始' },
    { value: 5, label: '进行中' },
    { value: 2, label: '已暂停' },
    { value: 3, label: '已结束' }
  ]
  const couponStatusDicObj = groupBy(couponStatusDic, 'value')
  // 领券方式
  const couponWaysDic = [
    { value: null, label: '全部方式' },
    { value: '0', label: '直接领取' },
    { value: '1', label: '活动领取' }
  ]

  // 表格列数据
  const columns = [
    {
      title: '券名称',
      dataIndex: 'stockName',
      key: 'stockName',
      width: 200
    },
    {
      title: '券备注',
      dataIndex: 'comment',
      key: 'comment',
      width: 200
    },
    {
      title: '批次ID',
      dataIndex: 'stockId',
      key: 'stockId',
      width: 200
    },
    {
      title: '同步到第三方平台',
      dataIndex: 'extCouponType',
      key: 'extCouponType',
      width: 150,
      render: (text, { syncStatus }) => (
        <div>{`
        ${{ alipay: '支付宝', wechat: '微信' }[text] || '无'} 
        ${
          { 0: '（待同步）', 1: '（同步中）', 2: '（已完成）' }?.[syncStatus] ||
          ''
        }
        `}</div>
      )
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: 100,
      render: (text) => <CouponStatus isList={true} status={text} />
    },
    {
      title: '券类型',
      dataIndex: 'couponType',
      key: 'couponType',
      width: 80,
      render: (text) => <div>{couponTypeDicObj?.[text]?.[0].label || '-'}</div>
    },
    {
      title: '发券总数',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
      width: 120
    },
    {
      title: '已领张数',
      dataIndex: 'receivedQuantity',
      key: 'receivedQuantity',
      width: 120
    },
    {
      title: '核销张数',
      dataIndex: 'usedQuantity',
      key: 'usedQuantity',
      width: 120
    },
    {
      title: '核销率',
      dataIndex: 'usedPercent',
      key: 'usedPercent',
      width: 100,
      render: (text) => <div>{text ? `${text}%` : '0.00%'}</div>
    },
    {
      title: '领劵时间',
      dataIndex: 'getCouponTime',
      key: 'getCouponTime',
      width: 240,
      render: (_, { availableBeginTime, availableEndTime }) => (
        <Space direction="vertical" size={2}>
          <span>起：{availableBeginTime}</span>
          <span>止：{availableEndTime}</span>
        </Space>
      )
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 180,
      render: (_, { stockId, state }) => (
        <Space>
          {showBut('couponManage', 'coupon_manage_detail') && (
            <a
              onClick={() =>
                history.push(`/operation/couponDetail?id=${stockId || 1}`)
              }
            >
              详情
            </a>
          )}
          <a
            onClick={() =>
              history.push(
                `/operation/couponManage/receivingDegail?id=${stockId || 1}`
              )
            }
          >
            领券明细
          </a>
          {showBut('couponManage', 'coupon_manage_del') && state === 0 && (
            <a className={Css['red']} onClick={() => delCouponFn(stockId)}>
              删除
            </a>
          )}
        </Space>
      )
    }
  ]

  useEffect(() => {
    getListData()
  }, [])

  // 新增全场券
  const goAddMallCoupon = () => {
    history.push('/operation/addCoupon/addMallCoupon')
  }

  // 新增单品券
  const goSingleItemCoupon = (id) => {
    let url = `/operation/addCoupon/couponItemConfig?scope=1`
    if (id) url = `/operation/addCoupon/couponItemConfig?id=${id}&scope=1`
    history.push(url)
  }

  // 获取优惠券数据
  const getListData = async (page, pageSize) => {
    let allValue = form.getFieldsValue(true)
    const { couponName, couponType, state, availableTime, couponReceiveWay } =
      allValue
    if (pageSize != tableData.pageSize && pageSize) {
      page = 1
      setTableData({
        ...tableData,
        pageSize
      })
    }
    let params = {
      pageNo: page || 1,
      pageSize: pageSize || tableData?.pageSize || 10,
      couponName: couponName || null,
      couponType: couponType || null,
      state: state || (state === 0 ? 0 : null),
      availableTime: availableTime?.format('YYYY-MM-DD HH:mm:ss') || null,
      couponReceiveWay: couponReceiveWay || null
    }
    setSpinning(true)
    try {
      const info = await getCouponListApi(params)
      if (info.success) setTableData(info.data)
    } catch (error) {
      console.error(error)
    }
    setSpinning(false)
  }

  // 页面size变化
  const changePageSize = async (pageSize) => {
    setTableData({
      ...tableData,
      pageSize
    })
    getListData()
  }

  // 重置搜索
  const resetAndGet = () => {
    form.resetFields()
    getListData()
  }

  const delCouponFn = (stockId) => {
    confirm({
      title: '确认删除？',
      content: '删除后优惠券信息不可恢复，是否确认删除',
      onOk: async () => {
        setSpinning(true)
        try {
          const info = await deleteCoupon({ stockId })
          if (info.success) {
            message.success('删除成功')
            getListData()
          }
        } catch (error) {
          console.log(error)
        }
        setSpinning(false)
      },
      onCancel() {}
    })
  }

  // 导出
  const exportFn = async () => {
    setSpinning(true)
    try {
      let allValue = form.getFieldsValue(true)
      const { couponName, couponType, state, availableTime, couponReceiveWay } =
        allValue

      let params = {
        pageNo: tableData.current,
        pageSize: tableData.pageSize,
        couponName: couponName || null,
        couponType: couponType || null,
        state: state || (state === 0 ? 0 : null),
        availableTime: availableTime?.format('YYYY-MM-DD HH:mm:ss') || null,
        couponReceiveWay: couponReceiveWay || null
      }
      const data = await exportCoupon(params)
      if (data.success) window.location.href = data.data
    } catch (error) {
      console.log(error)
    }
    setSpinning(false)
  }

  return (
    <Panel title="优惠券管理" content="管理店铺的优惠券">
      <Spin size="large" spinning={spinning}>
        <div className={Css['CouponPage']}>
          {/* 筛选条件 */}
          <div className="CouponPageFilterBox">
            <Form
              layout="inline"
              form={form}
              initialValues={{
                couponType: null,
                state: null,
                couponReceiveWay: null
              }}
            >
              <Form.Item label="券名称：" name="couponName">
                <Input placeholder="请输入券名称" />
              </Form.Item>
              <Form.Item label="券类型：" name="couponType">
                <Select
                  className={Css['selectW']}
                  placeholder="请选择券类型"
                  allowClear
                >
                  {couponTypeDic.map((item, index) => (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="状态：" name="state">
                <Select
                  className={Css['selectW']}
                  placeholder="请选择状态"
                  allowClear
                >
                  {couponStatusDic.map((item, index) => (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="券可领时间：" name="availableTime">
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>
              <Form.Item label="派券方式：" name="couponReceiveWay">
                <Select
                  className={Css['selectW']}
                  placeholder="请选择派券方式"
                  allowClear
                >
                  {couponWaysDic.map((item, index) => (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={() => getListData()}>
                  查询
                </Button>
              </Form.Item>
              <Form.Item>
                <Button onClick={() => resetAndGet()}>重置</Button>
              </Form.Item>
            </Form>
          </div>

          {/* 操作栏 */}
          <div className={Css['CouponOpr']}>
            <Space size={16}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)}
              >
                新建
              </Button>
              <Button onClick={() => exportFn()}>导出</Button>
            </Space>
          </div>

          {/* 表格 */}
          <Table
            dataSource={tableData.rows}
            columns={columns}
            scroll={{ y: 400, x: 1000 }}
            rowKey={(record) => record.stockId}
            pagination={{
              current: tableData.current,
              pageSize: tableData.pageSize,
              total: tableData.total,
              showSizeChanger: true,
              onChange: (page, pageSize) => getListData(page, pageSize)
            }}
          />

          {/* 新增弹窗 */}
          <Modal
            width="600px"
            title="创建优惠券"
            visible={isModalOpen}
            footer={null}
            onCancel={() => setIsModalOpen(false)}
          >
            <Row>
              <Col span={12}>
                <div className={Css['addCouponItem']}>
                  <Space direction="vertical">
                    <h3>全场优惠券</h3>
                    <p>全场可用</p>
                    <Button type="primary" onClick={() => goAddMallCoupon()}>
                      立即创建
                    </Button>
                    <div className={Css['addCouponItemTips']}>
                      注：暂不支持打通支付宝商家券
                    </div>
                  </Space>
                </div>
              </Col>
              <Col span={12}>
                <div className={Css['addCouponItem']}>
                  <Space direction="vertical">
                    <h3>单品优惠券</h3>
                    <p>指定商品可用</p>
                    <Button type="primary" onClick={() => goSingleItemCoupon()}>
                      立即创建
                    </Button>
                  </Space>
                </div>
              </Col>
            </Row>
          </Modal>
        </div>
      </Spin>
    </Panel>
  )
}
