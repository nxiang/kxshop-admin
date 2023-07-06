import react, { useState, useEffect } from 'react';
import { history } from '@umijs/max';
import moment from 'moment';
import Panel from '@/components/Panel';
import { FromSearch } from './formSearch';
import { PageHeader, Form, Button, Table, Drawer, Modal, message } from 'antd';
import Columns from './columns';
import InvitationDrawer from './InvitationDrawer';
import LotteryDrawer from './LotteryDrawer';

import { inviteActivityList, actDelete, actTerminate } from '@/services/activity';

const { confirm } = Modal;

export default () => {
  const [form] = Form.useForm();
  // 搜索条件数组
  const [fromData, setFormData] = useState({
    activityName: undefined,
    beginTime: undefined,
    endTime: undefined,
    status: undefined,
  });
  // 展示列表数组
  const [listData, setListData] = useState({});

  // 活动邀请记录相关
  const [invitationId, setInvitationId] = useState('');
  const [invitationVisible, setInvitationVisible] = useState(false);

  // 活动抽奖记录相关
  const [lotteryId, setLotteryId] = useState('');
  const [lotteryVisible, setLotteryVisible] = useState(false);

  useEffect(() => {
    inviteActivityListApi();
  }, [fromData]);

  const inviteActivityListApi = page => {
    inviteActivityList({
      ...fromData,
      pageSize: 10,
      page: page ? page : 1,
    }).then(res => {
      if (res.success) {
        if (JSON.stringify(res.data.rows) == '[]' && page > 1) {
          inviteActivityListApi(page - 1);
        } else {
          setListData(res.data);
        }
      }
    });
  };

  // 新建活动
  const addInvitation = () => {
    history.push('/operation/addInvitation');
  };

  const handleSearch = newValue => {
    setFormData({
      activityName: newValue.activityName,
      beginTime: newValue.activityTime
        ? moment(newValue.activityTime[0]).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      endTime: newValue.activityTime
        ? moment(newValue.activityTime[1]).format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      status: newValue.status,
    });
  };

  const onReset = () => {
    form.resetFields();
    setFormData({
      activityName: undefined,
      beginTime: undefined,
      endTime: undefined,
      status: undefined,
    });
  };

  // 跳转详情
  const detailSkip = id => {
    history.push(`/operation/invitationDetail?activityId=${id}`);
  };

  // 打开邀请记录弹框
  const showDrawer = id => {
    setInvitationId(id);
    setInvitationVisible(true);
  };

  // 打开邀请记录弹框
  const showLotteryDrawer = id => {
    setLotteryId(id);
    setLotteryVisible(true);
  };

  // 终止活动
  const terminationActivity = record => {
    confirm({
      title: '终止活动',
      content: `确定终止【${record.activityName}】活动吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        actTerminate({
          activityId: record.activityId,
        }).then(res => {
          if (res.success) {
            message.success(`【${record.activityName}】终止成功`);
            inviteActivityListApi(listData.current);
          }
        });
      },
    });
  };

  // 删除活动
  const delActivity = record => {
    confirm({
      title: '删除活动',
      content: `确定删除【${record.activityName}】活动吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        actDelete({
          activityId: record.activityId,
        }).then(res => {
          if (res.success) {
            message.success(`【${record.activityName}】删除成功`);
            inviteActivityListApi(listData.current);
          }
        });
      },
    });
  };

  return (
    <Panel title="邀请有礼" content="邀请好友注册成功获得对应奖励">
      <PageHeader
        style={{ background: '#fff' }}
        title="活动列表"
        extra={[
          <Button type="primary" key="1" onClick={addInvitation}>
            新建活动
          </Button>,
        ]}
      >
        <FromSearch
          formRef={form}
          handleSearch={newValue => handleSearch(newValue)}
          onReset={() => onReset()}
        />
        <Table
          rowKey="activityId"
          dataSource={listData.rows}
          columns={Columns.InvitationListScope({
            detailSkip,
            showDrawer,
            lotteryDrawer: showLotteryDrawer,
            terminationActivity,
            delActivity,
          })}
          pagination={{
            current: listData.current,
            pageSize: 10,
            total: listData.total,
            showSizeChanger: false,
            onChange: (page, pageSize) => inviteActivityListApi(page),
          }}
        />
      </PageHeader>
      <InvitationDrawer
        visible={invitationVisible}
        setVisible={setInvitationVisible}
        activityId={invitationId}
      />
      <LotteryDrawer
        visible={lotteryVisible}
        setVisible={setLotteryVisible}
        activityId={lotteryId}
      />
    </Panel>
  );
};
