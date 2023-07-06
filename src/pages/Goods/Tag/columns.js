import React from 'react';
import { Space } from 'antd';
const TagScope = ({ itemEdit, itemDelete }) => {
  const operation = record => {
    return (
      <Space>
        <a style={{ color: 'orange' }} onClick={() => itemEdit(record)}>
          编辑
        </a>
        <a style={{ color: 'orange' }} onClick={() => itemDelete(record)}>
          删除
        </a>
      </Space>
    );
  };
  return [
    { title: '商品标签名称', dataIndex: 'itemCode' },
    { title: '标签绑定商品数', dataIndex: 'itemCode' },
    { title: '创建时间', dataIndex: 'itemCode' },
    { title: '操作', dataIndex: 'itemCode', render: operation },
  ];
};
export default TagScope;
