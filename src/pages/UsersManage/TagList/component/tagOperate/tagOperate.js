/*
 *   author:langyan
 *   date：20200302
 *  explain:  标签管理操作组件
 * */
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, message, Button } from 'antd';
import { tagDetail, addTag, editTag } from '@/services/tagModule';
import Css from './tagOperate.module.scss';

const { TextArea } = Input;

class TagOperate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      tagId: '', // 标签id
      // tagData: {}
    };
  }

  componentDidMount() {
    const { onRef } = this.props;
    // 调用父组件方法把当前实例传给父组件
    onRef('tagOperateModule', this);
  }

  // 获取标签详情数据
  async getTagDetail() {
    const { form } = this.props;
    const { tagId } = this.state;
    const { setFieldsValue } = form;
    const { data } = await tagDetail({ tagId });
    if (!data) return;
    setFieldsValue({
      tagName: data.tagName,
      condition: data.condition,
    });
    // this.setState({
    //   tagData: data
    // });
  }

  // 打开弹窗
  showModal = tagId => {
    this.setState(
      {
        visible: true,
        tagId,
      },
      () => {
        if (tagId) {
          this.getTagDetail();
        }
      }
    );
  };

  handleOk = e => {
    const { form, moduleSuccess } = this.props;
    const { tagId } = this.state;
    const { validateFields } = form;
    e.preventDefault();
    validateFields(async (err, values) => {
      if (err) {
        return false;
      }
      let info;
      if (tagId) {
        const tagPostData = {
          tagId,
          tagName: values.tagName, // 标签名称
          tagType: 0,
          condition: values.condition != undefined ? values.condition : '',
        };
        info = await editTag(tagPostData);
      } else {
        const tagPostData = {
          tagName: values.tagName, // 标签名称
          tagType: 0,
          condition: values.condition != undefined ? values.condition : '',
        };
        info = await addTag(tagPostData);
      }
      if (info.errorCode == 0) {
        if (tagId) {
          message.success('标签修改成功');
        } else {
          message.success('标签添加成功');
        }
        moduleSuccess();
        this.setState({
          visible: false,
        });
      }
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { form } = this.props;
    const { visible, tagId } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={tagId === '' ? '新增标签' : '编辑标签'}
        visible={visible}
        width="672px"
        destroyOnClose="true"
        footer={null}
        onCancel={this.handleCancel}
      >
        <div className={Css['tag-opera-content']}>
          <Form labelCol={{ span: 4 }}>
            <Form.Item label="标签名称">
              {getFieldDecorator('tagName', {
                rules: [
                  {
                    required: true,
                    message: '标签名称不能为空',
                  },
                  {
                    max: 12,
                    message: '标签名称过长',
                  },
                ],
              })(<Input style={{ width: 248 }} placeholder="请输入，12个字以内" />)}
            </Form.Item>
            <Form.Item label="标签类型">
              <span>手动标签</span>
            </Form.Item>
            <Form.Item label="打标条件">
              {getFieldDecorator('condition', {
                rules: [
                  {
                    max: 50,
                    message: '打标条件过长',
                  },
                ],
              })(<TextArea style={{ width: 468 }} placeholder="手动备注打标的条件，50字以内" />)}
            </Form.Item>
          </Form>
          <div className={Css['tag-opera-footer']}>
            <Button
              key="confirm"
              className={Css['ant-btn-custom-circle']}
              type="primary"
              onClick={this.handleOk}
            >
              保存
            </Button>
            <Button
              key="cancel"
              className={Css['ant-btn-custom-circle']}
              onClick={this.handleCancel}
            >
              取消
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(TagOperate);
