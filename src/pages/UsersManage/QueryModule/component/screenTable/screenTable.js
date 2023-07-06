import React, { Component } from 'react';
import { Table, Tooltip } from 'antd';
import Css from './screenTable.module.scss';
import { showBut } from '@/utils/utils';
import userIcon from '@/assets/images/user-icon.png'

const { Column } = Table;

class ScreenTable extends Component {
  constructor(props) {
    super(props);
  }

  // 用户信息
  userInfo(e) {
    return (
      <div className={Css['screen-user-info']}>
        {e.avatar ? (
          <img className={Css.img} src={e.avatar} alt="" />
        ) : (
          <img className={Css.img} src={userIcon} alt="" />
        )}
        <div className={Css['user-info-text']}>
          <b>{e.nickname}</b>
          <p>用户ID: {e.memberId}</p>
          <p>{e.mobile}</p>
        </div>
      </div>
    );
  }

  // 表格操作
  screenOperation(e) {
    return (
      <div className={Css['screen-button-style']}>
        <div className={Css['button-style-item']}>
          {showBut('list', 'users_add_label') && (
            <a onClick={() => this.props.screenTableButton(1, e.memberId)}>加标签</a>
          )}
          &nbsp;&nbsp;|&nbsp;&nbsp;
          {showBut('list', 'users_coupon') && (
            <a onClick={() => this.props.screenTableButton(2, e.memberId)}>送优惠券</a>
          )}
        </div>
        <div className={Css['button-style-item']}>
          {showBut('list', 'users_detail') && (
            <a onClick={() => this.props.screenTableButton(3, e.memberId)}>详情</a>
          )}
        </div>
      </div>
    );
  }

  render() {
    const { userData } = this.props;
    console.log('user=', userData.row);
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        const memberIds = [];
        selectedRows &&
          selectedRows.forEach(item => {
            memberIds.push(item.memberId);
          });
        this.props.batchScreenUse(memberIds);
      },
    };
    return (
      <div className={Css['screen-table']}>
        <Table
          rowSelection={rowSelection}
          dataSource={userData.rows}
          rowKey="memberId"
          pagination={{
            current: userData.current,
            pageSize: userData.pageSize,
            total: userData.total,
            onChange: this.props.paginationChange,
          }}
        >
          <Column
            align="center"
            ellipsis
            title="用户信息"
            width="240px"
            key="memberId"
            render={this.userInfo.bind(this)}
          />
          <Column
            align="center"
            ellipsis
            title="交易笔数"
            dataIndex="tradeQuantity"
            key="tradeQuantity"
          />
          <Column
            align="center"
            ellipsis
            title="交易总额"
            dataIndex="tradeAmount"
            key="tradeAmount"
          />
          <Column
            align="center"
            ellipsis
            title="积分"
            dataIndex="presentPoints"
            key="presentPoints"
          />
          <Column
            align="center"
            ellipsis
            title="平均交易金额"
            dataIndex="avgTradeAmount"
            key="avgTradeAmount"
          />
          <Column
            align="center"
            ellipsis
            title="退款笔数"
            dataIndex="refundQuantity"
            key="refundQuantity"
          />
          <Column
            align="center"
            ellipsis
            title="退款总额"
            dataIndex="refundAmount"
            key="refundAmount"
          />
          <Column
            align="center"
            ellipsis
            title="上次交易时间"
            dataIndex="lastTradeTime"
            key="lastTradeTime"
          />
          <Column
            align="center"
            ellipsis
            title="操作"
            width="150px"
            key="action"
            render={this.screenOperation.bind(this)}
          />
        </Table>
      </div>
    );
  }
}

export default ScreenTable;
