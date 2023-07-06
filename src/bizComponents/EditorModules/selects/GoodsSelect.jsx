import React, { Component } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Table, Modal, message } from 'antd';
import Css from './GoodsSelect.module.scss';

import { choseItem, choseItemListById } from '@/services/shop';

const { Column } = Table;

class GoodsSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      listData: [],
      sourcePage: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      selectedRowKeys: [],
      // selectedRows: [],
    };
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      selectedRowKeys: [],
      // selectedRows: [],
    });
  };

  handleOk = () => {
    const { alterData } = this.props;
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length < 1) {
      message.warning('至少需要选择一个商品');
      return;
    }
    choseItemListById(selectedRowKeys).then(res => {
      alterData({
        selectedRowKeys,
        selectedRows: res.data,
      });
      this.setState({
        visible: false,
        selectedRowKeys: [],
        // selectedRows: [],
      });
    });
  };

  showModal = () => {
    const { itemData } = this.props;
    let selectedRowKeys;
    if (itemData && itemData.length > 0) {
      selectedRowKeys = itemData.map(item => {
        return item.itemId;
      });
    } else {
      selectedRowKeys = [];
    }
    this.choseItemApi();
    this.setState({
      selectedRowKeys,
      visible: true,
    });
  };

  choseItemApi(page) {
    const {
      sourcePage: { pageSize },
    } = this.state;
    const { itemType } = this.props;
    const data = {
      page: page || 1,
      pageSize,
      couponReceiveWay: 0,
      itemType,
    };
    choseItem(data).then(res => {
      this.setState({
        listData: res.data.rows,
        sourcePage: {
          current: res.data.current,
          pageSize: res.data.pageSize,
          total: res.data.total,
        },
      });
    });
  }

  render() {
    const { itemNum = 99 } = this.props;
    return (
      <div className={Css['goods-select-box']}>
        <div className={Css['goods-add-item']} onClick={this.showModal}>
          <PlusOutlined />
          <p className={Css['goods-add-item-text']}>添加商品</p>
        </div>
        <Modal
          title="商品选择"
          width={'674px'}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>请选择商品</p>
          <Table
            ellipsis
            rowSelection={{
              selectedRowKeys: this.state.selectedRowKeys,
              columnTitle: ' ',
              onSelect: (record, selected, selectedRows, nativeEvent) => {
                const selectedRowKeys = this.state.selectedRowKeys;
                if (selected) {
                  if (selectedRowKeys.length < itemNum) {
                    let newSelectedRowKeys = [...selectedRowKeys, record.id];
                    this.setState({
                      selectedRowKeys: newSelectedRowKeys,
                    });
                  } else {
                    message.warning(`商品数量不能超过${itemNum}个`);
                  }
                } else {
                  let newSelectedRowKeys = [...selectedRowKeys];
                  for (let i in newSelectedRowKeys) {
                    if (newSelectedRowKeys[i] === record.id) newSelectedRowKeys.splice(i, 1);
                  }
                  this.setState({
                    selectedRowKeys: newSelectedRowKeys,
                  });
                }
              },
            }}
            rowKey={record => record.id}
            dataSource={this.state.listData}
            pagination={{
              current: this.state.sourcePage.current,
              pageSize: this.state.sourcePage.pageSize,
              total: this.state.sourcePage.total,
              onChange: page => this.choseItemApi(page),
            }}
          >
            <Column
              align="center"
              title="商品图片"
              render={record => (
                <img style={{ width: '40px', height: '40px' }} src={record.imagePath} alt="" />
              )}
            />
            <Column align="center" title="商品名称" dataIndex="name" />
          </Table>
        </Modal>
      </div>
    );
  }
}

export default GoodsSelect;
