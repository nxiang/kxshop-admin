import React, { useMemo } from 'react';
import { Form, Select, Input, Button, Row, Col, Space, DatePicker } from 'antd';
import RegionSelect from '@/bizComponents/RegionSelect';

const { Option } = Select;
const { RangePicker } = DatePicker;

const FormSearch = ({ formRef, handleSearch, onReset, pickStatus }) =>
  useMemo(() => {
    return (
      <Form form={formRef} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={handleSearch}>
        <Row gutter={[12, 12]}>
          <Col span={8}>
            <Form.Item label="团长姓名" name="majorName">
              <Input placeholder="请输入" maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="自提点区域" name="provice">
              <RegionSelect />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="自提点地址" name="addressDetail">
              <Input placeholder="请输入" maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="创建时间" name="createTime">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="自提点名称" name="name">
              <Input placeholder="请输入" maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="团长手机号"
              name="majorPhone"
              rules={[
                {
                  required: false,
                  pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                  message: '请输入正确的手机号',
                },
              ]}
            >
              <Input maxLength={11} placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="状态" name="isEnable" initialValue={null}>
              <Select placeholder="请输入">
                <Option key={null} value={null}>
                  全部
                </Option>
                {pickStatus?.length &&
                  pickStatus.map(item => {
                    return (
                      <Option key={item.key} value={item.key}>
                        {item.value}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="创建人" name="creatorName">
              <Input placeholder="请输入" maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="配送站" name="distributionName">
              <Input placeholder="请输入" maxLength={30} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="自提点ID"
              name="id"
              rules={[
                {
                  required: false,
                  pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                  message: '请输入正确的ID',
                },
              ]}
            >
              <Input placeholder="请输入" maxLength={24} />
            </Form.Item>
          </Col>
          <Col span={22} offset={2}>
            <Form.Item>
              <Space>
                <Button htmlType="submit" type="primary">
                  查询
                </Button>
                <Button onClick={onReset}>重置</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }, [pickStatus]);

export default FormSearch;
