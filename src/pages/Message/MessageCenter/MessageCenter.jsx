import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Panel from '@/components/Panel';
import Css from './MessageCenter.module.scss'
import { Breadcrumb, Tabs, Pagination, message, Drawer } from 'antd'

import { messageListPage, messageDetail } from '@/services/order'

const { TabPane } = Tabs;

class MessageCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageType: 1,
      num: 4,
      listData: [],
      // 分页相关
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
        pages: 0
      },
      drawerVisible: false,
      orderDetailInfo: {

      }
    }
  }

  componentDidMount() {
    this.getOrderList()
  }

  async getOrderList() {
    const data = await messageListPage({ page: 1 })
    if (data.data) {
      data.data.rows = data.data.rows || []
      this.setState({
        listData: data.data.rows,
        page: {
          current: data.data.current,
          pageSize: data.data.pageSize,
          total: data.data.total,
        },
      }, () => {
      })
    }
  }
  async changePage(page) {
    const data = await messageListPage({ page: page })
    if (data.data) {
      data.data.rows = data.data.rows || []
      this.setState({
        listData: data.data.rows,
        page: {
          current: data.data.current,
          pageSize: data.data.pageSize,
          total: data.data.total,
        },
      }, () => {
      })
    }
  }

  async showDetail(orderId) {
    const data = await messageDetail({ bizOrderId: orderId })
    if (data.data) {
      data.data.orderList = data.data.orderList || []
      this.setState({
        orderDetailInfo: data.data
      }, () => {
        this.setState({
          drawerVisible: true
        })
      })
    }
  }

  drawerClose() {
    this.setState({
      drawerVisible: false
    })
  }

  //时间戳转化为日期
  dateConvert(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  }

  render() {
    return (
      <Panel title="通知中心" content="显示收到的订单通知">
        <div className={Css.messageCenter}>
          <div className={Css["message-box"]}>
            {
              this.state.listData.map((item, index) => {
                return <div style={{ cursor: 'pointer' }} className={Css["message-card"] + ' ly-flex'} key={index} onClick={this.showDetail.bind(this, item.bizOrderId)}>
                  <div className={Css["card-card-title"]}>您有一笔新的订单</div>
                  <div className={Css["card-time"]}>{this.dateConvert(item.createTime)}</div>
                </div>
              })
            }
            <Pagination
              className="ly-flex ly-flex-just-end"
              style={{ marginTop: "32px", paddingBottom: '40px' }}
              defaultCurrent={1}
              total={this.state.page.total}
              current={this.state.page.current}
              pageSize={this.state.page.pageSize}
              onChange={(page) => {
                this.changePage(page)
              }}
            ></Pagination>
          </div>
          <Drawer
            title="详情信息"
            width="400px"
            placement="right"
            onClose={this.drawerClose.bind(this)}
            visible={this.state.drawerVisible}
          >
            <div>
              <label>订单编号： {this.state.orderDetailInfo.orderNo || ""}</label><br />
              <label>订单状态： {this.state.orderDetailInfo.status === 0 ? '不可见' : this.state.orderDetailInfo.status === 1 ? '已创建' : this.state.orderDetailInfo.status === 2 ? '已付款，待发货' : this.state.orderDetailInfo.status === 3 ? '已发货，待确认收货' : this.state.orderDetailInfo.status === 4 ? '交易成功' : this.state.orderDetailInfo.status === 5 ? '交易关闭' : this.state.orderDetailInfo.status === 6 ? '已评价' : '无效数据'}</label><br />
              <label>订单类型： {this.state.orderDetailInfo.freightType === 2 ? '即时配送' : this.state.orderDetailInfo.freightType === 1 ? '物流配送' : '无数据'}</label><br />
              <label>商品金额： {(this.state.orderDetailInfo.totalAmount) / 100}</label><br />
              <label>订单运费： {(this.state.orderDetailInfo.freightAmount) / 100}</label><br />
              <label>优惠金额： {(this.state.orderDetailInfo.totalAmount + this.state.orderDetailInfo.freightAmount - this.state.orderDetailInfo.actualAmount) / 100}</label><br />
              <label>实付金额： {(this.state.orderDetailInfo.actualAmount) / 100}</label><br />
                (实付金额=商品金额+订单运费-优惠金额)<br />
              <label>付款人名称： {this.state.orderDetailInfo.buyerName || ""}</label><br />
              <label>收货地址： {this.state.orderDetailInfo.receiveAddress || ""}</label><br />
              <label>收件人姓名： {this.state.orderDetailInfo.receiveName || ""}</label><br />
              <label>联系电话： {this.state.orderDetailInfo.receivePhone || ""}</label><br />
            </div>
          </Drawer>
        </div>
      </Panel>
    )
  }
}

export default MessageCenter
