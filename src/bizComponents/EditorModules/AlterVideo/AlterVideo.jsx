import React, { useState, useEffect } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, message, Spin, Upload } from 'antd';
import Css from './AlterVideo.module.scss';
import LabelRadioGroup from '@/components/LabelRadioGroup/LabelRadioGroup';

const { confirm } = Modal;

function AliyunOSSUpload(props) {
  const [spinIs, setSpinIs] = useState(false);

  // 图片上传限制
  const beforeUpload = file => {
    return new Promise((resolve, reject) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('仅支持jpg、jpeg、png格式的图片');
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
  };

  // 视频上传限制
  const videoBeforeUpload = file => {
    return new Promise((resolve, reject) => {
      console.log(file.type);
      const isJpgOrPng = file.type === 'video/mp4';
      if (!isJpgOrPng) {
        message.error('仅支持mp4格式的视频');
      }
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        message.error('文件大小不能大于20M');
      }
      //判断文件是否符合正则表达式的规则
      if (!(isJpgOrPng && isLt20M)) {
        return reject(false);
      }
      return resolve(true);
    });
  };

  const { type, videoUrl } = props;
  return (
    <div className={Css['item-img-box']}>
      <Spin tip="上传中..." spinning={spinIs}>
        <Upload
          name="file"
          action="/proxy/cloud/oss/upload"
          data={{ type: 'tenant' }}
          response={'{"status": "success"}'}
          beforeUpload={type == 'video' ? videoBeforeUpload : beforeUpload}
          showUploadList={false}
          onChange={info => {
            if (info.file.status !== 'uploading') {
              console.log(info.file, info.fileList, '上传中');
            }
            if (info.file.status === 'uploading') {
              setSpinIs(true);
            }
            if (info.file.status === 'done') {
              if (info.file.response) {
                let res = info.file.response;
                if (res.errorCode === '0') {
                  props.alterImage(res.data.url);
                  message.success(`${info.file.name} 上传成功`);
                } else {
                  message.error(res.errorMsg);
                }
                setSpinIs(false);
              }
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} 上传失败.`);
              setSpinIs(false);
            }
          }}
        >
          {videoUrl && (
            <div className={Css['img-show-box']} style={{ width: 160, height: 90 }}>
              <div className={Css['img-mask']}>
                <div className={Css['mask-text']}>替换</div>
              </div>
              {type == 'video' && <video className={Css['video-show-box']} src={videoUrl} />}
              {type == 'image' && <img className={Css['img-show-img']} src={videoUrl} />}
            </div>
          )}
          {!videoUrl && (
            <div className={Css['item-img-upload']} style={{ width: 160, height: 90 }}>
              <PlusOutlined />
              <p className={Css['upload-text']}>{type == 'video' ? '添加视频' : '添加封面'}</p>
            </div>
          )}
        </Upload>
      </Spin>
    </div>
  );
}

export default function AlterVideo(props) {
  // 修改图片
  const alterImage = (type, imgUrl) => {
    let itemData = props.itemData;
    if (type == 'video') {
      itemData = {
        ...itemData,
        videoUrl: imgUrl,
      };
    } else if (type == 'image') {
      itemData = {
        ...itemData,
        videoCover: imgUrl,
      };
    }
    props.alterTrigger(itemData);
  };

  // 删除当前模块
  const moduleDel = () => {
    confirm({
      title: '删除',
      content: '确定删除此模块吗',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        props.alterDel();
        message.success('模块删除成功');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const propertiesRadioChange = (index, e) => {
    let propertiesArr = props.propertiesArr
    propertiesArr[index].value = e.target.value
    props.alterPropertiesArr(propertiesArr);
  }
  const { itemData, propertiesArr } = props;
  return (
    <div className={Css['alter-video-box']}>
      <div className={Css['alter-header']}>
        <div className={Css['header-left']}>
          <p className={Css['header-left-title']}>视频内容</p>
          {/* <p className={Css['header-left-text']}>*最多添加5张</p> */}
        </div>
        <div className={Css['header-right']} onClick={() => moduleDel()}>
          <DeleteOutlined className={Css['header-right-icon']} />
          <p className={Css['header-right-text']}>删除</p>
        </div>
      </div>
      {propertiesArr && propertiesArr.map((item, index) => {
        return (
          <LabelRadioGroup
            key={ item.id }
            label={ item.label }
            value={ item.value }
            radioList={ item.radioList }
            radioChange={(e)=>propertiesRadioChange(index, e) } />
        );
      })}
      <div className={Css['alter-content']}>
        <div className={Css['ali-oss-box']}>
          <AliyunOSSUpload
            type="video"
            alterImage={imgUrl => alterImage('video', imgUrl)}
            videoUrl={itemData.videoUrl}
          />
        </div>
        <p className={Css['item-text']}>建议视频比例16：9，大小不超过20M</p>
        <div className={Css['ali-oss-box']}>
          <AliyunOSSUpload
            type="image"
            alterImage={imgUrl => alterImage('image', imgUrl)}
            videoUrl={itemData.videoCover}
          />
        </div>
        <p className={Css['item-text']}>图片比例16：9，大小不超过2M</p>
      </div>
    </div>
  );
}
