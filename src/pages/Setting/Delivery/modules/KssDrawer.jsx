import React, { useState, useEffect } from 'react';
import Css from './KssDrawer.module.scss';
import moment from 'moment';
import { Drawer, Button, Form, Input, Table, DatePicker, Tabs, Popover } from 'antd';

// API
import { kssBalance, deliveryList, adjustList } from '@/services/shop';

const { Column } = Table;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

function KssDrawer(props) {
  const [modalForm] = Form.useForm();
  // 账户余额
  const [balance, setBalance] = useState('');
  // tab切换
  const [activeKey, setActiveKey] = useState('1');
  // 搜索条件
  const [searchData, setSearchData] = useState({
    orderId: '',
    beginTime: '',
    endTime: '',
  });
  // 配送列表数据
  const [deliveryListData, setDeliveryListData] = useState([]);
  // 配送列表页码
  const [deliverySourcePage, setDeliverySourcePage] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  // 储值列表数据
  const [adjustListData, setAdjustListData] = useState([]);
  // 储值列表页码
  const [adjustSourcePage, setAdjustSourcePage] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // 初始化
  useEffect(() => {
    if (props.visible) kssBalanceApi();
  }, [props.visible]);

  useEffect(() => {
    if (props.visible)
      if (activeKey == '1') {
        deliveryListApi();
      } else if (activeKey == '2') {
        adjustListApi();
      }
  }, [searchData, activeKey, props.visible]);

  // 账户余额请求
  const kssBalanceApi = () => {
    kssBalance().then(res => {
      if (res.success) {
        setBalance(res.data);
      }
    });
  };

  // 配送列表数据请求
  const deliveryListApi = page => {
    deliveryList({
      bizOrderId: searchData.orderId,
      beginTime: searchData.beginTime,
      endTime: searchData.endTime,
      page: page || 1,
    }).then(res => {
      if (res.success) {
        setDeliverySourcePage({
          current: res.data.current,
          pageSize: res.data.pageSize,
          total: res.data.total,
        });
        setDeliveryListData(res.data.rows);
      }
    });
  };

  // 配送列表数据请求
  const adjustListApi = page => {
    adjustList({
      adjustId: searchData.orderId,
      beginTime: searchData.beginTime,
      endTime: searchData.endTime,
      page: page || 1,
    }).then(res => {
      if (res.success) {
        setAdjustSourcePage({
          current: res.data.current,
          pageSize: res.data.pageSize,
          total: res.data.total,
        });
        setAdjustListData(res.data.rows);
      }
    });
  };

  // form提交
  const onFinish = values => {
    let data = {};
    if (values.time) {
      data = {
        ...data,
        beginTime: values.time[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time[1].format('YYYY-MM-DD HH:mm:ss'),
      };
    }
    data = {
      ...data,
      orderId: values.orderId,
    };
    setSearchData({
      ...searchData,
      ...data,
    });
  };

  // 配送列表状态转义
  const deliveryTypeState = type => {
    switch (type) {
      case 'CHARGE':
        return '用户充值';
      case 'ADJUST':
        return '手工调账';
      case 'TRADE':
        return '交易付款';
      case 'REFUND':
        return '交易退款';
    }
  };

  // 状态转义
  const adjustTypeState = type => {
    switch (type) {
      case 'CHARGE':
        return '用户充值增加';
      case 'DEDUCT':
        return '取消订单扣减';
      case 'REC_CHARGE':
        return '核账调整增加';
      case 'REC_DEDUCT':
        return '核账调整减少';
    }
  };

  return (
    <Drawer
      title="充值及明细"
      placement="right"
      width={860}
      visible={props.visible}
      onClose={props.cancel}
    >
      <div className={Css['drawer-box']}>
        <div className={Css['drawer-header-box']}>
          <div className={Css['pay-box']}>
            <p className={Css['pay-title']}>账号余额：</p>
            <p className={Css['pay-text']}>{Number(balance / 100).toFixed(2)}</p>
          </div>
          <Popover
            placement="topRight"
            title={'聚合配送充值'}
            content={'请联系客户经理完成充值'}
            trigger="click"
          >
            <Button type="primary">立即充值</Button>
          </Popover>
        </div>
        <Form form={modalForm} layout="inline" onFinish={onFinish}>
          <Form.Item name="time" label="时间范围">
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item name="orderId" label="订单编号">
            <Input type="text" placeholder="订单编号" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
        <Tabs
          activeKey={activeKey}
          size="default"
          onChange={e => {
            setSearchData({
              orderId: '',
              beginTime: '',
              endTime: '',
            });
            modalForm.setFieldsValue({
              time: undefined,
              orderId: undefined,
            });
            setActiveKey(e);
          }}
        >
          <TabPane tab="配送扣费" key="1">
            <Table
              dataSource={deliveryListData}
              rowKey={record => record.bizOrderId}
              pagination={{
                current: deliverySourcePage.current,
                pageSize: deliverySourcePage.pageSize,
                total: deliverySourcePage.total,
                onChange: page => deliveryListApi(page),
              }}
            >
              <Column title="订单编号" dataIndex="bizOrderId" />
              <Column title="配送单号" dataIndex="extOrderId" />
              <Column title="变动时间" dataIndex="gmtCreated" />
              <Column
                title="变动原因"
                dataIndex="type"
                render={record => deliveryTypeState(record)}
              />
              <Column
                title="变动金额"
                render={record => (
                  <div
                    style={{
                      color: Number(record.amount) < 0 ? '#f72633' : '#52c41a',
                    }}
                  >
                    {Number(record.amount / 100).toFixed(2)}
                  </div>
                )}
              />
            </Table>
          </TabPane>
          <TabPane tab="储值明细" key="2">
            <Table
              dataSource={adjustListData}
              rowKey={record => record.bizOrderId}
              pagination={{
                current: adjustSourcePage.current,
                pageSize: adjustSourcePage.pageSize,
                total: adjustSourcePage.total,
                onChange: page => adjustListApi(page),
              }}
            >
              <Column title="充值订单编号" dataIndex="adjustId" />
              <Column title="变动时间" dataIndex="gmtCreated" />
              <Column
                title="变动原因"
                dataIndex="type"
                render={record => adjustTypeState(record)}
              />
              <Column title="客户经理" dataIndex="customerManager" />
              <Column title="平台流水单号" dataIndex="extOrderId" />
              <Column title="备注" dataIndex="note" />
              <Column
                title="变动金额"
                render={record => (
                  <div
                    style={{
                      color: Number(record.amount) < 0 ? '#f72633' : '#52c41a',
                    }}
                  >
                    {Number(record.amount / 100).toFixed(2)}
                  </div>
                )}
              />
            </Table>
          </TabPane>
        </Tabs>
      </div>
    </Drawer>
  );
}

export default KssDrawer;
