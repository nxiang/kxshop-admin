import React, { Component } from 'react';
import { withRouter } from '@/utils/compatible'
import Css from './StroedDetail.module.scss';
import {
  Breadcrumb,
  Button,
  Tabs,
  Modal,
  Icon,
  DatePicker,
  Select,
  Table,
  InputNumber,
} from 'antd';
import Panel from '@/components/Panel';
import { balanceDetail } from '@/services/stored';
import images80 from '@/assets/images/80px@1x.png'

const { RangePicker } = DatePicker;
const { Option } = Select;

class StroedDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      depositInfo: null,
      userInfo: {},
      orderData: null,
      refundData: null,
    };
  }
  componentDidMount() {
    let balanceDetailId = this.props.match.params.balanceDetailId;
    this.setState(
      {
        balanceDetailId,
      },
      () => {
        this.balanceDetail();
      }
    );
  }
  balanceDetail() {
    const { balanceDetailId } = this.state;
    balanceDetail({ balanceDetailId }).then(res => {
      if (res) {
        const data = res.data;
        this.setState({
          userInfo: data.vip,
        });
        if (data.deposit) {
          this.setState({
            depositInfo: data.deposit,
          });
        }
        if (data.order) {
          this.setState({
            orderData: [data.order],
          });
        }
        if (data.refund) {
          this.setState({
            refundData: [data.refund],
          });
        }
      }
    });
  }
  render() {
    const { orderData, refundData, userInfo, depositInfo } = this.state;
    const orderColumns = [
      {
        title: '订单编号',
        dataIndex: 'bizOrderId',
      },
      {
        title: '来源',
        dataIndex: 'clientName',
      },
      {
        title: '支付金额',
        dataIndex: 'actualAmount',
        render: (text, record) => {
          return <div>{(text / 100).toFixed(2)}</div>;
        },
      },
      // {
      // 	title: '交易状态',
      //     dataIndex: 'state',
      //     render: (text, record) => {
      //         const stateArr = ['不可见','已创建','已付款', '已发货','交易成功','交易关闭','已评价'];
      //         return(
      //             <div>
      //               {stateArr[text]}
      //             </div>
      //         )
      //     }
      // },
      {
        title: '下单时间',
        dataIndex: 'gmtCreated',
      },
    ];
    const refundColumns = [
      {
        title: '退款编号',
        dataIndex: 'refundSn',
      },
      {
        title: '来源',
        dataIndex: 'clientName',
      },
      {
        title: '退款金额',
        dataIndex: 'refundAmount',
        render: (text, record) => {
          return <div>{(text / 100).toFixed(2)}</div>;
        },
      },
      // {
      // 	title: '交易状态',
      //     dataIndex: 'state',
      //     render: (text, record) => {
      //         const stateArr = ["",'退款审核中','退款中','商家拒绝','已取消','退款成功'];
      //         return(
      //             <div>
      //               {stateArr[text]}
      //             </div>
      //         )
      //     }
      // },
      {
        title: '申请时间',
        dataIndex: 'gmtCreated',
      },
    ];
    let shopIconArr = null;
    let orderId = null;
    if (depositInfo) {
      shopIconArr = <span className={Css.shopIcon}>储值</span>;
      orderId = depositInfo.depositId;
    }
    if (orderData) {
      shopIconArr = <span className={Css.shopIcon}>消费</span>;
      orderId = orderData[0].bizOrderId;
    }
    if (refundData) {
      shopIconArr = <span className={Css.cbIcon}>退款</span>;
      orderId = refundData[0].refundSn;
    }

    return (
      <Panel title="查看详情">
        <div className={Css.storedDetailBox}>
          <div className={Css.detailContent}>
            <div className={Css.topTitle}>
              <span className={Css.leftId}>订单号 </span>
              <span style={{ color: '#666' }}>{orderId}</span> {shopIconArr}
            </div>
            <div className={Css.bottomBox}>
              <div>
                <p style={{ color: '#000' }}>用户信息</p>
                <div className={Css.userMsgBox}>
                  {userInfo.avatar ? (
                    <div
                      className={Css.HeaderBox}
                      style={{ backgroundImage: `url(${userInfo.avatar})` }}
                    />
                  ) : (
                    <div
                      className={Css.HeaderBox}
                      style={{
                        backgroundImage: `url(${images80})`,
                      }}
                    />
                  )}

                  <div className={Css.rightMsgBox}>
                    <ul>
                      <li>
                        <span>ID: </span>
                        {userInfo.memberId}
                      </li>
                      <li>
                        <span>昵称: </span>
                        {userInfo.nickname}
                      </li>
                      <li>
                        <span>手机号: </span>
                        {userInfo.mobile}
                      </li>
                      <li>
                        <span>真实姓名: </span>
                        {userInfo.trueName}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <div style={{ marginBottom: '17px', color: '#000' }}>订单信息</div>
                {depositInfo ? (
                  <ul className={Css.orderList}>
                    <li>
                      <span>来源： </span>
                      {depositInfo.clientName}
                    </li>
                    <li>
                      <span>时间： </span>
                      {depositInfo.gmtCreated}
                    </li>
                    <li>
                      <span>储值金额： </span>
                      {depositInfo.amount / 100}
                    </li>
                    <li>
                      <span>赠送金额： </span>
                      {depositInfo.giftAmount / 100}
                    </li>
                    <li>
                      <span>储值总额： </span>
                      {depositInfo.actualAmount / 100}
                    </li>
                  </ul>
                ) : (
                  <Table
                    rowKey="state"
                    dataSource={orderData || refundData}
                    columns={orderData ? orderColumns : refundColumns}
                    pagination={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Panel>
    );
  }
}

export default withRouter(StroedDetail);
