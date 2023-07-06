import React from 'react';
import { withRouter } from '@/utils/compatible'
import { Button, Input, message, Upload, Icon, Modal } from 'antd';
import Css from './ImportCourse.module.scss';
import images1 from '@/assets/images/1.gif'
import images2 from '@/assets/images/2.gif'
import images3 from '@/assets/images/3.gif'

class ImportCourse extends React.Component {
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
        title="导入教程"
        width={800}
        visible={this.props.visible}
        onCancel={this.props.closeModal}
        footer={this.footerBtn()}
        className={Css.courseModal}
      >
        <div className={Css.courseContent}>
          <p>1.按模版整理好商品数据后上传导入</p>
          <img className={Css.courseImg} src={images1} />
          <p style={{ marginTop: 40 }}>
            2.按导入表格中的商品名称建立商品图片文件夹，并在该文件夹下新建主图和详情图两个文件夹。接着将商品图片放入对应商品图片文件夹的主图文件夹和详情图文件夹中（注意文件大小和格式）
          </p>
          <img className={Css.courseImg} src={images2} />
          <p style={{ marginTop: 40 }}>3.将所有整理好的商品图片文件夹打包成zip格式的压缩包上次</p>
          <img className={Css.courseImg} src={images3} />
        </div>
      </Modal>
    );
  }
}

export default withRouter(ImportCourse);
