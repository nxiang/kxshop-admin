import React, { useState, useEffect } from 'react'
import { history } from '@umijs/max'
import {
  Form,
  Radio,
  Table,
  message,
  Button,
  Row,
  Col,
  Divider,
  Space
} from 'antd'
import moment from 'moment'
import Css from './AfterSaleList.module.scss'
import Panel from '@/components/Panel'
import ExportPop from './modules/ExportPop/ExportPop'
import AdvanceSearch from './AdvanceSearch'
import { removeEmptyField, showBut } from '@/utils/utils'
import { refundTypeRenderStatus } from '@/utils/baseData'
import { refundListColumn } from './columns'
import { useAntdTable } from 'ahooks'
// 引入接口
import { refundList } from '@/services/refund'
import useUrlState from '@ahooksjs/use-url-state'

const AfterSaleList = (props) => {
  const [form] = Form.useForm()
  // 导出面板相关
  const [exportShow, setExportShow] = useState(false)
  const [exportParams, setExportParams] = useState({})
  const [status, setStatus] = useState(1)
  const [urlState, setUrlState] = useUrlState(
    {
      status: undefined
    },
    {
      navigateMode: 'replace'
    }
  )

  // url转form搜索参数
  const UrlConverForm = (data) => {
    const newData = {
      ...data
    }
    newData.status = data?.status ? Number(data.status) : 1
    newData.orderStatus = data?.orderStatus
      ? Number(data.orderStatus)
      : undefined
    newData.refundType = data?.refundType ? Number(data.refundType) : undefined
    newData.refundStateType = data?.refundStateType
      ? Number(data.refundStateType)
      : undefined
    if (data?.createStartTime && data?.createEndTime) {
      newData.createTime = [
        moment(data.createStartTime),
        moment(data.createEndTime)
      ]
    }
    if (data?.createOrderStartTime && data?.createOrderEndTime) {
      newData.createOrderTime = [
        moment(data.createOrderStartTime),
        moment(data.createOrderEndTime)
      ]
    }
    return newData
  }

  // 请求列表参数
  const refundListData = ({ current, pageSize }, formData) => {
    console.log(formData)
    const data = {
      page: current || 1,
      pageSize,
      createOrderStartTime: undefined,
      createOrderEndTime: undefined,
      createOrderStartTime: undefined,
      createOrderEndTime: undefined,
      ...formData,
    }
    if (formData.status > -1) {
      setStatus(formData.status)
    }
    if (formData?.createTime) {
      data.createTime = undefined
      data.createStartTime = formData.createTime[0].format(
        'YYYY-MM-DD HH:mm:ss'
      )
      data.createEndTime = formData.createTime[1].format('YYYY-MM-DD HH:mm:ss')
    }
    if (formData?.createOrderTime) {
      data.createOrderTime = undefined
      data.createOrderStartTime = formData.createOrderTime[0].format(
        'YYYY-MM-DD HH:mm:ss'
      )
      data.createOrderEndTime = formData.createOrderTime[1].format(
        'YYYY-MM-DD HH:mm:ss'
      )
    }
    setUrlState(data)
    return refundList(data).then((res) => {
      if (res?.success) {
        return {
          total: res.data.total,
          list: res.data.rows
        }
      }
    })
  }

  const { tableProps: refundTableProps, search: refundSearch } = useAntdTable(
    refundListData,
    {
      defaultCurrent: 1,
      defaultPageSize: 10,
      form,
      defaultParams: [
        {
          current: urlState?.page ? Number(urlState?.page) : 1,
          pageSize: urlState?.pageSize ? Number(urlState?.pageSize) : 10
        },
        {
          ...UrlConverForm(urlState)
        }
      ],
      defaultType: 'advance'
    }
  )

  const { submit: refundSubmit, reset: refundReset } = refundSearch

  const onChange = (e) => {
    form.setFieldsValue({
      status: e.target.value
    })
    refundSubmit()
  }

  const openExport = () => {
    const data = form.getFieldsValue()
    // 过滤空值
    const newValue = removeEmptyField(data)
    // 判断是否选中值
    if (Object.getOwnPropertyNames(newValue).length < 1)
      return message.warning('请选择至少一个筛选项')
    // 设置值
    const dataList = {
      ...data
    }
    // 设置申请售后时间
    if (data?.createTime) {
      dataList.createTime = undefined
      dataList.createStartTime = data.createTime[0].format(
        'YYYY-MM-DD HH:mm:ss'
      )
      dataList.createEndTime = data.createTime[1].format('YYYY-MM-DD HH:mm:ss')
    }
    if (data?.createOrderTime) {
      dataList.createOrderTime = undefined
      dataList.createOrderStartTime = data.createOrderTime[0].format(
        'YYYY-MM-DD HH:mm:ss'
      )
      dataList.createOrderEndTime = data.createOrderTime[1].format(
        'YYYY-MM-DD HH:mm:ss'
      )
    }
    setExportParams(dataList)
    setExportShow(true)
  }

  const goExportList = () => {
    history.push('/order/afterSaleList/exportRecord')
  }

  return (
    <Panel title="售后列表" content="售后信息管理">
      <div className={`${Css['order-list-box']} order-after-sale-list`}>
        <div className={Css['list-header-box']}>
          <AdvanceSearch
            form={form}
            initialValues={{
              status: 1
            }}
            refundSubmit={refundSubmit}
            refundReset={() => refundReset()}
          />
        </div>
        <Divider style={{ marginTop: 0 }} />
        <Row gutter={[18, 18]}>
          <Col span={24}>
            <Radio.Group
              value={status}
              name="status"
              onChange={(e) => onChange(e)}
            >
              <Radio.Button value={0}>全部售后订单</Radio.Button>
              {refundTypeRenderStatus.map((item) => (
                <Radio.Button value={item.value}>{item.label}</Radio.Button>
              ))}
            </Radio.Group>
          </Col>
          <Col span={24}>
            <Space size={16}>
              {/* <Button type="primary">批量审批</Button>
              <Button>批量操作记录</Button> */}
              {showBut('afterSaleList', 'exportLaunch') && (
                <Button onClick={() => openExport()}>导出</Button>
              )}
              {showBut('afterSaleList', 'exportRecord') && (
                <Button onClick={() => goExportList()}>导出记录</Button>
              )}
            </Space>
          </Col>
          <Col span={24}>
            <Table
              rowKey={(record) => record.refundSn}
              columns={refundListColumn()}
              scroll={{ y: 400, x: 1400 }}
              {...refundTableProps}
              pagination={{
                ...refundTableProps.pagination,
                showSizeChanger: false
              }}
            />
          </Col>
        </Row>

        {/* 订单导出 */}
        <ExportPop
          searchList={exportParams}
          show={exportShow}
          setShow={setExportShow}
        />
        {/* <RefundOrderModal></RefundOrderModal> */}
      </div>
    </Panel>
  )
}

export default AfterSaleList
