import hxm from '@/assets/images/hxm.png'
import MessageCode from '@/components/MessageCode/MessageCode'
import Panel from '@/components/Panel'
import { orderList } from '@/services/reserveOrder'
import { withRouter } from '@/utils/compatible'
import { showBut } from '@/utils/utils'
import { DownOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Radio,
  Row,
  Select,
  Table
} from 'antd'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import CanelModal from '../module/CanelModal/CanelModal'
import ChangeModal from '../module/ChangeModal/ChangeModal'
import CodeModal from '../module/CodeModal/CodeModal'
import OpenModal from '../module/OpenModal/OpenModal'
import Css from './BookingOrder.module.scss'

const { Option } = Select
const { RangePicker } = DatePicker

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 16 }
}

class BookingOrder extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      orderStatus: null,
      loading: true,
      msgShow: false,
      visible: {
        open: false,
        change: false,
        cancel: false,
        code: false
      },
      tableData: {},
      searchForm: {
        page: 1,
        pageSize: 10
      }
    }
  }
  componentDidMount() {
    this.orderList()
  }

  orderList() {
    const { searchForm } = this.state
    // const temp = JSON.stringify(searchForm);
    // const param = encryptByDES(`${temp}`);
    orderList(searchForm).then((res) => {
      if (res) {
        this.setState({
          loading: false,
          tableData: res.data
        })
      } else {
        this.setState({
          loading: false,
          tableData: {}
        })
      }
    })
  }
  submitFn(values) {
    this.setState({
      orderStatus: values.orderStatus
    })
    values.createOrderStartTime =
      values.createOrderTime && values.createOrderTime.length
        ? values.createOrderTime[0].format('YYYY-MM-DD 00:00:00')
        : null
    values.createOrderEndTime =
      values.createOrderTime && values.createOrderTime.length
        ? values.createOrderTime[1].format('YYYY-MM-DD 23:59:59')
        : null
    values.reserveStartTime =
      values.reserveTime && values.reserveTime.length
        ? values.reserveTime[0].format('YYYY-MM-DD')
        : null
    values.reserveEndTime =
      values.reserveTime && values.reserveTime.length
        ? values.reserveTime[1].format('YYYY-MM-DD')
        : null
    delete values.reserveTime
    delete values.createOrderTime
    values.buyerName = values.buyerName || null
    values.bizOrderId = values.bizOrderId ? values.bizOrderId.toString() : null
    this.setState(
      {
        loading: true,
        searchForm: {
          orderStatus,
          ...values,
          page: 1
        }
      },
      () => {
        this.orderList()
      }
    )
  }
  resetFn() {
    this.closeModalFn()
    this.setState(
      {
        loading: true,
        orderStatus: null,
        searchForm: {
          page: 1,
          pageSize: 10
        }
      },
      () => {
        this.formRef.current.resetFields()
        this.orderList()
      }
    )
  }
  orderChange(e) {
    const orderStatus = e.target.value
    this.formRef.current.setFieldsValue({
      orderStatus
    })
    this.setState(
      {
        orderStatus,
        searchForm: {
          ...this.state.searchForm,
          orderStatus
        }
      },
      () => {
        this.orderList()
      }
    )
  }
  PaginationChange(e) {
    this.setState(
      {
        loading: true,
        searchForm: {
          ...this.state.searchForm,
          page: e
        }
      },
      () => {
        this.orderList()
      }
    )
  }
  handleMenuClick(record, e) {
    const { key } = e
    this.setState({
      bizOrderId: record.bizOrderId,
      reserveTimeText: `${record.reserveTime.date} ${
        !record.reserveTime.meridiem ? '上午' : '下午'
      }`
    })
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
  }
  showCodeFn() {
    this.setState({
      visible: {
        code: true
      }
    })
  }
  closeModalFn() {
    this.setState({
      msgShow: false,
      visible: {
        code: false,
        open: false,
        change: false,
        cancel: false
      }
    })
  }
  callMsgFn() {
    this.setState({
      msgShow: true
    })
  }
  render() {
    const {
      orderStatus,
      tableData,
      loading,
      visible,
      bizOrderId,
      reserveTimeText,
      msgShow
    } = this.state
    const columns = [
      {
        title: '订单号',
        dataIndex: 'bizOrderId'
      },
      {
        title: '买家信息',
        dataIndex: 'payMessage',
        render: (text, record) => {
          return (
            <div>
              <div>{record.buyerName}</div>
              <div>用户ID:{record.buyerId}</div>
              <div>{record.buyerPhone}</div>
            </div>
          )
        }
      },
      {
        title: '服务商品',
        dataIndex: 'itemTitle',
        width: '20%'
      },
      {
        title: '预约时间',
        dataIndex: 'reserveTime',
        render: (text, record) => {
          return (
            <div>
              {`${record.reserveTime.date} ${
                !record.reserveTime.meridiem ? '上午' : '下午'
              }`}
            </div>
          )
        }
      },
      {
        title: '订单金额',
        dataIndex: 'actualAmount',
        render: (text, record) => {
          return <div>¥ {Number(text / 100).toFixed(2)}</div>
        }
      },
      {
        title: '付款方式',
        dataIndex: 'payChannel',
        render: (text, record) => {
          const payObj = {
            WXPAY: '微信',
            ALIPAY: '支付宝',
            BALANCE_PAY: '余额支付',
            POINT: '积分',
            TOSHOP: '到店支付'
          }
          return <div>{text}</div>
        }
      },
      {
        title: '预约状态',
        dataIndex: 'orderStatus',
        render: (text, record) => {
          const statusArr = ['', '预约中', '已开单', '已超时', '已取消']
          return <div>{statusArr[text]}</div>
        }
      },
      {
        title: '下单时间',
        dataIndex: 'createOrderTime'
      },
      {
        title: '操作',
        width: '15%',
        render: (text, record) => {
          const { orderStatus } = record
          const menu = (
            <Menu onClick={this.handleMenuClick.bind(this, record)}>
              {(orderStatus == 1 || orderStatus == 3) &&
              showBut('bookingorder', 'bookingorder_openOrder') ? (
                <Menu.Item key="1">
                  <a>开单</a>
                </Menu.Item>
              ) : null}
              {(orderStatus == 1 || orderStatus == 3) &&
              showBut('bookingorder', 'bookingorder_changeDate') ? (
                <Menu.Item key="2">
                  <a>改期</a>
                </Menu.Item>
              ) : null}
              {(orderStatus == 1 || orderStatus == 3) &&
              showBut('bookingorder', 'bookingorder_cancle') ? (
                <Menu.Item key="3">
                  <a>取消</a>
                </Menu.Item>
              ) : null}
            </Menu>
          )
          return (
            <div>
              {showBut('bookingorder', 'bookingorder_view') ? (
                <Link
                  to={`/bookingmanage/bookingdetail/${record.bizOrderId}`}
                  style={{ marginRight: '15px' }}
                >
                  查看
                </Link>
              ) : null}
              {orderStatus == 2 || orderStatus == 4 ? null : (
                <Dropdown overlay={menu}>
                  <a>
                    操作 <DownOutlined />
                  </a>
                </Dropdown>
              )}
            </div>
          )
        }
      }
    ]
    return (
      <div className={Css.BookingContent}>
        <div onClick={this.showCodeFn.bind(this)} className={Css.rightBtnBox}>
          <div className={Css.rightCodeBox}>
            <img src={hxm} />
          </div>
          <a>点击查看核销码</a>
        </div>
        <Panel title="预约订单" content="预约订单信息管理">
          <div className={Css.BookingOrderBox}>
            <Form
              ref={this.formRef}
              onFinish={this.submitFn.bind(this)}
              initialValues={{
                orderStatus,
                payChannel: null
              }}
            >
              <Row>
                <Col span={8}>
                  <Form.Item label="订单编号" name="bizOrderId">
                    <Input
                      style={{ width: 200 }}
                      placeholder="请输入订单编号"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="预约时间" name="reserveTime">
                    <RangePicker />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="下单时间" name="createOrderTime">
                    <RangePicker />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item label="预约状态" name="orderStatus">
                    <Select style={{ width: 200 }}>
                      <Option value={null}>全部</Option>
                      <Option value={1}>预约中</Option>
                      <Option value={2}>已开单</Option>
                      <Option value={3}>已超时</Option>
                      <Option value={4}>已取消</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="付款方式" name="payChannel">
                    <Select style={{ width: 200 }}>
                      <Option value={null}>全部</Option>
                      <Option value="BALANCE_PAY">余额支付</Option>
                      <Option value="ALIPAY">支付宝</Option>
                      <Option value="WXPAY">微信</Option>
                      <Option value="POINT">积分</Option>
                      <Option value="TOSHOP">到店支付</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="买家昵称" name="buyerName">
                    <Input
                      style={{ width: 200 }}
                      placeholder="请输入买家昵称"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={10}>
                  <Form.Item label="买家手机号" name="buyerPhone">
                    <InputNumber
                      style={{ width: 200 }}
                      placeholder="请输入买家手机号"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ marginBottom: 56 }}>
                <Button
                  style={{ marginLeft: 70 }}
                  htmlType="submit"
                  type="primary"
                >
                  筛选
                </Button>
                <Button
                  style={{ marginLeft: 10 }}
                  onClick={this.resetFn.bind(this)}
                >
                  条件重置
                </Button>
              </Row>
            </Form>
            <div>
              <div className={Css.statusBox}>
                <Radio.Group
                  value={this.state.orderStatus}
                  onChange={this.orderChange.bind(this)}
                >
                  <Radio.Button value={null}>全部订单</Radio.Button>
                  <Radio.Button value={1}>预约中</Radio.Button>
                  <Radio.Button value={2}>已开单</Radio.Button>
                  <Radio.Button value={3}>已超时</Radio.Button>
                  <Radio.Button value={4}>已取消</Radio.Button>
                </Radio.Group>
                <div style={{ float: 'right' }}>
                  {showBut('bookingorder', 'bookingorder_warning') ? (
                    <Button onClick={this.callMsgFn.bind(this)}>
                      订单提醒
                    </Button>
                  ) : null}
                </div>
              </div>

              <div style={{ marginTop: '10px' }}>
                <Table
                  loading={loading}
                  rowKey="bizOrderId"
                  dataSource={tableData && tableData.rows}
                  columns={columns}
                  pagination={{
                    current: tableData.current,
                    total: tableData.total,
                    pageSize: 10,
                    onChange: this.PaginationChange.bind(this)
                  }}
                />
              </div>
            </div>
          </div>
          {visible.open ? (
            <OpenModal
              changeSuccess={this.resetFn.bind(this)}
              bizOrderId={bizOrderId}
              closeModal={this.closeModalFn.bind(this)}
              visible={visible.open}
            />
          ) : null}
          {visible.change ? (
            <ChangeModal
              changeSuccess={this.resetFn.bind(this)}
              reserveTimeText={reserveTimeText}
              bizOrderId={bizOrderId}
              closeModal={this.closeModalFn.bind(this)}
              visible={visible.change}
            />
          ) : null}
          {visible.cancel ? (
            <CanelModal
              changeSuccess={this.resetFn.bind(this)}
              bizOrderId={bizOrderId}
              closeModal={this.closeModalFn.bind(this)}
              visible={visible.cancel}
            />
          ) : null}
          {visible.code ? (
            <CodeModal
              closeModal={this.closeModalFn.bind(this)}
              visible={visible.code}
            />
          ) : null}
          {msgShow ? (
            <MessageCode
              closeModal={this.closeModalFn.bind(this)}
              visible={msgShow}
            />
          ) : null}
        </Panel>
      </div>
    )
  }
}
export default withRouter(BookingOrder)
