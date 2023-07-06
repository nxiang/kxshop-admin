import React, { Component } from 'react';
import Css from './AddClass.module.scss';
import { message, Button, Modal, Input, InputNumber } from 'antd';
import { showBut } from '@/utils/utils';
// 引入接口
import { storeLabelAdd } from '@/services/storeLabel';

class AddClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      addName: '',
      addRank: '',
      apiValve: false,
    };
  }

  // 输入change事件
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value.trim(),
    });
  };

  // 新增类目
  addClassShowModal() {
    this.setState({
      visible: true,
    });
  }

  // 新增类目确认
  addClassOk() {
    const { addName, addRank, apiValve } = this.state;
    if (addName === '') {
      message.warning('类目名称不能为空');
      return;
    }
    if (addRank === '' || addRank === null) {
      message.warning('类目排序不能为空');
      return;
    }
    if (addRank < 0) {
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
          storeLabelName: addName,
          storeLabelSort: addRank,
        })
          .then(res => {
            if (res.errorCode === '0') {
              message.success('类目添加成功');
              this.setState({
                visible: false,
                addName: '',
                addRank: '',
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

  // 新增类目取消
  addClassCancel() {
    this.setState({
      visible: false,
      addName: '',
      addRank: '',
    });
  }

  render() {
    const { addName, addRank } = this.state;
    return (
      <span>
        {showBut('classifyList', 'classifyList_addCategory') ? (
          <Button
            style={{ marginBottom: '16px' }}
            type="primary"
            onClick={this.addClassShowModal.bind(this)}
          >
            添加类目
          </Button>
        ) : null}
        <Modal
          title="添加类目"
          width={'580px'}
          visible={this.state.visible}
          onOk={this.addClassOk.bind(this)}
          onCancel={this.addClassCancel.bind(this)}
        >
          <div className={Css['modal-class-box']}>
            <p className={Css['modal-class-title']}>类目名称：</p>
            <div className={Css['modal-class-content']}>
              <Input
                style={{ width: '325px' }}
                placeholder={'请输入，五个字以内'}
                maxLength={5}
                name="addName"
                value={addName}
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
                value={addRank}
                onChange={e => {
                  this.setState({
                    addRank: e,
                  });
                }}
              />
              <p className={Css['content-text']}>数值越大排序越靠前</p>
            </div>
          </div>
        </Modal>
      </span>
    );
  }
}

export default AddClass;
