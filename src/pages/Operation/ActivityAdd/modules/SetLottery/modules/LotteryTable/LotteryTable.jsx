import React, { Component } from 'react';
import Css from '../../../common.module.scss';
import { Divider, Table } from 'antd';
import { prizeList, prizeDel } from '@/services/activity';
import { connect } from 'dva';
import { lotteryItem } from '@/actions/index';
@connect(activitys => ({
  ...activitys,
}))
class LotteryTable extends Component {
  state = {
    loading: false,
    tableData: [],
  };
  componentDidMount() {
    console.log('table', this.props);
    this.props.onRef(this);
    this.initData();
  }
  async initData() {
    const info = await prizeList({ activityId: this.props.activitys.activityId });
    if (info) {
      this.setState({
        tableData: info.data,
      });
    }
  }

  editFn(r) {
    this.props.showModal();
    console.log(r);
    this.props.dispatch(lotteryItem(r));
  }
  async delFn(e) {
    const info = await prizeDel({ prizeConfId: e });
    if (info) {
      this.initData();
    }
  }

  render() {
    const columns = [
      {
        title: '奖品信息',
        dataIndex: 'prizeName',
        width: 230,
        render: (e, r) => (
          <span className={Css.tableInfoBox}>
            <img className={Css.tableImg} src={r.image} />
            <div>
              <p className={Css.tableMsg}>{e}</p>
              <p className={Css.tableMsg}>{r.prizeConfName}</p>
            </div>
          </span>
        ),
      },
      {
        title: '数量',
        dataIndex: 'stockQuantity',
        width: 90,
      },
      {
        title: '已发放',
        dataIndex: 'winQuantity',
        width: 90,
      },
      {
        title: '中奖概率',
        dataIndex: 'probability',
        width: 90,
      },
      {
        title: '操作',
        dataIndex: 'prizeConfId',
        width: 140,
        render: (e, r) => (
          <span>
            <a onClick={this.editFn.bind(this, r)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={this.delFn.bind(this, e)}>删除</a>
          </span>
        ),
      },
    ];
    const { tableData } = this.state;
    return (
      <div className={Css.content} style={{ border: '1px solid #E8E8E8' }}>
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{ pageSize: 50 }}
          scroll={{ y: 240 }}
          size="middle"
        />
      </div>
    );
  }
}

export default LotteryTable;
