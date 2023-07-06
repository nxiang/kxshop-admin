import React, { useState, useEffect } from 'react';
import { withRouter } from '@/utils/compatible'
import { Input, Form, Button, DatePicker, Select, Row, Col, Radio, Space, message } from 'antd';
import { history } from '@umijs/max';
import TableList from './modules/TableList';
import { ImportOrderTips } from './modules/tips';
import InstantDelivery from '@/components/InstantDelivery/InstantDelivery';
import GoodsShipments from '@/components/GoodsShipments/GoodsShipments';
import MessageCode from '@/components/MessageCode/MessageCode';
import XlsImport from '@/bizComponents/XlsImport/XlsImport';
import Panel from '@/components/Panel';
import ExportPop from './modules/ExportPop/ExportPop';
import { showBut, removeEmptyField } from '@/utils/utils';
import { orderStatus, orderRefundStatus, payChannelStatus } from '@/utils/baseData';
import Css from './OrderList.module.scss';

import { orderList, deliveryWay } from '@/services/order';
import { importTaskUpLoad, checkHasTask } from '@/services/task';

const { Option } = Select;
const { RangePicker } = DatePicker;

function OrderList(props) {
  const { location } = props;
  const [form] = Form.useForm();
  const orderSearchType = Form.useWatch('orderSearchType', form);
  const [listData, setListData] = useState([]);
  const [spinning, setSpinning] = useState(true);
  const [exportShow, setExportShow] = useState(false);
  const [sourcePage, setSourcePage] = useState({
    current: 1, // 当前页
    pageSize: 10, // 每页显示记录数
    total: 0, // 总记录数
  });
  const [orderType, setOrderType] = useState(location?.state?.orderStatus || null);
  const [searchList, setSearchList] = useState({
    bizOrderId: null,
    tradeNo: null,
    createOrderStartTime: null,
    createOrderEndTime: null,
    sendStartTime: null,
    sendEndTime: null,
    orderStatus: location?.state?.orderStatus || 0,
    payChannel: null,
    buyerName: null,
    buyerPhone: null,
    shipNo: null,
    refundStatusList: null,
    outerPayNo: null,
  });
  const [exportParams, setExportParams] = useState({
    bizOrderId: null,
    createOrderStartTime: null,
    createOrderEndTime: null,
    sendStartTime: null,
    sendEndTime: null,
    orderStatus: location?.state?.orderStatus || 0,
    payChannel: null,
    buyerName: null,
    buyerPhone: null,
    shipNo: null,
    refundStatusList: null,
    outerPayNo: null,
  });

  const [wxCodeVisible, setWxCodeVisible] = useState(false);
  const [instantVisible, setInstantVisible] = useState(false);
  const [goodsVisible, setGoodsVisible] = useState(false);
  const [bizOrderId, setBizOrderId] = useState(0);
  const [deliveryMode, setDeliveryMode] = useState(1);
  // 订单导入相关
  const [importOrderTitle, setImportOrderTitle] = useState('批量发货');
  const [importOrderVisible, setImportOrderVisible] = useState(false);
  const [importOrderLoading, setImportOrderLoading] = useState(false);
  const [importOrderResulType, setImportOrderResulType] = useState(0);
  const [importOrderErrorUrl, setImportOrderErrorUrl] = useState('');

  useEffect(() => {
    deliveryWay().then(res => {
      if (res.errorCode === '0') {
        const deliveryMode =
          res.data.deliveryWayList && res.data.deliveryWayList.indexOf(1) !== -1 ? 1 : 2;
        setDeliveryMode(deliveryMode);
      }
    });
  }, []);

  useEffect(() => {
    orderListApi();
  }, [searchList]);

  // 列表接口
  const orderListApi = page => {
    const data = {
      ...searchList,
      page: page || 1,
    };
    setSpinning(true);
    orderList(data)
      .then(res => {
        if (res.errorCode === '0') {
          setSourcePage({
            current: res.data.current,
            pageSize: res.data.pageSize,
            total: res.data.total,
          });
          setListData(
            res.data.rows.map(item => {
              return {
                ...item,
                sellerMemoIs: true,
              };
            })
          );
        }
        setSpinning(false);
      })
      .catch(() => {
        setSpinning(false);
      });
  };

  const callMsgFn = () => {
    setWxCodeVisible(true);
  };

  const closeModal = () => {
    setWxCodeVisible(false);
  };

  const onChange = (fun, e) => {
    fun(e.target.value);
    if (e.target.name === 'orderStatus') {
      const data = {
        orderStatus: e.target.value,
      }
      if (e.target.value == 2) data.refundStatusList = "0,3"
      setSearchList({
        ...searchList,
        ...data
      });
      form.setFieldsValue({
        ...data
      });
    }
  };

  // 筛选
  const onFinish = value => {
    const data = {
      bizOrderId: value.bizOrderId,
      tradeNo: value.tradeNo,
      outerPayNo: value.outerPayNo,
      createOrderStartTime:
        value.createOrder && value.createOrder.length > 1
          ? value.createOrder[0].format('YYYY-MM-DD HH:mm:ss')
          : null,
      createOrderEndTime:
        value.createOrder && value.createOrder.length > 1
          ? value.createOrder[1].format('YYYY-MM-DD HH:mm:ss')
          : null,
      sendStartTime:
        value.send && value.send.length > 1 ? value.send[0].format('YYYY-MM-DD HH:mm:ss') : null,
      sendEndTime:
        value.send && value.send.length > 1 ? value.send[1].format('YYYY-MM-DD HH:mm:ss') : null,
      orderStatus: value.orderStatus,
      refundStatusList: value.refundStatusList,
      payChannel: value.payChannel,
      buyerName: value.buyerName,
      buyerPhone: value.buyerPhone,
      shipNo: value.shipNo,
    };
    setOrderType(value.orderStatus);
    setSearchList(data);
  };

  // 重置搜索参数
  const reset = () => {
    const data = {
      orderStatus: null,
    };
    setOrderType(null);
    setSearchList(data);
    form.resetFields();
  };

  // 导出列表
  const exportOrder = () => {
    const value = form.getFieldsValue(true);
    // tradeNode不参与导出
    value.tradeNo = undefined
    // 过滤空值
    const newValue = removeEmptyField(value);
    // 判断是否选中值
    if (Object.getOwnPropertyNames(newValue).length <= 1)
      return message.warning('请选择至少一个筛选项');
    const data = {
      bizOrderId: value.bizOrderId,
      outerPayNo: value.outerPayNo,
      createOrderStartTime:
        value.createOrder && value.createOrder.length > 1
          ? value.createOrder[0].format('YYYY-MM-DD HH:mm:ss')
          : null,
      createOrderEndTime:
        value.createOrder && value.createOrder.length > 1
          ? value.createOrder[1].format('YYYY-MM-DD HH:mm:ss')
          : null,
      sendStartTime:
        value.send && value.send.length > 1 ? value.send[0].format('YYYY-MM-DD HH:mm:ss') : null,
      sendEndTime:
        value.send && value.send.length > 1 ? value.send[1].format('YYYY-MM-DD HH:mm:ss') : null,
      orderStatus: value.orderStatus,
      refundStatusList: value.refundStatusList,
      payChannel: value.payChannel,
      buyerName: value.buyerName,
      buyerPhone: value.buyerPhone,
      shipNo: value.shipNo,
    };
    console.log(data);
    setOrderType(value.orderStatus);
    setExportParams(data);
    setExportShow(true);
  };

  // 导出记录跳转
  const exprotOrderSkip = () => {
    history.push('/order/orderList/orderExportRecord');
  };

  // 导入订单弹框
  const importOrder = () => {
    checkHasTask().then(res => {
      if (res.success) {
        if (res.data) {
          setImportOrderResulType(0);
          setImportOrderVisible(true);
        }
      }
    });
  };

  // 导入记录跳转
  const importOrderSkip = () => {
    history.push('/order/orderList/orderImportRecord');
  };

  // 批量从标品库上传
  const importOrderXlsUpload = url => {
    console.log(url);
    setImportOrderLoading(true);
    importTaskUpLoad({
      type: 'BATCH_DELIVERY',
      ossUrl: url,
    }).then(res => {
      if (res.success) {
        // setImportOrderTitle('导入结果');
        // message.success("上传成功，请至导入列表页查看结果")
        setImportOrderResulType(3);
        setImportOrderErrorUrl(res.data?.errorFileOssUrl || '');
        setImportOrderLoading(false);
      } else {
        setImportOrderLoading(false);
      }
    });
  };

  return (
    <Panel title="商品订单" content="订单信息管理">
      <div className={Css['order-list-box']}>
        <div className={Css['list-header-box']}>
          <Form
            form={form}
            initialValues={{
              bizOrderId: null,
              buyerName: null,
              buyerPhone: null,
              outerPayNo: null,
              orderStatus: orderType,
              createOrder: null,
              payChannel: null,
              send: null,
              shipNo: null,
              orderSearchType: 'bizOrderId',
            }}
            onFinish={newVal => onFinish(newVal)}
          >
            <Row gutter={[12, 0]} style={{ marginBottom: 56 }}>
              <Col span={8}>
                <Form.Item label="订单搜索">
                  <Input.Group compact>
                    <Form.Item name="orderSearchType" noStyle>
                      <Select
                        style={{ width: 160 }}
                        onChange={() => {
                          form.setFieldsValue({
                            bizOrderId: undefined,
                            outerPayNo: undefined,
                            shipNo: undefined,
                            buyerName: undefined,
                            buyerPhone: undefined,
                          });
                        }}
                      >
                        <Option value="bizOrderId">订单编号</Option>
                        <Option value="outerPayNo">支付交易号</Option>
                        <Option value="tradeNo">三方交易流水号</Option>
                        <Option value="shipNo">快递单号</Option>
                        <Option value="buyerName">买家名称</Option>
                        <Option value="buyerPhone">收货人手机号</Option>
                      </Select>
                    </Form.Item>
                    {orderSearchType === 'bizOrderId' && (
                      <Form.Item name="bizOrderId" noStyle>
                        <Input style={{ width: 140 }} placeholder="请输入订单编号" allowClear />
                      </Form.Item>
                    )}
                    {orderSearchType === 'outerPayNo' && (
                      <Form.Item name="outerPayNo" noStyle>
                        <Input style={{ width: 140 }} placeholder="请输入支付流水号" allowClear />
                      </Form.Item>
                    )}
                    {orderSearchType === 'tradeNo' && (
                      <Form.Item name="tradeNo" noStyle>
                        <Input style={{ width: 140 }} placeholder="请输入支付流水号" allowClear />
                      </Form.Item>
                    )}
                    {orderSearchType === 'shipNo' && (
                      <Form.Item name="shipNo" noStyle>
                        <Input style={{ width: 140 }} placeholder="请输入快递单号" allowClear />
                      </Form.Item>
                    )}
                    {orderSearchType === 'buyerName' && (
                      <Form.Item name="buyerName" noStyle>
                        <Input style={{ width: 140 }} placeholder="请输入买家名称" allowClear />
                      </Form.Item>
                    )}
                    {orderSearchType === 'buyerPhone' && (
                      <Form.Item name="buyerPhone" noStyle>
                        <Input style={{ width: 140 }} placeholder="请输入收货人手机号" allowClear />
                      </Form.Item>
                    )}
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="下单时间" name="createOrder">
                  <RangePicker showTime allowClear />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="发货时间" name="send">
                  <RangePicker showTime allowClear />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="订单状态" name="orderStatus">
                  <Select style={{ width: 170 }} placeholder="全部" allowClear>
                    {orderStatus &&
                      orderStatus.map(item => {
                        return <Option value={item.value}>{item.label}</Option>;
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="售后状态" name="refundStatusList">
                  <Select style={{ width: 170 }} placeholder="全部" allowClear>
                    {orderRefundStatus &&
                      orderRefundStatus.map(item => {
                        return <Option value={item.value}>{item.label}</Option>;
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="支付方式" name="payChannel">
                  <Select style={{ width: 170 }} placeholder="全部" allowClear>
                    {payChannelStatus &&
                      payChannelStatus.map(item => {
                        return <Option value={item.value}>{item.label}</Option>;
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Space>
                  <Button style={{ marginLeft: 70 }} type="primary" htmlType="submit">
                    筛选
                  </Button>
                  <Button onClick={reset}>条件重置</Button>
                  {showBut('orderList', 'orderExportRecord') && (
                    <Button onClick={exportOrder}>导出</Button>
                  )}
                  {showBut('orderList', 'orderList_export') && (
                    <Button onClick={exprotOrderSkip}>导出记录</Button>
                  )}
                  {showBut('orderList', 'orderList_orderImport') && (
                    <Button type="primary" onClick={importOrder}>
                      订单导入
                    </Button>
                  )}
                  {showBut('orderList', 'orderList_orderImportRecord') && (
                    <Button onClick={importOrderSkip}>导入记录</Button>
                  )}
                </Space>
              </Col>
            </Row>
          </Form>
        </div>
        <div className={Css['list-table-box']}>
          <div className={Css['table-top-thread']} />
          <div className={Css['table-radio-group-box']}>
            <Radio.Group
              value={orderType}
              name="orderStatus"
              onChange={e => onChange(setOrderType, e)}
            >
              <Radio.Button value={null}>全部订单</Radio.Button>
              {orderStatus.map(item => {
                return <Radio.Button value={item.value}>{item.label}</Radio.Button>;
              })}
            </Radio.Group>
            <div style={{ float: 'right' }}>
              {showBut('orderList', 'orderList_warning') ? (
                <Button onClick={callMsgFn}>订单提醒</Button>
              ) : null}
            </div>
          </div>
          <div>
            <TableList
              listData={listData}
              setListData={setListData}
              spinning={spinning}
              sourcePage={sourcePage}
              deliveryMode={deliveryMode}
              orderListApi={orderListApi}
              setInstantVisible={setInstantVisible}
              setGoodsVisible={setGoodsVisible}
              setBizOrderId={setBizOrderId}
            />
          </div>
        </div>
      </div>
      {/* 订单提醒弹窗 */}
      {wxCodeVisible && <MessageCode closeModal={() => closeModal()} visible={wxCodeVisible} />}
      {/* 即时发货弹框 */}
      {instantVisible && (
        <InstantDelivery
          orderId={bizOrderId}
          visible={instantVisible}
          setVisible={setInstantVisible}
          refresh={() => orderListApi(sourcePage.current)}
        />
      )}
      {/* 商品发货弹框 */}
      {goodsVisible && bizOrderId && (
        <GoodsShipments
          orderId={bizOrderId}
          visible={goodsVisible}
          setVisible={setGoodsVisible}
          type
          refresh={() => orderListApi(sourcePage.current)}
        />
      )}
      {/* 订单上传 */}
      <XlsImport
        title={importOrderTitle}
        // action="/proxy/cloud/oss/upload?type=importxls"
        action="/proxy/cloud/oss/upload?type=上传模板"
        loading={importOrderLoading}
        visible={importOrderVisible}
        setVisible={val => {
          setImportOrderVisible(val);
        }}
        resulType={importOrderResulType}
        errorUrl={importOrderErrorUrl}
        downloadUrl="https://kxgshop.oss-cn-hangzhou.aliyuncs.com/上传模板/2022/8/2022081012334211375698.xlsx"
        promptText={<ImportOrderTips />}
        importSuccessText="上传成功！请至导入记录查看导入结果"
        uploadSubmit={url => importOrderXlsUpload(url)}
      />
      {/* 订单导出 */}
      <ExportPop searchList={exportParams} show={exportShow} setShow={setExportShow} />
    </Panel>
  );
}

export default withRouter(OrderList);
