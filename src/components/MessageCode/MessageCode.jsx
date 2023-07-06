import React from 'react';
import { withRouter } from '@/utils/compatible'
import { Button, Input, message, Upload, Icon, Modal } from 'antd';
import Css from './MessageCode.module.scss';

class MessageCode extends React.Component {
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
        title="订单提醒"
        width={650}
        visible={this.props.visible}
        onCancel={this.props.closeModal}
        footer={this.footerBtn()}
        className={Css.courseModal}
      >
        <div className={Css.wxCodeTitle}>
          使用微信扫描下方二维码或搜索 开心连连 公众号，关注公众号完成绑定后可接受订单提醒
        </div>
        <div className={Css.imgBox}>
          {/* <img src="https://kxgshop.oss-cn-hangzhou.aliyuncs.com/goods/2020/7/2020072714183894559787.jpg" /> */}
          <img src="https://kxgshop.oss-cn-hangzhou.aliyuncs.com/goods/2020/7/2020072217511070956783.jpg" />
        </div>
      </Modal>
    );
  }
}

export default withRouter(MessageCode);
