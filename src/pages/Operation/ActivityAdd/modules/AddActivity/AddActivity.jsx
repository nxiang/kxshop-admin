import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import { history } from '@umijs/max';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { DatePicker, Select, Input, Upload, Modal, Button, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import UploadMsg from '@/components/UploadMsg/UploadMsg';
import Css from '../common.module.scss';

// 引入接口
import { temList, actAdd, actInfo, actEdit } from '@/services/activity';
import { stepPage, activityId, phoneData } from '@/actions/index';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { confirm } = Modal;

function beforeUpload(file) {
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
  if (!isJpgOrPng) {
    message.error('仅支持jpg、png、jpeg格式');
  }
  const isLt40M = file.size / 1024 / 1024 < 1;
  if (!isLt40M) {
    message.error('文件不能大于1MB');
  }
  return isLt40M && isJpgOrPng;
}
@connect(({ activitys }) => ({
  activitys,
}))
class AddActivity extends Component {
  state = {
    loading: false,
    backgroundImage: false,
    titleImage: false,
    defaultImage: {
      backgroundImage: false,
      titleImage: false,
      id: '1',
    },
    sampleImage: false,
    // 是否编辑相关
    disabled: false,
    editEndTime: false,
    templateName: '',
    activityType: 1,
    templateData: [],
  };

  componentDidMount() {
    const { addType, activitys } = this.props;
    console.log(addType);
    if (addType == 'page') this.initData();
    if (addType == 'component') {
      console.log('activitys', activitys);
      this.setState({
        titleImage: activitys.phoneData.titleImage,
        backgroundImage: activitys.phoneData.backgroundImage,
      });
    }
  }

  async initData() {
    const { activitys, form, dispatch } = this.props;
    const { templateData } = this.state;
    const info = await temList();
    if (info) {
      const listData = [];
      info.data.forEach(item => listData.push(item));
      // for (let i in info.data) {
      //   listData.push(info.data[i]);
      // }
      this.setState({
        templateData: listData, // 目前只有1个大类，后期从此处扩张
        // defaultImage: info.data[0].templateList[0]
      });
      // this.props.form.setFieldsValue({
      // 	templateId: String(info.data[0].templateList[0].id)
      // });
    }
    if (activitys.activityId) {
      const { data } = await actInfo({ activityId: activitys.activityId });
      // 设置活动基础信息
      templateData.forEach(item => {
        if (item.activityType == data.activityType) {
          item.templateList.forEach(d => {
            if (d.id == data.templateId) {
              this.setState({
                defaultImage: {
                  backgroundImage: d.backgroundImage,
                  titleImage: d.titleImage,
                  sampleImage: d.sampleImage,
                },
                templateName: d.name,
              });
            }
          });
        }
      });
      // 设置活动已有配置信息
      form.setFieldsValue({
        templateIdName: data['activityType'],
        activityName: data['activityName'],
        templateId: String(data['templateId']),
        copyWrite: data['copyWrite'],
        ruleDesc: data['ruleDesc'],
        time: [moment(data.beginTime), moment(data.endTime)],
      });
      this.setState({
        activityType: data['activityType'],
        titleImage: data.titleImage,
        backgroundImage: data.backgroundImage,
        disabled: true,
        editEndTime: moment(data.endTime),
      });
      dispatch(phoneData({ ...activitys.phoneData, photoImg: data.sampleImage }));
      dispatch(phoneData(data));
    }
  }

  // 上传标题文件
  UploadTitleProps = {
    name: 'file',
    action: '/proxy/cloud/oss/upload?type=marketing',
    headers: {
      //   userToken: Cookies.get('userToken'),
    },
    data: {
      // type: "marketing"
    },
    beforeUpload,
    showUploadList: false,
    response: '{"status": "success"}',
    onChange: info => {
      const that = this;
      if (info.file.status === 'uploading') {
        that.setState({
          documentSpin: true,
        });
      } else if (info.file.status === 'done') {
        if (info.file.response) {
          if (info.file.response.errorCode === '0') {
            message.success(`${info.file.name} 上传成功`);
            that.setState({
              titleImage: info.file.response.data.url,
            });
            that.props.dispatch(phoneData({ titleImage: info.file.response.data.url }));
          } else {
            message.error(`${info.file.name} 上传失败`);
          }
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  // 上传背景图文件
  UploadBgProps = {
    name: 'file',
    action: '/proxy/cloud/oss/upload?type=marketing',
    beforeUpload,
    showUploadList: false,
    data: { type: 'marketing' },
    response: '{"status": "success"}',
    onChange: info => {
      const that = this;
      if (info.file.status === 'uploading') {
        that.setState({
          documentSpin: true,
        });
      } else if (info.file.status === 'done') {
        if (info.file.response) {
          if (info.file.response.errorCode === '0') {
            message.success(`${info.file.name} 上传成功`);
            that.setState({
              backgroundImage: info.file.response.data.url,
            });
            that.props.dispatch(phoneData({ backgroundImage: info.file.response.data.url }));
          } else {
            message.error(`${info.file.name} 上传失败`);
          }
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  setDefault(e) {
    const { addType, dispatch } = this.props;
    const { defaultImage } = this.state;
    if (e === 'title') {
      if (addType == 'page') {
        this.setState({
          titleImage: false,
        });
        dispatch(phoneData({ titleImage: defaultImage.titleImage }));
      }
      if (addType == 'component') {
        this.setState({
          titleImage: 'https://img.kxll.com/zhuangchen_wap/titlenew.png',
        });
        dispatch(phoneData({ titleImage: 'https://img.kxll.com/zhuangchen_wap/titlenew.png' }));
      }
    }
    if (e === 'background') {
      if (addType == 'page') {
        this.setState({
          backgroundImage: false,
        });
        dispatch(phoneData({ backgroundImage: defaultImage.backgroundImage }));
      }
      if (addType == 'component') {
        this.setState({
          backgroundImage: 'https://img.kxll.com/zhuangchen_wap/bgnew.png',
        });
        dispatch(phoneData({ backgroundImage: 'https://img.kxll.com/zhuangchen_wap/bgnew.png' }));
      }
    }
  }

  goBack() {
    const self = this;
    confirm({
      title: '提示',
      content: '取消后所有信息都将丢失，确认取消吗?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        history.push('/operation/activitys/list');
      },
      onCancel() {},
    });
  }

  handleSubmit() {
    const { form } = this.props;
    this.setState({ loading: true });
    form.validateFields(async (err, values) => {
      if (err) {
        this.setState({ loading: false });
        return false;
      }
      if (!values['time'][1]) {
        this.setState({ loading: false });
        return message.warning('活动结束时间不能为空');
      }
      const data = {
        activityName: values['activityName'],
        templateId: values['templateId'],
        beginTime: values['time'][0].format('YYYY-MM-DD HH:mm'),
        endTime: values['time'][1]?.format('YYYY-MM-DD HH:mm') || '',
        copyWrite:
          values['copyWrite'] ||
          `${values['time'][0].format('YYYY-MM-DD HH:mm')}至${values['time'][1].format(
            'YYYY-MM-DD HH:mm'
          )}`,
        ruleDesc: values['ruleDesc'],
        titleImage: this.state.titleImage || this.state.defaultImage.titleImage,
        backgroundImage: this.state.backgroundImage || this.state.defaultImage.backgroundImage,
      };
      if (this.props.activitys.activityId) {
        const info = await actEdit({
          ...data,
          ...{ activityId: this.props.activitys.activityId },
        });
        if (info) {
          message.success('修改成功');
          const templateName = this.state.templateName;
          this.props.dispatch(phoneData({ ...data, ...{ templateName } }));
          this.props.dispatch(stepPage());
        }
      } else {
        const info = await actAdd(data);
        if (info) {
          message.success('创建成功');
          this.props.dispatch(activityId(info.data.activityId));
          const templateName = this.state.templateName;
          this.props.dispatch(phoneData({ ...data, ...{ templateName } }));
          this.props.dispatch(stepPage());
        }
      }
      this.setState({ loading: false });
    });
  }

  changeActivityType = val => {
    this.setState({
      activityType: val,
    });
    this.props.form.setFieldsValue({
      templateId: undefined,
    });
  };

  changeTemplate = val => {
    const { templateData, activityType } = this.state;
    for (let i in templateData) {
      if (templateData[i].activityType == activityType)
        this.state.templateData[i].templateList.filter(d => {
          if (d.id == val) {
            this.setState({
              defaultImage: {
                backgroundImage: d.backgroundImage,
                titleImage: d.titleImage,
                sampleImage: d.sampleImage,
              },
              templateName: d.name,
            });
            // 设置图片
            this.props.dispatch(
              phoneData({
                ...this.props.activitys.phoneData,
                photoImg: d.sampleImage,
                backgroundImage: d.backgroundImage,
                titleImage: d.titleImage,
                sampleImage: d.sampleImage,
                templateName: d.name,
              })
            );
          }
        });
    }
  };

  // 日期禁用

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { titleImage, defaultImage, backgroundImage } = this.state;
    const titleUrl = titleImage || defaultImage.titleImage;
    const bgUrl = backgroundImage || defaultImage.backgroundImage;
    let options = [];
    if (this.state.templateData !== undefined) {
      for (let i in this.state.templateData) {
        if (this.state.templateData[i].activityType == this.state.activityType)
          options = this.state.templateData[i].templateList.map(d => (
            <Option key={d.id}>{d.name}</Option>
          ));
      }
    }
    return (
      <div className={Css.content}>
        <div className={Css.header}>
          <span className={Css.title}>创建活动</span>
        </div>
        <Form labelCol={{ span: 3, offset: 0 }}>
          {this.props.addType == 'page' && (
            <>
              <Form.Item label="活动名称">
                {getFieldDecorator('activityName', {
                  validateTrigger: ['onBlur'],
                  rules: [
                    {
                      required: true,
                      message: '活动名称不能为空',
                    },
                    {
                      max: 10,
                      message: '活动名称过长',
                    },
                  ],
                })(<Input style={{ width: 435 }} placeholder="请输入活动名称，10个字以内" />)}
              </Form.Item>
              <div style={{ position: 'relative' }}>
                <Form.Item label="应用模版">
                  {getFieldDecorator('templateIdName', {
                    initialValue: 1,
                    rules: [
                      {
                        required: true,
                        message: '请选择',
                      },
                    ],
                  })(
                    <Select
                      disabled={this.state.disabled}
                      style={{ width: 160 }}
                      onSelect={this.changeActivityType.bind(this)}
                    >
                      <Option value={1}>抽奖类</Option>
                      <Option value={2}>游戏类</Option>
                    </Select>
                  )}
                </Form.Item>
                <Form.Item style={{ position: 'absolute', top: 0, left: 256 }}>
                  {getFieldDecorator('templateId', {
                    initialValue: getFieldValue('templateId'),
                    rules: [
                      {
                        required: true,
                        message: '请选择',
                      },
                    ],
                  })(
                    <Select
                      disabled={this.state.disabled}
                      style={{ width: 259 }}
                      onSelect={this.changeTemplate.bind(this)}
                    >
                      {options}
                    </Select>
                  )}
                </Form.Item>
              </div>

              <Form.Item required label="活动时间">
                {getFieldDecorator('time', {
                  rules: [
                    {
                      required: true,
                      message: '请输入活动时间',
                    },
                  ],
                })(
                  <RangePicker
                    disabled={[this.state.disabled, false]}
                    disabledDate={current => {
                      if (this.state.disabled)
                        return current && current < this.state.editEndTime.startOf('day');
                      return false;
                    }}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                  />
                )}
              </Form.Item>
              <Form.Item label="活动文案">
                {getFieldDecorator('copyWrite', {
                  rules: [
                    {
                      max: 50,
                      message: '活动文案过长',
                    },
                  ],
                })(<Input style={{ width: 435 }} placeholder="请输⼊，如果为空默认显示活动时间" />)}
              </Form.Item>
              <Form.Item label="活动规则">
                {getFieldDecorator('ruleDesc', {
                  rules: [
                    {
                      max: 50,
                      message: '活动规则过长',
                    },
                  ],
                })(
                  <TextArea
                    placeholder="请输入，50个字以内"
                    maxLength={50}
                    style={{ width: 435, height: 80 }}
                  />
                )}
              </Form.Item>
            </>
          )}
          <Form.Item label="活动标题">
            <div className={Css.uploadBox}>
              <Upload {...this.UploadTitleProps}>
                <img src={titleUrl} className={Css.titleBtn} alt="" />
              </Upload>
              <UploadMsg default={this.setDefault.bind(this, 'title')} type="2" />
            </div>
          </Form.Item>
          <Form.Item label="活动背景">
            <div className={Css.uploadBox} style={{ alignItems: 'flex-end' }}>
              <Upload {...this.UploadBgProps}>
                <img src={bgUrl} className={Css.bgBtn} />
              </Upload>
              <UploadMsg default={this.setDefault.bind(this, 'background')} type="3" />
            </div>
          </Form.Item>
          {this.props.addType == 'page' && (
            <Form.Item>
              <Button style={{ marginRight: 24, marginLeft: 140 }} onClick={this.goBack.bind(this)}>
                取消
              </Button>
              <Button
                type="primary"
                loading={this.state.loading}
                onClick={this.handleSubmit.bind(this)}
              >
                下一步
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
    );
  }
}

AddActivity.defaultProps = {
  addType: 'page',
};

export default Form.create()(withRouter(AddActivity));
