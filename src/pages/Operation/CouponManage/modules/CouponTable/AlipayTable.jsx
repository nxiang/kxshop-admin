import React, { Component } from 'react';
import Css from './AlipayTable.module.scss';
import { Radio, Button, Input, Table } from 'antd';

const { Column } = Table;

class AlipayTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 列表加载阀门
      spinIs: false,
      // 列表展示数组
      listData: [
        {
          stockId: 0,
          status: 0,
          voucherType: 'CASHLESS_FIX_VOUCHER',
        },
        {
          stockId: 1,
          status: 1,
          voucherType: 'CASHLESS_FIX_VOUCHER',
        },
        {
          stockId: 2,
          status: 2,
          voucherType: 'CASHLESS_RANDOM_VOUCHER',
        },
      ],
      // 列表分页
      sourcePage: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      // 优惠券状态值
      state: '0',
      // 搜索文本
      searchText: '',
      // 确定搜索用参数
      determineText: {
        searchText: '',
      },
    };
  }

  // 输入change事件
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value.trim(),
    });
  };

  // 选择优惠券状态
  selectState(e) {
    this.setState({
      state: e.target.value,
    });
  }

  // 开始搜索
  searchStart() {
    this.setState(
      {
        determineText: {
          searchText: this.state.searchText,
        },
      },
      () => {}
    );
  }

  // table优惠券类型dom
  voucherTypeRender(record) {
    switch (record.voucherType) {
      case 'CASHLESS_FIX_VOUCHER':
        return '定额代金券';
      case 'CASHLESS_RANDOM_VOUCHER':
        return '不定额代金券 ';
    }
  }

  // table状态dom
  statusRender(record) {
    switch (record.status) {
      case 0:
        return <div style={{ color: 'rgba(91, 203, 29, 1)' }}>发放中</div>;
      case 1:
        return <div style={{ color: 'rgba(247, 146, 38, 1)' }}>草稿</div>;
      case 2:
        return <div style={{ color: 'rgba(0, 0, 0, 0.4)' }}>已结束</div>;
    }
  }

  // table操作dom
  operationRender(record) {
    switch (record.status) {
      case 0:
        return (
          <div className={Css['operation-box']}>
            <p className={Css['operation-text']}>暂停</p>
            <div className={Css['operation-div']} />
            <p className={Css['operation-text']}>详情</p>
          </div>
        );
        break;
      case 1:
        return (
          <div className={Css['operation-box']}>
            <p className={Css['operation-text']}>激活</p>
            <div className={Css['operation-div']} />
            <p className={Css['operation-text']}>编辑</p>
            <div className={Css['operation-div']} />
            <p className={Css['operation-text']}>删除</p>
          </div>
        );
        break;
      case 2:
        return (
          <div className={Css['operation-box']}>
            <p className={Css['operation-text']}>详情</p>
          </div>
        );
        break;
    }
  }

  render() {
    return (
      <div className={Css['alipay-table-box']}>
        <div className={Css['alipay-header-box']}>
          <Radio.Group
            onChange={this.selectState.bind(this)}
            value={this.state.state}
            className={Css['left']}
          >
            <Radio.Button value="0">发放中</Radio.Button>
            <Radio.Button value="1">草稿</Radio.Button>
            <Radio.Button value="2">已结束</Radio.Button>
            <Radio.Button value="3">全部</Radio.Button>
          </Radio.Group>
          <div className={Css['header-right-box']}>
            <Input
              className={Css['right-input']}
              placeholder={'搜索劵名称'}
              value={this.state.searchText}
              name={'searchText'}
              onChange={this.onChange}
            />
            <Button type="primary" onClick={this.searchStart.bind(this)}>
              搜索
            </Button>
          </div>
        </div>
        <div className={Css['table-box']}>
          <Table
            ellipsis
            rowKey={record => record.stockId}
            dataSource={this.state.listData}
            pagination={{
              current: this.state.sourcePage.current,
              pageSize: this.state.sourcePage.pageSize,
              total: this.state.sourcePage.total,
              onChange: page => this.specListApi(page),
            }}
          >
            <Column title="劵名称" dataIndex="couponName" />
            <Column title="劵备注" dataIndex="comment" />
            <Column title="劵ID" dataIndex="stockId" />
            <Column
              title="劵类型"
              key="voucherType"
              render={record => this.voucherTypeRender(record)}
            />
            <Column title="创建时间" dataIndex="createTime" />
            <Column title="状态" key="status" render={record => this.statusRender(record)} />
            <Column title="操作" render={record => this.operationRender(record)} />
          </Table>
        </div>
      </div>
    );
  }
}

export default AlipayTable;
