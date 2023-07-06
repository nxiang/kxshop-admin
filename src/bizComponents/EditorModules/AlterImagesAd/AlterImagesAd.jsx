import React, { useState, useEffect } from 'react';
import { CloseCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Select, Modal, message, Spin, Upload } from 'antd';
import Css from './AlterImagesAd.module.scss';
import SelectGather from '../SelectGather/SelectGather';
import LabelRadioGroup from '@/components/LabelRadioGroup/LabelRadioGroup';

const { confirm } = Modal;
const { Option } = Select;

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
    // 判断文件是否符合正则表达式的规则
    if (!(isJpgOrPng && isLt2M)) {
      return reject(false);
    }
    return resolve(true);
  });
}

function AliyunOSSUpload(props) {
  const [spinIs, setSpinIs] = useState(false);

  const { item } = props;
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
          {item.image ? (
            <div className={Css['img-show-box']} style={{ width: 355 }}>
              <div className={Css['img-mask']}>
                <div className={Css['mask-text']}>替换</div>
              </div>
              <img className={Css['img-show-img']} src={item.image} />
            </div>
          ) : (
            <div className={Css['item-img-upload']} style={{ width: 355, minHeight: 100 }}>
              <PlusOutlined />
              <p className={Css['upload-text']}>添加图片</p>
            </div>
          )}
        </Upload>
      </Spin>
    </div>
  );
}

