import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Button, message } from 'antd';
import Css from './addRemark.module.scss';
import { setUserRemark } from '@/services/queryUser';

const { TextArea } = Input;

class AddRemark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      memberId: '',
    };
  }

  componentDidMount() {
    // 调用父组件方法把当前实例传给父组件
    this.props.onRef('addRemarkModule', this);
  }

  // 打开弹窗
  showModal = memberId => {
    console.log(this.props.remark);
    this.setState(
      {
        visible: true,
        memberId,
      },
      () => {
        this.props.form.setFieldsValue({
          remark: this.props.remark,
        });
      }
    );
  };

  handleOk = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return false;
      }
      const remarkData = {
        remark: values.remark, // 标签名称
        memberId: this.state.memberId,
      };
      const info = await setUserRemark(remarkData);
      if (info.errorCode == 0) {
        message.success('备注添加成功');
        this.props.moduleSuccess();
      }
      this.setState({
        visible: false,
      });
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="添加备注"
        visible={visible}
        width="672px"
        destroyOnClose="true"
        footer={null}
        onCancel={this.handleCancel}
      >
        <div className={Css['add-remark-box']}>
          <div className={Css['add-remark-content']}>
            <Form layout="inline" labelCol={{ span: 4 }}>
              <Form.Item label="备注">
                {getFieldDecorator('remark', {
                  rules: [
                    {
                      required: true,
                      message: '备注不能为空',
                    },
                    {
                      max: 50,
                      message: '备注信息过长',
                    },
                  ],
                })(
                  <TextArea style={{ width: 400, marginLeft: 30 }} placeholder="请输入，50字以内" />
                )}
              </Form.Item>
            </Form>
          </div>
          <div className={Css['add-remark-footer']}>
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

export default Form.create()(AddRemark);
