import React from 'react'
import { history } from '@umijs/max'
import { Typography } from 'antd'
import { showBut } from '@/utils/utils'
import {
  orderStatus,
  refundTypeStatus,
  refundTypeRenderStatus,
  refundStateTypeStatus
} from '@/utils/baseData'

const { Link } = Typography

export const refundListColumn = () => {
  // 申请售后金额render
  const refundAmountRender = (record) => {
    return (
      <div>
        <span>¥</span>
        <span>
          {record.refundAmount < 100
            ? '0'
            : Math.floor(record.refundAmount / 100)}
        </span>
        <span>
          .
          {String((record.refundAmount / 100).toFixed(2)).substring(
            String((record.refundAmount / 100).toFixed(2)).length - 2
          )}
        </span>
      </div>
    )
  }

  const data = [
    // {
    //   title: '订单编号',
    //   dataIndex: 'refundSn',
    //   align: 'center',
    // },
    {
      title: '售后单号',
      width: 175,
      dataIndex: 'refundSn',
      align: 'left'
    },
    {
      title: '申请售后时间',
      width: 180,
      dataIndex: 'addTime',
      align: 'center'
    },
    {
      title: '售后类型',
      align: 'center',
      render: (record) =>
        refundTypeStatus.find((item) => item.value == record.refundType)
          ?.label || ''
    },
    {
      title: '退款方式',
      width: 120,
      align: 'center',
      render: (record) =>
        refundStateTypeStatus.find(
          (item) => item.value == record.refundStateType
        )?.label
    },
    {
      title: '售后状态',
      align: 'center',
      render: (record) =>
        refundTypeRenderStatus.find((item) => item.value == record.status)
          ?.label || ''
    },
    {
      title: '申请售后金额',
      align: 'center',
      render: (record) => refundAmountRender(record)
    },
    // {
    //   title: '积分',
    //   dataIndex: 'presentPoints',
    //   align: 'center',
    // },
    {
      title: '买家名称',
      align: 'center',
      render: (record) => {
        return (
          <div>
            <p>{record.buyerName}</p>
            <p style={{ color: '#999', fontSize: 12 }}>
              用户ID:{record.buyerId}
            </p>
          </div>
        )
      }
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      align: 'center',
      render: (record) =>
        orderStatus.find((item) => item.value == record)?.label || ''
    },
    {
      title: '下单时间',
      width: 180,
      dataIndex: 'orderDateTime',
      align: 'center'
    },
    {
      title: '手机号',
      width: 130,
      dataIndex: 'phone',
      align: 'center'
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (record) => {
        return (
          <div>
            {showBut('afterSaleList', 'afterSaleList_view') && (
              <Link
                onClick={() =>
                  history.push(
                    `/order/afterSaleList/afterSaleDetail?refundSn=${record.refundSn}`
                  )
                }
              >
                查看详情
              </Link>
            )}
          </div>
        )
      }
    }
  ]

  return data
}
