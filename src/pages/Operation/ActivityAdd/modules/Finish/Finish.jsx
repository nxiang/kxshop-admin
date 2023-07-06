import React, { Component } from 'react';
import Css from '../common.module.scss';
import { history } from '@umijs/max'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Radio, Button, message } from 'antd';
import { withRouter } from '@/utils/compatible'
import { actEnable, actDisable } from '@/services/activity';
import { stepPrev, revertData } from '@/actions/index';
import { connect } from 'dva';
import succeedImg from '@/assets/images/succeed-img.png'

@connect(activitys => ({
  ...activitys,
}))
class Finish extends Component {
  state = {
    loading: false,
    state: 1,
  };

  goBack() {
    this.props.dispatch(stepPrev());
  }

  onChange(e) {
    this.setState({
      state: e.target.value,
    });
  }

  handleSubmit() {
    this.setState({ loading: true }, async () => {
      let info = false;
      if (this.state.state == 1) {
        info = await actEnable({ activityId: this.props.activitys.activityId });
      } else {
        info = await actDisable({ activityId: this.props.activitys.activityId });
      }
      if (info) {
        message.success('设置成功');
        history.push('/operation/activitys/list');
        this.props.dispatch(revertData());
      }
      this.setState({ loading: false });
    });
  }

  render() {
    console.log(this.props);
    const { phoneData } = this.props.activitys;
    return (
      <div className={Css.content}>
        <img className={Css.successImg} src={succeedImg} alt="" />
        <p className={Css.successMsg}>创建成功</p>
        <div className={Css.msgBox}>
          <p>活动名称： {phoneData.activityName}</p>
          <p>应用模板： {phoneData.templateName}</p>
          <p>活动时间： {phoneData.beginTime + ' 至 ' + phoneData.endTime}</p>
          <p>活动文案： {phoneData.copyWrite}</p>
          <p>活动规则： {phoneData.ruleDesc}</p>
        </div>
        <Form>
          <Form.Item label="是否启用本次活动">
            <Radio.Group value={this.state.state} onChange={this.onChange.bind(this)}>
              <Radio style={{ marginRight: 16 }} value={1}>
                启用
              </Radio>
              <Radio value={2}>禁用</Radio>
            </Radio.Group>
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
              完成
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default withRouter(Finish);
