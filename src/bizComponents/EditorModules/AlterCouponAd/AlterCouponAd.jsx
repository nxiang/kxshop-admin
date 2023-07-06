import React, { Component } from 'react'
import {
  CloseCircleOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { Upload, message, Modal, Spin } from 'antd'
import Css from './AlterCouponAd.module.scss'

import CouponSelect from '../selects/CouponSelect.jsx'

const { confirm } = Modal

// 上传限制
function beforeUpload(file) {
  return new Promise((resolve, reject) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/jpg' ||
      file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('仅支持jpg、jpeg、png格式的图片')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('文件大小不能大于2M')
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
    super(props)
    this.state = {
      spinIs: false
    }
  }

  render() {
    const { item, itemStyle } = this.props
    let imgW, imgH
    switch (itemStyle) {
      case 1:
        imgW = 355
        imgH = 84
        break
      case 2:
        imgW = 115
        imgH = 84
      default:
        break
    }
    return (
      <div
        className={Css['item-img-box']}
        style={{ width: imgW, height: imgH }}
      >
        <Spin tip="上传中..." spinning={this.state.spinIs}>
          <Upload
            name="file"
            action="/proxy/cloud/oss/upload"
            data={{ type: 'tenant' }}
            response={'{"status": "success"}'}
            beforeUpload={beforeUpload}
            showUploadList={false}
            onChange={(info) => {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList, '上传中')
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
                    message.success(`${info.file.name} 上传成功`)
                  } else {
                    message.error(res.errorMsg)
                  }
                  this.setState({
                    spinIs: false
                  })
                }
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败.`)
                this.setState({
                  spinIs: false
                })
              }
            }}
          >
            {item.image ? (
              <div
                className={Css['img-show-box']}
                style={{ width: imgW, height: imgH }}
              >
                <div className={Css['img-mask']}>
                  <div className={Css['mask-text']}>替换</div>
                </div>
                <img className={Css['img-show-img']} src={item.image} />
              </div>
            ) : (
              <div
                className={Css['item-img-upload']}
                style={{ width: imgW, height: imgH }}
              >
                <PlusOutlined />
                <p className={Css['upload-text']}>添加图片</p>
              </div>
            )}
          </Upload>
        </Spin>
      </div>
    )
  }
}

class AlterCouponAd extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  // 修改图片
  alterImage(index, imgUrl) {
    let itemData = this.props.itemData
    itemData[index] = {
      ...itemData[index],
      image: imgUrl
    }
    this.props.alterTrigger(itemData)
  }

  // 修改模块样式
  alterStyle(index) {
    this.props.alterStyle(index)
  }

  // 修改跳转优惠券
  alterData(index, data) {
    let itemData = this.props.itemData
    itemData[index] = {
      ...itemData[index],
      data: data
    }
    this.props.alterTrigger(itemData)
  }

  // 新增子类
  alterAdd() {
    let itemData = this.props.itemData
    if (itemData) {
      itemData.push({
        image: '',
        type: 'coupon',
        data: ''
      })
    } else {
      itemData = [
        {
          image: '',
          type: 'coupon',
          data: ''
        }
      ]
    }
    this.props.alterTrigger(itemData)
  }

  // 删除子类
  alterDel(index) {
    let itemData = this.props.itemData
    itemData.splice(index, 1)
    this.props.alterTrigger(itemData)
  }

  // 删除当前模块s
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
        console.log('Cancel')
      }
    })
  }

  render() {
    const { itemData, itemStyle } = this.props
    return (
      <div className={Css['alter-ad-box']}>
        <div className={Css['alter-header']}>
          <div className={Css['header-left']}>
            <p className={Css['header-left-title']}>优惠券广告</p>
            <p className={Css['header-left-text']}>*最多添加5张</p>
          </div>
          <div
            className={Css['header-right']}
            onClick={this.moduleDel.bind(this)}
          >
            <DeleteOutlined className={Css['header-right-icon']} />
            <p className={Css['header-right-text']}>删除</p>
          </div>
        </div>
        <div className={Css['alter-style-choice']}>
          <div className={Css['style-header']}>选择样式</div>
          <div className={Css['style-content']}>
            <div className={Css['style-content-item']}>
              <div
                className={
                  itemStyle && itemStyle === 1
                    ? `${Css['item-image-box']} ${Css['blue-border']}`
                    : Css['item-image-box']
                }
                onClick={this.alterStyle.bind(this, 1)}
              >
                <img
                  src="https://img.kxll.com/admin_manage/icon/icon_default.png"
                  alt=""
                />
              </div>
              <p className={Css['item-text']}>标准</p>
            </div>
            <div className={Css['style-content-item']}>
              <div
                className={
                  itemStyle && itemStyle === 2
                    ? `${Css['item-carousel-box']} ${Css['blue-border']}`
                    : Css['item-carousel-box']
                }
                style={{ width: 178, height: 60 }}
                onClick={this.alterStyle.bind(this, 2)}
              >
                <div className={Css['carousel-item']}>
                  <img
                    src="https://img.kxll.com/admin_manage/icon/icon_default.png"
                    alt=""
                  />
                </div>
                <div className={Css['carousel-item']}>
                  <img
                    src="https://img.kxll.com/admin_manage/icon/icon_default.png"
                    alt=""
                  />
                </div>
                <div className={Css['carousel-item']}>
                  <img
                    src="https://img.kxll.com/admin_manage/icon/icon_default.png"
                    alt=""
                  />
                </div>
              </div>
              <p className={Css['item-text']}>轮播</p>
            </div>
          </div>
        </div>
        {itemData && itemData.length > 0 && (
          <div className={Css['alter-content']}>
            {itemData.map((item, index) => {
              return (
                <div className={Css['alter-content-item']} key={index}>
                  {itemData.length > 1 && itemStyle === 1 && (
                    <CloseCircleOutlined
                      className={Css['alter-del']}
                      onClick={this.alterDel.bind(this, index)}
                    />
                  )}
                  {itemData.length > 1 && itemStyle === 2 && (
                    <CloseCircleOutlined
                      className={Css['alter-del']}
                      style={{ right: 230 }}
                      onClick={this.alterDel.bind(this, index)}
                    />
                  )}
                  <AliyunOSSUpload
                    item={item}
                    index={index}
                    itemStyle={itemStyle}
                    alterImage={this.alterImage.bind(this, index)}
                  />
                  {itemStyle === 1 && (
                    <p className={Css['item-text']}>
                      推荐图片尺寸710*168，大小不超过2M
                    </p>
                  )}
                  {itemStyle === 2 && (
                    <p className={Css['item-text']}>
                      推荐图片尺寸230*168，大小不超过2M
                    </p>
                  )}
                  <div className={Css['item-type-box']}>
                    <p className={Css['item-type-select']}>设置优惠券</p>
                    <CouponSelect
                      channelType={this.props.channelType}
                      itemData={item.data}
                      alterData={this.alterData.bind(this, index)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {(!itemData || itemData.length < 5) && (
          <div
            className={Css['add-banner-box']}
            onClick={this.alterAdd.bind(this)}
          >
            <PlusOutlined />
            <p className={Css['add-banner-text']}>添加</p>
          </div>
        )}
      </div>
    )
  }
}

export default AlterCouponAd
