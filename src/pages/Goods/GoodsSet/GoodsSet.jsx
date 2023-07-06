import React, { useEffect, useState } from 'react';
import Panel from '@/components/Panel';
import { Card, Table, Row, Col, Button, Modal, message, Form, Switch, Input, Space } from 'antd';
import Css from './GoodsSet.module.scss';
import SelectGather from '@/bizComponents/EditorModules/SelectGather/SelectGather';
import { itemActivityDetail, saveOrUpdateItemActivity } from '@/services/item';
import { isObject } from 'lodash-es';
import { dataSearch } from '@/services/shop';
const GoodsSet = () => {
  const [form] = Form.useForm();
  // 跳转路径
  const [jumpData, setJumpData] = useState({ type: 'none', link: '' });
  const [switchState, setSwitchState] = useState('disable');
  const [activeStatus, setActiveStatus] = useState(false);
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 24 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 0,
      },
    },
  };
  const onChange = checked => {
    if (checked == true) {
      setSwitchState('enable');
      setActiveStatus(true);
    } else {
      setSwitchState('disable');
      setActiveStatus(false);
    }
  };
  useEffect(() => {
    getInfo();
  }, []);
  const getInfo = () => {
    itemActivityDetail().then(res => {
      if (res.success) {
        if (res.data) {
          form.setFieldsValue({
            activityName: res.data.activityName,
            activityDesc: res.data.activityDesc,
          });
          setSwitchState(res.data.status);
          if (res.data.linkInfoParam.type != 'none') {
            let temp = [];
            temp.push({
              type: 'special',
              id: res.data.linkInfoParam.link,
            });
            dataSearch(temp).then(res => {
              if (res.success) {
                setJumpData({
                  type: res.data[0].type,
                  link: {
                    id: res.data[0].id,
                    value: res.data[0].value,
                  },
                });
              }
            });
            // res.data.linkInfoParam.link = JSON.parse(res.data.linkInfoParam.link);
          }
          setJumpData(res.data.linkInfoParam);
          if (res.data.status == 'enable') {
            setActiveStatus(true);
          } else {
            setActiveStatus(false);
          }
        }
      }
    });
  };
  // 保存
  const handleSearch = () => {
    let Arr = form.getFieldValue();
    if (
      (switchState == 'enable' && (Arr.activityName == null || Arr.activityName == '')) ||
      (switchState == 'enable' && (Arr.activityDesc == null || Arr.activityDesc == ''))
    ) {
      message.warning('请填写完整信息');
      return;
    }
    let data = jumpData;
    if (switchState == 'enable' && data.type != 'none' && data.link == '') {
      message.warning('请填写完整活动链接');
      return;
    }
    let temp = {};
    if (switchState == 'enable') {
      temp = {
        status: switchState,
        activityName: Arr.activityName,
        activityDesc: Arr.activityDesc,
        linkInfoParam: {
          type: data.type,
          link: isObject(data.link) ? data.link.id : data.link,
        },
      };
    } else if (switchState == 'disable') {
      temp = {
        status: switchState,
        activityName: '',
        activityDesc: '',
        linkInfoParam: { type: 'none', link: '' },
      };
    }
    console.log('temp=', temp);
    saveOrUpdateItemActivity(temp).then(res => {
      if (res.success) {
        message.success('保存成功');
        getInfo();
      }
    });
  };
  const alterType = type => {
    setJumpData({
      type,
      link: '',
    });
  };
  const alterData = link => {
    setJumpData({
      ...jumpData,
      link,
    });
  };
  const alterFocus = () => {};
  return (
    <Panel title="商品设置">
      <Card>
        <Row>
          <Col span={24} className={Css['headerTitle']}>
            <span className={Css['word']}>商品设置</span>
          </Col>
          <Col span={22} className={Css['contarner']}>
            <Form form={form} {...formItemLayout} onFinish={handleSearch} labelCol={5}>
              <Form.Item label="商品活动" name="status" {...tailFormItemLayout}>
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  checked={activeStatus}
                  onChange={onChange}
                />
                <span style={{ marginLeft: '20px' }}>商品活动功能开启后,可在商品详情页中展示</span>
              </Form.Item>
              {activeStatus == true ? (
                <Form.Item label="活动名称" name="activityName" {...tailFormItemLayout}>
                  <Input showCount maxLength={5} className={Css['acName']} />
                </Form.Item>
              ) : null}
              {activeStatus == true ? (
                <Form.Item label="活动描述" name="activityDesc" {...tailFormItemLayout}>
                  <Input showCount maxLength={15} className={Css['acName']} />
                </Form.Item>
              ) : null}
              {activeStatus == true ? (
                <Form.Item label="活动链接" name="linkInfoParam" {...tailFormItemLayout}>
                  <div style={{ marginTop: '-12px' }}>
                    <SelectGather
                      allChoose
                      type={jumpData.type}
                      data={jumpData.link}
                      storeType="activity"
                      alterType={e => alterType(e)}
                      alterData={e => alterData(e)}
                      alterFocus={e => alterFocus(e)}
                      style={{ marginTop: '-12px' }}
                    />
                  </div>
                </Form.Item>
              ) : null}
              <Col span={24} style={{ marginTop: 200 }}>
                <Form.Item>
                  <Row justify="center">
                    <Space>
                      <Button type="primary" htmlType="submit">
                        保存
                      </Button>
                    </Space>
                  </Row>
                </Form.Item>
              </Col>
            </Form>
          </Col>
        </Row>
      </Card>
    </Panel>
  );
};
export default GoodsSet;
