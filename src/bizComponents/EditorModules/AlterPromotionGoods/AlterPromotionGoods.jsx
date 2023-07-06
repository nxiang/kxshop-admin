import React, { Component } from 'react';
import { CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { message, Modal, Input, InputNumber, Radio, Button } from 'antd';
import { itemDetail } from '@/services/item';
import Css from './AlterPromotionGoods.module.scss';
import { floatObj } from '@/utils/utils';

import GoodsSelect from '../selects/GoodsSelect';

const { confirm } = Modal;

class AlterRecommend extends Component {
  constructor(props) {
    super(props);
    let discountedPrice = props.itemData.discountedPrice
    this.state = {
      discountedPrice: discountedPrice ? floatObj.divide(discountedPrice, 100) : discountedPrice
    }
  }
  alterGoodsData(item) {
    let itemData = this.props.itemData;
    const newitemDataList = item.selectedRows.map(ele => {
      return {
        imageSrc: ele.imagePath,
        itemId: ele.id,
        itemName: ele.name,
        salePrice: ele.salePrice,
        storage: ele.storage
      };
    });
    console.log('newitemDataList', newitemDataList)
    itemData.data = newitemDataList[0] || {}
    this.props.alterTrigger(itemData);
  }

  alterDel() {
    let itemData = this.props.itemData;
    this.props.alterTrigger({
      ...itemData,
      data: ''
    });
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

  discountedPriceChange(val) {
    let itemData = this.props.itemData;
    this.setState({
      discountedPrice: val
    })
    this.props.alterTrigger({
      ...itemData,
      discountedPrice: val ? floatObj.multiply(val, 100) : val
    });
  }

  render() {
    const { itemData, itemType } = this.props;
    const { discountedPrice } = this.state
    let goodsInfo = itemData.data
    return (
      <div className={Css['alter-recommend-box']}>
        <div className={Css['alter-header']}>
          <div className={Css['header-left']}>
            <p className={Css['header-left-title']}>促销商品</p>
          </div>
          <div className={Css['header-right']} onClick={this.moduleDel.bind(this)}>
            <DeleteOutlined className={Css['header-right-icon']} />
            <p className={Css['header-right-text']}>删除</p>
          </div>
        </div>
        {/* 导航个数 */}
        <div className={Css['alter-style-choice']}>
          <div className={Css['style-header']}>商品管理</div>
          <div className={Css['style-content']}>
            {!itemData.data&&<GoodsSelect
              itemNum={1}
              itemType={itemType}
              itemData={itemData.data}
              alterData={this.alterGoodsData.bind(this)}
            />}
            {itemData.data&&<div className={Css['goods-item']} >
              <CloseCircleOutlined
                className={Css['goods-item-del']}
                onClick={this.alterDel.bind(this)}
              />
              <img className={Css['goods-item-img']} src={itemData.data.imageSrc} />
              {goodsInfo.itemName&&<div className={Css['goods-info']}>
                <div className={Css['goods-info-title']}>标题：{goodsInfo.itemName}</div>
                <div className={Css['goods-info-price-stock']}>
                  <div className={Css['goods-info-price']}>售价：¥{goodsInfo.salePrice / 100}</div>
                  <div className={Css['goods-info-stock']}>库存：{goodsInfo.storage}</div>
                </div>
              </div>}
            </div>}
            <div className={Css['goods-item']} >
              <div className="label">券后价设置：</div>
              <InputNumber
                precision={2}
                min={0}
                value={ discountedPrice }
                style={{ width: '150px' }}
                placeholder='请输入券后价'
                onChange={this.discountedPriceChange.bind(this)}
              />
            </div>
            <p className={Css['tips']}>券后价格仅做展示，最终以用户实际领券为准</p>
            <div className={Css['spec-tips']}>
              <div>提示</div>
              <p>使用该组件后，C端进入页面时将自动加购该商品。若该商品为多规格，则默认加购第一个规格的商品。</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AlterRecommend;
