import React, { useState, useEffect } from 'react';
import Css from './InstantDelivery.module.scss';
import copy from 'copy-to-clipboard';
import { Radio, Button, Modal, Input, Select, message } from 'antd';

import { orderSend, orderSendConfirm } from '@/services/order';
import { queryFee, queryStore } from '@/services/logistics';
import { tradePrint } from '@/services/printer';

const { Option } = Select;
const { TextArea } = Input;

export default function InstantDelivery(props) {
  const { orderId, visible, setVisible, refresh } = props;
  const [distribution, setDistribution] = useState(1);
  // 收件人信息
  const [userInfo, setUserInfo] = useState('');
  // 配送方式选择
  const [deliveryWay, setDeliveryWay] = useState([]);
  // 三方配送数据
  const [queryFeeData, setQueryFeeData] = useState({
    shipCode: null,
    couponFee: null,
    deliverFee: null,
    distance: null,
    enough: null,
    fee: null,
    shipNo: null,
    url: null,
    unionDetail: null,
  });
  // 商家配送信息
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [shipNote, setShipNote] = useState('');
  // 配送展示阀门
  const [queryFeeIs, setQueryFeeIs] = useState(false);
  // 第三方配送列表
  const [shiCompanyList, setShiCompanyList] = useState([]);
  const [kssType, setKssType] = useState('');
  const [kssPrice, setKssPrice] = useState('');

  useEffect(() => {
    orderSendApi();
  }, [1212]);

  function orderSendApi() {
    orderSend({ bizOrderId: orderId }).then(res => {
      if (res.errorCode === '0') {
        setShiCompanyList(res.data.shiCompanyList);
        setDeliveryWay(res.data.deliveryWay);
        setDistribution(res.data.deliveryWay[res.data.deliveryWay.length - 1]);
        setUserInfo(
          `${res.data.receiveName}，${res.data.receivePhone}，${res.data.receiveAddress}`
        );
      }
    });
  }

  function queryStoreApi() {
    queryStore().then(res => {
      if (res.errorCode === '0') {
        setDeliveryPhone(res.data.storePhone);
        setShipNote(res.data.content);
      }
    });
  }

  function selectChange(e) {
    setQueryFeeIs(false);
    queryFee({
      bizOrderId: orderId,
      shipCode: e,
    }).then(res => {
      if (res.errorCode === '0') {
        setQueryFeeIs(true);
        setQueryFeeData(res.data);
      }
    });
  }

  function rechargeSkip() {
    window.open(queryFeeData.url);
  }

  function onChange(fun, e) {
    fun(e.target.value);
  }

  // 关闭弹窗
  function handleCancel() {
    setVisible(false);
  }

  // 发货
  function shipments() {
    if (distribution === 2) {
      if (deliveryPhone === '') {
        message.warning('请设置配送员电话');
        return;
      }
      orderSendConfirm({
        bizOrderId: orderId,
        deliveryWay: distribution,
        deliveryPhone: deliveryPhone,
        shipNote: shipNote,
      }).then(res => {
        if (res.errorCode === '0') {
          message.success('发货成功');
          setVisible(false);
          refresh();
        }
      });
    }
    if (distribution === 3) {
      if (queryFeeData.enough === null) {
        message.warning('请选择快递');
        return;
      }
      if (queryFeeData.enough === false) {
        message.warning('余额不足，请为当前配送平台充值额度');
        return;
      }
      switch (queryFeeData.shipCode) {
        case 'DADA':
          orderSendConfirm({
            bizOrderId: orderId,
            shipNo: queryFeeData.shipNo,
            deliveryWay: distribution,
            amount: queryFeeData.fee,
            shipCode: queryFeeData.shipCode,
          }).then(res => {
            if (res.errorCode === '0') {
              message.success('发货成功');
              setVisible(false);
              refresh();
            }
          });
          break;
        case 'KSS':
          if (kssType == '') {
            message.warning('请选择派送的物流');
            return;
          }
          orderSendConfirm({
            bizOrderId: orderId,
            deliveryWay: distribution,
            amount: kssPrice,
            shipCode: queryFeeData.shipCode,
            type: kssType,
          }).then(res => {
            if (res.errorCode === '0') {
              message.success('发货成功');
              setVisible(false);
              refresh();
            }
          });
      }
    }
  }

  // 打印
  function stamp() {
    tradePrint(orderId).then(res => {
      if (res.success) {
        message.success('打印成功');
      }
    });
  }

  // 复制订单信息
  function copyInfo() {
    if (copy(userInfo)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  }

  return (
    <Modal title="发货" width={760} footer={null} visible={visible} onCancel={handleCancel}>
      <div className={Css['content-box']}>
        <div className={Css['content-row']}>
          <div className={Css['content-row-left']}>订单号：</div>
          <div className={Css['content-row-right']}>
            <p>{orderId}</p>
          </div>
        </div>
        <div className={Css['content-row']}>
          <div className={Css['content-row-left']}>收件人信息：</div>
          <div className={Css['content-row-right']}>
            <p>{userInfo}</p>
          </div>
        </div>
        <div className={Css['content-row']}>
          <div className={Css['content-row-left']}>配送员信息：</div>
          <div className={Css['content-row-right']}>
            <div>
              <Radio.Group value={distribution} onChange={onChange.bind(this, setDistribution)}>
                {deliveryWay.indexOf(3) !== -1 && <Radio value={3}>三方配送</Radio>}
                {deliveryWay.indexOf(2) !== -1 && <Radio value={2}>商家配送</Radio>}
              </Radio.Group>
            </div>
            {distribution == 3 && (
              <div className={Css['tripartite-box']}>
                <Select
                  className={Css['tripartite-select']}
                  placeholder="请选择快递"
                  onChange={selectChange}
                >
                  {shiCompanyList.length > 0 &&
                    shiCompanyList.map(item => {
                      return (
                        <Option key={item.shipId} value={item.shipCode}>
                          {item.shipName}
                        </Option>
                      );
                    })}
                </Select>
                {queryFeeIs && (
                  <>
                    {queryFeeData.shipCode == 'DADA' && (
                      <>
                        {queryFeeData.enough && (
                          <p className={Css['tripartite-freight']}>
                            运费将从平台扣除，请保证平台余额充足，
                            <span className={Css['blue-btn']} onClick={rechargeSkip}>
                              去充值
                            </span>
                          </p>
                        )}
                        {queryFeeData.enough === false && (
                          <p className={Css['tripartite-freight']}>
                            您当前配送平台账号余额不足，无法发货，请先充值。
                            <span className={Css['blue-btn']} onClick={rechargeSkip}>
                              去充值
                            </span>
                          </p>
                        )}
                        {queryFeeData.enough && (
                          <div className={Css['distribution-info-box']}>
                            <div className={Css['distribution-info-row']}>
                              <p>配送距离：</p>
                              <p>{queryFeeData.distance}米</p>
                            </div>
                            <div className={Css['distribution-info-row']}>
                              <p>运费：</p>
                              <p>{Number(queryFeeData.deliverFee / 100).toFixed(2)}元</p>
                            </div>
                            <div className={Css['distribution-info-row']}>
                              <p>优惠券折扣：</p>
                              <p>{Number(queryFeeData.couponFee / 100).toFixed(2)}元</p>
                            </div>
                            <div
                              className={`${Css['distribution-info-row']} ${
                                Css['reality-freight']
                              }`}
                            >
                              <p>实付运费：</p>
                              <p className={Css['freight-red-text']}>
                                {Number(queryFeeData.fee / 100).toFixed(2)}元
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {queryFeeData.shipCode == 'KSS' && (
                      <>
                        {queryFeeData.enough === false && (
                          <p className={Css['tripartite-freight']}>
                            您当前配送平台账号余额不足，请联系你的客户经理充值
                          </p>
                        )}
                        {queryFeeData.enough && (
                          <div className={Css['kss-info-box']}>
                            <p className={Css['kss-info-title']}>
                              配送距离：{queryFeeData.distance}米
                            </p>
                            <div className={Css['kss-item-box']}>
                              {queryFeeData.unionDetail &&
                                queryFeeData.unionDetail.map(item => {
                                  return (
                                    <div
                                      className={
                                        kssType == item.type
                                          ? `${Css['kss-item']} ${Css['kss-item-pitch']}`
                                          : Css['kss-item']
                                      }
                                      key={item.type}
                                      onClick={() => {
                                        setKssType(item.type);
                                        setKssPrice(item.price);
                                      }}
                                    >
                                      <p className={Css['item-left']}>{item.typeName}</p>
                                      <p className={Css['item-right']}>
                                        <span>{Number(item.price / 100)}</span>元
                                      </p>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
            {distribution == 2 && (
              <div className={Css['merchant-box']}>
                <Input
                  className={Css['merchant-photo']}
                  placeholder="配送员固定电话或手机"
                  value={deliveryPhone}
                  onChange={onChange.bind(this, setDeliveryPhone)}
                />
                <TextArea
                  className={Css['merchant-text-area']}
                  placeholder="请接入配送信息，方便买家联系配送员"
                  autoSize={{ minRows: 2, maxRows: 2 }}
                  value={shipNote}
                  onChange={onChange.bind(this, setShipNote)}
                />
                <p className={Css['blue-btn']} onClick={queryStoreApi}>
                  使用店铺信息
                </p>
              </div>
            )}
          </div>
        </div>
        <div className={Css['foot-box']}>
          <Button style={{ marginRight: 8 }} onClick={handleCancel}>
            取消
          </Button>
          <Button style={{ marginRight: 8 }} onClick={stamp}>
            小票打印
          </Button>
          <Button style={{ marginRight: 8 }} onClick={copyInfo}>
            复制订单信息
          </Button>
          <Button style={{ marginRight: 8 }} type="primary" onClick={shipments}>
            立即发货
          </Button>
        </div>
      </div>
    </Modal>
  );
}
