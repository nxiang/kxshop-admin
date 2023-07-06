import { Button, Modal } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import Css from './InstantLogistics.module.scss';
import { logisticsDD, logistics, logisticsCanel } from '@/services/order';

export default function InstantLogistics(props) {
  const { visible, setVisible, orderId, deliveryWay } = props;
  const [data, setData] = useState({});
  function handleOk() {
    setVisible(false);
  }

  function handleCancel() {
    setVisible(false);
  }
  async function cancelOrder() {
    const info = await logisticsCanel({ bizOrderId: orderId, shipNo: data.shipNo });
    if (info) {
      handleCancel();
    }
  }

  const statusType = state => {
    switch (state) {
      case 1:
        return '待接单';
      case 2:
        return '待取货';
      case 3:
        return '配送中';
      case 4:
        return '已完成';
      case 5:
        return '已取消';
      case 7:
        return '已过期';
      case 8:
        return '指派单';
      case 9:
        return '妥投异常之物品返回中';
      case 10:
        return '妥投异常之物品返回完成';
      case 100:
        return '骑士到店';
      case 1000:
        return '创建运单失败';
      default:
        return '';
    }
  };
  useMemo(async () => {
    if (deliveryWay == 1) {
      const data = await logistics({ bizOrderId: orderId });
      if (data) {
        setData(data.data);
      }
    } else {
      const data = await logisticsDD({ bizOrderId: orderId });
      if (data) {
        setData(data.data);
      }
    }
  }, [orderId]);

  return (
    <Modal title="物流信息" width={760} footer={null} visible={visible} onCancel={handleCancel}>
      {deliveryWay == 1 ? (
        <div className={Css['content-box']}>
          <div className={Css['content-list-item']}>
            <p className={Css['list-item-title']}>快递公司名称：</p>
            <p className={Css['list-item-text']}>{data.shipName}</p>
          </div>
          <div className={Css['content-list-item']}>
            <p className={Css['list-item-title']}>快递单号：</p>
            <p className={Css['list-item-text']}>{data.shipNo}</p>
          </div>
          <div className={Css['logistics-box']}>
            {data.expressList ? (
              data.expressList.map(val => {
                return (
                  <div className={Css['logistics-row']}>
                    <div className={Css['row-title']}>{val.time}</div>
                    <div className={Css['row-text']}>{val.context}</div>
                  </div>
                );
              })
            ) : (
              <div className={Css['logistics-row']}>
                <div className={Css['row-text']}>暂无信息</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={Css['content-box-2']}>
          <div className={Css['content-list-item']}>
            <p className={Css['list-item-title']}>订单号：</p>
            <p className={Css['list-item-text']}>{orderId}</p>
          </div>
          <div className={Css['content-list-item']}>
            <p className={Css['list-item-title']}>物流公司：</p>
            <p className={Css['list-item-text']}>{data.shipName}</p>
          </div>
          <div className={Css['content-list-item']}>
            <p className={Css['list-item-title']}>运单号码：</p>
            <p className={Css['list-item-text']}>{data.shipNo}</p>
          </div>
          <div className={Css['content-list-item']}>
            <p className={Css['list-item-title']}>订单状态：</p>
            {data.instant && (
              <p className={Css['list-item-text']}>{statusType(data.instant.status)}</p>
            )}
          </div>
          <div className={Css['content-list-item']}>
            <p className={Css['list-item-title']}>骑手姓名：</p>
            {data.instant && <p className={Css['list-item-text']}>{data.instant.deliveryName}</p>}
          </div>
          <div className={Css['content-list-item']}>
            <p className={Css['list-item-title']}>骑手电话：</p>
            {data.instant && <p className={Css['list-item-text']}>{data.deliveryPhone}</p>}
          </div>
          <div className={Css['content-list-item']}>
            <p className={Css['list-item-title']}>配送费：</p>
            {data.instant && <p className={Css['list-item-text']}>{data.instant.fee / 100}</p>}
          </div>
          {/* <div className={Css["content-list-item"]}>
      <p className={Css["list-item-title"]}>配送员实时位置：</p>
      <p className={Css["list-item-text"]}></p>
    </div> */}
          <div className={Css['foot-box']}>
            <Button type="primary" onClick={handleCancel}>
              关闭
            </Button>
            {data.instant && (data.instant.status == 1 || data.instant.status == 2) && (
              <Button style={{ marginLeft: 12 }} onClick={cancelOrder}>
                取消订单
              </Button>
            )}
            {data.instant && data.instant.status == 9 && (
              <Button style={{ marginLeft: 12 }} onClick={cancelOrder}>
                确认退回
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
