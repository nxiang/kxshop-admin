import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Space,
  Table,
  Modal,
  Spin,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import Css from './ShopAddressLibrary.modules.scss';
import Panel from '@/components/Panel';
import { showBut } from '@/utils/utils';

import { getStoreAddressListApi, deleteStoreAddressApi } from '@/services/shop';

export default props => {
  const { confirm } = Modal;
  // laoding
  const [spinning, setSpinning] = useState(false);
  const [tableData, setTableData] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    rows: [],
  });

  // 表格列数据
  const columns = [
    {
      title: '联系人',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 500,
    },
    {
      title: '地址类型',
      dataIndex: 'addressType',
      key: 'addressType',
      width: 120,
      render: text => <div>{{ 1: '退货地址' }[text]}</div>,
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 120,
      render: (_, { addressId }) => (
        <Space>
          {showBut('shopAddressLibrary', 'edit') && (
            <a onClick={() => history.push(`/shop/shopAddressLibrary/config?id=${addressId}`)}>
              编辑
            </a>
          )}
          {showBut('shopAddressLibrary', 'delete') && (
            <a className={Css['red']} onClick={() => delAddress(addressId)}>
              删除
            </a>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getListData();
  }, []);

  // 获取数据
  const getListData = async (page, pageSize) => {
    if (pageSize != tableData.pageSize && pageSize) {
      page = 1;
      setTableData({
        ...tableData,
        pageSize,
      });
    }
    let params = {
      page: page || 1,
      pageSize: pageSize || tableData?.pageSize || 10,
    };
    setSpinning(true);
    try {
      const info = await getStoreAddressListApi(params);
      if (info.success) setTableData(info.data);
    } catch (error) {
      console.error(error);
    }
    setSpinning(false);
  };

  const delAddress = addressId => {
    confirm({
      title: '确认删除？',
      content: '删除后优惠券信息不可恢复，是否确认删除',
      onOk: async () => {
        setSpinning(true);
        try {
          const info = await deleteStoreAddressApi({ addressId });
          if (info.success) {
            message.success('删除成功');
            getListData();
          }
        } catch (error) {
          console.log(error);
        }
        setSpinning(false);
      },
      onCancel() {},
    });
  };

  const goAdd = () => {
    history.push(`/shop/shopAddressLibrary/config`);
  };

  return (
    <Panel title="商家地址库" content="管理店铺的商家地址库">
      <Spin size="large" spinning={spinning}>
        <div className={Css['pageLayout']}>
          {/* 操作栏 */}
          <div className={Css['Opr']}>
            <Space size={16}>
              {showBut('shopAddressLibrary', 'shopAddressLibraryConfig') && (
                <Button type="primary" icon={<PlusOutlined />} onClick={() => goAdd()}>
                  新增地址
                </Button>
              )}
            </Space>
          </div>

          {/* 表格 */}
          <Table
            dataSource={tableData.rows}
            columns={columns}
            scroll={{ y: 400, x: 1000 }}
            rowKey={record => record.addressId}
            pagination={{
              current: tableData.current,
              pageSize: tableData.pageSize,
              total: tableData.total,
              showSizeChanger: true,
              onChange: (page, pageSize) => getListData(page, pageSize),
            }}
          />
        </div>
      </Spin>
    </Panel>
  );
};
