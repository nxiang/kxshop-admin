import React, { useState, useEffect } from 'react';
import { PageHeader, Button, Row, Col, Table, Form } from 'antd';
import moment from 'moment';
import Panel from '@/components/Panel';
import FormSearch from './FormSearch';
import { LocationScope } from './Columns';

import { pickUpList, getEnumByType } from '@/services/logistics';

export default () => {
  const [form] = Form.useForm();
  // 搜索条件
  const [searchData, setSearchData] = useState(null);
  // 展示列表
  const [listData, setListData] = useState({});
  // 列表加载
  const [loading, setLoading] = useState(false);
  // 字典查询
  const [businessShow, setBusinessShow] = useState({});
  const [activeShow, setActiveShow] = useState({});
  const [inShow, setInShow] = useState({});
  const [pickStatus, setPickStatus] = useState([]);
  const [pickShow, setPickShow] = useState({});

  // 初始化接口集合
  useEffect(() => {
    BusinessStatusEnum();
    ActiveStatusEnum();
    InStatusEnum();
    PickStatusEum();
  }, []);

  // 列表搜索触发
  useEffect(() => {
    getListApi();
  }, [searchData]);

  // 获取自提点列表
  const getListApi = (page = 1) => {
    setLoading(true);
    const data = {
      ...searchData,
      pageNo: page,
      pageSize: 10,
    };
    pickUpList(data).then(res => {
      if (res.success) {
        setLoading(false);
        setListData(res.data);
      }
    });
  };

  // 营业状态获取
  const BusinessStatusEnum = () => {
    getEnumByType({ type: 'BusinessStatusEnum' }).then(res => {
      if (res.success) {
        setBusinessShow(ObjectChange(res.data));
      }
    });
  };

  // 激活状态获取
  const ActiveStatusEnum = () => {
    getEnumByType({ type: 'ActiveStatusEnum' }).then(res => {
      if (res.success) {
        setActiveShow(ObjectChange(res.data));
      }
    });
  };

  // 进件状态获取
  const InStatusEnum = () => {
    getEnumByType({ type: 'InStatusEnum' }).then(res => {
      if (res.success) {
        setInShow(ObjectChange(res.data));
      }
    });
  };

  // 商品状态获取
  const PickStatusEum = () => {
    getEnumByType({ type: 'PickEnableStatusEum' }).then(res => {
      if (res.success) {
        setPickStatus(res.data);
        setPickShow(ObjectChange(res.data));
      }
    });
  };

  // 操作文档点击
  const operationDocument = () => {};

  // 数组转对象
  const ObjectChange = array => {
    const newObject = {};
    if (typeof array == 'object') {
      array.forEach(item => {
        newObject[item.key] = item.value;
      });
    }
    return newObject;
  };

  // 搜索条件确认
  const handleSearch = newValue => {
    let data = {
      majorName: newValue?.majorName,
      addressDetail: newValue?.addressDetail,
      distributionName: newValue?.distributionName,
      majorPhone: newValue?.majorPhone,
      isEnable: newValue?.isEnable,
      creatorName: newValue?.creatorName,
      id: newValue?.id,
    };
    if (newValue?.createTime) {
      data = {
        ...data,
        beginTime: `${moment(newValue.createTime[0]).format('YYYY-MM-DD')} 00:00:00`,
        endTime: `${moment(newValue.createTime[1]).format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    if (newValue?.provice) {
      data = {
        ...data,
        addressProvince: newValue?.provice[0],
        addressCity: newValue?.provice[1],
        addressRegion: newValue?.provice[2],
      };
    }
    Object.keys(data).forEach(key => {
      if (data[key] == '') data[key] = null;
    });
    setSearchData(data);
  };

  // 搜索条件重置
  const onReset = () => {
    form.resetFields();
    setSearchData({});
  };

  return (
    <Panel>
      <PageHeader
        title="社区团购订单"
        style={{ background: '#fff' }}
        extra={[
          <Button key={0} type="primary" ghost onClick={operationDocument}>
            操作文档
          </Button>,
        ]}
      >
        <Row>
          <Col span={24}>
            <FormSearch
              formRef={form}
              handleSearch={handleSearch}
              onReset={onReset}
              pickStatus={pickStatus}
            />
          </Col>
          <Col span={24}>
            <Table
              loading={loading}
              dataSource={listData.rows}
              rowKey="id"
              scroll={{ x: 1500 }}
              columns={LocationScope({
                businessShow,
                activeShow,
                inShow,
                pickShow,
              })}
              pagination={{
                current: listData.current,
                pageSize: 10,
                total: listData.total,
                showTotal: total => `共 ${total} 条数据`,
                showSizeChanger: false,
                onChange: page => getListApi(page),
              }}
            />
          </Col>
        </Row>
      </PageHeader>
    </Panel>
  );
};
