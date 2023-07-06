// 微信直播组件
import React, { Component } from 'react';
import { Modal } from 'antd';
import Css from './LiveModal.module.scss';

class LiveModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModal = () => {
    Modal.info({
      title: '微信直播配置说明',
      width: 700,
      content: (
        <div>
          <p>
            1、目前仅支持微信端小程序直播，且确保小程序有直播权限
            <a
              target="_blank"
              href="https://res.wx.qq.com/mmbizwxampnodelogicsvr_node/dist/images/access_47d0ce.pdf"
            >
              直播权限说明
            </a>
          </p>
          <p>
            2、请先在微信小程序后台创建直播间
            <a target="_blank" href="https://mp.weixin.qq.com/">
              去创建
            </a>
          </p>
          <p>
            3、配置后用户点击首页对应区域跳转到直播间，若微信小程序后台直播列表只有单个直播间点击后直接进入该房间，若有多个直播间点击后进入直播间列表
          </p>
        </div>
      ),
    });
  };

  render() {
    return (
      <div
        style={{ width: this.props.width ? `${this.props.width}px` : '238px' }}
        className={Css.selectInput}
        onClick={this.showModal}
      >
        微信直播配置说明
      </div>
    );
  }
}

export default LiveModal;
