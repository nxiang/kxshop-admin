import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import { Modal, Button, Select, message } from 'antd';
import Css from './giveDiscount.module.scss';
import { queryDiscountList, giveDiscount, giveDiscountBatch } from '@/services/queryUser';

const { Option } = Select;

class GiveDiscount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      sourceId: 2, // 默认为多选  1单2多
      discountScreenList: [],
      discountList: [],
      postData: {
        memberIds: [],
        memberId: '',
        stockId: '',
      },
    };
  }

  componentDidMount() {
    // 调用父组件方法把当前实例传给父组件
    this.props.onRef('giveDiscountModule', this);
  }

  // 获取优惠券数据
  async getdisCountList(clientId) {
    const { data } = await queryDiscountList({ clientId });
    const disCountList = [];
    data.forEach(item => {
      if (item.stocks && item.stocks.length > 0) {
        disCountList.push(item);
      }
    });
    this.setState({
      discountList: disCountList,
      discountScreenList: disCountList[0]?.stocks,
      postData: {
        ...this.state.postData,
        stockId: disCountList[0]?.stocks[0]?.stockId,
      },
    });
  }

  // 打开弹窗
  showModal = giveDiscountObj => {
    this.getdisCountList(giveDiscountObj.clientId);
    this.setState({
      visible: true,
      sourceId: giveDiscountObj.sourceId,
      postData: {
        ...this.state.postData,
        memberId: giveDiscountObj.memberId,
        memberIds: giveDiscountObj.memberIds,
      },
    });
  };

  // 确定回调
  async handleOk() {
    let info;
    let postData;
    if (this.state.sourceId == 1) {
      postData = {
        memberId: this.state.postData.memberId,
        stockId: this.state.postData.stockId,
      };
      info = await giveDiscount(postData);
    } else {
      postData = {
        memberIds: this.state.postData.memberIds,
        stockId: this.state.postData.stockId,
      };
      info = await giveDiscountBatch(postData);
    }
    if (info.errorCode == 0) {
      message.success('优惠券赠送成功');
      this.props.moduleSuccess();
    }
    this.setState({
      visible: false,
      postData: {},
      sourceId: '',
    });
  }

  // 取消回调
  handleCancel = () => {
    this.setState({
      visible: false,
      postData: {},
      sourceId: '',
    });
  };

  // 下来选择改变回调
  handleProvinceChange = value => {
    this.state.discountList.forEach(item => {
      if (item.stockType == value) {
        this.setState({
          discountScreenList: item.stocks,
          postData: {
            ...this.state.postData,
            stockId: item.stocks[0].stockId,
          },
        });
      }
    });
  };

  // 下拉选择改变回调
  onSecondCityChange = value => {
    this.setState({
      postData: {
        ...this.state.postData,
        stockId: value,
      },
    });
  };

  // 创建优惠券
  createDIsCount() {
    // this.props.pageJump({ pathname: '/operation/couponManage' });
    this.props.pageJump('/operation/couponManage');
  }

  render() {
    const { visible, discountScreenList, sourceId, discountList, postData } = this.state;
    return (
      <Modal
        title={
          sourceId === 2 ? (
            <div className={Css["tag-add-title"]}>
              <p>
                *赠送优惠券
                <i>*优惠券数量不足/系统异常，赠送失败</i>
              </p>
            </div>
          ) : (
            '*赠送优惠券'
          )
        }
        visible={visible}
        width="672px"
        onCancel={this.handleCancel}
        footer={null}
      >
        <div className={Css["give-discount-box"]}>
          <div className={Css["give-discount-content"]}>
            {discountList.length > 0 ? (
              <div>
                *请选择类型：{' '}
                <Select
                  placeholder="请选择类型"
                  defaultValue={discountList[0]?.stockType}
                  style={{ width: 188 }}
                  onChange={this.handleProvinceChange}
                >
                  {discountList &&
                    discountList.map(item => (
                      <Option key={item.stockType} value={item.stockType}>
                        {item.stockTypeName}
                      </Option>
                    ))}
                </Select>
                <Select
                  style={{ width: 263 ,marginLeft: 8}}
                  placeholder="请选择类型"
                  value={postData.stockId}
                  onChange={this.onSecondCityChange}
                >
                  {discountScreenList &&
                    discountScreenList.map(item => (
                      <Option key={item.stockId} value={item.stockId}>
                        {item.stockName}
                      </Option>
                    ))}
                </Select>
              </div>
            ) : (
              <div className={Css["give-discount-empty"]}>
                *添加标签：{' '}
                <p>
                  暂无优惠券
                  <a onClick={() => this.createDIsCount()}>去创建</a>
                </p>
              </div>
            )}
          </div>
          <div className={Css["give-discount-footer"]}>
            <Button
              key="confirm"
              className={Css["ant-btn-custom-circle"]}
              type="primary"
              onClick={this.handleOk.bind(this)}
            >
              确认
            </Button>
            <Button
              key="cancel"
              className={Css["ant-btn-custom-circle"]}
              onClick={this.handleCancel.bind(this)}
            >
              取消
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withRouter(GiveDiscount);
