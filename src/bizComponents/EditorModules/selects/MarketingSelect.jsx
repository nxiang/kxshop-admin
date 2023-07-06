// 营销活动选择
import React, { Component } from 'react';
import { Modal, Table, message } from 'antd';
import Css from './MarketingSelect.module.scss';

import { choseMarketingActivity } from '@/services/shop';

const { Column } = Table;

class MarketingSelect extends Component {
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
    };
  }

  choseMarketingActivityApi(page) {
    let data = {
      page: page || 1,
      pageSize: this.state.sourcePage.pageSize,
    };
    choseMarketingActivity(data).then(res => {
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

  empty(e) {
    this.props.alterData('');
    e.stopPropagation();
  }

  showModal = () => {
    this.choseMarketingActivityApi();
    this.setState({
      visible: true,
    });
  };

  handleOk = record => {
    console.log(record);
    let data = {
      id: record.id,
      value: record.name,
    };
    this.props.alterData(data);
    this.setState({
      visible: false,
    });
    message.success('分类设置完成');
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div className={Css['marketing-select-box']}>
        <div
          style={{ width: this.props.width ? `${this.props.width}px` : '238px' }}
          className={Css['selectInput']}
          onClick={this.showModal}
        >
          {this.props.itemData && this.props.itemData.value
            ? this.props.itemData.value
            : '请选择要跳转的内容'}
          {this.props.itemData && this.props.itemData.value ? (
            <img
              onClick={this.empty.bind(this)}
              className={Css['slesctImg']}
              src="https://img.kxll.com/admin_manage/del-icon.png"
            />
          ) : null}
        </div>
        <Modal
          title="营销活动选择"
          width={'674px'}
          footer={null}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>请选择要使用的营销活动</p>
          <Table
            ellipsis
            rowKey={record => record.id}
            dataSource={this.state.listData}
            pagination={{
              current: this.state.sourcePage.current,
              pageSize: this.state.sourcePage.pageSize,
              total: this.state.sourcePage.total,
              onChange: page => this.choseMarketingActivityApi(page),
            }}
          >
            <Column align="center" title="营销活动ID" dataIndex="id" />
            <Column align="center" title="营销活动名称" dataIndex="name" />
            <Column
              align="center"
              title="操作"
              render={record => (
                <div className={Css['bule-text']} onClick={this.handleOk.bind(this, record)}>
                  选择
                </div>
              )}
            />
          </Table>
        </Modal>
      </div>
    );
  }
}

export default MarketingSelect;
