import React, { useState, useEffect } from 'react';
import Css from './ShopAddressLibraryConfig.modules.scss';
import Panel from '@/components/Panel';
import { history } from '@umijs/max';
import { connect } from 'dva';

import { Button, message, Space, Spin, Form, Input, Select, Checkbox } from 'antd';
import RegionSelect from '@/bizComponents/RegionSelect';
import { addStoreAddressApi, editStoreAddressApi, getStoreAddressInfoApi } from '@/services/shop';
import { withRouter } from '@/utils/compatible';

const mapStateToProps = state => {
  return {
    collapsed: state.global.collapsed,
    regionSelectData: state.global.regionSelect,
  };
};

export default withRouter(connect(mapStateToProps)(props => {
  const { location, collapsed, regionSelectData } = props;

  // 券批次ID
  const {
    query: { id: addressId },
  } = location;

  const formLayout = {
    labelCol: { flex: '150px' },
    labelAlign: 'right',
    labelWrap: true,
    wrapperCol: { flex: 1 },
  };

  const optionsWithDisabled = [{ label: '退货地址', value: 1 }];

  const [form] = Form.useForm();

  // laoding
  const [spinning, setSpinning] = useState(false);

  // 获取详情
  useEffect(() => {
    if (addressId) getDetail();
  }, []);

  const submitFn = () => {
    form
      .validateFields()
      .then(values => {
        // 设置省市区地址
        let ProvinceCityRegion = setProvinceCityRegion(values.contactAddress);
        delete values.contactAddress;
        values.addressType = values.addressType[0];
        if (addressId) {
          // 编辑
          editAddress({ ...values, ...ProvinceCityRegion });
        } else {
          // 新增
          addAddress({ ...values, ...ProvinceCityRegion });
        }
      })
      .catch(errorInfo => {
        console.error(errorInfo);
      });
  };

  // 获取地址详情
  const getDetail = async () => {
    setSpinning(true);
    try {
      const info = await getStoreAddressInfoApi({ addressId });
      if (info.success) {
        let { provinceId, cityId, regionId, address, addressType, phone, realName } = info.data;
        form.setFieldsValue({
          address,
          addressType: [addressType],
          phone,
          realName,
          contactAddress: provinceId && cityId && regionId ? [provinceId, cityId, regionId] : [],
        });
      }
    } catch (error) {
      console.error(error);
    }
    setSpinning(false);
  };

  // 通过省市区id获取对应的id和name
  const setProvinceCityRegion = data => {
    let allContactAddress;
    data.forEach((item, index) => (allContactAddress = getAllAreaIdItem(regionSelectData, item)));
    const [
      { id: regionId, value: regionName },
      { id: cityId, value: cityName },
      { id: provinceId, value: provinceName },
    ] = allContactAddress;
    return {
      provinceId,
      provinceName,
      cityId,
      cityName,
      regionId,
      regionName,
    };
  };

  // 新增地址
  const addAddress = async values => {
    setSpinning(true);
    try {
      let res = await addStoreAddressApi(values);
      if (res.success) {
        message.success('创建成功');
        history.push('/shop/shopAddressLibrary');
      }
    } catch (error) {
      console.error(error);
    }
    setSpinning(false);
  };

  // 编辑地址
  const editAddress = async values => {
    setSpinning(true);
    try {
      let res = await editStoreAddressApi({ ...values, addressId });
      if (res.success) {
        message.success('修改成功');
        history.push('/shop/shopAddressLibrary');
      }
    } catch (error) {
      console.error(error);
    }
    setSpinning(false);
  };

  // 获取对应ids的所有具体项
  const getAllAreaIdItem = (data, id, arr = []) => {
    data.find(item => {
      if (item.id === id) {
        arr.push(item);
        return true;
      } else if (item.children.length) {
        arr = getAllAreaIdItem(item.children, id, arr);
        if (arr.length) {
          arr.push(item);
          return true;
        } else {
          return false;
        }
      }
      return false;
    });
    return arr;
  };

  return (
    <Panel title={addressId ? '编辑商家地址库' : '新增商家地址库'}>
      <Spin size="large" spinning={spinning}>
        <div className={`${Css['shopLibrarypageLayout']} shopLibrarypageLayout`}>
          <Form
            {...formLayout}
            form={form}
            name="addressLibrary"
            initialValues={{ addressType: [1] }}
            autoComplete="off"
          >
            <Form.Item
              label="联系人姓名"
              name="realName"
              rules={[{ required: true, message: '请输入联系人姓名' }]}
              getValueFromEvent={event => event.target.value.trim()}
            >
              <Input className={Css['selectW']} placeholder="请填写联系人姓名" maxLength={15} />
            </Form.Item>
            <Form.Item
              label="联系电话"
              name="phone"
              rules={[{ required: true, message: '请输入联系电话' }]}
              getValueFromEvent={event => event.target.value.trim()}
            >
              <Input className={Css['selectW']} placeholder="请填写联系电话" />
            </Form.Item>
            <Form.Item label="联系地址" required>
              <Space>
                <Select defaultValue="china" style={{ width: 70 }} disabled>
                  <Option value="china">中国</Option>
                </Select>
                <Form.Item
                  noStyle
                  label="联系地址"
                  name="contactAddress"
                  rules={[{ required: true, message: '请选择联系地址' }]}
                >
                  <RegionSelect
                    changeOnSelect={false}
                    fieldNames={{ label: 'label', value: 'id', children: 'children' }}
                  />
                </Form.Item>
              </Space>
            </Form.Item>
            <Form.Item
              label="详细地址"
              name="address"
              rules={[{ required: true, message: '请输入详细地址' }]}
              getValueFromEvent={event => event.target.value.trim()}
            >
              <Input
                className={Css['selectW']}
                maxLength={30}
                placeholder="请填写详细地址，如街道名称、门牌号等信息"
              />
            </Form.Item>
            <Form.Item label="地址类型" name="addressType" required>
              <Checkbox.Group options={optionsWithDisabled} disabled />
            </Form.Item>
          </Form>
        </div>
        {/* 保存按钮 */}
        <div className={Css['config-foot']} style={{ left: collapsed ? 80 : 256 }}>
          <Space>
            <Button onClick={() => history.push('/shop/shopAddressLibrary')}>取消</Button>
            <Button type="primary" onClick={() => submitFn()}>
              保存
            </Button>
          </Space>
        </div>
      </Spin>
    </Panel>
  );
}));
