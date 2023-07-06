import React, { Component } from 'react';
import Css from '../common.module.scss';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Radio, InputNumber, Button, message } from 'antd';
import { ruleAdd, ruleInfo, ruleEdit, ruleTemplate } from '@/services/activity';
import { connect } from 'dva';
import { stepPage, stepPrev } from '@/actions/index';
@connect(activitys => ({
  ...activitys,
}))
class SetStrategy extends Component {
  state = {
    loading: false,
    radioData: [],
    isAdd: true,
    COMMON: false,
    GAME: false,
  };

  componentDidMount() {
    this.initData();
  }

  async initData() {
    const { activityId, form } = this.props.activitys;
    // const info = await ruleInfo({ activityId: activityId });
    const info = await ruleTemplate({ activityId: activityId });
    console.log(info);
    if (info && info.errorCode === '0') {
      for (let i in info.data.ruleTemplateCategoryList) {
        // 为真修改
        if (info.data.hasValue) {
          await this.setState(
            {
              isAdd: false,
              [info.data.ruleTemplateCategoryList[i].category]: info.data.ruleTemplateCategoryList[
                i
              ].ruleConfList.map(item => {
                return item.confKey;
              }),
              [info.data.ruleTemplateCategoryList[i].category +
              'radioData']: info.data.ruleTemplateCategoryList[i].ruleConfList.map(item => {
                if (item.confValue >= 0) {
                  return false;
                } else {
                  return true;
                }
              }),
            },
            () => {
              let category = this.state[info.data.ruleTemplateCategoryList[i].category];
              for (let j in category) {
                let categoryValue;
                if (info.data.ruleTemplateCategoryList[i].ruleConfList[j].confValue >= 0) {
                  categoryValue = Number(info.data.ruleTemplateCategoryList[i].ruleConfList[j].confValue);
                } else {
                  categoryValue = '';
                }
                console.log(categoryValue)
                this.props.form.setFieldsValue({
                  [category[j]]: categoryValue,
                });
              }
            }
          );
        } else {
          this.setState({
            [info.data.ruleTemplateCategoryList[i].category]: info.data.ruleTemplateCategoryList[
              i
            ].ruleConfList.map(item => {
              return item.confKey;
            }),
            [info.data.ruleTemplateCategoryList[i].category +
            'radioData']: info.data.ruleTemplateCategoryList[i].ruleConfList.map(() => {
              return true;
            }),
          });
        }
      }
    }
  }

  goBack() {
    this.props.dispatch(stepPrev());
  }

  onChange(radioName, e) {
    const data = this.state[radioName];
    data[e] = !data[e];
    this.setState(
      {
        [radioName]: data,
      },
      () => {
        console.log(this.state[radioName]);
      }
    );
  }

