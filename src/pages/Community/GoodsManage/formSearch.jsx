import React from 'react';
import { Button, Form, Input, Select, Space } from 'antd';

const { Option } = Select;

const formSearch = ({ formRef, handleSearch, onReset }) => {
  return (
    <Form form={formRef} layout="inline" onFinish={handleSearch}>
      <Form.Item name="itemName" label="商品名称">
        <Input placeholder="请输入" maxLength={11} />
      </Form.Item>
      <Form.Item name="itemId" label="商品ID">
        <Input placeholder="请输入" maxLength={11} />
      </Form.Item>
      <Form.Item name="state" label="社区团购状态">
        <Select allowClear defaultValue="" style={{ width: 100 }} placeholder="请选择">
          <Option value="">全部</Option>
          <Option value="0">已下架</Option>
          <Option value="1">出售中</Option>
          <Option value="2">已售罄</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Space>
          <Button htmlType="submit" type="primary">
            筛选
          </Button>
          <Button onClick={onReset}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default formSearch;
