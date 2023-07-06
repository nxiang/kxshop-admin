import React from 'react';
import { withRouter } from '@/utils/compatible'
import { Button, Input, message, Upload, Icon, Modal } from "antd";
import Css from "./StoreMove.module.scss";
import qiandian from '@/assets/images/qiandian.png'

class StoreMove extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        
    }
  }
  componentDidMount () {

  }
  footerBtn(){
    let btnArr = null;
    btnArr = [
        <div className={Css.bottomBtn}>
            <Button key="1" type="primary"  onClick={this.props.closeModal}>
            知道了
            </Button>
        </div>
     ];
	return btnArr;
  }
  render() {
    return (
        <Modal
         className={Css.moveModal}
          closable={false}
          maskClosable={false}
          title={false}
          width={750}
          centered
          visible={this.props.visible}
          onCancel={this.props.closeModal}
          footer={this.footerBtn()}
        >
          <div className={Css.moveContent}>
           <img className={Css.courseImg} src={qiandian} />
           <div className={Css.moveText}>
            如果您已经有饿了么、有赞、淘宝店铺我们可提供迁店服务具体迁店流程请联系您的销售经理或在线客服
           </div>
          </div>
        </Modal>
    )
  }
}

export default withRouter(StoreMove)