export default function AlterImagesAd(props) {
  const { itemData, itemStyle = 1, itemType = 0, storeType = 'custom', propertiesArr } = props;
  // 修改图片
  const alterImage = (index, imgUrl) => {
    let itemData = props.itemData;
    itemData[index] = {
      ...itemData[index],
      image: imgUrl,
    };
    props.alterTrigger(itemData);
  };

  // 修改跳转类型
  const alterType = (index, e) => {
    console.log(index, e);
    let itemData = props.itemData;
    itemData[index] = {
      ...itemData[index],
      type: e,
      data: '',
    };
    props.alterTrigger(itemData);
  };

  // 修改跳转目标
  const alterData = (index, data) => {
    console.log(index, data);
    let itemData = props.itemData;
    itemData[index] = {
      ...itemData[index],
      data: data,
    };
    props.alterTrigger(itemData);
  };
  const alterFocus = index => {};
  // 修改模块样式
  const alterStyle = index => {
    let itemData = props.itemData;
    let realIndex = index;
    if (itemStyle == 5) {
      let diffNum = itemData.length - itemStyle;
      realIndex = diffNum < 0 ? index + Math.abs(diffNum) : index - Math.abs(diffNum);
    }
    if (itemStyle == 6) {
      itemData.push({
        image: '',
        data: '',
        type: 'none',
      });
    }

    // 降低数量处理
    if (realIndex != itemStyle && realIndex < itemStyle) {
      for (let i = realIndex; i < itemStyle; i++) {
        itemData.splice(itemData.length - 1, 1);
      }
    }

    // 增加数量处理
    if (realIndex != itemStyle && realIndex > itemStyle) {
      for (let i = realIndex; i > itemStyle; i--) {
        itemData.push({
          image: '',
          data: '',
          type: 'none',
        });
      }
    }

    // 若为5则过滤掉空白数据
    if (index == 5) {
      for (let i = 0; i < itemData.length; i++) {
        if (itemData.length <= 1) break;
        if (!itemData[i].image) {
          itemData.splice(i, 1);
          i--;
        }
      }
    } else if(index == 6) {
      itemData.length = 5
    }

    props.alterTrigger(itemData);
    props.alterStyle(index);
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
    let propertiesArr = props.propertiesArr;
    propertiesArr[index].value = e.target.value;
    props.alterPropertiesArr(propertiesArr);
  };
  // 新增子类
  const alterAdd = () => {
    let itemData = props.itemData;
    itemData.push({
      image: '',
      type: 'none',
      data: '',
    });
    props.alterTrigger(itemData);
  };
  // 删除子类
  const alterDel = index => {
    let itemData = props.itemData;
    itemData.splice(index, 1);
    props.alterTrigger(itemData);
  };

  return (
    <div className={Css['alter-images-ad-box']}>
      <div className={Css['alter-header']}>
        <div className={Css['header-left']}>
          <p className={Css['header-left-title']}>图片广告</p>
          {/* <p className={Css['header-left-text']}>*最多添加5张</p> */}
        </div>
        <div className={Css['header-right']} onClick={() => moduleDel()}>
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
              onClick={() => alterStyle(1)}
            >
              <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
            </div>
            <p className={Css['item-text']}>单张</p>
          </div>
          <div className={Css['style-content-item']}>
            <div
              className={
                itemStyle && itemStyle === 2
                  ? `${Css['item-carousel-box']} ${Css['blue-border']}`
                  : Css['item-carousel-box']
              }
              // style={{ width: 178, height: 60 }}
              onClick={() => alterStyle(2)}
            >
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
            </div>
            <p className={Css['item-text']}>一行两张</p>
          </div>
        </div>
        <div className={Css['style-content']}>
          <div className={Css['style-content-item']}>
            <div
              className={
                itemStyle && itemStyle === 3
                  ? `${Css['item-carousel-box']} ${Css['blue-border']}`
                  : Css['item-carousel-box']
              }
              // style={{ width: 178, height: 60 }}
              onClick={() => alterStyle(3)}
            >
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
            </div>
            <p className={Css['item-text']}>一行三张</p>
          </div>
          <div className={Css['style-content-item']}>
            <div
              className={
                itemStyle && itemStyle === 4
                  ? `${Css['item-carousel-box']} ${Css['blue-border']}`
                  : Css['item-carousel-box']
              }
              // style={{ width: 178, height: 60 }}
              onClick={() => alterStyle(4)}
            >
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
            </div>
            <p className={Css['item-text']}>一行四张</p>
          </div>
        </div>
        <div className={Css['style-content']}>
          <div className={Css['style-content-item']}>
            <div
              className={
                itemStyle && itemStyle === 6
                  ? `${Css['item-carousel-box']} ${Css['blue-border']}`
                  : Css['item-carousel-box']
              }
              // style={{ width: 178, height: 60 }}
              onClick={() => alterStyle(6)}
            >
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
            </div>
            <p className={Css['item-text']}>一行五张</p>
          </div>
          <div className={Css['style-content-item']}>
            <div
              className={
                itemStyle && itemStyle === 5
                  ? `${Css['item-carousel-box']} ${Css['blue-border']}`
                  : Css['item-carousel-box']
              }
              // style={{ width: 178, height: 60 }}
              onClick={() => alterStyle(5)}
            >
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
              <div className={Css['carousel-item']}>
                <img src="https://img.kxll.com/admin_manage/icon/icon_default.png" alt="" />
              </div>
            </div>
            <p className={Css['item-text']}>横向滑动</p>
          </div>
        </div>
      </div>
      {propertiesArr &&
        propertiesArr.map((item, index) => {
          return (
            <LabelRadioGroup
              key={item.id}
              label={item.label}
              value={item.value}
              radioList={item.radioList}
              radioChange={e => propertiesRadioChange(index, e)}
            />
          );
        })}
      {itemStyle != 5 && itemData && itemData.length > 0 && (
        <div className={Css['alter-content']}>
          {itemData.map((item, index) => {
            return (
              <div className={Css['alter-content-item']} key={index}>
                <AliyunOSSUpload
                  item={item}
                  index={index}
                  alterImage={imgUrl => alterImage(index, imgUrl)}
                />
                <p className={Css['item-text']}>
                  推荐图片尺寸{itemStyle == 1 ? '710' : '355'} 宽长度不限制，大小不超过2M
                </p>
                <SelectGather
                  type={item.type}
                  data={item.data}
                  getCoupon={true}
                  storeType={storeType}
                  itemType={itemType}
                  alterType={data => alterType(index, data)}
                  alterData={data => alterData(index, data)}
                  alterFocus={data => alterFocus(index)}
                />
              </div>
            );
          })}
        </div>
      )}
      {itemStyle == 5 && itemData && itemData.length > 0 && (
        <div className={Css['alter-content']}>
          {itemData.map((item, index) => {
            return (
              <div className={Css['alter-content-item']} key={index}>
                {itemData.length > 1 && (
                  <CloseCircleOutlined
                    className={Css['alter-del']}
                    onClick={() => alterDel(index)}
                  />
                )}
                <AliyunOSSUpload
                  item={item}
                  index={index}
                  alterImage={imgUrl => alterImage(index, imgUrl)}
                />
                <p className={Css['item-text']}>
                  推荐图片尺寸{itemStyle == 1 ? '710' : '355'} 宽长度不限制，大小不超过2M
                </p>
                <SelectGather
                  type={item.type}
                  data={item.data}
                  getCoupon={true}
                  storeType={storeType}
                  itemType={itemType}
                  alterType={data => alterType(index, data)}
                  alterData={data => alterData(index, data)}
                  alterFocus={data => alterFocus(index)}
                />
              </div>
            );
          })}
          {itemData && itemData.length < 10 && (
            <div className={Css['add-banner-box']} onClick={() => alterAdd()}>
              <PlusOutlined />
              <p className={Css['add-banner-text']}>添加图片</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
