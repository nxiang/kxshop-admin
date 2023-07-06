import React, { Component } from 'react';
import { CloseCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload, message, Select, Modal, Spin } from 'antd';
import Css from './AlterShopCart.module.scss';
import SelectGather from '../SelectGather/SelectGather';
import LabelRadioGroup from '@/components/LabelRadioGroup/LabelRadioGroup';

const { Option } = Select;
const { confirm } = Modal;

// 上传限制
function beforeUpload(file) {
  return new Promise((resolve, reject) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('仅支持jpg、jpeg、png、gif格式的图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件大小不能大于2M');
    }
    //判断文件是否符合正则表达式的规则
    if (!(isJpgOrPng && isLt2M)) {
      return reject(false);
    }
    return resolve(true);
  });
}

// 阿里云上传组件
class AliyunOSSUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinIs: false,
    };
  }

  render() {
    const { item } = this.props;
    let imgW, imgH;
    return (
      <div className={Css['item-img-box']}>
        <Spin tip="上传中..." spinning={this.state.spinIs}>
          <Upload
            name="file"
            action="/proxy/cloud/oss/upload"
            data={{ type: 'tenant' }}
            response={'{"status": "success"}'}
            beforeUpload={beforeUpload}
            showUploadList={false}
            onChange={info => {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList, '上传中');
              }
              if (info.file.status === 'uploading') {
                this.setState({
                  spinIs: true,
                });
              }
              if (info.file.status === 'done') {
                if (info.file.response) {
                  let res = info.file.response;
                  if (res.errorCode === '0') {
                    this.props.alterImage(res.data.url);
                    message.success(`${info.file.name} 上传成功`);
                  } else {
                    message.error(res.errorMsg);
                  }
                  this.setState({
                    spinIs: false,
                  });
                }
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败.`);
                this.setState({
                  spinIs: false,
                });
              }
            }}
          >
            {item ? (
              <div className={Css['img-show-box']} style={{ width: imgW, height: imgH }}>
                <div className={Css['img-mask']}>
                  <div className={Css['mask-text']}>替换</div>
                </div>
                <img className={Css['img-show-img']} src={item} />
              </div>
            ) : (
              <div className={Css['item-img-upload']} style={{ width: imgW, height: imgH }}>
                <PlusOutlined />
                <p className={Css['upload-text']}>添加图片</p>
              </div>
            )}
          </Upload>
        </Spin>
      </div>
    );
  }
}

class AlterAd extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 修改图片
  alterImage(imgUrl) {
    let itemData = this.props.itemData;
    console.log('itemData', itemData)
    console.log('imgUrl', imgUrl)
    itemData = {
      ...itemData,
      img: imgUrl,
    };
    this.props.alterTrigger(itemData);
  }

  // 删除当前模块
  moduleDel() {
    const that = this;
    confirm({
      title: '删除',
      content: '确定删除此模块吗',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.props.alterDel();
        message.success('模块删除成功');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  render() {
    const { itemData: { img }, storeType = 'custom' } = this.props;
    return (
      <div className={Css['alter-ad-box']}>
        <div className={Css['alter-header']}>
          <div className={Css['header-left']}>
            <p className={Css['header-left-title']}>快捷购物车</p>
          </div>
          <div className={Css['header-right']} onClick={this.moduleDel.bind(this)}>
            <DeleteOutlined className={Css['header-right-icon']} />
            <p className={Css['header-right-text']}>删除</p>
          </div>
        </div>
        <div className={Css['alter-style-choice']}>
          <div className={Css['style-header']}>购物车图标设置</div>
          <div className={Css['style-content']}>
            <AliyunOSSUpload
              item={img}
              alterImage={this.alterImage.bind(this)}
            />
            <p className={Css['item-text']}>图片尺寸：72*72，大小不超过2M</p>
          </div>
        </div>
      </div>
    );
  }
}

export default AlterAd;
