/*
 *   author:langyan
 *   date：20200302
 *  explain:  标签管理删除组件
 * */
import React, { Component } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Modal, message } from 'antd';
import Css from './deleteTag.module.scss';
import { deleteTag } from '@/services/tagModule';

class DeleteTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      tagId: '',
    };
  }

  componentDidMount() {
    const { onRef } = this.props;
    // 调用父组件方法把当前实例传给父组件
    onRef('deleteTagModule', this);
  }

  // 打开弹窗
  showModal = tagId => {
    this.setState({
      visible: true,
      tagId,
    });
  };

  // 关闭弹窗  1确定 2取消
  async handleCancel(typeId) {
    const { tagId } = this.state;
    const { moduleSuccess } = this.props;
    if (typeId === 1) {
      const info = await deleteTag({ tagId });
      if (info.errorCode == 0) {
        moduleSuccess();
        message.success('标签删除成功');
      }
    }

    this.setState({
      visible: false,
    });
  }

  render() {
    const { visible } = this.state;
    return (
      <Modal
        title="提示"
        visible={visible}
        width="571px"
        onCancel={() => this.handleCancel(2)}
        destroyOnClose="true"
        footer={null}
      >
        <div className={Css['delete-tag-tips']}>
          <CloseCircleOutlined className={Css.anticon} />
          删除标签不可恢复，同时会解除与用户的关联关系，确定删除？
        </div>
        <div className={Css['delete-tag-footer']}>
          <Button className={Css['footer-btn']} type="primary" onClick={() => this.handleCancel(1)}>
            确认
          </Button>
          <Button className={Css['footer-btn']} onClick={() => this.handleCancel(2)}>
            取消
          </Button>
        </div>
      </Modal>
    );
  }
}

export default DeleteTag;
