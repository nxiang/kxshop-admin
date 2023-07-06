import React from 'react';
import { Pagination, Spin,Tooltip, Empty, message, Input } from 'antd';
import { history } from '@umijs/max';
import { showBut } from '@/utils/utils';
import Css from '../OrderList.module.scss';
// 引入接口
import { modifySellerMemo } from '@/services/order';
// 引入子组件
const { TextArea } = Input;
// 配置列表展示标题
const headerItem = [
  '商品名称',
  '商品规格',
  '购买数量',
  '商品单价',
  '商家实收金额',
  '订单金额',
  '支付方式',
  '收件人',
  '买家',
  '操作',
];

export default ({
  listData,
  setListData,
  sourcePage,
  deliveryMode,
  orderListApi,
  spinning,
  setInstantVisible,
  setGoodsVisible,
  setBizOrderId,
}) => {
  const textAreaChange = (e, index) => {
    const newListData = listData;
    newListData[index].sellerMemo = e.target.value;
    setListData(newListData.slice());
  };

  const editData = index => {
    const newListData = listData;
    newListData[index].sellerMemoIs = false;
    setListData(newListData.slice());
  };

  const saveData = index => {
    if (!listData[index].sellerMemo) {
      message.warning('备注不能为空');
      return;
    }
    modifySellerMemo({
      bizOrderId: listData[index].bizOrderId,
      sellerMemo: listData[index].sellerMemo,
    }).then(res => {
      if (res?.success) {
        const newListData = listData;
        newListData[index].sellerMemoIs = true;
        setListData(newListData.slice());
      }
    });
  };

  const delivery = item => {
    setBizOrderId(item.bizOrderId);
    if (item.marketing && item.marketing.groupon.state === 1) {
      message.warning('发货失败，待成团订单不能发货');
      return;
    }
    if (deliveryMode === 1) {
      setGoodsVisible(true);
    } else if (deliveryMode === 2) {
      setInstantVisible(true);
    }
  };

  const defailsSkip = item => {
    if (item) {
      history.push(`/order/orderList/OrderDetail/${item.bizOrderId}`);
    }
  };

  const PaginantionDom = () => {
    return (
      <Pagination
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '24px',
          marginBottom: '24px',
        }}
        current={sourcePage.current}
        total={sourcePage.total}
        pageSize={sourcePage.pageSize}
        showTotal={total => `共${total}条数据`}
        showSizeChanger={false}
        showQuickJumper
        onChange={page => orderListApi(page)}
      />
    );
  };

  return (
    <div className={Css['table-box']}>
      <PaginantionDom />
      <Spin spinning={spinning}>
        <div className={Css['table-header-box']}>
          {headerItem.map(item => {
            return (
              <div key={item} className={Css['table-header-item-box']}>
                {item}
              </div>
            );
          })}
        </div>

        {listData?.length ? (
          listData.map((item, index) => {
            return (
              <div className={Css['table-item-box']} key={item?.bizOrderId}>
                <div className={Css['table-order-info-box']}>
                  <div className={Css['table-order-name']}>订单编号: {item?.bizOrderId}</div>
                  <div className={Css['table-order-time']}>下单时间: {item?.createOrderTime}</div>
                  {
                    {
                      1: (
                        <div
                          className={Css['table-order-type']}
                          style={{ color: '#FF7205', borderColor: '#FF7205' }}
                        >
                          待付款
                        </div>
                      ),
                      2: (
                        <div
                          className={Css['table-order-type']}
                          style={{ color: '#1890FF', borderColor: '#1890FF' }}
                        >
                          待发货
                        </div>
                      ),
                      3: (
                        <div
                          className={Css['table-order-type']}
                          style={{ color: '#1890FF', borderColor: '#1890FF' }}
                        >
                          已发货
                        </div>
                      ),
                      4: (
                        <div
                          className={Css['table-order-type']}
                          style={{ color: '#52C41A', borderColor: '#52C41A' }}
                        >
                          已成功
                        </div>
                      ),
                      5: <div className={Css['table-order-type']}>已取消</div>,
                      6: <div className={Css['table-order-type']}>已评价</div>,
                      false: '',
                    }[(item?.orderStatus)]
                  }
                  {
                    {
                      1: (
                        <div
                          className={Css['table-order-type']}
                          style={{ color: '#FF7205', borderColor: '#FF7205' }}
                        >
                          退款中
                        </div>
                      ),
                      2: (
                        <div
                          className={Css['table-order-type']}
                          style={{ color: '#1890FF', borderColor: '#1890FF' }}
                        >
                          退款成功
                        </div>
                      ),
                      3: (
                        <div
                          className={Css['table-order-type']}
                          style={{ color: '#1890FF', borderColor: '#1890FF' }}
                        >
                          退款关闭
                        </div>
                      ),
                      false: '',
                    }[(item?.refundStatus)]
                  }
                  {item.isInvoice > 0 && (
                    <div
                      className={Css['table-order-type']}
                      style={{ color: '#1890FF', borderColor: '#1890FF' }}
                    >
                      开票
                    </div>
                  )}
                </div>
                <div className={Css['table-order-content-box']}>
                  <div className={Css['left-content-box']}>
                    {item?.item?.list?.length &&
                      item.item.list.map((subItem, subIndex) => {
                        return (
                          <div
                            className={
                              item.item.list?.length > 1
                                ? `${Css['left-content-item-box']} ${
                                    Css['left-content-item-num-box']
                                  }`
                                : Css['left-content-item-box']
                            }
                            key={subIndex}
                          >
                            {item?.marketing && (
                              <img
                                className={Css['group-img']}
                                src="https://img.kxll.com/admin_manage/pingtuan.png"
                                alt=""
                              />
                            )}
                            <div className={Css['item-box']}>
                              <div className={Css['goods-box']}>
                                <img
                                  className={Css['goods-img']}
                                  src={subItem?.itemImgSrc}
                                  alt=""
                                />
                                <p className={Css['goods-text']}>{subItem?.itemName}</p>
                              </div>
                            </div>
                            <div className={Css['item-box']}>
                              <div
                                className={Css['item-text']}
                                dangerouslySetInnerHTML={{ __html: subItem?.skuDesc }}
                              />
                            </div>
                            <div className={Css['item-box']}>
                              <div className={Css['item-text']}>{subItem?.quantity}</div>
                            </div>
                            <div className={Css['item-box']}>
                              <div className={Css['item-text']}>
                                ¥{subItem?.price ? Number(subItem.price / 100).toFixed(2) : '0.00'}
                              </div>
                            </div>
                            <div className={Css['item-box']}>
                              <div className={`${Css['item-text']} ${Css['item-text-bold']}`}>
                                ¥
                                {item?.receiptAmount
                                  ? Number(item?.receiptAmount / 100).toFixed(2)
                                  : '0.00'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div className={Css['right-content-box']}>
                    <div className={Css['right-content-top-box']}>
                      <div className={Css['right-item-box']}>
                        <p className={Css['item-text-bold']}>
                          ¥
                          {item?.actualAmount ? Number(item.actualAmount / 100).toFixed(2) : '0.00'}
                        </p>
                        <Tooltip
                          placement="top"
                          title={`(含运费:${
                            item?.freightAmount
                              ? Number(item.freightAmount / 100).toFixed(2)
                              : '0.00'
                          }元)`}
                        >
                          <p>
                            (含运费:
                            {item?.freightAmount
                              ? Number(item.freightAmount / 100).toFixed(2)
                              : '0.00'}
                            元)
                          </p>
                        </Tooltip>
                      </div>
                      <div className={Css['right-item-box']}>
                        <p>
                          {item?.payChannel &&
                            {
                              BALANCE_PAY: '余额支付',
                              WXPAY: '微信',
                              ALIPAY: '支付宝',
                              POINT: '积分',
                            }[item.payChannel]}
                        </p>
                      </div>
                      <div className={Css['right-item-box']}>
                        <Tooltip placement="top" title={item?.receiveName}>
                          <p>{item?.receiveName}</p>
                        </Tooltip>
                        <p>{item?.receivePhone}</p>
                      </div>
                      <div className={Css['right-item-box']}>
                        <Tooltip placement="top" title={item?.buyerName + item?.buyerId}>
                          <p>{item?.buyerName}</p>
                          <p style={{ color: '#999', fontSize: 12 }}>用户ID:{item?.buyerId}</p>
                        </Tooltip>
                      </div>
                      <div className={Css['right-item-box']}>
                        {showBut('orderList', 'orderList_view') ? (
                          <p onClick={() => defailsSkip(item)}>查看详情</p>
                        ) : null}
                        {item.orderStatus == 2 && showBut('orderList', 'orderList_send') && (
                          <p onClick={() => delivery(item)}>发货</p>
                        )}
                      </div>
                    </div>
                    <div className={Css['right-content-buttom-box']}>
                      <p className={Css['right-title']}>
                        顾客备注:
                        <Tooltip placement="topLeft" title={item?.buyerMessage}>
                          <span>{item?.buyerMessage}</span>
                        </Tooltip>
                      </p>
                      <p className={Css['right-title']}>订单备注</p>
                      <TextArea
                        disabled={item.sellerMemoIs}
                        className={Css['right-textarea']}
                        value={item?.sellerMemo}
                        autoSize={{ minRows: 3, maxRows: 3 }}
                        maxLength={100}
                        onChange={e => textAreaChange(e, index)}
                      />
                      <div className={Css['right-operation']}>
                        {item.sellerMemoIs && showBut('orderList', 'orderList_edit') ? (
                          <p onClick={() => editData(index)}>编辑</p>
                        ) : (
                          <p onClick={() => saveData(index)}>保存</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <Empty />
        )}
      </Spin>
      <PaginantionDom />
    </div>
  );
};
