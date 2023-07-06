import React, { useState, useMemo } from 'react';
import // Button,
// message,
'antd';
import { BellOutlined } from '@ant-design/icons';
import Css from './OrderStatus.module.scss';
import InstantDelivery from '@/components/InstantDelivery/InstantDelivery';
import GoodsShipments from '@/components/GoodsShipments/GoodsShipments';
import InstantLogistics from './modules/InstantLogistics/InstantLogistics';
import { logistics } from '@/services/order';

const grouponState = ['拼团-未成团', '拼团-待成团', '拼团-已成团', '拼团-成团失败'];

export default function OrderStatus(props) {
  const [status, setStatus] = useState({});
  const [instantVisible, setInstantVisible] = useState(false);
  const [goodsVisible, setGoodsVisible] = useState(false);
  const [instantLogVisible, setInstantLogVisible] = useState(false);
  const [logisticsData, setLogisticsData] = useState(null); // 普通物流展示最新物流信息
  const {
    data,
    refresh,
    //  deliveryMode
  } = props;
  useMemo(async () => {
    const newStatus = {};
    switch (data.orderStatus) {
      case 0:
        newStatus.name = '不可见';
        // newStatus.msg = '不可见';
        break;
      case 1:
        newStatus.name = '待付款';
        newStatus.msg = '如买家未在规定时间内付款（1小时内未付款），订单将会自动取消';
        newStatus.bell = (
          <p className={Css.bellMsg}>请等待买家付款后，订单状态变更为“待提货”后再进行发货</p>
        );

        break;
      case 3:
        newStatus.name = '待提货';
        newStatus.msg = '买家已付款，请尽快发货；如已发货，等待用户取货后，交易成功';
        newStatus.bell = <p className={Css.bellMsg}>请等待买家取货后，订单状态变更为”已成功“</p>;
        // if (data.refundStatus === 1) {
        //   newStatus.msg = (
        //     <span>
        //       买家发起了<span style={{ color: '#F72633' }}>售后申请</span>
        //       ，无法发货，请先前往售后管理处理本次售后申请
        //     </span>
        //   );
        // } else {
        //   newStatus.btn = (
        //     <div>
        //       <Button type="primary" onClick={() => release()}>
        //         发货
        //       </Button>
        //     </div>
        //   );
        //   if (data.deliveryWay == 2) {
        //     newStatus.btn = (
        //       <div>
        //         <Button type="primary" onClick={() => release()}>
        //           发货
        //         </Button>
        //         <Button style={{ marginLeft: '8px' }} onClick={() => stamp()}>
        //           打印小票
        //         </Button>
        //       </div>
        //     );
        //   }
        // }
        break;
      // case 4:
      //   newStatus.name = '已发货';
      //   newStatus.msg = '您已发货，等待用户确认收货后，交易成功';
      //   newStatus.bell = <p className={Css.bellMsg}>如发现物流信息有误，请及时修改物流信息</p>;
      //   // if (data.deliveryWay != 2) {
      //   //   newStatus.btn = (
      //   //     <div>
      //   //       <Button type="primary" onClick={setInstantLogVisible}>
      //   //         查看物流
      //   //       </Button>
      //   //       {data.deliveryWay === 1 && (
      //   //         <Button type="primary" style={{ marginLeft: '8px' }} onClick={() => release()}>
      //   //           修改物流
      //   //         </Button>
      //   //       )}
      //   //     </div>
      //   //   );
      //   // }
      //   break;
      case 4:
        newStatus.name = '已成功';
        newStatus.msg = '交易成功后，买家仍可发起售后申请，请在售后管理内留意订单售后状态';
        newStatus.bell = (
          <p className={Css.bellMsg}>如买家提出售后申请，请积极与买家协商，做好售后服务</p>
        );
        // if (data.deliveryWay != 2) {
        //   newStatus.btn = (
        //     <div>
        //       <Button type="primary" onClick={setInstantLogVisible}>
        //         查看物流
        //       </Button>
        //     </div>
        //   );
        // }
        break;
      case 5:
        newStatus.name = '交易关闭';
        newStatus.msg = '该订单超时未支付或售后成功，订单已被取消';
        newStatus.bell = (
          <p className={Css.bellMsg}>如买家提出售后申请，请积极与买家协商，做好售后服务</p>
        );
        break;
      case 6:
        newStatus.name = '已评价';
        // newStatus.msg = '已评价';
        break;
      default:
    }
    setStatus(newStatus);
    if (data.deliveryWay == 1) {
      const info = await logistics({ bizOrderId: data.bizOrderId });
      if (info && info.data && info.data.expressList) {
        if (info.data.expressList.length > 0) {
          const res = info.data.expressList[0];
          setLogisticsData(
            <div className={Css.logisticsBox}>
              <span style={{ color: '#F72633' }}>物流最新信息：</span>
              {res.context}
            </div>
          );
        }
      } else {
        setLogisticsData(
          <div className={Css.logisticsBox}>
            <span style={{ color: '#F72633' }}>物流最新信息：</span>
            暂无信息
          </div>
        );
      }
    }
  }, [data]);

  // 发货
  // 订单类型 1-快递，2-即时配送
  // function release() {
  //   console.log(deliveryMode);
  //   if (deliveryMode === 1) {
  //     setGoodsVisible(true);
  //   } else if (deliveryMode === 2) {
  //     setInstantVisible(true);
  //   }
  // }

  // 打印
  // function stamp() {
  //   tradePrint(data.bizOrderId).then(res => {
  //     if (res.success) {
  //       message.success('打印成功');
  //     }
  //   });
  // }

  return (
    <div className={Css.box}>
      <div className={Css.leftBox}>
        <div className={Css.title}>订单状态</div>
        <div className={Css.stateBox}>
          <div className={Css.state}>{status.name}</div>
          <div style={{ margin: '12px auto' }}>{status.msg}</div>
          {status.btn}
          {logisticsData}
          {data.exceptedDeliveryTime ? (
            <div className={Css.stateTime}>预约配送时间: {data.exceptedDeliveryTime}</div>
          ) : null}
        </div>
        <div className={Css.bellBox}>
          <p className={Css.bellTitle}>
            <BellOutlined />
            特别提醒
          </p>
          {status.bell}
        </div>
      </div>
      <div className={Css.rightBox}>
        <p>
          <span>订单编号：</span>
          {data.bizOrderId}
        </p>
        <p>
          <span>实付金额：</span>
          <span style={{ color: '#F72633' }}>{data.actualAmount / 100}</span>{' '}
          (实付金额=商品金额+订单运费-优惠金额)
        </p>
        <p>
          <span>支付方式：</span>
          {
            {
              BALANCE_PAY: '余额支付',
              WXPAY: '微信',
              ALIPAY: '支付宝',
            }[data.payChannel]
          }
        </p>
        <p>
          <span>支付时间：</span>
          {data.payTime}
        </p>
        <p>
          <span>获取积分：</span>
          {data?.presentPoints > 0 ? `+${data.presentPoints}` : 0}
        </p>
        <p>
          <span>自提点名称：</span>
          {data.communityGroupOrderExt?.pickUpName}
        </p>
        <p>
          <span>自提点地址：</span>
          {data.communityGroupOrderExt?.pickUpAddress}
        </p>
        <p>
          <span>团长手机号：</span>
          {data.communityGroupOrderExt?.majorPhone}
        </p>
        <p>
          <span>提货人姓名：</span>
          {data.communityGroupOrderExt?.receiverName}
        </p>
        <p>
          <span>联系电话：</span>
          {data.communityGroupOrderExt?.receiverPhone}
        </p>
        <p>
          <span>订单备注：</span>
          {data.buyerMessage}
        </p>
        <p>
          <span>活动信息：</span>
          {data.marketing && data.marketing.marketingType === 'GROUPON'
            ? grouponState[data.marketing.groupon.state]
            : null}
          {data.marketing && data.marketing.groupon.state === 9 ? '拼团失败' : null}
        </p>
      </div>
      {/* 即时发货弹框 */}
      {instantVisible && (
        <InstantDelivery
          orderId={data.bizOrderId}
          visible={instantVisible}
          setVisible={setInstantVisible}
          refresh={refresh}
        />
      )}
      {/* 商品发货弹框 */}
      {goodsVisible && (
        <GoodsShipments
          orderId={data.bizOrderId}
          visible={goodsVisible}
          setVisible={setGoodsVisible}
          type={data.orderStatus === 2}
          refresh={refresh}
        />
      )}
      {/* 物流弹框 */}
      {instantLogVisible && (
        <InstantLogistics
          orderId={data.bizOrderId}
          deliveryWay={data.deliveryWay}
          visible={instantLogVisible}
          setVisible={setInstantLogVisible}
        />
      )}
    </div>
  );
}
