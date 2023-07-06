import { Space } from 'antd';
import React from 'react';
import { showBut } from '@/utils/utils'

const InvitationListScope = props => {
  const { detailSkip, showDrawer, lotteryDrawer, terminationActivity, delActivity } = props;

  const activityType = record => {
    return {
      1: '未开始',
      2: '进行中',
      3: '已结束',
      5: '已终止',
    }[record];
  };

  const operation = record => {
    return (
      <Space>
        { showBut('invitationList', 'invitation_list_detail') && ( 
        <a style={{ color: '#1890FF' }} onClick={() => detailSkip(record.activityId)}>
          详情
        </a>) }
        { showBut('invitationList', 'invitation_list_record') && (
          <a style={{ color: '#1890FF' }} onClick={() => showDrawer(record.activityId)}>
            邀请记录
          </a>) }
        {
          showBut('invitationList', 'lottery_record') && (
            <a style={{ color: '#1890FF' }} onClick={() => lotteryDrawer(record.activityId)}>
              抽奖记录
            </a>
          )
        }
        {record.status == 2 && showBut('invitationList', 'invitation_list_termination') && (
          <a style={{ color: 'red' }} onClick={() => terminationActivity(record)}>
            终止
          </a>
        )}
        {record.status == 1 && showBut('invitationList', 'invitation_list_del') && (
          <a style={{ color: 'red' }} onClick={() => delActivity(record)}>
            删除
          </a>
        )}
      </Space>
    );
  };

  return [
    { title: '活动ID', dataIndex: 'activityId', align: 'center' },
    { title: '活动名称', dataIndex: 'activityName', align: 'center' },
    { title: '活动状态', dataIndex: 'status', align: 'center', render: activityType },
    { title: '创建时间', dataIndex: 'createTime', align: 'center' },
    {
      title: '活动时间',
      align: 'center',
      render: record => (
        <p>
          {record.beginTime} 至 {record.endTime}
        </p>
      ),
    },
    // { title: '参与人数', dataIndex: 'kaName', align: 'center' },
    { title: '操作', width: 240, align: 'center', render: operation },
  ];
};

const DrawerScope = props => {
  const clientId = record => {
    return { 1: '支付宝', 2: '微信' }[record];
  };

  return [
    { title: '邀请人', dataIndex: 'inviterNickname', align: 'center' },
    { title: '邀请渠道', dataIndex: 'clientId', align: 'center', render: clientId },
    { title: '被邀请人', dataIndex: 'inviteeNickname', align: 'center' },
    { title: '奖励项目', dataIndex: 'inviterAwardContent', align: 'center' },
    { title: '被邀请奖励项目', dataIndex: 'inviteeAwardContent', align: 'center' },
    { title: '注册时间', dataIndex: 'registerTime', align: 'center' },
  ];
};

const LotteryScope = props => {
  const activityIsWin = record => {
    return {
      0: '未中奖',
      1: '已中奖',
    }[record];
  };

  return [
    { title: '记录编号', dataIndex: 'recordId', align: 'center' },
    { title: '昵称', dataIndex: 'memberName', align: 'center' },
    { title: '手机号', dataIndex: 'memberMobile', align: 'center' },
    { title: '中奖状态', dataIndex: 'isWin', align: 'center', render: activityIsWin },
    { title: '奖项名称', dataIndex: 'prizeConfName', align: 'center' },
    { title: '抽奖时间', dataIndex: 'createTime', align: 'center' },
  ];
};

export default {
  InvitationListScope,
  DrawerScope,
  LotteryScope,
};
