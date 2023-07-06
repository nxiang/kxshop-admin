/*
 *   author:langyan
 *   date：20200302
 *  explain:  标签管理查看组件
 * */
import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import Css from './lookTag.module.scss';
import { tagDetail } from '@/services/tagModule';

class LookTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      tagId: '',
      tagData: {},
    };
  }

  componentDidMount() {
    const { onRef } = this.props;
    // 调用父组件方法把当前实例传给父组件
    onRef('lookTagModule', this);
  }

  // 获取标签详情数据
  async getTagDetail() {
    const { tagId } = this.state;
    const { data } = await tagDetail({ tagId });
    this.setState({
      tagData: data,
    });
  }

  // 打开弹窗
  showModal = tagId => {
    this.setState(
      {
        visible: true,
        tagId,
      },
      () => {
        this.getTagDetail();
      }
    );
  };

  // 关闭弹窗
  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { visible, tagData } = this.state;
    return (
      <Modal
        title="查看"
        visible={visible}
        width="672px"
        destroyOnClose="true"
        onCancel={() => this.handleCancel()}
        footer={null}
      >
        <ul className={Css['look-tag-box']}>
          <li className={Css['look-tag-item']}>
            <p>标签名称：</p>
            <span>{tagData.tagName}</span>
          </li>
          <li className={Css['look-tag-item']}>
            <p>标签类型：</p>
            {tagData.tagType === 0 ? <span>手动标签</span> : <span>自动标签</span>}
          </li>
          <li className={Css['look-tag-item']}>
            <p>打标条件：</p>
            <span>{tagData.condition}</span>
          </li>
        </ul>
        <div className={Css['look-tag-footer']}>
          <Button type="primary" onClick={() => this.handleCancel()}>
            关闭
          </Button>
        </div>
      </Modal>
    );
  }
}

export default LookTag;
