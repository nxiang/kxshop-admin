import React, { Component } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Table, Modal } from 'antd';
import Css from './ClassifySelect.module.scss';

import { choseStoreLabel, choseStoreLabelGoods } from '@/services/shop';
import { storeLabelList } from '@/services/storeLabel';

const { Column } = Table;

class ClassifySelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      listData: [],
      // sourcePage: {
      //   current: 1,
      //   pageSize: 10,
      //   total: 0,
      // },
    };
  }

  storeLabelListApi() {
    const that = this;
    // this.setState(
    //   {
    //     spinIs: true,
    //   },
    //   () => {
    storeLabelList({})
      .then(res => {
        if (res.errorCode === '0') {
          that.setState({
            listData: res.data.list,
          });
        }
        // this.setState({
        //   spinIs: false,
        // });
      })
      .catch(() => {
        // this.setState({
        //   spinIs: false,
        // });
      });
    //   }
    // );
  }

  // choseStoreLabelApi(page) {
  //   let data = {
  //     page: page || 1,
  //     pageSize: this.state.sourcePage.pageSize
  //   };
  //   choseStoreLabel(data).then(res => {
  //     this.setState({
  //       listData: res.data.rows,
  //       sourcePage: {
  //         current: res.data.current,
  //         pageSize: res.data.pageSize,
  //         total: res.data.total,
  //       }
  //     })
  //   })
  // }

  showModal = () => {
    this.storeLabelListApi();
    // this.choseStoreLabelApi()
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  ClassChoice(record) {
    const { itemType, alterData } = this.props;
    choseStoreLabelGoods({
      storeLabelId: record.storeLabelId,
      itemType,
    }).then(res => {
      const data = res.data.rows;
      alterData(data);
      this.setState({
        visible: false,
      });
    });
  }

  render() {
    return (
      <div className={Css['goods-select-box']}>
        <div className={Css['goods-add-item']} onClick={this.showModal}>
          <PlusOutlined />
          <p className={Css['goods-add-item-text']}>添加商品</p>
        </div>
        <Modal
          title="分类选择"
          width={'674px'}
          footer={null}
          visible={this.state.visible}
          onCancel={this.handleCancel}
        >
          <p>请选择要展示的分类</p>
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
                <div className={Css['bule-text']} onClick={this.ClassChoice.bind(this, record)}>
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

export default ClassifySelect;
