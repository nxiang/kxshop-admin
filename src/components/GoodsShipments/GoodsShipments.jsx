import React, { useState, useEffect } from 'react';
import Css from './GoodsShipments.module.scss';
import { Button, Modal, Input, Select, message } from 'antd';

import { orderSend, orderSendConfirm, logisticsModify, logistics } from '@/services/order';

const { Option } = Select;

export default function GoodsShipments({ orderId, visible, setVisible, refresh, type }) {
  const [receiveName, setReceiveName] = useState('');
  const [receivePhone, setReceivePhone] = useState('');
  const [receiveAddress, setReceiveAddress] = useState('');
  const [shiCompanyList, setShiCompanyList] = useState([]);
  const [shipId, setShipId] = useState(undefined);
  const [shipNo, setShipNo] = useState(null);

  useEffect(() => {
    orderSendApi();
    if (!type) {
      logisticsApi();
    }
  }, [1212]);

  // 订单发货接口
  function orderSendApi() {
    orderSend({ bizOrderId: orderId }).then(res => {
      if (res.errorCode === '0') {
        setReceiveName(res.data.receiveName);
        setReceivePhone(res.data.receivePhone);
        setReceiveAddress(res.data.receiveAddress);
        setShiCompanyList(res.data.shiCompanyList);
      }
    });
  }

  // 查询物流信息
  function logisticsApi() {
    logistics({ bizOrderId: orderId }).then(res => {
      if (res.errorCode === '0') {
        setShipId(res.data.shipId);
        setShipNo(res.data.shipNo);
      }
    });
  }

  function onChange(fun, e) {
    fun(e.target.value);
  }

  function selectChange(fun, e) {
    fun(e);
  }

  function handleCancel() {
    setVisible(false);
  }

  // 发货/修改发货
  function shipments() {
    if (shipId === undefined) {
      message.warning('请选择物流公司');
      return;
    }
    if (shipNo === null || shipNo === '') {
      message.warning('物流单号不能为空');
      return;
    }
    if (type) {
      orderSendConfirm({
        shipId: shipId,
        shipNo: shipNo,
        bizOrderId: orderId,
        deliveryWay: 1,
      }).then(res => {
        if (res.errorCode === '0') {
          message.success('发货成功');
          setVisible(false);
          refresh();
        }
      });
    } else {
      logisticsModify({
        shipId: shipId,
        shipNo: shipNo,
        bizOrderId: orderId,
      }).then(res => {
        if (res.errorCode === '0') {
          message.success('修改发货成功');
          setVisible(false);
          refresh();
        }
      });
    }
  }

  return (
    <Modal title="商品发货" width={760} footer={null} visible={visible} onCancel={handleCancel}>
      <div className={Css['content-box']}>
        <div className={Css['content-choice']}>
          <div className={Css['content-choice-item']}>
            <p className={Css['item-title']}>物流公司：</p>
            <Select
              style={{ width: 200 }}
              placeholder="请选择快递公司"
              value={shipId}
              onChange={selectChange.bind(this, setShipId)}
            >
              {shiCompanyList.map(item => {
                return (
                  <Option key={item.shipId} value={item.shipId}>
                    {item.shipName}
                  </Option>
                );
              })}
            </Select>
          </div>
          <div className={Css['content-choice-item']}>
            <p className={Css['item-title']}>物流单号：</p>
            <Input
              style={{ width: 200 }}
              placeholder="请输入快递单号"
              value={shipNo}
              onChange={onChange.bind(this, setShipNo)}
            />
          </div>
        </div>
        <div className={Css['content-list']}>
          <p className={Css['content-list-title']}>收件人姓名：</p>
          <p className={Css['content-list-text']}>{receiveName}</p>
        </div>
        <div className={Css['content-list']}>
          <p className={Css['content-list-title']}>收件人地址：</p>
          <p className={Css['content-list-text']}>{receiveAddress}</p>
        </div>
        <div className={Css['content-list']}>
          <p className={Css['content-list-title']}>联系电话：</p>
          <p className={Css['content-list-text']}>{receivePhone}</p>
        </div>
        <div className={Css['foot-box']}>
          <Button type="primary" onClick={shipments}>
            {type ? '发货' : '修改发货'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
