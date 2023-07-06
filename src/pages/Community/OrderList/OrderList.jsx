import React, { useState, useEffect } from 'react';
import { history } from '@umijs/max';
import {
  Input,
  Form,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  Radio,
  message,
  Tooltip,
  Pagination,
  Spin,
  Empty,
  Space,
  PageHeader,
  Divider,
} from 'antd';
import moment from 'moment';
import { showBut } from '@/utils/utils';
import Css from './OrderList.module.scss';
import Panel from '@/components/Panel';
import InstantDelivery from '@/components/InstantDelivery/InstantDelivery';
import GoodsShipments from '@/components/GoodsShipments/GoodsShipments';
import MessageCode from '@/components/MessageCode/MessageCode';
import ExportOrdersModal from './ExportOrdersModal';
import RegionSelect from '@/bizComponents/RegionSelect';

import { communityList, deliveryWay, modifySellerMemo } from '@/services/order';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const headerItem = [
  '商品信息',
  '商品规格',
  '购买数量',
  '社区团购价',
  '订单金额',
  '团长佣金',
  '实付金额',
  '自提点信息',
  '买家信息',
  '操作',
];

// 订单列表
const TableList = React.memo(
  ({
    listData,
    setListData,
    sourcePage,
    deliveryMode,
    orderListApi,
    spinning,
    setInstantVisible,
    setGoodsVisible,
    setBizOrderId,
  }) => {
    const textAreaChange = (e, index) => {
      const newListData = listData;
      newListData[index].sellerMemo = e.target.value;
      setListData(newListData.slice());
    };

    const editData = index => {
      const newListData = listData;
      newListData[index].sellerMemoIs = false;
      setListData(newListData.slice());
    };

    const saveData = index => {
      if (!listData[index].sellerMemo) {
        message.warning('备注不能为空');
        return;
      }
      modifySellerMemo({
        bizOrderId: listData[index].bizOrderId,
        sellerMemo: listData[index].sellerMemo,
      }).then(res => {
        if (res?.success) {
          const newListData = listData;
          newListData[index].sellerMemoIs = true;
          setListData(newListData.slice());
        }
      });
    };

    // const delivery = item => {
    //   setBizOrderId(item.bizOrderId);
    //   if (item.marketing && item.marketing.groupon.state === 1) {
    //     message.warning('发货失败，待成团订单不能发货');
    //     return;
    //   }
    //   if (deliveryMode === 1) {
    //     setGoodsVisible(true);
    //   } else if (deliveryMode === 2) {
    //     setInstantVisible(true);
    //   }
    // };

    const defailsSkip = item => {
      if (item) {
        history.push(`/community/order/orderList/detail?bizOrderId=${item.bizOrderId}`);
      }
    };

    const PaginantionDom = () => {
      return (
        <Pagination
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '24px',
            marginBottom: '24px',
          }}
          current={sourcePage.current}
          total={sourcePage.total}
          pageSize={sourcePage.pageSize}
          showTotal={total => `共${total}条数据`}
          showSizeChanger={false}
          showQuickJumper
          onChange={page => orderListApi(page)}
        />
      );
    };

    return (
      <div className={Css['table-box']}>
        <PaginantionDom />
        <Spin spinning={spinning}>
          <div className={Css['table-header-box']}>
            {headerItem.map(item => {
              return (
                <div key={item} className={Css['table-header-item-box']}>
                  {item}
                </div>
              );
            })}
          </div>

          {listData?.length ? (
            listData.map((item, index) => {
              return (
                <div className={Css['table-item-box']} key={item?.bizOrderId}>
                  <div className={Css['table-order-info-box']}>
                    <div className={Css['table-order-name']}>订单编号: {item?.bizOrderId}</div>
                    {
                      {
                        1: (
                          <div
                            className={Css['table-order-type']}
                            style={{ color: '#FF7205', borderColor: '#FF7205' }}
                          >
                            待付款
                          </div>
                        ),
                        3: (
                          <div
                            className={Css['table-order-type']}
                            style={{ color: '#1890FF', borderColor: '#1890FF' }}
                          >
                            待提货
                          </div>
                        ),
                        4: (
                          <div
                            className={Css['table-order-type']}
                            style={{ color: '#52C41A', borderColor: '#52C41A' }}
                          >
                            已成功
                          </div>
                        ),
                        5: <div className={Css['table-order-type']}>已取消</div>,
                        6: <div className={Css['table-order-type']}>已评价</div>,
                        false: '',
                      }[(item?.orderStatus)]
                    }
                    {
                      {
                        1: (
                          <div
                            className={Css['table-order-type']}
                            style={{ color: '#FF7205', borderColor: '#FF7205' }}
                          >
                            退款中
                          </div>
                        ),
                        2: (
                          <div
                            className={Css['table-order-type']}
                            style={{ color: '#1890FF', borderColor: '#1890FF' }}
                          >
                            退款成功
                          </div>
                        ),
                        3: (
                          <div
                            className={Css['table-order-type']}
                            style={{ color: '#1890FF', borderColor: '#1890FF' }}
                          >
                            退款关闭
                          </div>
                        ),
                        false: '',
                      }[(item?.refundStatus)]
                    }
                    {item.isInvoice > 0 && (
                      <div
                        className={Css['table-order-type']}
                        style={{ color: '#1890FF', borderColor: '#1890FF' }}
                      >
                        开票
                      </div>
                    )}
                  </div>
                  <div className={Css['table-order-content-box']}>
                    <div className={Css['left-content-box']}>
                      {item?.item?.list?.length &&
                        item.item.list.map((subItem, subIndex) => {
                          return (
                            <div
                              className={
                                item.item.list?.length > 1
                                  ? `${Css['left-content-item-box']} ${
                                      Css['left-content-item-num-box']
                                    }`
                                  : Css['left-content-item-box']
                              }
                              key={subIndex}
                            >
                              {item?.marketing && (
                                <img
                                  className={Css['group-img']}
                                  src="https://img.kxll.com/admin_manage/pingtuan.png"
                                  alt=""
                                />
                              )}
                              <div className={Css['item-box']}>
                                <div className={Css['goods-box']}>
                                  <img
                                    className={Css['goods-img']}
                                    src={subItem?.itemImgSrc}
                                    alt=""
                                  />
                                  <p className={Css['goods-text']}>{subItem?.itemName}</p>
                                </div>
                              </div>
                              <div className={Css['item-box']}>
                                <div
                                  className={Css['item-text']}
                                  dangerouslySetInnerHTML={{ __html: subItem?.skuDesc }}
                                />
                              </div>
                              <div className={Css['item-box']}>
                                <div className={Css['item-text']}>{subItem?.quantity}</div>
                              </div>
                              <div className={Css['item-box']}>
                                <div className={Css['item-text']}>
                                  ¥
                                  {subItem?.price ? Number(subItem.price / 100).toFixed(2) : '0.00'}
                                </div>
                              </div>
                              <div className={Css['item-box']}>
                                <div className={`${Css['item-text']} ${Css['item-text-bold']}`}>
                                  ¥
                                  {subItem?.actualAmount
                                    ? Number(subItem.actualAmount / 100).toFixed(2)
                                    : '0.00'}
                                </div>
                              </div>
                              <div className={Css['item-box']}>
                                <div className={`${Css['item-text']} ${Css['item-text-bold']}`}>
                                  ¥
                                  {subItem?.actualAmount
                                    ? Number(subItem.actualAmount / 100).toFixed(2)
                                    : '0.00'}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    <div className={Css['right-content-box']}>
                      <div className={Css['right-content-top-box']}>
                        <div className={Css['right-item-box']}>
                          <p>
                            ¥
                            {item?.actualAmount
                              ? Number(item.actualAmount / 100).toFixed(2)
                              : '0.00'}
                          </p>
                          <p>优惠金额：</p>
                          <p>
                            ¥
                            {item?.promotionAmount
                              ? Number(item.promotionAmount / 100).toFixed(2)
                              : '0.00'}
                          </p>
                        </div>
                        <div className={Css['right-item-box']}>
                          <p>{item?.communityGroupOrderExt?.majorName}</p>
                          <p>{item?.communityGroupOrderExt?.majorPhone}</p>
                          <p>{item?.communityGroupOrderExt?.pickUpName}</p>
                          <p>{item?.communityGroupOrderExt?.pickUpAddress}</p>
                        </div>
                        <div className={Css['right-item-box']}>
                          <p>{item?.communityGroupOrderExt?.receiverName}</p>
                          <p>{item?.communityGroupOrderExt?.receiverPhone}</p>
                        </div>
                        <div className={Css['right-item-box']}>
                          {showBut('orderList', 'orderList_view') ? (
                            <p onClick={() => defailsSkip(item)}>查看详情</p>
                          ) : null}
                          {/* {item.orderStatus == 2 && showBut('orderList', 'orderList_send') && (
                            <p onClick={() => delivery(item)}>发货</p>
                          )} */}
                        </div>
                      </div>
                      <div className={Css['right-content-buttom-box']}>
                        <p className={Css['right-title']}>
                          顾客备注:
                          <Tooltip placement="topLeft" title={item?.buyerMessage}>
                            <span>{item?.buyerMessage}</span>
                          </Tooltip>
                        </p>
                        <p className={Css['right-title']}>订单备注</p>
                        <TextArea
                          disabled={item.sellerMemoIs}
                          className={Css['right-textarea']}
                          value={item?.sellerMemo}
                          autoSize={{ minRows: 3, maxRows: 3 }}
                          maxLength={100}
                          onChange={e => textAreaChange(e, index)}
                        />
                        <div className={Css['right-operation']}>
                          {item.sellerMemoIs && showBut('orderList', 'orderList_edit') ? (
                            <p onClick={() => editData(index)}>编辑</p>
                          ) : (
                            <p onClick={() => saveData(index)}>保存</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <Empty />
          )}
        </Spin>
        <PaginantionDom />
      </div>
    );
  }
);

function OrderList() {
  const [form] = Form.useForm();
  const [listData, setListData] = useState([]);
  const [spinning, setSpinning] = useState(true);
  const [sourcePage, setSourcePage] = useState({
    current: 1, // 当前页
    pageSize: 10, // 每页显示记录数
    total: 0, // 总记录数
  });
  const [orderType, setOrderType] = useState(0);
  const [searchList, setSearchList] = useState({
    orderStatus: 0,
  });

  const [wxCodeVisible, setWxCodeVisible] = useState(false);
  const [instantVisible, setInstantVisible] = useState(false);
  const [goodsVisible, setGoodsVisible] = useState(false);
  const [exportOrderVisible, setExportOrderVisible] = useState(false);
  const [bizOrderId, setBizOrderId] = useState(0);
  const [deliveryMode, setDeliveryMode] = useState(1);

  useEffect(() => {
    deliveryWay().then(res => {
      if (res.errorCode === '0') {
        const deliveryMode =
          res.data.deliveryWayList && res.data.deliveryWayList.indexOf(1) !== -1 ? 1 : 2;
        setDeliveryMode(deliveryMode);
      }
    });
  }, [1222]);

  useEffect(() => {
    orderListApi();
  }, [searchList]);

  function orderListApi(page) {
    const data = {
      ...searchList,
      page: page || 1,
    };
    setSpinning(true);
    communityList(data)
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
  }

  // function callMsgFn() {
  //   setWxCodeVisible(true);
  // }

  function closeModal() {
    setWxCodeVisible(false);
  }
  function onChange(fun, e) {
    fun(e.target.value);
    if (e.target.name === 'orderStatus') {
      setSearchList({
        ...searchList,
        orderStatus: e.target.value,
      });
      form.setFieldsValue({
        orderStatus: e.target.value,
      });
    }
  }

  // 筛选
  function onFinish(newValue) {
    let data = {
      bizOrderId: newValue.bizOrderId,
      receiverPhone: newValue.receiverPhone,
      addressDetail: newValue.addressDetail,
      majorPhone: newValue.majorPhone,
      orderStatus: newValue.orderStatus,
      pickUpName: newValue.pickUpName,
    };
    if (newValue?.orderTime) {
      data = {
        ...data,
        beginTime: `${moment(newValue.orderTime[0]).format('YYYY-MM-DD')} 00:00:00`,
        endTime: `${moment(newValue.orderTime[1]).format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    if (newValue?.provice) {
      data = {
        ...data,
        addressProvince: newValue?.provice[0],
        addressCity: newValue?.provice[1],
        addressRegion: newValue?.provice[2],
      };
    }
    setOrderType(newValue.orderStatus);
    setSearchList(data);
  }

  // 重置搜索参数
  function reset() {
    const data = {
      orderStatus: 0,
    };
    setOrderType(0);
    setSearchList(data);
    form.resetFields();
  }

  return (
    <Panel>
      <PageHeader
        title="社区团购订单"
        style={{ background: '#fff' }}
        extra={[
          <Button key={0} type="primary" ghost onClick={() => setExportOrderVisible(true)}>
            操作文档
          </Button>,
        ]}
      >
        <Row>
          <Col span={24}>
            <Form
              form={form}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              initialValues={{
                bizOrderId: null,
                buyerName: null,
                buyerPhone: null,
                orderStatus: orderType,
                createOrder: null,
                payChannel: null,
                send: null,
                shipNo: null,
              }}
              onFinish={value => onFinish(value)}
            >
              <Row gutter={[12, 12]}>
                <Col span={8}>
                  <Form.Item
                    label="买家手机号"
                    name="receiverPhone"
                    rules={[
                      {
                        required: false,
                        pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                        message: '请输入正确的手机号',
                      },
                    ]}
                  >
                    <Input placeholder="请输入" maxLength={11} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="自提点区域" name="provice">
                    <RegionSelect />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="自提点地址" name="addressDetail">
                    <Input placeholder="请输入" maxLength={30} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="团长手机号"
                    name="majorPhone"
                    rules={[
                      {
                        required: false,
                        pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                        message: '请输入正确的手机号',
                      },
                    ]}
                  >
                    <Input placeholder="请输入" maxLength={11} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="订单状态" name="orderStatus">
                    <Select placeholder="全部">
                      <Option value={0}>全部订单</Option>
                      <Option value={1}>待付款</Option>
                      <Option value={3}>待提货</Option>
                      <Option value={4}>已成功</Option>
                      <Option value={5}>已取消</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="下单时间" name="orderTime">
                    <RangePicker />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="订单编号"
                    name="bizOrderId"
                    rules={[
                      {
                        required: false,
                        pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                        message: '请输入正确的订单号',
                      },
                    ]}
                  >
                    <Input placeholder="请输入" maxLength={30} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="自提点名称" name="pickUpName">
                    <Input placeholder="请输入" maxLength={30} />
                  </Form.Item>
                </Col>
                <Col span={22} offset={2}>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      筛选
                    </Button>
                    <Button onClick={() => reset()}>条件重置</Button>
                    {showBut('orderList', 'orderExportRecord') ? (
                      <Button type="primary" ghost onClick={() => setExportOrderVisible(true)}>
                        导出自提点订单
                      </Button>
                    ) : null}
                  </Space>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={24}>
            <Divider />
          </Col>
          <Col span={24}>
            <Radio.Group
              value={orderType}
              name="orderStatus"
              onChange={e => onChange(setOrderType, e)}
            >
              <Radio.Button value={0}>全部订单</Radio.Button>
              <Radio.Button value={1}>待付款</Radio.Button>
              <Radio.Button value={3}>待提货</Radio.Button>
              <Radio.Button value={4}>已成功</Radio.Button>
              <Radio.Button value={5}>已取消</Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={24}>
            <TableList
              listData={listData}
              setListData={setListData}
              spinning={spinning}
              sourcePage={sourcePage}
              deliveryMode={deliveryMode}
              orderListApi={page => orderListApi(page)}
              setInstantVisible={setInstantVisible}
              setGoodsVisible={setGoodsVisible}
              setBizOrderId={setBizOrderId}
            />
          </Col>
        </Row>
      </PageHeader>
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
      {goodsVisible && (
        <GoodsShipments
          orderId={bizOrderId}
          visible={goodsVisible}
          setVisible={setGoodsVisible}
          type
          refresh={() => orderListApi(sourcePage.current)}
        />
      )}
      {/* 导出自提点订单 */}
      <ExportOrdersModal visible={exportOrderVisible} setVisible={setExportOrderVisible} />
    </Panel>
  );
}

export default OrderList;
