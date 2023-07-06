import React from 'react';
import { Button, Space } from 'antd';

const signInScope = ({ editRewardShow }) => {
  const operation = record => {
    return (
      <Space>
        <Button type="link" size="small" onClick={() => editRewardShow(record)}>
          编辑
        </Button>
        <Button type="link" size="small">
          删除
        </Button>
      </Space>
    );
  };

  const data = [
    {
      title: '连续签到天数',
      dataIndex: 'day',
    },
    {
      title: '奖励',
      dataIndex: 'reward',
    },
    {
      title: '操作',
      width: 140,
      render: operation,
    },
  ];

  return data;
};

export { signInScope };
