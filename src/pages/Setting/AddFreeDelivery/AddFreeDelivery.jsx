import React, { useState, useEffect } from 'react';
import { history } from '@umijs/max';
import { CloseCircleOutlined } from '@ant-design/icons';
import {
  PageHeader,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Table,
  Row,
  Col,
  Space,
  message,
  Modal,
  Spin,
} from 'antd';
import Panel from '@/components/Panel';
import Columns from './columns';
import AddAreaModal from '../AddLogistics/modules/AddAreaModal/AddAreaModal';

import {
  freightFreeTemplateAdd,
  freightFreeTemplateDetail,
  freightFreeTemplateEdit,
} from '@/services/freight';
import { withRouter } from '@/utils/compatible';

const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

export default withRouter(props => {
  const [form] = Form.useForm();
  // 包邮配置弹框阀门
  const [areaShow, setAreaShow] = useState(false);
  // 修改用模板id
  const [templateId, setTemplateId] = useState(-1);
  // 包邮列表
  const [freightAreaList, setFreightAreaList] = useState([]);
  // 选中修改值位置
  const [editIndex, setEditIndex] = useState(-1);
  // 新增/修改判断
  const [addType, setAddType] = useState(false);
  // 修改加载状态开启
  const [editLoading, setEditLoading] = useState(false);
  const { location } = props
  useEffect(() => {
    if (location?.query?.templateId) {
      setEditLoading(true);
      setTemplateId(location.query.templateId);
      freightFreeTemplateDetail({
        templateId: location.query.templateId,
      })
        .then(res => {
          if (res.success) {
            form.setFieldsValue({
              ruleType: res.data.ruleType,
              ruleValue: Number(res.data.ruleValue),
              templateName: res.data.templateName,
              templateDesc: res.data.templateDesc,
            });
            setFreightAreaList(res.data.areaList);
          }
          setEditLoading(false);
        })
        .catch(() => {
          setEditLoading(false);
        });
    }
  }, []);

  // 新增包邮区域
  const addDelivery = () => {
    freightAreaList.push({
      areaIds: null,
      areaNames: null,
    });
    setAreaShow(true);
    setAddType(true);
    setFreightAreaList(freightAreaList);
    setEditIndex(freightAreaList?.length ? freightAreaList.length - 1 : 0);
  };

  // 修改包邮区域
  const editDelivery = record => {
    let index = 0;
    freightAreaList.forEach((item, itemIndex) => {
      if (item.areaIds == record.areaIds) index = itemIndex;
    });
    setAreaShow(true);
    setEditIndex(index);
  };

  // 删除包邮区域
  const delDelivery = record => {
    let index = 0;
    freightAreaList.forEach((item, itemIndex) => {
      if (item.areaIds == record.areaIds) index = itemIndex;
    });
    confirm({
      title: '删除包邮区域',
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: '确定删除该包邮区域吗？',
      okType: 'danger',
      onOk() {
        freightAreaList.splice(index, 1);
        setFreightAreaList([...freightAreaList]);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  // 确认修改包邮区域
  const areaOkFn = areaObj => {
    freightAreaList[editIndex].areaIds = areaObj.areaIds;
    freightAreaList[editIndex].areaNames = areaObj.areaNames;
    freightAreaList[editIndex].AllareaIds = areaObj.AllareaIds;
    setFreightAreaList([...freightAreaList]);
    setAreaShow(false);
    setAddType(false);
  };

  // 取消包邮区域设置
  const onCancel = () => {
    if (addType) {
      freightAreaList.splice(freightAreaList?.length - 1, 1);
      setFreightAreaList(freightAreaList);
    }
    setAreaShow(false);
    setAddType(false);
  };

  // 保存事件
  const onFinish = newValue => {
    // console.log(newValue);
    if (!(freightAreaList?.length > 0)) {
      return message.warning('请添加包邮区域');
    }
    const data = {
      templateName: newValue.templateName,
      templateDesc: newValue.templateDesc,
      ruleType: newValue.ruleType,
      ruleValue: String(newValue.ruleValue),
      areaList: freightAreaList,
    };
    if (templateId > -1) {
      data.templateId = templateId;
      freightFreeTemplateEdit(data).then(res => {
        if (res?.success) {
          message.success('修改成功');
          history.go(-1)
        }
      });
    } else {
      freightFreeTemplateAdd(data).then(res => {
        if (res?.success) {
          message.success('新增成功');
          history.go(-1)
        }
      });
    }
  };

  return (
    <Panel>
      <Spin spinning={editLoading}>
        <PageHeader title="模板信息" style={{ backgroundColor: '#fff' }}>
          <Form
            form={form}
            labelCol={{ span: 2, offset: 2 }}
            wrapperCol={{ span: 8 }}
            initialValues={{
              ruleValue: 0,
              ruleType: 'MONEY',
            }}
            onFinish={onFinish}
          >
            <Form.Item label="模板名称" name="templateName" rules={[{ required: true }]}>
              <Input maxLength={12} placeholder="模板名称，12个字以内" />
            </Form.Item>
            <Form.Item label="模板说明" name="templateDesc">
              <TextArea maxLength={36} placeholder="请输入，36个字以内" />
            </Form.Item>
            <Form.Item label="包邮规则" required>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                订单满
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.ruleType !== currentValues.ruleType
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue('ruleType') === 'MONEY' ? (
                      <Form.Item
                        noStyle
                        name="ruleValue"
                        rules={[
                          {
                            required: true,
                            message: '包邮额度必须大于0',
                            type: 'number',
                            min: 0.01,
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={99999}
                          style={{ margin: '0 8px' }}
                          precision={2}
                        />
                      </Form.Item>
                    ) : (
                      <Form.Item
                        noStyle
                        name="ruleValue"
                        rules={[
                          {
                            required: true,
                            message: '包邮额度必须大于0',
                            type: 'number',
                            min: 0.01,
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={99999}
                          style={{ margin: '0 8px' }}
                          precision={0}
                        />
                      </Form.Item>
                    )
                  }
                </Form.Item>
                <Form.Item noStyle name="ruleType" rules={[{ required: true }]}>
                  <Select
                    style={{ width: 60, marginRight: 8 }}
                    onChange={() => {
                      form.setFieldsValue({
                        ruleValue: 0,
                      });
                    }}
                  >
                    <Option value="MONEY">元</Option>
                    <Option value="QUANTITY">件</Option>
                  </Select>
                </Form.Item>
                免运费
              </div>
            </Form.Item>
            <Form.Item label="包邮区域" required>
              <Button type="primary" onClick={() => addDelivery()}>
                添加包邮区域
              </Button>
            </Form.Item>
            <Row gutter={[16, 16]}>
              <Col offset={4} span={16}>
                <Table
                  dataSource={freightAreaList}
                  rowKey="areaNames"
                  columns={Columns.deliveryScope({ editDelivery, delDelivery })}
                  pagination={false}
                />
              </Col>
              <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    保存
                  </Button>
                  <Button
                    onClick={() => {
                      history.go(-1)
                    }}
                  >
                    取消
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </PageHeader>
      </Spin>
      {areaShow ? (
        <AddAreaModal
          freightAreaList={freightAreaList}
          editIndex={editIndex}
          areaOkFn={areaOkFn}
          visible={areaShow}
          onCancel={onCancel}
        />
      ) : null}
    </Panel>
  );
});
