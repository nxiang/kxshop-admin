import React, { useEffect, useState } from 'react';
import { Card, Table } from 'antd';
import AdvanceSearch from './advanceSearch';

import { memberPointsRecordList } from '@/services/queryUser';

// 分类
const typeData = [{ label: '积分收入', value: 1 }, { label: '积分支出', value: 2 }];

// 事件类型
const eventTypeData = [
  { label: '积分权益赠送', value: 'ORDER_EXTRA' },
  { label: '订单退款', value: 'ORDER_REFUND' },
  { label: '等级礼包', value: 'GRADE_PRESENT' },
  { label: '过期', value: 'EXPIRE' },
  { label: '积分兑换', value: 'EXCHANGE' },
  { label: '积分回退', value: 'EXCHANGE_ROLLBACK' },
  { label: '每日签到', value: 'DAY_SIGN_IN' },
  { label: '连续签到奖励', value: 'CONTINUOUS_SIGN_IN' },
  { label: '绿色能量积分', value: 'GREEN_ENERGY' },
  { label: '积分入会转移', value: 'JOIN_MEMBER_TRANSFER' },
  { label: '加入会员', value: 'JOIN_VIP' },
  { label: '下单得积分', value: 'ORDER' },
  { label: '收藏小程序', value: 'FAVORITE_APPLET' },
  { label: '加入粉丝群', value: 'JOIN_FANS_GROUP' },
  { label: '评论得积分', value: 'COMMENT' },
  { label: '每日首单', value: 'FIST_ORDER_OF_DAY' },
  { label: '每日首单退款', value: 'FIST_ORDER_OF_DAY_BACK' },
];

const integralRecord = ({ memberId }) => {
  const [listData, setListData] = useState(undefined);
  const [listLoading, setListLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    if (memberId) handleSearch(1);
  }, [memberId]);

  const handleSearch = (newPagination, params) => {
    setListLoading(true);
    memberPointsRecordList({
      memberId,
      type: params?.type || 0,
      eventType: params?.eventType || '',
      beginDate: params?.time ? params?.time[0] : '',
      endDate: params?.time ? params?.time[1] : '',
      page: newPagination || currentPage,
      pageSize: pageSize,
    }).then(res => {
      setListLoading(false);
      if (res.errorCode === '0') {
        setCurrentPage(newPagination);
        res.data.rows.forEach(i => {
          i.typeText = i.type == 1 ? '收入' : i.type == 2 ? '支出' : '';
          eventTypeData.forEach(c => {
            if (i.eventType == c.value) {
              i.eventTypeText = c.label;
            }
          });
          i.clientIdText = i.clientId == 1 ? '支付宝' : '微信';
        });
        setListData(res.data);
      }
    });
  };

  const columns = [
    { title: '分类', dataIndex: 'typeText', fixed: 'left' },
    // { title: '订单号', dataIndex: 'recordId' },
    { title: '积分', dataIndex: 'points' },
    { title: '类型', dataIndex: 'eventTypeText' },
    { title: '关联活动', dataIndex: 'eventDesc' },
    { title: '渠道', dataIndex: 'clientIdText' },
    { title: '操作时间', dataIndex: 'opTime', fixed: 'right' },
  ];

  return (
    <Card title="积分记录">
      <AdvanceSearch typeData={typeData} eventTypeData={eventTypeData} onSearch={handleSearch} />
      <Table
        rowKey="recordId"
        bordered
        loading={listLoading}
        scroll={{ x: 1280 }}
        columns={columns}
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
    </Card>
  );
};

export default integralRecord;
