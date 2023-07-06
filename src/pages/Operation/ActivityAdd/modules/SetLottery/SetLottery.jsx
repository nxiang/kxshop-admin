import React, { Component } from 'react';
import Css from '../common.module.scss';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Upload, Modal, Button, message } from 'antd';
import LotteryTable from './modules/LotteryTable/LotteryTable';
import AddLottery from './modules/AddLottery/AddLottery';
import UploadMsg from '@/components/UploadMsg/UploadMsg';
import { withRouter } from '@/utils/compatible'
import { noPrizeAdd, noPrizeInfo, noPrizeEdit } from '@/services/activity';
import { connect } from 'dva';

import { stepPage, stepPrev, lotteryItem } from '@/actions/index';

function beforeUpload(file) {
  console.log(file);
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
  if (!isJpgOrPng) {
    message.error('仅支持jpg、png、jpeg格式');
  }
  const isLt40M = file.size / 1024 < 200;
  if (!isLt40M) {
    message.error('文件不能大于200K');
  }
  return isLt40M;
}
@connect(activitys => ({
  ...activitys,
}))
class SetLottery extends Component {
  state = {
    loading: false,
    visible: false,
    losingLotteryImage: false,
    initData: {},
    defaultImage: {
      losingLotteryImage: 'https://img.kxll.com/admin_manage/nisimg_7_202034.png',
    },
    isAdd: true,
  };

  componentDidMount() {
    if (this.props.addType == 'page') this.initData();
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };

  async initData() {
    const { activitys, form } = this.props;
    const info = await noPrizeInfo({ activityId: activitys.activityId });
    if (info) {
      console.log(info);
      if (info.data.losingLotteryHint == null) {
        return false;
      }
      //不为null说明就是修改设置
      this.setState({
        losingLotteryImage: info.data.losingLotteryImage,
        isAdd: false,
      });
      form.setFieldsValue({
        losingLotteryHint: info.data.losingLotteryHint,
        losingLotteryImage: info.data.losingLotteryImage,
        losingLotteryName: info.data.losingLotteryName,
      });
    }
  }

