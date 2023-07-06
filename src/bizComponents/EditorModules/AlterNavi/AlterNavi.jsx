import React, { Component } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload, message, Modal, Input, Spin } from 'antd';
import Css from './AlterNavi.module.scss';
import SelectGather from '../SelectGather/SelectGather';

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
    // 判断文件是否符合正则表达式的规则
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
    const { item, alterImage } = this.props;
    const { spinIs } = this.state;
    return (
      <div className={Css['item-img-box']}>
        <Spin tip="上传中..." spinning={spinIs}>
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
                  const res = info.file.response;
                  if (res.errorCode === '0') {
                    alterImage(res.data.url);
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
            {item.image ? (
              <div className={Css['img-show-box']}>
                <div className={Css['img-mask']}>
                  <div className={Css['mask-text']}>替换</div>
                </div>
                <img className={Css['img-show-img']} src={item.image} alt="" />
              </div>
            ) : (
              <div className={Css['item-img-upload']}>
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

class AlterNavi extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 修改图片
  alterImage(index, imgUrl) {
    const { itemData, alterTrigger } = this.props;
    itemData[index] = {
      ...itemData[index],
      image: imgUrl,
    };
    alterTrigger(itemData);
  }

  // 修改跳转状态
  alterType(index, e) {
    const { itemData, alterTrigger } = this.props;
    itemData[index] = {
      ...itemData[index],
      type: e,
      data: '',
    };
    alterTrigger(itemData);
  }

  // 修改跳转对象
  alterData(index, data) {
    const { itemData, alterTrigger } = this.props;
    itemData[index] = {
      ...itemData[index],
      data,
    };
    alterTrigger(itemData);
  }

  // 修改个数
  alterNum(num) {
    const { itemNum, itemData, alterNum, alterTrigger } = this.props;
    let newItemData = [];
    if (itemNum !== num) {
      if (num < itemNum) {
        newItemData = itemData.slice(0, num);
      } else {
        newItemData = itemData;
        for (let i = newItemData.length; i < num; i += 1) {
          newItemData.push({
            title: `导航${i + 1}`,
            image: '',
            data: '',
            type: 'none',
          });
        }
      }
    } else {
      return;
    }
    alterNum(num);
    alterTrigger(newItemData);
  }

  // 修改样式
  alterStyle(num) {
    const { itemStyle, alterStyle } = this.props;
    if (itemStyle !== num) alterStyle(num);
  }

  // 修改标题
  alterTitle(index, e) {
    const { itemData, alterTrigger } = this.props;
    itemData[index] = {
      ...itemData[index],
      title: e.target.value.trim(),
    };
    alterTrigger(itemData);
  }
  alterFocus(index){
    console.log(index);
  }
  // 删除模块
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
    const { itemStyle, itemData, itemNum } = this.props;
    return (
      <div className={Css['alter-ad-box']}>
        <div className={Css['alter-header']}>
          <div className={Css['header-left']}>
            <p className={Css['header-left-title']}>菜单导航</p>
            <p className={Css['header-left-text']}>推荐图片尺寸100*100</p>
          </div>
          <div className={Css['header-right']} onClick={this.moduleDel.bind(this)}>
            <DeleteOutlined className={Css['header-right-icon']} />
            <p className={Css['header-right-text']}>删除</p>
          </div>
        </div>
        
        <div className={Css['alter-style-choice']}>
          <div className={Css['style-header']}>导航个数</div>
          <div className={Css['style-content-box']}>
            <div className={Css['quantity-item']}>
              <div
                className={`${Css['item-img-box']} ${Css['item-size-one']} ${itemNum === 3 &&
                  Css['blue-border']}`}
                onClick={this.alterNum.bind(this, 3)}
              >
                {[1, 2, 3].map(item => {
                  return (
                    <div className={Css['item-img']} key={item}>
                      <img
                        className={Css['icon-img']}
                        src="https://img.kxll.com/admin_manage/icon/icon_default.png"
                        alt=""
                      />
                    </div>
                  );
                })}
              </div>
              <p className={Css['item-text']}>3个(尺寸:100*100)</p>
            </div>
            <div className={Css['quantity-item']}>
              <div
                className={`${Css['item-img-box']} ${Css['item-size-two']} ${itemNum === 4 &&
                  Css['blue-border']}`}
                onClick={this.alterNum.bind(this, 4)}
              >
                {[1, 2, 3, 4].map(item => {
                  return (
                    <div className={Css['item-img']} key={item}>
                      <img
                        className={Css['icon-img']}
                        src="https://img.kxll.com/admin_manage/icon/icon_default.png"
                        alt=""
                      />
                    </div>
                  );
                })}
              </div>
              <p className={Css['item-text']}>4个(尺寸:100*100)</p>
            </div>
            <div className={Css['quantity-item']} style={{ marginTop: 16 }}>
              <div
                className={`${Css['item-img-box']} ${Css['item-size-three']} ${itemNum === 8 &&
                  Css['blue-border']}`}
                onClick={this.alterNum.bind(this, 8)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(item => {
                  return (
                    <div className={Css['item-img']} key={item}>
                      <img
                        className={Css['icon-img']}
                        src="https://img.kxll.com/admin_manage/icon/icon_default.png"
                        alt=""
                      />
                    </div>
                  );
                })}
              </div>
              <p className={Css['item-text']}>8个(尺寸:100*100)</p>
            </div>
            {/* 两排十个 */}
            <div className={Css['quantity-item']} style={{ marginTop: 16 }}>
              <div
                className={`${Css['item-img-box']} ${Css['item-size-three']} ${itemNum === 10 &&
                  Css['blue-border']}`}
                onClick={this.alterNum.bind(this, 10)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => {
                  return (
                    <div 
                      className={`${Css['item-img']} ${Css['small']}`} 
                      key={item}
                    >
                      <img
                        className={Css['icon-img']}
                        src="https://img.kxll.com/admin_manage/icon/icon_default.png"
                        alt=""
                      />
                    </div>
                  );
                })}
              </div>
              <p className={Css['item-text']}>10个(尺寸:100*100)</p>
            </div>
          </div>
        </div>

        <div className={Css['alter-style-choice']}>
          <div className={Css['style-header']}>选择样式</div>
          <div className={Css['style-content-box']}>
            <div className={Css['style-item']}>
              <div
                className={`${Css['item-img']} ${itemStyle === 1 && Css['blue-border']}`}
                onClick={this.alterStyle.bind(this, 1)}
              >
                <img
                  className={Css['icon-img']}
                  src="https://img.kxll.com/admin_manage/icon/icon_default.png"
                  alt=""
                />
              </div>
              <p className={Css['item-text']}>方形</p>
            </div>
            <div className={Css['style-item']} style={{ marginLeft: 24 }}>
              <div
                className={`${Css['item-img']} ${itemStyle === 2 && Css['blue-circle-border']}`}
                onClick={this.alterStyle.bind(this, 2)}
              >
                <img
                  className={Css['icon-img']}
                  src="https://img.kxll.com/admin_manage/icon/icon_default.png"
                  alt=""
                />
              </div>
              <p className={Css['item-text']}>圆形</p>
            </div>
          </div>
        </div>
        {itemData && itemData.length > 0 && (
          <div className={Css['alter-content']}>
            {itemData.map((item, index) => {
              return (
                <div className={Css['alter-content-item']} key={index}>
                  <AliyunOSSUpload item={item} alterImage={this.alterImage.bind(this, index)} />
                  <div className={Css['item-right-box']}>
                    <div className={Css['item-right-item']}>
                      <p className={Css['item-right-item-text']}>标题</p>
                      <Input
                        style={{ width: '230px' }}
                        type="text"
                        value={item.title}
                        placeholder={'请输入标题'}
                        onChange={this.alterTitle.bind(this, index)}
                        maxLength={4}
                      />
                    </div>
                    <div className={Css['item-right-item']}>
                      <p className={Css['item-right-item-text']}>链接</p>
                      <SelectGather
                        type={item.type}
                        data={item.data}
                        getCoupon={true}
                        leftWidht={100}
                        rightWidht={120}
                        alterType={this.alterType.bind(this, index)}
                        alterData={this.alterData.bind(this, index)}
                        alterFocus={this.alterFocus.bind(this,index)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default AlterNavi;
