import { Form, Modal, Select, DatePicker, Row, Space, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import moment from 'moment';

// 引入组件
import RegionSelect from '@/bizComponents/RegionSelect';

// 接入接口
import { listFactory, listDistribution, pickUpList } from '@/services/logistics';
import { communityDownload } from '@/services/order';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default ({ visible, setVisible }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [listFactoryShow, setListFactoryShow] = useState([]);
  const [listDistributionShow, setListDistributionShow] = useState([]);
  const [pickUpListShow, setPickUpListShow] = useState([]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setListFactoryShow([]);
      setListDistributionShow([]);
      setPickUpListShow([]);
      listFactoryApi();
      setLoading(false);
    }
  }, [visible]);

  const listFactoryApi = () => {
    listFactory().then(res => {
      if (res.success) {
        setListFactoryShow(res.data);
      }
    });
  };

  const listDistributionApi = factoryId => {
    form.setFieldsValue({
      distributionIds: [],
    });
    listDistribution({
      factoryId,
    }).then(res => {
      if (res.success) {
        setListDistributionShow(res.data);
      }
    });
  };

  const pickUpListApi = e => {
    form.setFieldsValue({
      pickUpIds: [],
    });
    pickUpList({
      addressProvince: e[0],
      addressCity: e[1],
      addressRegion: e[2],
      pageNo: 1,
      pageSize: 10000,
    }).then(res => {
      if (res.success) {
        setPickUpListShow(res.data.rows);
      }
    });
  };

  const regionChange = e => {
    pickUpListApi(e);
  };

  const onFinish = newValue => {
    let data = {
      factoryId: newValue.factoryId,
      distributionIds: newValue.distributionIds,
      pickUpIds: newValue.pickUpIds,
      orderStatus: newValue.orderStatus,
    };
    if (newValue.address) {
      data = {
        ...data,
        addressProvince: newValue.address[0],
        addressCity: newValue.address[1],
        addressRegion: newValue.address[2],
      };
    }
    if (newValue.payTime) {
      data = {
        ...data,
        beginTime: `${moment(newValue.payTime[0]).format('YYYY-MM-DD')} 00:00:00`,
        endTime: `${moment(newValue.payTime[1]).format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    setLoading(true);
    communityDownload(data)
      .then(res => {
        const blob = new Blob([res], {
          type: 'application/vnd.ms-excel;charset=UTF-8',
        });
        const downloadElement = document.createElement('a');
        const href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = `自提点订单列表.xls`;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
        setLoading(false);
        setVisible(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      title="导出自提点订单"
      width={400}
      footer={null}
      visible={visible}
      onCancel={() => {
        if (!loading) setVisible(false);
      }}
    >
      <p style={{ color: '#1890ff' }}>说明：仅支持导出社区团购订单类型</p>
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onFinish}>
        <Form.Item label="仓库" name="factoryId">
          <Select placeholder="请选择" onChange={e => listDistributionApi(e)}>
            {listFactoryShow?.length > 0 &&
              listFactoryShow.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.value}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item label="分销站" name="distributionIds">
          <Select mode="multiple" maxTagCount="responsive" placeholder="请选择">
            {listDistributionShow?.length > 0 &&
              listDistributionShow.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.value}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item label="自提点区域" name="address">
          <RegionSelect onChange={e => regionChange(e)} />
        </Form.Item>
        <Form.Item label="自提点名称" name="pickUpIds">
          <Select mode="multiple" maxTagCount="responsive" placeholder="请选择">
            {pickUpListShow?.length > 0 &&
              pickUpListShow.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item label="下单时间" name="payTime">
          <RangePicker />
        </Form.Item>
        <Form.Item label="订单状态" name="orderStatus" initialValue={3}>
          <Select placeholder="请选择">
            <Option value={0}>全部订单</Option>
            <Option value={1}>待付款</Option>
            <Option value={3}>待提货</Option>
            <Option value={4}>已成功</Option>
            <Option value={5}>已取消</Option>
          </Select>
        </Form.Item>
        <Row justify="end">
          <Space>
            <Button loading={loading} onClick={() => setVisible(false)}>
              取消
            </Button>
            <Button loading={loading} htmlType="submit" type="primary">
              确定
            </Button>
          </Space>
        </Row>
      </Form>
    </Modal>
  );
};
