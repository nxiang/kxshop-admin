// 营销活动选择
import React, { Component } from 'react';
import { Modal, Table, message } from 'antd';
import Css from './ShareCouponSelect.module.scss';
import { scList } from '@/services/activity';

const { Column } = Table;

class ShareCouponSelect extends Component {
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
      status: 2,
    };
    scList(data).then(res => {
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
      id: record.activityId,
      value: record.activityName,
    };
    this.props.alterData(data);
    this.setState({
      visible: false,
    });
    message.success('选择完成');
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
          title="选择活动"
          width={'674px'}
          footer={null}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>请选择分享领券活动，列表仅显示进行中的活动</p>
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
            <Column align="center" title="活动ID" dataIndex="activityId" />
            <Column align="center" title="活动名称" dataIndex="activityName" />
            <Column
              align="center"
              title="活动渠道"
              dataIndex="availableClientIds"
              render={r => {
                let txt = '';
                if (r && (r + '').indexOf(1) >= 0) {
                  txt += '支付宝';
                }
                if (r && (r + '').indexOf(2) >= 0) {
                  txt += '微信';
                }
                return <span>{txt}</span>;
              }}
            />
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

export default ShareCouponSelect;
