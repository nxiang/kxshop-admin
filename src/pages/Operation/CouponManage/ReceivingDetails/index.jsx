import React, { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Descriptions,
  Select,
  DatePicker,
  Col,
  Row,
  Table,
  PageHeader
} from 'antd'
import { history } from '@umijs/max'
import Panel from '@/components/Panel'

// 引入接口
import { detail, couponUse, exportGetCoupon } from '@/services/coupon'
import { useLocation } from '@/utils/compatible'

const { Option } = Select
const { RangePicker } = DatePicker

// 优惠券状态
const couponStatusDic = [
  { value: null, label: '全部类型' },
  { value: '0', label: '未使用' },
  { value: '1', label: '锁定' },
  { value: '2', label: '已使用' },
  { value: '3', label: '已过期' }
]

// 表格列数据
const generateColumns = (couponInfo) => {
  // const { extCouponType } = couponInfo
  return [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 90
    },
    {
      title: '用户姓名',
      dataIndex: 'userName',
      key: 'userName',
      width: 120
    },
    {
      title: '手机号',
      dataIndex: 'userPhone',
      key: 'userPhone',
      width: 130
    },
    {
      title: '领取时间',
      dataIndex: 'gmtCreated',
      key: 'gmtCreated',
      width: 190
    },
    {
      title: '券ID',
      dataIndex: 'couponId',
      key: 'couponId',
      width: 200
    },
    {
      title: '三方券ID',
      dataIndex: 'extCouponId',
      key: 'extCouponId',
      width: 290
    },
    {
      title: '三方用户ID',
      width: 300,
      render: (row) => {
        const { alipayUid, wechatOpenId } = row
        const uid = alipayUid || wechatOpenId || ''
        return <div>{uid}</div>
      }
    },
    {
      title: '优惠券状态',
      dataIndex: 'state',
      key: 'state',
      width: 120,
      render: (record) => {
        return { 0: '未使用', 1: '锁定', 2: '已使用', 3: '已过期' }[record]
      }
    },
    {
      title: '领取渠道',
      dataIndex: 'receiveClientId',
      key: 'receiveClientId',
      width: 120,
      render: (record) => {
        return { 1: '支付宝', 2: '微信', 10: '管理后台' }[record]
      }
    },
    {
      title: '领取说明',
      dataIndex: 'receiveMode',
      key: 'receiveMode',
      width: 140
    },
    {
      title: '核销渠道',
      dataIndex: 'usedClientId',
      key: 'usedClientId',
      width: 120,
      render: (record) => {
        return { 1: '支付宝', 2: '微信', 10: '管理后台' }[record]
      }
    },
    {
      title: '使用时间',
      dataIndex: 'gmtModified',
      key: 'gmtModified',
      width: 200
    }
  ]
}

export default (props) => {
  // 表单
  const [form] = Form.useForm()
  // 优惠券Id
  const [couponId, setCouponId] = useState(null)
  // 优惠券信息
  const [couponInfo, setCouponInfo] = useState({
    stockId: '',
    couponName: '',
    extActivityId: '',
    extCouponType: ''
  })
  // 搜索参数
  const [searchData, setSearchData] = useState({})
  // 表格数据
  const [listData, setListdata] = useState({})

  // 初始化赋值
  useEffect(() => {
    if (history?.location?.query?.id) setCouponId(history.location.query.id)
  }, [])

  // 刷新列表副作用
  useEffect(() => {
    if (couponId) {
      if (!couponInfo.stockId) getCouponInfo()
      getCouponUse()
    }
  }, [couponId, searchData])

  // 获取优惠券详情
  const getCouponInfo = () => {
    detail({
      stockId: couponId
    }).then((res) => {
      if (res?.success && res?.data) {
        setCouponInfo(res.data)
      }
    })
  }

  // 获取领劵明细
  const getCouponUse = (page = 1) => {
    couponUse({
      ...searchData,
      pageNo: page,
      pageSize: 10,
      stockId: couponId
    }).then((res) => {
      if (res.success) {
        setListdata(res.data)
      }
    })
  }

  // 确认搜索
  const onFinish = (value) => {
    const data = {
      ...value,
      phoneOrId: value?.phoneOrId || null,
      receivedStartTime:
        value.couponGetTime && value.couponGetTime.length > 1
          ? value.couponGetTime[0].format('YYYY-MM-DD HH:mm:ss')
          : null,
      receivedEndTime:
        value.couponGetTime && value.couponGetTime.length > 1
          ? value.couponGetTime[1].format('YYYY-MM-DD HH:mm:ss')
          : null
    }
    setSearchData(data)
  }

  // 重置搜索
  const onReset = () => {
    form.resetFields()
    setSearchData({})
  }

  // 导出
  const exportFn = async () => {
    try {
      const data = await exportGetCoupon({
        ...searchData,
        pageNo: listData.current || 1,
        pageSize: 10,
        stockId: couponId
      })
      if (data.success) window.location.href = data.data
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Panel title="领券明细">
      <PageHeader style={{ background: '#fff' }}>
        <Row gutter={[24, 24]} align="middle">
          <Col flex="auto">
            <Descriptions
              bordered
              size="small"
              column={{
                xxl: 4,
                xl: 3,
                lg: 3,
                md: 3,
                sm: 2,
                xs: 1
              }}
            >
              <Descriptions.Item label="券名称">
                {couponInfo.couponName || '/'}
              </Descriptions.Item>
              <Descriptions.Item label="批次ID">
                {couponInfo.stockId || '/'}
              </Descriptions.Item>
              <Descriptions.Item label="三方活动ID">
                {couponInfo.extActivityId || '/'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col flex="100px">
            <Button onClick={() => history.push(`/operation/couponManage`)}>
              返回列表页
            </Button>
          </Col>
          <Col span={24}>
            {/* 领取明细筛选 */}
            <Form
              layout="inline"
              initialValues={{ state: null }}
              form={form}
              onFinish={(newVal) => onFinish(newVal)}
            >
              <Form.Item label="手机/券ID：" name="phoneOrId">
                <Input placeholder="手机/券ID" />
              </Form.Item>
              <Form.Item label="券状态：" name="state">
                <Select style={{ width: 130 }} placeholder="券状态" allowClear>
                  {couponStatusDic.map((item, index) => (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="领券时间：" name="couponGetTime">
                <RangePicker showTime />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  查询
                </Button>
              </Form.Item>
              <Form.Item>
                <Button onClick={onReset}>重置</Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={24}>
            {/* 导出 */}
            <Button type="primary" onClick={() => exportFn()}>
              导出
            </Button>
          </Col>
          <Col span={24}>
            {/* 表格 */}
            <Table
              dataSource={listData.rows}
              columns={generateColumns(couponInfo)}
              scroll={{ y: 400, x: 1000 }}
              pagination={{
                current: listData.current,
                pageSize: 10,
                total: listData.total,
                showTotal: (total) => `共 ${total} 条数据`,
                showSizeChanger: false,
                onChange: (page) => getCouponUse(page)
              }}
            />
          </Col>
        </Row>
      </PageHeader>
    </Panel>
  )
}
