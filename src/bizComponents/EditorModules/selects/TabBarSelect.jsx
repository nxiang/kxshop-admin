// 专题页选择
import React, { Component } from 'react';
import { Modal, Table, message } from 'antd';
import { withRouter } from '@/utils/compatible'
import Css from './SpecialSelect.module.scss';

import { choseTheme } from '@/services/shop';

const { Column } = Table;

class TabBarSelect extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      visible: false,
      listData: [
        {
          specialName: '首页',
          selected: false,
        },
        {
          specialName: '分类页',
          selected: true,
        },
        {
          specialName: '购物车',
          selected: true,
        },
        {
          specialName: '我的(个人中心)',
          selected: false,
        },
      ],
    };
  }
  empty(e) {
    if (!this.props.disabled) {
      this.props.alterData('');
      e.stopPropagation();
    }
  }
  showModal = () => {
    if (this.props.itemData.value != '首页' && this.props.itemData.value != '我的') {
      this.setState({
        visible: true,
      });
    }
  };

  handleOk = record => {
    console.log(record);
    let data = {
      //   id: record.storeSpecialId,
      value: record.specialName,
    };
    this.props.alterData(data);
    this.setState({
      visible: false,
    });
    message.success('设置成功');
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const storeSpecialId = this.props.match.params.storeSpecialId || '';
    console.log(storeSpecialId);
    return (
      <div className={Css['special-select-box']}>
        <div
          style={{
            width: this.props.width ? `${this.props.width}px` : '238px',
            background: this.props.disabled ? '#eee' : '#fff',
          }}
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
          title="页面选择"
          width={'674px'}
          footer={null}
          visible={this.state.visible}
          onCancel={this.handleCancel}
        >
          <p>请选择页面</p>
          <Table ellipsis bordered rowKey={record => record} dataSource={this.state.listData}>
            <Column align="center" title="页面名称" dataIndex="specialName" />
            <Column
              align="center"
              title="操作"
              render={record => (
                <>
                  {record.selected ? (
                    <div className={Css['bule-text']} onClick={this.handleOk.bind(this, record)}>
                      选择
                    </div>
                  ) : (
                    <div>不支持选择</div>
                  )}
                </>
              )}
            />
          </Table>
        </Modal>
      </div>
    );
  }
}

export default withRouter(TabBarSelect);
