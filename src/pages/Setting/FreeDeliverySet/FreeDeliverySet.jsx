import React, { useState, useEffect } from 'react';
import { history } from '@umijs/max';
import Panel from '@/components/Panel';
import { PageHeader, Table, Button, Modal, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import Columns from './columns';
import { Link } from 'react-router-dom';
import { showBut } from '@/utils/utils'

import { freightFreeTemplateList, freightFreeTemplateDelete } from '@/services/freight';

const { confirm } = Modal;

export default props => {
  const [listData, setListData] = useState({});

  useEffect(() => {
    freightFreeTemplateListApi();
  }, []);

  // 包邮列表数据请求
  const freightFreeTemplateListApi = page => {
    freightFreeTemplateList({
      page: page ? page : 1,
      pageSize: 10,
    }).then(res => {
      if (res?.success) {
        setListData(res.data);
      }
    });
  };

  // 修改包邮模板
  const ModifyDelivery = record => {
    history.push(`/setting/freeDeliverySet/add?templateId=${record.templateId}`);
  };

  // 删除包邮模板
  const DelDelivery = record => {
    confirm({
      title: '删除包邮设置',
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: '确定删除包邮设置吗？',
      okType: 'danger',
      onOk() {
        freightFreeTemplateDelete({
          templateId: record.templateId,
        }).then(res => {
          if (res?.success) {
            message.success('删除成功');
            freightFreeTemplateListApi(listData.current);
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <Panel title="包邮设置" content="包邮模板配置">
      <PageHeader
        style={{ backgroundColor: '#fff' }}
        extra={[
          <Link to="/setting/freeDeliverySet/add">
            {showBut('setting_freeDeliverySet', 'setting_freeDeliverySet_add') && <Button type="primary">添加包邮模板</Button>}
          </Link>,
        ]}
      >
        <Table
          dataSource={listData.rows}
          rowKey="templateId"
          columns={Columns.freeDeliveryScope({ ModifyDelivery, DelDelivery })}
          pagination={{
            current: listData.current,
            pageSize: listData.pageSize,
            total: listData.total,
            showSizeChanger: false,
            onChange: freightFreeTemplateListApi,
          }}
        />
      </PageHeader>
    </Panel>
  );
};
