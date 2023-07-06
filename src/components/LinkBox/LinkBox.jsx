import React, { Component } from 'react';
import Css from './LinkBox.module.scss';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Input, message } from 'antd';
import copy from 'copy-to-clipboard';

class LinkBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 取消
  closeButton() {
    console.log('关闭');
    this.props.linkCallBack();
  }

  // 复制链接
  copyLink(e) {
    if (copy(e)) {
      message.info('复制成功');
    } else {
      message.info('复制失败');
    }
  }

  render() {
    return this.props.isShow ? (
      <div className={Css['LinkBox']}>
        <CloseCircleOutlined className={Css['closeButton']} onClick={this.closeButton.bind(this)} />
        <div className={Css['title']}>二维码链接</div>
        <div className={Css['signBox']}>
          {this.props.stockUrls.map((val, index) => {
            return (
              <div key={index}>
                {Object.keys(val).length ? (
                  <div className={Css['signItem']}>
                    <div className={Css['signRow']}>
                      <img className={Css['signImg']} src={val.qrCodeUrl} alt="下载二维码" />
                      <a
                        target="_blank"
                        href={val.qrCodeUrl}
                        download="下载二维码"
                        rel="noreferrer noopener"
                      >
                        下载二维码
                      </a>
                    </div>
                    <div className={Css['signName']}>
                      {val.clientId == 1 ? '支付宝' : '微信'}二维码
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        {this.props.stockUrls.map(val => {
          if (val.url) {
            return (
              <div className={Css['linkRow']}>
                <div className={Css['linkTitle']}>
                  {val.clientId == 1 ? '支付宝' : '微信'}领券链接：
                </div>
                <Input id="alipayInput" className={Css['linkInput']} disabled value={val.url} />
                <button className={Css['copy']} onClick={this.copyLink.bind(this, val.url)}>
                  复制
                </button>
              </div>
            );
          }
        })}
      </div>
    ) : (
      ''
    );
  }
}

export default LinkBox;
