import Panel from '@/components/Panel'
import { orderDetail } from '@/services/reserveOrder'
import { withRouter } from '@/utils/compatible'
import { BellOutlined } from '@ant-design/icons'
import { Button, DatePicker, Select, Table } from 'antd'
import React, { Component } from 'react'
import CancelDetailModal from '../module/CancelDetailModal/CancelDetailModal'
import CanelModal from '../module/CanelModal/CanelModal'
import ChangeModal from '../module/ChangeModal/ChangeModal'
import OpenDetailModal from '../module/OpenDetailModal/OpenDetailModal'
import OpenModal from '../module/OpenModal/OpenModal'
import Css from './BookingDetail.module.scss'

const { Option } = Select
const { RangePicker } = DatePicker

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 16 }
}

class BookingDetail extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      loading: false,
      tableData: {},
      visible: {
        open: false,
        change: false,
        cancel: false,
        openDetail: false,
        cancelDetail: false
      }
    }
  }
  componentDidMount() {
    const bizOrderId = this.props.match.params.orderId
    this.setState(
      {
        bizOrderId
      },
      () => {
        this.orderDetail()
      }
    )
  }
  orderDetail() {
    const { bizOrderId } = this.state
    this.closeModalFn()
    orderDetail({ bizOrderId }).then((res) => {
      if (res) {
        const reserveTimeText = res.data.reserveTime
          ? `${res.data.reserveTime.date} ${
              !res.data.reserveTime.meridiem ? '上午' : '下午'
            }`
          : null
        this.setState({
          tableData: res.data,
          reserveTimeText
        })
      }
    })
  }
  closeModalFn() {
    this.setState({
      visible: {
        open: false,
        change: false,
        cancel: false,
        openDetail: false,
        cancelDetail: false
      }
    })
  }
  handleMenuClick(key) {
    const { orderId } = this.state
    if (key == 1) {
      this.setState({
        visible: {
          open: true
        }
      })
    }
    if (key == 2) {
      this.setState({
        visible: {
          change: true
        }
      })
    }
    if (key == 3) {
      this.setState({
        visible: {
          cancel: true
        }
      })
    }
    if (key == 4) {
      this.setState({
        visible: {
          openDetail: true
        }
      })
    }
    if (key == 5) {
      this.setState({
        visible: {
          cancelDetail: true
        }
      })
    }
  }
  render() {
    const { loading, tableData, visible, bizOrderId, reserveTimeText } =
      this.state
    const columns = [
      {
        title: '商品ID',
        dataIndex: 'itemId'
      },
      {
        title: '商品图片',
        dataIndex: 'itemImgSrc',
        render: (text, record) => {
          return (
            <div>
              <img style={{ width: 61, height: 61 }} src={text} />
            </div>
          )
        }
      },
      {
        title: '商品名称',
        dataIndex: 'itemName'
      },
      {
        title: '规格',
        dataIndex: 'skuDesc'
      },
      {
        title: '服务时长',
        dataIndex: 'attributeList',
        render: (text, record) => {
          return (
            <div>
              {record.attributeList && record.attributeList.length
                ? record.attributeList.map((item) => {
                    if (item.attrKey === '服务时长') {
                      return <span>{item.attrValue || 0}小时</span>
                    }
                    return null
                  })
                : null}
            </div>
          )
        }
      },
      {
        title: '单价',
        dataIndex: 'price',
        render: (text, record) => {
          return <div>¥{Number(text / 100).toFixed(2)}</div>
        }
      },
      {
        title: '购买数量',
        dataIndex: 'quantity'
      },
      {
        title: '实付金额',
        dataIndex: 'actualAmount',
        render: (text, record) => {
          return (
            <div>
              <span>¥{Number(text / 100).toFixed(2)}</span>
            </div>
          )
        }
      },
      {
        title: '付款方式',
        dataIndex: 'payChannel',
        render: (text, record) => {
          return <div>{tableData.payChannel}</div>
        }
      }
    ]
    return (
      <Panel title="预约订单详情" content="订单信息展示">
        <div className={Css.statusTopBox}>
          <div className={Css.leftBox}>
            <div className={Css.title}>订单状态</div>
            <div className={Css.centerBox}>
              <div>
                <div className={Css.statusTitle}>
                  {tableData.orderStatus == 1 ? '预约中' : null}
                  {tableData.orderStatus == 2 ? '已开单' : null}
                  {tableData.orderStatus == 3 ? '已超时' : null}
                  {tableData.orderStatus == 4 ? '已取消' : null}
                </div>
                <div className={Css.statusDesc}>
                  {tableData.orderStatus == 1
                    ? '买家已预约，请留意时间开单'
                    : null}
                  {tableData.orderStatus == 2
                    ? '已开单的预约订单,无法线上退款'
                    : null}
                  {tableData.orderStatus == 3 ? (
                    <span style={{ color: '#F4343F' }}>{`已超时${
                      tableData.overtime || 1
                    }天`}
                    </span>
                  ) : null}
                  {tableData.orderStatus == 4
                    ? '由于买家无法按时抵达或其他原因取消'
                    : null}
                </div>
              </div>
              {tableData.orderStatus == 1 || tableData.orderStatus == 3 ? ( // 预约中或已超时
                <div>
                  <Button
                    onClick={this.handleMenuClick.bind(this, 1)}
                    className={Css.topBtn}
                    type="primary"
                  >
                    开单
                  </Button>
                  <div className={Css.bottomBtnBox}>
                    <Button onClick={this.handleMenuClick.bind(this, 2)}>
                      改期
                    </Button>
                    <Button onClick={this.handleMenuClick.bind(this, 3)}>
                      取消
                    </Button>
                  </div>
                </div>
              ) : null}

              {tableData.orderStatus == 2 ? ( 
                // 已开单
                <div>
                  <Button
                    onClick={this.handleMenuClick.bind(this, 4)}
                    className={Css.topBtn}
                    type="primary"
                  >
                    开单详情
                  </Button>
                </div>
              ) : null}

              {tableData.orderStatus == 4 ? ( 
                // 已取消
                <div>
                  <Button
                    onClick={this.handleMenuClick.bind(this, 5)}
                    className={Css.topBtn}
                    type="primary"
                  >
                    详情
                  </Button>
                </div>
              ) : null}
            </div>
            <div className={Css.bottomMsgBox}>
              <div className={Css.msgContent}>
                <div className={Css.msgTitle}>
                  <BellOutlined />
                  <span>特别提醒</span>
                </div>
                <div style={{ color: '#666' }}>
                  {tableData.orderStatus == 1 ? '客户到店后，请尽快开单' : null}
                  {tableData.orderStatus == 2
                    ? '如买家提出售后申请,请积极与买家协商'
                    : null}
                  {tableData.orderStatus == 3
                    ? '订单已超时,请尽快联系买家'
                    : null}
                  {tableData.orderStatus == 4
                    ? '如买家提出售后申请,请积极与买家协商'
                    : null}
                </div>
              </div>
            </div>
          </div>
          <div className={Css.rightBox}>
            <div className={Css.rightRow}>
              <span className={Css.leftRow}>订单编号:</span>
              <span>{tableData.bizOrderId}</span>
            </div>
            <div className={Css.rightRow}>
              <span className={Css.leftRow}>订单时间:</span>
              <span>{tableData.createTime}</span>
            </div>
            <div className={Css.rightRow}>
              <span className={Css.leftRow}>预约时间:</span>
              {tableData.reserveTime ? (
                <span>
                  {tableData.reserveTime.date}{' '}
                  {!tableData.reserveTime.meridiem ? '上午' : '下午'}
                </span>
              ) : null}
            </div>
            <div className={Css.rightRow}>
              <span className={Css.leftRow}>商品金额:</span>
              {tableData.totalAmount ? (
                <span>¥{Number(tableData.totalAmount / 100).toFixed(2)}</span>
              ) : null}
            </div>
            <div className={Css.rightRow}>
              <span className={Css.leftRow}>优惠金额:</span>
              {tableData.promotionAmount ? (
                <span>
                  ¥{Number(tableData.promotionAmount / 100).toFixed(2)}
                </span>
              ) : (
                <span>¥0</span>
              )}
            </div>
            <div className={Css.rightRow}>
              <span className={Css.leftRow}>实付金额:</span>
              {tableData.actualAmount ? (
                <span style={{ color: '#F72633' }}>
                  ¥{Number(tableData.actualAmount / 100).toFixed(2)}
                </span>
              ) : (
                <span style={{ color: '#F72633' }}>¥0</span>
              )}
              <span> (实付金额=商品金额+订单运费-优惠金额)</span>
            </div>
            <div className={Css.rightRow}>
              <span className={Css.leftRow}>买家昵称:</span>
              <span>{tableData.buyerName}</span>
            </div>
            <div className={Css.rightRow}>
              <span className={Css.leftRow}>用户ID:</span>
              <span>{tableData.buyerId}</span>
            </div>
            <div className={Css.rightRow}>
              <span className={Css.leftRow}>买家手机号:</span>
              <span>{tableData.buyerPhone}</span>
            </div>
            <div className={Css.rightRow}>
              <span className={Css.leftRow}>买家留言:</span>
              <span>{tableData.buyerMessage}</span>
            </div>
          </div>
        </div>
        {/* 发票信息 */}
        {tableData.invoice && (
          <div className="content" style={{ marginTop: '24px' }}>
            <div className={Css.title}>发票信息</div>
            <p className={Css.msg}>
              <span className={Css.label}>发票抬头：</span>
              {tableData.invoice.title}
              <span className={Css.label} style={{ marginLeft: '20px' }}>
                纳税人识别号：
              </span>
              {tableData.invoice.code}
            </p>
          </div>
        )}
        <div className={Css.bottomBox}>
          <div className={Css.bottomTitle}>订单商品信息</div>
          <div style={{ marginTop: '10px' }}>
            <Table
              loading={loading}
              rowKey="cardId"
              dataSource={tableData && tableData.item && tableData.item.list}
              columns={columns}
            />
          </div>
        </div>
        {visible.open ? (
          <OpenModal
            changeSuccess={this.orderDetail.bind(this)}
            closeModal={this.closeModalFn.bind(this)}
            bizOrderId={bizOrderId}
            visible={visible.open}
          />
        ) : null}
        {visible.change ? (
          <ChangeModal
            reserveTimeText={reserveTimeText}
            changeSuccess={this.orderDetail.bind(this)}
            closeModal={this.closeModalFn.bind(this)}
            bizOrderId={bizOrderId}
            visible={visible.change}
          />
        ) : null}
        {visible.cancel ? (
          <CanelModal
            changeSuccess={this.orderDetail.bind(this)}
            closeModal={this.closeModalFn.bind(this)}
            bizOrderId={bizOrderId}
            visible={visible.cancel}
          />
        ) : null}
        {visible.cancelDetail ? (
          <CancelDetailModal
            tableData={tableData}
            closeModal={this.closeModalFn.bind(this)}
            visible={visible.cancelDetail}
          />
        ) : null}
        {visible.openDetail && tableData ? (
          <OpenDetailModal
            tableData={tableData}
            closeModal={this.closeModalFn.bind(this)}
            visible={visible.openDetail}
          />
        ) : null}
      </Panel>
    )
  }
}
export default withRouter(BookingDetail)
