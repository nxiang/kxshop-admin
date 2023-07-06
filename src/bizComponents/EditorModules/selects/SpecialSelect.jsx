// 专题页选择
import React, { Component } from 'react';
import { Modal, Table, message } from 'antd';
import { withRouter } from '@/utils/compatible'
import Css from './SpecialSelect.module.scss';

import { choseTheme } from '@/services/shop';

const { Column } = Table;

class SpecialSelect extends Component {
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

  choseThemeApi(page) {
    const data = {
      page: page || 1,
      pageSize: this.state.sourcePage.pageSize,
    };
    choseTheme(data).then(res => {
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
    this.choseThemeApi();
    this.setState({
      visible: true,
    });
  };

  handleOk = record => {
    console.log(record);
    const data = {
      id: record.storeSpecialId,
      value: record.specialName,
    };
    this.props.alterData(data);
    this.setState({
      visible: false,
    });
    message.success('专题页设置完成');
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  
  render() {
    const storeSpecialId = this.props.match.params.storeSpecialId || '';
    console.log(storeSpecialId);
    console.log('itemDataxxxx',this.props.itemData)
    return (
      <div className={Css['special-select-box']}>
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
          title="专题页选择"
          width="674px"
          footer={null}
          visible={this.state.visible}
          onCancel={this.handleCancel}
        >
          <p>请选择要跳转的专题页</p>
          <Table
            ellipsis
            rowKey={record => record}
            dataSource={this.state.listData}
            pagination={{
              current: this.state.sourcePage.current,
              pageSize: this.state.sourcePage.pageSize,
              total: this.state.sourcePage.total,
              onChange: page => this.choseThemeApi(page),
            }}
          >
            <Column align="center" title="专题ID" dataIndex="storeSpecialId" />
            <Column align="center" title="名称" dataIndex="specialName" />
            <Column
              align="center"
              title="操作"
              render={record => (
                <>
                  {storeSpecialId != record.storeSpecialId ? (
                    <div className={Css['bule-text']} onClick={this.handleOk.bind(this, record)}>
                      选择
                    </div>
                  ) : (
                    <div />
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

export default withRouter(SpecialSelect);
