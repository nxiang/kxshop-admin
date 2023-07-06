import React, { Component } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload, Spin, Radio } from 'antd';
import Css from './AlterVipInfo.module.scss';
import LabelRadioGroup from '@/components/LabelRadioGroup/LabelRadioGroup';
import ColorItem from '@/components/ColorItem/ColorItem';
import AlterHeader from '../Modules/AlterHeader/AlterHeader';
const { confirm } = Modal;

// 上传限制
function beforeUpload(file) {
  return new Promise((resolve, reject) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/jpg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif';
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
    const { itemData } = this.props;
    return (
      <div className={Css['img-box']}>
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
            {itemData ? (
              <div className={Css['img-show-box']}>
                <div className={Css['img-mask']}>
                  <div className={Css['mask-text']}>替换</div>
                </div>
                <img className={Css['img-show-img']} src={itemData} />
              </div>
            ) : (
              <div className={Css['img-upload']}>
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
class AlterVipInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
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
  propertiesRadioChange(index, e) {
    let { propertiesArr } = this.props;
    propertiesArr[index].value = e.target.value;
    this.props.alterPropertiesArr(propertiesArr);
  }
  alterImage(imgUrl) {
    let { itemData } = this.props;
    itemData = {
      ...itemData,
      image: imgUrl,
    };
    this.props.alterTrigger(itemData);
  }
  subtitleRadioChange(e) {
    const { itemData } = this.props;
    let newItemData = {};
    itemData.backgroundType = e.target.value;
    newItemData = itemData;
    this.props.alterTrigger(newItemData);
  }
  changeInteg(e) {
    let { itemData } = this.props;
    itemData = {
      ...itemData,
      integ: e.target.value,
    };
    this.props.alterTrigger(itemData);
  }
  changeBance(e) {
    let { itemData } = this.props;
    itemData = {
      ...itemData,
      balance: e.target.value,
    };
    this.props.alterTrigger(itemData);
  }
  changeCoupon(e) {
    let { itemData } = this.props;
    itemData = {
      ...itemData,
      coupon: e.target.value,
    };
    this.props.alterTrigger(itemData);
  }
  // 设置背景色
  alertColorChange(color) {
    let { itemData } = this.props;
    itemData = {
      ...itemData,
      backgroundColor: color,
    };
    console.log('itemData=', itemData);
    this.props.alterTrigger(itemData);
  }
  render() {
    const { itemData, propertiesArr } = this.props;
    console.log('backgroundType=', itemData.backgroundType);
    return (
      <div className={Css['alter-assist-ad-box']}>
        <AlterHeader
          title="会员信息"
          alterDel={() => {
            this.props.alterDel()
          }}
        />
        <div className={Css['alter-subtitle-choice']}>
          <div className={Css['style-content']}>
            <Radio.Group
              onChange={this.subtitleRadioChange.bind(this)}
              value={itemData.backgroundType}
            >
              <Radio value={1}>背景图片</Radio>
              <Radio value={2}>背景颜色</Radio>
            </Radio.Group>
          </div>
          {itemData.backgroundType == 1 ? (
            <div>
              <div className={Css['style-header']}>背景图片</div>
              <div className={Css['style-content']}>
                <AliyunOSSUpload
                  itemData={itemData.image}
                  alterImage={this.alterImage.bind(this)}
                />
                <div className={Css['img-text']}>推荐图片尺寸710x60，大小不超过2M</div>
              </div>
            </div>
          ) : (
            <div style={{ margin: '20px 0 20px 0' }}>
              <div className={Css['style-header']}>标题颜色</div>
              <div className={Css['style-content']}>
                <ColorItem
                  color={itemData.backgroundColor || ''}
                  reset={{ r: 255, g: 255, b: 255, a: 1 }}
                  alterChange={this.alertColorChange.bind(this)}
                />
              </div>
            </div>
          )}
          <div style={{ marginTop: '10px' }}>
            {propertiesArr &&
              propertiesArr.map((item, index) => {
                return (
                  <LabelRadioGroup
                    key={item.id}
                    label={item.label}
                    value={item.value}
                    radioList={item.radioList}
                    radioChange={this.propertiesRadioChange.bind(this, index)}
                  />
                );
              })}
          </div>
          <div style={{ display: 'flex', marginTop: '20px' }}>
            <div className={Css['style-header']}>积分</div>
            <div className={Css['style-content']}>
              <Radio.Group onChange={this.changeInteg.bind(this)} value={itemData.integ}>
                <Radio value={1}>显示</Radio>
                <Radio value={2}>不显示</Radio>
              </Radio.Group>
            </div>
          </div>
          <div style={{ display: 'flex', marginTop: '20px' }}>
            <div className={Css['style-header']}>余额</div>
            <div className={Css['style-content']}>
              <Radio.Group onChange={this.changeBance.bind(this)} value={itemData.balance}>
                <Radio value={1}>显示</Radio>
                <Radio value={2}>不显示</Radio>
              </Radio.Group>
            </div>
          </div>
          <div style={{ display: 'flex', marginTop: '20px' }}>
            <div className={Css['style-header']}>优惠券</div>
            <div className={Css['style-content']}>
              <Radio.Group onChange={this.changeCoupon.bind(this)} value={itemData.coupon}>
                <Radio value={1}>显示</Radio>
                <Radio value={2}>不显示</Radio>
              </Radio.Group>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AlterVipInfo;
