import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from '@/utils/compatible'
import { history } from '@umijs/max';
import css from './Delivery.module.scss';
import OpenModal from './modules/OpenModal';
import KssDrawer from './modules/KssDrawer';
import Panel from '@/components/Panel';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { showBut } from '@/utils/utils'
import { Breadcrumb, Button, InputNumber, Cascader, Input, Checkbox, message } from 'antd';
import {
  instantInfo,
  instantAdd,
  storeInfo,
  instantEdit,
  openedInfo,
  openedAdd,
} from '@/services/shop';
const CheckboxGroup = Checkbox.Group;
const formItemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 20 } };
const FormItem = Form.Item;

class Delivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editList: null,
      isThree: false,
      openShow: false,
      otherStatus: false,
      addressName: '',
      storeId: '',
      kssDrawerShow: false,
    };
  }
  componentDidMount() {
    this.storeInfo(); // 查询店铺信息
    this.instantInfo(); // 查询即时配送信息
    this.openedInfo(); // 查询第三方开通状态
  }
  async openedInfo() {
    const info = await openedInfo();
    if (info) {
      let otherStatus = info.data.find(i => i.status == 1);
      this.setState({
        otherStatus, // 是否有一个已开通
        openedInfo: info.data,
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
  async instantInfo() {
    const info = await instantInfo();
    if (info) {
      const isThree = info.data.deliveryWayList && info.data.deliveryWayList.find(i => i == 3); //初始化展示服务商配置
      this.setState({
        isThree,
        editList: info.data,
      });
    }
  }
  searchUserInfo() {
    const me = this;
    const { editList, storeId, isThree, otherStatus } = this.state;

    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.minPrice = values.minPrice * 100;
      values.fixedFreight = values.fixedFreight * 100;
      values.distanceAddFreight = values.distanceAddFreight * 100;
      values.fixedDistance = values.fixedDistance * 1000;
      values.perExceedDistance = values.perExceedDistance * 1000;
      values.maxDistance = values.maxDistance * 1000;
      values.weightAddFreight = values.weightAddFreight ? values.weightAddFreight * 100 : 0;
      values.addWeightFree = values.addWeightFree ? values.addWeightFree * 1000 : 0;
      values.perExceedWeight = values.perExceedWeight ? values.perExceedWeight * 1000 : 0;
      values.storeId = storeId;
      values.tenantId = localStorage.getItem('tId') || 5;
      values.appId = localStorage.getItem('appId') || '20191209';
      if (isThree && !otherStatus) {
        // 勾选第三方并未开通
        message.error('请先开通第三方服务');
        return;
      }
      console.log('设置配送传参', values);
      if (editList && editList.configId) {
        values.configId = editList.configId;
        me.instantEdit(values);
      } else {
        me.instantAdd(values);
      }
    });
  }
  async instantEdit(p) {
    const info = await instantEdit(p);
    if (info) {
      message.success('编辑成功');
      this.storeInfo();
      this.instantInfo();
    }
  }
  async instantAdd(p) {
    const info = await instantAdd(p);
    if (info) {
      message.success('保存成功');
      this.storeInfo();
      this.instantInfo();
    }
  }
  checkGroupFn(values) {
    const isThree = values.find(i => i == 3);
    this.setState({
      isThree,
    });
  }
  callOpenFn(shipCode) {
    const that = this;
    switch (shipCode) {
      case 'DADA':
        //申请开通(达达)
        that.setState({
          shipCode,
          openShow: true,
        });
        break;
      case 'KSS':
        // 申请开通(开始送)
        openedAdd({
          shipCode,
          storeId: that.state.storeId,
        }).then(res => {
          if (res.success) {
            message.success('开始送开通成功');
            that.openedInfo();
          }
        });
        break;
    }
  }
  onOpenCancel() {
    this.setState({
      openShow: false,
    });
  }
  openOkFn() {
    // 开通后回调
    this.storeInfo(); // 刷新地址
    this.openedInfo(); // 校验是否开通第三方配送
  }
  goTopUp() {
    const url = 'https://newopen.imdada.cn/';
    window.open(url);
  }

  kssDrawerShowCancel() {
    this.setState({
      kssDrawerShow: false,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      editList,
      addressName,
      isThree,
      openShow,
      openedInfo,
      shipCode,
      kssDrawerShow,
    } = this.state;
    const options = [{ label: '商家自配送', value: 2 }, { label: '第三方配送', value: 3 }];
    return (
      <Panel title="即时配送" content="提供同城即时配送能力，顾客下单时选择即时配送">
        <div className={css.deliveryBox}>
          {/* 主体 */}
          <div className={css.content}>
            <Form {...formItemLayout}>
              <FormItem label="店铺地址">
                <div className={css.addressName}>
                  {addressName ? addressName : '未设置'}
                  <Link target="_blank" to="/shop/setShop">
                    修改
                  </Link>
                </div>
              </FormItem>
              <FormItem label="配送方式">
                {getFieldDecorator('deliveryWayList', {
                  rules: [
                    {
                      required: true,
                      message: '请选择配送方式',
                    },
                  ],
                  initialValue: editList ? editList.deliveryWayList : null,
                })(<CheckboxGroup onChange={this.checkGroupFn.bind(this)} options={options} />)}
                <div className={css.threeBox}>
                  <span className={css.msg}>开启第三方配送并开通服务后可使用第三方配送发货</span>
                  {isThree ? (
                    <div className={css.configBox}>
                      <span>配送服务商配置：</span>
                      <div className={css.configList}>
                        {openedInfo &&
                          openedInfo.length &&
                          openedInfo.map(item => {
                            return (
                              <ul key={item.shipCode}>
                                {item.shipCode === 'DADA' && (
                                  <li onClick={this.goTopUp.bind(this)}>
                                    <img
                                      className={css.dadaIcon}
                                      src="https://img.kxll.com/admin_manage/dada.png"
                                      alt=""
                                    />
                                  </li>
                                )}
                                {item.shipCode === 'KSS' && (
                                  <li>
                                    <img
                                      className={css.dadaIcon}
                                      src="https://img.kxll.com/admin_manage/kss.png"
                                      alt=""
                                    />
                                  </li>
                                )}
                                <li className={css.middle}>
                                  {item.status === '1' ? (
                                    <span className={css.open}>已开通</span>
                                  ) : (
                                    <span>未开通</span>
                                  )}
                                </li>
                                {item.status === '0' && (
                                  <li>
                                    <a onClick={this.callOpenFn.bind(this, item.shipCode)}>
                                      申请开通
                                    </a>
                                  </li>
                                )}
                                {item.status === '1' && item.shipCode === 'KSS' && (
                                  <li>
                                    <a
                                      onClick={() =>
                                        this.setState({
                                          kssDrawerShow: true,
                                        })
                                      }
                                    >
                                      充值及明细
                                    </a>
                                  </li>
                                )}
                              </ul>
                            );
                          })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </FormItem>
              <FormItem label="配送价格">
                <div className={css.moneyBox}>
                  {getFieldDecorator('minPrice', {
                    rules: [
                      {
                        required: true,
                        message: '请输入配送价格',
                      },
                    ],
                    initialValue: editList ? editList.minPrice / 100 : null,
                  })(<InputNumber min={0} precision={2} className={css.commonNum} />)}
                  元起送，{' '}
                </div>
                <div className={css.moneyBox}>
                  {getFieldDecorator('fixedDistance', {
                    rules: [
                      {
                        required: true,
                        message: '请输入固定距离',
                      },
                    ],
                    initialValue: editList ? editList.fixedDistance / 1000 : null,
                  })(<InputNumber min={0} precision={2} className={css.commonNum} />)}
                  公里内固定运费，{' '}
                </div>
                <div className={css.moneyBox}>
                  {getFieldDecorator('fixedFreight', {
                    rules: [
                      {
                        required: true,
                        message: '请输入固定运费',
                      },
                    ],
                    initialValue: editList ? editList.fixedFreight / 100 : null,
                  })(<InputNumber min={0} precision={2} className={css.commonNum} />)}
                  元，{' '}
                </div>
                <div className={css.moneyBox}>
                  每超出
                  {getFieldDecorator('perExceedDistance', {
                    rules: [
                      {
                        required: true,
                        message: '请输入每增加距离	',
                      },
                    ],
                    initialValue: editList ? editList.perExceedDistance / 1000 : null,
                  })(<InputNumber min={0} precision={2} className={css.commonNum} />)}
                  公里，{' '}
                </div>
                <div className={css.moneyBox}>
                  增加
                  {getFieldDecorator('distanceAddFreight', {
                    rules: [
                      {
                        required: true,
                        message: '请输入每增加距离运费',
                      },
                    ],
                    initialValue: editList ? editList.distanceAddFreight / 100 : null,
                  })(<InputNumber min={0} precision={2} className={css.commonNum} />)}
                  元
                </div>
                <div>
                  最大配送距离
                  {getFieldDecorator('maxDistance', {
                    rules: [
                      {
                        required: true,
                        message: '请输入最大距离',
                      },
                    ],
                    initialValue: editList ? editList.maxDistance / 1000 : null,
                  })(<InputNumber min={0} precision={2} className={css.commonNum} />)}
                  公里
                </div>
              </FormItem>
              <FormItem label="续重价格">
                <div className={css.moneyBox}>
                  商品在
                  {getFieldDecorator('addWeightFree', {
                    initialValue: editList ? editList.addWeightFree / 1000 : null,
                  })(<InputNumber className={css.commonNum} />)}
                  公斤内不收取费用，{' '}
                </div>
                <div className={css.moneyBox}>
                  每超出
                  {getFieldDecorator('perExceedWeight', {
                    initialValue: editList ? editList.perExceedWeight / 1000 : null,
                  })(<InputNumber min={0} precision={2} className={css.commonNum} />)}
                  公斤增加{' '}
                </div>
                <div className={css.moneyBox}>
                  {getFieldDecorator('weightAddFreight', {
                    initialValue: editList ? editList.weightAddFreight / 100 : null,
                  })(<InputNumber min={0} precision={2} className={css.commonNum} />)}
                  元{' '}
                </div>
              </FormItem>

              <FormItem>
              {
                showBut('deilvery', 'deilvery_submit') && (
                  <Button type="primary" onClick={this.searchUserInfo.bind(this)}>
                    保存
                  </Button>
                )
              }
              </FormItem>
            </Form>
          </div>
          {openShow && (
            <OpenModal
              shipCode={shipCode}
              openOkFn={this.openOkFn.bind(this)}
              onOpenCancel={this.onOpenCancel.bind(this)}
              visible={openShow}
            />
          )}
          <KssDrawer visible={kssDrawerShow} cancel={this.kssDrawerShowCancel.bind(this)} />
        </div>
      </Panel>
    );
  }
}

export default withRouter(Form.create()(Delivery));
