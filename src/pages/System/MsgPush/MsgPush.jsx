import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from '@/utils/compatible'
import Css from './MsgPush.module.scss';
import { Breadcrumb, Button, Tabs, Modal, Switch, Select, Table, message, Form } from 'antd';
import Panel from '@/components/Panel';
import MessageHelp from './module/MessageHelp/MessageHelp';
import { subscribeList, subscribeOpen } from '@/services/subscribe';

import moment from 'moment';
class MsgPush extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgList: null,
      loading: false,
      tipShow: true,
      helpShow: false,
    };
  }
  componentDidMount() {
    this.subscribeListFn();
  }
  subscribeListFn() {
    subscribeList({
      type: 2,
    }).then(res => {
      if (res) {
        res.data.map(item => {
          item.checked = !item.state ? true : false;
          item.loading = false;
        });
        this.setState({
          msgList: res.data,
        });
      }
    });
  }
  tipFn() {
    this.setState({
      tipShow: false,
    });
  }
  changeHelpFn() {
    this.setState({
      helpShow: true,
    });
  }
  closeModal() {
    this.setState({
      helpShow: false,
    });
  }
  onMsgChange(code, checked) {
    const { msgList } = this.state;
    const p = {
      state: checked ? 0 : 1,
      code,
    };
    msgList.map(item => {
      if (item.code == code) {
        item.loading = true;
      }
    });
    this.setState({
      msgList,
    });
    subscribeOpen(p).then(res => {
      if (res && res.success) {
        msgList.map(item => {
          if (item.code == code) {
            item.checked = checked;
            item.loading = false;
          }
        });
      } else {
        msgList.map(item => {
          if (item.code == code) {
            item.checked = false;
            item.loading = false;
          }
        });
      }
      this.setState({
        msgList,
      });
    });
  }
  render() {
    const { tipShow, helpShow, msgList } = this.state;
    return (
      <Panel title="消息推送" content="设置商城系统消息推送内容">
        <div>
          {tipShow ? (
            <div className={Css.topTipBox}>
              <p>
                1、微信小程序订阅消息通过微信服务消息发送给客户，如果客户拒绝订阅模板消息将无法收到提醒
              </p>
              <p>
                2、请开通微信小程序订阅消息，并在小程序服务类目中添加“IT科技 {'>'}
                软件服务提供商”类目&nbsp;
                <a href="https://mp.weixin.qq.com/" target="blank">
                  去开通&nbsp;
                </a>
                <span onClick={this.changeHelpFn.bind(this)} className={Css.tipIcon}>
                  ?
                </span>
              </p>
              <div onClick={this.tipFn.bind(this)} className={Css.closeTip}>
                ×
              </div>
            </div>
          ) : null}

          <div className={Css.bottomMsgBox}>
            <div className={Css.titleBox}>交易消息</div>
            <div className={Css.msgBox}>
              <ul>
                {msgList &&
                  msgList.map(item => {
                    return (
                      <li>
                        <div className={Css.msgTop}>
                          <div className={Css.msgTitle}>{item.name}</div>
                          <div>
                            <Switch
                              loading={item.loading}
                              onChange={this.onMsgChange.bind(this, item.code)}
                              checked={item.checked}
                            />
                          </div>
                        </div>
                        <div className={Css.msgText}>{item.sceneDesc}</div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
        {helpShow ? (
          <MessageHelp visible={helpShow} closeModal={this.closeModal.bind(this)} />
        ) : null}
      </Panel>
    );
  }
}

export default withRouter(MsgPush);
