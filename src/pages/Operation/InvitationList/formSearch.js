import { Form, Input, Select, Space, Button, DatePicker } from 'antd';
import React from 'react';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FromSearch = ({ formRef, handleSearch = {}, onReset = {} }) => {
  return (
    <Form form={formRef} layout="inline" onFinish={handleSearch}>
      <Form.Item label="活动名称" name="activityName">
        <Input placeholder="搜索活动名称" />
      </Form.Item>
      <Form.Item name="status" label="活动状态">
        <Select placeholder="选择活动状态" style={{ width: 140, marginBottom: 10 }}>
          <Option key={1}>未开始</Option>
          <Option key={2}>进行中</Option>
          <Option key={3}>已结束</Option>
          <Option key={5}>已终止</Option>
        </Select>
      </Form.Item>
      <Form.Item name="activityTime" label="活动时间">
        <RangePicker showTime />
      </Form.Item>
      <Space>
        <Button type="primary" htmlType="submit" style={{ marginBottom: 10 }}>
          搜索
        </Button>
        <Button htmlType="button" onClick={onReset} style={{ marginBottom: 10 }}>
          重置
        </Button>
      </Space>
    </Form>
  );
};

const DrawerFromSearch = ({ formRef, handleSearch = {}, onReset = {} }) => {
  return (
    <Form form={formRef} layout="inline" onFinish={handleSearch}>
      <Form.Item label="邀请人" name="inviterNickname">
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item label="被邀请人" name="inviteeNickname">
        <Input placeholder="请输入" />
      </Form.Item>
      <Space>
        <Button type="primary" htmlType="submit" style={{ marginBottom: 10 }}>
          搜索
        </Button>
        <Button htmlType="button" onClick={onReset} style={{ marginBottom: 10 }}>
          重置
        </Button>
      </Space>
    </Form>
  );
};

const LotteryFromSearch = ({ formRef, handleSearch = {}, onReset = {} }) => {
  return (
    <Form form={formRef} layout="inline" onFinish={handleSearch}>
      <Form.Item label="中奖状态" name="isWin">
        <Select style={{ width: 140 }} placeholder="中奖状态">
          <Option key={0}>未中奖</Option>
          <Option key={1}>已中奖</Option>
        </Select>
      </Form.Item>
      <Form.Item label="中奖人昵称" name="keyword">
        <Input placeholder="请输入" />
      </Form.Item>
      <Space>
        <Button type="primary" htmlType="submit" style={{ marginBottom: 10 }}>
          搜索
        </Button>
        <Button htmlType="button" onClick={onReset} style={{ marginBottom: 10 }}>
          重置
        </Button>
      </Space>
    </Form>
  );
};

export { FromSearch, DrawerFromSearch, LotteryFromSearch };
