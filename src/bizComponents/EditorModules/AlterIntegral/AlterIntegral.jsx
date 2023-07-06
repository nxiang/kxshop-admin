import React, { Component } from 'react';
import { CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { message, Modal, Input, Radio, Button, InputNumber } from 'antd';
import Css from './AlterIntegral.module.scss';

import GoodsSelect from '../selects/GoodsSelect';
import ClassifySelect from '../selects/ClassifySelect';
import ColorItem from '@/components/ColorItem/ColorItem';
import AlterHeader from '../Modules/AlterHeader/AlterHeader';
const { confirm } = Modal;

class ItemDataRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioValue: 1,
    };
  }

  radioChange(e) {
    this.setState({
      radioValue: e.target.value,
    });
  }

  alterClassifyData(data) {
    // 原数组
    const itemDataList = this.props.item.data;
    // 新加入数组
    let newitemDataList = data.map(item => {
      return {
        imageSrc: item.imagePath,
        itemId: item.id,
        itemName: item.name,
        salePrice: item.salePrice,
      };
    });

    // 原数组id抽取
    let itemDataIdList = itemDataList;
    if (itemDataIdList && itemDataIdList.length > 0) {
      itemDataIdList = this.props.item.data.map(item => {
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

    const dataList = [...itemDataList];

    // 差集
    let difference = newItemDataIdList.filter(function(v) {
      return itemDataIdList.indexOf(v) == -1;
    });

    if (difference.length + itemDataIdList.length < 12) {
      for (let i in difference) {
        for (let j in newitemDataList) {
          if (difference[i] === newitemDataList[j].itemId) {
            dataList.push(newitemDataList[j]);
          }
        }
      }
    } else if (itemDataIdList.length < 12) {
      for (let i in difference) {
        for (let j in newitemDataList) {
          if (difference[i] === newitemDataList[j].itemId && dataList.length < 12) {
            dataList.push(newitemDataList[j]);
          }
        }
      }
    }

    this.props.alterClassifyData(dataList);
  }

  alterGoodsData(data) {
    const { alterGoodsData } = this.props;
    const newitemDataList = data.selectedRows.map(item => {
      return {
        expendPoint: item.expendPoint,
        imageSrc: item.imagePath,
        itemId: item.id,
        itemName: item.name,
        salePrice: item.salePrice,
        linePrice: item.linePrice,
      };
    });
    alterGoodsData(newitemDataList);
  }

  alterTitle(e, type) {
    const { alterTitle } = this.props;
    alterTitle(e.target.value, type);
  }

  alterDel(index) {
    const { item, alterDel } = this.props;
    // let item = this.props.item;
    item.data.splice(index, 1);
    alterDel(item);
  }

  discountedPriceChange(id, val) {
    const couponPrice = this.props?.item?.couponPrice || {};
    couponPrice[id] = val;
    this.props.alterCouponData(couponPrice);
  }

  render() {
    const { radioValue } = this.state;
    const { item, itemNum, itemType, itemSubTitle } = this.props;
    const { couponPrice = {} } = item;
    return (
      <div className={Css['item-data-render-box']}>
        {(item.title || item.title === '') && itemNum !== 1 && (
          <div className={Css['item-header-box']}>
            <p className={Css['item-header-title']}>主标题</p>
            <Input
              className={Css['item-header-input']}
              maxLength={6}
              value={item.title}
              onChange={e => this.alterTitle(e, 1)}
            />
          </div>
        )}
        {/* 副标题 */}
        {itemSubTitle == 1 && (item.subTitle || item.subTitle === '') && itemNum !== 1 && (
          <div className={Css['item-header-box-subTitle']}>
            <p className={Css['item-header-title']}>副标题</p>
            <Input
              className={Css['item-header-input']}
              maxLength={6}
              value={item.subTitle}
              onChange={e => this.alterTitle(e, 2)}
            />
          </div>
        )}
        <div className={Css['radio-box']}>
          <div className={Css['radio-title']}>商品信息</div>
          <Radio.Group onChange={this.radioChange.bind(this)} value={radioValue}>
            <Radio value={1}>按商品</Radio>
            {/* <Radio value={2}>按分类</Radio> */}
          </Radio.Group>
        </div>
        <div className={Css['prompt-text']}>最多添加12个商品</div>
        <div className={Css['goods-box']}>
          {item.data &&
            item.data.map((item, index) => {
              return (
                <div className={Css['goods-item']} key={index}>
                  <CloseCircleOutlined
                    className={Css['goods-item-del']}
                    onClick={this.alterDel.bind(this, index)}
                  />
                  <img className={Css['goods-item-img']} src={item.imageSrc} />

                  {/* value={ discountedPrice }
                    onChange={this.discountedPriceChange.bind(this)} */}
                  <div className={Css['goods-item-input']}>
                    <span>券后价：</span>
                    <InputNumber
                      precision={2}
                      min={0}
                      value={couponPrice[item.itemId]}
                      onChange={this.discountedPriceChange.bind(this, item.itemId)}
                      style={{ width: '150px' }}
                      placeholder="请输入券后价"
                    />
                  </div>
                </div>
              );
            })}
          {(!item.data || item.data.length < 99) && radioValue === 1 && (
            <GoodsSelect
              itemType={1}
              itemData={item.data}
              alterData={this.alterGoodsData.bind(this)}
            />
          )}
          {(!item.data || item.data.length < 99) && radioValue === 2 && (
            <ClassifySelect
              itemType={itemType}
              itemData={item.data}
              alterData={this.alterClassifyData.bind(this)}
            />
          )}
        </div>
      </div>
    );
  }
}

class AlterIntegral extends Component {
  constructor(props) {
    super(props);
    const { itemData, itemSubTitle } = props;
    if (itemSubTitle == 1 && itemData.length && !itemData[0].subTitle) {
      this.subtitleRadioChange({ target: { value: 1 } });
    }
  }

  // 修改标题
  alterTitle(index, value, type) {
    let itemData = this.props.itemData;
    if (type == 1) {
      itemData[index].title = value;
    } else if (type == 2) {
      itemData[index].subTitle = value;
    }
    this.props.alterTrigger(itemData);
  }

  // 修改导航个数
  alterNum(num) {
    const { itemNum, itemData, itemSubTitle } = this.props;
    let newItemData = [];
    if (itemNum !== num) {
      if (num < itemNum) {
        newItemData = itemData.slice(0, num);
      } else {
        newItemData = itemData;
        for (let i = newItemData.length; i < num; i++) {
          let tmp = {
            title: '主标题' + (i + 1),
            data: '',
            type: 'integral',
          };
          if (itemSubTitle == 1) tmp.subTitle = '副标题' + (i + 1);
          newItemData.push(tmp);
        }
      }
    } else {
      return;
    }
    this.props.alterNum(num);
    this.props.alterTrigger(newItemData);
  }

  // 修改展示样式
  alterStyle(num) {
    const { itemStyle } = this.props;
    if (num !== itemStyle) this.props.alterStyle(num);
  }

  alterItemDel(index, item) {
    let itemData = this.props.itemData;
    itemData[index] = item;
    this.props.alterTrigger(itemData);
  }

  alterGoodsData(index, item) {
    let itemData = this.props.itemData;
    itemData[index].data = item;
    this.props.alterTrigger(itemData);
  }

  alterCouponData(index, data) {
    let itemData = this.props.itemData;
    itemData[index].couponPrice = data;
    this.props.alterTrigger(itemData);
  }

  alterClassifyData(index, item) {
    let itemData = this.props.itemData;
    itemData[index].data = item;
    this.props.alterTrigger(itemData);
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

  subtitleRadioChange(e) {
    const { itemNum, itemData } = this.props;
    let itemSubTitle = e.target.value;
    let newItemData = [];
    if (itemNum) {
      newItemData = itemData;
      let len = newItemData.length;
      for (let i = 0; i < len; i++) {
        if (itemSubTitle && !newItemData[i].subTitle) newItemData[i].subTitle = '副标题' + (i + 1);
      }
    }
    this.props.alterTitleSet({ itemSubTitle });
    this.props.alterTrigger(newItemData);
  }

  alertColorChange(index, color) {
    const { itemTitleColor } = this.props;
    itemTitleColor[index].color = color;
    this.props.alterTitleSet({ itemTitleColor });
  }

  render() {
    const { itemData, itemNum, itemStyle, itemType, itemSubTitle, itemTitleColor } = this.props;
    let title1Color = [1, 2, 3, 4, 6, '1', '2', '3', '4', '6'];
    let title2Color = [1, 2, 5, '1', '2', '5'];
    return (
      <div className={Css['alter-recommend-box']}>
        <AlterHeader
          title="商品推荐"
          subTitle="推荐图片尺寸100*100"
          alterDel={() => {
            this.props.alterDel();
          }}
        />
        {/* 导航个数 */}
        <div className={Css['alter-style-choice']}>
          <div className={Css['style-header']}>导航个数</div>
          <div className={Css['style-content']}>
            <div className={Css['quantity-item']}>
              <div
                className={`${Css['quantity-img-box']} ${itemNum === 1 && Css['blue-border']}`}
                onClick={this.alterNum.bind(this, 1)}
              >
                <div className={Css['quantity-title-text']}>无标题</div>
                <div className={Css['quantity-img-block']} />
              </div>
              <p className={Css['quantity-text']}>1个</p>
            </div>
            <div className={Css['quantity-item']}>
              <div
                className={`${Css['quantity-img-box']} ${itemNum === 2 && Css['blue-border']}`}
                onClick={this.alterNum.bind(this, 2)}
              >
                <div className={Css['quantity-title-text']}>标题</div>
                <div className={Css['quantity-img-block']} />
                <div className={Css['quantity-img-block']} />
              </div>
              <p className={Css['quantity-text']}>2个</p>
            </div>
            <div className={Css['quantity-item']}>
              <div
                className={`${Css['quantity-img-box']} ${itemNum === 3 && Css['blue-border']}`}
                onClick={this.alterNum.bind(this, 3)}
              >
                <div className={Css['quantity-title-text']}>标题</div>
                <div className={Css['quantity-img-block']} />
                <div className={Css['quantity-img-block']} />
                <div className={Css['quantity-img-block']} />
              </div>
              <p className={Css['quantity-text']}>3个</p>
            </div>
            <div className={Css['quantity-item']}>
              <div
                className={`${Css['quantity-img-box']} ${itemNum === 4 && Css['blue-border']}`}
                onClick={this.alterNum.bind(this, 4)}
                style={{ width: 88 }}
              >
                <div className={Css['quantity-title-text']}>标题</div>
                <div className={Css['quantity-img-block']} />
                <div className={Css['quantity-img-block']} />
                <div className={Css['quantity-img-block']} />
                <div className={Css['quantity-img-block']} />
              </div>
              <p className={Css['quantity-text']}>4个</p>
            </div>
          </div>
        </div>
        {/* 副标题 */}
        {itemNum != 1 && (
          <div className={Css['alter-subtitle-choice']}>
            <div className={Css['style-header']}>副标题</div>
            <div className={Css['style-content']}>
              <Radio.Group onChange={this.subtitleRadioChange.bind(this)} value={itemSubTitle}>
                <Radio value={1}>开启</Radio>
                <Radio value={2}>关闭</Radio>
              </Radio.Group>
            </div>
          </div>
        )}
        {/* 标题颜色 */}
        {itemNum != 1 && (
          <div className={Css['alter-title-style']}>
            <div className={Css['style-header']}>标题颜色</div>
            <div className={Css['style-content']}>
              {itemTitleColor.map((item, index) => {
                if (
                  (itemSubTitle == 1 && title1Color.includes(item.id)) ||
                  (itemSubTitle == 2 && title2Color.includes(item.id))
                ) {
                  return (
                    <ColorItem
                      key={item.id}
                      text={item.text}
                      color={item.color}
                      reset={item.resetValue}
                      alterChange={this.alertColorChange.bind(this, index)}
                    />
                  );
                }
                return '';
              })}
            </div>
          </div>
        )}

        {/* 商品展示样式 */}
        <div className={Css['alter-style-choice']}>
          <div className={Css['style-header']}>商品展示样式</div>
          <div className={Css['style-content']}>
            <div className={Css['style-item']}>
              <div
                className={`${Css['style-img-box']} ${itemStyle === 1 && Css['blue-border']}`}
                onClick={this.alterStyle.bind(this, 1)}
              >
                <div className={Css['style-img-block-one']}>
                  <img
                    className={Css['icon-img']}
                    src="https://img.kxll.com/admin_manage/icon/icon_default.png"
                    alt=""
                  />
                </div>
              </div>
              <p className={Css['style-text']}>一行1个</p>
            </div>
            <div className={Css['style-item']}>
              <div
                className={`${Css['style-img-box']} ${itemStyle === 2 && Css['blue-border']}`}
                onClick={this.alterStyle.bind(this, 2)}
              >
                <div className={Css['style-img-block-one']}>
                  <img
                    className={Css['icon-img']}
                    src="https://img.kxll.com/admin_manage/icon/icon_default.png"
                    alt=""
                  />
                </div>
                <div className={Css['style-img-block-one']}>
                  <img
                    className={Css['icon-img']}
                    src="https://img.kxll.com/admin_manage/icon/icon_default.png"
                    alt=""
                  />
                </div>
              </div>
              <p className={Css['style-text']}>一行2个</p>
            </div>
            <div className={Css['style-item']}>
              <div
                className={`${Css['style-img-box']} ${itemStyle === 3 && Css['blue-border']}`}
                onClick={this.alterStyle.bind(this, 3)}
              >
                <div className={Css['style-img-block-two']}>
                  <img
                    className={Css['icon-img']}
                    src="https://img.kxll.com/admin_manage/icon/icon_list.png"
                    alt=""
                  />
                </div>
              </div>
              <p className={Css['style-text']}>列表</p>
            </div>
            <div className={Css['style-item']}>
              <div
                className={`${Css['style-img-box']} ${itemStyle === 4 && Css['blue-border']}`}
                onClick={this.alterStyle.bind(this, 4)}
              >
                <div className={Css['style-img-block-three']}>
                  <img
                    className={Css['icon-img']}
                    src="https://img.kxll.com/admin_manage/icon/icon_roll.png"
                    alt=""
                  />
                </div>
              </div>
              <p className={Css['style-text']}>滚动</p>
            </div>
          </div>
        </div>
        {itemData && itemData.length > 0 && (
          <div className={Css['alter-content']}>
            {itemData.map((item, index) => {
              return (
                <ItemDataRender
                  key={index}
                  item={item}
                  itemNum={itemNum}
                  itemType={itemType}
                  itemSubTitle={itemSubTitle}
                  alterDel={this.alterItemDel.bind(this, index)}
                  alterTitle={this.alterTitle.bind(this, index)}
                  alterGoodsData={this.alterGoodsData.bind(this, index)}
                  alterCouponData={this.alterCouponData.bind(this, index)}
                  alterClassifyData={this.alterClassifyData.bind(this, index)}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default AlterIntegral;
