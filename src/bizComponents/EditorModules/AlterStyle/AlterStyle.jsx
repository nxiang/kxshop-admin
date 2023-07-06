import React, { useState, useEffect } from 'react';
import {
  CloseCircleOutlined,
  ConsoleSqlOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Css from './AlterStyle.module.scss';
import { Upload, message, Spin, Radio, Switch, Col, Row, Space } from 'antd';
import ColorItem from '@/components/ColorItem/ColorItem';

// 上传限制
function beforeUpload(file) {
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
}

// 阿里云上传组件
function AliyunOSSUpload(props) {
  const [spinIs, setSpinIs] = useState(false);

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
          {props.backgroundImg ? (
            <div className={Css['img-show-box']}>
              <div className={Css['img-mask']}>
                <div className={Css['mask-text']}>替换</div>
              </div>
              <img className={Css['img-show-img']} src={props.backgroundImg} />
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

export default function AlterStyle(props) {
  const { itemData } = props;
  let { backgroundType = 1 } = itemData;
  console.log(itemData);

  // 设置背景图片
  const alterImage = imgUrl => {
    let data = {
      ...itemData,
      backgroundImg: imgUrl,
    };
    props.alterTrigger(data);
  };

  // 设置背景色
  const alterColor = color => {
    let data = {
      ...itemData,
      backgroundColor: color,
    };
    props.alterTrigger(data);
  };

  const alterDel = () => {
    let data = {
      ...itemData,
      backgroundImg: '',
    };
    props.alterTrigger(data);
  };

  // 设置开关聚合
  const alterAntForestShow = e => {
    let data = {
      ...itemData,
      antForestShow: e,
    };
    props.alterTrigger(data);
  };

  const alterShopShow = e => {
    let data = {
      ...itemData,
      shopShow: e,
    };
    props.alterTrigger(data);
  };

  const radioChange = e => {
    let {
      target: { value },
    } = e;
    let data = {};

    if (value == 1) {
      data = {
        ...itemData,
        backgroundType: value,
      };
    } else if (value == 2) {
      data = {
        ...itemData,
        backgroundType: value,
      };
    }
    props.alterTrigger(data);
  };

  return (
    <div className={Css['alter-style-box']}>
      <div className={Css['alter-header']}>
        <div className={Css['header-left']}>
          <p className={Css['header-left-title']}>页面样式配置</p>
        </div>
      </div>
      <div className={Css['alert-style-type']}>
        <Radio.Group onChange={e => radioChange(e)} value={backgroundType}>
          <Radio value={1}>背景图片</Radio>
          <Radio value={2}>背景颜色</Radio>
        </Radio.Group>
      </div>
      {backgroundType == 1 && (
        <React.Fragment>
          <div className={Css['alter-style-choice']}>
            <div className={Css['style-header']}>背景图片</div>
          </div>
          <div className={Css['alter-content']}>
            <div className={Css['alter-content-item']}>
              {itemData.backgroundImg && (
                <CloseCircleOutlined className={Css['alter-del']} onClick={() => alterDel()} />
              )}
              <AliyunOSSUpload
                backgroundImg={itemData.backgroundImg || ''}
                alterImage={url => alterImage(url)}
              />
              <p className={Css['item-text']}>推荐图片尺寸宽710，大小不超过2M</p>
            </div>
          </div>
        </React.Fragment> 
      )}
      {backgroundType == 2 && (
        <div className={Css['alert-style-colorItem']}>
          <ColorItem
            text="背景颜色"
            color={itemData.backgroundColor || ''}
            reset={{ r: 255, g: 255, b: 255, a: 1 }}
            alterChange={color => {
              alterColor(color);
            }}
          />
        </div>
      )}
      <div className={Css['alter-header']}>
        <div className={Css['header-left']}>
          <p className={Css['header-left-title']}>悬浮窗开关</p>
        </div>
      </div>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Space>
            蚂蚁森林入口
            <Switch checked={itemData.antForestShow} onClick={e => alterAntForestShow(e)} />
          </Space>
        </Col>
        <Col span={24}>
          <Space>
            购物车入口
            <Switch checked={itemData.shopShow} onClick={e => alterShopShow(e)} />
          </Space>
        </Col>
      </Row>
    </div>
  );
}