  // 活动规则提交
  handleSubmit() {
    const { radioData, isAdd } = this.state;
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        this.setState({ loading: false });
        return false;
      }
      console.log(values);
      let data = {
        activityId: this.props.activitys.activityId,
      };
      // 判断是不是大转盘
      if (this.state.COMMON) {
        // 判断是否通过校验
        if (
          (!this.state.COMMONradioData[0] &&
            !this.state.COMMONradioData[1] &&
            values?.dayJoinLimitQuantity > values?.totalJoinLimitQuantity) ||
          (!this.state.COMMONradioData[2] &&
            !this.state.COMMONradioData[3] &&
            values?.dayWinLimitQuantity > values?.totalWinLimitQuantity)
        )
          return;
        for (let i in this.state.COMMON) {
          data = {
            ...data,
            [this.state.COMMON[i]]: this.state.COMMONradioData[i]
              ? -1
              : values[this.state.COMMON[i]],
          };
        }
      }
      // 判断是不是打地鼠
      if (this.state.GAME) {
        for (let i in this.state.GAME) {
          data = {
            ...data,
            [this.state.GAME[i]]: values[this.state.GAME[i]],
          };
        }
      }
      console.log(isAdd, data);
      this.setState({ loading: true });
      if (isAdd) {
        const info = await ruleAdd(data);
        if (info) {
          message.success('创建成功');
          this.props.dispatch(stepPage());
        }
      } else {
        const info = await ruleEdit(data);
        if (info) {
          message.success('修改成功');
          this.props.dispatch(stepPage());
        }
      }
      this.setState({ loading: false });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { radioData } = this.state;
    return (
      <div className={Css.content}>
        <Form labelCol={{ span: 5 }}>
          <div className={Css.header}>
            <span className={Css.title}>设置策略</span>
          </div>
          <Form.Item label="参与用户">
            <Radio checked={true}>所有用户</Radio>
          </Form.Item>
          {this.state.COMMON &&
            this.state.COMMON.map((item, index) => {
              let labelName;
              let errorHelp = '';
              let errVaildateStatus = 'validating';
              const dayJoinLimitQuantity = this.props.form.getFieldValue('dayJoinLimitQuantity');
              const totalJoinLimitQuantity = this.props.form.getFieldValue(
                'totalJoinLimitQuantity'
              );
              const dayWinLimitQuantity = this.props.form.getFieldValue('dayWinLimitQuantity');
              const totalWinLimitQuantity = this.props.form.getFieldValue('totalWinLimitQuantity');
              console.log(dayJoinLimitQuantity,totalJoinLimitQuantity,dayWinLimitQuantity, totalWinLimitQuantity)
              switch (item) {
                case 'totalJoinLimitQuantity':
                  labelName = '参与次数';
                  break;
                case 'dayJoinLimitQuantity':
                  labelName = '日参与次数';
                  if (
                    !this.state.COMMONradioData[0] &&
                    !this.state.COMMONradioData[1] &&
                    dayJoinLimitQuantity > totalJoinLimitQuantity
                  ) {
                    errVaildateStatus = 'error';
                    errorHelp = '不能超过总参与次数';
                  }
                  break;
                case 'totalWinLimitQuantity':
                  labelName = '总中奖次数';
                  break;
                case 'dayWinLimitQuantity':
                  labelName = '日中奖次数';
                  if (
                    !this.state.COMMONradioData[2] &&
                    !this.state.COMMONradioData[3] &&
                    dayWinLimitQuantity > totalWinLimitQuantity
                  ) {
                    errVaildateStatus = 'error';
                    errorHelp = '不能超过总中奖次数';
                  }
                  break;
                default:
              }
              return (
                <Form.Item
                  label={labelName}
                  key={item}
                  validateStatus={errVaildateStatus}
                  help={errorHelp}
                >
                  <Radio.Group
                    style={{ display: 'flex', alignItems: 'center' }}
                    defaultValue={true}
                    value={this.state.COMMONradioData[index]}
                    onChange={this.onChange.bind(this, 'COMMONradioData', index)}
                  >
                    <Radio style={{ marginRight: 16 }} value={true}>
                      不限制次数
                    </Radio>
                    <Radio value={false}>
                      最多参加
                      {getFieldDecorator([item], {
                        initialValue: '',
                      })(
                        <InputNumber
                          style={{ width: 80, marginLeft: 8, marginRight: 8 }}
                          min={0}
                          max={99999999}
                          placeholder="请输入"
                        />
                      )}
                      次
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              );
            })}
          {this.state.GAME ? (
            <div className={Css.header}>
              <span className={Css.title}>游戏规则</span>
            </div>
          ) : null}
          {this.state.GAME &&
            this.state.GAME.map((item, index) => {
              let labelName, leftText, rightText, timeLength;
              switch (item) {
                case 'gameTime':
                  leftText = '单场游戏';
                  rightText = '秒时长';
                  labelName = '游戏时长';
                  timeLength = 60;
                  break;
                case 'lotteryThreshold':
                  leftText = '单场得分';
                  rightText = '分，可以参与抽奖';
                  labelName = '抽奖门槛';
                  timeLength = 40;
                  break;
                default:
                  break;
              }
              return (
                <Form.Item label={labelName} key={item}>
                  <span>{leftText}</span>
                  {getFieldDecorator([item], {
                    initialValue: timeLength,
                    rules: [{ required: true, message: `${labelName}不能为空` }],
                  })(
                    <InputNumber
                      style={{ width: 80, marginLeft: 8, marginRight: 8 }}
                      min={0}
                      max={99999999}
                      step={1}
                      placeholder="请输入"
                    />
                  )}
                  <span>{rightText}</span>
                </Form.Item>
              );
            })}
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
      </div>
    );
  }
}

export default Form.create()(SetStrategy);
