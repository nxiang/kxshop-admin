import React, { useState } from 'react';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Radio, message, Spin, Upload, Input, Row, Col } from 'antd';
import Css from './AlterCommunity.module.scss';

import AlterHeader from '../Modules/AlterHeader/AlterHeader';
import GoodsSelect from '../selects/GoodsSelect';
import ClassifySelect from '../selects/ClassifySelect';

// 上传限制
function beforeUpload(file) {
  return new Promise((resolve, reject) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'|| file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('仅支持jpg、jpeg、png、gif格式的图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件大小不能大于2M');
    }
    // 判断文件是否符合正则表达式的规则
    if (!(isJpgOrPng && isLt2M)) {
      return reject(new Error(false));
    }
    return resolve(true);
  });
}

// 阿里云上传组件
function AliyunOSSUpload({ entranceImg, alterImage }) {
  const [spinIs, setSpinIs] = useState(false);

  return (
    <div className={Css['img-box']}>
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
                const res = info.file.response;
                if (res.errorCode === '0') {
                  alterImage(res.data.url);
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
          {entranceImg ? (
            <div className={Css['img-show-box']}>
              <div className={Css['img-mask']}>
                <div className={Css['mask-text']}>替换</div>
              </div>
              <img className={Css['img-show-img']} src={entranceImg} alt="" />
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
  // }
}

export default ({
  itemData,
  itemNum,
  itemEntrance,
  alterDel,
  alterNum,
  alterTrigger,
  alterModuleEntrance,
}) => {
  const [radioValue, setRadioValue] = useState(1);

  const AlterImage = url => {
    console.log(url);
    alterModuleEntrance({
      ...itemEntrance,
      entranceImg: url,
    });
  };

  const radioChange = e => {
    setRadioValue(e.target.value);
  };

  // 按分类修改商品
  const alterClassifyData = data => {
    // 新加入数组
    const newitemDataList = data.map(item => {
      return {
        imageSrc: item.imagePath,
        itemId: item.id,
        itemName: item.name,
        salePrice: item.salePrice,
      };
    });

    // 原数组id抽取
    let itemDataIdList = [...itemData];
    if (itemDataIdList && itemDataIdList.length > 0) {
      itemDataIdList = itemData.map(item => {
        return item.itemId;
      });
    } else {
      itemDataIdList = [];
    }

    // 新加入数组id抽取
    let newItemDataIdList = newitemDataList;
    if (newItemDataIdList && newItemDataIdList.length > 0) {
      newItemDataIdList = newitemDataList.map(item => {
        return item.itemId;
      });
    } else {
      newItemDataIdList = [];
    }

    const dataList = [...itemData];

    // 差集
    const difference = newItemDataIdList.filter(function(v) {
      return itemDataIdList.indexOf(v) == -1;
    });

    if (difference.length + itemDataIdList.length < itemNum) {
      difference.forEach(item => {
        newitemDataList.forEach(subItem => {
          if (item == subItem.itemId) {
            dataList.push(subItem);
          }
        });
      });
    } else if (itemDataIdList.length < itemNum) {
      difference.forEach(item => {
        newitemDataList.forEach(subItem => {
          if (item == subItem.itemId && dataList.length < itemNum) {
            dataList.push(subItem);
          }
        });
      });
    }
    alterTrigger(dataList);
  };

  // 按商品修改商品
  const alterGoodsData = data => {
    const newitemDataList = data.selectedRows.map(item => {
      return {
        imageSrc: item.imagePath,
        itemId: item.id,
        itemName: item.name,
        salePrice: item.salePrice,
      };
    });
    alterTrigger(newitemDataList);
  };

  // 修改商品个数
  const AlterNum = num => {
    let newItemData = [];
    console.log('itemData===>', itemData);
    if (itemNum !== num && itemData) {
      if (num < itemNum) {
        newItemData = itemData.slice(0, num);
      } else {
        newItemData = itemData;
      }
    } else {
      return;
    }
    alterNum(num);
    alterTrigger([...newItemData]);
  };

  const goodDel = index => {
    const newItemData = [...itemData];
    newItemData.splice(index, 1);
    alterTrigger([...newItemData]);
  };

  return (
    <div className={Css['alter-community-box']}>
      <AlterHeader title="入口" subTitle="推荐图片尺寸100*100" alterDel={() => alterDel()} />
      <div className={Css['alter-style-choice']}>
        <div className={Css['style-header']}>商品展示样式</div>
        <div className={Css['style-content-box']}>
          <div className={Css['quantity-item']} style={{ marginRight: 16, marginBottom: 16 }}>
            <div
              className={`${Css['item-img-box']} ${Css['item-size-two']} ${itemNum === 4 &&
                Css['blue-border']}`}
              onClick={() => AlterNum(4)}
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
          <div className={Css['quantity-item']} style={{ marginBottom: 16 }}>
            <div
              className={`${Css['item-img-box']} ${Css['item-size-three']} ${itemNum === 8 &&
                Css['blue-border']}`}
              onClick={() => alterNum(8)}
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
        </div>
        <div className={Css['style-header']}>入口名称</div>
        <Row justify="space-between" style={{ marginBottom: 8 }}>
          <Col span={6}>
            <AliyunOSSUpload
              entranceImg={itemEntrance?.entranceImg || ''}
              alterImage={AlterImage}
            />
          </Col>
          <Col span={18}>
            <Row>
              <Col span={6} style={{ marginBottom: 4 }}>
                标题
              </Col>
              <Col span={18} style={{ marginBottom: 4 }}>
                <Input
                  size="small"
                  placeholder="请输入、长度8"
                  maxLength={8}
                  value={itemEntrance?.entranceTitle || ''}
                  onChange={e => {
                    const {
                      target: { value },
                    } = e;
                    alterModuleEntrance({
                      ...itemEntrance,
                      entranceTitle: value,
                    });
                  }}
                />
              </Col>
              <Col span={6}>副标题</Col>
              <Col span={18}>
                <Input
                  size="small"
                  placeholder="请输入、长度8"
                  maxLength={8}
                  value={itemEntrance?.entranceSubTitle || ''}
                  onChange={e => {
                    const {
                      target: { value },
                    } = e;
                    alterModuleEntrance({
                      ...itemEntrance,
                      entranceSubTitle: value,
                    });
                  }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <div className={Css['style-header']}>商品信息 最多添加{itemNum}个商品</div>
        <Radio.Group onChange={e => radioChange(e)} value={radioValue}>
          <Radio value={1}>按商品</Radio>
          <Radio value={2}>按分类</Radio>
        </Radio.Group>
        <div className={Css['goods-box']}>
          {itemData &&
            itemData.map((item, index) => {
              return (
                <div className={Css['goods-item']} key={index}>
                  <CloseCircleOutlined
                    className={Css['goods-item-del']}
                    onClick={() => goodDel(index)}
                  />
                  <img className={Css['goods-item-img']} src={item.imageSrc} alt="" />
                </div>
              );
            })}
          {(!itemData || itemData.length < itemNum) && radioValue === 1 && (
            <GoodsSelect
              itemNum={itemNum}
              itemData={itemData}
              alterData={data => alterGoodsData(data)}
            />
          )}
          {(!itemData || itemData.length < itemNum) && radioValue === 2 && (
            <ClassifySelect itemData={itemData} alterData={data => alterClassifyData(data)} />
          )}
        </div>
      </div>
    </div>
  );
};
