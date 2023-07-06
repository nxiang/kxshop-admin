import React, { useState, useMemo, Fragment } from 'react';
import { Steps, Table } from 'antd';
import Panel from '@/components/Panel';
import Css from './OrderDetail.module.scss';
import OrderStatus from './modules/OrderStatus/OrderStatus';
import MerchantsRefundModal from './MerchantsRefundModal';
import { orderDetailColumn } from './columns';

import { detail, deliveryWay } from '@/services/order';
import { withRouter } from '@/utils/compatible';

const { Step } = Steps;
export default withRouter(function OrderDetail(props) {
  const [data, setData] = useState({});
  const [deliveryMode, setDeliveryMode] = useState(null);
  // 主动退款弹框
  const [merchantsRefundVisible, setMerchantsRefundVisible] = useState(false);
  const [merchantsRefundId, setMerchantsRefundId] = useState(0);

  const initData = async () => {
    // eslint-disable-next-line react/destructuring-assignment
    const info = await detail({ bizOrderId: props.match.params.bizOrderId });
    await deliveryWay().then(res => {
      if (res.errorCode === '0') {
        const data = res.data.deliveryWayList && res.data.deliveryWayList.indexOf(1) !== -1 ? 1 : 2;
        setDeliveryMode(data);
      }
    });
    if (info && info.data) {
      setData(info.data);
    }
  };

  useMemo(async () => {
    initData();
  }, []);

  // 打开主动退款弹框
  const initiateMerchantsRefund = id => {
    setMerchantsRefundId(id);
    setMerchantsRefundVisible(true);
  };

  return (
    <Fragment>
      <Panel title="订单详情" content="订单详情文案">
        {data.orderStatus != 5 && (
          <div className="content" style={{ marginBottom: '24px' }}>
            <Steps
              current={data.orderStatus}
              labelPlacement="vertical"
              style={{ padding: '16px 150px' }}
            >
              <Step title="买家下单" description={data.createTime} />
              <Step title="买家付款" description={data.payTime} />
              <Step title="商家发货" description={data.sendTime} />
              <Step title="交易成功" description={data.endTime} />
            </Steps>
          </div>
        )}
        {/* 订单状态 */}
        <OrderStatus data={data} refresh={initData} deliveryMode={deliveryMode} />
        {/* 发票信息 */}
        {data.invoice && (
          <div className="content" style={{ marginTop: '24px' }}>
            <div className={Css.title}>发票信息</div>
            <p className={Css.msg}>
              <span className={Css.label}>发票抬头：</span>
              {data.invoice.title}
              <span className={Css.label} style={{ marginLeft: '20px' }}>
                纳税人识别号：
              </span>
              {data.invoice.code}
            </p>
          </div>
        )}

        {/* 订单商品信息 */}
        {data.item && (
          <div className="content" style={{ marginTop: '24px' }}>
            <div className={Css.title}>
              <span>订单商品信息</span>
              <span style={{ float: 'right' }}>下单时间：{data.createTime}</span>
            </div>
            <Table
              rowKey={record => record.itemId}
              dataSource={data.item.list}
              columns={orderDetailColumn({ initiateMerchantsRefund })}
              bordered
              pagination={false}
            />
            <p className={Css.tableMsg}>
              订单共{data.item.quantityTotal}件商品，总计：
              <span style={{ color: '#F72633' }}>¥{data.item.actualTotal / 100}</span>(含运费
              {data.item.freightTotal / 100}元)
            </p>
          </div>
        )}
      </Panel>
      <MerchantsRefundModal
        bizOrderId={data?.bizOrderId || 0}
        selectedId={merchantsRefundId}
        visible={merchantsRefundVisible}
        onClose={() => setMerchantsRefundVisible(false)}
        onSubmint={() => {
          setMerchantsRefundVisible(false);
          initData();
        }}
      />
    </Fragment>
  );
})
