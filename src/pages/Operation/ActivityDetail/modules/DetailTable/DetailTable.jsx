import React, { Component } from 'react';
import Css from './DetailTable.module.scss';
import { Button, Input, Table } from 'antd';
import { lotteryList, exportData } from '@/services/activity';
import SelectDate from '@/components/SelectDate/SelectDate';
import { showBut } from '@/utils/utils';
import { withRouter } from '@/utils/compatible';

const { Column } = Table;

class DetailTable extends Component {
  
  state = {
    searchForm: {
      activityId: this.props.fprops.location.state?.id,
      keyword: '',
      beginTime: null,
      endTime: null,
    },
    exportData: {
      activityId: this.props.fprops.location.state?.id,
    },
    tableData: {},
  };

  componentDidMount() {
    console.log('this.props.fprops',this.props.fprops)
    this.getRecord();
  }

  async getRecord() {
    let data = this.state.searchForm;
    if (this.props.tabKey === 'winDetail') {
      data = { ...data, ...{ isWin: 1 } };
    }
    const info = await lotteryList(data);
    if (info) {
      this.setState({
        tableData: info.data,
        exportData: data,
      });
      console.log(info.data);
    }
  }

  // 输入昵称或手机号
  setKeyWord(e) {
    this.setState({
      searchForm: {
        ...this.state.searchForm,
        keyword: e.target.value,
      },
    });
  }

  // 选择活动时间
  setDate(phase, date) {
    console.log(phase, date);
    if (date) {
      date = date.format('YYYY-MM-DD HH:mm');
    }
    this.setState({
      searchForm: {
        ...this.state.searchForm,
        [`${phase}Time`]: date,
      },
    });
  }

  // 全部导出
  async exportDataFn() {
    let data = this.state.exportData;
    if (this.props.tabKey === 'winDetail') {
      data = { ...data, ...{ isWin: 1 } };
    }
    const info = await exportData(data);
    if (info) {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([info]));
      link.target = '_blank';
      link.download = 'data.xls';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // 动态显示记录编号
  filterRecord() {
    console.log(this.props.tabKey);
    return this.props.tabKey === 'drawRecord' ? (
      <Column align="left" title="记录编号" dataIndex="recordId" key="recordId" />
    ) : (
      ''
    );
  }
  
  // 分页
  paginationChange(e) {
    this.setState(
      {
        searchForm: {
          ...this.state.searchForm,
          page: e,
        },
      },
      () => {
        this.getRecord();
      }
    );
  }

  render() {
    const { tableData } = this.state;
    const { rows } = tableData;
    return (
      <div className={Css.DetailTableBox}>
        <div className={Css.ButtonBox}>
          <Input
            placeholder="用户昵称/手机号码"
            onChange={this.setKeyWord.bind(this)}
            className={Css.keyWord}
          />
          <span>抽奖时间：</span>
          <SelectDate onSelectDate={this.setDate.bind(this)} />
          <Button type="primary" className={Css.Filter} onClick={this.getRecord.bind(this)}>
            筛选
          </Button>
          {showBut('activitysList', 'activitys_list_export') && (
            <Button type="primary" className={Css.export} onClick={this.exportDataFn.bind(this)}>
              全部导出
            </Button>
          )}
        </div>
        <div>
          <Table
            pagination={{
              current: tableData.current,
              pageSize: tableData.pageSize,
              total: tableData.total,
              onChange: this.paginationChange.bind(this),
            }}
            dataSource={rows}
          >
            {this.filterRecord()}
            {/* <Column align="left" title="昵称" dataIndex="memberName" key="memberName" /> */}
            <Column
              align="left"
              title="昵称"
              key="memberId"
              render={record => record.memberName || record.memberId}
            />
            <Column align="left" title="手机号" dataIndex="memberMobile" key="memberMobile" />
            <Column
              align="left"
              title="中奖状态"
              dataIndex="isWin"
              key="isWin"
              render={e => (e ? '已中奖' : '未中奖')}
            />
            <Column
              align="left"
              title="奖项名称"
              key="prizeConfName"
              render={(text, record) => (record.isWin ? record.prizeConfName : '--')}
            />
            <Column align="left" title="抽奖时间" dataIndex="createTime" key="createTime" />
          </Table>
        </div>
      </div>
    );
  }
}

export default withRouter(DetailTable);
