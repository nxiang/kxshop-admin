import React, { Component } from 'react';
import Css from './SubClass.module.scss';
import { message, Modal, Input, InputNumber } from 'antd';

// 引入接口
import { storeLabelAdd } from '@/services/storeLabel';

class SubClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      parentId: null,
      storeLabelName: '',
      storeLabelSort: '',
      // 请求阀门
      apiValve: false,
    };
  }

  // 输入change事件
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value.trim(),
    });
  };

  // 子类目
  subClassShowModal(storeLabelId) {
    this.setState({
      parentId: storeLabelId,
      visible: true,
    });
  }

  // 子类目确认
  subClassOk() {
    const { storeLabelName, storeLabelSort, parentId, apiValve } = this.state;
    if (storeLabelName === '') {
      message.warning('类目名称不能为空');
      return;
    }
    if (storeLabelSort === '' || storeLabelSort === null) {
      message.warning('类目排序不能为空');
      return;
    }
    if (storeLabelSort < 0) {
      message.warning('类目排序不能小于0');
      return;
    }
    if (apiValve) {
      return;
    }
    this.setState(
      {
        apiValve: true,
      },
      () => {
        storeLabelAdd({
          parentId: parentId,
          storeLabelName: storeLabelName,
          storeLabelSort: storeLabelSort,
        })
          .then(res => {
            if (res.errorCode === '0') {
              message.success('子类目添加成功');
              this.setState({
                visible: false,
                storeLabelName: '',
                storeLabelSort: '',
                apiValve: false,
              });
              this.props.storeLabelListApi();
            } else {
              this.setState({
                apiValve: false,
              });
            }
          })
          .catch(() => {
            this.setState({
              apiValve: false,
            });
          });
      }
    );
  }

  // 子类目取消
  subClassCancel() {
    this.setState({
      visible: false,
      storeLabelName: '',
      storeLabelSort: '',
    });
  }

  render() {
    const { storeLabelName, storeLabelSort } = this.state;
    return (
      <Modal
        title="添加子类目"
        width={'580px'}
        visible={this.state.visible}
        onOk={this.subClassOk.bind(this)}
        onCancel={this.subClassCancel.bind(this)}
      >
        <div className={Css['modal-class-box']}>
          <p className={Css['modal-class-title']}>类目名称：</p>
          <div className={Css['modal-class-content']}>
            <Input
              style={{ width: '325px' }}
              placeholder={'请输入，十五个字以内'}
              maxLength={15}
              name="storeLabelName"
              value={storeLabelName}
              onChange={this.onChange.bind(this)}
            />
          </div>
        </div>
        <div className={Css['modal-class-box']}>
          <p className={Css['modal-class-title']}>类目排序：</p>
          <div className={Css['modal-class-content']}>
            <InputNumber
              style={{ width: '325px' }}
              placeholder={'请输入0-9999'}
              min={0}
              max={9999}
              value={storeLabelSort}
              onChange={e => {
                this.setState({
                  storeLabelSort: e,
                });
              }}
            />
            <p className={Css['content-text']}>数值越大排序越靠前</p>
          </div>
        </div>
      </Modal>
    );
  }
}

export default SubClass;
