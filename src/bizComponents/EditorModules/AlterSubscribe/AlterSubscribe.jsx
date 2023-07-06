import React, {Component} from "react";
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload, Spin } from "antd";
import Css from "./AlterSubscribe.module.scss";
import LabelRadioGroup from '@/components/LabelRadioGroup/LabelRadioGroup';

const {confirm} = Modal;

// 上传限制
function beforeUpload(file) {
  return new Promise((resolve, reject) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('仅支持jpg、jpeg、png、gif格式的图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件大小不能大于2M');
    }
    //判断文件是否符合正则表达式的规则
    if (!(isJpgOrPng && isLt2M)) {
      return reject(false)
    }
    return resolve(true)
  })
}

// 阿里云上传组件
class AliyunOSSUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinIs: false
    }
  }

  render() {
    return (
      <div className={Css["img-box"]}>
        <Spin tip="上传中..." spinning={this.state.spinIs}>
          <Upload
            name='file'
            action='/proxy/cloud/oss/upload'
            data={{ type: 'tenant' }}
            response={'{"status": "success"}'}
            beforeUpload={beforeUpload}
            showUploadList={false}
            onChange={(info) => {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList, '上传中');
              }
              if (info.file.status === 'uploading') {
                this.setState({
                  spinIs: true
                })
              }
              if (info.file.status === 'done') {
                if (info.file.response) {
                  let res = info.file.response
                  if (res.errorCode === '0') {
                    this.props.alterImage(res.data.url)
                    message.success(`${info.file.name} 上传成功`);
                  } else {
                    message.error(res.errorMsg)
                  }
                  this.setState({
                    spinIs: false
                  })
                }
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败.`);
                this.setState({
                  spinIs: false
                })
              }
            }}
          >
            {
                this.props.itemData && this.props.itemData.image ?
                  <div className={Css["img-show-box"]}>
                    <div className={Css["img-mask"]}>
                      <div className={Css["mask-text"]}>替换</div>
                    </div>
                    <img className={Css["img-show-img"]} src={this.props.itemData.image}/>
                  </div>
                  :
                  <div className={Css['img-upload']}>
                    <PlusOutlined />
                    <p className={Css['upload-text']}>添加图片</p>
                  </div>
              }
          </Upload>
        </Spin>
      </div>
    );
  }
}

class AlterAssistAd extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  alterImage(imgUrl) {
    let itemData = [{
      image: imgUrl
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

  propertiesRadioChange(index, e) {
    let { propertiesArr } = this.props
    propertiesArr[index].value = e.target.value
    this.props.alterPropertiesArr(propertiesArr);
  }

  render() {
    const { propertiesArr } = this.props;
    return (
      <div className={Css["alter-assist-ad-box"]}>
        <div className={Css["alter-header"]}>
          <div className={Css["header-left"]}>
            <p className={Css["header-left-title"]}>订阅消息</p>
          </div>
          <div className={Css["header-right"]} onClick={this.moduleDel.bind(this)}>
            <DeleteOutlined className={Css["header-right-icon"]} />
            <p className={Css["header-right-text"]}>删除</p>
          </div>
        </div>
        {propertiesArr && propertiesArr.map((item, index) => {
          return (
            <LabelRadioGroup
              key={ item.id }
              label={ item.label }
              value={ item.value }
              radioList={ item.radioList }
              radioChange={this.propertiesRadioChange.bind(this, index) } />
          );
        })}
        <div className={Css["alter-content"]}>
          <AliyunOSSUpload itemData={this.props.itemData[0]} alterImage={this.alterImage.bind(this)}/>
          <div className={Css["img-text"]}>推荐图片尺寸710x60，大小不超过2M</div>
        </div>
        {/* <div className={Css["alter-content-tips"]}>
          配置仅在支付宝生效
        </div> */}
      </div>
    );
  }
}

export default AlterAssistAd