/*
 *   author:langyan
 *   date：20200228
 *  explain:  用户管理模块详情页面
 * */
import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import { history } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { Tag, message } from 'antd';
import Panel from '@/components/Panel';
import Css from './QueryDetail.module.scss';
import { queryUserDetail, deleteUserTag } from '@/services/queryUser';
import TagAdd from '../component/tagAdd/tagAdd'; // 添加标签组件
import GiveDiscount from '../component/giveDiscount/giveDiscount'; // 赠送优惠券
import AddRemark from '../component/addRemark/addRemark';
import IntegralRecord from '../component/integralRecord';
import userIcon from '@/assets/images/user-icon.png'
// 添加备注
class QueryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: 0,
      hoverTagId: 0, // 鼠标滑过
      userDetail: {
        member: {
          memberId: '',
          nickname: '',
          trueName: '',
          sex: '',
          birthday: '',
          areaText: '',
          education: '',
          shippingAddress: '',
          remark: '',
        },
        tagList: [],
        couponStats: {
          receivedQuantity: '',
          usedQuantity: '',
          unusedQuantity: '',
        },
        pointStats: {
          effectiveRewardedPoints: '',
          effectiveConsumedPoints: '',
          remainingPoints: '',
        },
        tradeStats: {
          tradeQuantity: '',
          tradeAmount: '',
          avgTradeAmount: '',
          lastTradeTime: '',
          refundQuantity: '',
          refundAmount: '',
        },
      },
    };
  }

  componentDidMount() {
    const { location } = this.props
    this.getqueryDetail(location.state.memberId);
    this.setState({
      clientId: location.state.clientId,
    });
  }

  // 获取详情数据
  async getqueryDetail(memberId) {
    const { data } = await queryUserDetail({ memberId });
    if (!data) return;
    this.setState({
      userDetail: data,
    });
  }

  // 弹窗操作成功回调
  moduleSuccess() {
    this.getqueryDetail(this.state.userDetail.member.memberId);
  }

  // 页面跳转函数
  pageJump(page) {
    history.push('/operation/couponManage');
  }

  // 获取子组件
  onRef(name, ref) {
    switch (name) {
      case 'tagAddModule':
        this.tagAddModule = ref;
        break;
      case 'giveDiscountModule':
        this.giveDiscountModule = ref;
        break;
      case 'addRemarkModule':
        this.addRemarkModule = ref;
        break;
      default:
        break;
    }
  }

  // 鼠标滑过
  handleMouseLeave(e) {
    this.setState({
      hoverTagId: e,
    });
  }

  // 标签删除
  async handleClose(tagId) {
    const info = await deleteUserTag({
      memberId: this.state.userDetail.member.memberId,
      tagId,
    });
    if (info.errorCode == 0) {
      message.success('用户标签删除成功');
      this.getqueryDetail(this.state.userDetail.member.memberId);
    }
  }

  // 按钮操作   1添加标签 2送优惠券  3 添加备注
  queryDetailButton(typeId) {
    switch (typeId) {
      case 1:
        this.tagAddModule.showModal({
          memberId: this.state.userDetail.member.memberId,
          sourceId: 1,
        });
        break;
      case 2:
        this.giveDiscountModule.showModal({
          memberId: this.state.userDetail.member.memberId,
          sourceId: 1,
          clientId: this.state.clientId,
        });
        break;
      case 3:
        this.addRemarkModule.showModal(this.state.userDetail.member.memberId);
        break;
      default:
        break;
    }
  }

  render() {
    const { userDetail, hoverTagId } = this.state;
    return (
      <Panel title="基本信息">
        <div className={Css['queryDetail-box']}>
          {/* 用户信息展示开始 */}
          <div className={Css['queryDetail-content']}>
            {/* 基本信息开始 */}
            <div className={Css['queryDetail-basic-section']}>
              <div className={Css['queryDetail-title']}>
                <h2>基本信息</h2>
              </div>
              <div className={Css['queryDetail-basic']}>
                {userDetail.member.avatar ? (
                  <img src={userDetail.member.avatar} alt="" />
                ) : (
                  <img
                    className={Css.img}
                    src={userIcon}
                    alt=""
                  />
                )}
                <ul className={Css['basic-info']}>
                  <li className={Css['basic-item']}>
                    <div className={Css['basic-item-text']}>
                      <span>用户ID:</span>
                      <span>{userDetail.member.memberId}</span>
                    </div>
                    <div className={Css['basic-item-text']}>
                      <span> 昵称: </span>
                      <span className={Css['text-maxLength']}>{userDetail.member.nickname}</span>
                    </div>
                    <div className={Css['basic-item-text']}>
                      <span> 手机号: </span>
                      <span className={Css['text-maxLength']}>{userDetail.member.mobile}</span>
                    </div>
                    <div className={Css['basic-item-text']}>
                      <span> 身份地址:</span>
                      <span>{userDetail.member.areaText}</span>
                    </div>
                  </li>
                  <li className={Css['basic-item']}>
                    <div className={Css['basic-item-text']}>
                      <span>真实姓名:</span>
                      <span>{userDetail.member.trueName}</span>
                    </div>
                    <div className={Css['basic-item-text']}>
                      <span>生日: </span>
                      <span>{userDetail.member.birthday}</span>
                    </div>
                    <div className={Css['basic-item-text']}>
                      <span>学历:</span>
                      {userDetail.member.education == 1 ? <span>小学</span> : ''}
                      {userDetail.member.education == 2 ? <span>初中</span> : ''}
                      {userDetail.member.education == 3 ? <span>高中</span> : ''}
                      {userDetail.member.education == 4 ? <span>本科</span> : ''}
                      {userDetail.member.education == 5 ? <span>硕士</span> : ''}
                      {userDetail.member.education == 6 ? <span>博士</span> : ''}
                      {userDetail.member.education == 0 ? <span>其他</span> : ''}
                    </div>
                  </li>
                  <li className={Css['basic-item']}>
                    <div className={Css['basic-item-text']}>
                      <span>性别:</span>
                      {userDetail.member.sex == 1 ? <span>男</span> : ''}
                      {userDetail.member.sex == 2 ? <span>女</span> : ''}
                      {userDetail.member.sex == 0 ? <span>保密</span> : ''}
                    </div>
                    {/* <div className="basic-item-text ly-flex"> */}
                    {/*  <span>上次交易时间: </span> */}
                    {/*  <span>{userDetail.member.nickName}</span> */}
                    {/* </div> */}
                  </li>
                  <li className={`${Css['basic-item']} ${Css['basic-item-address']}`}>
                    <div className={Css['basic-item-text']}>
                      <span>默认收货地址:</span>
                      <span>{userDetail.member.shippingAddress}</span>
                    </div>
                  </li>
                  <li className={`${Css['basic-item']} ${Css['basic-item-address']}`}>
                    <div className={Css['basic-item-text']}>
                      <span>备注:</span>
                      <span>{userDetail.member.remark}</span>{' '}
                      <a style={{ marginLeft: 12 }} onClick={() => this.queryDetailButton(3)}>
                        修改备注
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            {/* 基本 信息结束 */}
            <div className={Css['queryDetail-basic-section']} style={{ marginTop: 24 }}>
              <div className={Css['queryDetail-title']}>
                <h2>关键指标</h2>
              </div>
              <div className={Css['queryDetail-basic']}>
                <ul className={Css['basic-info']}>
                  <li className={Css['basic-item']}>
                    <div className={Css['basic-item-text']}>
                      <span> 首访时间:</span>
                      <span>{userDetail?.keyIndicator?.firstAccessDateTime}</span>
                    </div>
                    <div className={Css['basic-item-text']}>
                      <span> 注册时间: </span>
                      <span className={Css['text-maxLength']}>
                        {userDetail?.keyIndicator?.registerDateTime}
                      </span>
                    </div>
                    <div className={Css['basic-item-text']}>
                      <span> 领卡渠道: </span>
                      <span className={Css['text-maxLength']}>
                        {userDetail?.keyIndicator?.openCardChannel}
                      </span>
                    </div>
                    <div className={Css['basic-item-text']}>
                      <span> 访问次数:</span>
                      <span>{userDetail?.keyIndicator?.accessNum}</span>
                    </div>
                  </li>
                  {/* <li className={Css['basic-item']}>
                    <div className={Css['basic-item-text']}>
                      <span> 平均访问时长:</span>
                      <span>{userDetail?.keyIndicator?.avgAccessDuration}</span>
                    </div>
                  </li> */}
                </ul>
              </div>
            </div>
            {/* 标签信息开始 */}
            <div className={Css['queryDetail-tag-section']}>
              <div className={Css['queryDetail-title']}>
                <h2>标签添加</h2>
              </div>
              <div className={Css['queryDetail-tag']}>
                {userDetail.tagList.map(item => {
                  return hoverTagId === item.tagId ? (
                    <Tag
                      closable
                      onClose={e => {
                        e.preventDefault();
                        this.handleClose(item.tagId);
                      }}
                      key={item.tagId}
                      onMouseEnter={() => this.handleMouseLeave(item.tagId)}
                    >
                      {item.tagName}
                    </Tag>
                  ) : (
                    <Tag
                      onClose={e => {
                        e.preventDefault();
                        this.handleClose(item.tagId);
                      }}
                      key={item.tagId}
                      onMouseEnter={() => this.handleMouseLeave(item.tagId)}
                    >
                      {item.tagName}
                    </Tag>
                  );
                })}
                <Tag
                  onClick={() => this.queryDetailButton(1)}
                  style={{ background: '#fff', borderStyle: 'dashed' }}
                >
                  <PlusOutlined /> 添加新标签
                </Tag>
              </div>
            </div>
            {/* 标签信息结束 */}
            {/* 资产信息开始 */}
            <div className={Css['queryDetail-property-section']}>
              <div className={Css['queryDetail-title']}>
                <h2>资产信息</h2>
                <a onClick={() => this.queryDetailButton(2)}>送优惠券</a>
              </div>
              <ul className={Css['queryDetail-property']}>
                <li className={Css['queryDetail-property-item']}>
                  <span>获取优惠券总数</span>
                  <b>{userDetail.couponStats.receivedQuantity}</b>
                </li>
                <li className={Css['queryDetail-property-item']}>
                  <span>当前可用</span>
                  <b>{userDetail.couponStats.unusedQuantity}</b>
                </li>
                <li className={Css['queryDetail-property-item']}>
                  <span>已使用</span>
                  <b>{userDetail.couponStats.usedQuantity}</b>
                </li>
                <li className={Css['queryDetail-property-item']}>
                  <span>已过期</span>
                  <b>{userDetail.couponStats.expiredQuantity}</b>
                </li>
                <li className={Css['queryDetail-property-item']}>
                  <span>核销率</span>
                  <b>{userDetail.couponStats.verificationRate}</b>
                </li>
                <li className={Css['queryDetail-property-item']}>
                  <span>积分总数</span>
                  <b>{userDetail.pointStats.effectiveRewardedPoints}</b>
                </li>
                <li className={Css['queryDetail-property-item']}>
                  <span>已使用积分</span>
                  <b>{userDetail.pointStats.effectiveConsumedPoints}</b>
                </li>
                <li className={Css['queryDetail-property-item']}>
                  <span>剩余积分</span>
                  <b>{userDetail.pointStats.remainingPoints}</b>
                </li>
              </ul>
            </div>
            {/* 资产信息结束 */}
            {/* 交易信息开始 */}
            <div
              className={`${Css['queryDetail-property-section']} ${
                Css['queryDetail-deal-section']
              }`}
            >
              <div className={Css['queryDetail-title']}>
                <h2>交易信息</h2>
              </div>
              <ul className={Css['queryDetail-property']}>
                <li className={Css['queryDetail-property-item']}>
                  <span>交易笔数</span>
                  <b>{userDetail.tradeStats.tradeQuantity}</b>
                </li>
                <li className={Css['queryDetail-property-item']}>
                  <span>交易总额</span>
                  <b>{Number(userDetail.tradeStats.tradeAmount) / 100}</b>
                </li>
                <li className={Css['queryDetail-property-item']}>
                  <span>平均交易金额</span>
                  <b>{Number(userDetail.tradeStats.avgTradeAmount) / 100}</b>
                </li>
                <li
                  className={`${Css['queryDetail-property-item']} ${
                    Css['queryDetail-property-date']
                  }`}
                >
                  <span>上次交易时间</span>
                  <b>{userDetail.tradeStats.lastTradeTime}</b>
                </li>
                <li className={Css['queryDetail-property-item']}>
                  <span>退款笔数</span>
                  <b>{userDetail.tradeStats.refundQuantity}</b>
                </li>
                <li className={Css['queryDetail-property-item']}>
                  <span>退款总额</span>
                  <b>{Number(userDetail.tradeStats.refundAmount) / 100}</b>
                </li>
              </ul>
            </div>
            {/* 交易信息结束 */}
            <div
              className={`${Css['queryDetail-property-section']} ${
                Css['queryDetail-stored-section']
              }`}
            >
              <div className={Css['queryDetail-title']}>
                <h2>储值信息</h2>
              </div>
              <ul className={Css['queryDetail-property']}>
                <li className={Css['queryDetail-property-item']}>
                  <span>储值总额</span>
                  <b>{userDetail.depositStats && userDetail.depositStats.depositAmount / 100}</b>
                </li>
                <li
                  className={`${Css['queryDetail-property-item']} ${
                    Css['queryDetail-property-date']
                  }`}
                >
                  <span>赠送金额</span>
                  <b>{userDetail.depositStats && userDetail.depositStats.giftAmount / 100}</b>
                </li>
                <li
                  className={`${Css['queryDetail-property-item']} ${
                    Css['queryDetail-property-date']
                  }`}
                >
                  <span>消费总额</span>
                  <b>{userDetail.depositStats && userDetail.depositStats.payAmount / 100}</b>
                </li>
                <li className={Css['queryDetail-property-item']}>
                  <span>余额</span>
                  <b>{userDetail.depositStats && userDetail.depositStats.balance / 100}</b>
                </li>
              </ul>
            </div>
          </div>
          {/* 用户信息展示结束 */}
          {/* 添加标签开始 */}
          <TagAdd onRef={this.onRef.bind(this)} moduleSuccess={this.moduleSuccess.bind(this)} />
          {/* 添加标签结束 */}
          {/* 赠送优惠券开始 */}
          <GiveDiscount
            onRef={this.onRef.bind(this)}
            pageJump={this.pageJump.bind(this)}
            moduleSuccess={this.moduleSuccess.bind(this)}
            clientId={this.state.clientId}
          />
          {/* 赠送优惠券结束 */}
          {/* 添加备注开始 */}
          <AddRemark
            remark={userDetail.member.remark}
            onRef={this.onRef.bind(this)}
            moduleSuccess={this.moduleSuccess.bind(this)}
          />
          {/* 添加备注结束 */}

          {/* 积分纪录 */}
          <IntegralRecord memberId={userDetail.member.memberId} />
        </div>
      </Panel>
    );
  }
}

export default withRouter(QueryDetail);
