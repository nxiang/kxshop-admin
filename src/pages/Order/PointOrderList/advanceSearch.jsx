import React, { useEffect, useState } from 'react';
import { Row, Col, Radio, Input, Button, DatePicker, Select, Form, Space } from 'antd';
import { integralOrderStatus } from '@/utils/baseData';

const { Option } = Select;
const { RangePicker } = DatePicker;

const AdvanceSearch = ({ classInfo, onSearch, exportPointOrder, exprotPointOrderSkip }) => {
  const [form] = Form.useForm();
  const orderStatus = Form.useWatch('orderStatus', form);
  // 搜索记录
  const [searchData, setSearchData] = useState({});
  // 初始化判断阀门
  const [initRecord, setInitRecord] = useState(false);

  // 订单状态变化时，执行搜索
  useEffect(() => {
    // 防止初始化时执行请求
    if (initRecord) {
      onSearch({
        ...searchData,
        orderStatus,
      });
    } else {
      setInitRecord(true);
    }
  }, [orderStatus]);

  // 筛选
  const onFinish = value => {
    const data = {
      ...value,
    };
    // 下单时间
    if (value?.ordertime) {
      data.ordertime = undefined;
      data.createOrderStartTime = value.ordertime[0].format('YYYY-MM-DD HH:mm:ss');
      data.createOrderEndTime = value.ordertime[1].format('YYYY-MM-DD HH:mm:ss');
    }
    // 发货时间
    if (value?.sendtime) {
      data.sendtime = undefined;
      data.sendStartTime = value.sendtime[0].format('YYYY-MM-DD HH:mm:ss');
      data.sendEndTime = value.sendtime[1].format('YYYY-MM-DD HH:mm:ss');
    }
    // 记录搜索状态
    setSearchData(data);
    // 开始搜索
    onSearch(data);
  };

  // 重置
  const onReset = () => {
    if (!orderStatus) onSearch({});
    setSearchData({});
    form.resetFields();
  };

  // 导出数据
  const exportOrder = () => {
    const value = form.getFieldsValue();
    const data = {
      ...value,
    };
    // 下单时间
    if (value?.ordertime) {
      data.ordertime = undefined;
      data.createOrderStartTime = value.ordertime[0].format('YYYY-MM-DD HH:mm:ss');
      data.createOrderEndTime = value.ordertime[1].format('YYYY-MM-DD HH:mm:ss');
    }
    // 发货时间
    if (value?.sendtime) {
      data.sendtime = undefined;
      data.sendStartTime = value.sendtime[0].format('YYYY-MM-DD HH:mm:ss');
      data.sendEndTime = value.sendtime[1].format('YYYY-MM-DD HH:mm:ss');
    }
    exportPointOrder(data);
  };

  return (
    <Form form={form} onFinish={val => onFinish(val)}>
      <Row style={{ marginBottom: 24 }} gutter={[0, 16]}>
        <Col span={24}>
          <Row wrap gutter={[16, 16]} justify="start">
            <Col span={7}>
              <Form.Item name="classId">
                <Select style={{ width: '100%' }} placeholder="全部订单类型" allowClear>
                  {classInfo?.length > 0 &&
                    classInfo.map(item => {
                      return (
                        <Option value={item.classId} key={item.classId}>
                          {item.className}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="bizOrderId">
                <Input placeholder="请输入订单编号" allowClear />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="下单时间" name="ordertime">
                <RangePicker showTime style={{ width: '100%' }} allowClear />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="发货时间" name="sendtime">
                <RangePicker showTime style={{ width: '100%' }} allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="buyerPhone">
                <Input placeholder="请输入收货人手机号" allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Space>
            <Button htmlType="submit" type="primary">
              筛选
            </Button>
            <Button onClick={() => onReset()}>重置</Button>
            <Button onClick={() => exportOrder()}>导出</Button>
            <Button onClick={() => exprotPointOrderSkip()}>导出记录</Button>
          </Space>
        </Col>
        <Col span={24}>
          <Form.Item name="orderStatus">
            <Radio.Group>
              <Radio.Button value={undefined}>全部</Radio.Button>
              {integralOrderStatus.map((item, index) => (
                <Radio.Button value={item.value} key={`orderStateData-${index}`}>
                  {item.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AdvanceSearch;
