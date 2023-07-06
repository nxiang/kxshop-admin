import React, { useEffect, useState } from 'react';
import { history } from '@umijs/max';
import { Table, Row, Col, Modal, message, Descriptions, Select, Input, PageHeader } from 'antd';
import { removeEmptyField } from '@/utils/utils';
import Panel from '@/components/Panel';
import columns from './columns';
import AdvanceSearch from './advanceSearch';
import ExportPop from './modules/ExportPop/ExportPop';

import { orderList, orderSend, orderSendConfirm } from '@/services/order';
import { classOption } from '@/services/itemClass';

const { Option } = Select;

const PointManageList = () => {
  const [listData, setListData] = useState(undefined);
  const [listLoading, setListLoading] = useState(false);
  const [searchData, setSearchData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [classInfo, setClassInfo] = useState([]);

  const [sendVisible, setSendVisible] = useState(false);
  const [curData, setCurData] = useState(undefined);
  const [logisticsData, setLogisticsData] = useState([]);
  const [shipId, setShipId] = useState(undefined);
  const [shipNo, setShipNo] = useState(undefined);
  // 导出弹框
  const [exportSearchData, setExportSearchData] = useState({});
  const [exportPointVisible, setExportPointVisible] = useState(false);

  useEffect(() => {
    classOptionApi();
  }, []);

  useEffect(() => {
    handleSearch(1);
  }, [searchData]);

  const classOptionApi = () => {
    classOption({
      itemType: 1,
    }).then(res => {
      if (res.success) {
        setClassInfo(res.data);
      }
    });
  };

  // 订单手上
  const handleSearch = newPagination => {
    setListLoading(true);
    const data = {
      ...searchData,
      page: newPagination || currentPage,
      pageSize,
      bizType: 3,
    };
    orderList(data).then(res => {
      setListLoading(false);
      if (res.errorCode === '0') {
        setCurrentPage(newPagination);
        res.data.rows.forEach(i => {
          i.deliveryWayText =
            i.deliveryWay == 0
              ? '未发货'
              : i.deliveryWay == 1
              ? '普通物流'
              : i.deliveryWay == 2
              ? '商家自配'
              : '三方配送';
          i.receive =
            i.deliveryType == 0 ? '' : `${i.receiveName}-${i.receivePhone}-${i.receiveAddress}`;
          i.orderStatusText =
            i.orderStatus == 0
              ? '不可见'
              : i.orderStatus == 1
              ? '已创建'
              : i.orderStatus == 2
              ? '待发货'
              : i.orderStatus == 3
              ? '已发货'
              : i.orderStatus == 4
              ? '交易成功'
              : i.orderStatus == 5
              ? '交易关闭'
              : '已评价';
        });
        setListData(res.data);
      }
    });
  };

  const shipNoChange = e => {
    setShipNo(e.target.value);
  };

  const getOrderSend = bizOrderId => {
    orderSend({ bizOrderId }).then(res => {
      if (res.errorCode == '0') {
        setLogisticsData(res.data.shiCompanyList);
      }
    });
  };

  const handleSendModal = data => {
    if (data) {
      if (sendVisible) {
        if (curData?.orderStatus != 2) return setSendVisible(false);
        if (!shipId || !shipNo) return message.error('请完善物流信息');
        orderSendConfirm({
          shipId,
          shipNo,
          bizOrderId: curData.bizOrderId,
          deliveryWay: 1,
        }).then(res => {
          if (res.errorCode == '0') {
            setSendVisible(false);
            setShipId(undefined);
            setShipNo(undefined);
            message.success('发货成功');
            handleSearch(1);
          }
        });
      } else {
        console.log(shipId);
        setSendVisible(true);
        setCurData(data);
        setShipId(null);
        getOrderSend(data.bizOrderId);
      }
    }
  };

  const handleLogistics = e => {
    setShipId(e);
  };

  const exportPointOrder = val => {
    console.log(val)
    if (!val) return;
    setExportSearchData(val)
    // 过滤空值
    const newValue = removeEmptyField(val);
    console.log(newValue);
    // 判断是否选中值
    if (Object.getOwnPropertyNames(newValue).length < 1)
      return message.warning('请选择至少一个筛选项');
    setExportPointVisible(true);
  };

  return (
    <Panel title="积分订单" content="积分兑换订单信息的查看和操作">
      <PageHeader style={{ background: '#fff' }}>
        <Row justify="space-between">
          <Col span={20}>
            <AdvanceSearch
              classInfo={classInfo}
              onSearch={val => {
                setSearchData(val);
              }}
              exportPointOrder={val => exportPointOrder(val)}
              exprotPointOrderSkip={() => history.push(`/order/pointOrderList/PointOrderRecord`)}
            />
          </Col>
        </Row>
        <Table
          rowKey="bizOrderId"
          bordered
          loading={listLoading}
          scroll={{ x: 1360 }}
          columns={columns({ handleSendModal })}
          dataSource={listData?.rows}
          pagination={{
            current: currentPage,
            pageSize,
            total: listData?.total,
            showTotal: total => `共${total}条数据`,
            showSizeChanger: false,
          }}
          onChange={pagination => {
            handleSearch(pagination.current);
          }}
        />
      </PageHeader>
      {/*  查看 / 发货 */}
      <Modal
        title={curData?.orderStatus == 2 ? '发货' : curData?.orderStatus == 3 ? '发货详情' : '查看'}
        visible={sendVisible}
        onOk={handleSendModal}
        onCancel={() => {
          setSendVisible(false);
          setShipId(undefined);
          setShipNo(undefined);
        }}
        closable={false}
        keyboard={false}
        maskClosable={false}
      >
        <Descriptions column={1}>
          <Descriptions.Item label="订单编号">{curData?.bizOrderId}</Descriptions.Item>
          {curData?.deliveryType == 1 && (
            <Descriptions.Item label="收货信息">{curData?.receive}</Descriptions.Item>
          )}
          {curData?.deliveryType == 0 ? (
            <Descriptions.Item label="物流信息">无需发货</Descriptions.Item>
          ) : (
            <Descriptions.Item label="物流信息">
              {curData?.orderStatus == 2 ? (
                <Row align="middle" justify="start" gutter={[16, 0]}>
                  <Col>
                    <Select
                      style={{ width: 120 }}
                      onChange={handleLogistics}
                      placeholder="请选择物流"
                      value={shipId}
                    >
                      {logisticsData.map((item, index) => (
                        <Option value={item.shipId} key={`logistics-${index}`}>
                          {item.shipName}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col>
                    <Input
                      value={shipNo}
                      onChange={shipNoChange}
                      onKeyUp={event => {
                        event.target.value = event.target.value.replace(/[\W]/g, '');
                      }}
                      placeholder="请输入单号"
                      style={{ width: 120 }}
                    />
                  </Col>
                </Row>
              ) : (
                <span>
                  {curData?.shipName}
                  {`  `}
                  {curData?.shipNo}
                </span>
              )}
            </Descriptions.Item>
          )}
          {(curData?.orderStatus == 3 || curData?.orderStatus == 4) &&
            curData?.deliveryType == 1 && (
              <Descriptions.Item label="发货时间">{curData?.sendTime}</Descriptions.Item>
            )}
          {curData?.orderStatus == 4 && (
            <Descriptions.Item label="完成时间">{curData?.endTime}</Descriptions.Item>
          )}
        </Descriptions>
        {curData?.orderStatus == 2 && (
          <p style={{ color: '#999' }}>
            *请谨慎填写发货信息，确认发货后，如用户未确认收货，系统14天默认收货。
          </p>
        )}
      </Modal>
      <ExportPop
        visible={exportPointVisible}
        onCancel={() => setExportPointVisible(false)}
        searchData={exportSearchData}
        classInfo={classInfo}
      />
    </Panel>
  );
};

export default PointManageList;
