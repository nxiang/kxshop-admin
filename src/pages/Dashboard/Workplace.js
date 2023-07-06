import React, { PureComponent } from 'react'
import { Card, Col, Collapse, Row, Tag, Tooltip } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { history } from '@umijs/max'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import Css from '../../layouts/Sword.less'
import Panel from '@/components/Panel'
import { statistics } from '@/services/home'
import wechat from '@/assets/images/wechat.png'
import pay from '@/assets/images/pay.png'
import { stringify } from 'qs'
// import axios from 'axios'

class Workplace extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      homeInfo: {}
    }
  }

  componentDidMount() {
    this.statistics()
    // axios.get('/item?itemId=24885', {
    //   headers: {
    //     appId: '20200239',
    //     apptype: 'alipay',
    //     clientid: '1',
    //     tid: '54',
    //     token: '509095c6796840b5b914141e6b2f5a74'
    //   }
    // })
    // axios.get('/trade/evaluate/findGoodsEvaluateList?itemId=24885', {
    //   headers: {
    //     // appId: '20200239',
    //     // apptype: 'alipay',
    //     // clientid: '1',
    //     // tid: '54'
    //   }
    // })
  }

  statistics() {
    statistics().then((res) => {
      if (res) {
        this.setState({
          homeInfo: res.data
        })
      }
    })
  }

  getRatioFn = (day, yesterDay) => {
    const radioNum = `${Math.round(((day - yesterDay) / yesterDay) * 100)}`
    return (
      <span>
        {radioNum === 'Infinity' ? (
          '暂无'
        ) : (
          <span>
            <span>{isNaN(radioNum) ? 0 : Math.abs(Number(radioNum))}%</span>
            <span>
              {radioNum >= 0 || isNaN(radioNum) ? (
                <span className={Css.arrow} style={{ color: '#FF3300' }}>
                  <ArrowUpOutlined />
                </span>
              ) : (
                <span className={Css.arrow} style={{ color: '#00C455' }}>
                  <ArrowDownOutlined />
                </span>
              )}
            </span>
          </span>
        )}
      </span>
    )
  }

  // 查看详情
  jumpOrder(orderStatus) {
    history.push('/order/orderList', { orderStatus })
  }

  afterOrder(status, refundType, afterType) {
    history.push(
      `/order/afterSaleList?${stringify({
        status,
        refundType,
        afterType
      })}`
    )
  }

  JumpRebate() {
    // history.push({ pathname: '/operation/shareRebateList' })
    history.push('/operation/shareRebateList')
  }

  render() {
    const { homeInfo } = this.state
    return (
      <Panel content="显示主要数据及待办事项">
        <div className={Css.homePageBox}>
          <div className={Css.topBox}>
            <div className={Css.title}>待办事项</div>
            <Row className={Css.bottomBox}>
              <Col span={6}>
                <div
                  onClick={this.jumpOrder.bind(this, 2)}
                  className={Css.topSonBox}
                >
                  <div>待发货</div>
                  <div className={Css.outNumber}>
                    {formatNum(homeInfo.deliveryQuantity)}
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div
                  onClick={this.afterOrder.bind(this, 1, 1, 1)}
                  className={Css.topSonBox}
                >
                  <div>待退款订单</div>
                  <div className={Css.outNumber}>
                    {formatNum(homeInfo.refundQuantity)}
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div
                  onClick={this.afterOrder.bind(this, 1, 1, 2)}
                  className={Css.topSonBox}
                >
                  <div>待退货订单</div>
                  <div className={Css.outNumber}>
                    {formatNum(homeInfo.returnQuantity)}
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div
                  onClick={this.JumpRebate.bind(this)}
                  className={Css.topSonBox}
                >
                  <div>待返佣审核</div>
                  <div className={Css.outNumber}>
                    {formatNum(homeInfo.commissionQuantity)}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className={Css.commonTitle}>
            交易数据 <span>更新时间：{homeInfo.nowTime} </span>
          </div>
          <div className={Css.detailContent}>
            <Row justify="space-between">
              <Col span={5}>
                <div className={Css.topTitle}>
                  日支付订单
                  <Tooltip placement="top" title="支付成功订单总金额">
                    <div className={Css.rightToolBox}>i</div>
                  </Tooltip>
                </div>
                <div className={Css.numberBox}>
                  ¥{formatNum(homeInfo.dayMoneyQuantity / 100)}
                </div>
                <div className={Css.bottomNum}>
                  <span>
                    昨日 ￥{formatNum(homeInfo.yesterdayMoneyQuantity / 100)}
                  </span>
                  <span className={Css.NumRf}>
                    日同比&nbsp;
                    {this.getRatioFn(
                      homeInfo.dayMoneyQuantity,
                      homeInfo.yesterdayMoneyQuantity
                    )}
                  </span>
                </div>
              </Col>
              <Col span={5}>
                <div className={Css.topTitle}>
                  日订单数量
                  <Tooltip placement="top" title="支付成功订单总数量">
                    <div className={Css.rightToolBox}>i</div>
                  </Tooltip>
                </div>
                <div className={Css.numberBox}>
                  {formatNum(homeInfo.dayOrderQuantity)}
                </div>
                <div className={Css.bottomNum}>
                  <span>昨日 {formatNum(homeInfo.yesterdayOrderQuantity)}</span>
                  <span className={Css.NumRf}>
                    日同比&nbsp;
                    {this.getRatioFn(
                      homeInfo.dayOrderQuantity,
                      homeInfo.yesterdayOrderQuantity
                    )}
                  </span>
                </div>
              </Col>
              <Col span={5}>
                <div className={Css.topTitle}>
                  日下单人数
                  <Tooltip placement="top" title="支付成功的客户人数">
                    <div className={Css.rightToolBox}>i</div>
                  </Tooltip>
                </div>
                <div className={Css.numberBox}>
                  {formatNum(homeInfo.dayCreateOrderUserQuantity)}
                </div>
                <div className={Css.bottomNum}>
                  <span>
                    昨日 {formatNum(homeInfo.yesterdayCreateOrderUserQuantity)}
                  </span>
                  <span className={Css.NumRf}>
                    日同比&nbsp;
                    {this.getRatioFn(
                      homeInfo.dayCreateOrderUserQuantity,
                      homeInfo.yesterdayCreateOrderUserQuantity
                    )}
                  </span>
                </div>
              </Col>
              <Col span={5}>
                <div className={Css.topTitle}>
                  当日客单价
                  <Tooltip
                    placement="left"
                    title="支付成功订单金额/支付成功订单数量"
                  >
                    <div className={Css.rightToolBox}>i</div>
                  </Tooltip>
                </div>
                <div className={Css.numberBox}>
                  ¥{formatNum(homeInfo.dayPrice / 100)}
                </div>
                <div className={Css.bottomNum}>
                  <span>昨日 ￥{formatNum(homeInfo.yesterdayPrice / 100)}</span>
                  <span className={Css.NumRf}>
                    日同比&nbsp;
                    {this.getRatioFn(
                      homeInfo.dayPrice,
                      homeInfo.yesterdayPrice
                    )}
                  </span>
                </div>
              </Col>
            </Row>
          </div>
          {/* 客户数据 */}
          <div className={Css.commonTitle}>
            客户数据 <span>更新时间：{homeInfo.nowTime} </span>
          </div>
          <div className={Css.detailContent}>
            <Row justify="space-between">
              <Col span={5}>
                <div className={Css.topTitle}>
                  用户总数
                  <Tooltip placement="top" title="小程序累计用户">
                    <div className={Css.rightToolBox}>i</div>
                  </Tooltip>
                </div>
                <div className={Css.numberBox}>
                  {formatNum(homeInfo.memberQuantity)}
                </div>
                <div className={Css.platformBox}>
                  <div style={{ float: 'left' }}>
                    微信&nbsp;
                    <img className={Css.platformImg} src={wechat} />
                    {homeInfo.wxMemberQuantity}
                  </div>
                  <div style={{ float: 'right' }}>
                    支付宝&nbsp;
                    <img className={Css.platformImg} src={pay} />
                    {homeInfo.aliMemberQuantity}
                  </div>
                </div>
                <div className={Css.bottomNum}>
                  <span>
                    昨日 {formatNum(homeInfo.yesterdayMemberQuantity)}
                  </span>
                  <span className={Css.NumRf}>
                    日同比&nbsp;
                    {this.getRatioFn(
                      homeInfo.memberQuantity,
                      homeInfo.yesterdayMemberQuantity
                    )}
                  </span>
                </div>
              </Col>
              <Col span={5}>
                <div className={Css.topTitle}>
                  日新增用户
                  <Tooltip placement="top" title="日新增访问小程序用户">
                    <div className={Css.rightToolBox}>i</div>
                  </Tooltip>
                </div>
                <div className={Css.numberBox}>
                  {formatNum(homeInfo.newMemberQuantity)}
                </div>
                <div className={Css.platformBox}>
                  <div style={{ float: 'left' }}>
                    微信&nbsp;
                    <img className={Css.platformImg} src={wechat} />
                    {formatNum(homeInfo.wxNewMemberQuantity)}
                  </div>
                  <div style={{ float: 'right' }}>
                    支付宝&nbsp;
                    <img className={Css.platformImg} src={pay} />
                    {formatNum(homeInfo.aliNewMemberQuantity)}
                  </div>
                </div>
                <div className={Css.bottomNum}>
                  <span>
                    昨日 {formatNum(homeInfo.yesterdayNewMemberQuantity)}
                  </span>
                  <span className={Css.NumRf}>
                    日同比&nbsp;
                    {this.getRatioFn(
                      homeInfo.newMemberQuantity,
                      homeInfo.yesterdayNewMemberQuantity
                    )}
                  </span>
                </div>
              </Col>
              <Col span={5}>
                <div className={Css.topTitle}>
                  日首单人数
                  <Tooltip placement="top" title="首次下单人数">
                    <div className={Css.rightToolBox}>i</div>
                  </Tooltip>
                </div>
                <div className={Css.numberBox}>
                  {formatNum(homeInfo.dayFirstOrderQuantity)}
                </div>
                <div className={Css.platformBox}>
                  <div style={{ float: 'left' }}>
                    微信&nbsp;
                    <img className={Css.platformImg} src={wechat} />
                    {homeInfo.wxDayFirstOrderQuantity}
                  </div>
                  <div style={{ float: 'right' }}>
                    支付宝&nbsp;
                    <img className={Css.platformImg} src={pay} />
                    {homeInfo.aliDayFirstOrderQuantity}
                  </div>
                </div>
                <div className={Css.bottomNum}>
                  <span>
                    昨日 {formatNum(homeInfo.yesterdayFirstOrderQuantity)}
                  </span>
                  <span className={Css.NumRf}>
                    日同比&nbsp;
                    {this.getRatioFn(
                      homeInfo.dayFirstOrderQuantity,
                      homeInfo.yesterdayFirstOrderQuantity
                    )}
                  </span>
                </div>
              </Col>
              <Col span={5}>
                <div className={Css.topTitle}>
                  日加购客户
                  <Tooltip placement="left" title="有加入购物车的用户">
                    <div className={Css.rightToolBox}>i</div>
                  </Tooltip>
                </div>
                <div className={Css.numberBox}>
                  {formatNum(homeInfo.dayCarQuantity)}
                </div>
                <div className={Css.platformBox}>
                  <div style={{ float: 'left' }}>
                    微信&nbsp;
                    <img className={Css.platformImg} src={wechat} />
                    {formatNum(homeInfo.wxDayCarQuantity)}
                  </div>
                  <div style={{ float: 'right' }}>
                    支付宝&nbsp;
                    <img className={Css.platformImg} src={pay} />
                    {formatNum(homeInfo.aliDayCarQuantity)}
                  </div>
                </div>
                <div className={Css.bottomNum}>
                  <span>昨日 {formatNum(homeInfo.yesterdayCarQuantity)}</span>
                  <span className={Css.NumRf}>
                    日同比&nbsp;
                    {this.getRatioFn(
                      homeInfo.dayCarQuantity,
                      homeInfo.yesterdayCarQuantity
                    )}
                  </span>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Panel>
    )
    // return <PageHeaderWrapper />;
  }
}

// 每三位数字逗号间隔方法,科学计数法
function formatNum(str) {
  if (!str) {
    const zero = 0
    return zero
  }
  var str = str.toString()
  let newStr = ''
  let count = 0
  let i
  if (str.indexOf('.') == -1) {
    for (i = str.length - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newStr = `${str.charAt(i)},${newStr}`
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
    str = newStr
  } else {
    for (i = str.indexOf('.') - 1; i >= 0; i--) {
      if (count % 3 == 0 && count != 0) {
        newStr = `${str.charAt(i)},${newStr}`
      } else {
        newStr = str.charAt(i) + newStr // 逐个字符相接起来
      }
      count++
    }
    str = newStr + `${str}00`.substr(`${str}00`.indexOf('.'), 3)
  }
  return str
}

export default Workplace
