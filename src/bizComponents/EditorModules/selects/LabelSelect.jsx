// 商品分类选择
import React, { Component } from 'react';
import { Modal, Table, message } from 'antd';
import Css from './LabelSelect.module.scss';

import { storeLabelList } from '@/services/storeLabel';

const { Column } = Table;

class LabelSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      listData: [],
    };
  }

  storeLabelListApi() {
    const that = this;
    this.setState(
      {
        spinIs: true,
      },
      () => {
        storeLabelList()
          .then(res => {
            if (res.errorCode === '0') {
              that.setState({
                listData: res.data.list,
              });
            }
            this.setState({
              spinIs: false,
            });
          })
          .catch(() => {
            this.setState({
              spinIs: false,
            });
          });
      }
    );
  }

  empty(e) {
    this.props.alterData('');
    e.stopPropagation();
  }

  showModal = () => {
    this.storeLabelListApi();
    // this.choseStoreLabelApi()
    this.setState({
      visible: true,
    });
  };

  handleOk = record => {
    console.log(record);
    let data = {
      id: record.storeLabelId,
      value: record.storeLabelName,
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
      <div className={Css['label-select-box']}>
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
          title="商品分类选项"
          width={'674px'}
          footer={null}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>请选择要跳转的分类</p>
          <Table
            ellipsis
            childrenColumnName="childList"
            rowKey={record => record.storeLabelId}
            dataSource={this.state.listData}
          >
            <Column align="center" title="分类ID" dataIndex="storeLabelId" />
            <Column align="center" title="分类名称" dataIndex="storeLabelName" />
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

export default LabelSelect;
