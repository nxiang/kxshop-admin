import React, { useState, useEffect, useMemo } from 'react'
import { history } from '@umijs/max'
import { Steps, Table, Image } from 'antd'
import Panel from '@/components/Panel'
import Css from './AfterSaleDetail.module.scss'
import AfterSaleStatus from './modules/AfterSaleStatus/AfterSaleStatus'
import Negotiation from './modules/Negotiation/Negotiation'
import { refundDetailColumn } from './columns'

import { refundDetail, refundHistory } from '@/services/afterSale'
import { useReactive } from 'ahooks'
import InstantLogistics from './modules/InstantLogistics/InstantLogistics'

const { Step } = Steps

export default function AfterSaleDetail(props) {
  const [data, setData] = useState({})
  const [refundRecord, setRefundRecord] = useState([{}])
  const [stepNum, setStepNum] = useState(0)
  // 物流信息
  const logisticsInfo = useReactive({
    visible: false,
    logisticsType: 'order'
  })

  // 初始化
  const initData = async () => {
    getRefundDetail()
    getRefundHistory()
  }

  // 请求售后订单信息
  const getRefundDetail = async () => {
    const info = await refundDetail({
      refundSn: history.location.query?.refundSn || ''
    })
    if (info) {
      setData(info.data)
    }
  }

  // 请求订单协商记录
  const getRefundHistory = async () => {
    const info = await refundHistory({
      refundSn: history.location.query?.refundSn || ''
    })
    if (info && info?.data) {
      setRefundRecord(info.data.list)
    }
  }

  // 打开物流信息弹框
  const logisticsQuery = async (val) => {
    console.log(val)
    logisticsInfo.logisticsType = val
    logisticsInfo.visible = true
  }

  useMemo(() => {
    initData()
  }, [])

  useMemo(() => {
    switch (data.status) {
      case 3:
        setStepNum(4)
        break
      case 5:
        if (data.refundType === 1) {
          setStepNum(2)
        } else {
          setStepNum(3)
        }
        break
      default:
        setStepNum(data.status)
    }
  }, [data])

  return (
    <Panel title="售后详情" content="售后详情文案">
      <div className="content" style={{ marginBottom: '24px' }}>
        <Steps
          current={stepNum}
          initial={1}
          labelPlacement="vertical"
          style={{ padding: '16px 150px' }}
        >
          <Step title="买家提交申请" description={data.addTime} />
          <Step title="商家审核" description={data.sellerTime} />
          {data.refundType === 2 && (
            <Step title="等待买家寄回商品" description={data.finishTime} />
          )}
          <Step title="售后成功" description={data.finishTime} />
        </Steps>
      </div>
      {/* 订单状态 */}
      <AfterSaleStatus
        data={data}
        refresh={initData}
        logisticsQuery={(val) => logisticsQuery(val)}
      />
      {/* 订单商品信息 */}
      {data.item && (
        <div className="content" style={{ margin: '24px 0' }}>
          <div className={Css.title}>订单商品信息</div>
          <Table
            rowKey={(record) => record.itemId}
            dataSource={data.item.list}
            columns={refundDetailColumn({
              bizOrderId: data?.bizOrderId || 0
            })}
            bordered
            pagination={false}
          />
          <p className={Css.tableMsg}>
            订单共{data.item.quantityTotal}件商品，总计：
            <span style={{ color: '#F72633' }}>
              ¥{data.item.actualTotal / 100}
            </span>
            (含运费
            {data.item.freightTotal / 100}元)
          </p>
        </div>
      )}
      {/* 协商记录 */}
      <Negotiation
        refundSn={history.location.query?.refundSn || ''}
        refundRecord={refundRecord}
        logisticsQuery={(val) => logisticsQuery(val)}
      />
      {/* 物流信息弹框 */}
      <InstantLogistics
        refundSn={history.location.query?.refundSn || ''}
        bizOrderId={data?.bizOrderId || ''}
        logisticsType={logisticsInfo.logisticsType}
        visible={logisticsInfo.visible}
        setVisible={(e) => (logisticsInfo.visible = e)}
      />
    </Panel>
  )
}
