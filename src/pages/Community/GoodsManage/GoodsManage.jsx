import React, { useState, useEffect } from 'react';
import { Link } from '@umijs/max';
import { PageHeader, Row, Col, Button, Form, Table, Modal, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { showBut } from '@/utils/utils';
import Panel from '@/components/Panel';
import FormSearch from './formSearch';
import Columns from './columns';

import { itemList, itemDelete, itemDelisting, itemListing } from '@/services/item';

const { confirm } = Modal;

export default () => {
  const [form] = Form.useForm();
  const [listData, setListData] = useState({});
  const [searchData, setSearchData] = useState({});

  useEffect(() => {
    goodsListApi();
  }, [searchData]);

  const goodsListApi = (page = 1) => {
    itemList({
      page,
      pageSize: 10,
      itemType: 2,
      classId: 1,
      ...searchData,
    }).then(res => {
      if (res.success) {
        setListData(res.data);
      }
    });
  };

  const handleSearch = newValue => {
    // const { status } = newValue;
    setSearchData({
      ...newValue,
    });
  };

  const onReset = () => {
    // 清空搜索条件
    form.resetFields();
  };

  // 下架商品
  const soldOut = record => {
    itemDelisting({
      itemIds: [record.itemId],
    }).then(res => {
      if (res.errorCode === '0') {
        message.success('下架成功');
        goodsListApi(listData.current);
      }
    });
  };

  // 上架商品
  const putaway = record => {
    itemListing({
      itemIds: [record.itemId],
    }).then(res => {
      if (res.errorCode === '0') {
        message.success('上架成功');
        goodsListApi(listData.current);
      }
    });
  };

  // 删除商品
  const delItem = record => {
    confirm({
      icon: <CloseCircleOutlined style={{ color: 'rgba(247, 38, 51, 1)' }} />,
      title: `确定要删除【${record.itemName}】商品?`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      maskClosable: true,
      onOk() {
        itemDelete({
          itemId: record.itemId,
        }).then(res => {
          if (res.errorCode === '0') {
            message.success('删除成功');
            goodsListApi(listData.current);
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <Panel>
      <PageHeader style={{ background: '#fff' }}>
        <Row gutter={[8, 16]} justify="space-between">
          <Col span={24}>
            <FormSearch formRef={form} handleSearch={handleSearch} onReset={onReset} />
          </Col>
          <Col span={24}>
            {showBut('communityGoods', 'add') && (
              <Link to="/community/goodsManage/addGoods?type=add">
                <Button type="primary">新建</Button>
              </Link>
            )}
          </Col>
          <Col span={24}>
            <Table
              dataSource={listData?.rows}
              columns={Columns.goodsListScope({ delItem, soldOut, putaway })}
              rowKey="itemId"
              pagination={{
                current: listData.current,
                pageSize: 10,
                total: listData.total,
                showTotal: total => `共 ${total} 条数据`,
                showSizeChanger: false,
                onChange: page => goodsListApi(page),
              }}
            />
          </Col>
        </Row>
      </PageHeader>
    </Panel>
  );
};
