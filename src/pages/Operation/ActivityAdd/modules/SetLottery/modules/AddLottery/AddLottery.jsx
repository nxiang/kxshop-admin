import React, { Component } from 'react';
import Css from '../../../common.module.scss';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Radio, Select, Input, Upload, Button, message, InputNumber } from 'antd';
import UploadMsg from '@/components/UploadMsg/UploadMsg';
import {
  prizeAdd,
  couponList,
  prizeEdit,
  prizeEditCreated,
  prizeStockList,
} from '@/services/activity';
import { connect } from 'dva';

const { Option } = Select;

function beforeUpload(file) {
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
  if (!isJpgOrPng) {
    message.error('仅支持jpg、png、jpeg格式');
  }
  const isLt40M = file.size / 1024 < 200;
  if (!isLt40M) {
    message.error('文件不能大于200K');
  }
  return isLt40M && isJpgOrPng;
}
@connect(activitys => ({
  ...activitys,
}))
class AddLottery extends Component {
  state = {
    loading: false,
    prizeData: [],
    couponData: [],
    couponOption: [],
    image: false,
    defaultImg: 'https://img.kxll.com/admin_manage/nisimg_6_202034.png',
    editCreated: false, //是否修改禁用中的活动
    type: '请选择类型',
  };
  componentDidMount() {
    this.initData();
  }
  async initData() {
    const info = await couponList();
    const prize = await prizeStockList({ prizeType: 4 });
    if (info) {
      this.setState({
        couponData: info.data,
      });
    }
    if (prize) {
      this.setState({
        prizeData: prize.data,
      });
    }
    console.log(this.props.activitys.lotteryItem);
    if (this.props.activitys.lotteryItem.prizeId) {
      let item = '';
      //设置默认选中的select
      info.data.map(d => {
        if (
          d.couponStockList.findIndex(a => {
            return a.stockId == this.props.activitys.lotteryItem.prizeId;
          }) !== -1
        ) {
          item = d.couponType;
        }
      });
      this.setState({
        type: item,
      });
      this.typeSelect(item);
    }
    if (this.props.activitys.lotteryItem.image) {
      this.setState({
        image: this.props.activitys.lotteryItem.image,
      });
    }
    if (this.props.activitys.phoneData.status == 4 && this.props.activitys.lotteryItem) {
      this.setState({
        editCreated: true,
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
              image: info.file.response.data.url,
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

  setDefault() {
    this.setState({
      image: false,
    });
  }

  handleSubmit() {
    this.setState({ loading: true }, () => {
      this.props.form.validateFields(async (err, values) => {
        if (err) {
          this.setState({ loading: false });
          return false;
        }
        let data = {
          activityId: this.props.activitys.activityId,
          prizeConfName: values['prizeConfName'],
          prizeType: values['prizeType'],
          prizeId: values['prizeType'] == 3 ? 0 : values['prizeId'],
          quantity: values['quantity'],
          probability: values['probability'],
          image: this.state.image || this.state.defaultImg,
        };
        if (values?.prizeUrl) data.prizeUrl = values['prizeUrl'];
        if (!this.props.activitys.lotteryItem) {
          const info = await prizeAdd(data);
          if (info) {
            message.success('创建成功');
            this.props.showModal('change');
          }
        } else {
          data.prizeConfId = this.props.activitys.lotteryItem.prizeConfId;
          let info = false;
          if (this.state.editCreated) {
            info = await prizeEditCreated(data);
          } else {
            info = await prizeEdit(data);
          }
          if (info) {
            message.success('修改成功');
            this.props.showModal('change');
          }
        }

        this.setState({ loading: false });
      });
    });
  }

  typeOption() {
    return this.state.couponData.map(d => (
      <Option key={d.couponType}>{d.couponType == 'NORMAL' ? '代金券' : '折扣券'}</Option>
    ));
  }

  typeSelect(e) {
    console.log('e', e);
    const data = this.state.couponData.find(val => val.couponType === e);
    const couponOption = data?.couponStockList?.map(d => (
      <Option key={d.stockId}>{d.couponName}</Option>
    ));
    this.setState({
      couponOption,
      type: e,
    });
  }

  render() {
    const { lotteryItem } = this.props.activitys;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { couponOption, prizeData } = this.state;
    const imgurl = this.state.image || this.state.defaultImg;

    return (
      <Form labelCol={{ span: 4 }}>
        <Form.Item label="奖项名称">
          {getFieldDecorator('prizeConfName', {
            initialValue: lotteryItem.prizeConfName,
            validateTrigger: ['onBlur'],
            rules: [
              {
                required: true,
                message: '名称不能为空',
              },
              {
                max: 5,
                message: '名称过长',
              },
            ],
          })(<Input style={{ width: 461 }} placeholder="请输入名称，5个字以内" />)}
        </Form.Item>
        <Form.Item label="奖品" style={{ marginBottom: 0 }}>
          {getFieldDecorator('prizeType', {
            initialValue: lotteryItem?.prizeType ? lotteryItem.prizeType : 1,
          })(
            <Radio.Group
              onChange={() => {
                this.props.form.setFieldsValue({
                  prizeId: undefined,
                });
                // setFieldsValue('prizeId')
              }}
            >
              <Radio style={{ marginRight: 16 }} value={1}>
                优惠券
              </Radio>
              <Radio disabled value={2}>
                实物
              </Radio>
              <Radio disabled={this.props.addType == 'component'} value={3}>
                支付宝劵
              </Radio>
              {this.props.addType == 'component' && <Radio value={4}>数娱话费权益</Radio>}
            </Radio.Group>
          )}
        </Form.Item>
        {getFieldValue('prizeType') == 1 && (
          <div style={{ display: 'flex', marginLeft: '16.67%' }}>
            <Form.Item>
              <Select
                placeholder="请选择类型"
                value={this.state.type}
                disabled={this.state.editCreated}
                style={{ width: 160 }}
                onSelect={this.typeSelect.bind(this)}
              >
                {this.typeOption()}
              </Select>
            </Form.Item>
            <Form.Item style={{ marginLeft: 16 }}>
              {getFieldDecorator('prizeId', {
                initialValue: lotteryItem.prizeId,
                rules: [
                  {
                    required: true,
                    message: '请选择',
                  },
                ],
              })(
                <Select
                  placeholder="请选择优惠券"
                  disabled={this.state.editCreated}
                  style={{ width: 282 }}
                >
                  {couponOption}
                </Select>
              )}
            </Form.Item>
          </div>
        )}
        {getFieldValue('prizeType') == 2 && (
          <Form.Item wrapperCol={{ offset: 4 }}>
            {getFieldDecorator('prizeId', {
              initialValue: lotteryItem.prizeId,
              rules: [
                {
                  required: true,
                  message: '名称不能为空',
                },
              ],
            })(<Input style={{ width: 461 }} placeholder="请输入奖品名称" />)}
          </Form.Item>
        )}
        {getFieldValue('prizeType') == 3 && (
          <Form.Item wrapperCol={{ offset: 4 }}>
            {getFieldDecorator('prizeUrl', {
              initialValue: lotteryItem.prizeUrl,
              rules: [
                {
                  required: true,
                  message: '链接不能为空',
                },
              ],
            })(<Input style={{ width: 461 }} placeholder="请输入支付宝劵链接" />)}
          </Form.Item>
        )}
        {getFieldValue('prizeType') == 4 && (
          <Form.Item wrapperCol={{ offset: 4 }}>
            {getFieldDecorator('prizeId', {
              initialValue: lotteryItem.prizeId,
              rules: [
                {
                  required: true,
                  message: '权益不能为空',
                },
              ],
            })(
              <Select placeholder="请选择权益" style={{ width: 282 }}>
                {prizeData?.length > 0 &&
                  prizeData.map(item => {
                    return <Option key={item.stockId}>{item.prizeName}</Option>;
                  })}
              </Select>
            )}
          </Form.Item>
        )}
        <Form.Item label="图片">
          <div className={Css.uploadBox}>
            {getFieldDecorator('image')(
              <Upload {...this.UploadProps}>
                <div className={Css.iconBtn}>
                  <img src={imgurl} />
                  <div className={Css.iconTxt}>替换</div>
                </div>
              </Upload>
            )}
            <UploadMsg default={this.setDefault.bind(this)} />
          </div>
        </Form.Item>
        <Form.Item label="数量">
          {getFieldDecorator('quantity', {
            initialValue: lotteryItem.stockQuantity,
            rules: [
              {
                required: true,
                message: '数量不能为空',
              },
            ],
          })(
            <InputNumber
              style={{ width: 161 }}
              min={0}
              max={99999999}
              step={1}
              placeholder="请输入"
            />
          )}
        </Form.Item>
        <Form.Item label="中奖概率">
          {getFieldDecorator('probability', {
            initialValue: lotteryItem.probability,
            rules: [
              {
                required: true,
                message: '中奖概率不能为空',
              },
            ],
          })(
            <InputNumber
              style={{ width: 161, marginRight: 8 }}
              min={0}
              max={100}
              step={1}
              placeholder="请输入"
            />
          )}
          %
        </Form.Item>
        <Form.Item>
          <Button
            style={{ marginRight: 24, marginLeft: 140 }}
            onClick={this.props.showModal.bind(this)}
          >
            取消
          </Button>
          <Button
            type="primary"
            loading={this.state.loading}
            onClick={this.handleSubmit.bind(this)}
          >
            确定
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

AddLottery.defaultProps = {
  addType: 'page',
};

export default Form.create()(AddLottery);
