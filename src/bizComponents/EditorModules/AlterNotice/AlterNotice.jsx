import React, {Component} from "react";
import { DeleteOutlined } from '@ant-design/icons';
import { Modal, message, Input } from 'antd';
import Css from "./AlterNotice.module.scss";

const {confirm} = Modal;
const {TextArea} = Input;

class AlterNotice extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  alterData(e) {
    let itemData = [{
      data: e.target.value.trim()
    }]
    this.props.alterTrigger(itemData)
  }

  moduleDel() {
    const that = this
    confirm({
      title: '删除',
      content: '确定删除此模块吗',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.props.alterDel()
        message.success('模块删除成功')
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  render() {
    console.log(this.props.itemData)
    return (
      <div className={Css["alter-notice-box"]}>
        <div className={Css["alter-header"]}>
          <div className={Css["header-left"]}>
            <p className={Css["header-left-title"]}>公告中心</p>
          </div>
          <div className={Css["header-right"]} onClick={this.moduleDel.bind(this)}>
            <DeleteOutlined className={Css["header-right-icon"]} />
            <p className={Css["header-right-text"]}>删除</p>
          </div>
        </div>
        <div className={Css["alter-content"]}>
          <TextArea className={Css["content-text"]} value={this.props.itemData[0].data} maxLength={24} rows={4} placeholder={'请输入公告内容，24字以内'} onChange={this.alterData.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default AlterNotice