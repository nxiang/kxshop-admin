import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import css from './OpenModal.module.scss';
import { CheckCircleFilled } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Button, message, Steps, Input, Select } from 'antd';
import { storeInfo, openedAdd, cityInfo, businessInfo } from '@/services/shop';

const FormItem = Form.Item;
const Step = Steps.Step;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class OpenModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessInfo: null,
      businessId: null,
      stepCurrent: 0,
      addressName: null,
      cityInfo: null,
    };
  }
  componentDidMount() {
    this.storeInfo();
    this.cityInfo();
    this.businessInfo();
  }
  async cityInfo() {
    const p = {
      shipCode: this.props.shipCode,
    };
    const info = await cityInfo(p);
    if (info) {
      this.setState({
        cityInfo: info.data,
      });
    }
  }
  async businessInfo() {
    const p = {
      shipCode: this.props.shipCode,
    };
    const info = await businessInfo(p);
    if (info) {
      this.setState({
        businessInfo: info.data,
      });
    }
  }
  async storeInfo() {
    const info = await storeInfo();
    if (info) {
      let addressName = null;
      if (info.data.companyArea && info.data.storeAddress) {
        addressName = `${info.data.companyArea}${info.data.storeAddress}`;
      }
      this.setState({
        addressName,
        storeId: info.data.storeId,
      });
    }
  }
  initBtnFn() {
    const { stepCurrent } = this.state;
    let btnList = null;
    if (stepCurrent === 2) {
      btnList = [
        <div className="footerBox" key={2}>
          <Button onClick={this.props.onOpenCancel} key={2} type="primary">
            完成
          </Button>
        </div>,
      ];
    } else {
      btnList = [
        <div className="footerBox" key={1}>
          <Button onClick={this.nextStep.bind(this)} key={1} type="primary">
            下一步
          </Button>
          <Button onClick={this.props.onOpenCancel} key={2}>
            取消
          </Button>
        </div>,
      ];
    }
    return btnList;
  }
  nextStep() {
    const { stepCurrent, businessId, oneValues, storeId, cityInfo, addressName } = this.state;
    const me = this;
    if (stepCurrent === 0) {
      this.props.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        this.setState({
          oneValues: values,
        });
        this.setState({
          stepCurrent: stepCurrent + 1,
        });
      });
    }
    if (stepCurrent === 1) {
      if (!businessId) {
        message.error('请选择业务类型');
        return;
      }
      const p = {
        ...oneValues,
        businessId,
        shipCode: this.props.shipCode,
        storeId,
        shopAddress: addressName,
      };
      console.log('传参', p);
      me.openedAdd(p);
    }
  }
  async openedAdd(p) {
    const info = await openedAdd(p);
    if (info) {
      console.log('添加返回', info);
      this.setState({
        stepCurrent: this.state.stepCurrent + 1,
      });
      this.props.openOkFn();
    }
  }
  checkPhoneNumber = (rule, value, callback) => {
    if (!value) {
      callback();
    }
    if (!/^(12|13|14|15|16|17|18|19|10)\d{9}$/.test(value)) {
      callback('手机号码格式错误！');
    }
    callback();
  };
  editAddres() {
    // const fristUrl = 'http://10.20.16.64/admin';
    const fristUrl = `${window.location.protocol}//${window.location.host}/admin`;
    const url = `${fristUrl}/shop/SetShop`;
    window.open(url);
  }
  goTopUp() {
    const url = 'https://newopen.imdada.cn/';
    window.open(url);
  }
  changeTypeFn(value) {
    this.setState({
      businessId: value,
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { stepCurrent, addressName, businessInfo, cityInfo } = this.state;
    return (
      <Modal
        style={{ top: 20 }}
        maskClosable={false}
        width={674}
        className={css.openModalBox}
        title="申请开通"
        visible={this.props.visible}
        onCancel={this.props.onOpenCancel}
        footer={this.initBtnFn()}
      >
        <Steps current={stepCurrent}>
          <Step title="账号信息" />
          <Step title="确认店铺信息" />
          <Step title="完成" />
        </Steps>
        {stepCurrent === 0 ? (
          <div className={css.oneBox}>
            <Form {...formItemLayout}>
              <FormItem label="手机号">
                {getFieldDecorator('mobile', {
                  rules: [
                    {
                      required: true,
                      message: '请输入手机号',
                    },
                    {
                      validator: this.checkPhoneNumber,
                    },
                  ],
                })(
                  <Input placeholder="注册商户手机号,用于登陆商户后台" className={css.rightInput} />
                )}
              </FormItem>
              <FormItem label="所在城市">
                {getFieldDecorator('cityName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择所在城市',
                    },
                  ],
                })(
                  <Select
                    allowClear
                    className={css.cityList}
                    showSearch
                    placeholder="请选择所在城市"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {cityInfo && cityInfo.length
                      ? cityInfo.map((item, index) => {
                          return (
                            <Option key={index} value={item.cityName}>
                              {item.cityName}
                            </Option>
                          );
                        })
                      : null}
                  </Select>
                )}
                <span className={css.cityMsg}>限达达已开通城市</span>
              </FormItem>
              <FormItem label="企业全称">
                {getFieldDecorator('enterpriseName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入企业全称',
                    },
                  ],
                })(<Input placeholder="请输入企业全称" className={css.rightInput} />)}
              </FormItem>
              <FormItem label="企业地址">
                {getFieldDecorator('enterpriseAddress', {
                  rules: [
                    {
                      required: true,
                      message: '请输入企业地址',
                    },
                  ],
                })(<Input placeholder="请输入企业地址" className={css.rightInput} />)}
              </FormItem>
              <FormItem label="联系人姓名">
                {getFieldDecorator('contactName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入姓名',
                    },
                  ],
                })(<Input placeholder="请输入姓名" className={css.rightInput} />)}
              </FormItem>
              <FormItem label="联系人电话">
                {getFieldDecorator('contactPhone', {
                  rules: [
                    {
                      required: true,
                      message: '请输入联系人电话',
                    },
                    {
                      validator: this.checkPhoneNumber,
                    },
                  ],
                })(<Input placeholder="请输入联系人电话" className={css.rightInput} />)}
              </FormItem>
              <FormItem label="邮箱地址">
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      message: '请输入邮箱地址',
                    },
                  ],
                })(<Input placeholder="请输入邮箱地址" className={css.rightInput} />)}
              </FormItem>
            </Form>
            <div className={css.bottomMsg}>
              <div>说明:</div>
              <div>
                账号信息申请后将为你自动生成达达平台商户，请使用手机号登录达达配送平台充值后使用。平台初始密码将通过短信的方式下发到您的手机上。
              </div>
            </div>
          </div>
        ) : null}
        {stepCurrent === 1 ? (
          <div className={css.twoBox}>
            <div>
              <div className={css.topItem}>
                <span>业务类型: </span>
                <Select
                  placeholder="请选择业务类型"
                  onChange={this.changeTypeFn.bind(this)}
                  className={css.shopType}
                >
                  {businessInfo && businessInfo.length
                    ? businessInfo.map((item, index) => {
                        return (
                          <Option key={index} value={item.businessId}>
                            {item.businessName}
                          </Option>
                        );
                      })
                    : null}
                </Select>
              </div>
              <div className={css.rowItem + ' ' + css.topItem}>
                <span>店铺地址: </span>
                <span>
                  <span className={css.addressText}>{addressName}</span>
                  <a className={css.rightBtn} onClick={this.editAddres.bind(this)}>
                    去修改
                  </a>
                  <a className={css.rightBtn} onClick={this.storeInfo.bind(this)}>
                    刷新地址
                  </a>
                </span>
              </div>
            </div>
            <div className={css.bottomBox}>
              <div className={css.leftMsg}>说明:</div>
              <div className={css.leftMsg}>
                店铺地址将默认作为即时配送商品的取货地址，为保证准确位置准确请确认店铺位置准确
              </div>
            </div>
          </div>
        ) : null}
        {stepCurrent === 2 ? (
          <div className={css.threeBox}>
            <CheckCircleFilled className={css.checkIcon} />
            <div className={css.configOk}>配置完成</div>
            <p>
              请在登录达达平台<span style={{ color: '#F72633' }}>完成充值</span>后开始使用达达发货
            </p>
            <div className={css.goPlusBtn} onClick={this.goTopUp.bind(this)}>
              去充值
            </div>
          </div>
        ) : null}
      </Modal>
    );
  }
}

export default Form.create({})(OpenModal);
