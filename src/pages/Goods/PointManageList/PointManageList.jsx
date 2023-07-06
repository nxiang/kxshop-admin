import React, { useEffect, useState } from 'react';
import Panel from '@/components/Panel';
import { Card, Table, Row, Col, Button, Modal, message } from 'antd';
import columns from './columns';
import AdvanceSearch from './advanceSearch';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { showBut } from '@/utils/utils';
import { itemListing, itemDelisting, itemDelete, pointItemList, itemList } from '@/services/item';
import { classOption } from '@/services/itemClass';

const stateData = [
  { label: '出售中', value: 1 },
  { label: '已售罄', value: 2 },
  { label: '已下架', value: '0' },
];

const PointManageList = () => {
  const [listData, setListData] = useState(undefined);
  const [listLoading, setListLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [classInfo, setClassInfo] = useState([]);
  const pageSize = 20;
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [curParams, setCurParams] = useState(undefined);

  useEffect(() => {
    classOptionApi();
    handleSearch(1);
  }, []);

  const classOptionApi = () => {
    classOption({
      itemType: 1,
    }).then(res => {
      if (res.success) {
        setClassInfo(res.data);
      }
    });
  };

  const handleSearch = (newPagination, params) => {
    setListLoading(true);
    if (params) setCurParams(params);
    itemList({
      state: params?.state || '',
      classId: params?.classId || '',
      itemName: params?.itemName || '',
      page: newPagination || currentPage,
      pageSize,
      itemType: 1,
    }).then(res => {
      setListLoading(false);
      if (res.errorCode === '0') {
        setCurrentPage(newPagination);
        res.data.rows.forEach(i => {
          stateData.forEach(c => {
            if (i.state == c.value) {
              i.stateText = c.label;
            }
          });
        });
        setListData(res.data);
      }
    });
  };

  const handleDelete = id => {
    Modal.confirm({
      icon: <CloseCircleOutlined style={{ color: 'rgb(247, 38, 51)' }} />,
      title: '确定要删除该商品?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      maskClosable: true,
      onOk() {
        itemDelete({
          itemId: id,
        }).then(res => {
          if (res.errorCode == '0') {
            message.success('删除成功');
            handleSearch(1);
          }
        });
      },
      onCancel() {},
    });
  };

  const changeStatus = (type, id) => {
    if (type == 1) {
      // 下架
      itemDelisting({ itemIds: Array.isArray(id) ? id : [id] }).then(res => {
        if (res.errorCode == '0') {
          message.success('下架成功');
          handleSearch(1, curParams);
        }
      });
    } else {
      // 上架
      itemListing({ itemIds: Array.isArray(id) ? id : [id] }).then(res => {
        if (res.errorCode == '0') {
          message.success('上架成功');
          handleSearch(1, curParams);
        }
      });
    }
  };

  const rowSelection = {
    onChange: selectedRowKeys => {
      setSelectedKeys(selectedRowKeys);
    },
  };

  const batchSoldOut = () => {
    if (selectedKeys.length === 0) return message.error('请选中需要下架的商品');
    changeStatus(1, selectedKeys);
  };

  const batchSoldShelves = () => {
    if (selectedKeys.length === 0) return message.error('请选中需要上架的商品');
    changeStatus(2, selectedKeys);
  };

  return (
    <Panel title="积分商品" content="积分商品信息管理和查看">
      <Card>
        <Row justify="space-between">
          <Col span={20}>
            <AdvanceSearch stateData={stateData} classInfo={classInfo} onSearch={handleSearch} />
          </Col>
          {showBut('pointManageList','pointSend') ? (
            <Col>
              <Link to="/goods/PointManageList/pointManageEdit?type=add">
                <Button type="primary">发布商品</Button>
              </Link>
            </Col>
          ) : null}
        </Row>
        <Row justify="start" align="middle" gutter={[16, 0]} style={{ marginBottom: 24 }}>
          {(!curParams || curParams?.state == '' || curParams?.state == 1) && (
            <Col>
              {showBut('pointManageList','pointManageList_batchDown') ? (
                <Button onClick={batchSoldOut}>批量下架</Button>
              ) : null}
            </Col>
          )}
          {(!curParams || curParams?.state == '' || curParams?.state == '0') && (
            <Col>
              {showBut('pointManageList','pointManageList_batchUp') ? (
                <Button onClick={batchSoldShelves}>批量上架</Button>
              ) : null}
            </Col>
          )}
        </Row>
        <Table
          rowKey="itemId"
          bordered
          loading={listLoading}
          scroll={{ x: 1280 }}
          columns={columns({ handleDelete, changeStatus })}
          dataSource={listData?.rows}
          pagination={{
            current: currentPage,
            pageSize,
            total: listData?.total,
            showTotal: total => `共${total}条数据`,
            showSizeChanger: false,
          }}
          onChange={pagination => {
            handleSearch(pagination.current, curParams);
          }}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
        />
      </Card>
    </Panel>
  );
};

export default PointManageList;