  // 上传文件
  UploadProps = {
    name: 'file',
    action: '/proxy/cloud/oss/upload?type=marketing',
    headers: {
      //   userToken: Cookies.get('userToken'),
    },
    data: {
      // type: "marketing"
    },
    beforeUpload: beforeUpload,
    showUploadList: false,
    response: '{"status": "success"}',
    onChange: info => {
      const that = this;
      console.log('info', info);
      if (info.file.status === 'uploading') {
        that.setState({
          documentSpin: true,
        });
      } else if (info.file.status === 'done') {
        if (info.file.response) {
          if (info.file.response.errorCode === '0') {
            message.success(`${info.file.name} 上传成功`);
            that.setState({
              losingLotteryImage: info.file.response.data.url,
            });
            if (this.props.addType == 'component')
              dispatch({
                type: 'activitys/losing lottery image',
                payload: info.file.response.data.url,
              });
          } else {
            message.error(`${info.file.name} 上传失败`);
          }
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  goBack() {
    this.props.dispatch(stepPrev());
  }

  showModal = type => {
    this.props.dispatch(lotteryItem(false));
    if (type == 'change') {
      //奖项内容发生变化
      this.tableChild.initData();
    }
    const blean = !this.state.visible;
    this.setState({
      visible: blean,
    });
  };
  onRef = ref => {
    this.tableChild = ref;
  };

  setDefault() {
    this.setState({
      losingLotteryImage: false,
    });
    if (this.props.addType == 'component')
      dispatch({
        type: 'activitys/losing lottery image',
        payload: 'https://img.kxll.com/admin_manage/nisimg_7_202034.png',
      });
  }

  handleSubmit() {
    this.setState({ loading: true }, () => {
      this.props.form.validateFields(async (err, values) => {
        console.log(values);
        if (err) {
          this.setState({ loading: false });
          return false;
        }
        const data = {
          activityId: this.props.activitys.activityId,
          losingLotteryName: values['losingLotteryName'],
          losingLotteryHint: values['losingLotteryHint'],
          losingLotteryImage:
            this.state.losingLotteryImage || this.state.defaultImage.losingLotteryImage,
        };
        console.log(this.state.isAdd);
        if (this.state.isAdd) {
          const info = await noPrizeAdd(data);
          if (info) {
            message.success('设置成功');
            this.props.dispatch(stepPage());
          }
        } else {
          const info = await noPrizeEdit(data);
          if (info) {
            message.success('修改成功');
            this.props.dispatch(stepPage());
          }
        }
        this.setState({ loading: false });
      });
    });
  }

  componentInputChange(e, name) {
    const { dispatch } = this.props;
    let value = e.target.value;
    dispatch({
      type: 'activitys/' + name,
      payload: value,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const imgurl = this.state.losingLotteryImage || this.state.defaultImage.losingLotteryImage;
    return (
      <div className={Css.content}>
        <div className={Css.header}>
          <span className={Css.title}>设置奖项</span>
          <span className={Css.msg}>*最多支持添加6个奖项</span>
          <Button
            type="primary"
            style={{ float: 'right', marginTop: -5 }}
            onClick={this.showModal.bind(this)}
          >
            添加奖项
          </Button>
          {this.state.visible && (
            <Modal
              title="添加奖项"
              width={610}
              visible={this.state.visible}
              footer={null}
              onCancel={this.showModal.bind(this)}
            >
              <AddLottery addType={this.props.addType} showModal={this.showModal.bind(this)} />
            </Modal>
          )}
        </div>
        <LotteryTable
          onRef={this.onRef}
          addType={this.props.addType}
          showModal={this.showModal.bind(this)}
        />
        <div className={Css.header} style={{ marginTop: 24 }}>
          <span className={Css.title}>未中奖设置</span>
          <span className={Css.msg}>*用户未中奖</span>
        </div>
        {this.props.addType == 'page' && (
          <Form labelCol={{ span: 3 }}>
            <Form.Item label="名称">
              {getFieldDecorator('losingLotteryName', {
                initialValue: '谢谢参与',
                rules: [
                  {
                    required: true,
                    message: '名称不能为空',
                  },
                  {
                    max: 15,
                    message: '名称过长',
                  },
                ],
              })(<Input style={{ width: 435 }} placeholder="请输入名称，15个字以内" />)}
            </Form.Item>
            <Form.Item label="图片">
              <div className={Css.uploadBox}>
                {getFieldDecorator('losingLotteryImage')(
                  <Upload {...this.UploadProps}>
                    <div className={Css.iconBtn}>
                      <img src={imgurl} />
                      <div className={Css.iconTxt}>替换</div>
                    </div>
                  </Upload>
                )}
                <UploadMsg default={this.setDefault.bind(this)} type="1" />
              </div>
            </Form.Item>
            <Form.Item label="提示语">
              {getFieldDecorator('losingLotteryHint', {
                initialValue: '你和幸运只是一念之差',
                rules: [
                  {
                    required: true,
                    message: '提示语不能为空',
                  },
                ],
              })(<Input style={{ width: 435 }} placeholder="请输入提示语" />)}
            </Form.Item>
            <Form.Item>
              <Button style={{ marginRight: 24, marginLeft: 140 }} onClick={this.goBack.bind(this)}>
                上一步
              </Button>
              <Button
                type="primary"
                loading={this.state.loading}
                onClick={this.handleSubmit.bind(this)}
              >
                下一步
              </Button>
            </Form.Item>
          </Form>
        )}
        {this.props.addType == 'component' && (
          <Form labelCol={{ span: 3 }}>
            <Form.Item label="名称">
              {getFieldDecorator('losingLotteryName', {
                rules: [
                  {
                    required: true,
                    message: '名称不能为空',
                  },
                ],
              })(<div />)}
              <Input
                value={this.props.activitys.losingLotteryName}
                style={{ width: 435 }}
                placeholder="请输入名称，15个字以内"
                maxLength={15}
                onChange={e => this.componentInputChange(e, 'losing lottery name')}
              />
            </Form.Item>
            <Form.Item label="图片">
              {getFieldDecorator('losingLotteryImage', {
                rules: [
                  {
                    required: true,
                    message: '名称不能为空',
                  },
                ],
              })(<div />)}
              <div className={Css.uploadBox}>
                <Upload {...this.UploadProps}>
                  <div className={Css.iconBtn}>
                    <img src={imgurl} />
                    <div className={Css.iconTxt}>替换</div>
                  </div>
                </Upload>
                <UploadMsg default={this.setDefault.bind(this)} type="1" />
              </div>
            </Form.Item>
            <Form.Item label="提示语">
              {getFieldDecorator('losingLotteryHint', {
                rules: [
                  {
                    required: true,
                    message: '名称不能为空',
                  },
                ],
              })(<div />)}
              <Input
                value={this.props.activitys.losingLotteryHint}
                style={{ width: 435 }}
                placeholder="请输入提示语"
                maxLength={15}
                onChange={e => this.componentInputChange(e, 'losing lottery hint')}
              />
            </Form.Item>
          </Form>
        )}
      </div>
    );
  }
}

SetLottery.defaultProps = {
  addType: 'page',
};

export default Form.create()(withRouter(SetLottery));
