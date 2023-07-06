import React, { useState } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  PageHeader,
  Row,
  Space,
  Table,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Panel from '@/components/Panel';
import { signInScope } from './columns';
import EditorRewardModal from './EditorRewardModal';

const { TextArea } = Input;

export default props => {
  const [form] = Form.useForm();
  const [listData, setListData] = useState([
    {
      day: 3,
      reward: 4,
    },
  ]);
  // 新增以及修改奖励弹框参数
  const [rewardVisible, setRewardVisible] = useState(false);
  const [rewardType, setRewardType] = useState('add');
  const [rewardData, setRewardData] = useState({
    day: 0,
    reward: 0,
  });

  // 打开编辑奖励弹框
  const editRewardShow = val => {
    setRewardType('edit');
    setRewardData(val);
    setRewardVisible(true);
  };

  // 修改列表
  const editReward = val => {
    let newListData = [...listData];
    if (rewardType == 'add') {
      if (newListData.length == 0) {
        newListData.push(val);
      }
      if (newListData.length > 0) {
        let repeatDay = false;
        let addIndex = 0;
        newListData.forEach((item, index) => {
          if (item.day == val.day) repeatDay = true;
          if (item.day < val.day) addIndex = index;
        });
        if (repeatDay) return message.warning('天数已重复');
        newListData.splice(addIndex + 1, 0, val);
      }
    }
    if (rewardType == 'edit') {
      newListData = newListData.map(item => {
        if (item.day == val.day) {
          return {
            ...item,
            reward: val.reward,
          };
        }
        return item;
      });
    }
    setListData([...newListData]);
    setRewardVisible(false);
  };

  const handleOk = newValue => {};

  return (
    <Panel>
      <PageHeader title="签到" style={{ background: '#fff' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form
              form={form}
              onFinish={val => handleOk(val)}
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 18 }}
            >
              <Form.Item label="日签奖励">
                <Space>
                  <Form.Item noStyle>
                    <InputNumber min={0} max={99999} precision={0} placeholder="请输入" />
                  </Form.Item>
                  积分
                </Space>
              </Form.Item>
              <Form.Item label="连签奖励">
                <Table
                  dataSource={listData}
                  rowKey="day"
                  columns={signInScope({ editRewardShow })}
                  pagination={false}
                />
                <Button
                  type="link"
                  size="small"
                  icon={<PlusOutlined />}
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    setRewardVisible(true);
                    setRewardType('add');
                  }}
                >
                  新增连签奖励
                </Button>
              </Form.Item>
              <Form.Item label="规则奖励">
                <TextArea
                  style={{ width: 400 }}
                  autoSize={{ minRows: 3, maxRows: 3 }}
                  placeholder="请输入签到规则说明，将会显示在签到页面"
                />
              </Form.Item>
            </Form>
          </Col>
          <Col span={24}>
            <Row justify="center">
              <Button type="primary">保存</Button>
            </Row>
          </Col>
        </Row>
      </PageHeader>
      <EditorRewardModal
        visible={rewardVisible}
        type={rewardType}
        data={rewardData}
        setVisible={setRewardVisible}
        onFinish={editReward}
      />
    </Panel>
  );
};
