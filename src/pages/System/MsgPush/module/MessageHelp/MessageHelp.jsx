import React from 'react';
import { withRouter } from '@/utils/compatible'
import { Button, Input, message, Upload, Icon, Modal } from 'antd';
import Css from './MessageHelp.module.scss';
import msg1 from '@/assets/images/msg1.png'
import msg2 from '@/assets/images/msg2.png'

class MessageHelp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  footerBtn() {
    let btnArr = null;
    btnArr = [
      <div className={Css.bottomBtn}>
        <Button key="1" type="primary" onClick={this.props.closeModal}>
          知道了
        </Button>
      </div>,
    ];
    return btnArr;
  }
  render() {
    return (
      <Modal
        maskClosable={false}
        title="设置说明"
        width={800}
        visible={this.props.visible}
        onCancel={this.props.closeModal}
        footer={this.footerBtn()}
        className={Css.courseModal}
      >
        <div className={Css.courseContent}>
          <p>1.登录微信后台,在功能{'>'}订阅消息页面中点击开通订阅消息</p>
          <img className={Css.courseImg} src={msg1} />
          <p style={{ marginTop: 40 }}>
            2.登录微信后台,在设置{'>'}服务类目项目中点击详情添加小程序服务类目,将“IT科技 {'>'}
            软件服务提供商”添加到服务类目中
          </p>
          <img className={Css.courseImg} src={msg2} />
        </div>
      </Modal>
    );
  }
}

export default withRouter(MessageHelp);
