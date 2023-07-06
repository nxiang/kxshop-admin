import React from 'react';
import { Space } from 'antd';
import { showBut } from '@/utils/utils';

const ListScope = props => {
  const { delLevel, configLevel } = props;

  const operationDom = record => {
    return (
      <Space>
        {showBut('users_levelList', 'users_level_set') && (
          <a onClick={() => configLevel(record.gradeId)}>配置</a>
        )}
        {record?.type == 1 && showBut('users_levelList', 'users_level_del') && (
          <a style={{ color: '#ff4d4f' }} onClick={() => delLevel(record.gradeId)}>
            删除
          </a>
        )}
      </Space>
    );
  };

  return [
    { title: '会员等级名称', dataIndex: 'gradeName' },
    { title: '成长值', dataIndex: 'exp' },
    { title: '会员数', dataIndex: 'memberQuantity' },
    { title: '权益内容', dataIndex: 'rightsContent' },
    { title: '操作', width: 100, render: operationDom },
  ];
};

export default { ListScope };
