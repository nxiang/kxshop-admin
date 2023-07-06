import React, { useEffect, useState } from 'react';
import {
  Form,
  Modal,
  Table,
  Input,
  Alert,
  Row,
  Col,
  Space,
  Button,
  Typography,
  message,
} from 'antd';
import { MerchantsRefundColumn } from './columns';
import { getOrderRefundInitiativeInfo, refundInitiativeInfo } from '@/services/order';

const { TextArea } = Input;
const { Text } = Typography;

export default ({ visible = false, bizOrderId = 0, selectedId = 0, onClose, onSubmint }) => {
  const [form] = Form.useForm();
  const refundAmount = Form.useWatch('refundAmount', form);
  // cosnt;
  const [listData, setListData] = useState([]);

  // 初始化
  useEffect(() => {
    if (selectedId > 0) {
      initData();
    }
  }, [visible]);

  // 初始化数据
  const initData = () => {
    getOrderRefundInitiativeInfo({
      bizOrderId,
      subBizOrderId: selectedId,
    }).then(res => {
      if (res?.success) {
        setListData([
          {
            ...res.data,
            canInitiativeAmount: res.data?.canInitiativeAmount / 100 || 0,
          },
        ]);
      }
    });
  };

  // 提交主动退款
  const onFinish = val => {
    if (val.refundAmount[0] <= 0) return message.warning('主动退款金额不能小于等于0');
    if (listData[0].canInitiativeAmount < val.refundAmount[0])
      return message.warning('主动退款金额异常');
    refundInitiativeInfo({
      bizOrderId,
      subOrderId: selectedId,
      refundAmount: val.refundAmount[0],
      sellerMessage: val.sellerMessage,
    }).then(res => {
      if (res?.success) {
        message.success('主动退款成功');
        onSubmint();
      }
    });
  };

  return (
    <Modal
      title="主动退款"
      width={600}
      visible={visible}
      footer={false}
      onCancel={() => onClose()}
      destroyOnClose
    >
      <Form form={form} preserve={false} onFinish={val => onFinish(val)}>
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Alert
              message="主动退款作为售后业务的补充功能，请确认实际情况后再进行操作。"
              type="warning"
            />
          </Col>
          <Col span={24}>
            <Form.Item>
              <Table columns={MerchantsRefundColumn()} dataSource={listData} pagination={false} />
            </Form.Item>
            <Form.Item label="结算方式">原路退回</Form.Item>
            <Form.Item label="退款说明" name="sellerMessage">
              <TextArea
                autoSize={{ minRows: 3, maxRows: 3 }}
                placeholder="选填，最多200个字符"
                maxLength={200}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Row justify="end">
              <Space>
                <Text>
                  退款金额:
                  <Text type="danger" strong>
                    ￥{refundAmount && refundAmount.length === 1 ? refundAmount[0] : null}
                  </Text>
                </Text>
                <Button type="primary" htmlType="submit">
                  确认退款
                </Button>
              </Space>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
