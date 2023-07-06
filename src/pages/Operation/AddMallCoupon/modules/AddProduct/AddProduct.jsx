import React, { Component } from 'react';
import Css from './AddProduct.module.scss';
import { Transfer, Table, Button } from 'antd';
import { uniqBy, difference } from 'lodash-es'
import { search, goodsList } from '@/services/coupon';

class AddProduct extends Component {
  state = {
    leftTableColumns: [
      {
        dataIndex: 'itemName',
        title: '商品名称',
      },
      {
        dataIndex: 'salePrice',
        title: '商品价格',
        render: price => '¥' + price / 100,
      },
    ],
    rightTableColumns: [
      {
        dataIndex: 'itemName',
        title: '商品名称',
      },
    ],
    targetKeys: [],
    tableData: { rows: [], pageSize: 10 },
    totalDataSource: [],
    searchData: {
      page: 1,
      keyword: '',
    },
  };

  componentDidMount() {
    this.setState({
      targetKeys: this.props.useProductList,
      totalDataSource: this.props.totalDataSource,
    });
    this.getData();
  }
  getData = async () => {
    const info = await search(this.state.searchData);
    this.setState({
      tableData: {
        ...info.data,
        rows: info.data.rows.map(item => {
          return {
            ...item,
            key: item.itemId,
          };
        }),
      },
      totalDataSource: uniqBy(this.state.totalDataSource.concat(info.data.rows), 'itemId').map(
        item => {
          return {
            ...item,
            key: item.itemId,
          };
        }
      ),
    });
    if (this.props.stockId) {
      const datas = await goodsList({ stockId: this.props.stockId });
      this.setState({
        totalDataSource: uniqBy(this.state.totalDataSource.concat(datas.data), 'itemId').map(
          item => {
            return {
              ...item,
              key: item.itemId,
            };
          }
        ),
      });
    }
  };
  onChange = nextTargetKeys => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  search = (dir, value) => {
    if (dir == 'left') {
      this.setState(
        {
          searchData: { ...this.state.searchData, ...{ keyword: value } },
        },
        () => {
          this.getData();
        }
      );
    } else {
      //右侧搜索
      const rightDataSource = this.state.totalDataSource.filter(item =>
        this.state.targetKeys.includes(item.key)
      );
      const rightSearList = [];
      rightDataSource.map(item => {
        if (item.itemName.indexOf(value) > -1) {
          rightSearList.push(item);
        }
      });
      this.setState({
        rightSearList,
      });
    }
  };
  filterOption = (inputValue, option) => option.itemName.indexOf(inputValue) > -1;

  // 添加商品
  addProduct = () => {
    this.props.addProductCallBack(this.state.targetKeys, this.state.totalDataSource);
  };

  // 取消
  cancelButton = () => {
    console.log('取消');
    this.props.cancelCallBack();
  };

  render() {
    const {
      rightSearList,
      targetKeys,
      tableData,
      totalDataSource,
      leftTableColumns,
      rightTableColumns,
    } = this.state;
    return (
      <div className={Css['AddProduct']}>
        <div className={Css['card']}>
          <div className={Css['title']}>添加商品</div>
          <Transfer
            rowKey={record => record.itemId}
            filterOption={this.filterOption}
            titles={['待选', '已选']}
            targetKeys={targetKeys}
            dataSource={tableData.rows}
            onSearch={this.search.bind(this)}
            showSearch={true}
            showSelectAll={false}
            onChange={this.onChange.bind(this)}
          >
            {({
              direction,
              onItemSelectAll,
              onItemSelect,
              selectedKeys: listSelectedKeys,
              disabled: listDisabled,
            }) => {
              const rowSelection = {
                getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
                onSelectAll(selected, selectedRows) {
                  console.log(selected, selectedRows);
                  const treeSelectedKeys = selectedRows
                    .filter(item => !item.disabled)
                    .map(({ key }) => key);
                  const diffKeys = selected
                    ? difference(treeSelectedKeys, listSelectedKeys)
                    : difference(listSelectedKeys, treeSelectedKeys);
                  onItemSelectAll(diffKeys, selected);
                },
                onSelect({ key }, selected) {
                  console.log(key, selected);
                  onItemSelect(key, selected);
                },
                selectedRowKeys: listSelectedKeys,
              };

              const handleTableChange = paginationObj => {
                console.log(this.state.searchData, paginationObj.current);
                if (direction === 'left') {
                  this.setState(
                    {
                      searchData: { ...this.state.searchData, ...{ page: paginationObj.current } },
                    },
                    () => {
                      this.getData();
                    }
                  );
                }
              };
              const leftDataSource = tableData.rows.map(item => ({
                ...item,
                disabled: targetKeys.includes(item.key),
              }));
              console.log(leftDataSource);
              const rightDataSource = totalDataSource.filter(item => targetKeys.includes(item.key));

              return (
                <Table
                  rowSelection={rowSelection}
                  columns={direction === 'left' ? leftTableColumns : rightTableColumns}
                  dataSource={
                    direction === 'left' ? leftDataSource : rightSearList || rightDataSource
                  }
                  // rowKey="itemId"
                  rowKey={record => record.itemId}
                  size="small"
                  pagination={
                    direction === 'left'
                      ? {
                          current: this.state.tableData.current,
                          total: this.state.tableData.total,
                          pageSize: this.state.tableData.pageSize,
                        }
                      : { pageSize: this.state.tableData.pageSize }
                  }
                  onChange={handleTableChange}
                  onRow={({ key, disabled: itemDisabled }) => ({
                    onClick: () => {
                      console.log(key, itemDisabled);
                      if (itemDisabled) return;
                      onItemSelect(key, !listSelectedKeys.includes(key));
                    },
                  })}
                />
              );
            }}
          </Transfer>
          <div className={Css['buttonGroup']}>
            <Button className={Css['cancel']} onClick={this.cancelButton.bind(this)}>
              取消
            </Button>
            <Button type="primary" onClick={this.addProduct.bind(this)}>
              添加
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddProduct;
