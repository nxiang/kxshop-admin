import React, { useState, useEffect, useMemo } from 'react'
import { Image, Space } from 'antd'
import { refundHistory } from '@/services/afterSale'
import Css from './Negotiation.module.scss'

export default function Negotiation(props) {
  const { refundSn, refundRecord, logisticsQuery = () => {} } = props

  const statusType = (val) => {
    if (val.refundType === 1) {
      switch (val.status) {
        case 1:
          if (val.role === 1) {
            return (
              <div>
                <p>同意本次售后申请,售后结束 </p>
                <p>备注：{val.message} </p>
                <p>退款金额：{val.actualAmount / 100} </p>
                <p>退货数量：{val.quantity} </p>
              </div>
            )
          }
          return (
            <div>
              <p>发起售后申请，等待商家审核 </p>
              <p>售后类型：退款</p>
              <p>申请退货金额：{val.actualAmount / 100} </p>
              <p>退款原因：{val.message} </p>
              <p>售后单号：{val.refundSn} </p>
              <div>
                {val.buyerPic &&
                  val.buyerPic.map((t, i) => {
                    return (
                      <Image className={Css.goodsPic} key={i} src={t.img} />
                    )
                  })}
              </div>
            </div>
          )
        case 2:
          if (val.role === 1) {
            return (
              <div>
                <p>同意本次售后申请,售后结束 </p>
                <p>备注：{val.message} </p>
                <p>退款金额：{val.actualAmount / 100} </p>
                <p>退货数量：{val.quantity} </p>
              </div>
            )
          }
          return (
            <div>
              <p>
                买家已退回商品
                {val.shipSn && (
                  <span
                    className={Css.btnClick}
                    onClick={() => logisticsQuery('refund')}
                  >
                    点击查看物流信息
                  </span>
                )}
              </p>
              <p>退款金额：{val.actualAmount / 100} </p>
              <p>退货数量：{val.quantity} </p>
            </div>
          )
        case 3:
          return (
            <div>
              <p>拒绝本次售后申请 </p>
              <p>备注：{val.message} </p>
            </div>
          )
        case 4:
          return (
            <div>
              <p>买家取消了售后申请 </p>
            </div>
          )
        case 5:
          return (
            <div>
              <p>退款已经返还至用户支付账户 </p>
            </div>
          )
        default:
      }
    } else {
      switch (val.status) {
        case 1:
          if (val.role === 1) {
            return (
              <div>
                <p>同意本次售后申请,等待买家退回商品 </p>
                <p>备注：{val.message} </p>
                <p>退款金额：{val.actualAmount / 100} </p>
                <p>退货数量：{val.quantity} </p>
              </div>
            )
          }
          return (
            <div>
              <p>发起售后申请，等待商家审核 </p>
              <p>售后类型：退货 </p>
              <p>申请退货金额：{val.actualAmount / 100} </p>
              <p>退款原因：{val.message} </p>
              <p>售后单号：{val.refundSn} </p>
              <div>
                {val.buyerPic &&
                  val.buyerPic.map((t, i) => {
                    return (
                      <Image className={Css.goodsPic} key={i} src={t.img} />
                    )
                  })}
              </div>
            </div>
          )

        case 2:
          return (
            <div>
              <p>同意本次售后申请,等待买家退回商品 </p>
              <p>备注：{val.message} </p>
              <p>退款金额：{val.actualAmount / 100} </p>
              <p>退货数量：{val.quantity} </p>
            </div>
          )
        case 3:
          return (
            <div>
              <p>拒绝本次售后申请 </p>
              <p>备注：{val.message} </p>
            </div>
          )
        case 4:
          return (
            <div>
              <p>买家取消了售后申请 </p>
            </div>
          )
        case 5:
          return (
            <div>
              <p>
                买家已退回商品
                {val.shipSn && (
                  <span
                    className={Css.btnClick}
                    onClick={() => logisticsQuery('refund')}
                  >
                    点击查看物流信息
                  </span>
                )}
              </p>
              <p>退款金额：{val.actualAmount / 100} </p>
              <p>退货数量：{val.quantity} </p>
            </div>
          )
        case 6:
          return (
            <div>
              <p>确认收货，售后结束 </p>
              <p>备注：{val.message} </p>
              <p>退款金额：{val.actualAmount / 100} </p>
            </div>
          )
        case 7:
          return (
            <div>
              <p>退款已经返还至用户支付账户 </p>
            </div>
          )
        default:
      }
    }
  }

  if (refundRecord.length <= 0) {
    return
  }

  return (
    <div className="content">
      <div className={Css.title}>协商记录</div>
      {refundRecord.map((val, i) => {
        return (
          <div key={i}>
            <div className={Css.headerBox}>
              <Space>
                <span>{val.role === 1 ? '卖家' : '买家'}</span>
                {val?.operatorName && (
                  <span className={Css.time}>{val?.operatorName}</span>
                )}
                <span className={Css.time}>{val.createTime}</span>
              </Space>
            </div>
            <div className={Css.contentBox}>{statusType(val)}</div>
          </div>
        )
      })}
    </div>
  )
}
