import React, { useState, useMemo } from 'react';
import { Steps, Table, Spin, Row, Col } from 'antd';
import Panel from '@/components/Panel';
import { detail, deliveryWay } from '@/services/order';
import Css from './OrderDetail.module.scss';
import OrderStatus from './modules/OrderStatus/OrderStatus';
import { detailScope } from './Columns';
import { useLocation } from '@/utils/compatible';

const { Step } = Steps;

export default ({
  // location: {
  //   query: { bizOrderId = '' },
  // },
}) => {
  const location = useLocation()
  const query = location.query
  const bizOrderId = query?.bizOrderId || ''
  const [data, setData] = useState({});
  const [deliveryMode, setDeliveryMode] = useState(null);
  const [spinning, setSpinning] = useState(true);

  async function initData() {
    if (!bizOrderId) return;
    const info = await detail({ bizOrderId });
    await deliveryWay().then(res => {
      if (res.errorCode === '0') {
        const data = res.data.deliveryWayList && res.data.deliveryWayList.indexOf(1) !== -1 ? 1 : 2;
        setDeliveryMode(data);
      }
    });
    setSpinning(false);
    if (info && info.data) {
      setData(info.data);
    }
  }

  useMemo(async () => {
    initData();
  }, []);

  return (
    <Panel title="订单详情" content="订单详情文案">
      <Spin spinning={spinning}>
        {data.orderStatus != 5 && (
          <div className="content" style={{ marginBottom: '24px' }}>
            <Steps
              current={
                {
                  0: 0,
                  1: 1,
                  2: 1,
                  3: 2,
                  4: 3,
                  6: 6,
                }[data.orderStatus]
              }
              labelPlacement="vertical"
              style={{ padding: '16px 150px' }}
            >
              <Step title="买家下单" description={data.createTime} />
              <Step title="买家付款" description={data.payTime} />
              <Step title="买家提货" description={data.sendTime} />
              <Step title="交易成功" description={data.endTime} />
            </Steps>
          </div>
        )}
        {/* 订单状态 */}
        <OrderStatus data={data} refresh={() => initData()} deliveryMode={deliveryMode} />
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
            <Row justify="space-between">
              <Col>
                <div className={Css.title}>订单商品信息</div>
              </Col>
              <Col>下单时间：{data.createTime}</Col>
            </Row>
            <Table
              rowKey={record => record.itemId}
              dataSource={data.item.list}
              columns={detailScope({ orderStatus: data.orderStatus })}
              bordered
              pagination={false}
            />
            <Row justify="end">
              <Col>
                <span className={Css.tableMsg}>订单共{data.itemQuantity}件商品</span>
                <br />
                <span className={Css.tableMsg}>总优惠：¥{data.promotionAmount}</span>
                <br />
                <span className={Css.tableMsg}>
                  总计：<span style={{ color: '#F72633' }}>¥{data.totalAmount / 100}</span>
                  {`(含运费${data.freightAmount / 100}元）`}
                </span>
              </Col>
            </Row>
          </div>
        )}
      </Spin>
    </Panel>
  );
};
