import React, { useState, useMemo } from 'react'
import Css from './InstantLogistics.module.scss'
import { Modal, Spin } from 'antd'
import { logisticsBuyer } from '@/services/afterSale'
import { logistics } from '@/services/order'
import { useReactive } from 'ahooks'

export default function InstantLogistics(props) {
  const {
    visible = false,
    setVisible = () => {},
    refundSn = '',
    bizOrderId = '',
    logisticsType = 'order'
  } = props
  const state = useReactive({
    spinning: true,
    data: {}
  })

  function handleOk() {
    setVisible(false)
  }

  function handleCancel() {
    setVisible(false)
  }

  useMemo(async () => {
    if (visible) {
      let data = {}
      if (logisticsType == 'refund')
        data = await logisticsBuyer({ refundSn: refundSn })
      if (logisticsType == 'order')
        data = await logistics({ bizOrderId: bizOrderId })
      if (data?.success) {
        state.data = data.data
      }
      state.spinning = false
    } else {
      state.data = {}
      state.spinning = true
    }
  }, [visible])

  return (
    <Modal
      title="物流信息"
      width={760}
      footer={null}
      visible={visible}
      onCancel={handleCancel}
    >
      <Spin spinning={state.spinning}>
        <div className={Css['content-box']}>
          <div className={Css['content-list-item']}>
            <p className={Css['list-item-title']}>快递公司名称：</p>
            <p className={Css['list-item-text']}>{state.data.shipName}</p>
          </div>
          <div className={Css['content-list-item']}>
            <p className={Css['list-item-title']}>快递单号：</p>
            <p className={Css['list-item-text']}>{state.data.shipNo}</p>
          </div>
          <div className={Css['logistics-box']}>
            {state?.data.expressList ? (
              state?.data.expressList.map((val) => {
                return (
                  <div className={Css['logistics-row']}>
                    <div className={Css['row-title']}>{val.time}</div>
                    <div className={Css['row-text']}>{val.context}</div>
                  </div>
                )
              })
            ) : (
              <div className={Css['logistics-row']}>
                <div className={Css['row-text']}>暂无信息</div>
              </div>
            )}
          </div>
        </div>
      </Spin>
    </Modal>
  )
}
