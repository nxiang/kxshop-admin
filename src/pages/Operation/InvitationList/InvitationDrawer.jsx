import React, { useState, useEffect } from 'react';
import { PageHeader, Form, Button, Table, Drawer, Modal } from 'antd';
import { DrawerFromSearch } from './formSearch';
import Columns from './columns';

import { inviteRecordList } from '@/services/activity';

export default props => {
  const { visible = false, activityId = '', setVisible = {} } = props;
  const [form] = Form.useForm();
  const [formData, serFormData] = useState({
    inviterNickname: undefined,
    inviteeNickname: undefined,
  });
  const [listData, setListData] = useState({});

  useEffect(() => {
    if (visible) {
      inviteRecordListApi();
    }
  }, [visible, formData]);

  const inviteRecordListApi = page => {
    inviteRecordList({
      ...formData,
      activityId: activityId,
      page: page ? page : 1,
      pageSize: 10,
    }).then(res => {
      if (res.success) {
        setListData(res.data);
      }
    });
  };

  return (
    <Drawer
      title="活动邀请记录"
      width={900}
      visible={visible}
      onClose={() => {
        setVisible(false);
        form.resetFields();
        serFormData({
          inviterNickname: undefined,
          inviteeNickname: undefined,
        });
      }}
    >
      <DrawerFromSearch
        formRef={form}
        handleSearch={newValue => serFormData(newValue)}
        onReset={() => {
          form.resetFields();
          serFormData({
            inviterNickname: undefined,
            inviteeNickname: undefined,
          });
        }}
      />
      <Table
        rowKey="recordId"
        dataSource={listData.rows}
        columns={Columns.DrawerScope()}
        pagination={{
          current: listData.current,
          pageSize: 10,
          total: listData.total,
          showSizeChanger: false,
          onChange: (page, pageSize) => inviteRecordListApi(page),
        }}
      />
    </Drawer>
  );
};
