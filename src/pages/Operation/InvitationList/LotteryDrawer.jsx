import React, { useState, useEffect } from 'react';
import { PageHeader, Form, Button, Table, Drawer, Modal } from 'antd';
import { LotteryFromSearch } from './formSearch';
import Columns from './columns';

import { lotteryList } from '@/services/activity';

export default props => {
  const { visible = false, activityId = '', setVisible = {} } = props;
  const [form] = Form.useForm();
  const [formData, serFormData] = useState({
    isWin: undefined,
    keyword: undefined,
  });
  const [listData, setListData] = useState({});

  useEffect(() => {
    if (visible) {
      lotteryListApi();
    }
  }, [visible, formData]);

  const lotteryListApi = page => {
    lotteryList({
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
      title="活动抽奖记录"
      width={900}
      visible={visible}
      onClose={() => {
        setVisible(false);
        form.resetFields();
        serFormData({
          isWin: undefined,
          keyword: undefined,
        });
      }}
    >
      <LotteryFromSearch
        formRef={form}
        handleSearch={newValue => serFormData(newValue)}
        onReset={() => {
          form.resetFields();
          serFormData({
            isWin: undefined,
            keyword: undefined,
          });
        }}
      />
      <Table rowKey="recordId" dataSource={listData.rows} columns={Columns.LotteryScope()} />
    </Drawer>
  );
};
